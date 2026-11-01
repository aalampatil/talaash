export const getPropertyImageUrl = (image) => {
  if (!image) return "https://placehold.co/600x400";
  if (typeof image === "string") return image;
  return image.url || "https://placehold.co/600x400";
};
