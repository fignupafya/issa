'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import { use } from 'react';
import capitalize from '@/lib/capitalize';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function FarmAreaDashboard({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [readings, setReadings] = useState([]);
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await fetch(`/api/farm-areas/${await params.id}/readings?timeRange=${timeRange}`);
        const data = await response.json();
        const title_response = await fetch(`/api/farm-areas/${await params.id}`);
        const title_data = await title_response.json();
        setTitle(title_data.name)
        setReadings(data);
      } catch (error) {
        console.error('Error fetching readings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchReadings();
    }
  }, [status, params, timeRange]);

  const getTimeRangeDates = () => {
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
  };

  const chartData = {
    labels: readings.map((reading) =>
      format(new Date(reading.timestamp), 'MMM d, HH:mm')
    ),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: readings.map((reading) => reading.temperature),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Humidity (%)',
        data: readings.map((reading) => reading.humidity),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Soil Moisture (%)',
        data: readings.map((reading) => reading.soilMoisture),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sensor Readings Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (status === 'loading' || loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">{capitalize(title)} Dashboard</h1>
            <div className="flex space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-800 text-white px-2 py-2 rounded-md"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">


            <div className="bg-gray-900 p-4 rounded-lg">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 