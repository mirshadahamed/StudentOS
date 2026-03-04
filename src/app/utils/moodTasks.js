export function getMoodTasks(mood) {
  if (mood === "sad") {
    return [
      "5-minute breathing exercise",
      "Listen to calming music",
      "Write 3 positive thoughts",
    ];
  }

  if (mood === "angry") {
    return [
      "Take a short walk",
      "Drink water",
      "Deep breathing"
    ];
  }

  return ["Keep smiling 😊"];
}