"use client";
import { useState } from "react";
import { Description } from "@/providers/GenerateDescription/types";
import { notifySessionExpired } from "@/app/lib/auth/notifySessionExpired";

export function useGenerateDescription() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const generate = async (
    payload: Description.CreateMutationPayload,
    onChunk: (accumulated: string) => void,
  ): Promise<string> => {
    setIsLoading(true);
    setIsError(false);
    let accumulated = "";
    try {
      const res = await fetch("/api/generateDescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 401) notifySessionExpired();
        throw new Error(await res.text());
      }
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        onChunk(accumulated);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
    return accumulated;
  };

  return { generate, isLoading, isError };
}
