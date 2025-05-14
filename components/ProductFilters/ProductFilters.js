"use client";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const filterLabels = {
  color: "Колір",
  size: "Розмір",
  power: "Потужність",
  heatExchangerMaterial: "Матеріал теплообміннику",
  color: "Колір",
  shortSize: "Розмір (Ш×Г)",
  ovenType: "Тип духовки",
  ovenCategory: "Тип плити",
  surfaceConfiguration: 'Конфігурація варильної поверхні',
};

const ProductFilters = ({ products, onFilter, availableFilters = [] }) => {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    onFilter(filteredProducts());
  }, [selectedFilters]);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        sidebarRef.current,
        { x: "-100%" },
        { x: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  const uniqueValues = (key) =>
    [...new Set(products.map((p) => p[key]).filter(Boolean))];

  const handleChange = (key, value) => {
    setSelectedFilters((prev) => {
      const values = prev[key] || [];
      const updated = values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value];

      const newFilters = { ...prev, [key]: updated };
      if (updated.length === 0) {
        delete newFilters[key];
      }

      return newFilters;
    });
  };

  const filteredProducts = () => {
    return products.filter((p) =>
      availableFilters.every((key) => {
        const selected = selectedFilters[key] || [];
        return selected.length === 0 || selected.includes(p[key]);
      })
    );
  };

  const clearAll = () => setSelectedFilters({});

  const removeFilter = (key, value) => {
    setSelectedFilters((prev) => {
      const newValues = prev[key].filter((v) => v !== value);
      const updatedFilters = { ...prev, [key]: newValues };
      if (newValues.length === 0) {
        delete updatedFilters[key];
      }
      return updatedFilters;
    });
  };

  const activeCount = Object.values(selectedFilters).reduce(
    (sum, values) => sum + values.length,
    0
  );

  return (
    <>
      <div className="hidden xl:flex gap-8">
        <aside className="w-64 shrink-0 border p-4 rounded bg-white shadow">
          <h2 className="text-lg font-semibold mb-4">Фільтрувати за:</h2>
          {availableFilters.map((key) => (
            <div key={key} className="mb-4">
              <h3 className="font-medium mb-2">
                {filterLabels[key] || key}
              </h3>
              {uniqueValues(key).map((val) => (
                <label key={val} className="block">
                  <input
                    type="checkbox"
                    checked={selectedFilters[key]?.includes(val) || false}
                    onChange={() => handleChange(key, val)}
                    className="mr-2"
                  />
                  {val}
                </label>
              ))}
            </div>
          ))}
        </aside>
      </div>

      <div className="xl:hidden mb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Фільтри{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          ref={sidebarRef}
          className="fixed top-0 left-0 bottom-0 w-3/4 max-w-xl bg-white shadow-lg z-50 overflow-y-auto p-4"
        >
          {Object.keys(selectedFilters).length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <strong>Застосовані фільтри:</strong>
                <button onClick={clearAll} className="text-red-600 text-sm">
                  Очистити всі
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedFilters).flatMap(([key, values]) =>
                  values.map((val) => (
                    <span
                      key={`${key}-${val}`}
                      className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full flex items-center gap-1"
                    >
                      <span>
                        {filterLabels[key] || key}: {val}
                      </span>
                      <button
                        onClick={() => removeFilter(key, val)}
                        className="text-red-600 hover:text-red-800"
                      >
                        &times;
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          )}

          <h2 className="text-lg font-semibold mb-4">Фільтрувати за:</h2>
          {availableFilters.map((key) => (
            <div key={key} className="mb-4">
              <h3 className="font-medium mb-2">
                {filterLabels[key] || key}
              </h3>
              {uniqueValues(key).map((val) => (
                <label key={val} className="block">
                  <input
                    type="checkbox"
                    checked={selectedFilters[key]?.includes(val) || false}
                    onChange={() => handleChange(key, val)}
                    className="mr-2"
                  />
                  {val}
                </label>
              ))}
            </div>
          ))}

          <button
            onClick={() =>
              gsap.to(sidebarRef.current, {
                x: "-100%",
                duration: 0.4,
                ease: "power2.inOut",
                onComplete: () => setIsOpen(false),
              })
            }
            className="mt-6 bg-red-500 text-white w-full py-2 rounded"
          >
            Закрити
          </button>
        </div>
      )}
    </>
  );
};

export default ProductFilters;
