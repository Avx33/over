"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Filter, Search, X } from "lucide-react";
import { MOROCCAN_CITIES } from "@/lib/constants";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface UniversityFiltersProps {
  categories: Category[];
}

export function UniversityFilters({ categories }: UniversityFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";
  const currentCity = searchParams.get("city") ?? "all";
  const currentType = searchParams.get("type") ?? "all";
  const currentCategory = searchParams.get("category") ?? "all";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || !value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      startTransition(() => {
        router.push(`/universities?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const clearAll = () => {
    startTransition(() => {
      router.push("/universities");
    });
  };

  const hasFilters = currentSearch || currentCity !== "all" || currentType !== "all" || currentCategory !== "all";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sticky top-20 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-gray-900 dark:text-white text-sm">Filtres</span>
          {isPending && (
            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            Effacer
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Rechercher..."
          defaultValue={currentSearch}
          onChange={(e) => {
            const val = e.target.value;
            const timer = setTimeout(() => updateFilter("search", val), 400);
            return () => clearTimeout(timer);
          }}
          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
          Type
        </label>
        <div className="flex gap-2">
          {[
            { value: "all", label: "Tous" },
            { value: "public", label: "Public" },
            { value: "private", label: "Privé" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateFilter("type", value)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                currentType === value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
          Ville
        </label>
        <select
          value={currentCity}
          onChange={(e) => updateFilter("city", e.target.value)}
          className="w-full py-2.5 px-3 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="all">Toutes les villes</option>
          {MOROCCAN_CITIES.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      {categories.length > 0 && (
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
            Domaine
          </label>
          <div className="space-y-1.5 max-h-52 overflow-y-auto scrollbar-hide">
            <button
              onClick={() => updateFilter("category", "all")}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                currentCategory === "all"
                  ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Tous les domaines
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateFilter("category", cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                  currentCategory === cat.slug
                    ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active filters */}
      {hasFilters && (
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap gap-1.5">
            {currentSearch && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg text-xs">
                &ldquo;{currentSearch}&rdquo;
                <button onClick={() => updateFilter("search", "")} className="hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentCity !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg text-xs">
                {currentCity}
                <button onClick={() => updateFilter("city", "all")} className="hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentType !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg text-xs">
                {currentType === "public" ? "Public" : "Privé"}
                <button onClick={() => updateFilter("type", "all")} className="hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
