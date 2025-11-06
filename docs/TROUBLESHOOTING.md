# 🛠️ NeuroPulse Troubleshooting Guide

> Comprehensive solutions for common NeuroPulse issues

## 🚨 Critical Issues & Solutions

### **GitHub Authentication Problems**

#### **Problem**: `Personal access tokens (classic) are forbidden from accessing this repository`

```bash
# Error when pushing to Juspay repository
git push origin release
# remote: Personal access tokens (classic) are forbidden from accessing this repository.
# fatal: unable to access 'https://github.com/juspay/NeuroPulse.git/': The requested URL returned error: 403
```

**Root Cause**: Enterprise organizations (like Juspay) often restrict classic Personal Access Tokens for security reasons.

#### **Solutions**:

**Option 1: Use Fine-Grained Personal Access Tokens**
```bash
# 1. Create fine-grained token at: https://github.com/settings/personal-access-tokens/new
# 2. Select specific repository: juspay/NeuroPulse  
# 3. Grant permissions:
#    - Contents (read/write)
#    - Metadata (read)
#    - Pull requests (write)
#    - Issues (write) - optional

# 4. Update your token
export GITHUB_TOKEN="github_pat_11ABC123..."
git push origin release
```

**Option 2: Request Repository Access**
```bash
# Contact Juspay team for collaborator access
# Email: opensource@juspay.in
# Include: 
#   - Your GitHub username
#   - Required permissions (write access)
#   - Purpose (NeuroPulse development)
```

**Option 3: SSH Authentication**
```bash
# 1. Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your-email@company.com"

# 2. Add to GitHub account
cat ~/.ssh/id_ed25519.pub
# Copy output and add to: https://github.com/settings/ssh/new

# 3. Update remote URL
git remote set-url origin git@github.com:juspay/NeuroPulse.git

# 4. Test connection
ssh -T git@github.com
# Should show: "Hi username! You've successfully authenticated..."

# 5. Push changes
git push origin release
```

---

### **Shelly Integration Issues**

#### **Problem**: Shelly setup fails with authentication errors

```bash
shelly gh --force
# 🚀 GitHub Repository Setup
# ✅ Authenticated as: username
# ❌ GitHub setup failed: Failed to get repository info: Unsupported remote URL format
```

**Root Causes**:
1. Embedded token in remote URL
2. Classic token restrictions
3. Insufficient token permissions

#### **Solutions**:

**Step 1: Clean Remote URL**
```bash
# Check current remote
git remote -v

# If you see embedded token, clean it:
git remote set-url origin https://github.com/juspay/NeuroPulse.git

# Verify clean URL
git remote -v
# Should show: origin https://github.com/juspay/NeuroPulse.git (fetch/push)
```

**Step 2: Verify Token Permissions**
```bash
# 1. Check if token is set
echo $GITHUB_TOKEN  # Should not be empty

# 2. Test token validity
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/user

# 3. Check token scopes (should include: repo, workflow, admin:repo_hook)
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
     -I https://api.github.com/user | grep -i x-oauth-scopes
```

**Step 3: Use Organization-Compatible Token**
```bash
# Classic tokens may be restricted - create fine-grained token:
# 1. Go to: https://github.com/settings/personal-access-tokens/new
# 2. Select "Fine-grained personal access tokens"
# 3. Choose specific repository: juspay/NeuroPulse
# 4. Grant required permissions

# Set new token
export GITHUB_TOKEN="github_pat_11ABC123..."

# Re-run Shelly setup
shelly gh --force
```

**Step 4: Debug with Verbose Logging**
```bash
# Enable debug mode for detailed logs
DEBUG=* shelly gh --force 2>&1 | tee shelly-debug.log

# Review logs for specific error patterns
grep -i "error\|fail\|denied" shelly-debug.log
```

---

### **Daily Summary Generation Problems**

#### **Problem**: Summaries not being posted to Slack

**Symptoms**:
- `npm test` completes without errors but no Slack message appears
- Log shows "Summary generated successfully" but no delivery
- Slack webhook errors in logs

#### **Diagnostic Steps**:

```bash
# 1. Test individual components step by step
npm run test:jira     # Test Jira API connection
npm test              # Test complete summary generation flow

# 2. Check environment variables
echo "Jira Domain: $JIRA_DOMAIN"
echo "Slack Channel: $SLACK_CHANNEL_ID" 
echo "Bot Token: ${SLACK_BOT_TOKEN:0:12}..." # Shows first 12 chars only
```

#### **Common Causes & Fixes**:

