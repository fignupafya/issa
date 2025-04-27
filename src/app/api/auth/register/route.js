import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    console.log('Registration attempt for:', { name, email });

    if (!name || !email || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database successfully');

    const existingUser = await User.findOne({ email });
    console.log('Checking for existing user:', existingUser ? 'Found' : 'Not found');

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    console.log('Creating new user...');
    const user = await User.create({
      name,
      email,
      password,
    });
    console.log('User created successfully:', user._id);

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 