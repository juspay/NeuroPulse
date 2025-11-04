import { config } from '../config/config.js';

export class JiraService {
  constructor() {
    this.baseUrl = config.jira.baseUrl;
    this.email = config.jira.email;
    this.apiToken = config.jira.apiToken;
    this.auth = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');
  }

  async fetchIssues(project = 'OPS', maxResults = 50) {
    try {
      console.log(`📥 Fetching Jira issues from ${project} project...`);
      
      const response = await fetch(`${this.baseUrl}/rest/api/3/search/jql`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jql: `project=${project}`,
          maxResults: maxResults,
          fields: ["key", "summary", "status", "assignee", "priority", "parent", "description", "created", "updated"]
        })
      });

      if (!response.ok) {
        throw new Error(`Jira API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Fetched ${data.issues.length} Jira issues from ${project} project`);
      
      return this.formatIssues(data.issues);
    } catch (error) {
      console.log("⚠️ Jira fetch failed:", error.message);
      return [];
    }
  }

  formatIssues(issues) {
    return issues.map(issue => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      assignee: issue.fields.assignee ? issue.fields.assignee.displayName : 'Unassigned',
      priority: issue.fields.priority ? issue.fields.priority.name : 'None',
      parent: issue.fields.parent ? issue.fields.parent.key : null,
      description: this.extractDescription(issue.fields.description),
      created: issue.fields.created,
      updated: issue.fields.updated
    }));
  }

  extractDescription(description) {
    if (!description || !description.content) return '';
    
    return description.content.map(p => 
      p.content ? p.content.map(c => c.text).join('') : ''
    ).join('\n');
  }

  buildJiraContext(issues) {
    if (!Array.isArray(issues) || issues.length === 0) {
      return "";
    }

    let context = "\n**Current Jira Issues (OPS Project):**\n";
    issues.forEach(issue => {
      context += `- ${issue.key}: ${issue.summary} [${issue.status}] - Assigned to: ${issue.assignee}\n`;
      if (issue.parent) {
        context += `  └ Parent: ${issue.parent}\n`;
      }
    });

    return context;
  }
}
