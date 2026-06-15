const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  // Catálogo de estados de cita
  await prisma.appointmentStatus.createMany({
    data: [
      { name: "pending" },
      { name: "confirmed" },
      { name: "cancelled" },
      { name: "completed" },
    ],
    skipDuplicates: true,
  });
  console.log("✓ AppointmentStatus insertados");

  // Catálogo de estados de notificación
  await prisma.notificationStatus.createMany({
    data: [{ name: "pending" }, { name: "sent" }, { name: "failed" }],
    skipDuplicates: true,
  });
  console.log("✓ NotificationStatus insertados");

  // Catálogo de tipos de notificación
  await prisma.notificationType.createMany({
    data: [{ name: "whatsapp" }, { name: "email" }, { name: "calendar" }],
    skipDuplicates: true,
  });
  console.log("✓ NotificationType insertados");

  console.log("Seed completado!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
