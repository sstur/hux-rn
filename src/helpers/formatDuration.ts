function formatDuration(start: string | number, end: string | number) {
  let startMs = typeof start === 'number' ? start : Date.parse(start);
  let endMs = typeof end === 'number' ? end : Date.parse(end);
  let ms = endMs - startMs;
  let mins = Math.round(ms / 1000 / 60);
  if (mins < 60) {
    return mins.toString() + 'm';
  }
  let hours = Math.round(ms / 1000 / 60 / 60);
  if (hours < 24) {
    return hours.toString() + 'h';
  }
  let days = Math.round(ms / 1000 / 60 / 60 / 24);
  return days.toString() + 'd';
}

export default formatDuration;
