export const getPreview = (text: string, limit = 200) => {
  if (text.length <= limit) return text;

  const truncated = text.slice(0, limit);
  const lastDotIndex = truncated.lastIndexOf(".");

  return lastDotIndex !== -1
    ? truncated.slice(0, lastDotIndex + 1)
    : truncated.trim() + "...";
};
