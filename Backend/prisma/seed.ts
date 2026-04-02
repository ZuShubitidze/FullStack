import prisma from "@lib/prisma";

async function main() {
  // Replace 'user' with your actual model name
  await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Local User",
      password: "password123",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
