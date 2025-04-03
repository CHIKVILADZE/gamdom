import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { signupSchema } from '../../../shared/schema/schemas';
import prisma from '../prisma/prisma';

export const signup = async (req: Request, res: Response) => {
  try {
    const data = signupSchema.parse(req.body);
    const user = await authService.signup(data, prisma);
    res.status(201).json(user);
  } catch (error: any) {
    if (error.errors) {
      return res.status(400).json(error.errors); 
    }
    res.status(400).json({ message: error.message });
  }
}

export const signin = async (req: Request, res: Response) => {
  try {
    const { token } = await authService.signin(req.body, prisma);
    res.json({ token });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};