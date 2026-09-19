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
  "체크인 요일을 평일로 옮기면 같은 숙소도 더 저렴하게 예약할 수 있어요.",
  "숙소 위치가 역·정류장과 가까운지 후기의 최근 날짜 기준으로 확인해 보세요.",
  "취소 정책(무료 취소 가능일)을 예약 전에 꼭 확인하세요.",
];

type OutboundState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; url: string }
  | { status: "error" };

export function HotelTab() {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [outbound, setOutbound] = useState<OutboundState>({ status: "idle" });

  const regionOptions = useMemo(
    () => (country ? regionsForCountry(country) : []),
    [country],
  );

  const start = toDateOrNull(checkIn);
  const end = toDateOrNull(checkOut);
  const today = startOfToday();

  const startError =
    checkIn && start && start < today
      ? "체크인은 오늘 이후여야 합니다."
      : null;
  const endError =
    checkOut && end && start && end <= start
      ? "체크아웃은 체크인보다 늦어야 합니다."
      : null;

  const isComplete = Boolean(country && region && start && end);
  const isValid = isComplete && !startError && !endError;

  async function fetchOutboundUrl() {
    setOutbound({ status: "loading" });
    try {
      const url = await getOutboundUrl("HOTEL_OUTBOUND_URL");
      setOutbound(url ? { status: "ready", url } : { status: "error" });
    } catch {
      setOutbound({ status: "error" });
    }
  }

  /**
   * FlightTab과 동일한 이유로 useEffect 대신 이벤트 핸들러에서
   * 직접 다음 유효성을 계산해 이동 링크를 조회한다.
   */
  function syncOutbound(next: {
    country?: string;
    region?: string;
    checkIn?: string;
    checkOut?: string;
  }) {
    const nextCountry = next.country ?? country;
    const nextRegion = next.region ?? region;
    const nextStart = toDateOrNull(next.checkIn ?? checkIn);
    const nextEnd = toDateOrNull(next.checkOut ?? checkOut);
    const nextValid = Boolean(
      nextCountry &&
        nextRegion &&
        nextStart &&
        nextEnd &&
        nextStart >= today &&
        nextEnd > nextStart,
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
          숙박 국가
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
          체크인
          <input
            type="date"
            data-testid="trip-start-date"
            value={checkIn}
            onChange={(event) => {
              setCheckIn(event.target.value);
              syncOutbound({ checkIn: event.target.value });
            }}
            className="h-11 rounded-sm border border-hairline px-3 text-body-md"
          />
          {startError && <span className="text-caption text-error">{startError}</span>}
        </label>

        <label className="flex flex-col gap-1.5 text-body-md text-ink">
          체크아웃
          <input
            type="date"
            data-testid="trip-end-date"
            value={checkOut}
            onChange={(event) => {
              setCheckOut(event.target.value);
              syncOutbound({ checkOut: event.target.value });
            }}
            className="h-11 rounded-sm border border-hairline px-3 text-body-md"
          />
          {endError && <span className="text-caption text-error">{endError}</span>}
        </label>
      </div>

      {isValid && (
        <div className="rounded-md border border-hairline bg-surface-soft px-4 py-3 text-body-md text-body">
          {COUNTRY_OPTIONS.find((c) => c.code === country)?.name} · {region} ·{" "}
          {checkIn} ~ {checkOut}
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
          data-testid="hotel-outbound-link"
          href={outbound.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-fit items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral"
        >
          숙소 보러 가기
        </a>
      )}

      {outbound.status === "error" && (
        <div className="flex flex-col items-start gap-2 rounded-md border border-hairline px-4 py-3">
          <p className="text-body-md text-error">
            이동 링크를 불러오지 못했습니다. 입력하신 조건은 그대로 남아 있어요.
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
        <h3 className="text-title-md font-semibold">숙소 찾기 Tip</h3>
        <ul className="mt-2 flex flex-col gap-1 text-body-md text-body">
          {TIPS.map((tip) => (
            <li key={tip}>· {tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
