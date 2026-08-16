/**
 * Display formatting for order fields. Pure functions, no server-only
 * import — the admin tables render these on the server, but nothing here
 * touches the database.
 */

/**
 * `9876543210` -> `+91 98765 43210`.
 *
 * Numbers are stored as the bare 10 digits the checkout schema validates
 * (`/^[6-9]\d{9}$/` in @/schemas/order), so the country code lives here
 * in the display layer rather than in the data.
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "").slice(-10);
  if (digits.length !== 10) return phone;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

/** `tel:` href for the same number — makes it tappable on mobile. */
export function phoneHref(phone: string): string {
  const digits = phone.replace(/\D/g, "").slice(-10);
  return `tel:+91${digits}`;
}
