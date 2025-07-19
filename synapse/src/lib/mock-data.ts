// Mock data for all API endpoints

export const mockSessions = [
  {
    id: '1',
    title: 'Focused Work Session',
    startTime: new Date(Date.now() - 3600000).toISOString(),
    endTime: new Date().toISOString(),
    duration: 60,
    focusScore: 85,
    productivityScore: 90,
    notes: 'Focused on project tasks',
    tags: ['work', 'focus']
  },
  {
    id: '2',
    title: 'Morning Routine',
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() - 82800000).toISOString(),
    duration: 60,
    focusScore: 75,
    productivityScore: 80,
    notes: 'Morning planning and emails',
    tags: ['morning', 'planning']
  }
];

export const mockPreferences = {
  theme: 'dark',
  notifications: true,
  autoStartBreak: true,
  breakDuration: 5,
  workDuration: 25,
  longBreakDuration: 15,
  soundEnabled: true,
  soundVolume: 70
};

export const mockAnalytics = {
  weeklyFocus: [65, 75, 80, 72, 68, 82, 78],
  weeklyProductivity: [70, 72, 78, 75, 80, 85, 82],
  weeklySessions: [3, 4, 5, 4, 6, 5, 7],
  focusDistribution: {
    work: 45,
    study: 30,
    creative: 15,
    other: 10
  },
  productivityTrend: 'increasing',
  focusTrend: 'stable',
  lastUpdated: new Date().toISOString()
};

export const mockCognitiveState = {
  currentFocus: 78,
  currentProductivity: 82,
  lastUpdated: new Date().toISOString(),
  recommendations: [
    'Take a 5-minute break',
    'Drink some water',
    'Try deep breathing exercises'
  ]
};

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiCall = async <T>(data: T, errorRate: number = 0): Promise<{ data: T }> => {
  await delay(200 + Math.random() * 300); // Random delay between 200-500ms
  
  if (Math.random() < errorRate) {
    throw new Error('Random error occurred');
  }
  
  return { data };
};

export const mockAuth = {
  user: {
    id: 'demo-user-123',
    name: 'Demo User',
    email: 'demo@example.com',
    image: null,
    preferences: {}
  },
  token: 'demo-auth-token-123456'
};