**Issue 1: Jira Authentication Problems**
```bash
# Symptoms: "401 Unauthorized" or "403 Forbidden" from Jira API
# Solutions:

# 1. Verify domain format (no https://)
export JIRA_DOMAIN="company.atlassian.net"  # ✅ Correct
export JIRA_DOMAIN="https://company.atlassian.net"  # ❌ Wrong

# 2. Check API token validity
curl -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
     "https://$JIRA_DOMAIN/rest/api/3/myself"

# 3. Test project access
curl -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
     "https://$JIRA_DOMAIN/rest/api/3/project/$JIRA_PROJECT_KEY"
```

**Issue 2: Slack Bot Permissions**
```bash
# Symptoms: "missing_scope" or "channel_not_found" errors
# Solutions:

# 1. Verify bot permissions in Slack app settings
# Required scopes: chat:write, channels:read, users:read

# 2. Check if bot is added to target channel
# Go to Slack channel → Settings → Integrations → Add bot

# 3. Test bot token
curl -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
     "https://slack.com/api/auth.test"

# 4. Verify channel ID format
echo $SLACK_CHANNEL_ID  # Should be: C1234567890 (starts with C)
```

**Issue 3: Vertex AI Configuration**
```bash
# Symptoms: AI service errors or timeout issues
# Solutions:

# 1. Check Google Cloud authentication
gcloud auth list
gcloud config get-value project

# 2. Verify service account setup
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
gcloud auth application-default login

# 3. Test Vertex AI API access
gcloud ai models list --region=$VERTEX_AI_LOCATION

# 4. Check project permissions
gcloud projects get-iam-policy $GOOGLE_CLOUD_PROJECT --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount" --format="table(bindings.role)"
```

---

### **Vertex AI Processing Errors**

#### **Problem**: AI summary generation fails

**Common Error Messages**:
```bash
# Error 1: Authentication issues
"Error: Unable to authenticate with Vertex AI"

# Error 2: Permission denied
"Error: Permission 'aiplatform.endpoints.predict' denied"

# Error 3: API not enabled
"Error: Vertex AI API has not been used in project"
```

#### **Complete Setup Solutions**:

**Step 1: Enable Required APIs**
```bash
# Enable Vertex AI and dependencies
gcloud services enable aiplatform.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable storage.googleapis.com

# Verify enabled services
gcloud services list --enabled --filter="name:aiplatform"
```

**Step 2: Create Service Account with Proper Roles**
```bash
# 1. Create service account
gcloud iam service-accounts create neuropulse-ai \
  --description="NeuroPulse AI Service Account" \
  --display-name="NeuroPulse AI"

# 2. Grant required roles
gcloud projects add-iam-policy-binding $GOOGLE_CLOUD_PROJECT \
  --member="serviceAccount:neuropulse-ai@$GOOGLE_CLOUD_PROJECT.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding $GOOGLE_CLOUD_PROJECT \
  --member="serviceAccount:neuropulse-ai@$GOOGLE_CLOUD_PROJECT.iam.gserviceaccount.com" \
  --role="roles/ml.developer"

# 3. Download and set credentials
gcloud iam service-accounts keys create ~/neuropulse-key.json \
  --iam-account=neuropulse-ai@$GOOGLE_CLOUD_PROJECT.iam.gserviceaccount.com

export GOOGLE_APPLICATION_CREDENTIALS="$HOME/neuropulse-key.json"
```

**Step 3: Test Vertex AI Access**
```bash
# 1. Test authentication
gcloud auth application-default print-access-token

# 2. List available models
gcloud ai models list --region=$VERTEX_AI_LOCATION

# 3. Test prediction endpoint (if using specific models)
curl -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  "https://$VERTEX_AI_LOCATION-aiplatform.googleapis.com/v1/projects/$GOOGLE_CLOUD_PROJECT/locations/$VERTEX_AI_LOCATION/publishers/google/models/text-bison:predict" \
  -d '{"instances": [{"prompt": "Hello, world!"}]}'
```

---

### **Interactive Bot Issues (Socket Mode)**

#### **Problem**: Bot not responding to mentions

```bash
# You typed: @NeuroPulseBot help
# Expected: Bot response with command list
# Actual: No response, warning in logs
```

**Root Cause**: Socket Mode is not enabled in Slack app configuration.

**Evidence from logs**:
```
[WARN] web-api:WebClient:0 Socket Mode is not turned on.
```

#### **Solution: Enable Socket Mode**

**Step 1: Configure Slack App**
1. Visit: https://api.slack.com/apps
2. Select your NeuroPulse app
3. In left sidebar, click **"Socket Mode"**
4. Toggle **"Enable Socket Mode"** to ON
5. Note your App Token: `xapp-1-A09NETD9T98-...`

**Step 2: Configure Event Subscriptions**
1. Go to **"Event Subscriptions"** in left sidebar
2. Toggle **"Enable Events"** to ON
3. Under **"Subscribe to bot events"**, add:
   - `app_mention` - When bot is mentioned
   - `message.channels` - Messages in channels

