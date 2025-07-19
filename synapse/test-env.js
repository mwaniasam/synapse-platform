// Simple test to check environment variables
console.log('Environment Variables Test');
console.log('-------------------------');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'Not set');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '*** (set but hidden) ***' : 'Not set');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '*** (set) ***' : 'Not set');
