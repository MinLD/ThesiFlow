import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { env } from "../src/config/env";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.systemInfo.upsert({
    where: { key: "foundation_phase" },
    update: {
      value: "phase_1",
      status: "active"
    },
    create: {
      key: "foundation_phase",
      value: "phase_1",
      status: "active"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
