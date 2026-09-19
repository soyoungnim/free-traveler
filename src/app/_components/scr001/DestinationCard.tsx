"use client";

import Image from "next/image";
import { useSyncExternalStore, useMemo } from "react";
import type { DestinationContent } from "@/data/destinations/domestic";
import { countrySafetyList } from "@/data/safety/countries";
import {
  focusRingClassName,
  minTouchTargetClassName,
  VisuallyHidden,
} from "@/app/_components/a11y/FocusRing";

const FAVORITES_KEY = "free-traveler:favorite-destinations";

function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** 즐겨찾기는 localStorage에만 저장한다 — 서버/DB로 전송하지 않는다. */
function writeFavorites(slugs: string[]) {
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(slugs));
  // 같은 탭 안의 다른 카드에도 즉시 반영되도록 알린다(storage 이벤트는 다른 탭에만 발생).
  window.dispatchEvent(new Event("free-traveler:favorites-changed"));
}

function subscribeToFavorites(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("free-traveler:favorites-changed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("free-traveler:favorites-changed", callback);
  };
}

function useIsFavorite(slug: string): boolean {
  return useSyncExternalStore(
    subscribeToFavorites,
    () => readFavorites().includes(slug),
    () => false, // getServerSnapshot — SSR에는 localStorage가 없으므로 항상 false
  );
}

export interface DestinationCardProps {
  destination: DestinationContent;
  /** 카드 클릭 시 상세 Drawer를 여는 트리거(실제 Drawer 상태는 상위 조립부가 소유). */
  onSelect?: (slug: string) => void;
}

export function DestinationCard({
  destination,
  onSelect,
}: DestinationCardProps) {
  const isFavorite = useIsFavorite(destination.slug);

  const countryName = useMemo(() => {
    if (destination.scope === "domestic") return null;
    const country = countrySafetyList.find(
      (c) => c.countryCode === destination.countryCode
    );
    return country?.countryName;
  }, [destination.scope, destination.countryCode]);

  function toggleFavorite(event: React.MouseEvent) {
    event.stopPropagation();
    const current = readFavorites();
    const alreadyFavorite = current.includes(destination.slug);
    // Set으로 중복을 방지한 뒤 저장한다.
    const next = alreadyFavorite
      ? current.filter((slug) => slug !== destination.slug)
      : [...new Set([...current, destination.slug])];
    writeFavorites(next);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.(destination.slug);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      data-testid="destination-card"
      onClick={() => onSelect?.(destination.slug)}
      onKeyDown={handleKeyDown}
      className={`group flex cursor-pointer flex-col overflow-hidden rounded-md text-left transition-shadow hover:shadow-card ${focusRingClassName}`}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={destination.image.url}
          alt={destination.image.alt}
          fill
          loading="lazy"
          className="rounded-md object-cover"
        />
        <button
          type="button"
          onClick={toggleFavorite}
          className={`absolute top-2 right-2 flex items-center justify-center rounded-full bg-canvas/90 text-title-md ${minTouchTargetClassName} ${focusRingClassName}`}
        >
          <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
          <VisuallyHidden>
            {isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
          </VisuallyHidden>
        </button>
      </div>
      <div className="flex flex-col gap-1 py-3">
        <h3 className="ml-[2mm] text-title-md font-semibold">{destination.name}</h3>
        {countryName && (
          <p className="ml-[3mm] text-body-md text-muted">{countryName}</p>
        )}
      </div>
    </div>
  );
}
