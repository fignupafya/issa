# Agriculture IoT Dashboard

A modern web application for monitoring agricultural IoT sensor data. Built with Next.js, MongoDB, and Chart.js.

## Features

- User authentication (login/register)
- Farm area management with unique API keys
- Real-time sensor data visualization
- Data filtering and time range selection
- Secure API endpoints for sensor data submission
- Dark theme UI

## Prerequisites

- Node.js 18+ and npm
- MongoDB Community Server

## Setup

1. **Install MongoDB**:
   - Download and install MongoDB Community Server from [MongoDB's official website](https://www.mongodb.com/try/download/community)
   - For Windows: The installer will set up MongoDB as a Windows service
   - For macOS: You can use Homebrew: `brew install mongodb-community`
   - For Linux: Follow the [official installation guide](https://www.mongodb.com/docs/manual/administration/install-on-linux/)

2. **Start MongoDB**:
   - For Windows: MongoDB should run as a Windows service automatically
   - For macOS: `brew services start mongodb-community`
   - For Linux: `sudo systemctl start mongod`

3. Clone the repository:
   ```bash
   git clone <repository-url>
   cd agriculture-iot-dashboard
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="mongodb://localhost:27017/agriculture_iot"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```
   Note: `NEXTAUTH_URL` is the URL where your application will run. For local development, use `http://localhost:3000`.

6. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## API Usage

### Sensor Data Submission

Send sensor readings to the API endpoint:

```bash
curl -X POST http://localhost:3000/api/readings \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "your-farm-area-api-key",
    "temperature": 25.5,
    "humidity": 60.0,
    "soilMoisture": 45.0
  }'
```

## Project Structure

- `/src/app` - Next.js app directory
- `/src/components` - Reusable React components
- `/src/models` - Mongoose models
- `/src/lib` - Utility functions
- `/public` - Static assets

## Technologies Used

- Next.js 14
- MongoDB with Mongoose
- NextAuth.js for authentication
- Chart.js for data visualization
- Tailwind CSS for styling

## License

MIT
