const { PrismaClient } = require("./src/generated/prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
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
  console.log("Seeding customer and admin accounts into database...");

  const customerPassHash = await bcrypt.hash("password123", 10);
  const adminPassHash = await bcrypt.hash("yourpassword123", 10);

  // 1. Upsert Customer
  const customer = await prisma.user.upsert({
    where: { email: "newuser@gmail.com" },
    update: {
      name: "Customer User",
      password: customerPassHash,
      role: "CUSTOMER"
    },
    create: {
      id: "8e7a1dd9-13c7-4026-9292-a76d66957cc6",
      email: "newuser@gmail.com",
      name: "Customer User",
      password: customerPassHash,
      role: "CUSTOMER"
    }
  });
  console.log(`✅ Customer seeded: ${customer.email} (ID: ${customer.id})`);

  // 2. Upsert Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {
      name: "Admin User",
      password: adminPassHash,
      role: "ADMIN"
    },
    create: {
      id: "3f635733-3ce8-41bc-be56-1ef25520985d",
      email: "admin@gmail.com",
      name: "Admin User",
      password: adminPassHash,
      role: "ADMIN"
    }
  });
  console.log(`✅ Admin seeded: ${admin.email} (ID: ${admin.id})`);

  await prisma.$disconnect();
  await pool.end();
  console.log("Database seeding completed.");
}

main().catch(err => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
