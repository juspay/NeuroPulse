import { SocketModeClient } from '@slack/socket-mode';
import { WebClient } from '@slack/web-api';
import { DailySummaryApp } from '../dailySummaryApp.js';
import { config } from '../config/config.js';

export class InteractiveBotService {
  constructor() {
    this.socketModeClient = new SocketModeClient({ 
      appToken: config.slack.appToken 
    });
    this.webClient = new WebClient(config.slack.botToken);
    this.dailySummaryApp = new DailySummaryApp();
    this.botUserId = null;
    this.processedMessages = new Set(); // Prevent duplicate responses
  }

  async start() {
    try {
      console.log('🤖 Starting Interactive Bot Service...');
      
      // Get bot's own user ID
      const authResult = await this.webClient.auth.test();
      this.botUserId = authResult.user_id;
      console.log(`🤖 Bot User ID: ${this.botUserId}`);

      // Listen for app mentions only (removes duplicates)
      this.socketModeClient.on('app_mention', async ({ event, ack }) => {
        await ack();
        await this.handleMention(event);
      });

      // Start the socket connection
      await this.socketModeClient.start();
      console.log('✅ Interactive Bot Service started - listening for mentions!');
      
    } catch (error) {
      console.error('❌ Failed to start Interactive Bot Service:', error.message);
      throw error;
    }
  }

  async handleMention(event) {
    try {
      console.log(`🔔 Bot mentioned in channel ${event.channel}`);
      console.log(`📝 Message: ${event.text}`);

      // Only respond in the designated summary channel
      if (event.channel !== config.slack.summaryChannelId) {
        console.log(`⏭️ Ignoring mention in channel ${event.channel}, only responding in ${config.slack.summaryChannelId}`);
        return;
      }

      // Create unique message ID to prevent duplicates
      const messageId = `${event.channel}-${event.ts}`;
      
      if (this.processedMessages.has(messageId)) {
        console.log('⏭️ Message already processed, skipping...');
        return;
      }
      
      // Mark message as processed
      this.processedMessages.add(messageId);
      
      // Clean up old processed messages (keep only last 100)
      if (this.processedMessages.size > 100) {
        const oldestEntries = Array.from(this.processedMessages).slice(0, 50);
        oldestEntries.forEach(id => this.processedMessages.delete(id));
      }

      const { requestType, targetUser, timeframe } = this.parseMessage(event.text);
      
      if (!requestType) {
        await this.sendHelpMessage(event.channel);
        return;
      }

      await this.sendTypingIndicator(event.channel);

      let response;
      switch (requestType) {
        case 'user_status':
          response = await this.generateUserStatus(targetUser, timeframe);
          break;
        case 'team_status':
          response = await this.generateTeamStatus();
          break;
        case 'help':
          response = this.getHelpMessage();
          break;
        default:
          response = "🤔 I didn't understand that request. Type `@bot help` for available commands.";
      }

      await this.sendResponse(event.channel, response);

    } catch (error) {
      console.error('❌ Error handling mention:', error.message);
      await this.sendResponse(event.channel, "❌ Sorry, I encountered an error processing your request.");
    }
  }

  parseMessage(text) {
    const cleanText = text.toLowerCase()
      .replace(/<@[^>]+>/g, '') // Remove user mentions
      .replace(/[^\w\s@]/g, ' ') // Remove special chars except @
      .replace(/\s+/g, ' ')      // Normalize spaces
      .trim();

    console.log(`🔍 Parsing message: "${cleanText}"`);

    // Extract target user from @mentions
    const userMentions = text.match(/<@([UW][A-Z0-9]+)>/g);
    const targetUser = userMentions && userMentions.length > 1 ? 
      userMentions[1].replace(/[<@>]/g, '') : null;

    // Determine request type and timeframe
    if (cleanText.includes('help')) {
      return { requestType: 'help' };
    }

    if (cleanText.includes('team') || cleanText.includes('everyone')) {
      return { requestType: 'team_status' };
    }

    if (targetUser || cleanText.match(/\b(status|update|progress|summary)\b/)) {
      const timeframe = this.extractTimeframe(cleanText);
      return { 
        requestType: 'user_status', 
        targetUser, 
        timeframe 
      };
    }

    return { requestType: null };
  }

  extractTimeframe(text) {
    if (text.includes('yesterday')) return 'yesterday';
    if (text.includes('week') || text.includes('7 day')) return 'week';
    if (text.includes('sprint')) return 'sprint';
    return 'today'; // default
  }

  async generateUserStatus(targetUserId, timeframe = 'today') {
    try {
      if (!targetUserId) {
        return "📝 Please mention a specific user like: `@bot @username` or `@bot status for @username`";
      }

      // Get user info
      const userInfo = await this.webClient.users.info({ user: targetUserId });
      const userName = userInfo.user.real_name || userInfo.user.name;

      console.log(`📊 Generating ${timeframe} status for ${userName} (${targetUserId})`);

      // Get date range for timeframe
      const dateRange = this.getDateRange(timeframe);
      
      // Fetch user-specific data
      const userData = await this.fetchUserSpecificData(targetUserId, dateRange);
      
      if (!userData.messages.length && !userData.jiraTickets.length) {
        return `📭 No activity found for @${userName} ${timeframe}.`;
      }

      return this.formatUserStatusResponse(userName, userData, timeframe);

    } catch (error) {
      console.error('❌ Error generating user status:', error.message);
      return "❌ Failed to get user status. Please try again.";
    }
  }

