import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ReportView } from "@/components/report-view";
import type { MatchReport } from "@/lib/dota/analyze";
import { loadReport, lookupPlayer, type RecentRow } from "@/lib/dota/api.functions";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [recent, setRecent] = useState<RecentRow[]>([]);
  const [report, setReport] = useState<MatchReport | null>(null);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setReport(null);
    try {
      const q = query.trim();
      if (/^\d{8,12}$/.test(q) && Number(q) > 50_000_000) {
        const rep = await loadReport({ data: { matchId: Number(q) } });
        setRecent([]);
        setAccountId(null);
        setReport(rep);
      } else {
        const res = await lookupPlayer({ data: { query: q } });
        setAccountId(res.accountId);
        setRecent(res.recent);
        if (typeof localStorage !== "undefined") localStorage.setItem("aineh-id", q);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در خواندن داده");
    } finally {
      setBusy(false);
    }
  }

  async function openMatch(matchId: number) {
    setBusy(true);
    setError(null);
    try {
      const rep = await loadReport({
        data: { matchId, accountId: accountId ?? undefined },
      });
      setReport(rep);
    } catch (err) {
      setError(err instanceof Error ? err.message : "مچ خوانده نشد");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-8">
      <header className="mb-8">
        <p className="text-xs tracking-wide text-ice">دوتا ۲ · فقط عدد و شاهد</p>
        <h1 className="mt-1 text-3xl font-semibold">آیینه</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          استیم آیدی یا شماره مچ را بده. گزارش از OpenDota ساخته می‌شود: لین، آیتم،
          تیم‌فایت و سویینگ گلد — بدون حدس.
        </p>
      </header>

      <form onSubmit={onSearch} className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="q">
          شناسه
        </label>
        <input
          id="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SteamID64، Account ID یا Match ID"
          className="num min-h-11 flex-1 rounded-xl border border-line bg-surface px-3 text-sm text-fg outline-none placeholder:font-[Vazirmatn] placeholder:text-muted"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={busy || !query.trim()}
          className="min-h-11 rounded-xl bg-ice px-5 text-sm font-semibold text-bg disabled:opacity-50"
        >
          {busy ? "در حال خواندن…" : "تحلیل"}
        </button>
      </form>
      {error ? <p className="mt-3 text-sm text-loss">{error}</p> : null}

      {recent.length > 0 && (
        <ul className="mt-6 flex flex-col gap-2">
          {recent.map((m) => (
            <li key={m.matchId}>
              <button
                type="button"
                onClick={() => openMatch(m.matchId)}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 py-3 text-start"
              >
                <span>
                  <span className={m.won ? "text-win" : "text-loss"}>{m.won ? "برد" : "باخت"}</span>
                  <span className="mx-2 text-fg">{m.heroName}</span>
                </span>
                <span className="num text-sm text-muted">
                  {m.k}/{m.d}/{m.a}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {report ? <ReportView report={report} /> : null}
    </main>
  );
}
