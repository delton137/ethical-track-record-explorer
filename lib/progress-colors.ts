// Stable colors keep each progress interval recognizable across chart and details.
const PROGRESS_COLORS: Record<string, string> = {
  abolition: "#a34417",
  "racial-equality": "#9b2455",
  "self-determination": "#27623e",
  "women-equality": "#743ca0",
  "votes-for-women": "#245db0",
  "religious-freedom": "#746016",
  decriminalization: "#087568",
  "marriage-equality": "#a32b33",
  "torture-ban": "#536b1f",
  "execution-abolition": "#783eaa",
  "child-protection": "#8b4e37",
  "animal-protection": "#266b86",
  "farm-welfare": "#97517d",
  "extinction-concern": "#a04b24",
  "wild-welfare": "#38713c",
  "ai-welfare": "#7150a0",
};

export const progressColor = (id: string) => PROGRESS_COLORS[id] ?? "#586c84";
