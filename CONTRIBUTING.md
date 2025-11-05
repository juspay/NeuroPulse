# Contributing to NeuroPulse

Thank you for your interest in contributing to NeuroPulse! We welcome contributions from developers who want to improve AI-powered project management automation.

## 🚀 Getting Started

### Prerequisites

- **Node.js 18.x LTS** or higher
- **npm 8.0+** or equivalent package manager
- **TypeScript 4.8+** knowledge
- **Git** for version control
- Access to **Jira, Slack, and OpenAI** for testing (optional but recommended)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/NeuroPulse.git
   cd NeuroPulse
   git remote add upstream https://github.com/Swetha-160303/NeuroPulse.git
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Configure with your test credentials (optional)
   ```

4. **Verify Setup**
   ```bash
   npm run type-check
   npm run lint
   npm run format:check
   ```

## 🛠️ Development Workflow

### Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: New features (`feature/advanced-jira-filtering`)
- **fix/**: Bug fixes (`fix/slack-authentication-error`)
- **docs/**: Documentation updates (`docs/api-reference-update`)

### Making Changes

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Development Cycle**
   ```bash
   # Make your changes
   npm run dev              # Quick TypeScript testing
   npm run type-check       # Type validation
   npm run lint             # Code quality check
   npm run format           # Code formatting
   ```

3. **Testing Your Changes**
   ```bash
   npm run test:jira        # Test Jira integration (if applicable)
   npm test                 # Full system test
   npm run build            # Production build test
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add advanced Jira project filtering"
   ```
   
   Follow [Conventional Commits](https://conventionalcommits.org/):
   - `feat:` New features
   - `fix:` Bug fixes
   - `docs:` Documentation changes
   - `style:` Code style changes
   - `refactor:` Code refactoring
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks

## 🧪 Testing Guidelines

### Test Coverage Areas

- **Unit Tests**: Individual service functions
- **Integration Tests**: Service interactions
- **API Tests**: External service connections
- **TypeScript Tests**: Type safety validation

### Writing Tests

```typescript
// Example test structure
describe('JiraService', () => {
  it('should fetch project issues successfully', async () => {
    const jiraService = new JiraService();
    const issues = await jiraService.getProjectIssues('TEST');
    expect(issues).toBeDefined();
    expect(issues.length).toBeGreaterThan(0);
  });
});
```

### Running Tests

```bash
npm test                 # All tests
npm run test:jira        # Jira-specific tests
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests
```

## 📝 Code Style Guidelines

### TypeScript Standards

- **Strict TypeScript**: All code must pass `--strict` mode
- **Interface Definitions**: Use interfaces for all data structures
- **Type Annotations**: Explicit types for public APIs
- **Error Handling**: Proper error types and handling

```typescript
// Good: Explicit interfaces and error handling
interface JiraIssue {
  key: string;
  summary: string;
  status: string;
  assignee?: string;
}

