"use server";

import { createPreorder } from "@/features/orders/lib/create-preorder";
import { preorderInputSchema } from "@/schemas/order";

export interface PreorderActionState {
  /** Message to show against the whole form. */
  error?: string;
  /** Field-level messages, keyed by input name. */
  fieldErrors?: Partial<Record<"variantId" | "quantity" | "name" | "phone" | "email", string>>;
  /** Set once the reservation is stored — flips the modal to its success state. */
  reserved?: boolean;
}

/**
 * Storefront preorder submission. Re-validates everything server-side:
 * the modal validates too, but that's a convenience for the customer,
 * not a control — this action is reachable directly.
 */
export async function submitPreorder(
  _prevState: PreorderActionState,
  formData: FormData,
): Promise<PreorderActionState> {
  const parsed = preorderInputSchema.safeParse({
    variantId: formData.get("variantId"),
    quantity: Number(formData.get("quantity")),
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    const fieldErrors: PreorderActionState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !(field in fieldErrors)) {
        fieldErrors[field as keyof typeof fieldErrors] = issue.message;
      }
    }
    return { fieldErrors };
  }

  try {
    await createPreorder(parsed.data);
  } catch (error) {
    console.error("[preorder] failed to reserve:", error);
    return {
      error:
        "We couldn't save your reservation just now. Please try again in a moment.",
    };
  }

  return { reserved: true };
}
