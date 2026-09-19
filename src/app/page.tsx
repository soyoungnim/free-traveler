"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SearchFilterBar,
  useDestinationFilters,
} from "@/app/_components/scr001/SearchFilterBar";
import { DestinationCard } from "@/app/_components/scr001/DestinationCard";
import { DestinationDrawer } from "@/app/_components/scr001/DestinationDrawer";
import { SafetyDrawer } from "@/app/_components/scr001/SafetyDrawer";
import { AboutTeaser } from "@/app/_components/scr001/AboutTeaser";
import { domesticDestinations } from "@/data/destinations/domestic";
import { overseasDestinations } from "@/data/destinations/overseas";
import { countrySafetyList } from "@/data/safety/countries";
import {
  listMatePosts,
  type MatePostWithComputedStatus,
} from "@/lib/db/mates-read";

const ALL_DESTINATIONS = [...domesticDestinations, ...overseasDestinations];
const ALL_THEMES = [...new Set(ALL_DESTINATIONS.flatMap((d) => d.themes))];

const GRID_CLASS =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

function countryCodeToFlag(code: string): string {
  return [...code.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)).map((c) => String.fromCodePoint(c)).join("");
}

/**
 * PAGE-SCR001 조립 중 발견한 실제 제약: DestinationCard/SafetyDrawer 등은
 * onSelect 같은 콜백 props를 받는 Client Component라 이들을 잇는 상태는
 * Server Component가 아니라 Client 쪽에서 소유해야 한다(Server Component는
 * 함수를 Client Component props로 넘길 수 없음). 그래서 이 페이지 전체를
 * Client Component로 두고, CMP-SCR001-RECENT-MATES(비동기 Server Component)
 * 대신 그 밑바탕인 API-MATES-READ의 listMatePosts Server Action을 여기서
 * 직접 호출해 Skeleton·에러 상태를 이 Section에만 국한시킨다.
 */
function RecentMatesSection() {
  const [state, setState] = useState<{
    status: "loading" | "error" | "success";
    posts: MatePostWithComputedStatus[];
  }>({ status: "loading", posts: [] });

  function load(active: () => boolean) {
    listMatePosts({ status: "RECRUITING", limit: 3 })
      .then((posts) => {
        if (active()) setState({ status: "success", posts });
      })
      .catch(() => {
        if (active()) setState({ status: "error", posts: [] });
      });
  }

  useEffect(() => {
    let mounted = true;
    load(() => mounted);
    return () => {
      mounted = false;
    };
  }, []);

  function retry() {
    setState({ status: "loading", posts: [] });
    load(() => true);
  }

  if (state.status === "loading") {
    return (
      <ul className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className="h-20 animate-pulse rounded-md bg-surface-strong"
          />
        ))}
      </ul>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-hairline px-6 py-8 text-center">
        <p className="text-body-md text-error">
          최근 동행글을 불러오지 못했습니다.
        </p>
        <button
          type="button"
          onClick={retry}
          className="flex h-11 items-center justify-center rounded-sm border border-hairline px-5 text-button text-ink"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (state.posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-hairline px-6 py-12 text-center">
        <p className="text-body-lg text-body">
          아직 모집중인 동행글이 없습니다.
        </p>
        <p className="text-body-md text-muted">
          동행 찾기에서 여행 조건이 맞는 동행자를 직접 모집해 보세요.
        </p>
        <Link
          href="/travel-tools"
          className="mt-2 flex h-12 items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral"
        >
          동행 글 작성하기
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {state.posts.map((post) => (
        <li
          key={post.id}
          className="flex items-center justify-between rounded-md border border-hairline px-4 py-3"
        >
          <div className="flex flex-col gap-1">
            <p className="text-title-md font-semibold">{post.title}</p>
            <p className="text-body-md text-muted">
              {post.country_code} · {post.region} · {post.start_date} ~{" "}
              {post.end_date}
            </p>
          </div>
          <span className="rounded-full bg-surface-strong px-3 py-1 text-caption font-medium text-ink">
            모집중
          </span>
        </li>
      ))}
    </ul>
  );
}

