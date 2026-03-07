import { useEffect, useState } from "react";

export const useDataFetch = <T>(url: string): { data: T | null; error: Error | null } => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let fetched = false;

    (async () => {
      if (!fetched) {
        try {
          const res = await fetch(url);
          const data = await res.json();
          setData(data);
        } catch (err) {
          setError(err as Error);
        }
      }
    })();

    return () => {
      fetched = true;
    };
  }, [url]);

  return {
    data,
    error,
  };
};
