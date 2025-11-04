import { config } from '../config/config.js';

export class SlackService {
  constructor() {
    this.botToken = config.slack.botToken;
    this.teamChannelId = config.slack.teamChannelId;
    this.summaryChannelId = config.slack.summaryChannelId;
  }

  async fetchMessages(channelId = this.teamChannelId) {
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

    const data = await response.json();
    if (!data.ok) {
      throw new Error(`Slack API error: ${data.error}`);
    }

    const messages = data.messages || [];
    
    // Fetch thread replies for messages that have them
    const allMessages = [];
    let totalThreadReplies = 0;
    
    for (const message of messages) {
      allMessages.push(message);
      
      // Check if message has thread replies
      if (message.reply_count && message.reply_count > 0) {
        try {
          console.log(`🧵 Found message with ${message.reply_count} thread replies, fetching...`);
          const threadReplies = await this.fetchThreadReplies(channelId, message.ts);
          allMessages.push(...threadReplies);
          totalThreadReplies += threadReplies.length;
          console.log(`✅ Fetched ${threadReplies.length} thread replies`);
        } catch (error) {
          console.log(`⚠️ Failed to fetch thread replies for message ${message.ts}:`, error.message);
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

  async fetchThreadReplies(channelId, threadTs) {
    const url = `https://slack.com/api/conversations.replies?channel=${channelId}&ts=${threadTs}&limit=50`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.botToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    const data = await response.json();
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
    }));
  }

  async fetchUserInfo(userId) {
    const url = `https://slack.com/api/users.info?user=${userId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.botToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!data.ok) {
      console.log(`⚠️ Failed to fetch user info for ${userId}:`, data.error);
      return { real_name: userId, display_name: userId };
    }

    return {
      real_name: data.user.real_name || data.user.profile?.real_name || userId,
      display_name: data.user.profile?.display_name || data.user.name || userId
    };
  }

  async postMessage(text, channelId = this.summaryChannelId) {
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
