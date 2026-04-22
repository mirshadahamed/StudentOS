export function enrichTask(task) {
  const t = typeof task?.toObject === 'function' ? task.toObject() : { ...task };
  const ms = t.deadline ? new Date(t.deadline) - Date.now() : null;
  const daysLeft = ms !== null ? Math.ceil(ms / 86400000) : null;

  let urgencyLabel = 'No Deadline';
  if (daysLeft !== null) {
    if (daysLeft < 0) urgencyLabel = 'Overdue';
    else if (daysLeft <= 3) urgencyLabel = 'Critical';
    else if (daysLeft <= 7) urgencyLabel = 'Urgent';
    else if (daysLeft <= 14) urgencyLabel = 'Soon';
    else if (daysLeft <= 21) urgencyLabel = 'Upcoming';
    else urgencyLabel = 'Scheduled';
  }

  return { ...t, daysLeft, urgencyLabel };
}

