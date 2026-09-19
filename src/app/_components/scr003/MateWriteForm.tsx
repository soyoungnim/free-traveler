"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { domesticDestinations } from "@/data/destinations/domestic";
import { overseasDestinations } from "@/data/destinations/overseas";
import { countrySafetyList } from "@/data/safety/countries";
import { getMyProfile } from "@/lib/db/account";
import {
  createMatePost,
  getMateSafetyPolicyVersion,
} from "@/lib/db/mates-write";
import type { UserProfileRow } from "@/lib/db/types";

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

const TRAVEL_STYLE_OPTIONS = [
  "느긋한 일정",
  "빠듯한 일정",
  "맛집 위주",
  "액티비티 위주",
  "사진 촬영 위주",
];

const CONTACT_FIELD_LABELS: Record<string, string> = {
  title: "제목",
  description: "설명",
  preferredConditions: "원하는 동행 조건",
};

type ProfileState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "minor" }
  | { status: "ready"; profile: UserProfileRow };

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

export function MateWriteForm() {
  const [profileState, setProfileState] = useState<ProfileState>({
    status: "loading",
  });
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [preferredConditions, setPreferredConditions] = useState("");
  const [travelStyle, setTravelStyle] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [safetyAgreed, setSafetyAgreed] = useState(false);
  const [submit, setSubmit] = useState<SubmitState>({ status: "idle" });
  const [policyVersion, setPolicyVersion] = useState("");

  useEffect(() => {
    let mounted = true;
    getMyProfile()
      .then((profile) => {
        if (!mounted) return;
        if (!profile) {
          setProfileState({ status: "unauthenticated" });
        } else if (!profile.is_adult) {
          setProfileState({ status: "minor" });
        } else {
          setProfileState({ status: "ready", profile });
        }
      })
      .catch(() => {
        if (mounted) setProfileState({ status: "unauthenticated" });
      });
    getMateSafetyPolicyVersion().then((version) => {
      if (mounted) setPolicyVersion(version);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (profileState.status === "loading") {
    return (
      <div className="h-40 animate-pulse rounded-md bg-surface-strong" />
    );
  }

  if (profileState.status === "unauthenticated") {
    return (
      <div
        data-testid="mate-unauthenticated-notice"
        className="flex flex-col items-center gap-3 rounded-md border border-hairline px-6 py-10 text-center"
      >
        <p className="text-body-lg text-body">
          동행 모집글을 작성하려면 먼저 로그인해야 합니다.
        </p>
        <p className="text-body-md text-muted">
          로그인 후 성인 인증까지 완료하면 모집글을 작성할 수 있어요.
        </p>
        <Link
          href="/account"
          className="mt-2 flex h-12 items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral"
        >
          로그인
        </Link>
      </div>
    );
  }

  if (profileState.status === "minor") {
    return (
      <div
        data-testid="mate-adult-verification-notice"
        className="flex flex-col items-center gap-3 rounded-md border border-hairline px-6 py-10 text-center"
      >
        <p className="text-body-lg text-body">
          동행 모집글 작성은 성인 인증을 완료한 계정만 가능합니다.
        </p>
        <p className="text-body-md text-muted">
          내 계정 페이지에서 성인 인증을 먼저 완료해 주세요.
        </p>
        <Link
          href="/account"
          className="mt-2 flex h-12 items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral"
        >
          성인 인증하러 가기
        </Link>
      </div>
    );
  }

  const regionOptions = country ? regionsForCountry(country) : [];
  const dateError =
    startDate && endDate && new Date(endDate) < new Date(startDate)
      ? "종료일은 시작일보다 빠를 수 없습니다."
      : null;

  const canSubmit =
    title.trim().length > 0 &&
    country &&
    region &&
    startDate &&
    endDate &&
    !dateError &&
    capacity > 0 &&
    travelStyle.length > 0 &&
    description.trim().length > 0 &&
    safetyAgreed;

  function toggleTravelStyle(style: string) {
    setTravelStyle((prev) =>
      prev.includes(style)
        ? prev.filter((s) => s !== style)
        : [...prev, style],
    );
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmit({ status: "submitting" });
    const result = await createMatePost({
      title: title.trim(),
      countryCode: country,
      region,
      startDate,
      endDate,
      capacity,
      preferredConditions: preferredConditions.trim() || null,
      travelStyle,
      description: description.trim(),
      safetyRuleAgreed: safetyAgreed,
    });

    if (result.error?.startsWith("CONTACT_INFO_DETECTED:")) {
      const field = result.error.split(":")[1];
      const label = CONTACT_FIELD_LABELS[field] ?? field;
      setSubmit({
        status: "error",
        message: `${label}에 전화번호·이메일·메신저 ID로 보이는 내용이 있어 게시할 수 없습니다. ${label}에서 연락처 관련 내용을 지운 뒤 다시 시도해 주세요.`,
      });
      return;
    }

    if (result.error) {
      setSubmit({
        status: "error",
        message: "모집글을 게시하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      });
      return;
    }

    setSubmit({ status: "success" });
  }

  if (submit.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-hairline px-6 py-10 text-center">
        <p className="text-body-lg text-body">모집글이 게시됐습니다.</p>
        <Link
          href="/mates"
          className="mt-2 flex h-12 items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral"
        >
          동행 목록에서 확인하기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-body-md text-ink">
        제목
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="예: 도쿄 3박4일 같이 다니실 분 구해요"
          className="h-11 rounded-sm border border-hairline px-3 text-body-md"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-body-md text-ink">
          여행 국가
          <select
            value={country}
            onChange={(event) => {
              setCountry(event.target.value);
              setRegion("");
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
            value={region}
            disabled={!country}
            onChange={(event) => setRegion(event.target.value)}
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
          시작일
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="h-11 rounded-sm border border-hairline px-3 text-body-md"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-body-md text-ink">
          종료일
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="h-11 rounded-sm border border-hairline px-3 text-body-md"
          />
          {dateError && (
            <span className="text-caption text-error">{dateError}</span>
          )}
        </label>

        <label className="flex flex-col gap-1.5 text-body-md text-ink">
          모집 인원(본인 제외)
          <input
            type="number"
            min={1}
            max={10}
            value={capacity}
            onChange={(event) => setCapacity(Number(event.target.value))}
            className="h-11 rounded-sm border border-hairline px-3 text-body-md"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-body-md text-ink">
        원하는 동행 조건(선택)
        <input
          type="text"
          value={preferredConditions}
          onChange={(event) => setPreferredConditions(event.target.value)}
          placeholder="예: 사진 찍는 것 좋아하시는 분"
          className="h-11 rounded-sm border border-hairline px-3 text-body-md"
        />
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-body-md text-ink">여행 스타일(1개 이상)</span>
        <div className="flex flex-wrap gap-2">
          {TRAVEL_STYLE_OPTIONS.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => toggleTravelStyle(style)}
              className={
                travelStyle.includes(style)
                  ? "rounded-full bg-coral-soft px-4 py-1.5 text-caption font-medium text-coral-active"
                  : "rounded-full bg-surface-strong px-4 py-1.5 text-caption font-medium text-ink"
              }
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1.5 text-body-md text-ink">
        설명
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          placeholder="여행 일정, 동행을 구하는 이유, 함께하고 싶은 활동 등을 적어주세요."
          className="rounded-sm border border-hairline px-3 py-2 text-body-md"
        />
      </label>

      <div className="rounded-md bg-safety-info px-4 py-3 text-body-md text-on-coral">
        연락처(전화번호·이메일·메신저 ID)는 본문에 적을 수 없습니다. 참가
        요청이 수락된 후 서로 연락 방법을 직접 교환하세요.
      </div>

      <label className="flex items-start gap-2 text-body-md text-ink">
        <input
          type="checkbox"
          checked={safetyAgreed}
          onChange={(event) => setSafetyAgreed(event.target.checked)}
          className="mt-1 h-4 w-4"
        />
        <span>
          동행 안전수칙(공개된 장소에서 첫 만남, 연락처 비공개 등)을 읽고
          동의합니다. (정책 버전 {policyVersion})
        </span>
      </label>

      {submit.status === "error" && (
        <p className="text-body-md text-error">{submit.message}</p>
      )}

      <button
        type="button"
        disabled={!canSubmit || submit.status === "submitting"}
        onClick={handleSubmit}
        className="flex h-12 w-fit items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral disabled:bg-coral-disabled"
      >
        {submit.status === "submitting" ? "게시하는 중…" : "모집글 게시하기"}
      </button>
    </div>
  );
}
