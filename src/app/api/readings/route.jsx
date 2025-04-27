import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import FarmArea from '@/models/FarmArea';
import Reading from '@/models/Reading';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    const { apiKey, temperature, humidity, soilMoisture } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    await connectDB();

    const farmArea = await FarmArea.findOne({ apiKey });

    if (!farmArea) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    const reading = await Reading.create({
      temperature,
      humidity,
      soilMoisture,
      farmAreaId: farmArea._id,
    });

    return NextResponse.json(reading);
  } catch (error) {
    console.error('Error creating reading:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function GET(request) {
  
    return NextResponse.json(
      { Error: 'Method Not Allowed' },
      { status: 405 }
    );
} 