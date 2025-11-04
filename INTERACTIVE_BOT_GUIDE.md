# 🤖 Interactive Bot Usage Guide

## 🚀 **NEW FEATURE: Real-time User Updates**

Your daily summary bot now responds to mentions instantly! No need to wait for 11:00 PM.

---

## 📋 **Available Commands**

### **👤 Individual User Status**

**Get someone's today status:**
```
@DailyUpdateBot @swetha
@bot @username
@bot status for @swetha
```

**Get historical status:**
```
@bot @swetha yesterday
@bot @username this week
@bot status for @john yesterday
```

### **👥 Team Overview**

**Quick team summary:**
```
@bot team status
@bot team
@bot everyone
```

### **❓ Help & Support**

**Get help:**
```
@bot help
@DailyUpdateBot help
```

---

## 💬 **Example Conversations**

### **User Status Query**
```
You: @DailyUpdateBot @swetha

Bot: 📊 Quick Status for @Swetha S (today)

📝 Recent Activity:
   • Completed the payment page of the website
   • Resolved credit card payment issue, working correctly
   • Currently blocked in Figma

📈 Summary: 12 messages today
**Jira Tasks:** 9 tickets in project

💡 For detailed daily summary, wait for tonight's 11 PM report
```

### **Team Status Query**
```
You: @bot team status

Bot: 👥 Team Status Today

📊 Activity Overview:
   • 1 team member active in Slack
   • 18 total messages
   • 9 Jira tickets in progress

🕚 Full Summary: Available at 11:00 PM daily
💡 Individual Status: Mention me with @username for specific updates
```

---

## 🎯 **Response Types**

### **📊 Quick Status Response**
- Recent 3 messages from the user
- Message count summary
- Jira task overview
- Reference to full nightly report

### **📭 No Activity Response**
- When user has no messages for the timeframe
- Suggests trying different timeframe
- Still shows Jira context if available

### **❌ Error Handling**
- Graceful error messages
- Suggestions for correct usage
- Fallback to help information

---

## 🕐 **Time Ranges Supported**

| **Command** | **Time Range** | **Example** |
|-------------|----------------|-------------|
| `@bot @user` | Today only | Current day activity |
| `@bot @user yesterday` | Previous day | Yesterday's activity |
| `@bot @user this week` | Last 7 days | Week's summary |
| `@bot @user sprint` | Current sprint | Sprint activity |

---

## 🔧 **Technical Features**

### **Smart Message Parsing**
- Recognizes various mention formats
- Extracts user IDs from @mentions  
- Handles natural language commands
- Fallback to help for unclear requests

### **Real-time Data**
- Fetches live Slack messages
- Gets current Jira project status
- Filters for relevant work content
- Provides instant responses

### **Integration with Daily Reports**
- Complements 11:00 PM scheduled summaries
- Uses same data sources and filtering
- Maintains consistency across features
- References full nightly reports

---

## 🎪 **Use Cases**

### **🏃‍♂️ Daily Standups**
```
Manager: "@bot @john status"
Get quick update before standup meeting
```

### **🔍 Quick Check-ins**
```
"@bot @sarah yesterday"
See what team member worked on yesterday
```

### **👥 Team Pulse**
```
"@bot team status"
Get overall team activity overview
```

### **🆘 Help & Support**
```
"@bot help" 
Learn all available commands
```

---

## 💡 **Tips for Best Results**

### **✅ Do This:**
- Use clear @mentions: `@bot @username`
- Try different timeframes if no results
- Use team commands for overview
- Ask for help when unsure

### **❌ Avoid This:**
- Incomplete mentions: `@bot swetha` (without @)
- Very old timeframes (limited data)
- Multiple users in one query
- Complex requests (use simple commands)

---

## 🔄 **How It Works**

1. **Mention Detection**: Bot listens for @mentions in channels
2. **Command Parsing**: Extracts user and timeframe from message  
3. **Data Fetching**: Gets Slack messages + Jira tickets
4. **Smart Filtering**: Applies work-focused filtering
5. **Response Formatting**: Creates user-friendly summary
6. **Instant Reply**: Posts response to same channel

---

## 🌟 **Benefits**

**⚡ Instant Access**: Get updates anytime, not just 11 PM  
**👥 Team Transparency**: Check on any team member's progress  
**📱 Mobile Friendly**: Works from any Slack client  
**🎯 Contextual**: Shows relevant work activity only  
**🔗 Integrated**: Combines Slack + Jira data seamlessly  

---

## 🚀 **Your Bot is Ready!**

**Bot ID**: `U09NCRQ5R9C`  
**Status**: ✅ Active and listening  
**Features**: Daily summaries + Interactive queries  
**Schedule**: 11:00 PM IST daily + on-demand  

Start using it now by mentioning `@DailyUpdateBot` in any channel where the bot is present!
