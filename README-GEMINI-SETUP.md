# Gemini API Integration Setup

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## Environment Setup

Create a `.env.local` file in your project root:

\`\`\`env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

## Model Configuration

The application uses the `gemini-1.5-flash-latest` model, which provides:
- Faster response times
- Improved accuracy for structured data
- Better context understanding for health-related queries
- Enhanced recommendation capabilities

## Features

- **Real-time disease data** from Gemini API
- **Intelligent analysis** and pattern recognition
- **AI-powered recommendations** for health alerts
- **Automatic fallback** to cached data if API fails
- **Live data indicators** showing connection status
- **Auto-refresh** every 5 minutes
- **Error handling** with user-friendly messages

## Data Sources

The application fetches:
- Current disease statistics (cases, deaths, recovered)
- Time series data for trend analysis
- Regional distribution data
- AI-generated health insights and recommendations
- Location-specific alert recommendations

## Usage

Once configured, the application will:
1. Automatically fetch real data on page load
2. Display live vs cached data status
3. Show real-time charts and analytics
4. Provide AI-powered insights
5. Generate contextual alert recommendations
6. Handle API errors gracefully
