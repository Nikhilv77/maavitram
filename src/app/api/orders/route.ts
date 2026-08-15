import { NextResponse } from "next/server";
import { z } from "zod";
import { checkoutInputSchema } from "@/schemas/order";
import { createOrder } from "@/features/orders/lib/create-order";
import { formatOrderMessage } from "@/features/whatsapp/lib/message";
import { buildWhatsAppLink } from "@/features/whatsapp/lib/link";
import { apiError } from "@/lib/api-response";

/**
 * V1 order flow: WhatsApp order -> create Order in the DB (here) ->
 * generate the WhatsApp URL -> the client redirects. Every successful
 * call here counts as an order — there is no separate confirmation step.
 */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = checkoutInputSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(
      "Invalid order input.",
      400,
      z.flattenError(parsed.error).fieldErrors,
    );
  }

  try {
    const order = await createOrder(parsed.data);
    const whatsappUrl = buildWhatsAppLink(formatOrderMessage(order));

    return NextResponse.json({ order, whatsappUrl }, { status: 201 });
  } catch {
    return apiError("Could not create the order.", 500);
  }
}
