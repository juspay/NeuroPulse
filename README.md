# 🧠 NeuroPulse

**AI-Powered Jira Integration and Daily Summary System**

NeuroPulse is Juspay's intelligent automation system that streamlines project management workflows by connecting Jira, AI analysis, and Slack communication. It automatically generates comprehensive daily summaries, tracks project health, and delivers actionable insights directly to your team channels.

## ✨ Features

### 🎯 **Intelligent Daily Summaries**
- **AI-Powered Analysis**: OpenAI GPT-4 processes Jira data for intelligent insights
- **Automated Scheduling**: Configurable cron-based daily summaries (default: 9 AM weekdays)
- **Rich Formatting**: Slack Block Kit formatting with clickable links and structured content
- **Multi-Project Support**: Handle multiple Jira projects with independent configurations

### 🔗 **Comprehensive Integrations**
- **Jira REST API**: Real-time issue tracking, project metadata, and status monitoring
- **Slack Web API**: Automated message posting with rich formatting and channel management
- **OpenAI Integration**: Advanced AI summarization with technical context awareness
- **Scheduler Service**: Flexible cron-based automation with timezone support

### 🧠 **Smart Project Management**
- **Blocker Detection**: AI identifies critical issues and impediments requiring attention
- **Priority Analysis**: Intelligent categorization of high-priority tasks and deadlines
- **Trend Identification**: Pattern recognition for project health and team productivity
- **Custom Templates**: Configurable summary formats for different team needs

## 🚀 Quick Start

### Prerequisites
- **Node.js 18.x LTS** or higher
- **npm 8.0+** or equivalent package manager
- **TypeScript 4.8+** (for development)
- **Jira Account** with API token access
- **Slack Workspace** with bot permissions
- **OpenAI Account** with API key access

### Installation

1. **Clone the NeuroPulse repository**
   ```bash
   git clone https://github.com/Swetha-160303/NeuroPulse.git
   cd NeuroPulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Jira, Slack, and OpenAI credentials
   ```

4. **Build and start the application**
   ```bash
   npm run build
   npm start
   ```

## 🧪 Development & Testing

### Available Commands

```bash
# Development Commands
npm run dev           # Quick TypeScript development test
npm run build         # Compile TypeScript to JavaScript
npm run type-check    # TypeScript type checking without compilation

# Testing Commands
npm test              # Build and run immediate daily summary
npm run test:jira     # Test Jira API connection only
npm run test:ts       # TypeScript immediate summary test

# Production Commands
npm start             # Start the scheduler (requires build)
npm run start:ts      # Start with TypeScript (development)

# Code Quality
npm run lint          # ESLint code checking
npm run format        # Prettier code formatting
npm run format:check  # Check code formatting
```

### 🔷 TypeScript Development Workflow

NeuroPulse is built with **TypeScript** for type safety and enhanced development experience:

**Development Cycle:**
```bash
# 1. Quick development testing
npm run dev

# 2. Type checking
npm run type-check

# 3. Code quality
npm run lint && npm run format

# 4. Production build
npm run build

# 5. Production test
npm start
```

### Step-by-Step Setup Process

1. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Configure the following in .env:
   # - JIRA_DOMAIN, JIRA_EMAIL, JIRA_API_TOKEN
   # - SLACK_BOT_TOKEN, SLACK_CHANNEL_ID
   # - OPENAI_API_KEY
   ```

2. **Dependency Installation**
   ```bash
   npm install
   ```

3. **Jira Connection Verification**
   ```bash
   npm run test:jira
   ```
   Expected: ✅ Jira authentication successful with project data

4. **Complete System Test**
   ```bash
   npm test
   ```
   Expected: ✅ Daily summary generated and posted to Slack

5. **Production Deployment**
   ```bash
   npm run build && npm start
   ```
   System runs continuously with scheduled daily summaries

### Troubleshooting

**❌ Jira connection issues?**
```bash
npm run test:jira
# Verify JIRA_DOMAIN, JIRA_EMAIL, JIRA_API_TOKEN in .env
```

**❌ Slack delivery failing?**
- Ensure bot has `chat:write` and `channels:read` permissions
- Verify SLACK_BOT_TOKEN and SLACK_CHANNEL_ID are correct
- Check if bot is added to the target channel

**❌ AI generation errors?**
- Confirm OPENAI_API_KEY is valid and has credits
- Check OpenAI API quota and billing status
- Review model availability (GPT-4 access required)

## ⚙️ Configuration

Create a `.env` file with the following variables:

```env
# Jira Configuration
JIRA_DOMAIN=your-company.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your_jira_api_token
JIRA_PROJECT_KEY=PROJ

# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_CHANNEL_ID=C1234567890

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key
AI_MODEL=gpt-4

# Application Configuration
NODE_ENV=development
LOG_LEVEL=info
PORT=3000

# Scheduler Configuration
DAILY_SUMMARY_CRON=0 9 * * 1-5
TIMEZONE=Asia/Kolkata
```

See the complete `.env.example` file for all available configuration options including multi-project support, performance tuning, and feature flags.

### Jira Setup

1. **Generate API Token**
   - Go to [id.atlassian.com](https://id.atlassian.com/manage-profile/security/api-tokens)
   - Create API token
   - Note your Jira domain (without https://) and email

2. **Configure Project Access**
   - Ensure your account has read access to target Jira projects
   - Note the project key(s) you want to monitor

### Slack Setup

1. **Create a Slack App**
   - Go to [api.slack.com](https://api.slack.com/apps)
   - Create new app from scratch
   - Add Bot Token Scopes: `chat:write`, `channels:read`, `users:read`

2. **Install and Configure**
   - Install app to your workspace
   - Copy Bot User OAuth Token
   - Add bot to desired channels
   - Get channel ID (right-click channel → View channel details)

### OpenAI Setup

1. **Get API Key**
   - Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create new API key
   - Ensure you have GPT-4 access for best results

## 📖 Usage

### Automatic Daily Summaries
NeuroPulse runs continuously and posts summaries based on your configured schedule (default: 9 AM weekdays, Asia/Kolkata timezone).

### Manual Operations
```bash
# Generate summary immediately
npm test

# Test Jira connection only
npm run test:jira

# Start continuous scheduler
npm start

# Development mode with TypeScript
npm run dev
```

### Available Scripts
```bash
npm start             # Production: Build and start scheduler
npm test              # Generate immediate daily summary
npm run test:jira     # Test Jira API connection
npm run dev           # Development: TypeScript immediate summary
npm run build         # Compile TypeScript to JavaScript
npm run type-check    # Type checking without compilation
npm run lint          # Code quality checking
npm run format        # Code formatting
```

## 🏗️ Architecture

```
NeuroPulse/
├── index.ts                     # Main entry point & CLI handler
├── src/
│   ├── dailySummaryApp.ts       # Core application orchestrator
│   ├── config/
│   │   └── config.ts            # Environment configuration loader
│   ├── services/
│   │   ├── schedulerService.ts  # Cron scheduling and job management
│   │   ├── slackService.ts      # Slack API integration
│   │   ├── jiraService.ts       # Jira REST API integration
│   │   └── aiService.ts         # OpenAI integration
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   └── utils/
│       └── messageFilter.ts     # Data processing utilities
├── test/
│   └── testJira.ts              # Jira connection testing
├── docs/                        # API and user documentation
├── memory-bank/                 # Project context and knowledge base
└── neurolink-demo/              # Example implementations
```

### Key Components

- **DailySummaryApp**: Main orchestrator coordinating all services
- **JiraService**: Fetches issues, handles authentication and rate limiting
- **AIService**: Processes data with OpenAI GPT-4 for intelligent summaries
- **SlackService**: Posts formatted messages with rich Block Kit formatting
- **SchedulerService**: Manages cron-based automation and lifecycle
- **Configuration**: Environment-based settings with validation

## 🎨 Customization

### Modify Summary Schedule
Update the cron expression in your `.env` file:
```env
# Daily at 9 AM on weekdays
DAILY_SUMMARY_CRON=0 9 * * 1-5

# Custom schedule examples:
# Every 2 hours: 0 */2 * * *
# Twice daily: 0 9,17 * * 1-5
# Weekly on Monday: 0 10 * * 1
```

### Configure Multiple Projects
Add multiple Jira projects in `.env`:
```env
JIRA_PROJECT_KEY=PROJ
JIRA_ADDITIONAL_PROJECTS=PROJ2,PROJ3,MOBILE
```

### Customize AI Analysis
Modify AI behavior in `src/services/aiService.ts`:
```typescript
// Custom prompts for different summary types
const technicalSummaryPrompt = `
  Focus on technical accomplishments, code reviews, and engineering blockers...
`;