async function fetchIssues(projectKey: string): Promise<JiraIssue[]> {
  try {
    const response = await jiraApi.get(`/project/${projectKey}/issues`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch issues: ${error.message}`);
  }
}
```

### Service Architecture

- **Single Responsibility**: Each service handles one integration
- **Dependency Injection**: Constructor-based dependencies
- **Error Boundaries**: Comprehensive error handling
- **Configuration**: Environment-based configuration

```typescript
// Service pattern example
class SlackService {
  constructor(
    private config: SlackConfig,
    private logger: Logger
  ) {}

  async sendMessage(channel: string, message: string): Promise<void> {
    // Implementation with error handling
  }
}
```

### Code Formatting

We use **Prettier** and **ESLint** for consistent code style:

```bash
npm run format          # Auto-format code
npm run format:check    # Check formatting
npm run lint            # Check code quality
npm run lint:fix        # Auto-fix linting issues
```

## 🔍 Areas for Contribution

### High-Priority Areas

1. **Enhanced AI Prompts**: Improve summary quality and technical insights
2. **Multi-Project Support**: Better handling of multiple Jira projects
3. **Performance Optimization**: Caching strategies and API efficiency
4. **Error Recovery**: Enhanced retry logic and failure handling
5. **Documentation**: API documentation and usage examples

### Feature Requests

- **Custom Templates**: Configurable summary formats for different teams
- **Advanced Scheduling**: Complex timing rules and holiday awareness
- **Monitoring Dashboard**: Web interface for system health and metrics
- **Additional Integrations**: GitHub, GitLab, Microsoft Teams support

### Bug Reports

When reporting bugs, please include:

- **Environment**: Node.js version, OS, package versions
- **Configuration**: Relevant .env settings (without secrets)
- **Steps to Reproduce**: Clear reproduction steps
- **Expected vs Actual**: What should happen vs what happens
- **Logs**: Error messages and relevant log output

## 📚 Project Structure

Understanding the codebase structure:

```
src/
├── services/
│   ├── jiraService.ts      # Jira API integration
│   ├── aiService.ts        # OpenAI integration
│   ├── slackService.ts     # Slack API integration
│   └── schedulerService.ts # Cron scheduling
├── types/
│   └── index.ts            # TypeScript definitions
├── config/
│   └── config.ts           # Environment configuration
├── utils/
│   └── messageFilter.ts    # Data processing utilities
└── dailySummaryApp.ts      # Main application orchestrator
```

### Key Components

- **JiraService**: Handles all Jira API interactions, authentication, rate limiting
- **AIService**: Manages OpenAI integration, prompt engineering, response processing
- **SlackService**: Slack API communication, message formatting, channel management
- **SchedulerService**: Cron job management, application lifecycle, error recovery

## 🚢 Deployment and Release

### Release Process

1. **Feature Complete**: All features tested and documented
2. **Code Review**: Pull request review by maintainers
3. **Integration Testing**: Full system testing with real APIs
4. **Documentation Update**: README, API docs, changelog updates
5. **Semantic Release**: Automated versioning and deployment

### Docker Testing

```bash
# Test Docker build
docker build -t neuropulse:test .

# Test container run
docker run --env-file .env neuropulse:test

# Health check
docker run neuropulse:test --health
```

## 🔐 Security Guidelines

- **No Hardcoded Secrets**: All credentials in environment variables
- **Input Validation**: Sanitize all external inputs
- **API Rate Limiting**: Respect external service limits
- **Error Sanitization**: No sensitive data in error messages
- **Dependency Security**: Regular security audits with `npm audit`

## 📋 Pull Request Checklist

Before submitting a pull request:

- [ ] **Code Quality**: Passes `npm run lint` and `npm run format:check`
- [ ] **Type Safety**: Passes `npm run type-check`
- [ ] **Testing**: All tests pass with `npm test`
- [ ] **Documentation**: Updated relevant documentation
- [ ] **Changelog**: Added entry to CHANGELOG.md
- [ ] **Commit Messages**: Follow Conventional Commits format
- [ ] **No Breaking Changes**: Or clearly documented if necessary

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Documentation
- [ ] Code comments updated
- [ ] README updated (if needed)
- [ ] API documentation updated (if needed)
```

## 🤝 Community Guidelines

- **Be Respectful**: Follow our [Code of Conduct](CODE_OF_CONDUCT.md)
- **Be Helpful**: Assist other contributors and users
- **Be Patient**: Reviews and responses may take time
- **Be Clear**: Provide detailed descriptions and context

## 📞 Getting Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/Swetha-160303/NeuroPulse/issues)
- **GitHub Discussions**: [Ask questions and discuss ideas](https://github.com/Swetha-160303/NeuroPulse/discussions)
- **Email**: [opensource@juspay.in](mailto:opensource@juspay.in)
- **Documentation**: [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)

## 🙏 Recognition

Contributors will be recognized in:
- **README.md**: Contributors section
- **Release Notes**: Feature attribution
- **GitHub**: Contributor graph and statistics

Thank you for contributing to NeuroPulse and helping improve AI-powered project management automation!

---

**Happy Coding!** 🚀

*Made with ❤️ by the Juspay Engineering Team*
