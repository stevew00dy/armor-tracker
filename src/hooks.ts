import { useState, useCallback, useMemo } from "react";
import type { CheckedState } from "./types";
import { armors } from "./data";

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Tracks which individual armor pieces are checked (owned).
 * Key format: `${armorId}::${variant}::${slot}`
 */
export function useArmorChecks(storageKey = "armor-tracker-checks") {
  const [checks, setChecks] = useState<CheckedState>(() => loadJson(storageKey, {}));

  const toggle = useCallback(
    (armorId: string, variant: string, slot: string) => {
      const key = `${armorId}::${variant}::${slot}`;
      setChecks((prev) => {
        const next = { ...prev, [key]: !prev[key] };
        saveJson(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  const isChecked = useCallback(
    (armorId: string, variant: string, slot: string) => !!checks[`${armorId}::${variant}::${slot}`],
    [checks]
  );

  const variantProgress = useCallback(
    (armorId: string, variant: string, totalPieces: number) => {
      let count = 0;
      for (const k in checks) {
        if (checks[k] && k.startsWith(`${armorId}::${variant}::`)) count++;
      }
      return { owned: count, total: totalPieces };
    },
    [checks]
  );

  const totalProgress = useMemo(() => {
    let owned = 0;
    let total = 0;
    for (const armor of armors) {
      for (const variant of armor.variants) {
        for (const piece of armor.setPieces) {
          total++;
          if (checks[`${armor.id}::${variant}::${piece.slot}`]) owned++;
        }
      }
    }
    return { owned, total };
  }, [checks]);

  const resetAll = useCallback(() => {
    setChecks({});
    saveJson(storageKey, {});
  }, [storageKey]);

  return { checks, toggle, isChecked, variantProgress, totalProgress, resetAll };
}

export function useFavourites(storageKey = "armor-tracker-favs") {
  const [favs, setFavs] = useState<string[]>(() => loadJson(storageKey, []));

  const toggle = useCallback(
    (armorId: string) => {
      setFavs((prev) => {
        const next = prev.includes(armorId) ? prev.filter((x) => x !== armorId) : [...prev, armorId];
        saveJson(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  const isFav = useCallback((armorId: string) => favs.includes(armorId), [favs]);

  const clearAll = useCallback(() => {
    setFavs([]);
    saveJson(storageKey, []);
  }, [storageKey]);

  return { favs, toggle, isFav, clearAll };
}

export function exportAllData() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    checks: JSON.parse(localStorage.getItem("armor-tracker-checks") || "{}"),
    favs: JSON.parse(localStorage.getItem("armor-tracker-favs") || "[]"),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `armor-tracker-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importAllData(file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);
      if (typeof data !== "object" || !data) throw new Error("bad format");
      if (data.checks) localStorage.setItem("armor-tracker-checks", JSON.stringify(data.checks));
      if (data.favs) localStorage.setItem("armor-tracker-favs", JSON.stringify(data.favs));
      window.location.reload();
    } catch {
      alert("Invalid backup file. Expected an Armor Tracker JSON export.");
    }
  };
  reader.readAsText(file);
}
