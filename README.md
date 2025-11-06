# 🧠 NeuroPulse

> **AI-Powered Jira Integration with Automated Daily Summaries**
> **AI-Powered Jira Integration with Automated Daily Summaries**

NeuroPulse streamlines project management by connecting Jira, AI analysis, and Slack communication. It automatically generates intelligent daily summaries and delivers actionable insights directly to your team channels.
NeuroPulse streamlines project management by connecting Jira, AI analysis, and Slack communication. It automatically generates intelligent daily summaries and delivers actionable insights directly to your team channels.

## ✨ Key Features
## ✨ Key Features

- 🤖 **AI-Powered Summaries**: Vertex AI analyzes Jira data for intelligent insights
- 📅 **Automated Scheduling**: Configurable daily summaries (default: 9 AM weekdays)
- 🔗 **Multi-Platform Integration**: Jira, Slack, Vertex AI seamlessly connected
- 🚀 **Shelly GitHub Integration**: Automated repository setup and deployment
- 📊 **Smart Analytics**: Blocker detection, priority analysis, trend identification
- 🎯 **Multi-Project Support**: Handle multiple Jira projects independently
- 🤖 **AI-Powered Summaries**: Vertex AI analyzes Jira data for intelligent insights
- 📅 **Automated Scheduling**: Configurable daily summaries (default: 9 AM weekdays)
- 🔗 **Multi-Platform Integration**: Jira, Slack, Vertex AI seamlessly connected
- 🚀 **Shelly GitHub Integration**: Automated repository setup and deployment
- 📊 **Smart Analytics**: Blocker detection, priority analysis, trend identification
- 🎯 **Multi-Project Support**: Handle multiple Jira projects independently

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x LTS or higher
- Jira account with API access
- Slack workspace with bot permissions
- Google Cloud account with Vertex AI access
- GitHub account (for Shelly integration)
- Node.js 18.x LTS or higher
- Jira account with API access
- Slack workspace with bot permissions
- Google Cloud account with Vertex AI access
- GitHub account (for Shelly integration)

### Installation

```bash
# Clone repository
git clone https://github.com/juspay/NeuroPulse.git
cd NeuroPulse
```bash
# Clone repository
git clone https://github.com/juspay/NeuroPulse.git
cd NeuroPulse

# Install dependencies
npm install
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Build and start
# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Build and start
npm run build
npm start
```

## ⚙️ Configuration

### Essential Environment Variables
### Essential Environment Variables

```env
# Jira Configuration
JIRA_DOMAIN=your-company.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your_jira_api_token
JIRA_PROJECT_KEY=PROJ

# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_CHANNEL_ID=C1234567890

# Vertex AI Configuration
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
VERTEX_AI_LOCATION=us-central1

# GitHub Configuration (for Shelly)
GITHUB_TOKEN=ghp_your-github-token

# Schedule Configuration
# Vertex AI Configuration
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
VERTEX_AI_LOCATION=us-central1

# GitHub Configuration (for Shelly)
GITHUB_TOKEN=ghp_your-github-token

# Schedule Configuration
DAILY_SUMMARY_CRON=0 9 * * 1-5
TIMEZONE=Asia/Kolkata
```

### Service Setup

#### 1. Jira Setup
### Service Setup

#### 1. Jira Setup
```bash
# Generate API token at: https://id.atlassian.com/manage-profile/security/api-tokens
# Test connection
# Generate API token at: https://id.atlassian.com/manage-profile/security/api-tokens
# Test connection
npm run test:jira
```

#### 2. Slack Setup
```bash
# Create Slack app at: https://api.slack.com/apps
# Required scopes: chat:write, channels:read, users:read
# Add bot to target channel
```

#### 3. Vertex AI Setup
```bash
# Set up Google Cloud service account at: https://console.cloud.google.com/
# Enable Vertex AI API and download service account key
# Set GOOGLE_APPLICATION_CREDENTIALS environment variable
```

#### 4. Shelly Integration Setup
```bash
# Generate GitHub Personal Access Token with repo permissions
export GITHUB_TOKEN=your_github_token

