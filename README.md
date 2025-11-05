# 🤖 Daily Summary AI Agent

An intelligent Slack bot that automatically generates comprehensive daily summaries by analyzing team conversations and project status across Slack and Jira.

## ✨ Features

### 🎯 **Smart Daily Summaries**
- **Automated Scheduling**: Posts detailed summaries every day at 11:00 PM IST
- **User-Wise Reports**: Individual progress tracking for each team member
- **Clickable Mentions**: Usernames link directly to Slack profiles
- **AI-Powered Insights**: Contextual analysis of accomplishments, pending tasks, and blockers

### 🔗 **Multi-Platform Integration**
- **Slack Integration**: Captures messages, threads, and conversations
- **Jira Integration**: Fetches real-time project tickets and status
- **Smart Filtering**: Focuses on work-relevant content, ignores casual chatter

### 🧠 **Intelligent Processing**
- **Thread Support**: Captures complete conversation context
- **Chronological Analysis**: Prioritizes recent updates over older information
- **Resolution Detection**: Automatically moves resolved issues from blockers to accomplishments
- **Work Focus**: Filters out non-work discussions using smart keyword detection

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Slack workspace with bot permissions
- Jira account with API access
- Google AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/daily-summary-ai-agent.git
   cd daily-summary-ai-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Start the application**
   ```bash
   npm start
   ```

## 🧪 Testing & Quick Start

### Quick CLI Commands

**For immediate testing after setup:**
```bash
# Install dependencies
npm install

# Test Jira connection (optional but recommended)
npm run test:jira

# Run daily summary immediately (main test)
npm test
# OR use the direct command
node dist/index.js --now

# Start the scheduler for production
npm start
```

**Available Commands:**
```bash
npm start             # Build and start the scheduler (compiled JS)
npm test              # Build and generate summary immediately
npm run test:jira     # Test Jira API connection (TypeScript)
npm run help          # Show detailed help and usage
npm run dev           # Quick development test (TypeScript)
npm run build         # Compile TypeScript to JavaScript
npm run type-check    # Check TypeScript types without compiling
```

### 🔷 TypeScript Support

NeuroPulse is now built with **TypeScript** for enhanced type safety and development experience:

**TypeScript Development:**
```bash
npm run dev           # Quick test with TypeScript (no compilation)
npm run help          # Direct TypeScript execution
npm run test:jira     # TypeScript Jira testing
```

**Production (Compiled JavaScript):**
```bash
npm run build         # Compile TypeScript to dist/
npm start             # Run compiled JavaScript
npm test              # Run compiled test
```

**Type Checking:**
```bash
npm run type-check    # Verify TypeScript types
```

### Step-by-Step Testing Process

1. **Environment Setup Test**
   ```bash
   # Copy and configure environment
   cp .env.example .env
   # Edit .env with your API keys (see Configuration section below)
   ```

2. **Dependencies Installation**
   ```bash
   npm install
   ```

3. **Jira Connection Test**
   ```bash
   npm run test:jira
   ```
   Expected output: ✅ Authentication successful, search results

4. **Full Application Test**
   ```bash
   npm test
   ```
   Expected output: Daily summary generated and posted to Slack

5. **Production Start**
   ```bash
   npm start
   ```
   The bot will now run continuously and post summaries at 11:00 PM IST daily.

### Direct CLI Commands (Alternative)

If you prefer using node directly:
```bash
node index.js --now      # Immediate summary
node index.js --help     # Show help
node index.js            # Start scheduler
node testJira.js         # Test Jira only
```

### Troubleshooting Quick Tests

**❌ Jira connection failing?**
```bash
npm run test:jira
# Check the error output and verify your .env configuration
```

**❌ Slack posting not working?**
- Verify bot is added to both team and summary channels
- Check Slack token permissions in .env
- Ensure channel IDs are correct

**❌ AI generation errors?**
- Verify `GOOGLE_AI_API_KEY` in .env
- Check Google AI quota and billing status

## ⚙️ Configuration

Create a `.env` file with the following variables:

