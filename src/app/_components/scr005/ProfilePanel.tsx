"use client";

import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile, confirmAdultVerification } from "@/lib/db/account";
import type { UserProfileRow } from "@/lib/db/types";

const AGE_RANGES = ["20-29", "30-39", "40-49", "50+"];
const GENDERS = ["남성", "여성", "기타"];
const TRAVEL_STYLES = [
  "액티브",
  "여유로운",
  "문화탐방",
  "음식투어",
  "자연",
  "야행",
];

interface ToastState {
  message: string;
  type: "success" | "error";
}

export function ProfilePanel() {
  const [profile, setProfile] = useState<UserProfileRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [travelStyles, setTravelStyles] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmingAdult, setIsConfirmingAdult] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const data = await getMyProfile();
        setProfile(data);
        if (data) {
          setNickname(data.nickname);
          setAgeRange(data.age_range);
          setGender(data.gender || "");
          setTravelStyles(data.travel_style || []);
          setBio(data.bio || "");
        }
      } catch {
        showToast("프로필을 불러오지 못했습니다.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!nickname || !ageRange || travelStyles.length === 0) {
      showToast("필수 항목을 입력하세요.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateMyProfile({
        nickname,
        ageRange,
        gender: gender || null,
        travelStyle: travelStyles,
        bio: bio || null,
      });

      if (result.error) {
        showToast("저장 중 오류가 발생했습니다.", "error");
      } else {
        showToast("프로필이 저장되었습니다.", "success");
        setIsEditing(false);
        const updated = await getMyProfile();
        setProfile(updated);
      }
    } catch {
      showToast("예상치 못한 오류가 발생했습니다.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmAdult = async () => {
    setIsConfirmingAdult(true);
    try {
      const result = await confirmAdultVerification();
      if (result.error) {
        showToast("확인 중 오류가 발생했습니다.", "error");
      } else {
        showToast("성인 확인이 완료되었습니다.", "success");
        const updated = await getMyProfile();
        setProfile(updated);
      }
    } catch {
      showToast("예상치 못한 오류가 발생했습니다.", "error");
    } finally {
      setIsConfirmingAdult(false);
    }
  };

  const handleStyleToggle = (style: string) => {
    setTravelStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-soft border-t-coral" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 성인 확인 상태 */}
      {profile && (
        <div className={`rounded-md border px-4 py-3 ${
          profile.is_adult
            ? "border-success bg-success/10"
            : "border-warning bg-warning/10"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`inline-block text-title-md font-bold ${
                profile.is_adult ? "text-success" : "text-warning"
              }`}>
                {profile.is_adult ? "✓" : "!"}
              </span>
              <div>
                <p className={`text-body-md font-medium ${
                  profile.is_adult ? "text-success" : "text-warning"
                }`}>
                  {profile.is_adult ? "성인 확인 완료" : "성인 확인 필요"}
                </p>
                {!profile.is_adult && (
                  <p className="text-caption text-body">
                    동행 쓰기를 위해 성인 확인이 필요합니다.
                  </p>
                )}
              </div>
            </div>
            {!profile.is_adult && (
              <button
                type="button"
                disabled={isConfirmingAdult}
                onClick={handleConfirmAdult}
                className="flex h-10 items-center justify-center rounded-sm bg-warning px-4 text-button text-on-coral disabled:bg-coral-disabled"
              >
                {isConfirmingAdult ? "확인 중..." : "확인하기"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 프로필 폼 */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-title-md font-semibold">프로필</h3>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex h-10 items-center justify-center rounded-sm border border-hairline px-4 text-button text-ink"
            >
              수정
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-3 rounded-md border border-hairline p-4">
            <label className="flex flex-col gap-1.5 text-body-md text-ink">
              닉네임 *
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                disabled={isSaving}
                className="h-11 rounded-sm border border-hairline px-3 text-body-md disabled:bg-surface-soft"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-body-md text-ink">
              연령대 *
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                disabled={isSaving}
                className="h-11 rounded-sm border border-hairline px-3 text-body-md disabled:bg-surface-soft"
              >
                <option value="">선택하세요</option>
                {AGE_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-body-md text-ink">
              성별
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={isSaving}
                className="h-11 rounded-sm border border-hairline px-3 text-body-md disabled:bg-surface-soft"
              >
                <option value="">선택하세요</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-col gap-1.5">
              <label className="text-body-md font-medium text-ink">
                여행 스타일 *
              </label>
              <div className="flex flex-wrap gap-2">
                {TRAVEL_STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleStyleToggle(style)}
                    className={`rounded-full px-4 py-2 text-caption font-medium transition disabled:opacity-50 ${
                      travelStyles.includes(style)
                        ? "bg-coral-soft text-coral-active"
                        : "bg-surface-strong text-ink"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex flex-col gap-1.5 text-body-md text-ink">
              소개
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={isSaving}
                placeholder="자기소개를 입력하세요."
                maxLength={500}
                className="h-24 resize-none rounded-sm border border-hairline px-3 py-2 text-body-md placeholder-muted disabled:bg-surface-soft"
              />
              <span className="text-caption text-muted">
                {bio.length}/500자
              </span>
            </label>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveProfile}
                className="flex flex-1 h-12 items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral disabled:bg-coral-disabled"
              >
                {isSaving ? "저장 중..." : "저장"}
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setIsEditing(false)}
                className="flex flex-1 h-12 items-center justify-center rounded-sm border border-hairline px-6 text-button text-ink disabled:border-coral-disabled disabled:text-coral-disabled"
              >
                취소
              </button>
            </div>
          </div>
        ) : profile ? (
          <div className="flex flex-col gap-3 rounded-md border border-hairline p-4">
            <div>
              <p className="text-caption text-muted">닉네임</p>
              <p className="text-body-md text-ink">{profile.nickname}</p>
            </div>
            <div>
              <p className="text-caption text-muted">연령대</p>
              <p className="text-body-md text-ink">{profile.age_range}</p>
            </div>
            {profile.gender && (
              <div>
                <p className="text-caption text-muted">성별</p>
                <p className="text-body-md text-ink">{profile.gender}</p>
              </div>
            )}
            {profile.travel_style.length > 0 && (
              <div>
                <p className="text-caption text-muted">여행 스타일</p>
                <div className="flex flex-wrap gap-2 py-2">
                  {profile.travel_style.map((style) => (
                    <span
                      key={style}
                      className="inline-block rounded-full bg-coral-soft px-3 py-1 text-caption font-medium text-coral-active"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {profile.bio && (
              <div>
                <p className="text-caption text-muted">소개</p>
                <p className="whitespace-pre-wrap text-body-md text-body">{profile.bio}</p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-4 left-4 right-4 rounded-sm px-4 py-3 text-body-md text-on-coral md:left-auto md:right-auto md:w-fit md:self-center ${
            toast.type === "success" ? "bg-success" : "bg-error"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
