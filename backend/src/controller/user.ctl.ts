import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { User } from '../model/user.js';
import bcrypt from 'bcryptjs';


const createUserSchema = z.object({
name: z.string().min(1),
email: z.string().email(),
password: z.string().min(8), // อย่างน้อย 8 ตัวอักษร
role: z.enum(['student', 'teacher', 'admin']).optional(),
});


export async function listUsers(_req: Request, res: Response, next: NextFunction) {
try {
const users = await User.find().lean();
res.json({ ok: true, data: users });
} catch (err) { next(err); }
}


export async function getUser(req: Request, res: Response, next: NextFunction) {
try {
const user = await User.findById(req.params.id).lean();
if (!user) return res.status(404).json({ ok: false, message: 'User not found' });
res.json({ ok: true, data: user });
} catch (err) { next(err); }
}


export async function createUser(req: Request, res: Response, next: NextFunction) {
try {
const input = createUserSchema.parse(req.body);
const passwordHash = await bcrypt.hash(input.password, 10);
const doc = await User.create({
name: input.name,
email: input.email,
passwordHash,
role: input.role ?? 'student',
});
res.status(201).json({ ok: true, data: { _id: doc._id, name: doc.name, email: doc.email, role: doc.role } });
} catch (err) { next(err); }
}


export async function updateUser(req: Request, res: Response, next: NextFunction) {
try {
const input = createUserSchema.partial().parse(req.body);
const doc = await User.findByIdAndUpdate(req.params.id, input, { new: true }).lean();
if (!doc) return res.status(404).json({ ok: false, message: 'User not found' });
res.json({ ok: true, data: doc });
} catch (err) { next(err); }
}


export async function deleteUser(req: Request, res: Response, next: NextFunction) {
try {
const doc = await User.findByIdAndDelete(req.params.id).lean();
if (!doc) return res.status(404).json({ ok: false, message: 'User not found' });
res.json({ ok: true, data: doc });
} catch (err) { next(err); }
}