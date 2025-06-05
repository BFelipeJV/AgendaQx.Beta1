import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_PATH = path.join(process.cwd(), 'data', 'users.json');
const AUTH_TOKEN = process.env.API_TOKEN || 'secret-token';

async function readUsers(): Promise<any[]> {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(data || '[]');
  } catch {
    return [];
  }
}

async function writeUsers(users: any[]) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2));
}

function authorized(req: NextRequest): boolean {
  const header = req.headers.get('authorization');
  return header === `Bearer ${AUTH_TOKEN}`;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const users = await readUsers();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const newUser = await req.json();
  const users = await readUsers();
  if (!newUser.id) newUser.id = uuidv4();
  users.push(newUser);
  await writeUsers(users);
  return NextResponse.json(newUser, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const updated = await req.json();
  const users = await readUsers();
  const idx = users.findIndex(u => u.id === updated.id);
  if (idx === -1) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  users[idx] = updated;
  await writeUsers(users);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  const users = await readUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  const removed = users.splice(idx, 1)[0];
  await writeUsers(users);
  return NextResponse.json(removed);
}