**Step 3: Update Environment Variables**
```bash
# Add to your .env file:
SLACK_APP_TOKEN=xapp-1-A09NETD9T98-your-app-token
SLACK_SOCKET_MODE=true
```

**Step 4: Restart and Test**
```bash
# Restart the application
npm start

# Test in Slack
@NeuroPulseBot help
```

---

### **Build and Deployment Issues**

#### **Problem**: TypeScript compilation errors

**Common Errors**:
```bash
# Error 1: Type mismatches
src/services/aiService.ts:45:12 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'VertexAIRequest'

# Error 2: Missing dependencies
src/services/jiraService.ts:12:23 - error TS2307: Cannot find module '@atlaskit/jira-api'

# Error 3: Configuration issues
src/config/config.ts:15:5 - error TS2322: Type 'string | undefined' is not assignable to type 'string'
```

#### **Solutions**:

**Fix Type Issues**
```bash
# 1. Update TypeScript types
npm install --save-dev @types/node @types/express

# 2. Check type definitions
npm run type-check

# 3. Fix configuration types
# Add proper type guards in config.ts:
if (!process.env.JIRA_DOMAIN) {
  throw new Error('JIRA_DOMAIN environment variable is required');
}
```

**Fix Dependencies**
```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Check for missing dependencies
npm audit
npm run build

# 3. Update dependencies if needed
npm update
```

---

### **Environment Configuration Issues**

#### **Problem**: Environment variables not loading

**Symptoms**:
- `undefined` values in config
- "Required environment variable missing" errors
- Services failing to authenticate

#### **Solutions**:

**Step 1: Verify .env File**
```bash
# 1. Check if .env exists
ls -la .env

# 2. Verify format (no spaces around =)
cat .env | grep -E '^\s*[A-Z_]+=.*'  # Should show all your variables

# 3. Test variable loading
node -e "require('dotenv').config(); console.log(process.env.JIRA_DOMAIN);"
```

**Step 2: Check File Permissions**
```bash
# Ensure .env is readable
chmod 600 .env

# Verify ownership
ls -la .env
```

**Step 3: Environment-Specific Issues**
```bash
# Production: Use system environment variables
export JIRA_DOMAIN="company.atlassian.net"
export SLACK_BOT_TOKEN="xoxb-..."

# Development: Ensure dotenv loads first
# Add to top of index.ts:
require('dotenv').config();
```

---

### **🆘 Emergency Procedures**

#### **Critical Production Issues**

**Immediate Response**:
```bash
# 1. Check system status
ps aux | grep node  # Check if NeuroPulse is running
pm2 list  # If using PM2

# 2. Review recent logs
tail -f logs/neuropulse.log
journalctl -u neuropulse --since "1 hour ago"  # If using systemd

# 3. Check disk space and memory
df -h  # Disk usage
free -h  # Memory usage

# 4. Restart services
pm2 restart neuropulse
# OR
sudo systemctl restart neuropulse
```

**Rollback Procedure**:
```bash
# If recent deployment broke functionality
git log --oneline -10  # Find last working commit

# Checkout last working version
git checkout <working-commit-hash>

# Rebuild and restart
npm install
npm run build
pm2 restart neuropulse

# Or deploy specific version
git checkout v1.2.3  # Last known good version
npm run deploy
```

**Communication**:
```bash
# 1. Notify team immediately
# Email: opensource@juspay.in
# Slack: #neuropulse-dev (if available)

# 2. Document incident
echo "$(date): Production issue - $(describe issue)" >> incidents.log

# 3. Create post-mortem ticket
# Include: timeline, root cause, resolution steps
```

---

### **Performance Optimization**

#### **Slow Summary Generation**

**Diagnostic Commands**:
```bash
# 1. Time the full process
time npm test

# 2. Profile individual components
NODE_ENV=development npm run profile

# 3. Check API response times
curl -w "Total time: %{time_total}s\n" \
  -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  "https://$JIRA_DOMAIN/rest/api/3/search?jql=project=$JIRA_PROJECT_KEY"
```

**Optimization Steps**:
```bash
# 1. Implement caching
redis-cli ping  # Check Redis availability
npm install redis

# 2. Optimize Jira queries
# Use field limiting: &fields=summary,status,assignee
# Add date ranges: AND updated >= -7d

# 3. Batch AI requests
# Group similar issues for single AI call
# Implement request queuing
```

---

### **MCP Server Connection Issues**

#### **Problem**: MCP (Model Context Protocol) initialization fails

**Common Error Messages**:
```bash
# Error 1: MCP server discovery fails
"Error: Failed to discover MCP servers: Connection timeout"

# Error 2: Tool registration errors
"Error: MCP tool registration failed: Invalid tool schema"

# Error 3: External server connection issues
"Error: External MCP server 'filesystem' not responding"

# Error 4: Circuit breaker activation
"Warning: MCP circuit breaker activated due to repeated failures"
```

