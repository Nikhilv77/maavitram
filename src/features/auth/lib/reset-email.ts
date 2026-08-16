import "server-only";
import { siteConfig } from "@/config/site";

/**
 * Password-reset email.
 *
 * Table-based with inline styles only — email clients strip <style>
 * blocks, ignore most modern CSS, and Outlook renders through Word's
 * engine, so flexbox/grid and class selectors are all off the table.
 * Palette matches globals.css: cream #fbf7ef, deep green #214e24, gold
 * #c99016.
 */

interface ResetEmailInput {
  resetUrl: string;
  /** How long the link stays valid, in minutes. */
  expiresInMinutes: number;
}

const CREAM = "#fbf7ef";
const SURFACE = "#fffdf8";
const GREEN = "#214e24";
const GOLD = "#c99016";
const FOREGROUND = "#1f271d";
const MUTED = "#686a63";

export function renderResetEmailHtml({
  resetUrl,
  expiresInMinutes,
}: ResetEmailInput): string {
  // Absolute, because an email has no page to resolve relative paths
  // against. On localhost this won't load in a real inbox — the alt text

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Reset Your Password</title>
  </head>
  <body style="margin:0;padding:0;background-color:${CREAM};">
    <!-- Preheader: shown in the inbox preview, hidden in the body. -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      Reset your Maavitram admin password. This link expires in ${expiresInMinutes} minutes.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CREAM};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background-color:${SURFACE};border-radius:16px;">
            <tr>
              <td align="center" style="padding:0 32px;">
                <p style="margin:12px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};">
                  Maavitram Admin
                </p>
                <h1 style="margin:12px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;font-weight:600;color:${GREEN};">
                  Reset Your Password
                </h1>
                <!-- Gold hairline: a table cell, since <hr> styling is unreliable. -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px auto 0 auto;">
                  <tr><td style="width:48px;height:2px;background-color:${GOLD};font-size:0;line-height:0;">&nbsp;</td></tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 32px 0 32px;">
                <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:${FOREGROUND};">
                  We received a request to reset the password for your Maavitram admin account. Click the button below to choose a new one.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:28px 32px 0 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="background-color:${GREEN};border-radius:10px;">
                      <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;color:${SURFACE};text-decoration:none;border-radius:10px;">
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 0 32px;">
                <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:${MUTED};">
                  This link expires in <strong style="color:${FOREGROUND};">${expiresInMinutes} minutes</strong> and can be used once. If you didn't request a reset, you can safely ignore this email — your password won't change.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 32px 0 32px;">
                <p style="margin:0 0 6px 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:${MUTED};">
                  If the button doesn't work, paste this into your browser:
                </p>
                <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;word-break:break-all;">
                  <a href="${resetUrl}" style="color:${GREEN};text-decoration:underline;">${resetUrl}</a>
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:28px 32px 32px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr><td style="height:1px;background-color:#e8e2d6;font-size:0;line-height:0;">&nbsp;</td></tr>
                </table>
                <p style="margin:16px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:${MUTED};text-align:center;">
                  ${siteConfig.name} — ${siteConfig.tagline}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderResetEmailText({
  resetUrl,
  expiresInMinutes,
}: ResetEmailInput): string {
  return [
    "Reset Your Password",
    "",
    "We received a request to reset the password for your Maavitram admin account.",
    "Open this link to choose a new one:",
    "",
    resetUrl,
    "",
    `This link expires in ${expiresInMinutes} minutes and can be used once.`,
    "If you didn't request a reset, you can safely ignore this email — your password won't change.",
    "",
    `${siteConfig.name} — ${siteConfig.tagline}`,
  ].join("\n");
}
