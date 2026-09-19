"use client";

import { useState, useEffect } from "react";
import { listMatePosts } from "@/lib/db/mates-read";
import { domesticDestinations } from "@/data/destinations/domestic";
import { overseasDestinations } from "@/data/destinations/overseas";
import { countrySafetyList } from "@/data/safety/countries";
import type { MatePostWithComputedStatus, MatePostFilters } from "@/lib/db/mates-read";

const ALL_DESTINATIONS = [
  ...domesticDestinations,
  ...overseasDestinations,
];

const COUNTRY_OPTIONS = (() => {
  const map = new Map<string, string>();
  map.set("KR", "대한민국");
  for (const country of countrySafetyList) {
    map.set(country.countryCode, country.countryName);
  }
  return Array.from(map.entries()).map(([code, name]) => ({ code, name }));
})();

const TRAVEL_STYLES = [
  "액티브",
  "여유로운",
  "문화탐방",
  "음식투어",
  "자연",
  "야행",
];

function regionsForCountry(code: string): string[] {
  return [
    ...new Set(
      ALL_DESTINATIONS.filter((d) => d.countryCode === code).map(
        (d) => d.region,
      ),
    ),
  ];
}

export interface MateFilterListProps {
  onSelectPost: (post: MatePostWithComputedStatus) => void;
  selectedPost?: MatePostWithComputedStatus | null;
}

interface Filters {
  country: string;
  region: string;
  startDate: string;
  endDate: string;
  travelStyles: string[];
  status: "RECRUITING" | "CLOSED" | "";
}

export function MateFilterList({
  onSelectPost,
  selectedPost,
}: MateFilterListProps) {
  const [filters, setFilters] = useState<Filters>({
    country: "",
    region: "",
    startDate: "",
    endDate: "",
    travelStyles: [],
    status: "",
  });

  const [posts, setPosts] = useState<MatePostWithComputedStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const regionOptions = filters.country
    ? regionsForCountry(filters.country)
    : [];

  const applyFilters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const matePostFilters: MatePostFilters = {
        limit: 8,
      };

      if (filters.country) {
        matePostFilters.countryCode = filters.country;
      }
      if (filters.region) {
        matePostFilters.region = filters.region;
      }
      if (filters.startDate) {
        matePostFilters.endDateTo = filters.startDate;
      }
      if (filters.endDate) {
        matePostFilters.startDateFrom = filters.endDate;
      }
      if (filters.travelStyles.length > 0) {
        matePostFilters.travelStyle = filters.travelStyles;
      }
      if (filters.status) {
        matePostFilters.status = filters.status;
      }

      const result = await listMatePosts(matePostFilters);
      setPosts(result);
    } catch {
      setError("목록을 불러오지 못했습니다.");
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await applyFilters();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      country: "",
      region: "",
      startDate: "",
      endDate: "",
      travelStyles: [],
      status: "",
    });
  };

  const handleStyleToggle = (style: string) => {
    setFilters((prev) => ({
      ...prev,
      travelStyles: prev.travelStyles.includes(style)
        ? prev.travelStyles.filter((s) => s !== style)
        : [...prev.travelStyles, style],
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 필터 영역 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-title-md font-semibold">필터</h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-body-md text-ink">
            국가
            <select
              value={filters.country}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  country: e.target.value,
                  region: "",
                }))
              }
              className="h-11 rounded-sm border border-hairline px-3 text-body-md"
            >
              <option value="">전체</option>
              {COUNTRY_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-body-md text-ink">
            지역
            <select
              value={filters.region}
              disabled={!filters.country}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  region: e.target.value,
                }))
              }
              className="h-11 rounded-sm border border-hairline px-3 text-body-md disabled:bg-surface-soft"
            >
              <option value="">전체</option>
              {regionOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-body-md text-ink">
            여행 시작일
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
              className="h-11 rounded-sm border border-hairline px-3 text-body-md"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-body-md text-ink">
            여행 종료일
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }))
              }
              className="h-11 rounded-sm border border-hairline px-3 text-body-md"
            />
          </label>
        </div>

        {/* 여행 스타일 칩 */}
        <div className="flex flex-col gap-2">
          <label className="text-body-md font-medium text-ink">
            여행 스타일
          </label>
          <div className="flex flex-wrap gap-2">
            {TRAVEL_STYLES.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => handleStyleToggle(style)}
                className={`rounded-full px-4 py-2 text-caption font-medium transition ${
                  filters.travelStyles.includes(style)
                    ? "bg-coral-soft text-coral-active"
                    : "bg-surface-strong text-ink"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* 모집 상태 */}
        <div className="flex flex-col gap-2">
          <label className="text-body-md font-medium text-ink">
            모집 상태
          </label>
          <div className="flex gap-2">
            {["", "RECRUITING", "CLOSED"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    status: (status || "") as "" | "RECRUITING" | "CLOSED",
                  }))
                }
                className={`rounded-full px-4 py-2 text-caption font-medium transition ${
                  filters.status === status
                    ? "bg-coral-soft text-coral-active"
                    : "bg-surface-strong text-ink"
                }`}
              >
                {status === "RECRUITING"
                  ? "모집중"
                  : status === "CLOSED"
                    ? "마감"
                    : "전체"}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetFilters}
          className="flex h-10 w-fit items-center justify-center rounded-sm border border-hairline px-4 text-button text-ink"
        >
          필터 초기화
        </button>
      </div>

      {/* 결과 */}
      {error ? (
        <div className="flex flex-col items-start gap-2 rounded-md border border-hairline px-4 py-3">
          <p className="text-body-md text-error">{error}</p>
          <button
            type="button"
            onClick={applyFilters}
            className="flex h-10 items-center justify-center rounded-sm border border-hairline px-4 text-button text-ink"
          >
            다시 시도
          </button>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-md bg-surface-soft"
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-md border border-hairline bg-surface-soft px-6 py-8 text-center">
          <p className="text-body-md font-medium text-ink">
            검색 결과가 없습니다.
          </p>
          <p className="mt-1 text-body-md text-muted">
            필터를 변경하거나 새로운 동행글을 작성해보세요.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 inline-flex h-12 items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <>
          <div className="text-caption text-muted">
            {posts.length}건 검색됨
            {posts.length >= 8 && " (상위 8개 표시)"}
          </div>

          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => onSelectPost(post)}
                className={`rounded-md border px-4 py-3 text-left transition ${
                  selectedPost?.id === post.id
                    ? "border-coral bg-coral-soft"
                    : "border-hairline bg-canvas hover:border-coral hover:bg-coral-soft"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-body-md font-semibold text-ink">
                      {post.title}
                    </h4>
                    <p className="mt-1 text-caption text-muted">
                      {post.region} · {post.start_date} ~ {post.end_date}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-caption font-medium ${
                          post.effectiveStatus === "RECRUITING"
                            ? "bg-success text-on-coral"
                            : "bg-surface-strong text-muted"
                        }`}
                      >
                        {post.effectiveStatus === "RECRUITING"
                          ? "모집중"
                          : "마감"}
                      </span>
                      <span className="text-caption text-muted">
                        모집: {post.capacity}명
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
