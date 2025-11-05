import { SchedulerService } from './src/services/schedulerService.js';

interface SchedulerStatus {
  isRunning: boolean;
  nextRun: string;
}

async function main(): Promise<void> {
  const scheduler = new SchedulerService();
  
  // Check command line arguments
  const args: string[] = process.argv.slice(2);
  
  if (args.includes('--now') || args.includes('-n')) {
    // Run summary immediately for testing
    console.log('🧪 Running daily summary immediately...\n');
    await scheduler.runNow();
    return;
  }
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📋 Daily Summary Scheduler

Usage:
  node index.js           Start the scheduler (runs at 11:00 PM daily)
  node index.js --now     Run summary immediately for testing
  node index.js --help    Show this help message

The scheduler will:
✅ Fetch today's Slack messages and threads
✅ Get current Jira project status
✅ Generate AI-powered daily summaries
✅ Post to Slack automatically at 11:00 PM IST

Press Ctrl+C to stop the scheduler.
    `);
    return;
  }
  
  // Start the scheduler
  try {
    await scheduler.start();
    
    // Keep the process running
    process.on('SIGINT', async () => {                  // hears for the crtl+c command
      console.log('\n🛑 Shutting down scheduler...');
      await scheduler.stop();
      process.exit(0);
    });
    
    // Keep alive
    setInterval(() => {
      const status: SchedulerStatus = scheduler.getStatus();
      if (status.isRunning) {
        console.log(`💓 Scheduler running - Next summary: ${status.nextRun}`);
      }
    }, 60 * 60 * 1000); // Log status every hour
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Scheduler failed to start:', errorMessage);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main().catch(console.error);
