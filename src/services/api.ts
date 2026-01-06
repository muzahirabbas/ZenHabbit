const WORKER_URL = 'https://zen-habit-api.abbasmuzahir92.workers.dev';

export const api = {
  async completeHabit(userId: string, habitId: string) {
    const response = await fetch(`${WORKER_URL}/api/complete-habit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, habitId, timestamp: new Date().toISOString() }),
    });
    return response.json();
  },

  async startAdventure(userId: string, dailyEp: number) {
    const response = await fetch(`${WORKER_URL}/api/start-adventure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, dailyEp }),
    });
    return response.json();
  }
};