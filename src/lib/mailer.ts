import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { z } from "zod";

/**
 * SMTP transport for transactional mail.
 *
 * Deliberately *not* validated in `@/lib/env`: that module is imported by
 * `@/lib/db`, so a missing SMTP value there would throw on every request
 * and take the whole site down over a feature only the password-reset
 * flow uses. Parsing here, on first send, keeps the blast radius to that
 * one flow — and surfaces a precise error instead of a generic SMTP
 * failure.
 */
const smtpSchema = z.object({
  SMTP_HOST: z.string().min(1, "SMTP_HOST is required — see .env.example"),
  SMTP_PORT: z.coerce
    .number()
    .int()
    .positive("SMTP_PORT must be a port number — see .env.example"),
  SMTP_USER: z.string().min(1, "SMTP_USER is required — see .env.example"),
  SMTP_PASSWORD: z
    .string()
    .min(
      1,
      "SMTP_PASSWORD is required — use a Google App Password, not your account password",
    )
    // The placeholder shipped in .env would otherwise reach Gmail and come
    // back as an opaque auth failure.
    .refine(
      (value) => !value.startsWith("<"),
      "SMTP_PASSWORD is still the placeholder in .env — paste a real Google App Password",
    ),
  MAIL_FROM: z.email("MAIL_FROM must be an email address — see .env.example"),
});

export type SmtpConfig = z.infer<typeof smtpSchema>;

function readSmtpConfig(): SmtpConfig {
  const parsed = smtpSchema.safeParse({
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    MAIL_FROM: process.env.MAIL_FROM,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid SMTP configuration:\n${issues}`);
  }

  return parsed.data;
}

// Reused across requests in dev, where module state survives HMR — a new
// transport (and TLS handshake) per email would be wasteful.
const globalForMailer = globalThis as unknown as {
  mailTransporter?: Transporter;
};

function getTransporter(config: SmtpConfig): Transporter {
  if (!globalForMailer.mailTransporter) {
    globalForMailer.mailTransporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      // Port 465 is implicit TLS; anything else (587) upgrades via STARTTLS.
      secure: config.SMTP_PORT === 465,
      auth: { user: config.SMTP_USER, pass: config.SMTP_PASSWORD },
      // Without these, a wrong host or a blocked port leaves the socket
      // hanging for minutes — and since sending is awaited inside a Server
      // Action, the admin just watches a spinner. Failing fast turns that
      // into a visible error instead.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }
  return globalForMailer.mailTransporter;
}

interface SendMailInput {
  to: string;
  subject: string;
  html: string;
  /** Plain-text alternative, for clients that don't render HTML. */
  text: string;
}

export async function sendMail({
  to,
  subject,
  html,
  text,
}: SendMailInput): Promise<void> {
  const config = readSmtpConfig();
  await getTransporter(config).sendMail({
    from: `"Maavitram" <${config.MAIL_FROM}>`,
    to,
    subject,
    html,
    text,
  });
}
