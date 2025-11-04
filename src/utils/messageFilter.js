export class MessageFilter {
  constructor() {
    this.workKeywords = [
      // Code & Development
      'pr review', 'pull request', 'review', 'merge', 'deploy', 'deployment',
      'bug', 'issue', 'fix', 'hotfix', 'feature', 'task', 'sprint', 'standup',
      'blocker', 'blocked', 'testing', 'test', 'qa', 'production', 'staging',
      'release', 'build', 'integration', 'api', 'database', 'server', 'service',
      'monitoring', 'alert', 'error', 'exception', 'investigation', 'analysis',
      'development', 'coding', 'implementation', 'design', 'architecture',
      'migration', 'upgrade', 'optimization', 'performance', 'security',
      
      // Project Management
      'jira', 'ticket', 'story', 'epic', 'backlog', 'planning', 'estimate',
      'completed', 'done', 'finished', 'progress', 'working on', 'started',
      'pending', 'todo', 'next', 'deadline', 'due', 'schedule', 'meeting',
      'sync', 'discussion', 'decision', 'requirement', 'specification',
      
      // Technical Terms from Slack data
      'payment', 'gateway', 'authentication', 'login', 'checkout', 'order',
      'merchant', 'shopify', 'razorpay', 'payu', 'easebuzz', 'upi', 'card',
      'shipping', 'address', 'inventory', 'config', 'dashboard', 'analytics',
      'webhook', 'ssl', 'tls', 'timeout', 'latency', 'pod', 'aws', 'gcp',
      'beta', 'prod', 'environment', 'token', 'signature', 'validation',
      'refund', 'transaction', 'failure', 'success rate', 'conversion',
      'automatic', 'lighthouse', 'vayu', 'nimble', 'clairvoyance',
      'onboarding', 'migration', 'smb', 'jb', 'breeze', 'atom',
      
      // Design & Development Tools
      'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'xd',
      'zeplin', 'invision', 'framer', 'principle', 'prototype', 'wireframe',
      'mockup', 'design system', 'ui', 'ux', 'frontend', 'backend',
      
      // Technical Issues
      'failing', 'broken', 'blocked', 'not working', 'error message', 'invalid',
      'unable to', 'issue with', 'problem', 'stuck', 'crash', 'down',
      'p0', 'priority', 'urgent', 'asap', 'critical', 'blocker',
      'investigation', 'debug', 'check', 'resolve', 'urgent',
      
      // AI & Tools
      'mcp', 'neurolink', 'ai agent', 'hackathon', 'kavach',
      'csv', 'data extraction', 'portal', 'rendering', 'whitelist', 'csp',
      'gemini', 'openai', 'gpt', 'claude', 'azure', 'vertex',
      
      // Business Terms
      'customer', 'user', 'client', 'revenue', 'sales', 'orders',
      'conversion rate', 'success rate', 'gmv', 'aov', 'roas'
    ];

    this.irrelevantPatterns = [
      // Food & Social
      /food|snacks|sweets|chocolate|cake|birthday|happy birthday|party|celebration/i,
      /behind.*desk|help yourselves|grab|modak|prasad|roshogolla/i,
      /thekua|rasgulla|homemade|bihar|kolkata/i,
      
      // Personal & Social
      /getting married|personal|vacation|enjoying|left.*laptop|laptop.*open/i,
      /townhall|meet\.google\.com|joining.*call|elimination drive/i,
      /congratulations|congrats|anniversary|years.*in|completed.*years/i,
      
      // Casual conversations
      /good morning|good evening|hello|hi team|hey team/i,
      /joined.*channel|left.*channel|added.*to.*channel/i,
      /deleted.*message|this message was deleted/i,
      
      // Non-work emojis and reactions
      /:\w+:/,  // Emoji reactions
      /^[.!@#$%^&*()_+=\-\[\]{};':"\\|,.<>\/?]*$/,  // Only special characters
      /^(yes|no|ok|okay|ack|thanks|thank you)$/i  // Short acknowledgments
    ];
  }

  filterRelevantMessages(messages) {
    return messages.filter(message => {
      const text = (message.text || '').toLowerCase();
      
      // Filter out irrelevant patterns
      if (this.irrelevantPatterns.some(pattern => pattern.test(text))) {
        return false;
      }
      
      // Include messages with work keywords or thread replies
      return this.workKeywords.some(keyword => text.includes(keyword)) || 
             message.thread_ts || 
             text.length > 50; // Include longer messages as they're likely work-related
    });
  }

  async groupMessagesByUser(messages, slackService) {
    const userMessages = {};
    
    for (const message of messages) {
      if (!message.user || message.user === 'USLACKBOT') continue;
      
      if (!userMessages[message.user]) {
        // Fetch real username from Slack API
        try {
          const userInfo = await slackService.fetchUserInfo(message.user);
          const displayName = userInfo.real_name || userInfo.display_name || message.user;
          userMessages[message.user] = {
            messages: [],
            displayName: displayName
          };
          console.log(`👤 Found user: ${displayName} (${message.user})`);
        } catch (error) {
          console.log(`⚠️ Could not fetch user info for ${message.user}, using ID`);
          userMessages[message.user] = {
            messages: [],
            displayName: message.user
          };
        }
      }
      userMessages[message.user].messages.push(message.text);
    }

    return userMessages;
  }

  buildUserContext(userMessages) {
    let userContext = "";
    for (const [userId, userData] of Object.entries(userMessages)) {
      userContext += `\nUser ${userData.displayName} (${userId}):\n`;
      userData.messages.forEach(msg => {
        userContext += `- ${msg}\n`;
      });
    }
    return userContext;
  }
}
