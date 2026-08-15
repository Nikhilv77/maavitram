import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  productSeedSchema,
  type ProductSeedInput,
} from "../src/schemas/product";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required — set it in .env (see .env.example)",
  );
}

const db = new PrismaClient({ adapter: new PrismaPg(databaseUrl) });

// The four Maavitram signature blends — names and flavour profiles match
// the brand's theme accent colours (--tez, --saumya, --achaari, --lal-tadka).
const products: ProductSeedInput[] = [
  {
    slug: "maavitram-tez",
    name: "Maavitram Tez",
    category: "blended_masalas",
    shortDescription:
      "Bold, high-heat all-purpose masala for those who like it fiery.",
    description:
      "A robust blend of roasted spices built for heat — Tez brings a sharp, fiery edge to curries, stir-fries and marinades.",
    images: ["/images/products/maavitram-tez/1.jpg"],
    tags: ["signature", "spicy"],
    isFeatured: true,
    isActive: true,
    variants: [
      {
        sku: "MAV-TEZ-100",
        label: "100 g",
        weightInGrams: 100,
        price: 99,
        stockQuantity: 50,
        isDefault: true,
      },
      {
        sku: "MAV-TEZ-250",
        label: "250 g",
        weightInGrams: 250,
        price: 219,
        stockQuantity: 25,
      },
      {
        sku: "MAV-TEZ-500",
        label: "500 g",
        weightInGrams: 500,
        price: 399,
        stockQuantity: 10,
      },
    ],
  },
  {
    slug: "maavitram-saumya",
    name: "Maavitram Saumya",
    category: "blended_masalas",
    shortDescription:
      "A gentle, aromatic all-purpose masala for everyday cooking.",
    description:
      "Saumya is a softly balanced blend — warm and fragrant without the heat — for everyday dals, sabzis and curries.",
    images: ["/images/products/maavitram-saumya/1.jpg"],
    tags: ["signature", "mild"],
    isFeatured: true,
    isActive: true,
    variants: [
      {
        sku: "MAV-SAU-100",
        label: "100 g",
        weightInGrams: 100,
        price: 95,
        stockQuantity: 48,
        isDefault: true,
      },
      {
        sku: "MAV-SAU-250",
        label: "250 g",
        weightInGrams: 250,
        price: 209,
        stockQuantity: 22,
      },
      {
        sku: "MAV-SAU-500",
        label: "500 g",
        weightInGrams: 500,
        price: 379,
        stockQuantity: 9,
      },
    ],
  },
  {
    slug: "maavitram-achaari-virasat",
    name: "Maavitram Achaari Virasat",
    category: "blended_masalas",
    shortDescription:
      "A tangy, pickle-spiced masala rooted in traditional achaari flavours.",
    description:
      "Achaari Virasat carries forward the tang of classic Indian pickle spicing — mustard, fennel and dried mango — for a heritage flavour in every dish.",
    images: ["/images/products/maavitram-achaari-virasat/1.jpg"],
    tags: ["signature", "tangy"],
    isFeatured: true,
    isActive: true,
    variants: [
      {
        sku: "MAV-ACH-100",
        label: "100 g",
        weightInGrams: 100,
        price: 109,
        stockQuantity: 30,
        isDefault: true,
      },
      {
        sku: "MAV-ACH-250",
        label: "250 g",
        weightInGrams: 250,
        price: 239,
        stockQuantity: 14,
      },
    ],
  },
  {
    slug: "maavitram-lal-tadka",
    name: "Maavitram Lal Tadka",
    category: "blended_masalas",
    shortDescription:
      "A vibrant red chilli tempering masala for a bold finishing tadka.",
    description:
      "Lal Tadka is a deep-red tempering blend built for the finishing touch — stir into hot ghee for an instant burst of colour and flavour.",
    images: ["/images/products/maavitram-lal-tadka/1.jpg"],
    tags: ["signature", "tadka"],
    isFeatured: true,
    isActive: true,
    variants: [
      {
        sku: "MAV-LAL-100",
        label: "100 g",
        weightInGrams: 100,
        price: 99,
        stockQuantity: 40,
        isDefault: true,
      },
      {
        sku: "MAV-LAL-250",
        label: "250 g",
        weightInGrams: 250,
        price: 219,
        stockQuantity: 16,
      },
    ],
  },
];

async function main() {
  for (const raw of products) {
    const product = productSeedSchema.parse(raw);

    const savedProduct = await db.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        category: product.category,
        shortDescription: product.shortDescription,
        description: product.description,
        images: product.images,
        tags: product.tags ?? [],
        isFeatured: product.isFeatured ?? false,
        isActive: product.isActive,
      },
      create: {
        slug: product.slug,
        name: product.name,
        category: product.category,
        shortDescription: product.shortDescription,
        description: product.description,
        images: product.images,
        tags: product.tags ?? [],
        isFeatured: product.isFeatured ?? false,
        isActive: product.isActive,
      },
    });

    for (const variant of product.variants) {
      const savedVariant = await db.productVariant.upsert({
        where: { sku: variant.sku },
        update: {
          productId: savedProduct.id,
          label: variant.label,
          weightInGrams: variant.weightInGrams,
          price: variant.price,
          mrp: variant.mrp,
          isDefault: variant.isDefault ?? false,
          isActive: variant.isActive,
        },
        create: {
          productId: savedProduct.id,
          sku: variant.sku,
          label: variant.label,
          weightInGrams: variant.weightInGrams,
          price: variant.price,
          mrp: variant.mrp,
          isDefault: variant.isDefault ?? false,
          isActive: variant.isActive,
        },
      });

      await db.inventory.upsert({
        where: { variantId: savedVariant.id },
        update: { stockQuantity: variant.stockQuantity },
        create: {
          variantId: savedVariant.id,
          stockQuantity: variant.stockQuantity,
        },
      });
    }

    console.log(`Seeded ${product.name} (${product.variants.length} variants)`);
  }
}

main()
  .then(() => db.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await db.$disconnect();
    process.exitCode = 1;
  });
