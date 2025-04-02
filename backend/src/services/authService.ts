import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1)
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signup = async (data: z.infer<typeof signupSchema>) => {
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

export const signin = async (data: z.infer<typeof signinSchema>) => {
  const { email, password } = signinSchema.parse(data);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid password');
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  return { token };
};