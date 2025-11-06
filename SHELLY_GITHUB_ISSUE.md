# GitHub Issue: Shelly Integration Fails - Classic PAT Tokens Blocked

## **Title:**
```
[Setup] Shelly GitHub Integration Fails - Classic PAT Tokens Blocked by Enterprise Policies
```

## **Description:**

### Problem

When running `shelly gh --force` with exported GitHub token, users encounter authentication failures:

```bash
export GITHUB_TOKEN=ghp_classic_token
shelly gh --force
# Results in authentication errors due to enterprise security policies
```

### Expected Behavior
- Shelly should successfully configure GitHub repository settings
- Automated CI/CD pipeline setup should complete
- Branch protection rules should be applied

### Current Behavior
- Classic Personal Access Tokens (PATs) are blocked by enterprise security policies
- `shelly gh --force` fails with authentication errors
- Repository automation setup cannot complete

### Root Cause
Enterprise GitHub organizations (like Juspay) have security policies that:
1. **Block classic PAT tokens** for security reasons
2. **Require fine-grained tokens** with specific repository access
3. **Enforce organization-level restrictions** on repository automation

### Proposed Solution

#### 1. Update Documentation
- Document fine-grained token requirements in README.md
- Add troubleshooting section for enterprise GitHub setup
- Provide alternative SSH-based setup instructions

#### 2. Alternative Setup Methods
```bash
# Option 1: Use SSH instead of HTTPS
git remote set-url origin git@github.com:juspay/NeuroPulse.git

# Option 2: Use fine-grained tokens (when available)
# Go to: https://github.com/settings/personal-access-tokens/fine-grained
# Create token with specific repository access
```

#### 3. Enterprise-Friendly Workflow
- Manual repository configuration steps
- Coordination with organization administrators
- SSH key-based authentication setup

### Environment Details
- **Organization**: Juspay (Enterprise GitHub)
- **Security Policy**: Classic PAT tokens blocked
- **Command**: `shelly gh --force`
- **Token Type**: Classic Personal Access Token (ghp_...)
- **Error**: Authentication/permission failures

### Steps to Reproduce
1. Export classic GitHub token: `export GITHUB_TOKEN=ghp_classic_token`
2. Run Shelly setup: `shelly gh --force`
3. Observe authentication failures
4. Repository automation setup fails

### Workaround
Currently documented in README.md under "🔧 Active Issues":
- Use SSH-based git operations
- Coordinate with Juspay team for access resolution
- Manual repository configuration

### Impact
- Affects new contributors in enterprise environments
- Blocks automated repository setup workflows
- Requires manual coordination with organization administrators

### Related Issues
- Connects to MCP Server setup (Issue #11)
- Part of overall NeuroPulse development environment setup

### Labels
- `setup`
- `github`
- `enterprise`
- `authentication`
- `shelly`
- `documentation`
