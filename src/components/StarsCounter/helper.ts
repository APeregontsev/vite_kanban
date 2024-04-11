// Helper function to format the stars count

export const formatCount = (number: number) => {
  if (number < 1000) return number;
  if (number >= 1000 && number < 1000000) return (number / 1000).toFixed(1) + "K"; // for thousands
  if (number >= 1000000 && number < 1000000000) return (number / 1000000).toFixed(1) + "M"; // for millions

  return (number / 1000000000).toFixed(1) + "B"; // for billions
};
