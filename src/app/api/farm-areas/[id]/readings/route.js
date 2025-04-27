import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import FarmArea from '@/models/FarmArea';
import Reading from '@/models/Reading';
import User from '@/models/User';
import { subDays } from 'date-fns';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '24h';

    const startDate = (() => {
      const now = new Date();
      switch (timeRange) {
        case '24h':
          return subDays(now, 1);
        case '7d':
          return subDays(now, 7);
        case '30d':
          return subDays(now, 30);
        default:
          return subDays(now, 1);
      }
    })();

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const farmArea = await FarmArea.findOne({
      _id: new mongoose.Types.ObjectId(params.id),
      userId: user._id,
    });

    if (!farmArea) {
      return NextResponse.json(
        { error: 'Farm area not found' },
        { status: 404 }
      );
    }

    const readings = await Reading.find({
      farmAreaId: new mongoose.Types.ObjectId(params.id),
      timestamp: {
        $gte: startDate,
      },
    }).sort({ timestamp: 1 });

    return NextResponse.json(readings);
  } catch (error) {
    console.error('Error fetching readings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 