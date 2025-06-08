import { useQuery } from "@tanstack/react-query";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const fetchLocalizations = async () => {
  const res = await fetch(`${baseUrl}/localizations?project_id=helium-us&locale=en`);
  if (!res.ok) {
    throw new Error("Failed to fetch localizations");
  }
  return res.json();
};

export function useLocalizations() {
  return useQuery({
    queryKey: ["localizations", "helium-us", "en"],
    queryFn: fetchLocalizations,
  });
}
