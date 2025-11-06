# Single Commit Policy

> Guidelines for maintaining clean commit history in NeuroPulse

## Overview

This document outlines the single commit policy for the NeuroPulse repository to ensure a clean, readable, and maintainable git history for our AI-powered Jira integration project.

## Policy Statement

All pull requests to the `release` branch (our default branch) must be merged using **squash and merge** to maintain a single commit per feature/fix.

## Benefits

### Clean History
- Each feature/fix becomes a single commit
- Easy to identify what each commit does
- Simple to revert if needed
- Professional git history for enterprise use

### Better Tracking
- Clear correlation between Jira issues and commits
- Easier code archaeology for debugging
- Simplified release notes generation
- Better integration with our AI analysis workflows

### Improved Reviews
- Focus on the complete change set
- No intermediate "fix typo" or "WIP" commits
- Professional commit history for Juspay standards

## Implementation

### Required Repository Settings

#### Pull Request Settings
1. Go to **Settings** → **General** → **Pull Requests**
2. ✅ **Allow squash merging**
3. ❌ **Allow merge commits** (disable)
4. ❌ **Allow rebase merging** (disable)
5. ✅ **Always suggest updating pull request branches**
6. ✅ **Automatically delete head branches**

#### Branch Protection Rules (release branch)
- Require pull request reviews before merging
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Restrict pushes that create files larger than 100MB
- Require signed commits (recommended for enterprise)

### Commit Message Format

When squashing commits, use the following conventional commit format:

```
<type>(<scope>): <description>

<body>

<footer>
```

#### Types for NeuroPulse
- **feat**: New feature (AI services, Jira integration, Slack features)
- **fix**: Bug fix (API issues, integration problems)
- **docs**: Documentation changes (README, API docs, guides)
- **style**: Code style changes (formatting, linting)
- **refactor**: Code refactoring (service improvements, optimization)
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (dependencies, build config)
- **ci**: CI/CD pipeline changes (GitHub Actions, Shelly integration)
- **perf**: Performance improvements (AI processing, API calls)

#### Scopes for NeuroPulse
- **ai**: Vertex AI service and processing
- **jira**: Jira API integration and data fetching
- **slack**: Slack API and message formatting
- **scheduler**: Cron scheduling and automation
- **config**: Configuration and environment setup
- **shelly**: GitHub automation and repository setup
- **api**: General API integrations
- **core**: Core application logic

#### Examples

```
feat(ai): add Vertex AI PaLM 2 model support

- Implement PaLM 2 model for enhanced summary generation
- Add configurable model selection in environment variables
- Update AI service to handle new model parameters
- Add comprehensive tests for new AI model integration
- Update documentation with PaLM 2 configuration

Closes #123
```

```
fix(jira): resolve authentication timeout issues

- Fix intermittent authentication failures with Jira API
- Implement exponential backoff retry mechanism
- Add proper error handling for network timeouts
- Update connection pooling configuration
- Add monitoring for API health checks

Fixes #456
References: PROJ-789
```

```
docs(shelly): update GitHub integration documentation

- Add comprehensive Shelly setup instructions
- Include troubleshooting guide for common issues
- Update architecture diagrams with GitHub workflows
- Add examples for repository configuration

```

## Workflow

### For Contributors

1. **Create Feature Branch**
   ```bash
   git checkout release
   git pull origin release
   git checkout -b feature/ai-model-enhancement
   ```

2. **Make Development Commits** (work in progress)
   ```bash
   git commit -m "WIP: initial PaLM 2 implementation"
   git commit -m "add unit tests for new model"
   git commit -m "fix linting issues"
   git commit -m "address code review feedback"
   ```

3. **Create Pull Request**
   - Ensure all commits are related to the same feature/fix
   - Write a clear PR description linking to Jira issues
   - Reference relevant GitHub issues or project tickets
   - Include testing instructions