// Adjust AI model parameters
const aiConfig = {
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000
};
```

## 📊 Sample Output

```
📋 Daily Summary for 2025-11-04
@JohnDoe

Key Accomplishments
   • Resolved payment gateway integration (PROJ-123)
   • Completed user authentication module
   • Fixed critical bug in checkout flow

Pending Tasks
   • Working on mobile app optimization (PROJ-456)
   • Code review for team member's PR
   • Planning next sprint activities

Blockers
   • Waiting for API documentation from external vendor
```

## 🛠️ Development

### Project Structure
- **Services**: Clean separation of Jira, Slack, AI, and Scheduler integrations
- **Types**: Comprehensive TypeScript interfaces for all data structures
- **Config**: Environment-based configuration with validation
- **Utils**: Shared utilities for data processing and message filtering
- **Memory Bank**: Project context and knowledge base for AI assistants

### Adding New Features

1. **New AI Models**: Extend `src/services/aiService.ts` with additional OpenAI models
2. **Additional Jira Projects**: Configure multi-project support in environment variables
3. **Custom Slack Formatting**: Modify Block Kit templates in `src/services/slackService.ts`
4. **Advanced Scheduling**: Enhance cron patterns in `src/services/schedulerService.ts`
5. **Data Processing**: Add custom filters in `src/utils/messageFilter.ts`

### Development Environment

```bash
# Setup development environment
npm install
npm run type-check
npm run lint
npm run format

# Development testing
npm run dev
npm run test:jira

# Build for production
npm run build
npm start
```

## 🤝 Contributing

We welcome contributions to NeuroPulse! Please follow these guidelines:

1. **Fork the repository**
   ```bash
   git clone https://github.com/Swetha-160303/NeuroPulse.git
   cd NeuroPulse
   ```

2. **Create your feature branch**
   ```bash
   git checkout -b feature/jira-enhancement
   ```

3. **Make your changes**
   - Follow TypeScript best practices
   - Add tests for new functionality
   - Update documentation as needed

4. **Test your changes**
   ```bash
   npm run type-check
   npm run lint
   npm test
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add advanced Jira filtering"
   ```

6. **Push and create Pull Request**
   ```bash
   git push origin feature/jira-enhancement
   ```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development guidelines.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### Common Issues

**Q: Daily summaries not being posted**
- Verify SLACK_BOT_TOKEN and SLACK_CHANNEL_ID in `.env`
- Ensure bot has `chat:write` permissions
- Check if bot is added to the target channel
- Review scheduler configuration and timezone settings

**Q: Jira connection failing**
- Verify JIRA_DOMAIN format (without https://)
- Check JIRA_EMAIL and JIRA_API_TOKEN are correct
- Ensure account has read access to specified projects
- Test connection with `npm run test:jira`

**Q: OpenAI API errors**
- Confirm OPENAI_API_KEY is valid and has sufficient credits
- Verify GPT-4 model access (required for best results)
- Check API quota limits and billing status
- Review request logs for specific error details

**Q: TypeScript compilation issues**
- Run `npm run type-check` for detailed error information
- Ensure all dependencies are installed with `npm install`
- Check TypeScript version compatibility (4.8+ required)

### Advanced Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for comprehensive troubleshooting guide.

### Getting Help

- 📧 **Email**: [opensource@juspay.in](mailto:opensource@juspay.in)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Swetha-160303/NeuroPulse/issues)
- 📖 **Documentation**: [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Swetha-160303/NeuroPulse/discussions)

## 🙏 Acknowledgments

- **[Juspay Technologies](https://juspay.io)** for sponsoring and maintaining this project
- **[OpenAI](https://openai.com)** for GPT-4 API enabling intelligent summaries
- **[Atlassian](https://atlassian.com)** for Jira REST API integration capabilities
- **[Slack](https://slack.dev/)** for comprehensive SDK and Block Kit formatting
- **[TypeScript](https://typescriptlang.org)** for enhanced development experience
- **[node-cron](https://github.com/node-cron/node-cron)** for reliable scheduling

## 🏢 About Juspay

NeuroPulse is built and maintained by [Juspay Technologies](https://juspay.io), a leading fintech company specializing in payment solutions and developer tools.

---

**⭐ Star this repository if NeuroPulse helps your team stay productive!** ⭐

Made with ❤️ by the Juspay Engineering Team
