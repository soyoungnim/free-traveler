"use client";

import { useState } from "react";
import { submitReport, blockUser, unblockUser } from "@/lib/db/moderation";
import type { MatePostRow } from "@/lib/db/types";

const REPORT_REASONS = [
  { code: "INAPPROPRIATE_CONTENT", label: "부적절한 내용" },
  { code: "SPAM", label: "스팸" },
  { code: "HARASSMENT", label: "괴롭힘" },
  { code: "ILLEGAL_ACTIVITY", label: "불법 활동" },
  { code: "FAKE_PROFILE", label: "위장 프로필" },
  { code: "OTHER", label: "기타" },
];

export interface ReportBlockActionsProps {
  post: MatePostRow | null;
  isAuthenticated?: boolean;
  isAdult?: boolean;
  isAuthor?: boolean;
  isBlocked?: boolean;
  onLoginRequired?: () => void;
}

interface ToastState {
  message: string;
  type: "success" | "error";
}

export function ReportBlockActions({
  post,
  isAuthenticated = false,
  isAdult = false,
  isAuthor = false,
  isBlocked = false,
  onLoginRequired,
}: ReportBlockActionsProps) {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [isProcessingBlock, setIsProcessingBlock] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);

  if (!post || isAuthor) return null;

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmitReport = async () => {
    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }

    if (!isAdult) {
      showToast("성인 확인이 필요합니다.", "error");
      return;
    }

    if (!reportReason) {
      showToast("신고 사유를 선택하세요.", "error");
      return;
    }

    setIsSubmittingReport(true);
    try {
      const result = await submitReport({
        targetType: "POST",
        targetId: post.id,
        reasonCode: reportReason,
        description: reportDescription || null,
      });

      if (result.error) {
        showToast("신고 접수 중 오류가 발생했습니다.", "error");
      } else {
        showToast("신고가 접수되었습니다.", "success");
        setReportSubmitted(true);
        setReportId(result.reportId || null);
        setShowReportForm(false);
        setReportReason("");
        setReportDescription("");
      }
    } catch {
      showToast("예상치 못한 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleBlock = async () => {
    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }

    setIsProcessingBlock(true);
    try {
      const result = await blockUser(post.author_id);
      if (result.error) {
        showToast("처리 중 오류가 발생했습니다.", "error");
      } else {
        showToast("사용자를 차단했습니다.", "success");
      }
    } catch {
      showToast("예상치 못한 오류가 발생했습니다.", "error");
    } finally {
      setIsProcessingBlock(false);
    }
  };

  const handleUnblock = async () => {
    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }

    setIsProcessingBlock(true);
    try {
      const result = await unblockUser(post.author_id);
      if (result.error) {
        showToast("처리 중 오류가 발생했습니다.", "error");
      } else {
        showToast("사용자 차단을 해제했습니다.", "success");
      }
    } catch {
      showToast("예상치 못한 오류가 발생했습니다.", "error");
    } finally {
      setIsProcessingBlock(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 안전 안내 배너 */}
      <div className="rounded-md border border-warning bg-warning/10 px-4 py-3">
        <p className="text-body-md font-medium text-ink">
          안전한 동행을 위해 주의하세요.
        </p>
        <p className="mt-1 text-caption text-body">
          개인정보는 절대 미리 공유하지 말고, 만남 전 신원을 확인하세요.
        </p>
        <a
          href="/travel-tools"
          className="mt-3 inline-flex h-10 items-center justify-center rounded-sm border border-warning px-3 text-button text-ink"
        >
          여행 준비 이어가기
        </a>
      </div>

      {/* 신고 · 차단 버튼 */}
      <div className="flex flex-col gap-2 sm:flex-row">
        {!reportSubmitted ? (
          <button
            type="button"
            onClick={() => setShowReportForm(!showReportForm)}
            className="flex h-11 flex-1 items-center justify-center rounded-sm border border-hairline px-4 text-button text-ink"
          >
            신고하기
          </button>
        ) : (
          <div className="flex h-11 flex-1 items-center rounded-sm border border-success bg-success/10 px-4">
            <span className="text-caption font-medium text-success">
              신고 접수됨{reportId && ` (ID: ${reportId.slice(0, 8)})`}
            </span>
          </div>
        )}

        <button
          type="button"
          disabled={isProcessingBlock}
          onClick={isBlocked ? handleUnblock : handleBlock}
          className={`flex h-11 flex-1 items-center justify-center rounded-sm px-4 text-button ${
            isBlocked
              ? "border border-muted text-muted disabled:border-muted disabled:text-muted"
              : "border border-error text-error disabled:border-coral-disabled disabled:text-coral-disabled"
          }`}
        >
          {isProcessingBlock
            ? "처리 중..."
            : isBlocked
              ? "차단 해제"
              : "차단하기"}
        </button>
      </div>

      {/* 신고 폼 */}
      {showReportForm && (
        <div className="rounded-md border border-hairline bg-surface-soft p-4">
          <h4 className="text-body-md font-semibold text-ink">신고하기</h4>

          <div className="mt-3 flex flex-col gap-3">
            <label className="flex flex-col gap-1.5 text-body-md text-ink">
              신고 사유
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="h-11 rounded-sm border border-hairline px-3 text-body-md"
              >
                <option value="">사유를 선택하세요</option>
                {REPORT_REASONS.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-body-md text-ink">
              추가 설명 (선택)
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="자세히 설명해주세요."
                maxLength={500}
                className="h-20 resize-none rounded-sm border border-hairline px-3 py-2 text-body-md placeholder-muted"
              />
              <span className="text-caption text-muted">
                {reportDescription.length}/500자
              </span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSubmitReport}
                disabled={isSubmittingReport || !reportReason}
                className="flex flex-1 h-10 items-center justify-center rounded-sm bg-error px-4 text-button text-on-coral disabled:bg-coral-disabled"
              >
                {isSubmittingReport ? "접수 중..." : "신고 접수"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReportForm(false);
                  setReportReason("");
                  setReportDescription("");
                }}
                className="flex flex-1 h-10 items-center justify-center rounded-sm border border-hairline px-4 text-button text-ink"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

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
