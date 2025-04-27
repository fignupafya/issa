import mongoose from 'mongoose';

const readingSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  soilMoisture: {
    type: Number,
    required: true,
  },
  farmAreaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FarmArea',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Reading || mongoose.model('Reading', readingSchema); 