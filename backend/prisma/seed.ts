import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.booking.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.session.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.user.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      email: "Giorgi@example.com",
      password: "password123", 
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "Johny@example.com",
      password: "password456",
    },
  });

  const movie1 = await prisma.movie.create({
    data: {
      title: "The Hobbit",
      duration: 136,
    },
  });

  const movie2 = await prisma.movie.create({
    data: {
      title: "Inception",
      duration: 148,
    },
  });

  const session1 = await prisma.session.create({
    data: {
      movieId: movie1.id,
      startTime: new Date("2025-04-02T19:00:00Z"),
      totalRows: 5,
      seatsPerRow: 10,
    },
  });

  const session2 = await prisma.session.create({
    data: {
      movieId: movie2.id,
      startTime: new Date("2025-04-02T21:00:00Z"),
      totalRows: 3,
      seatsPerRow: 8,
    },
  });

  const seats1 = [];
  for (let row = 1; row <= session1.totalRows; row++) {
    for (let seatNum = 1; seatNum <= session1.seatsPerRow; seatNum++) {
      seats1.push({
        sessionId: session1.id,
        row,
        seatNumber: seatNum,
        status: "available",
      });
    }
  }
  await prisma.seat.createMany({ data: seats1 });

  const seats2 = [];
  for (let row = 1; row <= session2.totalRows; row++) {
    for (let seatNum = 1; seatNum <= session2.seatsPerRow; seatNum++) {
      seats2.push({
        sessionId: session2.id,
        row,
        seatNumber: seatNum,
        status: "available",
      });
    }
  }
  await prisma.seat.createMany({ data: seats2 });

  const session1Seats = await prisma.seat.findMany({
    where: { sessionId: session1.id },
    take: 2, 
  });

  await prisma.booking.create({
    data: {
      sessionId: session1.id,
      userId: user1.id,
      status: "booked",
      seats: {
        connect: session1Seats.map((seat) => ({ id: seat.id })),
      },
      reservationExpiry: null, 
    },
  });

  const session2Seats = await prisma.seat.findMany({
    where: { sessionId: session2.id },
    take: 1, 
  });

  await prisma.booking.create({
    data: {
      sessionId: session2.id,
      userId: user2.id,
      status: "reserved",
      seats: {
        connect: session2Seats.map((seat) => ({ id: seat.id })),
      },
      reservationExpiry: new Date(Date.now() + 2 * 60 * 1000),
    },
  });

  await prisma.seat.updateMany({
    where: { id: { in: session1Seats.map((s) => s.id) } },
    data: { status: "booked" },
  });

  await prisma.seat.updateMany({
    where: { id: { in: session2Seats.map((s) => s.id) } },
    data: { status: "reserved" },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });