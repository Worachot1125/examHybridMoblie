import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../model/user.js';
import { env } from '../config/env.js';


const registerSchema = z.object({
name: z.string().min(1),
email: z.string().email(),
password: z.string().min(8),
});


export async function register(req: Request, res: Response, next: NextFunction) {
try {
const input = registerSchema.parse(req.body);
const passwordHash = await bcrypt.hash(input.password, 10);
const created = await User.create({ name: input.name, email: input.email, passwordHash });
res.status(201).json({ ok: true, data: { _id: created._id, name: created.name, email: created.email } });
} catch (e) { next(e); }
}


const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });


export async function login(req: Request, res: Response, next: NextFunction) {
try {
const { email, password } = loginSchema.parse(req.body);
const user = await User.findOne({ email }).select('+passwordHash');
if (!user) return res.status(401).json({ ok: false, message: 'Invalid credentials' });
const ok = await bcrypt.compare(password, (user as any).passwordHash);
if (!ok) return res.status(401).json({ ok: false, message: 'Invalid credentials' });
const token = jwt.sign({ sub: user._id, email: user.email }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES });
res.json({ ok: true, token, user: { _id: user._id, email: user.email, name: user.name } });
} catch (e) { next(e); }
}