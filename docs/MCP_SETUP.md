# MCP Server Setup Guide for NeuroPulse

## Overview

This guide helps you configure MCP (Model Context Protocol) servers for NeuroPulse to extend AI capabilities with external tools and services.

## Quick Setup

### 1. Basic Configuration

Copy the example configuration:
```bash
cp .mcp-config.json.example .mcp-config.json
```

### 2. Configure Servers

Edit `.mcp-config.json` with your credentials:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "mcp-server-filesystem",
      "args": ["/Users/your-username/Desktop/NeuroPulse"],
      "transport": "stdio"
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "transport": "stdio",
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-actual-slack-bot-token",
        "SLACK_SIGNING_SECRET": "your-actual-slack-signing-secret"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "transport": "stdio",
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-actual-github-token"
      }
    }
  }
}
```

### 3. Test Configuration

```bash
pnpm dlx @juspay/neurolink mcp list
```

## Server-Specific Setup

### Filesystem Server 🔧 (Optional)
- **Purpose**: Read/write files, analyze project structure
- **Requirements**: File system access (optional for NeuroPulse core functionality)
- **Installation**: `npm install -g @modelcontextprotocol/server-filesystem`
- **Tools**: 14+ file operations
- **Status**: ✅ Can be enabled or disabled based on needs

#### Complete Disable Option
If you want to eliminate all MCP-related messages:
```json
{
  "mcpServers": {}
}
```
This completely disables MCP integration while preserving core NeuroPulse functionality.

### Slack Server 🔧 (Needs Setup)
- **Purpose**: Send messages, read channels, manage Slack workspace
- **Requirements**: 
  - Slack Bot Token (`xoxb-...`)
  - Slack Signing Secret
- **Setup**:
  1. Go to https://api.slack.com/apps
  2. Create new app or use existing NeuroPulse app
  3. Get Bot Token from OAuth & Permissions
  4. Get Signing Secret from Basic Information
  5. Update `.mcp-config.json` with real tokens

### GitHub Server 🔧 (Needs Setup)
- **Purpose**: Repository management, issue tracking, code analysis
- **Requirements**: GitHub Personal Access Token
- **Setup**:
  1. Go to https://github.com/settings/tokens
  2. Create fine-grained token with repository access
  3. Grant permissions: Contents, Issues, Pull Requests
  4. Update `.mcp-config.json` with real token

## Integration with NeuroPulse

### Use Case 1: Enhanced Daily Summaries
With MCP servers configured, NeuroPulse can:
- **Filesystem**: Read Jira export files, analyze project documentation
- **Slack**: Post enhanced summaries with rich formatting
- **GitHub**: Cross-reference Jira issues with GitHub commits and PRs

### Use Case 2: Automated Workflows
- **Slack**: Receive commands, post status updates
- **GitHub**: Create issues from Jira blockers, update PR descriptions
- **Filesystem**: Generate reports, save summaries to files

## Troubleshooting

### Common Issues

1. **"Found 0 MCP servers"**
   - ✅ **SOLVED**: Create `.mcp-config.json` file

2. **"Method not found (-32601)" errors**
   - ✅ **SOLVED**: Install MCP server globally: `npm install -g @modelcontextprotocol/server-filesystem`
   - ✅ **SOLVED**: Use direct command instead of npx in configuration
   - ✅ **SOLVED**: To completely eliminate MCP errors, disable MCP servers: `{"mcpServers": {}}`
   - Update `.mcp-config.json` to use `"command": "mcp-server-filesystem"` or disable entirely

3. **"Connection closed" errors**
   - Check token validity
   - Verify permissions
   - Test individual servers

4. **"Process exited with code 1"**
   - Server package not available
   - Missing dependencies
   - Invalid configuration

### Testing Individual Servers

```bash
# Test specific server
pnpm dlx @juspay/neurolink mcp test filesystem
pnpm dlx @juspay/neurolink mcp test slack
pnpm dlx @juspay/neurolink mcp test github

# List available tools
pnpm dlx @juspay/neurolink mcp list --detailed
```

## Security Notes

- Store tokens in environment variables for production
- Use fine-grained tokens with minimal required permissions
- Regularly rotate access tokens
- Never commit tokens to version control

## Support

- 📖 [NeuroPulse Troubleshooting](./TROUBLESHOOTING.md)
- 🔗 [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- 🐛 [Report Issues](https://github.com/juspay/NeuroPulse/issues)
