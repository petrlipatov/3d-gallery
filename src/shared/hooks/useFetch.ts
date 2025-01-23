import { useState, useEffect, useCallback } from "react";

type FetchState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};

type FetchOptions = RequestInit;

export function useFetch<T = unknown>(
  url: string,
  options?: FetchOptions
): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    const abortController = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Fetching error: ${response.status}`);
      }

      const jsonData = (await response.json()) as T;
      setData(jsonData);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }

    return () => abortController.abort();
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    console.log({
      data,
      isLoading,
      error,
    });
  }, [data, isLoading, error]);

  return { data, isLoading, error };
}
