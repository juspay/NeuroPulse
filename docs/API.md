# NeuroPulse API Documentation

> API reference for NeuroPulse - AI-powered Jira integration and daily summary service

## Overview

This document provides comprehensive API documentation for NeuroPulse, an intelligent system that automates Jira ticket management and provides daily summaries through Slack integration.

## Base URL

```
https://api.neuropulse.juspay.in/v1
```

## Authentication

All API requests require authentication using API keys and Jira credentials.

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     https://api.neuropulse.juspay.in/v1/endpoint
```

## Core Services

### Jira Service

#### GET /jira/issues

Retrieve Jira issues with AI-powered filtering and analysis.

**Parameters:**
- `project` (string): Jira project key
- `status` (string): Issue status filter
- `assignee` (string): Assignee filter
- `limit` (number): Maximum number of issues to return

**Response:**
```json
{
  "success": true,
  "data": {
    "issues": [],
    "totalCount": 50,
    "analysisReport": {
      "priority": "high",
      "blockers": 3,
      "recommendations": []
    }
  }
}
```

#### POST /jira/daily-summary

Generate and send daily summary to Slack.

**Parameters:**
- `projectKey` (string): Jira project key
- `slackChannel` (string): Target Slack channel
- `includeMetrics` (boolean): Include performance metrics

**Response:**
```json
{
  "success": true,
  "message": "Daily summary sent successfully",
  "timestamp": "2024-01-01T00:00:00Z",
  "metrics": {
    "issuesProcessed": 25,
    "summaryLength": "detailed"
  }
}
```

### AI Service

#### POST /ai/analyze

Analyze Jira data using AI for intelligent insights.

**Parameters:**
- `data` (object): Jira issues data
- `analysisType` (string): Type of analysis (summary, priority, blockers)

**Response:**
```json
{
  "success": true,
  "analysis": {
    "summary": "Project health analysis",
    "insights": [],
    "recommendations": [],
    "riskLevel": "medium"
  }
}
```

### Slack Service

#### POST /slack/send-message

Send formatted messages to Slack channels.

**Parameters:**
- `channel` (string): Slack channel ID or name
- `message` (string): Message content
- `format` (string): Message format (plain, markdown, blocks)

**Response:**
```json
{
  "success": true,
  "messageId": "msg_12345",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Error Handling

All errors return a consistent format:

```json
{
  "error": {
    "code": "JIRA_CONNECTION_ERROR",
    "message": "Failed to connect to Jira instance",
    "details": {
      "endpoint": "/rest/api/3/search",
      "statusCode": 401
    }
  }
}
```

## Rate Limiting

API calls are limited to 500 requests per hour per API key for external integrations.

## Examples

### TypeScript/Node.js

```typescript
import { NeuroPulseClient } from 'neuropulse';

// Initialize client
const client = new NeuroPulseClient({
  apiKey: process.env.NEUROPULSE_API_KEY,
  jiraDomain: process.env.JIRA_DOMAIN,
  jiraEmail: process.env.JIRA_EMAIL,
  jiraToken: process.env.JIRA_API_TOKEN
});

// Generate daily summary
const summary = await client.generateDailySummary('PROJ');
console.log(summary);
```

### Scheduled Tasks

```typescript
import { SchedulerService } from './src/services/schedulerService';

// Schedule daily summaries
const scheduler = new SchedulerService();
scheduler.scheduleDailySummary('0 9 * * 1-5'); // 9 AM weekdays
```

## Support

For API support, contact: opensource@juspay.in
