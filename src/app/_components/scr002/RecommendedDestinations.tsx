"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";
import Link from "next/link";
import { representativeProfile } from "@/data/representative/profile";
import { domesticDestinations } from "@/data/destinations/domestic";
import { overseasDestinations } from "@/data/destinations/overseas";
import { DestinationDrawer } from "@/app/_components/scr001/DestinationDrawer";

const ALL_DESTINATIONS = [...domesticDestinations, ...overseasDestinations];

type ContactLinkKey = "CONTACT_EMAIL" | "SNS_INSTAGRAM" | "SNS_YOUTUBE";

const CONTACT_LINK_LABELS: Record<ContactLinkKey, string> = {
  CONTACT_EMAIL: "이메일 문의",
  SNS_INSTAGRAM: "Instagram",
  SNS_YOUTUBE: "YouTube",
};

/**
 * app_settings는 anon에게 select만 허용된 공개 설정 테이블이라(RLS),
 * 여기서는 서버 전용 client.ts 대신 공개 anon key로 만든 브라우저 client로
 * 직접 조회한다 — 문의/SNS 링크는 값이 없으면 그냥 렌더링을 생략한다.
 */
async function getContactLinks(): Promise<
  Partial<Record<ContactLinkKey, string>>
> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const keys: ContactLinkKey[] = [
    "CONTACT_EMAIL",
    "SNS_INSTAGRAM",
    "SNS_YOUTUBE",
  ];
  const { data } = await supabase
    .from("app_settings")
    .select("key, value")
    .in("key", keys);

  const links: Partial<Record<ContactLinkKey, string>> = {};
  for (const row of (data ?? []) as { key: string; value: unknown }[]) {
    const value = row.value;
    const url =
      typeof value === "string"
        ? value
        : value && typeof value === "object" && "url" in value
          ? (value as { url?: unknown }).url
          : null;
    if (typeof url === "string" && url) {
      links[row.key as ContactLinkKey] = url;
    }
  }
  return links;
}

export function RecommendedDestinations() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [contactLinks, setContactLinks] = useState<
    Partial<Record<ContactLinkKey, string>>
  >({});

  useEffect(() => {
    let mounted = true;
    getContactLinks()
      .then((links) => {
        if (mounted) setContactLinks(links);
      })
      .catch(() => {
        // 문의/SNS 링크는 부가 정보라 조회 실패 시 조용히 생략한다.
      });
    return () => {
      mounted = false;
    };
  }, []);

  const recommended = representativeProfile.memorableDestinationSlugs
    .map((slug) => ALL_DESTINATIONS.find((d) => d.slug === slug))
    .filter((d): d is (typeof ALL_DESTINATIONS)[number] => Boolean(d));

  const contactEntries = (
    Object.keys(contactLinks) as ContactLinkKey[]
  ).filter((key) => contactLinks[key]);

  return (
    <section className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-display-md font-bold">기억에 남는 여행지</h2>
          <p className="mt-1 text-body-lg text-body">
            직접 다녀온 곳 중 가장 추천하는 여행지 4곳이다.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {recommended.map((destination) => (
            <button
              key={destination.slug}
              type="button"
              onClick={() => setSelectedSlug(destination.slug)}
              className="flex flex-col gap-2 text-left"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                <Image
                  src={destination.image.url}
                  alt={destination.image.alt}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-title-md font-semibold">
                {destination.name}
              </span>
              <span className="text-body-md text-muted">
                {destination.region}
              </span>
            </button>
          ))}
        </div>
      </div>

      {contactEntries.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-title-md font-semibold">문의·SNS</h3>
          <div className="flex flex-wrap gap-3">
            {contactEntries.map((key) => (
              <a
                key={key}
                href={contactLinks[key]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center justify-center rounded-sm border border-hairline px-5 text-button text-ink"
              >
                {CONTACT_LINK_LABELS[key]}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-md bg-surface-soft px-6 py-10 text-center md:flex-row md:justify-center md:gap-6">
        <Link
          href="/travel-tools"
          className="flex h-12 items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral"
        >
          여행 준비 시작하기
        </Link>
        <Link
          href="/mates"
          className="flex h-12 items-center justify-center rounded-sm border border-hairline px-6 text-button text-ink"
        >
          동행 찾아보기
        </Link>
      </div>

      <DestinationDrawer
        slug={selectedSlug}
        onClose={() => setSelectedSlug(null)}
        onNavigateToDestination={setSelectedSlug}
      />
    </section>
  );
}
