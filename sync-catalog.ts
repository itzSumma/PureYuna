import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "../Client/src/constants/fallback-data";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is missing in environment.");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Cleaning stale categories and products from DB...");
  // Mark all existing products and categories as deleted
  await prisma.product.updateMany({
    data: { isDeleted: true },
  });
  await prisma.category.updateMany({
    data: { isDeleted: true },
  });
  console.log("Stale items marked as deleted.");

  console.log("Syncing categories to DB...");
  const categoryIdMap: Record<string, string> = {};

  for (const cat of FALLBACK_CATEGORIES) {
    const dbCat = await prisma.category.upsert({
      where: { name: cat.name },
      update: { isDeleted: false },
      create: { name: cat.name },
    });
    categoryIdMap[cat.id] = dbCat.id;
    console.log(`✅ Category: ${cat.name} -> ID: ${dbCat.id}`);
  }

  console.log("Syncing products to DB...");
  const dbProducts = [];
  for (const prod of FALLBACK_PRODUCTS) {
    const dbCategoryId = categoryIdMap[prod.categoryId];
    if (!dbCategoryId) {
      console.warn(`Warning: Category not found for product ${prod.name}`);
      continue;
    }

    // Check if product exists by name to update
    let dbProd = await prisma.product.findFirst({
      where: { name: prod.name },
    });

    const prodData = {
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock || 20,
      image: prod.image || prod.images[0],
      categoryId: dbCategoryId,
      skinType: "NORMAL" as const, // default skinType in server enum
      targetAudience: prod.targetAudience || "ALL",
      productType: prod.productType as any,
      isDeleted: false, // Ensure it is un-deleted
    };

    if (dbProd) {
      dbProd = await prisma.product.update({
        where: { id: dbProd.id },
        data: prodData,
      });
      console.log(`🔄 Updated Product: ${dbProd.name} (${dbProd.id})`);
    } else {
      dbProd = await prisma.product.create({
        data: prodData,
      });
      console.log(`✨ Created Product: ${dbProd.name} (${dbProd.id})`);
    }
    dbProducts.push(dbProd);
  }

  // Also let's update our 4-step routine package using the correct seeded products!
  console.log("Updating Ultimate 4-Step Barrier & Radiance Ritual package...");
  const pkgName = "Ultimate 4-Step Barrier & Radiance Ritual";
  const pkgDescription = "A curated daily 4-step ritual combining a gentle cleanser, fermented peptide serum, ceramide cream, and mineral SPF 50 shield for deeply nourished and protected skin.";
  const pkgPrice = 94.00;
  const pkgImage = "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop";

  // Find the 4 products for the routine in the database
  const routineProductNames = [
    "Amino Acid Gentle Purifying Cleanser",
    "Fermented Peptide Serum",
    "5-Ceramide Lipid Complex Defense Cream",
    "Non-Nano Zinc Oxide & Squalane Mineral SPF 50"
  ];

  // Let's search the database products we just updated/created for matches
  const dbRoutineProducts = [];
  for (const name of routineProductNames) {
    const p = await prisma.product.findFirst({
      where: { name, isDeleted: false }
    });
    if (p) {
      dbRoutineProducts.push(p);
    }
  }

  console.log(`Found ${dbRoutineProducts.length} out of 4 products for the package in database.`);

  let pkg = await prisma.package.findFirst({
    where: { name: pkgName },
  });

  if (dbRoutineProducts.length === 4) {
    if (pkg) {
      await prisma.packageItem.deleteMany({
        where: { packageId: pkg.id },
      });

      pkg = await prisma.package.update({
        where: { id: pkg.id },
        data: {
          description: pkgDescription,
          price: pkgPrice,
          image: pkgImage,
          isDeleted: false,
          packageItems: {
            create: dbRoutineProducts.map((p) => ({
              productId: p.id,
            })),
          },
        },
      });
      console.log(`✅ Package Updated: ${pkg.name} (${pkg.id})`);
    } else {
      pkg = await prisma.package.create({
        data: {
          name: pkgName,
          description: pkgDescription,
          price: pkgPrice,
          image: pkgImage,
          packageItems: {
            create: dbRoutineProducts.map((p) => ({
              productId: p.id,
            })),
          },
        },
      });
      console.log(`✅ Package Created: ${pkg.name} (${pkg.id})`);
    }
  } else {
    console.warn("Could not find all 4 required routine products in the database to link to the package.");
  }

  await prisma.$disconnect();
  await pool.end();
  console.log("Database catalog sync finished successfully!");
}

main().catch((err) => {
  console.error("Error syncing catalog database:", err);
  process.exit(1);
});
