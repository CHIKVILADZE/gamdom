import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { signinSchema, signupSchema } from '@shared/schema/schemas';
import { z } from 'zod';

export const signup = async (
  data: z.infer<typeof signupSchema>,
  prisma: PrismaClient
) => {
  const { email, password, fullName } = signupSchema.parse(data);
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName,
    },
  });
  return { id: user.id, email: user.email, fullName: user.fullName };
};

export const signin = async (
  data: z.infer<typeof signinSchema>,
  prisma: PrismaClient
) => {
  const { email, password } = signinSchema.parse(data);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid password');
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
  return { token };
};