```env
# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token
SLACK_SIGNING_SECRET=your-signing-secret
TEAM_CHANNEL_ID=C1234567890
SUMMARY_CHANNEL_ID=C0987654321

# AI Configuration
GOOGLE_AI_API_KEY=your-google-ai-key
NEUROLINK_PROVIDER=google-ai
NEUROLINK_MODEL=gemini-1.5-flash

# Jira Configuration  
JIRA_BASE_URL=https://yourcompany.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-jira-token

# Optional: Disable other AI providers
OPENAI_API_KEY=disabled
ANTHROPIC_API_KEY=disabled
AZURE_OPENAI_API_KEY=disabled
```

### Slack Setup

1. **Create a Slack App**
   - Go to [api.slack.com](https://api.slack.com/apps)
   - Create new app from scratch
   - Enable Socket Mode
   - Add Bot Token Scopes: `chat:write`, `channels:history`, `users:read`

2. **Install to Workspace**
   - Install app to your workspace
   - Copy Bot User OAuth Token
   - Copy App-Level Token (for Socket Mode)

### Jira Setup

1. **Generate API Token**
   - Go to [id.atlassian.com](https://id.atlassian.com/manage-profile/security/api-tokens)
   - Create API token
   - Copy your Jira base URL and email

## 📖 Usage

### Automatic Daily Summaries
The bot runs continuously and posts summaries at 11:00 PM IST automatically.

### Manual Testing
```bash
# Generate summary immediately
node index.js --now

# Show help
node index.js --help

# Start scheduler
node index.js
```

### Commands
```bash
npm start             # Start the scheduler
npm test              # Generate summary immediately for testing
npm run test:jira     # Test Jira API connection only
npm run help          # Show detailed help and usage
npm run dev           # Same as npm test (immediate summary)
```

## 🏗️ Architecture

```
├── index.js                 # Main entry point & CLI handler
├── src/
│   ├── dailySummaryApp.js   # Core orchestrator
│   ├── config/
│   │   └── config.js        # Configuration loader
│   ├── services/
│   │   ├── schedulerService.js    # Cron job management
│   │   ├── slackService.js        # Slack API integration
│   │   ├── jiraService.js         # Jira API integration
│   │   └── aiService.js           # AI/LLM integration
│   └── utils/
│       └── messageFilter.js       # Smart content filtering
```

### Key Components

- **SchedulerService**: Manages cron scheduling and application lifecycle
- **SlackService**: Handles message fetching, thread processing, and posting
- **JiraService**: Fetches project issues and formats for AI consumption
- **AIService**: Integrates with Google AI for summary generation
- **MessageFilter**: Filters relevant work content and groups by user

## 🎨 Customization

### Modify Summary Schedule
Edit the cron expression in `src/services/schedulerService.js`:
```javascript
// Currently: 11:00 PM IST daily
cron.schedule('0 0 23 * * *', async () => {
  // Your scheduling logic
});
```

### Customize Work Keywords
Update keyword lists in `src/utils/messageFilter.js`:
```javascript
this.workKeywords = [
  'deployment', 'bug fix', 'feature',
  // Add your domain-specific terms
];
```

### Modify AI Prompts
Customize summary format in `src/services/aiService.js`:
```javascript
const summaryPrompt = `
  // Your custom prompt template
`;
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
- **Services**: Modular components for each integration
- **Utils**: Shared utilities and helpers  
- **Config**: Centralized configuration management
- **Clean Architecture**: Separation of concerns with clear dependencies

### Adding New Features

1. **New AI Providers**: Extend `aiService.js`
2. **Additional Integrations**: Create new service files
3. **Custom Filters**: Modify `messageFilter.js`
4. **New Schedules**: Update `schedulerService.js`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Q: Bot not posting summaries**
- Check Slack token permissions
- Verify channel IDs are correct
- Ensure bot is added to channels

**Q: Jira integration failing**  
- Verify API token is valid
- Check base URL format
- Ensure email has Jira access

**Q: AI generation errors**
- Verify Google AI API key
- Check quota and billing
- Review error logs for specifics

### Getting Help

- 📧 **Email**: [your-email@domain.com](mailto:your-email@domain.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/daily-summary-ai-agent/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/daily-summary-ai-agent/discussions)

## 🙏 Acknowledgments

- [NeuroLink](https://github.com/juspay/neurolink) for AI provider abstraction
- [Slack SDK](https://slack.dev/) for seamless integration
- [node-cron](https://github.com/node-cron/node-cron) for scheduling

---

⭐ **Star this repo if you find it useful!** ⭐