**Root Causes**:
1. External MCP servers not properly configured
2. Network connectivity issues with MCP endpoints
3. Invalid MCP server configurations
4. Tool schema validation failures

#### **Diagnostic Steps**:

```bash
# 1. Check MCP server status
node -e "
const { NeuroLink } = require('@juspay/neurolink');
const neurolink = new NeuroLink();
neurolink.getMCPStatus().then(status => {
  console.log('MCP Status:', JSON.stringify(status, null, 2));
}).catch(err => console.error('MCP Error:', err.message));
"

# 2. Test specific MCP server connectivity
node -e "
const { NeuroLink } = require('@juspay/neurolink');
const neurolink = new NeuroLink();
neurolink.testMCPServer('filesystem').then(result => {
  console.log('Filesystem server test:', result);
}).catch(err => console.error('Test failed:', err.message));
"

# 3. List available MCP servers
node -e "
const { NeuroLink } = require('@juspay/neurolink');
const neurolink = new NeuroLink();
neurolink.listMCPServers().then(servers => {
  console.log('Available servers:', servers.map(s => s.id));
}).catch(err => console.error('List failed:', err.message));
"
```

#### **Common Solutions**:

**Issue 1: External MCP Server Not Found**
```bash
# Symptoms: "External MCP server 'serverId' not found"
# Solution: Verify server configuration

# 1. Check .mcp-config.json exists
ls -la .mcp-config.json

# 2. Validate JSON syntax
cat .mcp-config.json | jq '.'

# 3. Example valid configuration:
cat > .mcp-config.json << 'EOF'
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/directory"],
      "transport": "stdio"
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "transport": "stdio",
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
EOF
```

**Issue 2: MCP Tool Registration Failures**
```bash
# Symptoms: "Tool registration failed: Invalid schema"
# Solution: Verify tool schema compliance

# 1. Test tool schema validation
node -e "
const { NeuroLink } = require('@juspay/neurolink');
const neurolink = new NeuroLink();

// Example valid tool registration
const testTool = {
  name: 'test_tool',
  description: 'A test tool',
  inputSchema: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Test message'
      }
    },
    required: ['message']
  }
};

try {
  neurolink.registerTool('test_tool', testTool);
  console.log('Tool registration successful');
} catch (error) {
  console.error('Registration failed:', error.message);
}
"

# 2. Validate existing tools
node -e "
const { NeuroLink } = require('@juspay/neurolink');
const neurolink = new NeuroLink();
const tools = neurolink.getCustomTools();
console.log('Registered tools:', Array.from(tools.keys()));
"
```

**Issue 3: Network Connectivity Problems**
```bash
# Symptoms: Connection timeouts, network errors
# Solutions:

# 1. Test network connectivity
ping -c 3 api.github.com  # For GitHub MCP servers
curl -I https://registry.npmjs.org  # For NPM-based servers

# 2. Check proxy settings (if behind corporate firewall)
echo "HTTP_PROXY: $HTTP_PROXY"
echo "HTTPS_PROXY: $HTTPS_PROXY"
echo "NO_PROXY: $NO_PROXY"

# 3. Configure proxy for MCP servers
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
export NO_PROXY=localhost,127.0.0.1

# 4. Test with explicit timeout settings
node -e "
const { NeuroLink } = require('@juspay/neurolink');
const neurolink = new NeuroLink();
// Set longer timeout for slow networks
process.env.MCP_TIMEOUT = '30000';  // 30 seconds
"
```

**Issue 4: Circuit Breaker Activation**
```bash
# Symptoms: "Circuit breaker activated", "MCP temporarily disabled"
# Solutions:

# 1. Reset circuit breaker manually
node -e "
const { NeuroLink } = require('@juspay/neurolink');
const neurolink = new NeuroLink();
// Circuit breaker resets automatically after cooldown period
// Or restart the application to force reset
console.log('Restarting to reset circuit breaker...');
"

# 2. Check circuit breaker status
node -e "
const { NeuroLink } = require('@juspay/neurolink');
const neurolink = new NeuroLink();
neurolink.getMCPStatus().then(status => {
  if (status.error) {
    console.log('Circuit breaker active:', status.error);
  } else {
    console.log('Circuit breaker status: Normal');
  }
});
"

# 3. Increase circuit breaker thresholds (if needed)
# Add to environment variables:
export MCP_CIRCUIT_BREAKER_THRESHOLD=10  # Default: 5
export MCP_CIRCUIT_BREAKER_TIMEOUT=60000  # Default: 30000ms
```

#### **Advanced MCP Debugging**

