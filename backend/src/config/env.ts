import dotenv from 'dotenv';
dotenv.config();


const required = (name: string, fallback?: string) => {
const v = process.env[name] ?? fallback;
if (!v) throw new Error(`Missing env ${name}`);
return v;
};


export const env = {
NODE_ENV: process.env.NODE_ENV ?? 'development',
PORT: Number(process.env.PORT ?? 8000),
MONGODB_URI: required('ENV_MONGODB_URI'),
CORS_ORIGINS: (process.env.CORS_ORIGINS ?? '*')
.split(',')
.map((s: string) => s.trim())
.filter(Boolean),
JWT_SECRET: required('JWT_SECRET'),
JWT_EXPIRES: required('JWT_EXPIRES'),
};