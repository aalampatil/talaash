import FilterProperties from "@/features/properties/components/FilterProperties";

export const metadata = { title: "Find your next home" };

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const value = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : "";
  return (
    <FilterProperties
      key={`${value("city")}:${value("rent")}:${value("propertyType")}`}
      city={value("city")}
      rent={value("rent")}
      propertyType={value("propertyType")}
    />
  );
}
