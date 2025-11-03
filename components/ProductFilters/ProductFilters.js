"use client";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const filterLabels = {
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
}) {
  const [selected, setSelected] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    onFilter(filterProducts());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, products]);

  useEffect(() => {
    if (isOpen && drawerRef.current) {
      gsap.fromTo(
        drawerRef.current,
        { x: "-100%" },
        { x: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  const uniqueValues = (key) =>
    [...new Set(products.map((p) => p[key]).filter(Boolean))].sort();

  const toggleValue = (key, value) => {
    setSelected((prev) => {
      const values = prev[key] || [];
      const next = values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value];
      const updated = { ...prev, [key]: next };
      if (next.length === 0) delete updated[key];
      return updated;
    });
  };

  const clearAll = () => setSelected({});

  const removeChip = (key, value) =>
    setSelected((prev) => {
      const list = (prev[key] || []).filter((v) => v !== value);
      const updated = { ...prev, [key]: list };
      if (list.length === 0) delete updated[key];
      return updated;
    });

  const filterProducts = () =>
    products.filter((p) =>
      availableFilters.every((k) => {
        const need = selected[k] || [];
        return need.length === 0 || need.includes(p[k]);
      })
    );

  const activeCount = Object.values(selected).reduce(
    (s, arr) => s + arr.length,
    0
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden xlg:block w-64 shrink-0">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20 backdrop-blur">
          <h2 className="mb-4 text-lg font-semibold text-primary">
            Фільтрувати за:
          </h2>

          {availableFilters.map((key) => (
            <div key={key} className="mb-5">
              <h3 className="mb-2 font-medium text-white/90">
                {filterLabels[key] || key}
              </h3>

              {/* ← добавлен внутренний отступ, чтобы ринг чекбокса не резался */}
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
                        className={`
                          peer appearance-none
                          h-5 w-5 rounded-md
                          border border-white/20
                          bg-black/30
                          transition-all duration-200
                          checked:bg-primary checked:border-primary
                          focus:outline-none focus:ring-2 focus:ring-primary/40
                        `}
                      />
                      {/* animated tick */}
                      <span
                        className={`
                          pointer-events-none -ml-5 h-5 w-5 rounded-md
                          grid place-items-center
                        `}
                      >
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

      {/* MOBILE BUTTON */}
      <div className="xlg:hidden mb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-xl bg-white/10 px-4 py-2 text-white backdrop-blur transition hover:bg-white/15"
          >
            Фільтри{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Очистити
            </button>
          )}
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div
            ref={drawerRef}
            className="absolute top-0 left-0 bottom-0 w-[82%] max-w-[420px]
                       rounded-r-2xl bg-[#1b1b1c] p-4 shadow-2xl shadow-black/40"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">
                Фільтрувати за
              </h2>
              <button
                onClick={() =>
                  gsap.to(drawerRef.current, {
                    x: "-100%",
                    duration: 0.3,
                    ease: "power2.inOut",
                    onComplete: () => setIsOpen(false),
                  })
                }
                className="rounded-lg bg-white/10 px-3 py-1 text-white hover:bg-white/15"
              >
                Закрити
              </button>
            </div>

            {/* chips */}
            {activeCount > 0 && (
              <div className="mb-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-white/80">
                    Застосовані фільтри:
                  </span>
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Очистити всі
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selected).flatMap(([k, vals]) =>
                    vals.map((v) => (
                      <span
                        key={`${k}-${v}`}
                        className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-sm text-primary"
                      >
                        {(filterLabels[k] || k) + ": " + v}
                        <button
                          onClick={() => removeChip(k, v)}
                          className="text-primary/80 hover:text-primary"
                        >
                          &times;
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
                  {filterLabels[key] || key}
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
                          className={`
                            peer appearance-none
                            h-[22px] w-[22px] rounded-md
                            border border-white/20 bg-black/30
                            transition-all duration-200
                            checked:bg-primary
                          `}
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
      )}
    </>
  );
}
