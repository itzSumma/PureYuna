import { PrismaClient } from "./src/generated/prisma/client";
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

async function main() {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    include: { category: true }
  });
  
  const categories = await prisma.category.findMany({
    where: { isDeleted: false }
  });

  const packages = await prisma.package.findMany({
    where: { isDeleted: false }
  });

  console.log(`=== DATABASE VERIFICATION ===`);
  console.log(`Active Categories: ${categories.length}`);
  for (const cat of categories) {
    console.log(`- ${cat.name} (${cat.id})`);
  }
  
  console.log(`\nActive Products: ${products.length}`);
  const catCounts: Record<string, number> = {};
  for (const p of products) {
    const catName = p.category.name;
    catCounts[catName] = (catCounts[catName] || 0) + 1;
  }
  for (const [name, count] of Object.entries(catCounts)) {
    console.log(`- ${name}: ${count}`);
  }

  console.log(`\nActive Packages: ${packages.length}`);
  for (const pkg of packages) {
    console.log(`- ${pkg.name} (${pkg.id})`);
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
