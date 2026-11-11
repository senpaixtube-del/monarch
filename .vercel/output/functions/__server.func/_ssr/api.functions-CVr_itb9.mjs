import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { i as string, n as number, r as object } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api.functions-CVr_itb9.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/** Mechanical tags used only to justify item suggestions from the actual draft. */
var HERO_TAGS = {
	"Anti-Mage": ["mana-burn"],
	"Axe": ["disable", "physical"],
	Bane: ["disable", "magic"],
	Bloodseeker: ["silence"],
	"Crystal Maiden": ["disable", "magic"],
	"Drow Ranger": ["physical"],
	Earthshaker: ["disable", "magic"],
	Juggernaut: ["magic-immune", "physical"],
	"Mirana": ["magic"],
	Morphling: ["physical"],
	"Shadow Fiend": ["magic", "physical"],
	"Phantom Lancer": ["illusions"],
	Puck: ["disable", "magic"],
	Pudge: ["disable"],
	"Shadow Shaman": ["disable", "push"],
	Razor: ["physical"],
	"Sand King": ["disable", "magic"],
	"Storm Spirit": ["magic", "mobility"],
	Sven: ["physical", "disable"],
	Tiny: ["disable", "physical"],
	Vengefulspirit: ["disable", "physical"],
	Windrunner: ["physical"],
	Zeus: ["magic"],
	Kunkka: ["disable", "physical"],
	Lina: ["magic", "disable"],
	Lion: ["disable", "magic"],
	"Shadow Demon": ["illusions", "disable"],
	Tidehunter: ["disable"],
	"Witch Doctor": ["disable", "magic"],
	Lich: ["magic", "disable"],
	Enigma: ["disable"],
	"Faceless Void": ["disable"],
	"Phantom Assassin": ["evasion", "physical"],
	"Death Prophet": ["magic", "push"],
	"Templar Assassin": ["physical"],
	Viper: ["magic"],
	Luna: ["physical"],
	"Dragon Knight": ["push"],
	"Dazzle": ["save"],
	Clockwerk: ["disable"],
	Leshrac: ["magic", "push"],
	"Nature's Prophet": ["push"],
	"Life Stealer": ["magic-immune"],
	"Dark Seer": ["illusions"],
	Clinkz: ["physical", "invis"],
	Omniknight: ["save"],
	Enchantress: ["magic"],
	Huskar: ["magic"],
	"Night Stalker": ["silence"],
	Broodmother: ["push", "invis"],
	"Bounty Hunter": ["invis"],
	Weaver: ["mobility"],
	Jakiro: ["magic", "disable"],
	Batrider: ["disable", "magic"],
	"Chen": ["push"],
	Spectre: ["physical"],
	"Ancient Apparition": ["magic"],
	Doom: ["disable"],
	Ursa: ["physical"],
	"Spirit Breaker": ["disable"],
	Gyrocopter: ["physical"],
	Alchemist: ["physical"],
	Invoker: ["magic", "disable"],
	Silencer: ["silence"],
	"Outworld Destroyer": ["mana-burn", "magic"],
	Lycan: ["push"],
	Brewmaster: ["disable"],
	"Chaos Knight": ["illusions"],
	Meepo: ["physical"],
	Treant: ["disable"],
	"Ogre Magi": ["disable", "magic"],
	Undying: ["physical"],
	Rubick: ["disable"],
	Disruptor: ["disable", "silence"],
	"Nyx Assassin": [
		"disable",
		"mana-burn",
		"invis"
	],
	"Naga Siren": ["illusions", "disable"],
	"Keeper of the Light": ["mana-burn"],
	Wisp: ["save"],
	Visage: ["physical"],
	Slark: ["physical"],
	Medusa: ["physical"],
	"Troll Warlord": ["physical"],
	Centaur: ["disable"],
	Magnus: ["disable"],
	Timbersaw: ["magic"],
	Bristleback: ["physical"],
	"Tusk": ["disable"],
	Skywrath: ["magic", "silence"],
	Abaddon: ["save"],
	"Elder Titan": ["disable"],
	"Legion Commander": ["disable"],
	Techies: ["magic"],
	"Ember Spirit": ["magic", "physical"],
	"Earth Spirit": ["disable"],
	"Underlord": ["disable"],
	"Terrorblade": ["illusions", "physical"],
	Phoenix: ["magic"],
	Oracle: ["save", "magic"],
	"Winter Wyvern": ["disable"],
	"Arc Warden": ["illusions"],
	"Monkey King": ["physical"],
	"Dark Willow": ["disable", "magic"],
	Pangolier: ["disable"],
	Grimstroke: ["disable", "silence"],
	Hoodwink: ["physical"],
	"Void Spirit": ["magic", "disable"],
	Snapfire: ["magic", "disable"],
	Mars: ["disable"],
	"Dawnbreaker": ["save"],
	Marci: ["disable"],
	"Primal Beast": ["disable"],
	Muerta: ["physical", "magic"],
	Ringmaster: ["disable"],
	Kez: ["physical"]
};
var ITEM_KEYS = {
	bkb: ["black_king_bar"],
	mkb: ["monkey_king_bar"],
	bloodthorn: ["bloodthorn"],
	pipe: ["pipe"],
	linkens: ["sphere"],
	bfury: ["bfury"],
	mjollnir: ["mjollnir"],
	crimson: ["crimson_guard"],
	dust: ["dust"],
	gem: ["gem"],
	sentry: ["ward_sentry"],
	manta: ["manta"],
	hex: ["sheepstick"],
	nullifier: ["nullifier"],
	silver: ["silver_edge"],
	euls: ["cyclone"],
	lotus: ["lotus_orb"],
	glimmer: ["glimmer_cape"],
	force: ["force_staff"],
	ghost: ["ghost"]
};
var STEAM64_BASE = 76561197960265728n;
function parseLookup(raw) {
	let s = raw.trim();
	if (!s) return { error: "چیزی وارد نشده." };
	const urlId = s.match(/\/profiles\/(\d{17})/);
	if (urlId) s = urlId[1];
	const vanity = s.match(/steamcommunity\.com\/id\/([^/?#]+)/i);
	if (vanity) return { error: `لینک سفارشی استیم (${vanity[1]}) را اینجا نمی‌شود مستقیم خواند. SteamID64 یا Account ID بگذار.` };
	if (!/^\d+$/.test(s)) return { error: "فقط عدد: SteamID64، Account ID یا Match ID." };
	if (s.length >= 17) {
		const id = Number(BigInt(s) - STEAM64_BASE);
		if (id <= 0 || id > 4e9) return { error: "SteamID64 نامعتبر است." };
		return { accountId: id };
	}
	const n = Number(s);
	if (n > 5e7) return { matchId: n };
	return { accountId: n };
}
function num(v) {
	return typeof v === "number" && Number.isFinite(v) ? v : 0;
}
function itemName(key, names) {
	return names[key] ?? key.replaceAll("_", " ");
}
function pctFromBins(bins, value) {
	if (!Array.isArray(bins) || bins.length === 0) return null;
	let best = 0;
	for (const b of bins) {
		const row = b;
		if (value >= num(row.value)) best = Math.round(num(row.percentile) * 100);
	}
	return best;
}
function hasAny(keys, list) {
	return list.some((k) => keys.has(k));
}
function buildReport(input) {
	const match = input.match;
	const players = match.players ?? [];
	let me = players.find((p) => input.focusAccountId && num(p.account_id) === input.focusAccountId);
	if (!me) me = players[0];
	if (!me) throw new Error("بازیکنی در این مچ پیدا نشد.");
	const heroId = num(me.hero_id);
	const heroName = input.heroNames[heroId] ?? `هیرو ${heroId}`;
	const radiant = num(me.player_slot) < 128;
	const radiantWin = Boolean(match.radiant_win);
	const won = radiant === radiantWin;
	const duration = num(match.duration);
	const parsed = Boolean(match.version) || Array.isArray(match.teamfights);
	const purchase = me.purchase_log ?? [];
	const finalSlots = [
		0,
		1,
		2,
		3,
		4,
		5
	].map((i) => me[`item_${i}`]).filter((id) => typeof id === "number" && id > 0);
	const idToKey = input.itemIds ?? {};
	const boughtMap = /* @__PURE__ */ new Map();
	for (const row of purchase) {
		const key = String(row.key ?? "");
		if (!key || boughtMap.has(key)) continue;
		const minute = Math.max(0, Math.round(num(row.time) / 60));
		boughtMap.set(key, {
			key,
			name: itemName(key, input.itemNames),
			minute
		});
	}
	if (boughtMap.size === 0) for (const id of finalSlots) {
		const key = idToKey[id] ?? String(id);
		boughtMap.set(key, {
			key,
			name: itemName(key, input.itemNames),
			minute: null
		});
	}
	const items = [...boughtMap.values()].sort((a, b) => (a.minute ?? 99) - (b.minute ?? 99));
	const owned = new Set(items.map((i) => i.key));
	const enemyNames = players.filter((p) => num(p.player_slot) < 128 !== radiant).map((p) => input.heroNames[num(p.hero_id)] ?? "?");
	const tagCount = /* @__PURE__ */ new Map();
	for (const name of enemyNames) for (const tag of HERO_TAGS[name] ?? []) {
		const list = tagCount.get(tag) ?? [];
		list.push(name);
		tagCount.set(tag, list);
	}
	const suggestions = [];
	const disables = tagCount.get("disable") ?? [];
	const magics = tagCount.get("magic") ?? [];
	const evasions = tagCount.get("evasion") ?? [];
	const illus = tagCount.get("illusions") ?? [];
	const invis = tagCount.get("invis") ?? [];
	const bkbTime = items.find((i) => i.key === "black_king_bar")?.minute ?? null;
	if (disables.length >= 2 && !hasAny(owned, ITEM_KEYS.bkb)) suggestions.push({
		item: "Black King Bar",
		reason: `${disables.length} هیرو دیسیبل در تیم دشمن: ${disables.slice(0, 4).join("، ")}. در آیتم‌های نهایی BKB نیست.`
	});
	else if (bkbTime !== null && bkbTime >= 28 && disables.length >= 2) suggestions.push({
		item: "Black King Bar زودتر",
		reason: `BKB دقیقه ${bkbTime} آمده. دشمن از قبل ${disables.slice(0, 3).join("، ")} داشته.`
	});
	if (evasions.length && !hasAny(owned, [...ITEM_KEYS.mkb, ...ITEM_KEYS.bloodthorn])) suggestions.push({
		item: "Monkey King Bar",
		reason: `فرار از حمله: ${evasions.join("، ")}. نه MKB خریدی نه Bloodthorn.`
	});
	if (illus.length >= 1 && !hasAny(owned, [
		...ITEM_KEYS.bfury,
		...ITEM_KEYS.mjollnir,
		...ITEM_KEYS.crimson,
		"maelstrom",
		"gleipnir",
		"radiance"
	])) suggestions.push({
		item: "پاک‌سازی ایلوژن",
		reason: `ایلوژن/کپی: ${illus.join("، ")}. آیتم موج‌زن یا ضد ایلوژن در بیلد نیست.`
	});
	if (magics.length >= 3 && !hasAny(owned, [
		...ITEM_KEYS.pipe,
		...ITEM_KEYS.bkb,
		"hood_of_defiance",
		"eternal_shroud"
	])) suggestions.push({
		item: "Pipe یا BKB",
		reason: `حجم مجیک بالا از ${magics.slice(0, 4).join("، ")}. نه Pipe هست نه BKB.`
	});
	if (invis.length && !hasAny(owned, [
		...ITEM_KEYS.dust,
		...ITEM_KEYS.gem,
		...ITEM_KEYS.sentry,
		...ITEM_KEYS.silver
	])) suggestions.push({
		item: "دید / تشخیص",
		reason: `نامرئی: ${invis.join("، ")}. Dust، Sentry، Gem یا Silver Edge در خریدها نیست.`
	});
	const lhT = me.lh_t;
	const lh10 = Array.isArray(lhT) && lhT.length > 10 ? lhT[10] : null;
	let deathsBefore10 = null;
	me.death_times;
	if (Array.isArray(me.deaths_log)) deathsBefore10 = me.deaths_log.filter((d) => num(d.time) < 600).length;
	const gpm = num(me.gold_per_min);
	const xpm = num(me.xp_per_min);
	const benchResult = input.benchmark?.result ?? input.benchmark;
	const gpmPct = pctFromBins(benchResult?.gold_per_min, gpm);
	const xpmPct = pctFromBins(benchResult?.xp_per_min, xpm);
	const laneEvidence = [];
	if (lh10 !== null) laneEvidence.push({
		title: `لست‌هیت دقیقه ۱۰: ${lh10}`,
		detail: `تا دقیقه ۱۰ دقیقاً ${lh10} لست‌هیت ثبت شده (آرایه lh_t).`
	});
	if (gpmPct !== null) laneEvidence.push({
		title: `GPM صدک ${gpmPct}`,
		detail: `گلد در دقیقه ${gpm} نسبت به بنچمارک همین هیرو روی OpenDota.`
	});
	const laneRole = num(me.lane_role);
	const roleLabel = [
		"",
		"سیف",
		"مید",
		"آف",
		"جنگل",
		"روم"
	][laneRole] ?? "نامشخص";
	let laneVerdict = "داده لین ناقص است";
	if (lh10 !== null) {
		if (lh10 >= 60 && (laneRole === 1 || laneRole === 2)) laneVerdict = "لین از نظر فارم قابل قبول";
		else if (lh10 < 40 && (laneRole === 1 || laneRole === 2)) laneVerdict = "لین از نظر فارم ضعیف";
		else laneVerdict = "لین معمولی";
	}
	const laneNote = `نقش ثبت‌شده: ${roleLabel}. لن ${num(me.lane) || "—"}.`;
	const goldAdv = match.radiant_gold_adv ?? [];
	const signed = radiant ? 1 : -1;
	const goldSeries = goldAdv.map((g, minute) => ({
		minute,
		gold: g * signed
	}));
	const turns = [];
	for (let i = 1; i < goldSeries.length; i++) {
		const swing = goldSeries[i].gold - goldSeries[i - 1].gold;
		if (Math.abs(swing) >= 1500) turns.push({
			minute: i,
			gold: goldSeries[i].gold,
			swing,
			note: swing < 0 ? `در یک دقیقه ${Math.abs(swing).toLocaleString("fa-IR")} گلد نسبت به تیم از دست رفت. موجودی تیم: ${goldSeries[i].gold.toLocaleString("fa-IR")}.` : `در یک دقیقه ${swing.toLocaleString("fa-IR")} گلد نسبت به تیم به‌دست آمد. موجودی: ${goldSeries[i].gold.toLocaleString("fa-IR")}.`
		});
	}
	turns.sort((a, b) => Math.abs(b.swing) - Math.abs(a.swing));
	const topTurns = turns.slice(0, 6).sort((a, b) => a.minute - b.minute);
	const myIndex = players.indexOf(me);
	const fights = [];
	const tfs = match.teamfights ?? [];
	for (const tf of tfs) {
		const start = num(tf.start);
		const row = (tf.players ?? [])[myIndex];
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
			note: deaths > 0 ? `در این فایت مردی و ${damage.toLocaleString("fa-IR")} آسیب ثبت شد.` : `${damage.toLocaleString("fa-IR")} آسیب، تغییر گلد ${gold.toLocaleString("fa-IR")}.`
		});
	}
	const keyFights = [...fights].sort((a, b) => b.deaths - a.deaths || b.damage - a.damage).slice(0, 5);
	const fightEvidence = [];
	const diedIn = fights.filter((f) => f.deaths > 0);
	if (tfs.length) fightEvidence.push({
		title: `${tfs.length} تیم‌فایت پارس‌شده`,
		detail: diedIn.length ? `در ${diedIn.length} تا از آن‌ها حداقل یک مرگ داشتی.` : "در فایت‌های ثبت‌شده مرگ نداشتی."
	});
	else fightEvidence.push({
		title: "ریپلی هنوز پارس نشده",
		detail: "OpenDota جزئیات تیم‌فایت این مچ را ندارد. آمار کلی از API خام است."
	});
	const k = num(me.kills);
	const d = num(me.deaths);
	const a = num(me.assists);
	const itemEvidence = items.slice(0, 8).map((it) => ({
		title: it.minute === null ? it.name : `${it.name} · دقیقه ${it.minute}`,
		detail: it.minute === null ? "زمان خرید در داده خام نیست؛ فقط اسلات نهایی." : "از purchase_log."
	}));
	const reasons = [];
	const strengths = [];
	if (!won && d >= 8) reasons.push({
		title: `${d} مرگ`,
		detail: `نسبت KDA برابر ${k}/${d}/${a}. هر مرگ هم گلد می‌دهد هم تمپو را می‌شکند.`
	});
	if (!won && lh10 !== null && lh10 < 40 && (laneRole === 1 || laneRole === 2)) reasons.push({
		title: "فارم لین پایین",
		detail: `${lh10} لست‌هیت تا دقیقه ۱۰ برای کر (${roleLabel}) زیر سطح معمول است.`
	});
	if (!won && suggestions[0]) reasons.push({
		title: suggestions[0].item,
		detail: suggestions[0].reason
	});
	if (!won && topTurns.some((t) => t.swing <= -2e3)) {
		const worst = [...topTurns].sort((a, b) => a.swing - b.swing)[0];
		reasons.push({
			title: `سویینگ گلد دقیقه ${worst.minute}`,
			detail: worst.note
		});
	}
	if (won && gpmPct !== null && gpmPct >= 60) strengths.push({
		title: `اقتصاد قوی (صدک ${gpmPct})`,
		detail: `GPM برابر ${gpm}.`
	});
	if (d <= 4 && duration > 1500) strengths.push({
		title: "مرگ کم",
		detail: `فقط ${d} مرگ در ${Math.round(duration / 60)} دقیقه.`
	});
	if (num(me.tower_damage) > 4e3) strengths.push({
		title: "فشار آبجکتیو",
		detail: `${num(me.tower_damage).toLocaleString("fa-IR")} آسیب به ساختمان.`
	});
	if (won && reasons.length === 0) strengths.push({
		title: "نتیجه با تیم",
		detail: radiantWin ? "ریدینت برد." : "دایر برد."
	});
	if (!won && reasons.length === 0) reasons.push({
		title: "باخت تیمی",
		detail: `امتیاز ${num(match.radiant_score)}–${num(match.dire_score)}. یک دلیل تکی غالب در آمار شخصی برجسته نیست.`
	});
	if (reasons.length === 0) {
		const kda = d === 0 ? k + a : ((k + a) / d).toFixed(2);
		reasons.push({
			title: won ? "برد با این اعداد" : "شکل باخت",
			detail: `${heroName} با ${k}/${d}/${a} (نسبت ${kda}) تمام کرد. GPM ${gpm}${gpmPct !== null ? `، صدک ${gpmPct} همین هیرو` : ""}. آسیب هیرو ${num(me.hero_damage).toLocaleString("fa-IR")} و آسیب ساختمان ${num(me.tower_damage).toLocaleString("fa-IR")}. امتیاز نهایی ${num(match.radiant_score)}–${num(match.dire_score)}.`
		});
	}
	if (d >= 6 && d < 8) reasons.push({
		title: `${d} مرگ`,
		detail: `در ${Math.round(duration / 60)} دقیقه، ${d} بار مردی. این عدد هم گلد دشمن را بالا می‌برد هم حضور تو در آبجکتیو را کم می‌کند.`
	});
	const next = [];
	if (suggestions[0]) next.push({
		title: suggestions[0].item,
		detail: suggestions[0].reason
	});
	if (d >= 7) next.push({
		title: "مرگ را کم کن",
		detail: `این بازی ${d} بار مردی. هدف بازی بعد: حداکثر ${Math.max(3, d - 3)} مرگ.`
	});
	if (lh10 !== null && lh10 < 50 && (laneRole === 1 || laneRole === 2)) next.push({
		title: "لست‌هیت ۱۰ دقیقه",
		detail: `این بار ${lh10}. هدف بعدی بالای ۵۵ برای کر.`
	});
	if (next.length === 0) next.push({
		title: "همین تمپو را حفظ کن",
		detail: "عددهای این مچ نقطه ضعف تکی بزرگی نشان نمی‌دهند."
	});
	let score = 5;
	if (gpmPct !== null) score += (gpmPct - 50) / 25;
	score += won ? 1.2 : -1.2;
	score -= Math.max(0, d - 5) * .25;
	if (lh10 !== null && (laneRole === 1 || laneRole === 2)) score += (lh10 - 50) / 40;
	score = Math.max(1, Math.min(10, Math.round(score * 10) / 10));
	const matchId = num(match.match_id);
	const replayRaw = match.replay_url;
	const cluster = num(match.cluster);
	const salt = num(match.replay_salt);
	const replayUrl = typeof replayRaw === "string" && replayRaw.startsWith("http") ? replayRaw : cluster && salt ? `http://replay${cluster}.valve.net/570/${matchId}_${salt}.dem.bz2` : null;
	const mins = Math.round(duration / 60);
	const story = [
		`${won ? "بردید" : "باختید"}. ${heroName} سمت ${radiant ? "ریدینت" : "دایر"}، ${mins} دقیقه، امتیاز ${num(match.radiant_score)} به ${num(match.dire_score)}.`,
		`خط شخصی: ${k} کیل، ${d} دث، ${a} اسیست. در دقیقه ${gpm} گلد و ${xpm} اکسپی می‌گرفتی${gpmPct !== null ? ` (GPM حدود صدک ${gpmPct} بازیکن‌های همین هیرو)` : ""}.`,
		lh10 !== null ? `تا دقیقه ۱۰ دقیقاً ${lh10} لست‌هیت داشتی (${roleLabel}).` : "لست‌هیت دقیق دقیقه ۱۰ در این پاسخ API نیست.",
		suggestions[0] ? `نسبت به درفت دشمن، مهم‌ترین جای خالی بیلد: ${suggestions[0].item}. ${suggestions[0].reason}` : "در بیلد نهایی، کانتر مکانیکی واضحی نسبت به تگ‌های دشمن جا نمانده.",
		parsed ? `ریپلی پارس شده و ${tfs.length} تیم‌فایت در داده هست.` : "OpenDota این ریپلی را هنوز پارس نکرده؛ تیم‌فایت ثانیه‌به‌ثانیه موجود نیست و تحلیل از آمار کلی، آیتم و گراف گلد است.",
		replayUrl ? "فایل دمو هنوز روی سرور ولو هست و از همین صفحه دانلود می‌شود." : "لینک مستقیم دمو در API نیست (معمولاً منقضی شده). صفحه OpenDota و Dotabuff هنوز خود مچ را نشان می‌دهند."
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
		direScore: num(match.dire_score)
	};
}
var BASE = "https://api.opendota.com/api";
var heroCache = null;
var itemNameCache = null;
var itemIdCache = null;
async function od(path) {
	const res = await fetch(`${BASE}${path}`, { headers: {
		Accept: "application/json",
		"User-Agent": "AinehMatchAnalyst/1.0"
	} });
	if (!res.ok) throw new Error(`OpenDota پاسخ ${res.status} داد.`);
	return await res.json();
}
async function catalogs() {
	if (!heroCache || !itemNameCache || !itemIdCache) {
		const [heroes, items] = await Promise.all([od("/heroes"), od("/constants/items")]);
		heroCache = Object.fromEntries(heroes.map((h) => [h.id, h.localized_name]));
		itemNameCache = {};
		itemIdCache = {};
		for (const [key, row] of Object.entries(items)) {
			itemNameCache[key] = row.dname || key;
			if (typeof row.id === "number") itemIdCache[row.id] = key;
		}
	}
	return {
		heroNames: heroCache,
		itemNames: itemNameCache,
		itemIds: itemIdCache
	};
}
var lookupPlayer_createServerFn_handler = createServerRpc({
	id: "b9ed699c6a9b4304914ac2b8e3c38fdb82847c8e6c67db782df5e86d541b05b9",
	name: "lookupPlayer",
	filename: "src/lib/dota/api.functions.ts"
}, (opts) => lookupPlayer.__executeServer(opts));
var lookupPlayer = createServerFn({ method: "POST" }).validator(object({ query: string().min(1).max(80) })).handler(lookupPlayer_createServerFn_handler, async ({ data }) => {
	const parsed = parseLookup(data.query);
	if (!parsed.accountId) throw new Error(parsed.error ?? "Account ID لازم است، نه Match ID.");
	const { heroNames } = await catalogs();
	const recent = (await od(`/players/${parsed.accountId}/recentMatches`)).slice(0, 12).map((m) => {
		const radiant = Number(m.player_slot ?? 0) < 128;
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
			start: Number(m.start_time ?? 0)
		};
	});
	return {
		accountId: parsed.accountId,
		recent
	};
});
var loadReport_createServerFn_handler = createServerRpc({
	id: "e94f3f77d09b1fb62c1a58ae60c0fa24dcd516df50efa45de7bd64a3602a98a3",
	name: "loadReport",
	filename: "src/lib/dota/api.functions.ts"
}, (opts) => loadReport.__executeServer(opts));
var loadReport = createServerFn({ method: "POST" }).validator(object({
	matchId: number().int().positive(),
	accountId: number().int().positive().optional()
})).handler(loadReport_createServerFn_handler, async ({ data }) => {
	const cats = await catalogs();
	const match = await od(`/matches/${data.matchId}`);
	const players = match.players ?? [];
	const heroId = (players.find((p) => data.accountId && p.account_id === data.accountId) ?? players[0])?.hero_id ?? 0;
	let benchmark = null;
	if (heroId) try {
		benchmark = await od(`/benchmarks?hero_id=${heroId}`);
	} catch {
		benchmark = null;
	}
	return buildReport({
		match,
		focusAccountId: data.accountId,
		heroNames: cats.heroNames,
		itemNames: cats.itemNames,
		itemIds: cats.itemIds,
		benchmark
	});
});
var resolveQuery_createServerFn_handler = createServerRpc({
	id: "d1ada1baf312290374cb40cb557b5c5e37617dd81420665d8b2a0ca6b0fe0e30",
	name: "resolveQuery",
	filename: "src/lib/dota/api.functions.ts"
}, (opts) => resolveQuery.__executeServer(opts));
var resolveQuery = createServerFn({ method: "POST" }).validator(object({ query: string().min(1).max(120) })).handler(resolveQuery_createServerFn_handler, async ({ data }) => parseLookup(data.query));
//#endregion
export { loadReport_createServerFn_handler, lookupPlayer_createServerFn_handler, resolveQuery_createServerFn_handler };
