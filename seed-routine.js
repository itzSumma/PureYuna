const { PrismaClient } = require("./src/generated/prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is missing in environment.");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding categories and products...");

  // 1. Ensure categories exist
  const catNames = ["Cleansers", "Serums", "Moisturizers", "Sun Care"];
  const categories = {};
  for (const name of catNames) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: { isDeleted: false },
      create: { name },
    });
    categories[name] = cat;
    console.log(`✅ Category [${name}]: ${cat.id}`);
  }

  // 2. Create products
  const productsToSeed = [
    {
      name: "Amino Acid Gentle Purifying Cleanser",
      description: "Gentle purifying barrier cleanser to refresh and remove impurities without stripping natural hydration.",
      price: 24.00,
      stock: 50,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop",
      categoryId: categories["Cleansers"].id,
      skinType: "NORMAL",
      targetAudience: "ALL",
      productType: "ORGANIC",
    },
    {
      name: "Fermented Peptide Serum",
      description: "Bio-fermented peptide infusion that restores elasticity, firmness, and natural dewy radiance.",
      price: 34.00,
      stock: 45,
      image: "https://images.unsplash.com/photo-1620916566352-7e779a557b77?q=80&w=1000&auto=format&fit=crop",
      categoryId: categories["Serums"].id,
      skinType: "NORMAL",
      targetAudience: "ALL",
      productType: "ORGANIC",
    },
    {
      name: "5-Ceramide Deep Barrier Cream",
      description: "Deep lipid recovery moisturizer designed to lock in active hydration and repair the skin barrier.",
      price: 38.00,
      stock: 40,
      image: "https://images.unsplash.com/photo-1608248597359-2e6504a9e52c?q=80&w=1000&auto=format&fit=crop",
      categoryId: categories["Moisturizers"].id,
      skinType: "NORMAL",
      targetAudience: "ALL",
      productType: "ORGANIC",
    },
    {
      name: "Invisible Mineral Daily Shield SPF 50",
      description: "Lightweight, non-greasy physical mineral sunscreen offering broad-spectrum environmental defense.",
      price: 28.00,
      stock: 60,
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1000&auto=format&fit=crop",
      categoryId: categories["Sun Care"].id,
      skinType: "NORMAL",
      targetAudience: "ALL",
      productType: "FORMULATED",
    }
  ];

  const dbProducts = [];
  for (const prodData of productsToSeed) {
    // Check if product exists by name to avoid duplicate creations
    let prod = await prisma.product.findFirst({
      where: { name: prodData.name, isDeleted: false },
    });

    if (prod) {
      prod = await prisma.product.update({
        where: { id: prod.id },
        data: prodData,
      });
      console.log(`✅ Product Updated: ${prod.name} (${prod.id})`);
    } else {
      prod = await prisma.product.create({
        data: prodData,
      });
      console.log(`✅ Product Created: ${prod.name} (${prod.id})`);
    }
    dbProducts.push(prod);
  }

  // 3. Create Package
  const pkgName = "Ultimate 4-Step Barrier & Radiance Ritual";
  const pkgDescription = "A curated daily 4-step ritual combining a gentle cleanser, fermented peptide serum, ceramide cream, and mineral SPF 50 shield for deeply nourished and protected skin.";
  const pkgPrice = 94.00;
  const pkgImage = "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop";

  let pkg = await prisma.package.findFirst({
    where: { name: pkgName },
  });

  if (pkg) {
    // Delete existing package items to re-link
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
          create: dbProducts.map((p) => ({
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
          create: dbProducts.map((p) => ({
            productId: p.id,
          })),
        },
      },
    });
    console.log(`✅ Package Created: ${pkg.name} (${pkg.id})`);
  }

  await prisma.$disconnect();
  await pool.end();
  console.log("Database seeding finished successfully.");
}

main().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
