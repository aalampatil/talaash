export const getPropertyImageUrl = (
  image?: import("@/types/domain").PropertyImage,
) => {
  if (!image) return "/images/property-placeholder.svg";
  if (typeof image === "string") return image;
  return image.url || "/images/property-placeholder.svg";
};
