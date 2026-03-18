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

  const updateEntry = useCallback((id: string, updates: Partial<Pick<ConversationEntry, "original" | "translation">>) => {
    setEntries((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...updates } : e));
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

  return { entries, addEntry, updateEntry, pair, setPair, clear };
}
