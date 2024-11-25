// Configuration management for API keys and endpoints
interface Config {
  sambaNova: {
    apiKey: string;
    baseUrl: string;
    endpoints: {
      sentiment: string;
      analysis: string;
    };
  };
}

// Load configuration from environment variables
const config: Config = {
  sambaNova: {
    apiKey: import.meta.env.VITE_SAMBANOVA_API_KEY || '',
    baseUrl: import.meta.env.VITE_SAMBANOVA_BASE_URL || 'https://api.sambanova.ai',
    endpoints: {
      sentiment: '/v1/sentiment',
      analysis: '/v1/analyze',
    },
  },
};

export const getSambanovaConfig = () => {
  if (!config.sambaNova.apiKey) {
    console.warn('SambaNova API key not configured');
  }
  return config.sambaNova;
};

export default config;