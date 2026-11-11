import { i as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { i as string, n as number, r as object } from "../_libs/zod.mjs";
import { a as ResponsiveContainer, i as Area, n as YAxis, o as Tooltip, r as XAxis, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CW_-QUEZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	["summary", "خلاصه"],
	["lane", "لینینگ"],
	["items", "آیتم‌سازی"],
	["fights", "تیم‌فایت"],
	["turns", "نقاط عطف"],
	["end", "جمع‌بندی"]
];
function fmtTime(sec) {
	const m = Math.floor(sec / 60);
	const s = sec % 60;
	return `${m}:${String(s).padStart(2, "0")}`;
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line bg-surface px-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "num mt-1 text-xl font-semibold text-fg",
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-muted",
				children: hint
			}) : null
		]
	});
}
function List({ rows }) {
	if (!rows.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "موردی از داده استخراج نشد."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "flex flex-col gap-2",
		children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-xl border border-line bg-surface-2 px-3 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-medium text-fg",
				children: r.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm leading-relaxed text-muted",
				children: r.detail
			})]
		}, r.title + r.detail))
	});
}
function ReportView({ report }) {
	const [tab, setTab] = (0, import_react.useState)("summary");
	const tone = report.won ? "text-win" : "text-loss";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b border-line pb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: `text-sm font-semibold ${tone}`,
								children: [
									report.won ? "برد" : "باخت",
									" · ",
									report.side,
									" ·",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "num",
										children: [
											report.radiantScore,
											"–",
											report.direScore
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 text-2xl font-semibold",
								children: report.heroName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "num mt-1 text-sm text-muted",
								children: [
									"مچ ",
									report.matchId,
									" · ",
									fmtTime(report.duration),
									report.parsed ? " · ریپلی پارس شده" : " · بدون پارس تیم‌فایت"
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-line bg-surface px-4 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted",
								children: "نمره عددی"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "num text-3xl font-semibold text-ice",
								children: report.score.toFixed(1)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-7 text-fg",
						children: report.story
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							report.replayUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: report.replayUrl,
								className: "inline-flex min-h-11 items-center rounded-xl bg-ice px-4 text-sm font-semibold text-bg",
								children: "دانلود ریپلی"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex min-h-11 items-center rounded-xl border border-line px-4 text-sm text-muted",
								children: "دمو منقضی شده"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: report.opendotaUrl,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex min-h-11 items-center rounded-xl border border-line bg-surface px-4 text-sm text-fg",
								children: "OpenDota"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: report.dotabuffUrl,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex min-h-11 items-center rounded-xl border border-line bg-surface px-4 text-sm text-fg",
								children: "Dotabuff"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-1 overflow-x-auto pb-1",
				role: "tablist",
				children: TABS.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					role: "tab",
					"aria-selected": tab === id,
					onClick: () => setTab(id),
					className: "shrink-0 rounded-full px-3 py-2 text-sm " + (tab === id ? "bg-ice text-bg" : "bg-surface text-muted"),
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				role: "tabpanel",
				children: [
					tab === "summary" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "KDA",
								value: `${report.k}/${report.d}/${report.a}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "GPM",
								value: String(report.gpm),
								hint: report.gpmPct !== null ? `صدک ${report.gpmPct}` : void 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "XPM",
								value: String(report.xpm),
								hint: report.xpmPct !== null ? `صدک ${report.xpmPct}` : void 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "لست‌هیت",
								value: String(report.lastHits),
								hint: `${report.denies} انکار`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "آسیب هیرو",
								value: report.heroDamage.toLocaleString("fa-IR")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "آسیب برج",
								value: report.towerDamage.toLocaleString("fa-IR")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "نت‌ورث",
								value: report.netWorth ? report.netWorth.toLocaleString("fa-IR") : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "لست‌هیت ۱۰",
								value: report.lh10 === null ? "—" : String(report.lh10)
							})
						]
					}),
					tab === "lane" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-line bg-surface px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-ice",
								children: report.laneVerdict
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: report.laneNote
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { rows: report.laneEvidence })]
					}),
					tab === "items" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { rows: report.itemEvidence }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-sm font-semibold text-fg",
							children: "بر اساس ترکیب دشمن"
						}), report.suggestions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "کانتر واضحی نسبت به تگ‌های مکانیکی دشمن جا نمانده، یا داده آیتم ناقص است."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "flex flex-col gap-2",
							children: report.suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-xl border border-line bg-ice-dim px-3 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium text-ice",
									children: s.item
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm leading-relaxed text-fg",
									children: s.reason
								})]
							}, s.item))
						})] })]
					}),
					tab === "fights" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { rows: report.fightEvidence }), report.fights.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-line bg-surface px-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium",
									children: ["دقیقه ", f.minute]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "num text-sm text-muted",
									children: [
										"مرگ ",
										f.deaths,
										" · آسیب ",
										f.damage.toLocaleString("en-US")
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: f.note
							})]
						}, `${f.minute}-${f.damage}`))]
					}),
					tab === "turns" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-48 rounded-xl border border-line bg-surface p-2",
							children: report.goldSeries.length > 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
									data: report.goldSeries,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "minute",
											stroke: "#8d97a8",
											fontSize: 11
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											stroke: "#8d97a8",
											fontSize: 11,
											width: 42
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											contentStyle: {
												background: "#141a24",
												border: "1px solid #2a3344",
												borderRadius: 8
											},
											labelStyle: { color: "#e7e4dc" }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
											type: "monotone",
											dataKey: "gold",
											stroke: "#7ee0c6",
											fill: "#16352e",
											name: "گلد تیم"
										})
									]
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "p-4 text-sm text-muted",
								children: "گراف گلد برای این مچ نیامده."
							})
						}), report.turns.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-line bg-surface px-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["دقیقه ", t.minute] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `num ${t.swing < 0 ? "text-loss" : "text-win"}`,
									children: [t.swing > 0 ? "+" : "", t.swing.toLocaleString("en-US")]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: t.note
							})]
						}, t.minute))]
					}),
					tab === "end" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-2 text-sm font-semibold text-loss",
								children: "چرا این نتیجه"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { rows: report.reasons })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-2 text-sm font-semibold text-win",
								children: "نقطه قوت"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { rows: report.strengths })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-2 text-sm font-semibold text-ice",
								children: "اولویت بعدی"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { rows: report.next })] })
						]
					})
				]
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var lookupPlayer = createServerFn({ method: "POST" }).validator(object({ query: string().min(1).max(80) })).handler(createSsrRpc("b9ed699c6a9b4304914ac2b8e3c38fdb82847c8e6c67db782df5e86d541b05b9"));
var loadReport = createServerFn({ method: "POST" }).validator(object({
	matchId: number().int().positive(),
	accountId: number().int().positive().optional()
})).handler(createSsrRpc("e94f3f77d09b1fb62c1a58ae60c0fa24dcd516df50efa45de7bd64a3602a98a3"));
createServerFn({ method: "POST" }).validator(object({ query: string().min(1).max(120) })).handler(createSsrRpc("d1ada1baf312290374cb40cb557b5c5e37617dd81420665d8b2a0ca6b0fe0e30"));
function Home() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [accountId, setAccountId] = (0, import_react.useState)(null);
	const [recent, setRecent] = (0, import_react.useState)([]);
	const [report, setReport] = (0, import_react.useState)(null);
	async function onSearch(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		setReport(null);
		try {
			const q = query.trim();
			if (/^\d{8,12}$/.test(q) && Number(q) > 5e7) {
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
	async function openMatch(matchId) {
		setBusy(true);
		setError(null);
		try {
			const rep = await loadReport({ data: {
				matchId,
				accountId: accountId ?? void 0
			} });
			setReport(rep);
		} catch (err) {
			setError(err instanceof Error ? err.message : "مچ خوانده نشد");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-screen max-w-4xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-ice",
						children: "دوتا ۲ · فقط عدد و شاهد"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-3xl font-semibold",
						children: "آیینه"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm leading-relaxed text-muted",
						children: "استیم آیدی یا شماره مچ را بده. گزارش از OpenDota ساخته می‌شود: لین، آیتم، تیم‌فایت و سویینگ گلد — بدون حدس."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: onSearch,
				className: "flex flex-col gap-2 sm:flex-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "sr-only",
						htmlFor: "q",
						children: "شناسه"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "q",
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "SteamID64، Account ID یا Match ID",
						className: "num min-h-11 flex-1 rounded-xl border border-line bg-surface px-3 text-sm text-fg outline-none placeholder:font-[Vazirmatn] placeholder:text-muted",
						autoComplete: "off"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy || !query.trim(),
						className: "min-h-11 rounded-xl bg-ice px-5 text-sm font-semibold text-bg disabled:opacity-50",
						children: busy ? "در حال خواندن…" : "تحلیل"
					})
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-loss",
				children: error
			}) : null,
			recent.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 flex flex-col gap-2",
				children: recent.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => openMatch(m.matchId),
					className: "flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 py-3 text-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: m.won ? "text-win" : "text-loss",
						children: m.won ? "برد" : "باخت"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-2 text-fg",
						children: m.heroName
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "num text-sm text-muted",
						children: [
							m.k,
							"/",
							m.d,
							"/",
							m.a
						]
					})]
				}) }, m.matchId))
			}),
			report ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportView, { report }) : null
		]
	});
}
//#endregion
export { Home as component };
