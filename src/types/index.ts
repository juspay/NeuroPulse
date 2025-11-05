// Common interfaces and types for the NeuroPulse application

export interface SlackMessage {
  user: string;
  text: string;
  ts: string;
  thread_ts?: string;
  replies?: SlackMessage[];
}

export interface SlackUser {
  id: string;
  name: string;
  real_name: string;
  profile: {
    display_name: string;
    real_name: string;
  };
}

export interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
      id: string;
    };
    assignee?: {
      displayName: string;
      emailAddress: string;
    };
    priority?: {
      name: string;
    };
    created: string;
    updated: string;
    description?: any;
  };
}

export interface UserSummary {
  user: string;
  accomplishments: string[];
  pendingTasks: string[];
  blockers: string[];
}

export interface DailySummary {
  date: string;
  userSummaries: UserSummary[];
  jiraIssues: JiraIssue[];
}

export interface Config {
  slack: {
    botToken: string | undefined;
    appToken: string | undefined;
    signingSecret: string | undefined;
    teamChannelId: string | undefined;
    summaryChannelId: string | undefined;
  };
  jira: {
    baseUrl: string | undefined;
    email: string | undefined;
    apiToken: string | undefined;
  };
  ai: {
    googleApiKey: string | undefined;
    neurolinkProvider: string;
    neurolinkModel: string;
    googleVertexProject: string | undefined;
    googleVertexLocation: string | undefined;
    googleApplicationCredentials: string | undefined;
  };
  app: {
    port: string | number;
  };
}

export interface SchedulerStatus {
  isRunning: boolean;
  nextRun: string;
}

export interface UserMessageData {
  messages: string[];
  displayName: string;
}

export interface FilteredMessages {
  [userId: string]: UserMessageData;
}

export interface FormattedJiraIssue {
  key: string;
  summary: string;
  status: string;
  assignee: string;
  priority: string;
  parent: string | null;
  description: string;
  created: string;
  updated: string;
}

export interface AIResponse {
  summary: string;
  userSummaries: UserSummary[];
}