# Run Shelly setup (automated repository configuration)
shelly gh --force
```

## 🔧 Shelly Integration

### What is Shelly?

Shelly is NeuroPulse's integrated GitHub automation tool that streamlines repository setup, CI/CD configuration, and deployment processes.

### Features

- ✅ **Automated Repository Setup**: Branch protection, pull request rules
- ✅ **CI/CD Pipeline Configuration**: GitHub Actions workflows
- ✅ **NPM Publishing Setup**: Automated package publishing
- ✅ **GitHub Pages Configuration**: Documentation hosting
- ✅ **Security Configuration**: Branch protection, workflow permissions

### Shelly Commands

```

#### 2. Slack Setup
```bash
# Create Slack app at: https://api.slack.com/apps
# Required scopes: chat:write, channels:read, users:read
# Add bot to target channel
```

#### 3. Vertex AI Setup
```bash
# Set up Google Cloud service account at: https://console.cloud.google.com/
# Enable Vertex AI API and download service account key
# Set GOOGLE_APPLICATION_CREDENTIALS environment variable
```

#### 4. MCP Server Setup
```bash
# Copy and configure MCP servers template
cp .mcp-config.json.example .mcp-config.json

# Edit the configuration file with your paths and tokens
# Update filesystem path, GitHub token, database connections, etc.

# Test MCP server configuration
pnpm dlx @juspay/neurolink mcp list

# Install and verify specific servers
pnpm dlx @juspay/neurolink mcp install filesystem
pnpm dlx @juspay/neurolink mcp test filesystem
```

#### 5. Shelly Integration Setup
```bash
# Generate GitHub Personal Access Token with repo permissions
export GITHUB_TOKEN=your_github_token

# Run Shelly setup (automated repository configuration)
shelly gh --force
```

## 🔧 MCP Server Integration

### What are MCP Servers?

MCP (Model Context Protocol) servers extend NeuroPulse's AI capabilities by providing additional tools and data sources. They enable the AI to interact with filesystems, GitHub repositories, databases, and other external services.

### Available MCP Servers for NeuroPulse

- **🗂️ Filesystem**: Read/write files for documentation and data analysis
- **🐙 GitHub**: Repository management and code analysis
- **⏰ Time**: Scheduling and time-based operations
- **🌐 Web**: Web scraping and content analysis
- **🗄️ PostgreSQL**: Database queries and data insights

### MCP Configuration

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/your/project"],
      "transport": "stdio"
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "transport": "stdio",
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

### MCP Commands

```bash
# List configured servers
pnpm dlx @juspay/neurolink mcp list

# Install popular servers
pnpm dlx @juspay/neurolink mcp install filesystem
pnpm dlx @juspay/neurolink mcp install github

# Test server connectivity
pnpm dlx @juspay/neurolink mcp test filesystem

# Execute MCP tools directly
pnpm dlx @juspay/neurolink mcp execute filesystem read_file --path="README.md"
```

## 🔧 Shelly Integration

### What is Shelly?

Shelly is NeuroPulse's integrated GitHub automation tool that streamlines repository setup, CI/CD configuration, and deployment processes.

### Features

- ✅ **Automated Repository Setup**: Branch protection, pull request rules
- ✅ **CI/CD Pipeline Configuration**: GitHub Actions workflows
- ✅ **NPM Publishing Setup**: Automated package publishing
- ✅ **GitHub Pages Configuration**: Documentation hosting
- ✅ **Security Configuration**: Branch protection, workflow permissions

### Shelly Commands

```bash
# Complete repository setup
shelly gh --force

# Check current configuration
shelly status

# Update repository settings
shelly update --config

# Deploy to production
shelly deploy --env production
```

