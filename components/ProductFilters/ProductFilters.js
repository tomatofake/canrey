// components/ProductFilters/ProductFilters.jsx
"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const LABELS = {
  color: "Колір",
  size: "Розмір",
  power: "Потужність",
  heatExchangerMaterial: "Матеріал теплообміннику",
  shortSize: "Розмір (Ш×Г)",
  ovenType: "Тип духовки",
  ovenCategory: "Тип плити",
  surfaceConfiguration: "Конфігурація варильної поверхні",
};

export default function ProductFilters({
  products,
  onFilter,
  availableFilters = [],
  onFilteringChange,
}) {
  const [selected, setSelected] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [headerOffset, setHeaderOffset] = useState(0);
  const drawerRef = useRef(null);

  useEffect(() => {
    const header =
      document.querySelector("[data-site-header]") ||
      document.querySelector("header");

    const read = () => {
      if (!header) return setHeaderOffset(0);
      const pos = getComputedStyle(header).position;
      if (pos === "fixed") setHeaderOffset(header.offsetHeight || 0);
      else setHeaderOffset(0);
    };

    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && drawerRef.current) {
      gsap.fromTo(
        drawerRef.current,
        { x: "-100%" },
        { x: 0, duration: 0.34, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    const t = setTimeout(() => {
      onFilteringChange?.(true);
      onFilter(filterProducts(products, selected, availableFilters));
      onFilteringChange?.(false);
    }, 80);
    return () => clearTimeout(t);
  }, [selected, products]);

  const uniqueValues = (key) =>
    [...new Set(products.map((p) => p[key]).filter(Boolean))].sort();

  const toggleValue = (key, value) => {
    setSelected((prev) => {
      const arr = prev[key] || [];
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      const updated = { ...prev, [key]: next };
      if (!next.length) delete updated[key];
      return updated;
    });
  };

  const clearAll = () => setSelected({});
  const removeChip = (key, value) =>
    setSelected((prev) => {
      const list = (prev[key] || []).filter((v) => v !== value);
      const updated = { ...prev, [key]: list };
      if (!list.length) delete updated[key];
      return updated;
    });

  const activeCount = Object.values(selected).reduce(
    (s, v) => s + v.length,
    0
  );

  return (
    <>
      <aside className="hidden xlg:block w-64 shrink-0">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-primary">
            Фільтрувати за:
          </h2>

          {availableFilters.map((key) => (
            <div key={key} className="mb-5">
              <h3 className="mb-2 font-medium text-white/90">
                {LABELS[key] || key}
              </h3>

              <div className="grid grid-cols-1 gap-1 max-h-48 overflow-auto px-1">
                {uniqueValues(key).map((val) => {
                  const checked = selected[key]?.includes(val) || false;
                  return (
                    <label
                      key={val}
                      className="flex items-center gap-3 cursor-pointer select-none pl-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleValue(key, val)}
                        className="
                          peer appearance-none cursor-pointer
                          h-5 w-5 rounded-md
                          border border-white/20 bg-black/30
                          transition-all duration-200
                          checked:bg-primary checked:border-primary
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
                        "
                      />
                      <span className="-ml-5 grid h-5 w-5 place-items-center rounded-md pointer-events-none">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5 opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="text-white/90">{val}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="mt-2 w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white/90 transition hover:bg-white/15"
            >
              Очистити всі ({activeCount})
            </button>
          )}
        </div>
      </aside>

      <div className="xlg:hidden mb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-xl bg-white/10 px-4 py-2 text-white backdrop-blur transition hover:bg-white/15"
          >
            Фільтри{activeCount ? ` (${activeCount})` : ""}
          </button>
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-red-400 hover:text-red-300 underline underline-offset-2"
            >
              Очистити всі
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 overscroll-none">
          <button
            aria-label="Закрити фільтри"
            onClick={() => {
              if (!drawerRef.current) return setIsOpen(false);
              gsap.to(drawerRef.current, {
                x: "-100%",
                duration: 0.26,
                ease: "power2.in",
                onComplete: () => setIsOpen(false),
              });
            }}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          />

          <div
            ref={drawerRef}
            className="
              absolute top-0 left-0 bottom-0 w-[86%] max-w-[420px]
              rounded-r-2xl bg-[#1b1b1c] shadow-2xl shadow-black/40
              will-change-transform overflow-y-auto -webkit-overflow-scrolling-touch
            "
            style={{
              paddingTop: `calc(${headerOffset}px + env(safe-area-inset-top) + 12px)`,
              paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          >

            <div className="mx-auto w-full max-w-[360px]">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-primary">
                  Фільтрувати за
                </h2>

                <button
                  onClick={() => {
                    if (!drawerRef.current) return setIsOpen(false);
                    gsap.to(drawerRef.current, {
                      x: "-100%",
                      duration: 0.26,
                      ease: "power2.in",
                      onComplete: () => setIsOpen(false),
                    });
                  }}
                  className="
                    inline-flex items-center gap-2 rounded-full
                    bg-white/10 px-3 py-1.5 text-sm text-white
                    ring-1 ring-white/15 hover:bg-white/15 active:scale-[0.98]
                    transition
                  "
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    className="opacity-90"
                  >
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Закрити
                </button>
              </div>

              {activeCount > 0 && (
                <div className="mb-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-white/80">
                      Застосовані фільтри:
                    </span>
                    <button
                      onClick={clearAll}
                      className="text-sm text-red-400 hover:text-red-300 underline underline-offset-2"
                    >
                      Очистити всі
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selected).flatMap(([k, vals]) =>
                      vals.map((v) => (
                        <span
                          key={`${k}-${v}`}
                          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white ring-1 ring-white/15"
                        >
                          {(LABELS[k] || k) + ": " + v}
                          <button
                            onClick={() => removeChip(k, v)}
                            className="opacity-80 hover:opacity-100"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}

              {availableFilters.map((key) => (
                <div key={key} className="mb-5">
                  <h3 className="mb-2 font-medium text-white/90">
                    {LABELS[key] || key}
                  </h3>

                  <div className="grid grid-cols-1 gap-2 px-1">
                    {uniqueValues(key).map((val) => {
                      const checked = selected[key]?.includes(val) || false;
                      return (
                        <label
                          key={val}
                          className="flex items-center gap-3 cursor-pointer select-none pl-0.5"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleValue(key, val)}
                            className="
                              peer appearance-none cursor-pointer
                              h-[22px] w-[22px] rounded-md
                              border border-white/20 bg-black/30
                              transition-all duration-200
                              checked:bg-primary
                              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
                            "
                          />
                          <span className="-ml-5 grid h-[22px] w-[22px] place-items-center rounded-md pointer-events-none">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-3.5 w-3.5 opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
                            >
                              <path
                                d="M5 13l4 4L19 7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span className="text-white/90">{val}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function filterProducts(products, selected, keys) {
  return products.filter((p) =>
    keys.every((k) => {
      const need = selected[k] || [];
      return !need.length || need.includes(p[k]);
    })
  );
}