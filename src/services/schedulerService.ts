import cron from 'node-cron';
import { DailySummaryApp } from '../dailySummaryApp.js';
import { SchedulerStatus } from '../types/index.js';

export class SchedulerService {
  private dailySummaryApp: DailySummaryApp;
  private isRunning: boolean;

  constructor() {
    this.dailySummaryApp = new DailySummaryApp();
    this.isRunning = false;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Scheduler is already running');
      return;
    }

    console.log('🕚 Starting Daily Summary Scheduler...');
    console.log('📅 Daily summaries will be posted at 11:00 PM IST');
    
    // Schedule daily summary at 11:00 PM IST (23:00 in 24-hour format)
    // Cron format: second minute hour day month dayOfWeek
    // '0 0 23 * * *' = At 11:00 PM every day
    cron.schedule('0 39 10 * * *', async () => {
      try {
        console.log('\n🌙 11:00 PM - Running scheduled daily summary...');
        await this.dailySummaryApp.run();
        console.log('✅ Scheduled daily summary completed successfully\n');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ Scheduled daily summary failed:', errorMessage);
      }
    }, {
      timezone: "Asia/Kolkata"  // IST timezone
    });

    this.isRunning = true;
    console.log('✅ Daily Summary Scheduler started successfully');
    console.log('💡 The application will keep running and post summaries automatically at 11:00 PM');
    console.log('🛑 Press Ctrl+C to stop the scheduler\n');
  }

  // clean shutdown for every scheduled tasks
  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log('⚠️ Scheduler is not running');
      return;
    }

    // Stop all cron jobs
    cron.getTasks().forEach((task) => {
      task.stop();
    });

    this.isRunning = false;
    console.log('🛑 Daily Summary Scheduler stopped');
  }

  // Method to run summary immediately for testing
  async runNow(): Promise<void> {
    try {
      console.log('🧪 Running daily summary immediately for testing...');
      await this.dailySummaryApp.run();
      console.log('✅ Test summary completed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Test summary failed:', errorMessage);
    }
  }

  getStatus(): SchedulerStatus & { timezone: string } {
    return {
      isRunning: this.isRunning,
      nextRun: this.isRunning ? '11:00 PM IST (daily)' : 'Not scheduled',
      timezone: 'Asia/Kolkata (IST)'
    };
  }
}
