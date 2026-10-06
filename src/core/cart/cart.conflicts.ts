import type { CartItemDto } from "./cart.types";

export interface CartTimingConflict {
  selected: CartItemDto;
  other: CartItemDto;
  start: Date;
  end: Date;
}

// Half-open intervals: a session ending when another starts is not a conflict.
export const findCartTimingConflicts = (items: CartItemDto[]): CartTimingConflict[] => {
  const scheduled = items.filter(item => item.presentation.start && item.presentation.end).map(item => ({
    item,
    start: new Date(item.presentation.start).getTime(),
    end: new Date(item.presentation.end).getTime(),
  })).filter(({ start, end }) => Number.isFinite(start) && Number.isFinite(end) && start < end);
  const conflicts: CartTimingConflict[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < scheduled.length; i++) {
    for (let j = i + 1; j < scheduled.length; j++) {
      const a = scheduled[i];
      const b = scheduled[j];
      if (a.item.presentation.id === b.item.presentation.id ||
          (a.item.payment_state === "COMPLETED" && b.item.payment_state === "COMPLETED")) continue;
      const start = Math.max(a.start, b.start);
      const end = Math.min(a.end, b.end);
      if (start >= end) continue;

      const key = [a.item.presentation.id, b.item.presentation.id].sort((x, y) => x - y).join(":");
      if (seen.has(key)) continue;
      seen.add(key);
      const [selected, other] = a.item.payment_state === "COMPLETED" ? [b.item, a.item] : [a.item, b.item];
      conflicts.push({ selected, other, start: new Date(start), end: new Date(end) });
    }
  }
  return conflicts;
};
