import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is missing in environment.");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const productsData = [
  {
    name: "Camellia & Jojoba Melting Cleansing Balm",
    category: "Cleansers",
    productType: "ORGANIC",
    skinType: "NORMAL",
    price: 28.00,
    stock: 50,
    imageUrl: "https://plus.unsplash.com/premium_photo-1750860247667-32aef8a96f05?q=80&w=706&auto=format&fit=crop",
    description: "Nourishing cleansing balm that dissolves makeup and impurities while preserving hydration."
  },
  {
    name: "Wild Rose & Aloe Hydrating Gel Cleanser",
    category: "Cleansers",
    productType: "ORGANIC",
    skinType: "NORMAL",
    price: 22.00,
    stock: 55,
    imageUrl: "https://plus.unsplash.com/premium_photo-1752485892600-46b977a8072a?q=80&w=784&auto=format&fit=crop",
    description: "Gentle pH-balanced gel cleanser infused with organic wild rose and soothing aloe vera."
  },
  {
    name: "2% Salicylic Acid Clarifying Foaming Wash",
    category: "Cleansers",
    productType: "FORMULATED",
    skinType: "OILY",
    price: 24.00,
    stock: 45,
    imageUrl: "https://plus.unsplash.com/premium_photo-1715604348374-eef445b6efb0?q=80&w=687&auto=format&fit=crop",
    description: "Deep-cleaning foaming cleanser targeting breakouts and unclogging pores."
  },
  {
    name: "Amino Acid Gentle Purifying Cleanser",
    category: "Cleansers",
    productType: "ORGANIC",
    skinType: "NORMAL",
    price: 24.00,
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop",
    description: "Ultra-gentle barrier wash that leaves skin fresh and hydrated."
  },
  {
    name: "Centella Asiatica & Green Tea Calming Mist",
    category: "Toners & Mists",
    productType: "ORGANIC",
    skinType: "SENSITIVE",
    price: 26.00,
    stock: 40,
    imageUrl: "https://plus.unsplash.com/premium_photo-1764335936706-e39f4142b010?q=80&w=1074&auto=format&fit=crop",
    description: "Refreshing botanical face mist that cools skin and reduces redness."
  },
  {
    name: "Bulgarian Rose Hydrosol Balancing Essence",
    category: "Toners & Mists",
    productType: "ORGANIC",
    skinType: "NORMAL",
    price: 32.00,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1675438621427-0c86ddc4d2f3?q=80&w=687&auto=format&fit=crop",
    description: "Pure distilled rose hydrosol for balanced, soft, and glowing complexion."
  },
  {
    name: "5% Glycolic + PHA Resurfacing Glow Toner",
    category: "Toners & Mists",
    productType: "FORMULATED",
    skinType: "COMBINATION",
    price: 28.00,
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1670201202886-20cb6b2701a0?q=80&w=687&auto=format&fit=crop",
    description: "Exfoliating acid toner to gently remove dead skin cells and refine texture."
  },
  {
    name: "Multi-Molecular Hyaluronic Deep Infusion Essence",
    category: "Toners & Mists",
    productType: "ORGANIC",
    skinType: "DRY",
    price: 34.00,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1677511255825-78533743b356?q=80&w=880&auto=format&fit=crop",
    description: "Multi-depth hydration essence delivering plump, bouncy skin."
  },
  {
    name: "Kakadu Plum 15% Vitamin C Radiance Elixir",
    category: "Serums",
    productType: "ORGANIC",
    skinType: "NORMAL",
    price: 42.00,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1772023042063-ef4ae9bc6d39?q=80&w=880&auto=format&fit=crop",
    description: "High-potency antioxidant serum to brighten skin and fade dark spots."
  },
  {
    name: "Blue Tansy Calming Night Repair Serum",
    category: "Serums",
    productType: "ORGANIC",
    skinType: "SENSITIVE",
    price: 46.00,
    stock: 25,
    imageUrl: "https://plus.unsplash.com/premium_photo-1775947810690-5217c95c067b?q=80&w=1170&auto=format&fit=crop",
    description: "Soothing night treatment oil-serum targeting irritation and compromised barriers."
  },
  {
    name: "10% Niacinamide + 1% Zinc Pore Clarifying Serum",
    category: "Serums",
    productType: "FORMULATED",
    skinType: "OILY",
    price: 29.00,
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1642162229036-cc0617ea36fc?q=80&w=627&auto=format&fit=crop",
    description: "Balances sebum production and minimizes enlarged pores."
  },
  {
    name: "Copper Peptide Multi-Firming Matrix Elixir",
    category: "Serums",
    productType: "ORGANIC",
    skinType: "NORMAL",
    price: 48.00,
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1778409762668-cf893875d611?q=80&w=952&auto=format&fit=crop",
    description: "Advanced peptide matrix to boost elasticity and restore skin firmness."
  },
  {
    name: "Fermented Peptide Serum",
    category: "Serums",
    productType: "ORGANIC",
    skinType: "NORMAL",
    price: 34.00,
    stock: 45,
    imageUrl: "https://plus.unsplash.com/premium_photo-1669735913041-aec1c91330a6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fHBlcHRpZGUlMjBzZXJ1bXxlbnwwfHwwfHx8MA%3D%3D",
    description: "Bio-fermented active serum that deeply nourishes and smooths fine lines."
  },
  {
    name: "Shea & Squalane Deep Barrier Moisture Cream",
    category: "Moisturizers",
    productType: "ORGANIC",
    skinType: "DRY",
    price: 36.00,
    stock: 35,
    imageUrl: "https://plus.unsplash.com/premium_photo-1764346829774-5c144f1469bd?q=80&w=732&auto=format&fit=crop",
    description: "Rich restorative moisture cream locking in hydration for dry skin."
  },
  {
    name: "Sea Kelp & Snow Mushroom Ultra-Light Water Cream",
    category: "Moisturizers",
    productType: "ORGANIC",
    skinType: "OILY",
    price: 35.00,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1666291252311-f4b981256ffe?q=80&w=764&auto=format&fit=crop",
    description: "Weightless water-gel cream providing cooling all-day hydration."
  },
  {
    name: "5-Ceramide Lipid Complex Defense Cream",
    category: "Moisturizers",
    productType: "ORGANIC",
    skinType: "NORMAL",
    price: 38.00,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1764694071508-e4b1efcd39bc?q=80&w=764&auto=format&fit=crop",
    description: "5 essential ceramides to repair and fortify weakened skin barriers."
  },
  {
    name: "Centella Cica B5 Recovery Soothing Gel-Cream",
    category: "Moisturizers",
    productType: "ORGANIC",
    skinType: "SENSITIVE",
    price: 30.00,
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1770717984643-2a1545902579?w=500&auto=format&fit=crop&q=60",
    description: "Instant calming gel-cream for stressed, irritated, and acne-prone skin."
  },
  {
    name: "100% Pure Cold-Pressed Rosehip Seed Botanical Oil",
    category: "Facial Oils",
    productType: "ORGANIC",
    skinType: "DRY",
    price: 32.00,
    stock: 30,
    imageUrl: "https://plus.unsplash.com/premium_photo-1764599123093-859e089f585f?q=80&w=687&auto=format&fit=crop",
    description: "Cold-pressed botanical elixir rich in vitamins A and C for skin regeneration."
  },
  {
    name: "Golden Marula & Evening Primrose Glow Oil",
    category: "Facial Oils",
    productType: "ORGANIC",
    skinType: "NORMAL",
    price: 44.00,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1637524725461-bff1afdb946e?q=80&w=1185&auto=format&fit=crop",
    description: "Fast-absorbing luxury facial oil providing intense luminosity."
  },
  {
    name: "Bio-Retinoid Squalane Active Restorative Oil",
    category: "Facial Oils",
    productType: "ORGANIC",
    skinType: "COMBINATION",
    price: 45.00,
    stock: 30,
    imageUrl: "https://plus.unsplash.com/premium_photo-1661445028970-80e9ee083355?q=80&w=1170&auto=format&fit=crop",
    description: "Gentle natural retinoid alternative for overnight cell renewal."
  },
  {
    name: "Botanical Lipid Barrier Replenishing Oil",
    category: "Facial Oils",
    productType: "ORGANIC",
    skinType: "DRY",
    price: 39.00,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1614859232869-72d3b926b3dc?w=500&auto=format&fit=crop&q=60",
    description: "Biomimetic botanical lipid complex reinforcing moisture retention."
  },
  {
    name: "Green Coffee & Cucumber De-Puffing Eye Gel",
    category: "Eye Care",
    productType: "ORGANIC",
    skinType: "NORMAL",
    price: 26.00,
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1688380344979-20e6fb38db74?w=500&auto=format&fit=crop&q=60",
    description: "Cooling eye gel formulated to reduce under-eye puffiness and awaken tired eyes."
  },
  {
    name: "Prickly Pear & Hibiscus Firming Eye Cream",
    category: "Eye Care",
    productType: "ORGANIC",
    skinType: "NORMAL",
    price: 34.00,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1646683872419-d5a50258d4d9?w=500&auto=format&fit=crop&q=60",
    description: "Botanical peptides to tighten fine lines around delicate eye contours."
  },
  {
    name: "Triple Peptide Dark Circle Complex",
    category: "Eye Care",
    productType: "FORMULATED",
    skinType: "NORMAL",
    price: 38.00,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1695989599169-f9c157b8743e?w=500&auto=format&fit=crop&q=60",
    description: "Targets discoloration and dark shadows for a refreshed, wide-awake look."
  },
  {
    name: "Encapsulated Retinal Youth Contour Eye Balm",
    category: "Eye Care",
    productType: "FORMULATED",
    skinType: "NORMAL",
    price: 42.00,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1671575192248-5d8e42f18a9c?w=500&auto=format&fit=crop&q=60",
    description: "Time-release retinal eye balm designed for smoothing crow's feet."
  },
  {
    name: "Non-Nano Zinc Oxide & Squalane Mineral SPF 50",
    category: "Sun Care",
    productType: "ORGANIC",
    skinType: "SENSITIVE",
    price: 32.00,
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1598662957563-ee4965d4d72c?w=500&auto=format&fit=crop&q=60",
    description: "100% mineral sunscreen providing complete broad-spectrum UV protection."
  },
  {
    name: "Sheer Raspberry Seed Antioxidant Daily SPF 30",
    category: "Sun Care",
    productType: "ORGANIC",
    skinType: "NORMAL",
    price: 28.00,
    stock: 45,
    imageUrl: "https://plus.unsplash.com/premium_photo-1716631285494-8f6522e48d83?q=80&w=735&auto=format&fit=crop",
    description: "Ultra-sheer antioxidant sunscreen protecting against pollution and UV rays."
  },
  {
    name: "Invisible Daily UV Fluid SPF 50+ PA++++",
    category: "Sun Care",
    productType: "FORMULATED",
    skinType: "COMBINATION",
    price: 30.00,
    stock: 60,
    imageUrl: "https://plus.unsplash.com/premium_photo-1783427249450-1f5b5779cfb7?w=500&auto=format&fit=crop&q=60",
    description: "Ultra-light, invisible daily sunscreen fluid leaving zero white cast."
  },
  {
    name: "Centella Calming Water Sun Gel SPF 50",
    category: "Sun Care",
    productType: "ORGANIC",
    skinType: "NORMAL",
    price: 29.00,
    stock: 55,
    imageUrl: "https://images.unsplash.com/photo-1596980846062-81a524d170ee?w=500&auto=format&fit=crop&q=60",
    description: "Hydrating water-gel sunscreen infused with calming centella extract."
  },
  {
    name: "Papaya Enzyme & Willow Bark Radiance Polish",
    category: "Exfoliators & Peels",
    productType: "ORGANIC",
    skinType: "NORMAL",
    price: 27.00,
    stock: 40,
    imageUrl: "https://plus.unsplash.com/premium_photo-1682535210542-21dceae4530c?w=500&auto=format&fit=crop&q=60",
    description: "Gentle natural enzyme scrub that exfoliates dead surface cells."
  },
  {
    name: "Organic Bamboo & Jojoba Facial Exfoliating Paste",
    category: "Exfoliators & Peels",
    productType: "ORGANIC",
    skinType: "COMBINATION",
    price: 25.00,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1627435600376-3135aa112b47?w=500&auto=format&fit=crop&q=60",
    description: "Gentle physical exfoliator using micro bamboo particles and jojoba beads."
  },
  {
    name: "10% AHA + 2% BHA Multi-Acid Resurfacing Peel",
    category: "Exfoliators & Peels",
    productType: "FORMULATED",
    skinType: "OILY",
    price: 36.00,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1600482418127-22010d6be219?w=500&auto=format&fit=crop&q=60",
    description: "Potent at-home multi-acid peel clarifying texture and congested pores."
  },
  {
    name: "5% Lactic Acid + Hyaluronic Overnight Micro-Peel",
    category: "Exfoliators & Peels",
    productType: "ORGANIC",
    skinType: "DRY",
    price: 34.00,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1625753784137-d4965dfe5e73?w=500&auto=format&fit=crop&q=60",
    description: "Gentle overnight lactic peel smoothing skin while hydrating deeply."
  },
  {
    name: "French Green Clay & Matcha Detoxifying Pore Mask",
    category: "Masks",
    productType: "ORGANIC",
    skinType: "OILY",
    price: 31.00,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1677919630957-1c27eb4d96b4?w=500&auto=format&fit=crop&q=60",
    description: "Mineral clay mask that draws out toxins and purifies congested skin."
  },
  {
    name: "Australian Pink Clay Brightening & Soothing Paste",
    category: "Masks",
    productType: "ORGANIC",
    skinType: "SENSITIVE",
    price: 33.00,
    stock: 40,
    imageUrl: "https://plus.unsplash.com/premium_photo-1716626439900-73b09f089d98?w=500&auto=format&fit=crop&q=60",
    description: "Gentle pink clay mask that calms sensitivity and restores healthy radiance."
  },
  {
    name: "Volcanic Ash & 2% BHA Deep Clarifying Treatment",
    category: "Masks",
    productType: "FORMULATED",
    skinType: "OILY",
    price: 35.00,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1516815989420-9cb5ef0fce78?w=500&auto=format&fit=crop&q=60",
    description: "Intensive clarifying pore treatment for blackhead and oil control."
  }
];

