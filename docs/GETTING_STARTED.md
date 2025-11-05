# Getting Started with NeuroPulse

> Quick start guide for NeuroPulse - AI-powered Jira integration and daily summary service

## Installation

### Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher
- TypeScript 4.8+ (for development)
- Access to Jira instance
- Slack workspace with bot permissions

### Install NeuroPulse

```bash
# Clone the repository
git clone https://github.com/juspay/NeuroPulse
cd NeuroPulse

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### For Development

```bash
# Install development dependencies
npm install --include=dev

# Start in development mode
npm run dev
```

## Configuration

### Environment Setup

Create a `.env` file with the following configuration:

```env
# Jira Configuration
JIRA_DOMAIN=your-company.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your_jira_api_token
JIRA_PROJECT_KEY=PROJ

# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_CHANNEL_ID=C1234567890

# AI Service Configuration
OPENAI_API_KEY=your_openai_api_key
AI_MODEL=gpt-4

# Application Configuration
NODE_ENV=development
LOG_LEVEL=info
PORT=3000

# Scheduler Configuration
DAILY_SUMMARY_CRON=0 9 * * 1-5
TIMEZONE=Asia/Kolkata
```

### Jira Setup

1. Go to your Jira account settings
2. Create an API token: Account Settings → Security → API tokens
3. Note your Jira domain and email
4. Add these to your `.env` file

### Slack Setup

1. Create a Slack app in your workspace
2. Add OAuth scopes: `chat:write`, `channels:read`
3. Install the app to your workspace
4. Copy the Bot User OAuth Token to `.env`

## Quick Start

### Basic Usage

```typescript
import { DailySummaryApp } from './src/dailySummaryApp';

// Initialize the application
const app = new DailySummaryApp();

// Start the service
await app.start();

// Generate daily summary manually
await app.generateDailySummary();
```

### Running the Application

```bash
# Start the application
npm start

# Start with file watching (development)
npm run dev

# Run daily summary once
npm run summary

# Test Jira connection
npm run test:jira

# Check system health
npm run health-check
```

### Development Commands

```bash
# Type checking
npm run type-check

# Build for production
npm run build

# Run linting
npm run lint

# Format code
npm run format

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Examples

### Example 1: Manual Daily Summary

```typescript
import { JiraService } from './src/services/jiraService';
import { AIService } from './src/services/aiService';
import { SlackService } from './src/services/slackService';

async function generateSummary() {
  try {
    // Fetch Jira issues
    const jiraService = new JiraService();
    const issues = await jiraService.getProjectIssues('PROJ');

    // Generate AI summary
    const aiService = new AIService();
    const summary = await aiService.generateDailySummary(issues);

    // Send to Slack
    const slackService = new SlackService();
    await slackService.sendDailySummary('#dev-updates', summary);

    console.log('Daily summary sent successfully!');
  } catch (error) {
    console.error('Error generating summary:', error);
  }
}

generateSummary();
```

### Example 2: Scheduled Service

```typescript
import { SchedulerService } from './src/services/schedulerService';

// Start scheduled daily summaries
const scheduler = new SchedulerService();

// Schedule for 9 AM on weekdays
scheduler.scheduleDailySummary('0 9 * * 1-5');

// Schedule for custom intervals
scheduler.scheduleTask('project-health-check', '0 12 * * *', async () => {
  // Custom health check logic
});
```

### Example 3: Custom AI Analysis

```typescript
import { AIService } from './src/services/aiService';

const aiService = new AIService();

// Analyze specific issues
const analysis = await aiService.analyzeIssues(issues, {
  focusAreas: ['blockers', 'high-priority', 'overdue'],
  includeRecommendations: true,
  detailLevel: 'comprehensive'
});

console.log('AI Analysis:', analysis);
```

## Running in Production

### Docker Deployment

```bash
# Build Docker image
docker build -t neuropulse:latest .

# Run container
docker run -d \
  --name neuropulse \
  --env-file .env \
  -p 3000:3000 \
  neuropulse:latest
```

### Environment Variables for Production

```env
NODE_ENV=production
LOG_LEVEL=error
ENABLE_METRICS=true
HEALTH_CHECK_ENDPOINT=/health
```

## Next Steps

- Read the [API Documentation](./API.md)
- Explore the `neurolink-demo/` folder for advanced examples
- Set up monitoring and logging
- Configure backup strategies for critical data

## Troubleshooting

### Common Issues

**Error: Jira authentication failed**
- Verify your JIRA_EMAIL and JIRA_API_TOKEN
- Check if your API token has the required permissions
- Ensure JIRA_DOMAIN is correct (without https://)

**Error: Slack message not sent**
- Verify SLACK_BOT_TOKEN is valid
- Check if the bot has permissions for the target channel
- Ensure SLACK_CHANNEL_ID is correct

**Error: AI service timeout**
- Check your OPENAI_API_KEY
- Verify network connectivity
- Consider increasing timeout values

**Error: TypeScript compilation failed**
- Run `npm run type-check` to see detailed errors
- Ensure all dependencies are installed
- Check TypeScript version compatibility

### Performance Optimization

```bash
# Monitor memory usage
npm run monitor

# Profile application performance
npm run profile

# Optimize bundle size
npm run analyze
```

### Getting Help

- Check the [API Documentation](./API.md)
- Review [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)
- Open an [issue](https://github.com/juspay/NeuroPulse/issues)
- Contact support: opensource@juspay.in

## Development Workflow

1. **Setup**: Clone repository and configure environment
2. **Development**: Use `npm run dev` for hot-reloading
3. **Testing**: Run `npm test` before committing
4. **Building**: Use `npm run build` for production builds
5. **Deployment**: Deploy using Docker or your preferred platform

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for development guidelines and contribution process.