4. **Squash and Merge**
   - Maintainer will squash all commits into a single commit
   - Provide a clean, descriptive commit message
   - Delete the feature branch automatically

### For Maintainers

1. **Review the PR**
   - Ensure all commits are cohesively related
   - Check that all tests pass (unit, integration, e2e)
   - Verify code follows NeuroPulse style guidelines
   - Test Jira, Slack, and AI integrations if applicable

2. **Squash and Merge**
   - Use the "Squash and merge" button in GitHub
   - Edit the commit message to follow our format
   - Include relevant Jira issue numbers and GitHub issues
   - Ensure commit message clearly describes the change

3. **Post-Merge Tasks**
   - Delete the feature branch
   - Update related Jira issues
   - Notify stakeholders if it's a significant feature
   - Update deployment tracking if applicable

## Exceptions

### When NOT to Squash

- **Multiple unrelated changes**: Split into separate PRs
- **Emergency hotfixes**: May use direct commits to release (with approval)
- **Release commits**: Keep as separate commits for version tracking
- **Documentation-only changes**: Can be committed directly for urgent fixes

### Emergency Procedures

For critical hotfixes affecting production AI summaries or integrations:

1. Create hotfix branch from release
2. Make minimal necessary changes
3. Get emergency approval from team lead (@juspay-engineering)
4. Merge directly with clear documentation
5. Create follow-up PR to address properly
6. Update incident documentation

## Integration with NeuroPulse Workflows

### Jira Integration
- Include Jira issue numbers in commit messages
- Link commits to Epic/Story tracking
- Update issue status automatically via commit messages

### AI Model Updates
- Clearly document model changes and their impact
- Include performance benchmarks in commit messages
- Note any breaking changes to AI output format

### Slack Integration
- Document changes affecting Slack message formatting
- Include screenshots in PR descriptions for UI changes
- Test message delivery in staging channels

## Monitoring and Metrics

### Repository Health Metrics
- Percentage of squashed merges vs direct merges
- Average commits per PR before squashing
- Time from PR creation to merge
- Code review participation rates

### Quality Indicators
- Build success rate post-merge
- Integration test pass rates
- Deployment success frequency
- Rollback frequency

## Tools and Automation

### GitHub Repository Configuration

Configure via GitHub CLI:
```bash
gh api repos/juspay/NeuroPulse \
  --method PATCH \
  --field allow_squash_merge=true \
  --field allow_merge_commit=false \
  --field allow_rebase_merge=false \
  --field delete_branch_on_merge=true
```

### Commit Message Validation

Using existing commitlint configuration:
```bash
# Already configured in commitlint.config.js
npm run lint:commit
```

### GitHub Actions Integration

Include commit message validation in CI:
```yaml
# .github/workflows/validate-commits.yml
name: Validate Commits
on: [pull_request]
jobs:
  commitlint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate commit messages
        uses: wagoid/commitlint-github-action@v5
```

## Training and Onboarding

### New Contributors Checklist
- [ ] Review this commit policy document
- [ ] Understand NeuroPulse architecture and components
- [ ] Practice creating conventional commit messages
- [ ] Set up local development environment
- [ ] Complete first PR with guidance from maintainer

### Resources
- [NeuroPulse Contributing Guide](./CONTRIBUTING.md)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Squash Merge Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github#squashing-your-merge-commits)
- [Juspay Engineering Standards](https://github.com/juspay/engineering-standards)

## Contact and Support

For questions about this policy:
- **Team Lead**: opensource@juspay.in
- **Documentation**: [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Issues**: https://github.com/juspay/NeuroPulse/issues
- **Slack Channel**: #neuropulse-dev (internal)

## Policy Updates

This policy will be reviewed and updated:
- **Quarterly**: Based on team feedback and git history analysis
- **As needed**: When new tools or processes are introduced
- **Version controlled**: All changes tracked in git history

---

**Last Updated**: November 2025  
**Version**: 1.0  
**Approved by**: Juspay Engineering Team
