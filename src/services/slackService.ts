import { config } from '../config/config.js';
import { SlackMessage, SlackUser } from '../types/index.js';

interface SlackAPIResponse {
  ok: boolean;
  error?: string;
  messages?: SlackMessage[];
  user?: SlackUser;
}

export class SlackService {
  public botToken: string | undefined;
  public teamChannelId: string | undefined;
  public summaryChannelId: string | undefined;

  constructor() {
    this.botToken = config.slack.botToken;
    this.teamChannelId = config.slack.teamChannelId;
    this.summaryChannelId = config.slack.summaryChannelId;
  }

  async fetchMessages(channelId: string = this.teamChannelId!): Promise<SlackMessage[]> {
    const url = `https://slack.com/api/conversations.history`;
    
    // Get messages from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oldest = Math.floor(today.getTime() / 1000);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.botToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: channelId,
        oldest: oldest,
        limit: 100
      })
    });

    const data: SlackAPIResponse = await response.json();
    if (!data.ok) {
      throw new Error(`Slack API error: ${data.error}`);
    }

    const messages = data.messages || [];
    
    // Fetch thread replies for messages that have them
    const allMessages: SlackMessage[] = [];
    let totalThreadReplies = 0;
    
    for (const message of messages) {
      allMessages.push(message);
      
      // Check if message has thread replies
      if ((message as any).reply_count && (message as any).reply_count > 0) {
        try {
          console.log(`🧵 Found message with ${(message as any).reply_count} thread replies, fetching...`);
          const threadReplies = await this.fetchThreadReplies(channelId, message.ts);
          allMessages.push(...threadReplies);
          totalThreadReplies += threadReplies.length;
          console.log(`✅ Fetched ${threadReplies.length} thread replies`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.log(`⚠️ Failed to fetch thread replies for message ${message.ts}:`, errorMessage);
        }
      }
    }

    if (totalThreadReplies > 0) {
      console.log(`🧵 Total thread replies fetched: ${totalThreadReplies}`);
    } else {
      console.log(`ℹ️ No thread replies found in today's messages`);
    }

    return allMessages;
  }

  async fetchThreadReplies(channelId: string, threadTs: string): Promise<SlackMessage[]> {
    const url = `https://slack.com/api/conversations.replies?channel=${channelId}&ts=${threadTs}&limit=50`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.botToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    const data: SlackAPIResponse = await response.json();
    if (!data.ok) {
      throw new Error(`Slack thread API error: ${data.error}`);
    }

    // Skip the first message (parent) and return only replies
    const replies = (data.messages || []).slice(1);
    
    // Mark these as thread replies for filtering
    return replies.map(reply => ({
      ...reply,
      thread_ts: threadTs,
      is_thread_reply: true
    } as SlackMessage));
  }

  async fetchUserInfo(userId: string): Promise<{ real_name: string; display_name: string }> {
    const url = `https://slack.com/api/users.info?user=${userId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.botToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data: SlackAPIResponse = await response.json();
    if (!data.ok) {
      console.log(`⚠️ Failed to fetch user info for ${userId}:`, data.error);
      return { real_name: userId, display_name: userId };
    }

    return {
      real_name: data.user?.real_name || data.user?.profile?.real_name || userId,
      display_name: data.user?.profile?.display_name || data.user?.name || userId
    };
  }

  async postMessage(text: string, channelId: string = this.summaryChannelId!): Promise<any> {
    const url = `https://slack.com/api/chat.postMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.botToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: channelId,
        text: text,
        username: 'DailyUpdateBot'
      })
    });

    const data = await response.json();
    if (!data.ok) {
      throw new Error(`Slack API error: ${data.error}`);
    }

    return data;
  }
}