### Repository Structure After Shelly Setup
# Complete repository setup
shelly gh --force

# Check current configuration
shelly status

# Update repository settings
shelly update --config

# Deploy to production
shelly deploy --env production
```

### Repository Structure After Shelly Setup

```
NeuroPulse/
├── .github/
│   ├── workflows/          # Automated CI/CD pipelines
│   └── ISSUE_TEMPLATE.md   # Issue templates
├── docs/                   # Documentation (GitHub Pages ready)
├── src/                    # Source code
└── README.md              # This file
```

### Automated Configurations

When you run `shelly gh --force`, it automatically configures:

1. **Branch Protection Rules**
   - Require pull request reviews
   - Restrict direct pushes to main/release
   - Require status checks to pass

2. **GitHub Actions Workflows**
   - Automated testing on pull requests
   - NPM package publishing
   - Documentation deployment

3. **Repository Settings**
   - Default branch configuration
   - Merge strategies
   - Delete branch on merge

4. **GitHub Pages**
   - Documentation hosting from `/docs` folder
   - Custom domain configuration support

## 📋 Available Commands

```bash
# Core Operations
npm start              # Start scheduled daily summaries
npm test               # Generate immediate summary
npm run test:jira      # Test Jira connection only

# Development
npm run dev            # TypeScript development mode
npm run build          # Compile TypeScript
npm run type-check     # Type checking

# Code Quality
npm run lint           # ESLint checking
npm run format         # Prettier formatting

# Shelly Operations
shelly gh --force      # Complete GitHub setup
shelly deploy          # Deploy to production
shelly status          # Check configuration status
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────┐
│   Jira API      │────│  NeuroPulse  │────│   Slack     │
│                 │    │              │    │   Channel   │
└─────────────────┘    └──────────────┘    └─────────────┘
                              │
                              │
                    ┌─────────▼──────────┐
                    │   Vertex AI PaLM   │
                    │   AI Processing    │
                    └────────────────────┘
                              │
                              │
                    ┌─────────▼──────────┐
                    │  Shelly GitHub     │
                    │   Integration      │
                    └────────────────────┘
├── .github/
│   ├── workflows/          # Automated CI/CD pipelines
│   └── ISSUE_TEMPLATE.md   # Issue templates
├── docs/                   # Documentation (GitHub Pages ready)
├── src/                    # Source code
└── README.md              # This file
```

### Automated Configurations

When you run `shelly gh --force`, it automatically configures:

1. **Branch Protection Rules**
   - Require pull request reviews
   - Restrict direct pushes to main/release
   - Require status checks to pass

2. **GitHub Actions Workflows**
   - Automated testing on pull requests
   - NPM package publishing
   - Documentation deployment

3. **Repository Settings**
   - Default branch configuration
   - Merge strategies
   - Delete branch on merge

4. **GitHub Pages**
   - Documentation hosting from `/docs` folder
   - Custom domain configuration support

## 📋 Available Commands

```bash
# Core Operations
npm start              # Start scheduled daily summaries
npm test               # Generate immediate summary
npm run test:jira      # Test Jira connection only

# Development
npm run dev            # TypeScript development mode
npm run build          # Compile TypeScript
npm run type-check     # Type checking

# Code Quality
npm run lint           # ESLint checking
npm run format         # Prettier formatting

# Shelly Operations
shelly gh --force      # Complete GitHub setup
shelly deploy          # Deploy to production
shelly status          # Check configuration status
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────┐
│   Jira API      │────│  NeuroPulse  │────│   Slack     │
│                 │    │              │    │   Channel   │
└─────────────────┘    └──────────────┘    └─────────────┘
                              │
                              │
                    ┌─────────▼──────────┐
                    │   Vertex AI PaLM   │
                    │   AI Processing    │
                    └────────────────────┘
                              │
                              │
                    ┌─────────▼──────────┐
                    │  Shelly GitHub     │
                    │   Integration      │
                    └────────────────────┘
