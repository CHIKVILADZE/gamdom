import { Request, Response } from 'express';
import * as sessionService from '../services/sessionService';

export const createSession = async (req: Request, res: Response) => {
  try {
    const session = await sessionService.createSession(req.body);
    res.status(201).json(session);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getSessions = async (req: Request, res: Response) => {
  try {
    const sessions = await sessionService.getSessions();
    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSessionById = async (req: Request, res: Response) : Promise<any>=> {
  try {
    const id = parseInt(req.params.id);
    const session = await sessionService.getSessionById(id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};