import { useState, useEffect } from "react";

export function useRoute(): string {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return hash;
}

export function navigate(path: string): void {
  window.location.hash = path;
  window.scrollTo(0, 0);
}
