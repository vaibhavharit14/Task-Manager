import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("---------------- DEBUG START ----------------");
    console.log("DATABASE_URL:", process.env.DATABASE_URL);

    try {
        await prisma.$connect();
        console.log("✅ Successfully connected to database");

        // Try to query User table to verify schema
        const count = await prisma.user.count();
        console.log("✅ User table accessible. User count:", count);

        // Try to find a dummy user to verify columns
        const user = await prisma.user.findFirst();
        console.log("✅ findFirst query successful:", user);

        console.log("SUCCESS: Database and Schema are in sync.");
    } catch (error: any) {
        console.error("❌ ERROR INSTANCE:", error.constructor.name);
        console.error("❌ ERROR MESSAGE:", error.message);
        if (error.code) console.error("❌ ERROR CODE:", error.code);
        if (error.meta) console.error("❌ ERROR META:", error.meta);
    } finally {
        await prisma.$disconnect();
        console.log("---------------- DEBUG END ----------------");
    }
}

main();
