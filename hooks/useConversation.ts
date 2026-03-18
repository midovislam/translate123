"use client";
import { useState, useEffect, useCallback } from "react";
import {
  ConversationEntry,
  LanguagePair,
  loadConversation,
  saveConversation,
  clearConversation,
  loadPair,
  savePair,
} from "@/lib/storage";

export function useConversation() {
  const [entries, setEntries] = useState<ConversationEntry[]>([]);
  const [pair, setPairState] = useState<LanguagePair>({ langA: "ru", langB: "pt" });

  useEffect(() => {
    setEntries(loadConversation());
    setPairState(loadPair());
  }, []);

  const addEntry = useCallback((entry: Omit<ConversationEntry, "id" | "timestamp">) => {
    const newEntry: ConversationEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setEntries((prev) => {
      const updated = [...prev, newEntry];
      saveConversation(updated);
      return updated;
    });
  }, []);

  const setPair = useCallback((pair: LanguagePair) => {
    setPairState(pair);
    savePair(pair);
  }, []);

  const clear = useCallback(() => {
    setEntries([]);
    clearConversation();
  }, []);

  return { entries, addEntry, pair, setPair, clear };
}
