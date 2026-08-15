import { siteConfig } from "@/config/site";

/**
 * Builds a wa.me deep link that opens WhatsApp with a pre-filled message.
 * This is the only checkout mechanism in Maavitram — there is no payment
 * gateway or online cart processing.
 */
export function buildWhatsAppLink(
  message: string,
  phoneNumber: string = siteConfig.whatsappNumber,
): string {
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}