```bash
# 1. Enable verbose MCP logging
export DEBUG=mcp:*
npm start

# 2. Test individual MCP components
node -e "
const { initializeMCPEcosystem, listMCPs } = require('@juspay/neurolink');

async function debugMCP() {
  try {
    console.log('Initializing MCP ecosystem...');
    await initializeMCPEcosystem();
    
    console.log('Listing available MCPs...');
    const mcps = await listMCPs();
    console.log('Found MCPs:', mcps.length);
    
    mcps.forEach(mcp => {
      console.log(\`- \${mcp.name}: \${mcp.status}\`);
    });
  } catch (error) {
    console.error('MCP Debug Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugMCP();
"

# 3. Monitor MCP server processes
ps aux | grep -i mcp  # Check for running MCP server processes
lsof -i :*  # Check for open ports used by MCP servers

# 4. Test MCP server isolation
node -e "
const { NeuroLink } = require('@juspay/neurolink');
const neurolink = new NeuroLink();

// Test servers individually
const serverIds = ['filesystem', 'github', 'weather'];
serverIds.forEach(async (serverId) => {
  try {
    const result = await neurolink.testMCPServer(serverId);
    console.log(\`\${serverId}: \${result ? 'OK' : 'FAILED'}\`);
  } catch (error) {
    console.log(\`\${serverId}: ERROR - \${error.message}\`);
  }
});
"
```

#### **MCP Configuration Validation**

```bash
# 1. Validate .mcp-config.json schema
node -e "
const fs = require('fs');
const path = require('path');

try {
  const configPath = '.mcp-config.json';
  if (!fs.existsSync(configPath)) {
    console.log('No .mcp-config.json found - using defaults');
    process.exit(0);
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  // Validate required structure
  if (!config.mcpServers) {
    throw new Error('Missing mcpServers section');
  }
  
  // Validate each server
  for (const [serverId, serverConfig] of Object.entries(config.mcpServers)) {
    if (!serverConfig.command) {
      throw new Error(\`Server '\${serverId}' missing command\`);
    }
    if (!serverConfig.transport) {
      throw new Error(\`Server '\${serverId}' missing transport\`);
    }
    console.log(\`✅ Server '\${serverId}' configuration valid\`);
  }
  
  console.log('✅ MCP configuration validation passed');
} catch (error) {
  console.error('❌ MCP configuration validation failed:', error.message);
  process.exit(1);
}
"

# 2. Test server executable availability
node -e "
const { execSync } = require('child_process');
const config = require('./.mcp-config.json');

for (const [serverId, serverConfig] of Object.entries(config.mcpServers || {})) {
  try {
    // Test if command is available
    execSync(\`which \${serverConfig.command}\`, { stdio: 'ignore' });
    console.log(\`✅ Command '\${serverConfig.command}' for server '\${serverId}' is available\`);
  } catch (error) {
    console.log(\`❌ Command '\${serverConfig.command}' for server '\${serverId}' not found\`);
  }
}
"
```

---

### **NeuroLink + MCP Integration Errors**

#### **Problem**: NeuroLink MCP initialization and integration failures

**Common Error Messages**:
```bash
# Error 1: NeuroLink MCP initialization failed
"[NeuroLink] MCP initialization failed"

# Error 2: NeuroLink configuration loading failed  
"[NeuroLink] MCP configuration loading failed"

# Error 3: External server registration failed
"[NeuroLink] Failed to add external MCP server: serverId"

# Error 4: Tool execution through NeuroLink failed
"[NeuroLink] External MCP tool execution failed: toolName"

# Error 5: NeuroLink MCP not available
"[NeuroLink] ⚠️ LOG_POINT_T004_MCP_NOT_AVAILABLE"

# Error 6: Cannot execute external MCP tool
"Cannot execute external MCP tool: NeuroLink executeExternalMCPTool not available"
```

**Root Causes**:
1. NeuroLink initialization sequence issues
2. Incompatible NeuroLink + MCP configuration
3. External server manager failures
4. Tool registry synchronization problems
5. NeuroLink instance not properly initialized

#### **Diagnostic Steps**:

