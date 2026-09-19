"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  domesticDestinations,
  type DestinationContent,
} from "@/data/destinations/domestic";
import { overseasDestinations } from "@/data/destinations/overseas";

const ALL_DESTINATIONS = [...domesticDestinations, ...overseasDestinations];

export type DestinationScope = "all" | "domestic" | "overseas";

export interface DestinationFilters {
  scope: DestinationScope;
  q: string;
  country: string;
  season: string;
  theme: string;
  days: string;
}

const DEFAULT_FILTERS: DestinationFilters = {
  scope: "all",
  q: "",
  country: "",
  season: "",
  theme: "",
  days: "",
};

function matchesFilters(
  d: DestinationContent,
  filters: DestinationFilters,
): boolean {
  if (filters.scope !== "all" && d.scope !== filters.scope) return false;
  if (filters.country && d.countryCode !== filters.country) return false;
  if (filters.season && !d.recommendedSeasons.includes(filters.season)) {
    return false;
  }
  if (filters.theme && !d.themes.includes(filters.theme)) return false;
  if (filters.days && !d.recommendedDays.includes(Number(filters.days))) {
    return false;
  }
  if (filters.q) {
    const keyword = filters.q.trim().toLowerCase();
    const haystack =
      `${d.name} ${d.region} ${d.themes.join(" ")}`.toLowerCase();
    if (keyword && !haystack.includes(keyword)) return false;
  }
  return true;
}

/**
 * URL query(scope/q/country/season/theme/days)로 필터 상태를 동기화한다.
 * SearchFilterBar와 PAGE-SCR001이 각각 이 훅을 호출해도 같은 URL을 공유하므로
 * 별도 Context 없이 항상 같은 결과를 본다.
 */
export function useDestinationFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: DestinationFilters = useMemo(
    () => ({
      scope: (searchParams.get("scope") as DestinationScope) || "all",
      q: searchParams.get("q") ?? "",
      country: searchParams.get("country") ?? "",
      season: searchParams.get("season") ?? "",
      theme: searchParams.get("theme") ?? "",
      days: searchParams.get("days") ?? "",
    }),
    [searchParams],
  );

  const setFilters = useCallback(
    (patch: Partial<DestinationFilters>) => {
      const next = { ...filters, ...patch };
      const params = new URLSearchParams();
      (Object.keys(next) as (keyof DestinationFilters)[]).forEach((key) => {
        const value = next[key];
        if (value && value !== DEFAULT_FILTERS[key]) params.set(key, value);
      });
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [filters, pathname, router],
  );

  const resetFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const domesticResults = useMemo(
    () => domesticDestinations.filter((d) => matchesFilters(d, filters)),
    [filters],
  );
  const overseasResults = useMemo(
    () => overseasDestinations.filter((d) => matchesFilters(d, filters)),
    [filters],
  );

  return {
    filters,
    setFilters,
    resetFilters,
    domesticResults,
    overseasResults,
  };
}

const SCOPE_TABS: { value: DestinationScope; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "domestic", label: "국내" },
  { value: "overseas", label: "해외" },
];

export function SearchFilterBar() {
  const [inputValue, setInputValue] = useState("");
  const {
    filters,
    setFilters,
    resetFilters,
    domesticResults,
    overseasResults,
  } = useDestinationFilters();

  const handleSearch = () => {
    setFilters({ q: inputValue });
  };


  const visibleCount =
    filters.scope === "domestic"
      ? domesticResults.length
      : filters.scope === "overseas"
        ? overseasResults.length
        : domesticResults.length + overseasResults.length;

  function chipClass(active: boolean) {
    return active
      ? "rounded-full bg-coral-soft px-4 py-1.5 text-caption font-medium text-coral-active"
      : "rounded-full bg-surface-strong px-4 py-1.5 text-caption font-medium text-ink";
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleSearch()}
          placeholder="여행지, 국가, 도시를 검색해보세요"
          className="h-14 w-full rounded-full border border-hairline bg-canvas px-6 pr-14 text-body-md text-ink"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="absolute right-4 flex h-6 w-6 items-center justify-center text-body-md text-muted hover:text-ink"
          aria-label="검색"
        >
          🔍
        </button>
      </div>

      {/* <div className="flex flex-wrap gap-2">
        {SCOPE_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilters({ scope: tab.value })}
            className={chipClass(filters.scope === tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div> */}

      {/* 국가 선택 */}
      {/* <div className="flex flex-wrap gap-2">
        <select
          value={filters.country}
          onChange={(event) => setFilters({ country: event.target.value })}
          className="rounded-full bg-surface-strong px-4 py-1.5 text-caption font-medium text-ink"
        >
          <option value="">국가 전체</option>
          {countries.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div> */}

      {/* 추천 시즌 */}
      {/* <div className="flex flex-wrap gap-2">
        {seasons.map((season) => (
          <button
            key={season}
            type="button"
            onClick={() =>
              setFilters({ season: filters.season === season ? "" : season })
            }
            className={chipClass(filters.season === season)}
          >
            {season}
          </button>
        ))}
      </div> */}

      {/* 테마 */}
      {/* <div className="flex flex-wrap gap-2">
        {themes.map((theme) => (
          <button
            key={theme}
            type="button"
            onClick={() =>
              setFilters({ theme: filters.theme === theme ? "" : theme })
            }
            className={chipClass(filters.theme === theme)}
          >
            {theme}
          </button>
        ))}
      </div> */}

      {/* 추천 일수 */}
      {/* <div className="flex flex-wrap gap-2">
        {dayOptions.map((days) => (
          <button
            key={days}
            type="button"
            onClick={() =>
              setFilters({
                days: filters.days === String(days) ? "" : String(days),
              })
            }
            className={chipClass(filters.days === String(days))}
          >
            {days}일
          </button>
        ))}
      </div> */}

      {visibleCount === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-md border border-hairline bg-surface-soft px-6 py-8 text-center">
          <p className="text-body-md text-body">
            조건에 맞는 여행지가 없어요. 필터를 완화하면 더 많은 여행지를 볼 수
            있어요.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-2 flex h-11 items-center justify-center rounded-sm bg-coral px-5 text-button text-on-coral"
          >
            필터 초기화
          </button>
        </div>
      )}
    </div>
  );
}