async function main() {
  console.log("Cleaning stale categories and products from DB...");
  await prisma.product.updateMany({
    data: { isDeleted: true },
  });
  await prisma.category.updateMany({
    data: { isDeleted: true },
  });
  console.log("Stale items marked as deleted.");

  console.log("Upserting categories and products...");
  const categoryCache: Record<string, string> = {};

  for (const item of productsData) {
    let categoryId = categoryCache[item.category];
    if (!categoryId) {
      const dbCat = await prisma.category.upsert({
        where: { name: item.category },
        update: { isDeleted: false },
        create: { name: item.category },
      });
      categoryId = dbCat.id;
      categoryCache[item.category] = categoryId;
    }

    let dbProd = await prisma.product.findFirst({
      where: { name: item.name },
    });

    const prodData = {
      name: item.name,
      description: item.description,
      price: item.price,
      stock: item.stock,
      image: item.imageUrl,
      categoryId: categoryId,
      skinType: item.skinType as any,
      targetAudience: "ALL",
      productType: item.productType as any,
      isDeleted: false,
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
  }

  console.log("Verifying Ultimate 4-Step Barrier & Radiance Ritual package...");
  const pkgName = "Ultimate 4-Step Barrier & Radiance Ritual";
  const pkgDescription = "A curated daily 4-step ritual combining a gentle cleanser, fermented peptide serum, ceramide cream, and mineral SPF 50 shield for deeply nourished and protected skin.";
  const pkgPrice = 94.00;
  const pkgImage = "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop";

  const routineProductNames = [
    "Amino Acid Gentle Purifying Cleanser",
    "Fermented Peptide Serum",
    "5-Ceramide Lipid Complex Defense Cream",
    "Non-Nano Zinc Oxide & Squalane Mineral SPF 50"
  ];

  const dbRoutineProducts = [];
  for (const name of routineProductNames) {
    const p = await prisma.product.findFirst({
      where: { name, isDeleted: false }
    });
    if (p) {
      dbRoutineProducts.push(p);
    }
  }

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
  console.log("Database catalog seeding finished successfully!");
}

main().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
