
export default function clamp(n, min = -Infinity, max = Infinity) {
  return Math.max(Math.min(n, max), min);
};
