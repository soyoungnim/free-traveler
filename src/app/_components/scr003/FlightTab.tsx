"use client";

import { useMemo, useState } from "react";
import { domesticDestinations } from "@/data/destinations/domestic";
import { overseasDestinations } from "@/data/destinations/overseas";
import { countrySafetyList } from "@/data/safety/countries";
import { getOutboundUrl } from "@/lib/db/admin-settings";

const ALL_DESTINATIONS = [...domesticDestinations, ...overseasDestinations];

const COUNTRY_OPTIONS = (() => {
  const map = new Map<string, string>();
  map.set("KR", "대한민국");
  for (const country of countrySafetyList) {
    map.set(country.countryCode, country.countryName);
  }
  return Array.from(map.entries()).map(([code, name]) => ({ code, name }));
})();

function regionsForCountry(code: string): string[] {
  return [
    ...new Set(
      ALL_DESTINATIONS.filter((d) => d.countryCode === code).map(
        (d) => d.region,
      ),
    ),
  ];
}

function toDateOrNull(value: string): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

const TIPS = [
  "저가 항공사와 대형 항공사를 같이 비교하면 같은 노선도 가격 차이가 클 수 있어요.",
  "화, 수요일 출발 항공권이 주말 출발보다 저렴한 경우가 많아요.",
  "왕복보다 편도 항공권을 두 번 조합하는 편이 더 저렴할 때도 있어요.",
];

type OutboundState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; url: string }
  | { status: "error" };

export function FlightTab() {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [outbound, setOutbound] = useState<OutboundState>({ status: "idle" });

  const regionOptions = useMemo(
    () => (country ? regionsForCountry(country) : []),
    [country],
  );

  const start = toDateOrNull(startDate);
  const end = toDateOrNull(endDate);
  const today = startOfToday();

  const startError =
    startDate && start && start < today ? "출발일은 오늘 이후여야 합니다." : null;
  const endError =
    endDate && end && start && end < start
      ? "귀국일은 출발일보다 빠를 수 없습니다."
      : null;

  const isComplete = Boolean(country && region && start && end);
  const isValid = isComplete && !startError && !endError;

  async function fetchOutboundUrl() {
    setOutbound({ status: "loading" });
    try {
      const url = await getOutboundUrl("FLIGHT_OUTBOUND_URL");
      setOutbound(url ? { status: "ready", url } : { status: "error" });
    } catch {
      setOutbound({ status: "error" });
    }
  }

  /**
   * 입력 4개 중 하나가 바뀔 때마다 호출한다. 방금 바뀐 값을 반영한 "다음"
   * 조건으로 유효성을 다시 계산해, 이번 변경으로 처음 유효해졌다면 바로
   * 이동 링크를 조회한다 — useEffect로 isValid를 구독하는 대신 이벤트
   * 핸들러에서 직접 판단해 set-state-in-effect 경고를 피한다.
   */
  function syncOutbound(next: {
    country?: string;
    region?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const nextCountry = next.country ?? country;
    const nextRegion = next.region ?? region;
    const nextStart = toDateOrNull(next.startDate ?? startDate);
    const nextEnd = toDateOrNull(next.endDate ?? endDate);
    const nextValid = Boolean(
      nextCountry &&
        nextRegion &&
        nextStart &&
        nextEnd &&
        nextStart >= today &&
        nextEnd >= nextStart,
    );
    if (nextValid) {
      fetchOutboundUrl();
    } else {
      setOutbound({ status: "idle" });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-body-md text-ink">
          여행 국가
          <select
            data-testid="trip-country-select"
            value={country}
            onChange={(event) => {
              setCountry(event.target.value);
              setRegion("");
              syncOutbound({ country: event.target.value, region: "" });
            }}
            className="h-11 rounded-sm border border-hairline px-3 text-body-md"
          >
            <option value="">국가를 선택하세요</option>
            {COUNTRY_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>
                {option.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-body-md text-ink">
          지역
          <select
            data-testid="trip-region-select"
            value={region}
            disabled={!country}
            onChange={(event) => {
              setRegion(event.target.value);
              syncOutbound({ region: event.target.value });
            }}
            className="h-11 rounded-sm border border-hairline px-3 text-body-md disabled:bg-surface-soft"
          >
            <option value="">지역을 선택하세요</option>
            {regionOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-body-md text-ink">
          출발일
          <input
            type="date"
            data-testid="trip-start-date"
            value={startDate}
            onChange={(event) => {
              setStartDate(event.target.value);
              syncOutbound({ startDate: event.target.value });
            }}
            className="h-11 rounded-sm border border-hairline px-3 text-body-md"
          />
          {startError && <span className="text-caption text-error">{startError}</span>}
        </label>

        <label className="flex flex-col gap-1.5 text-body-md text-ink">
          귀국일
          <input
            type="date"
            data-testid="trip-end-date"
            value={endDate}
            onChange={(event) => {
              setEndDate(event.target.value);
              syncOutbound({ endDate: event.target.value });
            }}
            className="h-11 rounded-sm border border-hairline px-3 text-body-md"
          />
          {endError && <span className="text-caption text-error">{endError}</span>}
        </label>
      </div>

      {isValid && (
        <div className="rounded-md border border-hairline bg-surface-soft px-4 py-3 text-body-md text-body">
          {COUNTRY_OPTIONS.find((c) => c.code === country)?.name} · {region} ·{" "}
          {startDate} ~ {endDate}
        </div>
      )}

      <p className="text-caption text-muted">
        입력값은 외부 사이트로 전달되지 않습니다. 국가·지역·날짜는 이 브라우저 안에서만 사용됩니다.
      </p>

      {outbound.status === "loading" && (
        <p className="text-body-md text-muted">이동 링크를 준비하는 중입니다…</p>
      )}

      {outbound.status === "ready" && (
        <a
          data-testid="flight-outbound-link"
          href={outbound.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-fit items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral"
        >
          항공편 보러 가기
        </a>
      )}

      {outbound.status === "error" && (
        <div className="flex flex-col items-start gap-2 rounded-md border border-hairline px-4 py-3">
          <p className="text-body-md text-error">
            이동 링크를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
          <button
            type="button"
            onClick={fetchOutboundUrl}
            className="flex h-11 items-center justify-center rounded-sm border border-hairline px-5 text-button text-ink"
          >
            다시 시도
          </button>
        </div>
      )}

      <div>
        <h3 className="text-title-md font-semibold">항공권 찾기 Tip</h3>
        <ul className="mt-2 flex flex-col gap-1 text-body-md text-body">
          {TIPS.map((tip) => (
            <li key={tip}>· {tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