  async fetchUserSpecificData(userId, dateRange) {
    // This is a simplified version - we'll fetch messages for the timeframe
    // and filter for the specific user
    const messages = await this.dailySummaryApp.slackService.fetchMessages();
    
    const userMessages = messages.filter(msg => 
      msg.user === userId && 
      this.isMessageInDateRange(msg, dateRange)
    );

    // Get Jira tickets (we'll filter by assignee if possible)
    const jiraTickets = await this.dailySummaryApp.jiraService.fetchIssues();
    
    return {
      messages: userMessages,
      jiraTickets: jiraTickets || []
    };
  }

  getDateRange(timeframe) {
    const now = new Date();
    let start = new Date();
    
    switch (timeframe) {
      case 'yesterday':
        start.setDate(now.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        return { start: start.getTime() / 1000, end: (start.getTime() + 24*60*60*1000) / 1000 };
      
      case 'week':
        start.setDate(now.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        return { start: start.getTime() / 1000, end: now.getTime() / 1000 };
      
      case 'today':
      default:
        start.setHours(0, 0, 0, 0);
        return { start: start.getTime() / 1000, end: now.getTime() / 1000 };
    }
  }

  isMessageInDateRange(message, dateRange) {
    const messageTime = parseFloat(message.ts);
    return messageTime >= dateRange.start && messageTime <= dateRange.end;
  }

  formatUserStatusResponse(userName, userData, timeframe) {
    const messages = userData.messages.map(msg => msg.text).filter(Boolean);
    const jiraContext = userData.jiraTickets.length > 0 ? 
      `*Jira Tasks:* ${userData.jiraTickets.length} tickets in project` : '';

    if (messages.length === 0) {
      return `📊 *Status for @${userName}* (${timeframe})

📭 *Slack Activity:* No messages found
${jiraContext}

💡 _Try a different timeframe or check if they posted in other channels_`;
    }

    // Quick summary format for interactive responses
    const recentMessages = messages.slice(-3); // Last 3 messages
    
    return `📊 *Quick Status for @${userName}* (${timeframe})

📝 *Recent Activity:*
${recentMessages.map(msg => `   • ${msg.substring(0, 100)}${msg.length > 100 ? '...' : ''}`).join('\n')}

📈 *Summary:* ${messages.length} message${messages.length !== 1 ? 's' : ''} today
${jiraContext}

💡 _For detailed daily summary, wait for tonight's 11 PM report_`;
  }

  async generateTeamStatus() {
    try {
      console.log('👥 Generating team status...');
      
      // Use existing daily summary logic but format for quick response
      const messages = await this.dailySummaryApp.slackService.fetchMessages();
      const jiraIssues = await this.dailySummaryApp.jiraService.fetchIssues();
      
      const activeUsers = [...new Set(messages.map(msg => msg.user))].filter(Boolean);
      
      return `👥 *Team Status Today*

📊 *Activity Overview:*
   • ${activeUsers.length} team member${activeUsers.length !== 1 ? 's' : ''} active in Slack
   • ${messages.length} total messages
   • ${jiraIssues?.length || 0} Jira tickets in progress

🕚 *Full Summary:* Available at 11:00 PM daily
💡 *Individual Status:* Mention me with @username for specific updates`;

    } catch (error) {
      console.error('❌ Error generating team status:', error.message);
      return "❌ Failed to get team status. Please try again.";
    }
  }

  getHelpMessage() {
    return `🤖 *Interactive Daily Update Bot - Help*

*📋 Available Commands:*

*User Status:*
   • \`@bot @username\` - Get user's today status
   • \`@bot status for @username\` - Same as above
   • \`@bot @username yesterday\` - Yesterday's activity
   • \`@bot @username this week\` - Week's summary

*Team Status:*
   • \`@bot team status\` - Team overview
   • \`@bot team\` - Quick team summary

*Examples:*
   • \`@DailyUpdateBot @swetha\`
   • \`@bot status for @john yesterday\`
   • \`@bot team status\`

*ℹ️ Notes:*
   • Full daily summaries posted at 11:00 PM
   • Interactive queries show recent activity only
   • Data includes Slack messages + Jira tickets`;
  }

  async sendHelpMessage(channel) {
    await this.sendResponse(channel, this.getHelpMessage());
  }

  async sendTypingIndicator(channel) {
    try {
      await this.webClient.conversations.typing({ channel });
    } catch (error) {
      // Ignore typing indicator errors
    }
  }

  async sendResponse(channel, text) {
    try {
      await this.webClient.chat.postMessage({
        channel,
        text,
        username: 'DailyUpdateBot',
        icon_emoji: ':robot_face:'
      });
      console.log('✅ Response sent to channel');
    } catch (error) {
      console.error('❌ Failed to send response:', error.message);
    }
  }

  async stop() {
    try {
      await this.socketModeClient.disconnect();
      console.log('🛑 Interactive Bot Service stopped');
    } catch (error) {
      console.error('❌ Error stopping Interactive Bot Service:', error.message);
    }
  }
}