```

### Core Services

- **JiraService**: Fetches issues and project data
- **AIService**: Processes data with Vertex AI for intelligent summaries
- **SlackService**: Posts formatted messages with rich formatting
- **SchedulerService**: Manages cron-based automation
- **ShellyIntegration**: Handles GitHub repository automation
### Core Services

- **JiraService**: Fetches issues and project data
- **AIService**: Processes data with Vertex AI for intelligent summaries
- **SlackService**: Posts formatted messages with rich formatting
- **SchedulerService**: Manages cron-based automation
- **ShellyIntegration**: Handles GitHub repository automation

## 📊 Sample Output

```
📋 Daily Summary for 2025-11-05
@TeamDev

✅ Key Accomplishments
   • Payment gateway integration completed (PROJ-123)
   • Mobile app authentication module deployed
   • Critical checkout bug resolved

⏳ In Progress
   • API optimization for mobile app (PROJ-456)
   • User dashboard redesign
   • Performance testing suite

🚫 Blockers
   • External vendor API documentation pending
   • Database migration approval required

📈 Insights
   • 85% completion rate this week
   • 3 critical issues resolved
   • 2 new features deployed
📋 Daily Summary for 2025-11-05
@TeamDev

✅ Key Accomplishments
   • Payment gateway integration completed (PROJ-123)
   • Mobile app authentication module deployed
   • Critical checkout bug resolved

⏳ In Progress
   • API optimization for mobile app (PROJ-456)
   • User dashboard redesign
   • Performance testing suite

🚫 Blockers
   • External vendor API documentation pending
   • Database migration approval required

📈 Insights
   • 85% completion rate this week
   • 3 critical issues resolved
   • 2 new features deployed
```

## 🔍 Current Status & Improvements

### ✅ Recent Improvements

1. **Documentation Enhancement**
   - ✅ Enhanced README with Shelly integration guide
   - ✅ Corrected AI service documentation (OpenAI → Vertex AI)
   - ✅ Added comprehensive troubleshooting guide
   - ✅ Created professional commit policy for enterprise standards

2. **Repository Organization**
   - ✅ Moved documentation to structured `/docs` directory
   - ✅ Updated remote repository to Juspay organization
   - ✅ Established professional git workflow standards

### 🔧 Active Issues

1. **GitHub Integration Challenges**
   - ⚠️ **Classic PAT tokens blocked** by enterprise security policies
   - ⚠️ **Repository access permissions** need fine-grained tokens
   - 🔄 **In Progress**: Coordinating with Juspay team for access resolution

2. **Technical Debt**
   - 🔄 Limited error handling and retry mechanisms
   - 🔄 Basic AI prompt engineering needs enhancement
   - 🔄 Logging and monitoring improvements needed

### 🎯 Planned Enhancements

- [ ] **Enhanced AI Models**: PaLM 2, Gemini Pro integration
- [ ] **Advanced Authentication**: Fine-grained GitHub tokens support
- [ ] **Custom Slack Commands**: Interactive slash commands
- [ ] **Real-time Monitoring**: Live notification system
- [ ] **Multi-tool Integration**: Beyond Jira (Linear, Asana, etc.)
- [ ] **Analytics Dashboard**: Visual project health metrics

## 🚨 Troubleshooting

### Quick Fixes

**GitHub Access Issues**: Classic tokens blocked by enterprise policies
## 🔍 Current Status & Improvements

### ✅ Recent Improvements

1. **Documentation Enhancement**
   - ✅ Enhanced README with Shelly integration guide
   - ✅ Corrected AI service documentation (OpenAI → Vertex AI)
   - ✅ Added comprehensive troubleshooting guide
   - ✅ Created professional commit policy for enterprise standards

2. **Repository Organization**
   - ✅ Moved documentation to structured `/docs` directory
   - ✅ Updated remote repository to Juspay organization
   - ✅ Established professional git workflow standards

### 🔧 Active Issues

1. **GitHub Integration Challenges**
   - ⚠️ **Classic PAT tokens blocked** by enterprise security policies
   - ⚠️ **Repository access permissions** need fine-grained tokens
   - 🔄 **In Progress**: Coordinating with Juspay team for access resolution

2. **Technical Debt**
   - 🔄 Limited error handling and retry mechanisms
   - 🔄 Basic AI prompt engineering needs enhancement
   - 🔄 Logging and monitoring improvements needed

### 🎯 Planned Enhancements

- [ ] **Enhanced AI Models**: PaLM 2, Gemini Pro integration
- [ ] **Advanced Authentication**: Fine-grained GitHub tokens support
- [ ] **Custom Slack Commands**: Interactive slash commands
- [ ] **Real-time Monitoring**: Live notification system
- [ ] **Multi-tool Integration**: Beyond Jira (Linear, Asana, etc.)
- [ ] **Analytics Dashboard**: Visual project health metrics

## 🚨 Troubleshooting

### Quick Fixes

**GitHub Access Issues**: Classic tokens blocked by enterprise policies
```bash
# Solution: Use fine-grained tokens or SSH
git remote set-url origin git@github.com:juspay/NeuroPulse.git
```

**Shelly Setup Fails**: Authentication or token scope problems
```bash
# Check token and re-run
echo $GITHUB_TOKEN && shelly gh --force
```
# Solution: Use fine-grained tokens or SSH
git remote set-url origin git@github.com:juspay/NeuroPulse.git
```

