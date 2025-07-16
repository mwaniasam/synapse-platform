# 🧪 Synapse Learning Pro Testing Guide

## Quick Start Testing

### 1. Automated Testing
Run the automated test script:
\`\`\`bash
chmod +x scripts/test-app.sh
./scripts/test-app.sh
\`\`\`

This will:
- ✅ Check environment variables
- ✅ Install dependencies
- ✅ Generate Prisma client
- ✅ Push database schema
- ✅ Run TypeScript checks
- ✅ Run ESLint
- ✅ Build the application

### 2. Manual Testing Checklist

#### Authentication Testing
- [ ] Register new user with email/password
- [ ] Login with created credentials
- [ ] Test Google OAuth (if configured)
- [ ] Verify session persistence
- [ ] Test logout functionality

#### Core Features Testing
- [ ] AI content generation works
- [ ] Cognitive state detection activates
- [ ] Learning progress tracking
- [ ] Adaptive content delivery
- [ ] Analytics dashboard displays data

#### UI/UX Testing
- [ ] Responsive design on mobile
- [ ] Responsive design on tablet
- [ ] Responsive design on desktop
- [ ] Dark/light theme switching
- [ ] Navigation between all pages
- [ ] Form validation works
- [ ] Error messages display properly

#### Performance Testing
- [ ] Homepage loads in < 3 seconds
- [ ] Dashboard loads in < 5 seconds
- [ ] No console errors
- [ ] Smooth animations
- [ ] Memory usage reasonable

## Common Issues & Solutions

### Database Connection Issues
\`\`\`bash
# Check if DATABASE_URL is set
echo $DATABASE_URL

# Test database connection
npx prisma db push
\`\`\`

### Authentication Issues
\`\`\`bash
# Verify NextAuth configuration
echo $NEXTAUTH_SECRET
echo $NEXTAUTH_URL
\`\`\`

### AI Features Not Working
\`\`\`bash
# Check OpenAI API key
echo $OPENAI_API_KEY

# Test API endpoint
curl -X POST http://localhost:3000/api/learning/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "test", "difficulty": "beginner"}'
\`\`\`

## Error Monitoring

### Browser Console
1. Open Developer Tools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check Application tab for storage issues

### Server Logs
\`\`\`bash
# View development logs
npm run dev

# Check for specific errors
grep -i error .next/trace
\`\`\`

## Performance Testing

### Lighthouse Audit
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit for Performance, Accessibility, SEO
4. Aim for scores > 90

### Load Testing
\`\`\`bash
# Install artillery for load testing
npm install -g artillery

# Create simple load test
echo "config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: 'Homepage'
    requests:
      - get:
          url: '/'" > load-test.yml

# Run load test
artillery run load-test.yml
\`\`\`

## Deployment Testing

### Pre-deployment Checklist
- [ ] All environment variables set in production
- [ ] Database migrations completed
- [ ] Build process successful
- [ ] No critical console errors
- [ ] All API endpoints responding
- [ ] Authentication working
- [ ] SSL certificate valid

### Post-deployment Testing
- [ ] Production URL accessible
- [ ] All features working in production
- [ ] Database connections stable
- [ ] Performance acceptable
- [ ] Error monitoring active
