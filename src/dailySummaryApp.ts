import { SlackService } from './services/slackService.js';
import { JiraService } from './services/jiraService.js';
import { AIService } from './services/aiService.js';
import { MessageFilter } from './utils/messageFilter.js';
import { SlackMessage, JiraIssue, FilteredMessages, UserMessageData, FormattedJiraIssue } from './types/index.js';

export class DailySummaryApp {
  private slackService: SlackService;
  private jiraService: JiraService;
  private aiService: AIService;
  private messageFilter: MessageFilter;

  constructor() {
    this.slackService = new SlackService();
    this.jiraService = new JiraService();
    this.aiService = new AIService();
    this.messageFilter = new MessageFilter();
  }

  async run(): Promise<void> {
    try {
      console.log("📥 Fetching Slack messages from channel:", this.slackService.teamChannelId);
      
      // Fetch and process Slack messages
      const allMessages: SlackMessage[] = await this.slackService.fetchMessages();
      const relevantMessages: SlackMessage[] = this.messageFilter.filterRelevantMessages(allMessages);
      console.log(`✅ Fetched ${allMessages.length} total messages, ${relevantMessages.length} relevant work messages`);

      // Group messages by user
      const userMessages: FilteredMessages = await this.messageFilter.groupMessagesByUser(relevantMessages, this.slackService);
      const userContext: string = this.messageFilter.buildUserContext(userMessages);

      // Fetch Jira issues
      const jiraIssues: FormattedJiraIssue[] = await this.jiraService.fetchIssues();
      const jiraContext: string = this.jiraService.buildJiraContext(jiraIssues);

      // Generate AI summary
      console.log("🧠 Generating user-wise daily summary...");
      const currentDate: string = new Date().toISOString().split('T')[0];
      const summaryText: string = await this.aiService.generateDailySummary(userContext, jiraContext, currentDate);

      // Display and post summary
      console.log("\n📋 Generated User-wise Summary:");
      console.log("=" .repeat(50));
      console.log(summaryText);
      console.log("=" .repeat(50));

      // Post summary to Slack
      await this.postSummaryToSlack(summaryText, userMessages);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("❌ Error in daily summary app:", errorMessage);
    }
  }

  private async postSummaryToSlack(summaryText: string, userMessages: FilteredMessages): Promise<void> {
    try {
      console.log(`\n📤 Posting summary to Slack channel: ${this.slackService.summaryChannelId}`);
      
      // Convert markdown bold (**) to Slack bold (*)
      let slackFormattedSummary: string = summaryText.replace(/\*\*(.*?)\*\*/g, '*$1*');
      
      // Convert display names to proper Slack mentions
      for (const [userId, userData] of Object.entries(userMessages)) {
        const displayName: string = userData.displayName;
        // Replace @DisplayName with proper Slack mention <@userId>
        const mentionPattern = new RegExp(`@${displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
        slackFormattedSummary = slackFormattedSummary.replace(mentionPattern, `<@${userId}>`);
      }
      
      await this.slackService.postMessage(slackFormattedSummary);
      console.log("✅ Daily summary posted to Slack successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("❌ Error posting to Slack:", errorMessage);
      console.log("📝 Summary generated but not posted to Slack");
    }
  }
}
