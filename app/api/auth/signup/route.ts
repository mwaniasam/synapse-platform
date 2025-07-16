import { type NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/data'; // Fixed import path

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    // Create user in database
    const newUser = await createUser({ name, email, password }); // Pass object

    return NextResponse.json(
      { message: 'User created successfully', user: { id: newUser.id, email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}