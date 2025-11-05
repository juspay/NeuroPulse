# Technical Context: NeuroPulse

## 1. Technology Stack

### Core Technologies
- **Language**: TypeScript 4.8+
- **Runtime**: Node.js 18.x LTS
- **Package Manager**: npm (with lock file)
- **Build System**: TypeScript compiler (tsc)

### Key Dependencies
- **@atlassian/jira-rest-client**: Jira API integration
- **@slack/web-api**: Slack messaging and channel management
- **openai**: OpenAI GPT-4 API integration
- **node-cron**: Scheduled task automation
- **axios**: HTTP client for API requests
- **luxon**: Date/time handling with timezone support
- **dotenv**: Environment variable management

### Development Dependencies
- **@types/node**: Node.js type definitions
- **@types/node-cron**: Cron scheduling type definitions
- **@types/luxon**: Luxon date library types
- **ts-node**: TypeScript execution for development
- **typescript**: TypeScript compiler
- **jest**: Testing framework
- **@types/jest**: Jest type definitions
- **eslint**: Code linting
- **prettier**: Code formatting

## 2. Development Environment

### Prerequisites
- **Node.js**: 18.x LTS (for async/await and modern features)
- **npm**: 8.0.0+ (lockfile v2 support)
- **TypeScript**: 4.8+ (global installation recommended)
- **Git**: Version control
- **Jira Access**: Valid Atlassian account with API token
- **Slack Access**: Bot token with appropriate permissions
- **OpenAI Account**: API key with GPT-4 access

### Setup Instructions
```bash
# Clone NeuroPulse repository
git clone https://github.com/juspay/NeuroPulse
cd NeuroPulse

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure environment variables
# Edit .env with your Jira, Slack, and OpenAI credentials

# Build TypeScript
npm run build

# Run tests
npm test

# Start development server
npm run dev
```

### Environment Variables
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

## 3. Build & Deployment

### Build Process
```bash
# TypeScript compilation
npm run build

# Output: dist/ directory with compiled JavaScript
# Source maps included for debugging
```

### Testing Strategy
- **Unit Tests**: Jest for service layer testing
- **Integration Tests**: End-to-end API workflow validation
- **Mocking**: Jest mocks for external APIs (Jira, Slack, OpenAI)
- **Test Coverage**: 85%+ target with lcov reporting
- **CI Testing**: GitHub Actions for automated test execution

### Code Quality Tools
- **ESLint**: TypeScript-specific linting rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality gates
- **Commitlint**: Conventional commit message enforcement

### Deployment Pipeline
```yaml
# GitHub Actions CI/CD
- Build: TypeScript compilation and testing
- Test: Unit and integration test execution
- Security: npm audit and dependency checks
- Deploy: Docker containerization and deployment
```

## 4. Technical Constraints

### Performance Requirements
- **API Response Time**: <2 seconds for Jira queries
- **Summary Generation**: <3 seconds end-to-end
- **Memory Usage**: <100MB for standard workloads
- **Concurrent Requests**: Support 10+ simultaneous operations

### Security Considerations
- **API Key Management**: Secure environment variable handling
- **Token Rotation**: Support for API token updates without downtime
- **Input Validation**: Sanitization of all external data inputs
- **Rate Limiting**: Respect API limits for Jira, Slack, and OpenAI
- **Audit Logging**: Comprehensive logging for security monitoring

### Compatibility Requirements
- **Node.js**: 18.x LTS minimum (ES2022 features)
- **TypeScript**: 4.8+ for modern type system features
- **Platform**: Cross-platform (Linux, macOS, Windows)
- **Container**: Docker support for deployment

## 5. Service Architecture

### Core Services
```typescript
// Service layer architecture
src/services/
├── jiraService.ts      # Jira API integration
├── aiService.ts        # OpenAI integration
├── slackService.ts     # Slack messaging
└── schedulerService.ts # Cron scheduling
```

### Configuration Management
```typescript
// Centralized configuration
src/config/
└── config.ts          # Environment-based configuration
```

### Type Definitions
```typescript
// Shared type definitions
src/types/
└── index.ts           # Jira, Slack, AI service types
```

## 6. External Services Integration

### Jira REST API v3
- **Authentication**: Basic auth with email + API token
- **Endpoints**: `/rest/api/3/search` for issue queries
- **Rate Limits**: 10 requests/second for Cloud instances
- **Error Handling**: Exponential backoff for rate limit responses
- **Data Caching**: 5-minute cache for project metadata

### Slack Web API
- **Authentication**: Bot token (OAuth 2.0)
- **Scopes**: `chat:write`, `channels:read`, `users:read`
- **Rate Limits**: Tier-based limits per workspace
- **Message Formatting**: Block Kit for rich formatting
- **Error Handling**: Retry logic for transient failures

### OpenAI API
- **Model**: GPT-4 for high-quality summaries
- **Authentication**: API key (Bearer token)
- **Rate Limits**: Token-based limits (TPM/RPM)
- **Prompt Engineering**: Structured prompts for consistent output
- **Cost Management**: Token usage monitoring and optimization

### Scheduling System
- **Library**: node-cron for flexible scheduling
- **Timezone Support**: Luxon for timezone-aware scheduling
- **Job Management**: Graceful shutdown and job cleanup
- **Error Recovery**: Failed job retry mechanisms

## 7. Data Flow Architecture

### Daily Summary Workflow
```
1. Scheduler → Trigger daily summary
2. JiraService → Fetch project issues
3. AIService → Generate intelligent summary
4. SlackService → Post formatted message
5. Logging → Record operation metrics
```

### Error Handling Strategy
- **Service Isolation**: Each service handles its own errors
- **Fallback Mechanisms**: Graceful degradation when services unavailable
- **Retry Logic**: Exponential backoff for transient failures
- **Circuit Breaker**: Prevent cascade failures
- **Comprehensive Logging**: Structured logging for debugging

---
*Last Updated: 2025-11-05*
*Technical Lead: Juspay Engineering Team*
*Infrastructure: Node.js, TypeScript, Docker*
