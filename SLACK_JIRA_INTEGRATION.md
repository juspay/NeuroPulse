# How to Connect Slack and Jira MCP Servers to NeuroPulse

## ✅ Current Status
- **Filesystem Server**: ✅ Connected (14 tools available)
- **Original "Found 0 MCP servers" Error**: ✅ RESOLVED
- **Slack Server**: 🔧 Ready to configure
- **Jira Integration**: 🔧 Via existing NeuroPulse services + GitHub MCP

## 🔗 Adding Slack MCP Server

### Step 1: Get Your Slack Tokens

1. **Go to Slack App Management**: https://api.slack.com/apps
2. **Create or Select App**: Use your existing NeuroPulse Slack app
3. **Get Bot Token**:
   - Go to "OAuth & Permissions" 
   - Copy the "Bot User OAuth Token" (starts with `xoxb-`)
4. **Get Signing Secret**:
   - Go to "Basic Information"
   - Copy the "Signing Secret"

### Step 2: Update MCP Configuration

Add Slack server to your `.mcp-config.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/swetha.s.001/Desktop/NeuroPulse"],
      "transport": "stdio"
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "transport": "stdio",
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-actual-bot-token",
        "SLACK_SIGNING_SECRET": "your-actual-signing-secret"
      }
    }
  }
}
```

### Step 3: Test Slack Connection

```bash
pnpm dlx @juspay/neurolink mcp list
```

**Expected Result**: `✔ Found 2 MCP servers` with both filesystem and slack connected.

## 🎯 Jira Integration Strategy

For Jira, you have **two approaches**:

### Option 1: Use Existing NeuroPulse Jira Service (Recommended)
Your NeuroPulse project already has robust Jira integration via:
- `src/services/jiraService.ts` 
- Environment variables (`JIRA_DOMAIN`, `JIRA_API_TOKEN`, etc.)

**Benefits**: Already integrated with your daily summary workflow.

### Option 2: Add GitHub MCP for Jira Cross-Reference
Add GitHub MCP to cross-reference Jira issues with commits:

```json
{
  "mcpServers": {
    "filesystem": { /* ... */ },
    "slack": { /* ... */ },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "transport": "stdio",
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-github-token"
      }
    }
  }
}
```

## 🚀 Complete Integration Workflow

Once Slack MCP is connected, your NeuroPulse will be able to:

1. **Fetch Jira Data**: Via existing `jiraService.ts`
2. **AI Analysis**: Via existing `aiService.ts` (Vertex AI)
3. **Enhanced Slack Posting**: Via MCP Slack server with advanced formatting
4. **File Operations**: Via MCP filesystem server for reports/logs

## 🧪 Testing Your Setup

```bash
# Test individual servers
pnpm dlx @juspay/neurolink mcp test filesystem
pnpm dlx @juspay/neurolink mcp test slack

# List all available tools
pnpm dlx @juspay/neurolink mcp list

# Test your full NeuroPulse workflow
npm test  # Your existing Jira summary test
```

## 🔒 Security Best Practices

1. **Store tokens in environment variables**:
   ```bash
   export SLACK_BOT_TOKEN="xoxb-your-token"
   export SLACK_SIGNING_SECRET="your-secret"
   ```

2. **Update `.mcp-config.json` to use env vars**:
   ```json
   "env": {
     "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
     "SLACK_SIGNING_SECRET": "${SLACK_SIGNING_SECRET}"
   }
   ```

3. **Add tokens to `.env` file** (never commit to git)

## 🎯 Expected Final Result

After adding Slack:
```
✔ Found 2 MCP servers

🔧 MCP Servers:

filesystem CONNECTED
  Command: npx
  Tools: 14 available

slack CONNECTED  
  Command: npx
  Tools: 8+ available
```

Your AI will then have access to both file operations and advanced Slack messaging capabilities!

## 📞 Need Help?

- **MCP Documentation**: See `docs/MCP_SETUP.md`
- **Troubleshooting**: See `docs/TROUBLESHOOTING.md`
- **GitHub Issue**: Reference issue #11 for complete setup guide
