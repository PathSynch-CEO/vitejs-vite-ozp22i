# PathManager Analytics Dashboard

PathManager is a comprehensive analytics dashboard for PathSynch, designed to provide small and medium-sized businesses (SMBs) with actionable insights from their PathConnect NFC-enabled review collection system.

## Features

- **Real-time Analytics Dashboard**
  - Track customer engagement metrics
  - Monitor review sentiment trends
  - Analyze customer feedback patterns

- **NFC Card Management**
  - Create and manage NFC review collection cards
  - Track card usage and performance
  - Generate shortened URLs for review collection

- **AI-Powered Sentiment Analysis**
  - Real-time sentiment analysis of customer feedback
  - Keyword extraction and categorization
  - Trend analysis and insights

- **Google My Business Integration**
  - Sync with GMB reviews
  - Track review metrics and ratings
  - Monitor business performance

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **AI/ML**: SambaNova Cloud APIs
- **Data Storage**: MongoDB Atlas
- **URL Shortening**: Bitly API
- **Business Reviews**: Google My Business API

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/path-synch/pathmanager.git
   cd pathmanager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_GOOGLE_API_KEY=your-google-api-key
   VITE_GMB_LOCATION_ID=your-gmb-location-id
   VITE_BITLY_ACCESS_TOKEN=your-bitly-access-token
   VITE_ENCRYPTION_KEY=your-32-character-encryption-key
   VITE_ENCRYPTION_IV=your-16-char-iv
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Setup

### Required API Keys

1. **Google API Key**
   - Create a project in Google Cloud Console
   - Enable Google My Business API
   - Generate an API key with appropriate restrictions

2. **Bitly Access Token**
   - Create a Bitly account
   - Generate an access token from your account settings

3. **SambaNova API Access**
   - Contact SambaNova for API access
   - Configure authentication credentials

### Security Best Practices

- Store API keys in environment variables
- Implement rate limiting for API calls
- Use encryption for sensitive data
- Regular security audits and updates

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── services/         # API and service integrations
├── utils/            # Utility functions
├── hooks/            # Custom React hooks
├── config/           # Configuration files
└── repositories/     # Data access layer
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@pathsynch.com or visit our [FAQ page](https://pathsynch.com/faqs).

## Security

Report security vulnerabilities to security@pathsynch.com.

## Acknowledgments

- [SambaNova](https://sambanova.ai/) for AI/ML capabilities
- [Google My Business API](https://developers.google.com/my-business) for business metrics
- [Bitly](https://bitly.com/) for URL shortening services