export function enrichTask(task) {
  const plainTask = task?.toObject ? task.toObject() : { ...task };
  const msUntilDeadline = plainTask.deadline ? new Date(plainTask.deadline) - Date.now() : null;
  const daysLeft = msUntilDeadline !== null ? Math.ceil(msUntilDeadline / 86400000) : null;

  let urgencyLabel = 'No Deadline';
  if (daysLeft !== null) {
    if (daysLeft < 0) urgencyLabel = 'Overdue';
    else if (daysLeft <= 3) urgencyLabel = 'Critical';
    else if (daysLeft <= 7) urgencyLabel = 'Urgent';
    else if (daysLeft <= 14) urgencyLabel = 'Soon';
    else if (daysLeft <= 21) urgencyLabel = 'Upcoming';
    else urgencyLabel = 'Scheduled';
  }

  return { ...plainTask, daysLeft, urgencyLabel };
}

export function emptyAnalytics() {
  return {
    total: 0,
    weekTasks: 0,
    completed: 0,
    pending: 0,
    critical: 0,
    overdue: 0,
    prodScore: 0,
    avgAiScore: 0,
  };
}

export function hasAnthropicKey() {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  return Boolean(key && !key.startsWith('your_'));
}
