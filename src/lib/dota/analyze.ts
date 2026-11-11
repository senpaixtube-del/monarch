import { HERO_TAGS, ITEM_KEYS } from "./heroes-threats";

export type BoughtItem = { key: string; name: string; minute: number | null };
export type Suggestion = { item: string; reason: string };
export type FightRow = {
  minute: number;
  deaths: number;
  damage: number;
  gold: number;
  note: string;
};
export type TurnRow = { minute: number; gold: number; swing: number; note: string };
export type Evidence = { title: string; detail: string };

export type MatchReport = {
  matchId: number;
  radiantWin: boolean;
  won: boolean;
  duration: number;
  heroName: string;
  heroId: number;
  side: "Radiant" | "Dire";
  k: number;
  d: number;
  a: number;
  gpm: number;
  xpm: number;
  lastHits: number;
  denies: number;
  heroDamage: number;
  towerDamage: number;
  netWorth: number;
  parsed: boolean;
  gpmPct: number | null;
  xpmPct: number | null;
  lh10: number | null;
  deathsBefore10: number | null;
  laneNote: string;
  laneVerdict: string;
  laneEvidence: Evidence[];
  items: BoughtItem[];
  suggestions: Suggestion[];
  itemEvidence: Evidence[];
  fights: FightRow[];
  fightEvidence: Evidence[];
  turns: TurnRow[];
  goldSeries: { minute: number; gold: number }[];
  reasons: Evidence[];
  strengths: Evidence[];
  next: Evidence[];
  score: number;
  replayUrl: string | null;
  opendotaUrl: string;
  dotabuffUrl: string;
  story: string;
  radiantScore: number;
  direScore: number;
};

type AnyRec = Record<string, unknown>;

const STEAM64_BASE = 76561197960265728n;

