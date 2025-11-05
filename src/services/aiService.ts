import { NeuroLink } from "@juspay/neurolink";
import { config } from '../config/config.js';

export class AIService {
  private neurolink: NeuroLink;

  constructor() {
    this.neurolink = new NeuroLink({
      conversationMemory: {
        enabled: true,
      },
      provider: config.ai.neurolinkProvider,
      model: config.ai.neurolinkModel,
    } as any);
  }

  async generateDailySummary(userContext: string, jiraContext: string, currentDate: string): Promise<string> {
    const summaryPrompt = `
You are a daily standup assistant. Analyze the provided Slack messages and Jira tickets to create comprehensive user-wise daily summary reports.

**Current Date:** ${currentDate}

**Work-related Slack Messages by User:**
${userContext}

${jiraContext}

**Instructions:**
Create individual daily summaries for each user with the exact format below. Only include users who have meaningful work-related updates.

**Required Format for each user:**

📋 **Daily Summary for ${currentDate}**
**@[Username]**

**Key Accomplishments**
   • [List completed tasks, deployments, bug fixes, features delivered, code reviews completed, etc.]

**Pending Tasks**  
   • [List ongoing work, tasks in progress, planned work, etc.]

**Blockers**
   • [List any obstacles, issues, dependencies, or problems mentioned]

**Critical Guidelines for Issue Resolution:**
1. **Chronological Analysis**: Pay close attention to the timeline of messages. More recent messages take precedence over older ones.
2. **Resolution Detection**: If a user mentions an issue was "resolved", "fixed", "done", "working correctly", "completed", or "solved", move it from Blockers to Key Accomplishments.
3. **Status Updates**: Look for phrases like:
   - "is now working correctly"
   - "issue is done/resolved/fixed"
   - "completed the [task]"
   - "finished [work item]"
   - "problem solved"
4. **Contradiction Handling**: If earlier messages mention a problem but later messages indicate it's resolved, prioritize the resolution status.

**General Guidelines:**
1. Extract meaningful work items from each user's Slack messages
2. Focus on: development tasks, code reviews, deployments, bug fixes, features, testing, meetings, planning
3. Ignore casual conversation, food mentions, non-work topics
4. Use bullet points with • symbol
5. Be concise but informative
6. Only include users with actual work updates
7. Use bold formatting for section headings: **Key Accomplishments**, **Pending Tasks**, **Blockers**
8. Make the username bold in the format **@[Username]**
9. When mentioning Jira tickets, write them as natural sentences without status indicators like [To Do], [In Progress], [In Review]
10. For Jira tickets, format as: "Working on OPS-6 Payment Confirmation feature" instead of "OPS-6: Payment Confirmation [To Do]"
11. Group related activities logically and write in sentence form
12. **Never list the same issue as both an accomplishment and a blocker** - if it's resolved, it's only an accomplishment

Analyze each user's messages carefully, paying special attention to the chronological order and resolution status of issues.
`;

    try {
      const result = await this.neurolink.generate({
        input: { text: summaryPrompt },
        enableAnalytics: true,
      });

      return result.content;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("❌ Error generating summary:", errorMessage);
      throw error;
    }
  }
}
