import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildReport, parseLookup, type MatchReport } from "./analyze";

const BASE = "https://api.opendota.com/api";

type HeroRow = { id: number; localized_name: string };
type ItemRow = { id?: number; dname?: string };

let heroCache: Record<number, string> | null = null;
let itemNameCache: Record<string, string> | null = null;
let itemIdCache: Record<number, string> | null = null;

async function od<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: "application/json", "User-Agent": "AinehMatchAnalyst/1.0" },
  });
  if (!res.ok) throw new Error(`OpenDota پاسخ ${res.status} داد.`);
  return (await res.json()) as T;
}

async function catalogs() {
  if (!heroCache || !itemNameCache || !itemIdCache) {
    const [heroes, items] = await Promise.all([
      od<HeroRow[]>("/heroes"),
      od<Record<string, ItemRow>>("/constants/items"),
    ]);
    heroCache = Object.fromEntries(heroes.map((h) => [h.id, h.localized_name]));
    itemNameCache = {};
    itemIdCache = {};
    for (const [key, row] of Object.entries(items)) {
      itemNameCache[key] = row.dname || key;
      if (typeof row.id === "number") itemIdCache[row.id] = key;
    }
  }
  return { heroNames: heroCache, itemNames: itemNameCache, itemIds: itemIdCache };
}

export type RecentRow = {
  matchId: number;
  heroName: string;
  heroId: number;
  k: number;
  d: number;
  a: number;
  won: boolean;
  duration: number;
  start: number;
};

export const lookupPlayer = createServerFn({ method: "POST" })
  .validator(z.object({ query: z.string().min(1).max(80) }))
  .handler(async ({ data }): Promise<{ accountId: number; recent: RecentRow[] }> => {
    const parsed = parseLookup(data.query);
    if (!parsed.accountId) throw new Error(parsed.error ?? "Account ID لازم است، نه Match ID.");
    const { heroNames } = await catalogs();
    const rows = await od<Record<string, unknown>[]>(
      `/players/${parsed.accountId}/recentMatches`,
    );
    const recent: RecentRow[] = rows.slice(0, 12).map((m) => {
      const slot = Number(m.player_slot ?? 0);
      const radiant = slot < 128;
      const radiantWin = Boolean(m.radiant_win);
      const heroId = Number(m.hero_id ?? 0);
      return {
        matchId: Number(m.match_id),
        heroId,
        heroName: heroNames[heroId] ?? `هیرو ${heroId}`,
        k: Number(m.kills ?? 0),
        d: Number(m.deaths ?? 0),
        a: Number(m.assists ?? 0),
        won: radiant === radiantWin,
        duration: Number(m.duration ?? 0),
        start: Number(m.start_time ?? 0),
      };
    });
    return { accountId: parsed.accountId, recent };
  });

export const loadReport = createServerFn({ method: "POST" })
  .validator(
    z.object({
      matchId: z.number().int().positive(),
      accountId: z.number().int().positive().optional(),
    }),
  )
  .handler(async ({ data }): Promise<MatchReport> => {
    const cats = await catalogs();
    const match = await od<Record<string, unknown>>(`/matches/${data.matchId}`);
    const players = (match.players as { hero_id?: number; account_id?: number }[]) ?? [];
    const me =
      players.find((p) => data.accountId && p.account_id === data.accountId) ?? players[0];
    const heroId = me?.hero_id ?? 0;
    let benchmark: Record<string, unknown> | null = null;
    if (heroId) {
      try {
        benchmark = await od(`/benchmarks?hero_id=${heroId}`);
      } catch {
        benchmark = null;
      }
    }
    return buildReport({
      match,
      focusAccountId: data.accountId,
      heroNames: cats.heroNames,
      itemNames: cats.itemNames,
      itemIds: cats.itemIds,
      benchmark,
    });
  });

export const resolveQuery = createServerFn({ method: "POST" })
  .validator(z.object({ query: z.string().min(1).max(120) }))
  .handler(async ({ data }) => parseLookup(data.query));
