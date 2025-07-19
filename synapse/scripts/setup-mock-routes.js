const fs = require('fs');
const path = require('path');

// List of API routes to mock
const apiRoutes = [
  'ai-assist',
  'analytics',
  'auth/[...nextauth]',
  'cognitve-state',
  'debug/env',
  'env-test',
  'preferences',
  'sessions',
  'sessions/[id]'
];

// Get the mock route template
const mockTemplatePath = path.join(process.cwd(), 'src/app/api/mock-route.ts');

// Read the template
let template = fs.readFileSync(mockTemplatePath, 'utf8');

// Create or update mock routes
apiRoutes.forEach(route => {
  const routePath = path.join(process.cwd(), 'src/app/api', route, 'route.ts');
  const routeDir = path.dirname(routePath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  
  // Update the path in the template
  const routeSpecificTemplate = template
    .replace(/\/api\/route/g, `/api/${route}`);
  
  // Write the route file
  fs.writeFileSync(routePath, routeSpecificTemplate);
  console.log(`✅ Created/Updated mock route: ${routePath}`);
});

console.log('\n🎉 All API routes have been mocked successfully!');
