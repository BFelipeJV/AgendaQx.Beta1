import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');
const AUTH_TOKEN = process.env.API_TOKEN || 'secret-token';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const users = JSON.parse(await fs.readFile(USERS_PATH, 'utf8'));
  const user = users.find((u: any) => u.email === email && u.password === password);
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const token = crypto.randomBytes(16).toString('hex');
  // For simplicity, accept generated token if matches static token
  return NextResponse.json({ token });
}
