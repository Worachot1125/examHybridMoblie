import { Schema, model, InferSchemaType } from 'mongoose';


const userSchema = new Schema(
{
name: { type: String, required: true, trim: true },
email: { type: String, required: true, trim: true, lowercase: true, unique: true },
// เก็บเฉพาะแฮช และซ่อนไม่ให้ query ปกติดึงออกมา
passwordHash: { type: String, required: true, select: false },
role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
},
{ timestamps: true, collection: 'user' }
);


export type UserDoc = InferSchemaType<typeof userSchema> & { _id: string };
export const User = model('User', userSchema);