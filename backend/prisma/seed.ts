import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.booking.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.session.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.user.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      fullName: "Giorgi",
      email: "giorgi@example.com",
      password: await bcrypt.hash("password123", 10),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      fullName: "Interviewer",
      email: "interviewer@example.com",
      password: await bcrypt.hash("password123", 10),
    },
  });

  // Create movies
  const movie1 = await prisma.movie.create({
    data: { title: "Inception", duration: 148 },
  });
  const movie2 = await prisma.movie.create({
    data: { title: "Interstellar", duration: 169 },
  });
  const movie3 = await prisma.movie.create({
    data: { title: "The Dark Knight", duration: 152 },
  });

  // Create sessions
  const session1 = await prisma.session.create({
    data: {
      movieId: movie1.id,
      startTime: new Date("2025-04-03T20:00:00.000Z"),
      totalRows: 5,
      seatsPerRow: 8,
    },
  });

  const session2 = await prisma.session.create({
    data: {
      movieId: movie2.id,
      startTime: new Date("2025-04-04T20:00:00.000Z"),
      totalRows: 5,
      seatsPerRow: 8,
    },
  });

  const session3 = await prisma.session.create({
    data: {
      movieId: movie3.id,
      startTime: new Date("2025-04-05T20:00:00.000Z"),
      totalRows: 5,
      seatsPerRow: 8,
    },
  });

  // Generate seats
  const makeSeats = (
    sessionId: number,
    rows: number,
    perRow: number
  ): Prisma.SeatCreateManyInput[] => {
    const seats: Prisma.SeatCreateManyInput[] = [];
    for (let r = 1; r <= rows; r++) {
      for (let s = 1; s <= perRow; s++) {
        seats.push({ sessionId, row: r, seatNumber: s, status: "available" });
      }
    }
    return seats;
  };

  await prisma.seat.createMany({ data: makeSeats(session1.id, 5, 8) });
  await prisma.seat.createMany({ data: makeSeats(session2.id, 5, 8) });
  await prisma.seat.createMany({ data: makeSeats(session3.id, 5, 8) });

  // Reserve 2 seats in session2
  const session2Available = await prisma.seat.findMany({
    where: { sessionId: session2.id },
    orderBy: { id: 'asc' },
    take: 2,
  });

  const reservationExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

  const reservedBooking = await prisma.booking.create({
    data: {
      sessionId: session2.id,
      userId: user2.id,
      status: "reserved",
      reservationExpiry,
      seats: {
        connect: session2Available.map((s) => ({ id: s.id })),
      },
    },
  });

  await prisma.seat.updateMany({
    where: { id: { in: session2Available.map(s => s.id) } },
    data: { status: "reserved", bookingId: reservedBooking.id },
  });

  // Book 2 seats in session1
  const session1Available = await prisma.seat.findMany({
    where: { sessionId: session1.id },
    orderBy: { id: 'asc' },
    take: 2,
  });

  const booked = await prisma.booking.create({
    data: {
      sessionId: session1.id,
      userId: user1.id,
      status: "booked",
      seats: {
        connect: session1Available.map((s) => ({ id: s.id })),
      },
    },
  });

  await prisma.seat.updateMany({
    where: { id: { in: session1Available.map(s => s.id) } },
    data: { status: "booked", bookingId: booked.id },
  });

  console.log("Movies seeded:", movie1.title, movie2.title, movie3.title);
  console.log("Reserved seat IDs:", session2Available.map(s => s.id));
  console.log("Booked seat IDs:", session1Available.map(s => s.id));
  console.log("Reservation expiry:", reservationExpiry.toISOString());
  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
