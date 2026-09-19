"use client";

import { useEffect, useRef } from "react";
import {
  countrySafetyList,
  type CountrySafetyCategories,
} from "@/data/safety/countries";

export interface SafetyDrawerProps {
  countryCode: string | null;
  onClose: () => void;
}

const CATEGORY_LABELS: { key: keyof CountrySafetyCategories; label: string }[] =
  [
    { key: "security", label: "치안" },
    { key: "commonScams", label: "흔한 사기" },
    { key: "localLaw", label: "현지 법규" },
    { key: "transport", label: "교통" },
    { key: "disasterWeather", label: "재난·기후" },
    { key: "health", label: "보건" },
    { key: "cultureEtiquette", label: "문화·복장" },
  ];

const MAJOR_ADVISORY_RE = /여행금지|철수권고|여행자제|특별여행주의보/;

function isStale(verifiedAt: string): boolean {
  const diffDays =
    (Date.now() - new Date(verifiedAt).getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > 7;
}

export function SafetyDrawer({ countryCode, onClose }: SafetyDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const country = countryCode
    ? countrySafetyList.find((c) => c.countryCode === countryCode)
    : undefined;

  useEffect(() => {
    if (!country) return;
    panelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [country, onClose]);

  if (!country) return null;

  const stale = isStale(country.verifiedAt);
  const isMajorAdvisory = MAJOR_ADVISORY_RE.test(country.advisoryLevel);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-ink/50"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`${country.countryName} 안전정보`}
        onClick={(event) => event.stopPropagation()}
        className="flex h-full w-full max-w-[448px] flex-col gap-6 overflow-y-auto rounded-l-lg bg-canvas p-6 shadow-card md:max-w-[512px]"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-display-md font-bold">
            {country.countryName} 안전정보
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-11 w-11 items-center justify-center text-title-lg"
          >
            ×
          </button>
        </div>

        {isMajorAdvisory && (
          <div className="rounded-sm bg-advisory px-4 py-3 text-body-md text-on-coral">
            <strong>중대 경보</strong> — {country.advisoryLevel}
          </div>
        )}

        {stale && (
          <div className="rounded-sm bg-warning px-4 py-3 text-body-md text-on-coral">
            최종 확인 후 7일이 지났어요 — 최신 정보를 다시 확인해 주세요.
          </div>
        )}

        <p className="text-body-md text-body">
          범위: {country.scopeType === "COUNTRY" ? "국가 전체" : "특정 지역"} —{" "}
          {country.scopeText}
        </p>

        {CATEGORY_LABELS.map(({ key, label }) => (
          <section key={key}>
            <h3 className="text-title-md font-semibold">{label}</h3>
            <ul className="mt-2 flex flex-col gap-1 text-body-md text-body">
              {country.categories[key].map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </section>
        ))}

        <section>
          <h3 className="text-title-md font-semibold">긴급연락처</h3>
          <ul className="mt-2 flex flex-col gap-1 text-body-md text-body">
            <li>현지 경찰: {country.emergencyContacts.localPolice}</li>
            <li>현지 구급: {country.emergencyContacts.localAmbulance}</li>
            <li>영사콜센터: {country.emergencyContacts.consularCallCenter}</li>
            <li>{country.emergencyContacts.note}</li>
          </ul>
        </section>

        <p className="text-caption text-muted">
          출처: {country.sourceName} · 최종 확인일 {country.verifiedAt} · 편집자{" "}
          {country.editor}
        </p>

        <a
          href={country.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center rounded-sm border border-hairline px-6 text-button text-ink"
        >
          외교부 원문 확인하기
        </a>

        <p className="text-caption text-muted">
          이 안전정보는 공식 판단을 대체하지 않습니다. 출국 직전 외교부 원문을
          다시 확인하세요.
        </p>
      </div>
    </div>
  );
}
