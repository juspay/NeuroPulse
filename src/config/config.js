import dotenv from "dotenv";

dotenv.config();

export const config = {
  slack: {
    botToken: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    teamChannelId: process.env.TEAM_CHANNEL_ID,
    summaryChannelId: process.env.SUMMARY_CHANNEL_ID
  },
  jira: {
    baseUrl: process.env.JIRA_BASE_URL,
    email: process.env.JIRA_EMAIL,
    apiToken: process.env.JIRA_API_TOKEN
  },
  ai: {
    googleApiKey: process.env.GOOGLE_AI_API_KEY,
    neurolinkProvider: process.env.NEUROLINK_PROVIDER || "google-ai",
    neurolinkModel: process.env.NEUROLINK_MODEL || "gemini-1.5-flash",
    googleVertexProject: process.env.GOOGLE_VERTEX_PROJECT,
    googleVertexLocation: process.env.GOOGLE_VERTEX_LOCATION,
    googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS
  },
  app: {
    port: process.env.PORT || 3000
  }
};
