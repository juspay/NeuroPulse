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

### **Monitoring and Logging**

#### **Enable Comprehensive Logging**

```bash
# 1. Set log level
export LOG_LEVEL=debug  # Options: error, warn, info, debug

# 2. Configure log rotation
npm install winston winston-daily-rotate-file

# 3. Monitor key metrics
echo "Summary generation time: $(date)" >> metrics.log
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
