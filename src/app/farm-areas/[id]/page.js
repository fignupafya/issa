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
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedMetrics, setSelectedMetrics] = useState(['temperature', 'humidity', 'soilMoisture']);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await fetch(`/api/farm-areas/${params.id}/readings?timeRange=${timeRange}`);
        const data = await response.json();
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
  }, [status, params.id, timeRange]);

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
        hidden: !selectedMetrics.includes('temperature'),
      },
      {
        label: 'Humidity (%)',
        data: readings.map((reading) => reading.humidity),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        hidden: !selectedMetrics.includes('humidity'),
      },
      {
        label: 'Soil Moisture (%)',
        data: readings.map((reading) => reading.soilMoisture),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        hidden: !selectedMetrics.includes('soilMoisture'),
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Farm Area Dashboard</h1>
            <div className="flex space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-md"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex space-x-4 mb-6">
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes('temperature')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMetrics([...selectedMetrics, 'temperature']);
                    } else {
                      setSelectedMetrics(selectedMetrics.filter((m) => m !== 'temperature'));
                    }
                  }}
                  className="mr-2"
                />
                Temperature
              </label>
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes('humidity')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMetrics([...selectedMetrics, 'humidity']);
                    } else {
                      setSelectedMetrics(selectedMetrics.filter((m) => m !== 'humidity'));
                    }
                  }}
                  className="mr-2"
                />
                Humidity
              </label>
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes('soilMoisture')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMetrics([...selectedMetrics, 'soilMoisture']);
                    } else {
                      setSelectedMetrics(selectedMetrics.filter((m) => m !== 'soilMoisture'));
                    }
                  }}
                  className="mr-2"
                />
                Soil Moisture
              </label>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 