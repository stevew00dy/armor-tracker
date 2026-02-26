import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  Settings,
  Download,
  Upload,
  RotateCcw,
  X,
  Star,
  ChevronDown,
  Check,
  MapPin,
  Shield,
  Home,
  Menu,
} from "lucide-react";
import { armors } from "./data";
import type { ArmorSet, ArmorType } from "./types";
import { useArmorChecks, useFavourites, exportAllData, importAllData } from "./hooks";

const TYPE_COLORS: Record<ArmorType, string> = {
  Heavy: "bg-accent-red/20 text-accent-red",
  Medium: "bg-accent-amber/20 text-accent-amber",
  Light: "bg-accent-blue/20 text-accent-blue",
};

/* ─── Header ─── */

function Header({
  owned,
  total,
  onReset,
}: {
  owned: number;
  total: number;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pct = total > 0 ? Math.round((owned / total) * 100) : 0;

  useEffect(() => {
    if (!open && !navOpen) return;
    function handleClick(e: MouseEvent) {
      if (open && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirming(false);
      }
      if (navOpen && navRef.current && !navRef.current.contains(e.target as Node)) {
        setNavOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, navOpen]);

  return (
    <header className="border-b border-dark-700 bg-dark-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent-amber/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-accent-amber" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Personal Armour Tracker</h1>
            <p className="text-xs text-text-muted">Star Citizen 4.6</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-green" />
              <span className="text-text-dim">
                <span className="font-mono font-semibold text-accent-green">{owned}</span>
                <span className="text-text-muted">/{total}</span> pieces
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="font-mono font-semibold text-text-dim">{pct}%</span>
              <div className="w-20 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-green rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="relative" ref={panelRef}>
            <button
              onClick={() => {
                setOpen(!open);
                setConfirming(false);
                setNavOpen(false);
              }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                open ? "text-text bg-dark-700" : "text-text-muted hover:text-text hover:bg-dark-800"
              }`}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-2 w-64 p-3 shadow-xl z-50 rounded-xl border border-dark-700 bg-dark-900">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-text-dim uppercase tracking-wide">Settings</h3>
                  <button
                    onClick={() => {
                      setOpen(false);
                      setConfirming(false);
                    }}
                    className="p-0.5 rounded text-text-muted hover:text-text transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      exportAllData();
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200"
                  >
                    <Download className="w-3.5 h-3.5 text-accent-blue" />
                    Export Progress
                    <span className="ml-auto text-[10px] text-text-muted">.json</span>
                  </button>

                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200"
                  >
                    <Upload className="w-3.5 h-3.5 text-accent-amber" />
                    Import Progress
                    <span className="ml-auto text-[10px] text-text-muted">.json</span>
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) importAllData(file);
                      e.target.value = "";
                    }}
                  />

                  <div className="border-t border-dark-700 my-2" />

                  {confirming ? (
                    <div className="px-3 py-2">
                      <p className="text-xs text-accent-red mb-2">Reset all progress? This cannot be undone.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            onReset();
                            setConfirming(false);
                            setOpen(false);
                          }}
                          className="flex-1 py-1.5 text-xs rounded-md bg-accent-red/20 text-accent-red hover:bg-accent-red/30 transition-colors font-medium"
                        >
                          Yes, reset
                        </button>
                        <button
                          onClick={() => setConfirming(false)}
                          className="flex-1 py-1.5 text-xs rounded-md bg-dark-700 text-text-muted hover:text-text transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirming(true)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-all duration-200"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset All Progress
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={navRef}>
            <button
              onClick={() => { setNavOpen(!navOpen); setOpen(false); setConfirming(false); }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                navOpen ? "text-text bg-dark-700" : "text-text-muted hover:text-text hover:bg-dark-800"
              }`}
              title="Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            {navOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 p-2 shadow-xl z-50 rounded-xl border border-dark-700 bg-dark-900">
                <a href="/" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200">
                  <Home className="w-3.5 h-3.5 text-accent-amber" />
                  undisputed noobs
                </a>
                <div className="border-t border-dark-700 my-1.5" />
                <a href="/armor-tracker/" className="block px-3 py-2 rounded-lg text-xs text-accent-amber font-medium">Armour Tracker</a>
                <a href="/exec-hangar-tracker/" className="block px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200">Exec Hangar Tracker</a>
                <a href="/wikelo-tracker/" className="block px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200">Wikelo Tracker</a>
                <a href="/loadout-planner/" className="block px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200">Loadout Planner</a>
                <div className="border-t border-dark-700 my-1.5" />
                <a href="https://robertsspaceindustries.com/enlist?referral=STAR-23GB-5J3N" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-accent-blue hover:bg-dark-700 transition-all duration-200">
                  Play Star Citizen
                  <span className="text-[10px] text-text-muted">↗</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─── Armor Card ─── */

function ArmorCard({
  armor,
  checks,
  isFav,
  onToggleFav,
  onImageClick,
}: {
  armor: ArmorSet;
  checks: ReturnType<typeof useArmorChecks>;
  isFav: boolean;
  onToggleFav: () => void;
  onImageClick?: (src: string, alt: string) => void;
}) {
  const [locationOpen, setLocationOpen] = useState(false);
  const [variantsOpen, setVariantsOpen] = useState(true);
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(new Set());
  const base = import.meta.env.BASE_URL;

  const toggleVariantExpand = useCallback((variant: string) => {
    setExpandedVariants((prev) => {
      const next = new Set(prev);
      if (next.has(variant)) next.delete(variant);
      else next.add(variant);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedVariants((prev) => {
      if (prev.size === armor.variants.length) return new Set();
      return new Set(armor.variants);
    });
  }, [armor.variants]);

  const totalOwned = armor.variants.reduce((sum, v) => {
    const { owned } = checks.variantProgress(armor.id, v, armor.setPieces.length);
    return sum + owned;
  }, 0);
  const totalPieces = armor.variants.length * armor.setPieces.length;
  const allDone = totalOwned === totalPieces;

  return (
    <div className={`card p-0 overflow-hidden transition-all duration-300 ${allDone ? "border-accent-green/30" : ""}`}>
      {/* Image */}
      {armor.image && (
        <div className="aspect-[4/3] bg-dark-800 relative overflow-hidden">
          <img
            src={`${base}${armor.image}`}
            alt={armor.name}
            className="w-full h-full object-cover object-top cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => onImageClick?.(`${base}${armor.image}`, armor.name)}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute top-2 left-2 flex gap-1.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${TYPE_COLORS[armor.type]}`}>
              {armor.type}
            </span>
            {armor.rare && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-accent-amber/20 text-accent-amber">
                Rare
              </span>
            )}
          </div>
          <button
            onClick={onToggleFav}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-dark-900/60 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-dark-900/80"
          >
            <Star className={`w-4 h-4 ${isFav ? "fill-accent-amber text-accent-amber" : "text-text-muted"}`} />
          </button>
        </div>
      )}

      {/* No-image header */}
      {!armor.image && (
        <div className="px-4 pt-4 flex items-start justify-between">
          <div className="flex gap-1.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${TYPE_COLORS[armor.type]}`}>
              {armor.type}
            </span>
            {armor.rare && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-accent-amber/20 text-accent-amber">
                Rare
              </span>
            )}
          </div>
          <button
            onClick={onToggleFav}
            className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center transition-all hover:bg-dark-700"
          >
            <Star className={`w-4 h-4 ${isFav ? "fill-accent-amber text-accent-amber" : "text-text-muted"}`} />
          </button>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Title row */}
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold">{armor.name}</h3>
            <p className="text-xs text-text-muted">{armor.manufacturer}</p>
          </div>
          <div className="text-right shrink-0">
            <span className={`font-mono text-sm font-bold ${allDone ? "text-accent-green" : "text-text"}`}>
              {totalOwned}
            </span>
            <span className="text-text-muted text-xs">/{totalPieces}</span>
          </div>
        </div>


        {/* Location toggle */}
        <button
          onClick={() => setLocationOpen(!locationOpen)}
          className="w-full flex items-center justify-between py-2 border-t border-dark-700 text-xs font-semibold text-text-dim uppercase tracking-wide"
        >
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3" /> Location
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${locationOpen ? "rotate-180" : ""}`} />
        </button>
        {locationOpen && (
          <div className="text-sm space-y-1 pb-2">
            <p className="text-text-secondary">{armor.where}</p>
            <p className="text-xs text-text-muted">{armor.how}</p>
          </div>
        )}

        {/* Variants toggle */}
        <button
          onClick={() => setVariantsOpen(!variantsOpen)}
          className="w-full flex items-center justify-between py-2 border-t border-dark-700 text-xs font-semibold text-text-dim uppercase tracking-wide"
        >
          <span>Variants</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${variantsOpen ? "rotate-180" : ""}`} />
        </button>

        {variantsOpen && (
          <div className="space-y-1">
            {armor.variantNote && (
              <p className="text-[10px] text-text-muted mb-2">{armor.variantNote}</p>
            )}

            <div className="flex justify-end mb-1">
              <button
                onClick={expandAll}
                className="text-[10px] text-text-muted hover:text-text-dim transition-colors"
              >
                {expandedVariants.size === armor.variants.length ? "Collapse all" : "Expand all"}
              </button>
            </div>

            {armor.variants.map((variant) => {
              const { owned, total } = checks.variantProgress(armor.id, variant, armor.setPieces.length);
              const expanded = expandedVariants.has(variant);
              const done = owned === total;

              return (
                <div key={variant}>
                  <button
                    onClick={() => toggleVariantExpand(variant)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      done
                        ? "bg-accent-green/10 border border-accent-green/20 text-accent-green"
                        : "bg-dark-800 border border-dark-700 text-text-secondary hover:border-dark-600"
                    }`}
                  >
                    <span className="font-medium">{variant}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs ${done ? "text-accent-green" : "text-text-muted"}`}>
                        {owned}/{total}
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {expanded && (
                    <div className="mt-1 ml-2 space-y-0.5">
                      {armor.setPieces.map((piece) => {
                        const checked = checks.isChecked(armor.id, variant, piece.slot);
                        return (
                          <button
                            key={piece.slot}
                            onClick={() => checks.toggle(armor.id, variant, piece.slot)}
                            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs transition-all duration-200 ${
                              checked
                                ? "text-accent-green"
                                : "text-text-dim hover:text-text-secondary hover:bg-dark-800"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                                checked
                                  ? "bg-accent-green border-accent-green"
                                  : "border-dark-600 bg-dark-900"
                              }`}
                            >
                              {checked && <Check className="w-2.5 h-2.5 text-dark-950" />}
                            </div>
                            <span className={checked ? "line-through opacity-60" : ""}>{piece.slot}</span>
                            <span className={`ml-auto text-[10px] ${checked ? "text-accent-green/50" : "text-text-muted"}`}>
                              {piece.item}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Footer ─── */

function Footer() {
  return (
    <footer className="border-t border-dark-700 mt-12 py-6">
      <div className="max-w-[1600px] mx-auto px-4 flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
          <a href="/" className="text-xs text-text-muted hover:text-accent-amber transition-colors">Home</a>
          <a href="/armor-tracker/" className="text-xs text-text-muted hover:text-accent-amber transition-colors">Armour Tracker</a>
          <a href="/exec-hangar-tracker/" className="text-xs text-text-muted hover:text-accent-amber transition-colors">Exec Hangar Tracker</a>
          <a href="/wikelo-tracker/" className="text-xs text-text-muted hover:text-accent-amber transition-colors">Wikelo Tracker</a>
          <a href="/loadout-planner/" className="text-xs text-text-muted hover:text-accent-amber transition-colors">Loadout Planner</a>
          <a href="https://www.youtube.com/@undisputednoobs" target="_blank" rel="noopener noreferrer" className="text-xs text-text-muted hover:text-accent-amber transition-colors">YouTube</a>
        </div>
        <p className="text-[10px] text-text-muted/50">Unofficial fan-made tool. Not affiliated with Cloud Imperium Games.</p>
      </div>
    </footer>
  );
}

/* ─── App ─── */

type FilterType = "All" | ArmorType;

export default function App() {
  const checks = useArmorChecks();
  const favourites = useFavourites();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("All");
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const handleReset = useCallback(() => {
    checks.resetAll();
    favourites.clearAll();
  }, [checks, favourites]);

  const filtered = armors.filter((a) => {
    if (filter !== "All" && a.type !== filter) return false;
    if (showFavsOnly && !favourites.isFav(a.id)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.manufacturer.toLowerCase().includes(q) ||
        a.variants.some((v) => v.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const filters: FilterType[] = ["All", "Heavy", "Medium", "Light"];

  return (
    <div className="min-h-screen">
      <Header owned={checks.totalProgress.owned} total={checks.totalProgress.total} onReset={handleReset} />

      <main className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search armor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent-amber/40 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  filter === f
                    ? "bg-accent-amber/20 text-accent-amber border border-accent-amber/30"
                    : "bg-dark-800 text-text-muted border border-dark-700 hover:text-text-dim hover:border-dark-600"
                }`}
              >
                {f}
              </button>
            ))}

            <button
              onClick={() => setShowFavsOnly(!showFavsOnly)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                showFavsOnly
                  ? "bg-accent-amber/20 text-accent-amber border border-accent-amber/30"
                  : "bg-dark-800 text-text-muted border border-dark-700 hover:text-text-dim hover:border-dark-600"
              }`}
              title="Favourites only"
            >
              <Star className={`w-4 h-4 ${showFavsOnly ? "fill-accent-amber" : ""}`} />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((armor) => (
            <ArmorCard
              key={armor.id}
              armor={armor}
              checks={checks}
              isFav={favourites.isFav(armor.id)}
              onToggleFav={() => favourites.toggle(armor.id)}
              onImageClick={(src, alt) => setLightbox({ src, alt })}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-muted text-sm">No armor sets match your filters.</p>
          </div>
        )}
      </main>

      <Footer />

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark-900/80 border border-dark-700 flex items-center justify-center text-text-dim hover:text-text hover:border-dark-600 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