```bash
# 1. Check NeuroLink MCP initialization status
node -e "
const { NeuroLink } = require('@juspay/neurolink');

async function checkNeuroLinkMCP() {
  try {
    const neurolink = new NeuroLink();
    
    // Wait for initialization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🔍 Checking NeuroLink MCP Status...');
    const status = await neurolink.getMCPStatus();
    
    console.log('NeuroLink MCP Status:', {
      mcpInitialized: status.mcpInitialized,
      totalServers: status.totalServers,
      totalTools: status.totalTools,
      externalMCPServersCount: status.externalMCPServersCount,
      error: status.error
    });
    
    if (!status.mcpInitialized) {
      console.error('❌ NeuroLink MCP not properly initialized');
      console.log('💡 This indicates a NeuroLink-specific MCP integration issue');
    }
    
    await neurolink.shutdown();
  } catch (error) {
    console.error('❌ NeuroLink MCP check failed:', error.message);
  }
}

checkNeuroLinkMCP();
"

# 2. Test NeuroLink external server management
node -e "
const { NeuroLink } = require('@juspay/neurolink');

async function testNeuroLinkExternalServers() {
  try {
    const neurolink = new NeuroLink();
    
    console.log('🔍 Testing NeuroLink External Server Management...');
    
    // List external servers
    const servers = neurolink.listExternalMCPServers();
    console.log('External servers:', servers.length);
    
    // Get external tools
    const tools = neurolink.getExternalMCPTools();
    console.log('External tools:', tools.length);
    
    // Get statistics
    const stats = neurolink.getExternalMCPStatistics();
    console.log('Statistics:', stats);
    
    await neurolink.shutdown();
  } catch (error) {
    console.error('❌ NeuroLink external server test failed:', error.message);
  }
}

testNeuroLinkExternalServers();
"

# 3. Test NeuroLink tool execution capabilities
node -e "
const { NeuroLink } = require('@juspay/neurolink');

async function testNeuroLinkToolExecution() {
  try {
    const neurolink = new NeuroLink();
    
    console.log('🔍 Testing NeuroLink Tool Execution...');
    
    // Get custom tools
    const customTools = neurolink.getCustomTools();
    console.log('Custom tools registered:', customTools.size);
    
    // List tool names
    for (const [name, tool] of customTools) {
      console.log(\`- Tool: \${name}\`);
    }
    
    await neurolink.shutdown();
  } catch (error) {
    console.error('❌ NeuroLink tool execution test failed:', error.message);
  }
}

testNeuroLinkToolExecution();
"
```

#### **Common Solutions**:

**Issue 1: NeuroLink MCP Initialization Failed**
```bash
# Symptoms: "MCP initialization failed", startup hangs
# Solution: Check NeuroLink initialization sequence

# 1. Verify NeuroLink installation
npm list @juspay/neurolink
# Should show installed version

# 2. Test minimal NeuroLink initialization
node -e "
const { NeuroLink } = require('@juspay/neurolink');

async function testMinimalInit() {
  try {
    console.log('Creating NeuroLink instance...');
    const neurolink = new NeuroLink();
    
    console.log('✅ NeuroLink instance created successfully');
    
    // Graceful shutdown
    await neurolink.shutdown();
    console.log('✅ NeuroLink shutdown completed');
  } catch (error) {
    console.error('❌ NeuroLink minimal init failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testMinimalInit();
"

# 3. Clear any cached NeuroLink state
rm -rf .neurolink-cache/ || true
rm -rf node_modules/.cache/@juspay/ || true

# 4. Reinstall NeuroLink if needed
npm uninstall @juspay/neurolink
npm install @juspay/neurolink
```

**Issue 2: NeuroLink Configuration Conflicts**
```bash
# Symptoms: Configuration loading errors, server conflicts
# Solution: Validate NeuroLink-specific MCP configuration

# 1. Check for conflicting configurations
ls -la .mcp-config.json .neurolink-config.json || true

# 2. Validate NeuroLink configuration format
node -e "
const fs = require('fs');

try {
  // Check for NeuroLink-specific configuration
  if (fs.existsSync('.neurolink-config.json')) {
    const config = JSON.parse(fs.readFileSync('.neurolink-config.json', 'utf8'));
    console.log('✅ NeuroLink config found and valid');
    console.log('Config keys:', Object.keys(config));
  } else {
    console.log('ℹ️ No .neurolink-config.json found (using defaults)');
  }
  
  // Check standard MCP config compatibility with NeuroLink
  if (fs.existsSync('.mcp-config.json')) {
    const mcpConfig = JSON.parse(fs.readFileSync('.mcp-config.json', 'utf8'));
    console.log('✅ MCP config found');
    
    // Validate NeuroLink compatibility
    if (mcpConfig.mcpServers) {
      for (const [serverId, config] of Object.entries(mcpConfig.mcpServers)) {
        if (!config.command || !config.transport) {
          console.warn(\`⚠️ Server '\${serverId}' may not be NeuroLink compatible\`);
        }
      }
    }
  }
} catch (error) {
  console.error('❌ Configuration validation failed:', error.message);
}
"

# 3. Create minimal NeuroLink-compatible MCP configuration
cat > .mcp-config.json << 'EOF'
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
      "transport": "stdio"
    }
  }
}
EOF
```