export function parseLookup(raw: string): { accountId?: number; matchId?: number; error?: string } {
  let s = raw.trim();
  if (!s) return { error: "چیزی وارد نشده." };
  const urlId = s.match(/\/profiles\/(\d{17})/);
  if (urlId) s = urlId[1]!;
  const vanity = s.match(/steamcommunity\.com\/id\/([^/?#]+)/i);
  if (vanity) return { error: `لینک سفارشی استیم (${vanity[1]}) را اینجا نمی‌شود مستقیم خواند. SteamID64 یا Account ID بگذار.` };
  if (!/^\d+$/.test(s)) return { error: "فقط عدد: SteamID64، Account ID یا Match ID." };
  if (s.length >= 17) {
    const id = Number(BigInt(s) - STEAM64_BASE);
    if (id <= 0 || id > 4_000_000_000) return { error: "SteamID64 نامعتبر است." };
    return { accountId: id };
  }
  const n = Number(s);
  if (n > 50_000_000) return { matchId: n };
  return { accountId: n };
}

function num(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function itemName(key: string, names: Record<string, string>): string {
  return names[key] ?? key.replaceAll("_", " ");
}

function pctFromBins(bins: unknown, value: number): number | null {
  if (!Array.isArray(bins) || bins.length === 0) return null;
  let best = 0;
  for (const b of bins) {
    const row = b as AnyRec;
    if (value >= num(row.value)) best = Math.round(num(row.percentile) * 100);
  }
  return best;
}

function hasAny(keys: Set<string>, list: string[]): boolean {
  return list.some((k) => keys.has(k));
}

export function buildReport(input: {
  match: AnyRec;
  focusAccountId?: number;
  heroNames: Record<number, string>;
  itemNames: Record<string, string>;
  itemIds?: Record<number, string>;
  benchmark?: AnyRec | null;
}): MatchReport {
  const match = input.match;
  const players = (match.players as AnyRec[]) ?? [];
  let me = players.find((p) => input.focusAccountId && num(p.account_id) === input.focusAccountId);
  if (!me) me = players[0];
  if (!me) throw new Error("بازیکنی در این مچ پیدا نشد.");

  const heroId = num(me.hero_id);
  const heroName = input.heroNames[heroId] ?? `هیرو ${heroId}`;
  const radiant = num(me.player_slot) < 128;
  const radiantWin = Boolean(match.radiant_win);
  const won = radiant === radiantWin;
  const duration = num(match.duration);
  const parsed = Boolean((match as AnyRec).version) || Array.isArray(match.teamfights);

  const purchase = (me.purchase_log as AnyRec[] | undefined) ?? [];
  const finalSlots = [0, 1, 2, 3, 4, 5]
    .map((i) => me[`item_${i}`])
    .filter((id) => typeof id === "number" && id > 0) as number[];

  const idToKey = input.itemIds ?? {};
  const boughtMap = new Map<string, BoughtItem>();
  for (const row of purchase) {
    const key = String(row.key ?? "");
    if (!key || boughtMap.has(key)) continue;
    const minute = Math.max(0, Math.round(num(row.time) / 60));
    boughtMap.set(key, { key, name: itemName(key, input.itemNames), minute });
  }
  if (boughtMap.size === 0) {
    for (const id of finalSlots) {
      const key = idToKey[id] ?? String(id);
      boughtMap.set(key, { key, name: itemName(key, input.itemNames), minute: null });
    }
  }
  const items = [...boughtMap.values()].sort((a, b) => (a.minute ?? 99) - (b.minute ?? 99));
  const owned = new Set(items.map((i) => i.key));

  const enemies = players.filter((p) => (num(p.player_slot) < 128) !== radiant);
  const enemyNames = enemies.map((p) => input.heroNames[num(p.hero_id)] ?? "?");
  const tagCount = new Map<string, string[]>();
  for (const name of enemyNames) {
    for (const tag of HERO_TAGS[name] ?? []) {
      const list = tagCount.get(tag) ?? [];
      list.push(name);
      tagCount.set(tag, list);
    }
  }
  const suggestions: Suggestion[] = [];
  const disables = tagCount.get("disable") ?? [];
  const magics = tagCount.get("magic") ?? [];
  const evasions = tagCount.get("evasion") ?? [];
  const illus = tagCount.get("illusions") ?? [];
  const invis = tagCount.get("invis") ?? [];
  const bkbTime = items.find((i) => i.key === "black_king_bar")?.minute ?? null;

  if (disables.length >= 2 && !hasAny(owned, ITEM_KEYS.bkb)) {
    suggestions.push({
      item: "Black King Bar",
      reason: `${disables.length} هیرو دیسیبل در تیم دشمن: ${disables.slice(0, 4).join("، ")}. در آیتم‌های نهایی BKB نیست.`,
    });
  } else if (bkbTime !== null && bkbTime >= 28 && disables.length >= 2) {
    suggestions.push({
      item: "Black King Bar زودتر",
      reason: `BKB دقیقه ${bkbTime} آمده. دشمن از قبل ${disables.slice(0, 3).join("، ")} داشته.`,
    });
  }
  if (evasions.length && !hasAny(owned, [...ITEM_KEYS.mkb, ...ITEM_KEYS.bloodthorn])) {
    suggestions.push({
      item: "Monkey King Bar",
      reason: `فرار از حمله: ${evasions.join("، ")}. نه MKB خریدی نه Bloodthorn.`,
    });
  }
  if (illus.length >= 1 && !hasAny(owned, [...ITEM_KEYS.bfury, ...ITEM_KEYS.mjollnir, ...ITEM_KEYS.crimson, "maelstrom", "gleipnir", "radiance"])) {
    suggestions.push({
      item: "پاک‌سازی ایلوژن",
      reason: `ایلوژن/کپی: ${illus.join("، ")}. آیتم موج‌زن یا ضد ایلوژن در بیلد نیست.`,
    });
  }
  if (magics.length >= 3 && !hasAny(owned, [...ITEM_KEYS.pipe, ...ITEM_KEYS.bkb, "hood_of_defiance", "eternal_shroud"])) {
    suggestions.push({
      item: "Pipe یا BKB",
      reason: `حجم مجیک بالا از ${magics.slice(0, 4).join("، ")}. نه Pipe هست نه BKB.`,
    });
  }
  if (invis.length && !hasAny(owned, [...ITEM_KEYS.dust, ...ITEM_KEYS.gem, ...ITEM_KEYS.sentry, ...ITEM_KEYS.silver])) {
    suggestions.push({
      item: "دید / تشخیص",
      reason: `نامرئی: ${invis.join("، ")}. Dust، Sentry، Gem یا Silver Edge در خریدها نیست.`,
    });
  }

  const lhT = me.lh_t as number[] | undefined;
  const lh10 = Array.isArray(lhT) && lhT.length > 10 ? lhT[10]! : null;
  let deathsBefore10: number | null = null;
  const deathLog = (me as AnyRec).death_times as number[] | undefined;
  // OpenDota doesn't always expose death_times; kills against player aren't here.
  // Use purchase absence. deaths_log isn't standard. We'll approximate from first_death if present.
  if (Array.isArray((me as AnyRec).deaths_log)) {
    deathsBefore10 = ((me as AnyRec).deaths_log as AnyRec[]).filter((d) => num(d.time) < 600).length;
  }

  const gpm = num(me.gold_per_min);
  const xpm = num(me.xp_per_min);
  const benchResult = (input.benchmark?.result ?? input.benchmark) as AnyRec | undefined;
  const gpmPct = pctFromBins(benchResult?.gold_per_min, gpm);
  const xpmPct = pctFromBins(benchResult?.xp_per_min, xpm);

  const laneEvidence: Evidence[] = [];
  if (lh10 !== null) {
    laneEvidence.push({
      title: `لست‌هیت دقیقه ۱۰: ${lh10}`,
      detail: `تا دقیقه ۱۰ دقیقاً ${lh10} لست‌هیت ثبت شده (آرایه lh_t).`,
    });
  }
  if (gpmPct !== null) {
    laneEvidence.push({
      title: `GPM صدک ${gpmPct}`,
      detail: `گلد در دقیقه ${gpm} نسبت به بنچمارک همین هیرو روی OpenDota.`,
    });
  }
  const laneRole = num(me.lane_role);
  const roleLabel = ["", "سیف", "مید", "آف", "جنگل", "روم"][laneRole] ?? "نامشخص";
  let laneVerdict = "داده لین ناقص است";
  if (lh10 !== null) {
    if (lh10 >= 60 && (laneRole === 1 || laneRole === 2)) laneVerdict = "لین از نظر فارم قابل قبول";
    else if (lh10 < 40 && (laneRole === 1 || laneRole === 2)) laneVerdict = "لین از نظر فارم ضعیف";
    else laneVerdict = "لین معمولی";
  }
  const laneNote = `نقش ثبت‌شده: ${roleLabel}. لن ${num(me.lane) || "—"}.`;

  const goldAdv = (match.radiant_gold_adv as number[] | undefined) ?? [];
  const signed = radiant ? 1 : -1;
  const goldSeries = goldAdv.map((g, minute) => ({ minute, gold: g * signed }));
  const turns: TurnRow[] = [];
  for (let i = 1; i < goldSeries.length; i++) {
    const swing = goldSeries[i]!.gold - goldSeries[i - 1]!.gold;
    if (Math.abs(swing) >= 1500) {
      turns.push({
        minute: i,
        gold: goldSeries[i]!.gold,
        swing,
        note:
          swing < 0
            ? `در یک دقیقه ${Math.abs(swing).toLocaleString("fa-IR")} گلد نسبت به تیم از دست رفت. موجودی تیم: ${goldSeries[i]!.gold.toLocaleString("fa-IR")}.`
            : `در یک دقیقه ${swing.toLocaleString("fa-IR")} گلد نسبت به تیم به‌دست آمد. موجودی: ${goldSeries[i]!.gold.toLocaleString("fa-IR")}.`,
      });
    }
  }
  turns.sort((a, b) => Math.abs(b.swing) - Math.abs(a.swing));
  const topTurns = turns.slice(0, 6).sort((a, b) => a.minute - b.minute);

  const myIndex = players.indexOf(me);
  const fights: FightRow[] = [];
  const tfs = (match.teamfights as AnyRec[] | undefined) ?? [];
  for (const tf of tfs) {
    const start = num(tf.start);
    const plist = (tf.players as AnyRec[] | undefined) ?? [];
    const row = plist[myIndex];
    if (!row) continue;
    const deaths = num(row.deaths);
    const damage = num(row.damage);
    const gold = num(row.gold_delta);
    if (deaths === 0 && damage < 200 && Math.abs(gold) < 200) continue;
    fights.push({
      minute: Math.round(start / 60),
      deaths,
      damage,
      gold,
      note:
        deaths > 0
          ? `در این فایت مردی و ${damage.toLocaleString("fa-IR")} آسیب ثبت شد.`
          : `${damage.toLocaleString("fa-IR")} آسیب، تغییر گلد ${gold.toLocaleString("fa-IR")}.`,
    });
  }
  const keyFights = [...fights].sort((a, b) => b.deaths - a.deaths || b.damage - a.damage).slice(0, 5);

  const fightEvidence: Evidence[] = [];
  const diedIn = fights.filter((f) => f.deaths > 0);
  if (tfs.length) {
    fightEvidence.push({
      title: `${tfs.length} تیم‌فایت پارس‌شده`,
      detail: diedIn.length
        ? `در ${diedIn.length} تا از آن‌ها حداقل یک مرگ داشتی.`
        : "در فایت‌های ثبت‌شده مرگ نداشتی.",
    });
  } else {
    fightEvidence.push({
      title: "ریپلی هنوز پارس نشده",
      detail: "OpenDota جزئیات تیم‌فایت این مچ را ندارد. آمار کلی از API خام است.",
    });
  }

  const k = num(me.kills);
  const d = num(me.deaths);
  const a = num(me.assists);
  const itemEvidence: Evidence[] = items.slice(0, 8).map((it) => ({
    title: it.minute === null ? it.name : `${it.name} · دقیقه ${it.minute}`,
    detail: it.minute === null ? "زمان خرید در داده خام نیست؛ فقط اسلات نهایی." : "از purchase_log.",
  }));

  const reasons: Evidence[] = [];
  const strengths: Evidence[] = [];
  if (!won && d >= 8) {
    reasons.push({
      title: `${d} مرگ`,
      detail: `نسبت KDA برابر ${k}/${d}/${a}. هر مرگ هم گلد می‌دهد هم تمپو را می‌شکند.`,
    });
  }
  if (!won && lh10 !== null && lh10 < 40 && (laneRole === 1 || laneRole === 2)) {
    reasons.push({
      title: "فارم لین پایین",
      detail: `${lh10} لست‌هیت تا دقیقه ۱۰ برای کر (${roleLabel}) زیر سطح معمول است.`,
    });
  }
  if (!won && suggestions[0]) {
    reasons.push({ title: suggestions[0].item, detail: suggestions[0].reason });
  }
  if (!won && topTurns.some((t) => t.swing <= -2000)) {
    const worst = [...topTurns].sort((a, b) => a.swing - b.swing)[0]!;
    reasons.push({
      title: `سویینگ گلد دقیقه ${worst.minute}`,
      detail: worst.note,
    });
  }
  if (won && gpmPct !== null && gpmPct >= 60) {
    strengths.push({ title: `اقتصاد قوی (صدک ${gpmPct})`, detail: `GPM برابر ${gpm}.` });
  }
  if (d <= 4 && duration > 1500) {
    strengths.push({ title: "مرگ کم", detail: `فقط ${d} مرگ در ${Math.round(duration / 60)} دقیقه.` });
  }
  if (num(me.tower_damage) > 4000) {
    strengths.push({
      title: "فشار آبجکتیو",
      detail: `${num(me.tower_damage).toLocaleString("fa-IR")} آسیب به ساختمان.`,
    });
  }
  if (won && reasons.length === 0) {
    strengths.push({
      title: "نتیجه با تیم",
      detail: radiantWin ? "ریدینت برد." : "دایر برد.",
    });
  }
  if (!won && reasons.length === 0) {
    reasons.push({
      title: "باخت تیمی",
      detail: `امتیاز ${num(match.radiant_score)}–${num(match.dire_score)}. یک دلیل تکی غالب در آمار شخصی برجسته نیست.`,
    });
  }
  if (reasons.length === 0) {
    const kda = d === 0 ? k + a : ((k + a) / d).toFixed(2);
    reasons.push({
      title: won ? "برد با این اعداد" : "شکل باخت",
      detail: `${heroName} با ${k}/${d}/${a} (نسبت ${kda}) تمام کرد. GPM ${gpm}${gpmPct !== null ? `، صدک ${gpmPct} همین هیرو` : ""}. آسیب هیرو ${num(me.hero_damage).toLocaleString("fa-IR")} و آسیب ساختمان ${num(me.tower_damage).toLocaleString("fa-IR")}. امتیاز نهایی ${num(match.radiant_score)}–${num(match.dire_score)}.`,
    });
  }
  if (d >= 6 && d < 8) {
    reasons.push({
      title: `${d} مرگ`,
      detail: `در ${Math.round(duration / 60)} دقیقه، ${d} بار مردی. این عدد هم گلد دشمن را بالا می‌برد هم حضور تو در آبجکتیو را کم می‌کند.`,
    });
  }

  const next: Evidence[] = [];
  if (suggestions[0]) next.push({ title: suggestions[0].item, detail: suggestions[0].reason });
  if (d >= 7) next.push({ title: "مرگ را کم کن", detail: `این بازی ${d} بار مردی. هدف بازی بعد: حداکثر ${Math.max(3, d - 3)} مرگ.` });
  if (lh10 !== null && lh10 < 50 && (laneRole === 1 || laneRole === 2)) {
    next.push({ title: "لست‌هیت ۱۰ دقیقه", detail: `این بار ${lh10}. هدف بعدی بالای ۵۵ برای کر.` });
  }
  if (next.length === 0) {
    next.push({ title: "همین تمپو را حفظ کن", detail: "عددهای این مچ نقطه ضعف تکی بزرگی نشان نمی‌دهند." });
  }

  let score = 5;
  if (gpmPct !== null) score += (gpmPct - 50) / 25;
  score += won ? 1.2 : -1.2;
  score -= Math.max(0, d - 5) * 0.25;
  if (lh10 !== null && (laneRole === 1 || laneRole === 2)) score += (lh10 - 50) / 40;
  score = Math.max(1, Math.min(10, Math.round(score * 10) / 10));

  const matchId = num(match.match_id);
  const replayRaw = match.replay_url;
  const cluster = num(match.cluster);
  const salt = num(match.replay_salt);
  const replayUrl =
    typeof replayRaw === "string" && replayRaw.startsWith("http")
      ? replayRaw
      : cluster && salt
        ? `http://replay${cluster}.valve.net/570/${matchId}_${salt}.dem.bz2`
        : null;

  const mins = Math.round(duration / 60);
  const story = [
    `${won ? "بردید" : "باختید"}. ${heroName} سمت ${radiant ? "ریدینت" : "دایر"}، ${mins} دقیقه، امتیاز ${num(match.radiant_score)} به ${num(match.dire_score)}.`,
    `خط شخصی: ${k} کیل، ${d} دث، ${a} اسیست. در دقیقه ${gpm} گلد و ${xpm} اکسپی می‌گرفتی${gpmPct !== null ? ` (GPM حدود صدک ${gpmPct} بازیکن‌های همین هیرو)` : ""}.`,
    lh10 !== null
      ? `تا دقیقه ۱۰ دقیقاً ${lh10} لست‌هیت داشتی (${roleLabel}).`
      : "لست‌هیت دقیق دقیقه ۱۰ در این پاسخ API نیست.",
    suggestions[0]
      ? `نسبت به درفت دشمن، مهم‌ترین جای خالی بیلد: ${suggestions[0].item}. ${suggestions[0].reason}`
      : "در بیلد نهایی، کانتر مکانیکی واضحی نسبت به تگ‌های دشمن جا نمانده.",
    parsed
      ? `ریپلی پارس شده و ${tfs.length} تیم‌فایت در داده هست.`
      : "OpenDota این ریپلی را هنوز پارس نکرده؛ تیم‌فایت ثانیه‌به‌ثانیه موجود نیست و تحلیل از آمار کلی، آیتم و گراف گلد است.",
    replayUrl
      ? "فایل دمو هنوز روی سرور ولو هست و از همین صفحه دانلود می‌شود."
      : "لینک مستقیم دمو در API نیست (معمولاً منقضی شده). صفحه OpenDota و Dotabuff هنوز خود مچ را نشان می‌دهند.",
  ].join(" ");

  return {
    matchId,
    radiantWin,
    won,
    duration,
    heroName,
    heroId,
    side: radiant ? "Radiant" : "Dire",
    k,
    d,
    a,
    gpm,
    xpm,
    lastHits: num(me.last_hits),
    denies: num(me.denies),
    heroDamage: num(me.hero_damage),
    towerDamage: num(me.tower_damage),
    netWorth: num(me.net_worth) || num(me.total_gold),
    parsed,
    gpmPct,
    xpmPct,
    lh10,
    deathsBefore10,
    laneNote,
    laneVerdict,
    laneEvidence,
    items,
    suggestions: suggestions.slice(0, 4),
    itemEvidence,
    fights: keyFights.sort((a, b) => a.minute - b.minute),
    fightEvidence,
    turns: topTurns,
    goldSeries,
    reasons: reasons.slice(0, 4),
    strengths: strengths.slice(0, 3),
    next: next.slice(0, 3),
    score,
    replayUrl,
    opendotaUrl: `https://www.opendota.com/matches/${matchId}`,
    dotabuffUrl: `https://www.dotabuff.com/matches/${matchId}`,
    story,
    radiantScore: num(match.radiant_score),
    direScore: num(match.dire_score),
  };
}