function HomeContent() {
  const { filters, setFilters, domesticResults, overseasResults } =
    useDestinationFilters();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [selectedSafetyCountry, setSelectedSafetyCountry] = useState<
    string | null
  >(null);
  const [destinationScope, setDestinationScope] = useState<"domestic" | "overseas">("domestic");

  const featuredCountries = useMemo(() => countrySafetyList, []);
  const currentResults = destinationScope === "domestic" ? domesticResults : overseasResults;

  return (
    <>
      {/* Hero */}
      <section
        className="relative flex min-h-[360px] flex-col justify-center gap-8 overflow-hidden px-4 py-16 md:px-20"
        style={{ minHeight: "360px" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1594937113195-27f8b9046013"
          alt="비행기 창문 너머로 노을과 구름바다, 날개가 보이는 여행길 풍경"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/30 to-ink/10" />
        <div className="relative mx-auto flex w-full max-w-[1280px] flex-col gap-6">
          <h1 className="text-display-lg font-bold text-canvas">
            어디로 갈지, 무엇을 준비할지 한곳에서
          </h1>
          <p className="text-body-lg text-canvas">
            여행지를 탐색하고, 항공·숙소 조건을 정리하고, 안전정보와 동행까지
            확인하세요.
          </p>
          <SearchFilterBar />
        </div>
      </section>

      {/* 여행지 */}
      <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-16 md:px-20">
        <div>
          <h2 className="text-display-md font-bold">
            {destinationScope === "domestic" ? "국내 여행지" : "해외 여행지"}
          </h2>
          <p className="mt-1 text-body-lg text-body">
            {destinationScope === "domestic"
              ? "가까운 국내 여행지를 먼저 둘러보세요."
              : "15개국 30개 도시의 여행지를 소개합니다."}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDestinationScope("domestic")}
            className={`rounded-full px-4 py-1.5 text-caption font-medium ${
              destinationScope === "domestic"
                ? "bg-coral-soft text-coral-active"
                : "bg-surface-strong text-ink"
            }`}
          >
            국내
          </button>
          <button
            type="button"
            onClick={() => setDestinationScope("overseas")}
            className={`rounded-full px-4 py-1.5 text-caption font-medium ${
              destinationScope === "overseas"
                ? "bg-coral-soft text-coral-active"
                : "bg-surface-strong text-ink"
            }`}
          >
            해외
          </button>
        </div>

        <div
          className={GRID_CLASS}
          data-testid={
            destinationScope === "domestic"
              ? "domestic-destination-grid"
              : "overseas-destination-grid"
          }
        >
          {currentResults.map((destination) => (
            <DestinationCard
              key={destination.slug}
              destination={destination}
              onSelect={setSelectedSlug}
            />
          ))}
        </div>
      </section>

      {/* 여행 동기(테마) */}
      <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-16 md:px-20">
        <div>
          <h2 className="text-display-md font-bold">어떤 여행을 원하세요?</h2>
          <p className="mt-1 text-body-lg text-body">
            테마를 골라 여행지를 좁혀보세요.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_THEMES.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() =>
                setFilters({ theme: filters.theme === theme ? "" : theme })
              }
              className={
                filters.theme === theme
                  ? "rounded-full bg-coral-soft px-4 py-1.5 text-caption font-medium text-coral-active"
                  : "rounded-full bg-surface-strong px-4 py-1.5 text-caption font-medium text-ink"
              }
            >
              {theme}
            </button>
          ))}
        </div>
      </section>

      {/* 국가별 주의사항 */}
      <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 bg-surface-soft px-4 py-16 md:px-20">
        <div>
          <h2 className="text-display-md font-bold">국가별 주의사항</h2>
          <p className="mt-1 text-body-lg text-body">
            출국 전 공식 출처 기반 안전정보를 확인하세요.
          </p>
        </div>
        <div className={GRID_CLASS}>
          {featuredCountries.map((country) => (
            <button
              key={country.countryCode}
              type="button"
              onClick={() => setSelectedSafetyCountry(country.countryCode)}
              className="flex flex-col gap-2 rounded-md border border-hairline p-4 text-left"
            >
              <span className="flex items-center gap-2 text-title-md font-semibold">
                <span>{countryCodeToFlag(country.countryCode)}</span>
                {country.countryName}
              </span>
              <span className="rounded-full bg-safety-info px-3 py-1 text-caption font-medium text-on-coral">
                {country.advisoryLevel}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 최근 동행글 */}
      <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-16 md:px-20">
        <div>
          <h2 className="text-display-md font-bold">최근 동행 모집</h2>
          <p className="mt-1 text-body-lg text-body">
            모집중인 동행글을 확인해 보세요.
          </p>
        </div>
        <RecentMatesSection />
      </section>

      {/* free_traveler 소개 */}
      <section className="mx-auto w-full max-w-[1280px] px-4 py-16 md:px-20">
        <AboutTeaser />
      </section>

      <DestinationDrawer
        slug={selectedSlug}
        onClose={() => setSelectedSlug(null)}
        onNavigateToDestination={setSelectedSlug}
      />
      <SafetyDrawer
        countryCode={selectedSafetyCountry}
        onClose={() => setSelectedSafetyCountry(null)}
      />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
