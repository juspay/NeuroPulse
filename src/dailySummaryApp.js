import { SlackService } from './services/slackService.js';
import { JiraService } from './services/jiraService.js';
import { AIService } from './services/aiService.js';
import { MessageFilter } from './utils/messageFilter.js';

export class DailySummaryApp {
  constructor() {
    this.slackService = new SlackService();
    this.jiraService = new JiraService();
    this.aiService = new AIService();
    this.messageFilter = new MessageFilter();
  }

  async run() {
    try {
      console.log("📥 Fetching Slack messages from channel:", this.slackService.teamChannelId);
      
      // Fetch and process Slack messages
      const allMessages = await this.slackService.fetchMessages();
      const relevantMessages = this.messageFilter.filterRelevantMessages(allMessages);
      console.log(`✅ Fetched ${allMessages.length} total messages, ${relevantMessages.length} relevant work messages`);

      // Group messages by user
      const userMessages = await this.messageFilter.groupMessagesByUser(relevantMessages, this.slackService);
      const userContext = this.messageFilter.buildUserContext(userMessages);

      // Fetch Jira issues
      const jiraIssues = await this.jiraService.fetchIssues();
      const jiraContext = this.jiraService.buildJiraContext(jiraIssues);

      // Generate AI summary
      console.log("🧠 Generating user-wise daily summary...");
      const currentDate = new Date().toISOString().split('T')[0];
      const summaryText = await this.aiService.generateDailySummary(userContext, jiraContext, currentDate);

      // Display and post summary
      console.log("\n📋 Generated User-wise Summary:");
      console.log("=" .repeat(50));
      console.log(summaryText);
      console.log("=" .repeat(50));

      // Post summary to Slack
      await this.postSummaryToSlack(summaryText, userMessages);

    } catch (error) {
      console.error("❌ Error in daily summary app:", error.message);
    }
  }

  async postSummaryToSlack(summaryText, userMessages) {
    try {
      console.log(`\n📤 Posting summary to Slack channel: ${this.slackService.summaryChannelId}`);
      
      // Convert markdown bold (**) to Slack bold (*)
      let slackFormattedSummary = summaryText.replace(/\*\*(.*?)\*\*/g, '*$1*');
      
      // Convert display names to proper Slack mentions
      for (const [userId, userData] of Object.entries(userMessages)) {
        const displayName = userData.displayName;
        // Replace @DisplayName with proper Slack mention <@userId>
        const mentionPattern = new RegExp(`@${displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
        slackFormattedSummary = slackFormattedSummary.replace(mentionPattern, `<@${userId}>`);
      }
      
      await this.slackService.postMessage(slackFormattedSummary);
      console.log("✅ Daily summary posted to Slack successfully!");
    } catch (error) {
      console.error("❌ Error posting to Slack:", error.message);
      console.log("📝 Summary generated but not posted to Slack");
    }
  }
}
