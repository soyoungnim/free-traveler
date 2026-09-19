"use client";

import { useEffect, useRef, useState } from "react";
import type { MatePostRow } from "@/lib/db/types";

export interface MateDetailPanelProps {
  post: MatePostRow | null;
  isOpen: boolean;
  onClose: () => void;
}

async function shareCurrentPage(title: string) {
  const url = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return;
    } catch {
      return;
    }
  }
  await navigator.clipboard.writeText(url);
}

export function MateDetailPanel({
  post,
  isOpen,
  onClose,
}: MateDetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!post || !isOpen) return;
    panelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [post, isOpen, onClose]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!post || !isOpen) return null;

  const panelContent = (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-display-md font-bold">{post.title}</h2>
        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-11 w-11 items-center justify-center text-title-lg"
          >
            ×
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-md border border-hairline bg-surface-soft px-4 py-3">
          <div className="text-caption font-medium text-muted">기본 정보</div>
          <div className="mt-2 flex flex-col gap-2 text-body-md text-body">
            <div className="flex justify-between">
              <span>여행지</span>
              <span className="font-medium">{post.region}</span>
            </div>
            <div className="flex justify-between">
              <span>기간</span>
              <span className="font-medium">
                {post.start_date} ~ {post.end_date}
              </span>
            </div>
            <div className="flex justify-between">
              <span>모집 인원</span>
              <span className="font-medium">{post.capacity}명</span>
            </div>
          </div>
        </div>

        {post.travel_style && post.travel_style.length > 0 && (
          <div className="rounded-md border border-hairline bg-surface-soft px-4 py-3">
            <div className="text-caption font-medium text-muted">
              여행 스타일
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {post.travel_style.map((style) => (
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

        {post.preferred_conditions && (
          <div className="rounded-md border border-hairline bg-surface-soft px-4 py-3">
            <div className="text-caption font-medium text-muted">
              선호 조건
            </div>
            <p className="mt-2 text-body-md text-body">
              {post.preferred_conditions}
            </p>
          </div>
        )}

        {post.description && (
          <div className="rounded-md border border-hairline bg-surface-soft px-4 py-3">
            <div className="text-caption font-medium text-muted">
              자세한 설명
            </div>
            <p className="mt-2 whitespace-pre-wrap text-body-md text-body">
              {post.description}
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => shareCurrentPage(post.title)}
        className="flex h-12 items-center justify-center rounded-sm border border-hairline px-6 text-button text-ink"
      >
        공유하기
      </button>
    </div>
  );

  if (isMobile) {
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
          aria-label={`${post.title} 상세`}
          onClick={(event) => event.stopPropagation()}
          className="flex h-full w-full flex-col gap-6 overflow-y-auto rounded-l-lg bg-canvas p-6 shadow-card"
        >
          {panelContent}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="complementary"
      aria-label={`${post.title} 상세`}
      className="rounded-md border border-hairline bg-canvas p-6 shadow-card"
    >
      {panelContent}
    </div>
  );
}