**Issue 3: External Server Manager Failures**
```bash
# Symptoms: "Failed to add external MCP server", server management errors
# Solution: Test and repair external server management

# 1. Test external server manager directly
node -e "
const { NeuroLink } = require('@juspay/neurolink');

async function testExternalServerManager() {
  try {
    const neurolink = new NeuroLink();
    
    console.log('🔍 Testing External Server Manager...');
    
    // Test adding a simple external server
    const testConfig = {
      id: 'test-server',
      name: 'Test Server',
      command: 'echo',
      args: ['{}'],
      transport: 'stdio'
    };
    
    console.log('Adding test server...');
    const addResult = await neurolink.addExternalMCPServer('test-server', testConfig);
    
    if (addResult.success) {
      console.log('✅ External server added successfully');
      
      // Clean up
      await neurolink.removeExternalMCPServer('test-server');
      console.log('✅ External server removed successfully');
    } else {
      console.error('❌ Failed to add external server:', addResult.error);
    }
    
    await neurolink.shutdown();
  } catch (error) {
    console.error('❌ External server manager test failed:', error.message);
  }
}

testExternalServerManager();
"

# 2. Check for external server process conflicts
ps aux | grep -i mcp | grep -v grep || echo "No MCP processes found"

# 3. Clear external server cache
rm -rf /tmp/neurolink-external-servers/ || true
```

**Issue 4: Tool Registry Synchronization Problems**
```bash
# Symptoms: Tools not available, registry conflicts
# Solution: Reset and test tool registry

# 1. Test tool registry operations
node -e "
const { NeuroLink } = require('@juspay/neurolink');

async function testToolRegistry() {
  try {
    const neurolink = new NeuroLink();
    
    console.log('🔍 Testing Tool Registry...');
    
    // Register a test tool
    const testTool = {
      name: 'test_tool',
      description: 'A test tool for registry validation',
      inputSchema: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        },
        required: ['message']
      }
    };
    
    console.log('Registering test tool...');
    neurolink.registerTool('test_tool', testTool);
    
    // Check if tool is registered
    const customTools = neurolink.getCustomTools();
    if (customTools.has('test_tool')) {
      console.log('✅ Tool registry working correctly');
    } else {
      console.error('❌ Tool not found in registry');
    }
    
    await neurolink.shutdown();
  } catch (error) {
    console.error('❌ Tool registry test failed:', error.message);
  }
}

testToolRegistry();
"

# 2. Reset tool registry cache
node -e "
const { NeuroLink } = require('@juspay/neurolink');

async function resetToolRegistry() {
  try {
    const neurolink = new NeuroLink();
    
    console.log('🔄 Resetting tool registry...');
    
    // Get current tools
    const tools = neurolink.getCustomTools();
    console.log(\`Current tools: \${tools.size}\`);
    
    // Force re-initialization
    await neurolink.shutdown();
    console.log('✅ Tool registry reset completed');
  } catch (error) {
    console.error('❌ Tool registry reset failed:', error.message);
  }
}

resetToolRegistry();
"
```

**Issue 5: NeuroLink Instance Not Available**
```bash
# Symptoms: "NeuroLink executeExternalMCPTool not available"
# Solution: Verify NeuroLink instance lifecycle

# 1. Test NeuroLink instance lifecycle
node -e "
const { NeuroLink } = require('@juspay/neurolink');

async function testInstanceLifecycle() {
  let neurolink;
  
  try {
    console.log('🔍 Testing NeuroLink Instance Lifecycle...');
    
    // Create instance
    console.log('1. Creating NeuroLink instance...');
    neurolink = new NeuroLink();
    
    // Wait for full initialization
    console.log('2. Waiting for initialization...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test basic functionality
    console.log('3. Testing basic functionality...');
    const status = await neurolink.getMCPStatus();
    console.log('Status check:', status.mcpInitialized ? '✅' : '❌');
    
    // Test external tool capabilities
    console.log('4. Testing external tool capabilities...');
    const externalTools = neurolink.getExternalMCPTools();
    console.log(\`External tools available: \${externalTools.length}\`);
    
    console.log('✅ NeuroLink instance lifecycle test completed');
    
  } catch (error) {
    console.error('❌ Instance lifecycle test failed:', error.message);
  } finally {
    if (neurolink) {
      try {
        await neurolink.shutdown();
        console.log('✅ Graceful shutdown completed');
      } catch (shutdownError) {
        console.error('⚠️ Shutdown error:', shutdownError.message);
      }
    }
  }
}

testInstanceLifecycle();
"

# 2. Check for memory leaks or hanging processes
node -e "
process.on('exit', () => {
  console.log('✅ Node.js process exiting cleanly');
});

setTimeout(() => {
  console.log('⚠️ Process still running after 10 seconds - possible hanging');
  process.exit(1);
}, 10000);

const { NeuroLink } = require('@juspay/neurolink');
const neurolink = new NeuroLink();

setTimeout(async () => {
  await neurolink.shutdown();
  console.log('✅ Test completed');
  process.exit(0);
}, 5000);
"
```

