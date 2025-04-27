import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import FarmArea from '@/models/FarmArea';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    const session = await getServerSession();
    console.log('Session in GET /api/farm-areas:', session);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database successfully');

    const user = await User.findOne({ email: session.user.email });
    console.log('Found user:', user?._id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Fetching farm areas for user:', user._id);
    const farmAreas = await FarmArea.find({ userId: user._id })
      .select('_id name apiKey createdAt')
      .lean();
    console.log('Found farm areas:', farmAreas);

    return NextResponse.json(farmAreas);
  } catch (error) {
    console.error('Error fetching farm areas:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    console.log('Session in POST /api/farm-areas:', session);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name } = await request.json();
    console.log('Creating farm area with name:', name);

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database successfully');

    const user = await User.findOne({ email: session.user.email });
    console.log('Found user:', user?._id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate a random API key
    const apiKey = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    console.log('Generated API key:', apiKey);

    console.log('Creating farm area with userId:', user._id);
    const farmArea = await FarmArea.create({
      name,
      apiKey,
      userId: user._id,
    });
    console.log('Farm area created successfully:', farmArea._id);

    return NextResponse.json({
      _id: farmArea._id,
      name: farmArea.name,
      apiKey: farmArea.apiKey,
      createdAt: farmArea.createdAt,
    });
  } catch (error) {
    console.error('Error creating farm area:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 