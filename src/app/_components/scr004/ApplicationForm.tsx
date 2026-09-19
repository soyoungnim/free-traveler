"use client";

import { useState } from "react";
import {
  submitApplication,
  acceptApplication,
  rejectApplication,
} from "@/lib/db/mate-applications";
import type { MateApplicationRow } from "@/lib/db/types";

export interface ApplicationFormProps {
  postId: string;
  isPostAuthor?: boolean;
  userApplications?: MateApplicationRow[];
  postAuthorApplications?: MateApplicationRow[];
  isAuthenticated?: boolean;
  isAdult?: boolean;
  onLoginRequired?: () => void;
}

interface ToastState {
  message: string;
  type: "success" | "error";
}

export function ApplicationForm({
  postId,
  isPostAuthor = false,
  userApplications = [],
  postAuthorApplications = [],
  isAuthenticated = false,
  isAdult = false,
  onLoginRequired,
}: ApplicationFormProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const charCount = message.length;
  const isOverLimit = charCount > 500;
  const canSubmit = !isOverLimit && message.trim().length > 0 && !isSubmitting;

  const userHasActiveApplication = userApplications.some(
    (app) => app.post_id === postId && app.status !== "REJECTED",
  );

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }

    if (!isAdult) {
      showToast("성인 확인이 필요합니다.", "error");
      return;
    }

    if (userHasActiveApplication) {
      showToast("이미 참가 신청이 있습니다.", "error");
      return;
    }

    if (isOverLimit || message.trim().length === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitApplication({
        postId,
        message: message.trim(),
      });

      if (result.error) {
        if (result.error === "DUPLICATE_APPLICATION") {
          showToast("이미 참가 신청이 있습니다.", "error");
        } else if (result.error === "UNAUTHORIZED") {
          showToast("로그인이 필요합니다.", "error");
        } else if (result.error === "INVALID_MESSAGE") {
          showToast("유효하지 않은 메시지입니다.", "error");
        } else {
          showToast("요청 처리 중 오류가 발생했습니다.", "error");
        }
      } else {
        showToast("참가 신청이 완료되었습니다.", "success");
        setMessage("");
      }
    } catch {
      showToast("예상치 못한 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccept = async (applicationId: string) => {
    if (!isPostAuthor) return;

    setProcessingId(applicationId);
    try {
      const result = await acceptApplication(applicationId);
      if (result.error) {
        showToast("승인 처리 중 오류가 발생했습니다.", "error");
      } else {
        showToast("참가를 승인했습니다.", "success");
      }
    } catch {
      showToast("예상치 못한 오류가 발생했습니다.", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (applicationId: string) => {
    if (!isPostAuthor) return;

    setProcessingId(applicationId);
    try {
      const result = await rejectApplication(applicationId);
      if (result.error) {
        showToast("거절 처리 중 오류가 발생했습니다.", "error");
      } else {
        showToast("참가를 거절했습니다.", "success");
      }
    } catch {
      showToast("예상치 못한 오류가 발생했습니다.", "error");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {!isAuthenticated ? (
        <div className="rounded-md border border-hairline bg-surface-soft px-4 py-3 text-body-md text-body">
          <p>로그인하면 동행을 신청할 수 있습니다.</p>
        </div>
      ) : !isAdult ? (
        <div className="rounded-md border border-hairline bg-surface-soft px-4 py-3 text-body-md text-body">
          <p>성인 확인이 필요합니다.</p>
        </div>
      ) : isPostAuthor ? (
        <div className="flex flex-col gap-3">
          <p className="text-body-md font-semibold">받은 참가 신청</p>
          {postAuthorApplications.length === 0 ? (
            <p className="text-body-md text-muted">아직 참가 신청이 없습니다.</p>
          ) : (
            postAuthorApplications.map((app) => (
              <div
                key={app.id}
                className="rounded-md border border-hairline p-3 text-body-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">
                    신청자: {app.applicant_id.slice(0, 8)}
                  </span>
                  <span
                    className={`text-caption font-medium ${
                      app.status === "ACCEPTED"
                        ? "text-success"
                        : app.status === "REJECTED"
                          ? "text-error"
                          : "text-muted"
                    }`}
                  >
                    {app.status === "ACCEPTED"
                      ? "승인됨"
                      : app.status === "REJECTED"
                        ? "거절됨"
                        : "대기 중"}
                  </span>
                </div>
                <p className="mb-3 whitespace-pre-wrap text-body-md text-body">
                  {app.message}
                </p>
                {app.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={processingId === app.id}
                      onClick={() => handleAccept(app.id)}
                      className="flex h-10 flex-1 items-center justify-center rounded-sm bg-success px-3 text-button text-on-coral disabled:bg-coral-disabled"
                    >
                      승인
                    </button>
                    <button
                      type="button"
                      disabled={processingId === app.id}
                      onClick={() => handleReject(app.id)}
                      className="flex h-10 flex-1 items-center justify-center rounded-sm border border-hairline px-3 text-button text-ink"
                    >
                      거절
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : userHasActiveApplication ? (
        <div className="rounded-md border border-hairline bg-surface-soft px-4 py-3 text-body-md text-body">
          <p>이미 참가 신청이 제출되었습니다.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5 text-body-md text-ink">
            참가 신청 메시지
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              placeholder="동행에 대해 소개해주세요. (최대 500자)"
              className="h-24 resize-none rounded-sm border border-hairline px-3 py-2 text-body-md placeholder-muted disabled:bg-surface-soft"
            />
            <div className="flex justify-between text-caption text-muted">
              <span>{charCount}/500자</span>
              {isOverLimit && (
                <span className="text-error">글자 수를 초과했습니다.</span>
              )}
            </div>
          </label>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="flex h-12 items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral disabled:bg-coral-disabled"
          >
            {isSubmitting ? "제출 중..." : "참여 신청하기"}
          </button>
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
