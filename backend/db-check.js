const { PrismaClient } = require('@prisma/client');

async function checkConnection() {
  const prisma = new PrismaClient();
  let retries = 5;
  while (retries > 0) {
    try {
      console.log(`Checking database connection... (${retries} retries left)`);
      await prisma.$connect();
      console.log("✅ Database is ready!");
      await prisma.$disconnect();
      process.exit(0);
    } catch (error) {
      console.error("❌ Failed to connect:", error.message);
      retries--;
      if (retries === 0) {
        console.error("FAILED: Database is not reachable after multiple attempts.");
        process.exit(1);
      }
      console.log("Waiting 3 seconds before next attempt...");
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

checkConnection();