#### **Advanced NeuroLink MCP Debugging**

```bash
# 1. Enable comprehensive NeuroLink debugging
export DEBUG=neurolink:*,mcp:*
export LOG_LEVEL=debug

# 2. Monitor NeuroLink events
node -e "
const { NeuroLink } = require('@juspay/neurolink');

async function monitorNeuroLinkEvents() {
  try {
    const neurolink = new NeuroLink();
    
    // Listen to NeuroLink events
    const emitter = neurolink.getEventEmitter();
    
    emitter.on('tool:start', (event) => {
      console.log('🚀 Tool started:', event.toolName);
    });
    
    emitter.on('tool:end', (event) => {
      console.log('✅ Tool completed:', event.toolName, event.success ? 'SUCCESS' : 'FAILED');
    });
    
    emitter.on('error', (error) => {
      console.error('❌ NeuroLink error:', error);
    });
    
    // External MCP events
    emitter.on('externalMCP:serverConnected', (event) => {
      console.log('🔗 External MCP server connected:', event.serverId);
    });
    
    emitter.on('externalMCP:serverDisconnected', (event) => {
      console.log('💔 External MCP server disconnected:', event.serverId);
    });
    
    emitter.on('externalMCP:serverFailed', (event) => {
      console.error('💥 External MCP server failed:', event.serverId, event.error);
    });
    
    console.log('🎧 Monitoring NeuroLink events for 30 seconds...');
    
    setTimeout(async () => {
      await neurolink.shutdown();
      console.log('✅ Event monitoring completed');
    }, 30000);
    
  } catch (error) {
    console.error('❌ Event monitoring failed:', error.message);
  }
}

monitorNeuroLinkEvents();
"

# 3. Test NeuroLink with NeuroPulse integration
node -e "
// Test NeuroLink integration within NeuroPulse context
const { NeuroLink } = require('@juspay/neurolink');

async function testNeuroPulseIntegration() {
  try {
    console.log('🔍 Testing NeuroLink integration in NeuroPulse context...');
    
    const neurolink = new NeuroLink();
    
    // Test AI generation with MCP tools
    const testPrompt = 'What time is it?';
    
    try {
      const result = await neurolink.generate({
        text: testPrompt,
        disableTools: false  // Enable MCP tools
      });
      
      console.log('✅ NeuroLink generation successful');
      console.log('Response length:', result.content.length);
    } catch (genError) {
      console.error('❌ NeuroLink generation failed:', genError.message);
    }
    
    await neurolink.shutdown();
    
  } catch (error) {
    console.error('❌ NeuroPulse integration test failed:', error.message);
  }
}

testNeuroPulseIntegration();
"
```

---

### **Monitoring and Logging**

#### **Enable Comprehensive Logging**

```bash
# 1. Set log level
export LOG_LEVEL=debug  # Options: error, warn, info, debug

# 2. Configure log rotation
npm install winston winston-daily-rotate-file

# 3. Monitor key metrics
echo "Summary generation time: $(date)" >> metrics.log

# 4. Enable MCP-specific logging
export DEBUG=mcp:*,neurolink:mcp:*

# 5. Enable NeuroLink-specific debugging
export DEBUG=neurolink:*,mcp:*
export NEUROLINK_DEBUG=true
```

#### **Health Check Endpoint**

```bash
# Create health check
curl http://localhost:3000/health
# Expected: {"status": "healthy", "timestamp": "2025-11-05T..."}

# Monitor dependencies
curl http://localhost:3000/health/jira
curl http://localhost:3000/health/slack
curl http://localhost:3000/health/vertex
```

---

## 📞 **Getting Help**

### **Contact Information**
- **Team Lead**: opensource@juspay.in
- **Documentation**: [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Issues**: https://github.com/juspay/NeuroPulse/issues
- **Internal Slack**: #neuropulse-dev

### **When to Escalate**
- Production daily summaries failing for > 2 hours
- Security-related authentication issues
- Data corruption or loss
- Multiple team members affected

### **Information to Include**
1. **Error messages** (exact text with timestamps)
2. **Steps to reproduce** the issue
3. **Environment details** (OS, Node.js version, deployment method)
4. **Recent changes** (deployments, config updates)
5. **Log snippets** (relevant portions only)

---

## 📚 **Additional Resources**

- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Slack API Documentation](https://api.slack.com/docs)
- [Jira REST API Guide](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [GitHub Fine-grained PAT Guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [NeuroPulse Contributing Guide](./CONTRIBUTING.md)
- [Commit Policy](./COMMIT_POLICY.md)

---

**Last Updated**: November 2025  
**Version**: 2.0  
**Maintained by**: Juspay Engineering Team