**Shelly Setup Fails**: Authentication or token scope problems
```bash
# Check token and re-run
echo $GITHUB_TOKEN && shelly gh --force
```

**Daily Summaries Not Posted**: Usually Jira, Slack, or Vertex AI config
```bash
# Test components individually
npm run test:jira && npm test
```

**AI Generation Errors**: Google Cloud authentication or API access
```bash
# Quick check
gcloud auth list && gcloud config get-value project
```

### 📖 **Comprehensive Troubleshooting**

For detailed solutions, step-by-step guides, and emergency procedures, see:

📋 **[Complete Troubleshooting Guide](docs/TROUBLESHOOTING.md)**

**Includes solutions for**:
- GitHub authentication and enterprise security policies
- Shelly integration issues and debugging
- Vertex AI setup and configuration problems  
- Slack bot permissions and Socket Mode
- Build, deployment, and performance issues
- Emergency procedures and rollback strategies

**Quick Help**: opensource@juspay.in

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🏢 About
**Daily Summaries Not Posted**: Usually Jira, Slack, or Vertex AI config
```bash
# Test components individually
npm run test:jira && npm test
```

**AI Generation Errors**: Google Cloud authentication or API access
```bash
# Quick check
gcloud auth list && gcloud config get-value project
```

### 📖 **Comprehensive Troubleshooting**

For detailed solutions, step-by-step guides, and emergency procedures, see:

📋 **[Complete Troubleshooting Guide](docs/TROUBLESHOOTING.md)**

**Includes solutions for**:
- GitHub authentication and enterprise security policies
- Shelly integration issues and debugging
- Vertex AI setup and configuration problems  
- Slack bot permissions and Socket Mode
- Build, deployment, and performance issues
- Emergency procedures and rollback strategies

**Quick Help**: opensource@juspay.in

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🏢 About

NeuroPulse is built and maintained by [Juspay Technologies](https://juspay.io) - a leading fintech company specializing in payment solutions and developer tools.
NeuroPulse is built and maintained by [Juspay Technologies](https://juspay.io) - a leading fintech company specializing in payment solutions and developer tools.

---

**⭐ Star this repository if NeuroPulse helps your team stay productive!**
**⭐ Star this repository if NeuroPulse helps your team stay productive!**

Made with ❤️ by the Juspay Engineering Team
