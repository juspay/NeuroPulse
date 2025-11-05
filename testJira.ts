import dotenv from "dotenv";

dotenv.config();

async function testJiraConnection(): Promise<void> {
  try {
    console.log("🔍 Testing Jira connection...");
    console.log("Base URL:", process.env.JIRA_BASE_URL);
    console.log("Email:", process.env.JIRA_EMAIL);
    console.log("Token length:", process.env.JIRA_API_TOKEN?.length);
    
    const auth = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');
    
    // First, try to get user info to test authentication
    console.log("\n📡 Testing authentication with /rest/api/2/myself...");
    const authResponse = await fetch(`${process.env.JIRA_BASE_URL}/rest/api/2/myself`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log("Auth Response Status:", authResponse.status, authResponse.statusText);
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log("✅ Authentication successful! User:", authData.displayName);
    } else {
      const errorText = await authResponse.text();
      console.log("❌ Auth failed:", errorText);
      return;
    }

    // Now try to search for issues
    console.log("\n📡 Testing issue search with v3 search/jql API...");
    const searchResponse = await fetch(`${process.env.JIRA_BASE_URL}/rest/api/3/search/jql`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jql: "project=OPS",
        maxResults: 5,
        fields: ["key", "summary", "status", "assignee", "priority", "parent", "description", "created", "updated"]
      })
    });

    console.log("Search Response Status:", searchResponse.status, searchResponse.statusText);
    
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      console.log("✅ Search successful!");
      console.log("Response structure:", JSON.stringify(searchData, null, 2));
      
      if (searchData.values && searchData.values.length > 0) {
        console.log("\n📋 Sample issues:");
        searchData.values.slice(0, 3).forEach((issue: any) => {
          console.log(`- ${issue.key}: ${issue.fields.summary} [${issue.fields.status.name}]`);
        });
      } else if (searchData.issues && searchData.issues.length > 0) {
        console.log("\n📋 Sample issues:");
        searchData.issues.slice(0, 3).forEach((issue: any) => {
          console.log(`- ${issue.key}: ${issue.fields.summary} [${issue.fields.status.name}]`);
        });
      }
    } else {
      const errorText = await searchResponse.text();
      console.log("❌ Search failed:", errorText);
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("💥 Error testing Jira:", errorMessage);
  }
}

testJiraConnection();
