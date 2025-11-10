export const formatDuration = (duration: number): string => {
  if (!duration || isNaN(duration)) return "0:00";
  const mins = Math.floor(duration / 60);
  const secs = Math.floor(duration % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
