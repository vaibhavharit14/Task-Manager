const { PrismaClient } = require('@prisma/client');

async function checkConnection() {
  const prisma = new PrismaClient();
  let retries = 5;
  
  console.log("--- DB DEBUG INFO ---");
  console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
  if (process.env.DATABASE_URL) {
      const url = new URL(process.env.DATABASE_URL.replace('postgres://', 'http://')); // simple parse
      console.log("DB Host:", url.host);
      console.log("DB Name:", url.pathname);
  }
  console.log("---------------------");

  while (retries > 0) {
    try {
      console.log(`Checking database connection... (${retries} retries left)`);
      await prisma.$connect();
      console.log("✅ Database is ready!");
      
      // Simple query to verify
      const result = await prisma.$queryRaw`SELECT 1`;
      console.log("✅ Query successful:", result);
      
      await prisma.$disconnect();
      process.exit(0);
    } catch (error) {
      console.error("❌ CONNECTION ERROR:");
      console.error("Message:", error.message);
      if (error.code) console.error("Code:", error.code);
      if (error.meta) console.error("Meta:", JSON.stringify(error.meta));
      
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
