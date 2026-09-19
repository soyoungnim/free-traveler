"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  domesticDestinations,
  type DestinationContent,
} from "@/data/destinations/domestic";
import { overseasDestinations } from "@/data/destinations/overseas";
import { SafetyDrawer } from "./SafetyDrawer";

const ALL_DESTINATIONS = [...domesticDestinations, ...overseasDestinations];

export interface DestinationDrawerProps {
  slug: string | null;
  onClose: () => void;
  /** 관련 여행지 카드를 클릭하면 같은 Drawer의 내용을 바꿔서 보여준다. */
  onNavigateToDestination?: (slug: string) => void;
}

function relatedDestinations(
  current: DestinationContent,
): DestinationContent[] {
  return ALL_DESTINATIONS.filter(
    (d) =>
      d.slug !== current.slug &&
      (d.countryCode === current.countryCode ||
        d.themes.some((theme) => current.themes.includes(theme))),
  ).slice(0, 6);
}

async function shareCurrentPage(title: string) {
  const url = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return;
    } catch {
      // 사용자가 공유를 취소한 경우 등 — URL 복사로 폴백하지 않고 종료.
      return;
    }
  }
  await navigator.clipboard.writeText(url);
}

export function DestinationDrawer({
  slug,
  onClose,
  onNavigateToDestination,
}: DestinationDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const destination = slug
    ? ALL_DESTINATIONS.find((d) => d.slug === slug)
    : undefined;

  useEffect(() => {
    if (!destination) return;
    panelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [destination, onClose]);

  if (!destination) return null;

  const isOverseas = destination.scope === "overseas";
  const related = relatedDestinations(destination);

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-ink/50"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`${destination.name} 상세`}
        onClick={(event) => event.stopPropagation()}
        className="flex h-full w-full max-w-[448px] flex-col gap-6 overflow-y-auto rounded-l-lg bg-canvas p-6 shadow-card md:max-w-[512px]"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-display-md font-bold">{destination.name}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-11 w-11 items-center justify-center text-title-lg"
          >
            ×
          </button>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-md">
          <Image
            src={destination.image.url}
            alt={destination.image.alt}
            fill
            className="object-cover"
          />
        </div>

        <p className="text-body-lg text-body">{destination.overview}</p>

        <section>
          <h3 className="text-title-md font-semibold">핵심 명소·체험</h3>
          <ul className="mt-2 flex flex-col gap-1 text-body-md text-body">
            {destination.highlights.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-title-md font-semibold">추천 시기</h3>
          <p className="mt-2 text-body-md text-body">
            추천: {destination.bestTime.recommended}
          </p>
          <p className="text-body-md text-muted">
            비추천: {destination.bestTime.notRecommended}
          </p>
        </section>

        <section>
          <h3 className="text-title-md font-semibold">추천 일정</h3>
          <p className="mt-2 text-body-md font-medium">1일 코스</p>
          <ol className="flex flex-col gap-1 text-body-md text-body">
            {destination.itinerary1d.map((step) => (
              <li key={step}>· {step}</li>
            ))}
          </ol>
          <p className="mt-3 text-body-md font-medium">3일 코스</p>
          <ol className="flex flex-col gap-1 text-body-md text-body">
            {destination.itinerary3d.map((day) => (
              <li key={day.day}>
                Day {day.day}. {day.plan}
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h3 className="text-title-md font-semibold">예상 예산</h3>
          <p className="mt-2 text-body-md text-body">
            숙박 제외: {destination.budget.excludingLodging}
          </p>
          <p className="text-body-md text-body">
            숙박 포함: {destination.budget.includingLodging}
          </p>
        </section>

        <section>
          <h3 className="text-title-md font-semibold">현지 교통</h3>
          <p className="mt-2 text-body-md text-body">
            도착: {destination.transport.arrival}
          </p>
          <p className="text-body-md text-body">
            이동: {destination.transport.local}
          </p>
          <p className="text-body-md text-body">
            결제: {destination.transport.payment}
          </p>
        </section>

        <section>
          <h3 className="text-title-md font-semibold">음식</h3>
          <ul className="mt-2 flex flex-col gap-1 text-body-md text-body">
            {destination.foods.map((food) => (
              <li key={food.name}>
                · {food.name}
                {food.note ? ` — ${food.note}` : ""}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-title-md font-semibold">문화·에티켓</h3>
          <ul className="mt-2 flex flex-col gap-1 text-body-md text-body">
            {destination.etiquette.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </section>

        {isOverseas && (
          <button
            type="button"
            onClick={() => setSafetyOpen(true)}
            className="flex h-12 items-center justify-center rounded-sm border border-hairline px-6 text-button text-ink"
          >
            {destination.name} 국가 안전정보 보기
          </button>
        )}

        <button
          type="button"
          onClick={() => shareCurrentPage(destination.name)}
          className="flex h-12 items-center justify-center rounded-sm border border-hairline px-6 text-button text-ink"
        >
          공유하기
        </button>

        <p className="text-caption text-muted">
          출처: {destination.sources.map((s) => s.label).join(", ")} · 최종
          수정일 {destination.updatedAt}
        </p>

        {related.length > 0 && (
          <section>
            <h3 className="text-title-md font-semibold">관련 여행지</h3>
            <ul className="mt-2 grid grid-cols-2 gap-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <button
                    type="button"
                    onClick={() => onNavigateToDestination?.(item.slug)}
                    className="flex w-full flex-col gap-1 text-left"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                      <Image
                        src={item.image.url}
                        alt={item.image.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-body-md font-medium">
                      {item.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {isOverseas && (
        <SafetyDrawer
          countryCode={safetyOpen ? destination.countryCode : null}
          onClose={() => setSafetyOpen(false)}
        />
      )}
    </div>
  );
}
