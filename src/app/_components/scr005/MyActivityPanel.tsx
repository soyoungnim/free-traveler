"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { closeMatePost, deleteMatePost } from "@/lib/db/mates-write";
import { listMyMatePosts } from "@/lib/db/mates-read";
import {
  listMyApplications,
  acceptApplication,
  rejectApplication,
} from "@/lib/db/mate-applications";
import { listMyBlocks, unblockUser } from "@/lib/db/moderation";
import { deactivateMyAccount } from "@/lib/db/account";
import type {
  MatePostRow,
  MateApplicationRow,
  UserBlockRow,
} from "@/lib/db/types";

type ActivityTab = "posts" | "applications" | "blocks" | "account";

interface ToastState {
  message: string;
  type: "success" | "error";
}

export function MyActivityPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActivityTab>("posts");
  const [myPosts, setMyPosts] = useState<MatePostRow[]>([]);
  const [myApplications, setMyApplications] = useState<MateApplicationRow[]>([]);
  const [myBlocks, setMyBlocks] = useState<UserBlockRow[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [isLoadingBlocks, setIsLoadingBlocks] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoadingPosts(true);
      try {
        const posts = await listMyMatePosts();
        setMyPosts(posts);
      } catch {
        setMyPosts([]);
        showToast("글 목록을 불러오지 못했습니다.", "error");
      } finally {
        setIsLoadingPosts(false);
      }
    };

    if (activeTab === "posts") loadPosts();
  }, [activeTab]);

  useEffect(() => {
    const loadApplications = async () => {
      setIsLoadingApplications(true);
      try {
        const apps = await listMyApplications();
        setMyApplications(apps);
      } catch {
        setMyApplications([]);
        showToast("참가 요청을 불러오지 못했습니다.", "error");
      } finally {
        setIsLoadingApplications(false);
      }
    };

    if (activeTab === "applications") loadApplications();
  }, [activeTab]);

  useEffect(() => {
    const loadBlocks = async () => {
      setIsLoadingBlocks(true);
      try {
        const blocks = await listMyBlocks();
        setMyBlocks(blocks);
      } catch {
        setMyBlocks([]);
        showToast("차단 목록을 불러오지 못했습니다.", "error");
      } finally {
        setIsLoadingBlocks(false);
      }
    };

    if (activeTab === "blocks") loadBlocks();
  }, [activeTab]);

  const handleClosePost = async (postId: string) => {
    setProcessingId(postId);
    try {
      const result = await closeMatePost(postId);
      if (result.error) {
        showToast("처리 중 오류가 발생했습니다.", "error");
      } else {
        showToast("동행글을 마감했습니다.", "success");
        setMyPosts((prev) => prev.map((p) =>
          p.id === postId ? { ...p, status: "CLOSED" } : p
        ));
      }
    } catch {
      showToast("예상치 못한 오류가 발생했습니다.", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    setProcessingId(postId);
    try {
      const result = await deleteMatePost(postId);
      if (result.error) {
        showToast("처리 중 오류가 발생했습니다.", "error");
      } else {
        showToast("동행글이 삭제되었습니다.", "success");
        setMyPosts((prev) => prev.filter((p) => p.id !== postId));
      }
    } catch {
      showToast("예상치 못한 오류가 발생했습니다.", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleAcceptApplication = async (appId: string) => {
    setProcessingId(appId);
    try {
      const result = await acceptApplication(appId);
      if (result.error) {
        showToast("처리 중 오류가 발생했습니다.", "error");
      } else {
        showToast("참가를 승인했습니다.", "success");
        setMyApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: "ACCEPTED" } : a))
        );
      }
    } catch {
      showToast("예상치 못한 오류가 발생했습니다.", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectApplication = async (appId: string) => {
    setProcessingId(appId);
    try {
      const result = await rejectApplication(appId);
      if (result.error) {
        showToast("처리 중 오류가 발생했습니다.", "error");
      } else {
        showToast("참가를 거절했습니다.", "success");
        setMyApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: "REJECTED" } : a))
        );
      }
    } catch {
      showToast("예상치 못한 오류가 발생했습니다.", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnblock = async (userId: string) => {
    setProcessingId(userId);
    try {
      const result = await unblockUser(userId);
      if (result.error) {
        showToast("처리 중 오류가 발생했습니다.", "error");
      } else {
        showToast("차단을 해제했습니다.", "success");
        setMyBlocks((prev) => prev.filter((b) => b.blocked_id !== userId));
      }
    } catch {
      showToast("예상치 못한 오류가 발생했습니다.", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("정말 계정을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    setIsDeletingAccount(true);
    try {
      const result = await deactivateMyAccount();
      if (result.error) {
        showToast("계정 삭제 중 오류가 발생했습니다.", "error");
      } else {
        showToast("계정이 삭제되었습니다.", "success");
        router.push("/");
      }
    } catch {
      showToast("예상치 못한 오류가 발생했습니다.", "error");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 탭 */}
      <div className="flex gap-2 border-b border-hairline">
        {[
          { id: "posts" as const, label: "내 글" },
          { id: "applications" as const, label: "참가 요청" },
          { id: "blocks" as const, label: "차단 목록" },
          { id: "account" as const, label: "계정" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-body-md font-medium transition ${
              activeTab === tab.id
                ? "border-b-2 border-coral text-coral"
                : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 내 글 탭 */}
      {activeTab === "posts" && (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => router.push("/travel-tools")}
            className="flex h-12 w-fit items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral"
          >
            새 동행글 작성
          </button>

          {isLoadingPosts ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-md bg-surface-soft" />
              ))}
            </div>
          ) : myPosts.length === 0 ? (
            <div className="rounded-md border border-hairline bg-surface-soft px-6 py-12 text-center">
              <p className="text-title-md font-semibold text-ink">
                작성한 동행글이 없습니다.
              </p>
              <p className="mt-2 text-body-md text-muted">
                함께 여행할 동료를 찾으려면 동행글을 작성해보세요.
              </p>
              <button
                type="button"
                onClick={() => router.push("/travel-tools")}
                className="mt-4 inline-flex h-12 items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral"
              >
                동행글 작성하기
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {myPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-md border border-hairline p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-body-md font-semibold text-ink">
                        {post.title}
                      </h4>
                      <p className="mt-1 text-caption text-muted">
                        {post.region} · {post.start_date} ~ {post.end_date}
                      </p>
                      <span
                        className={`mt-2 inline-block rounded-full px-2.5 py-1 text-caption font-medium ${
                          post.status === "RECRUITING"
                            ? "bg-success text-on-coral"
                            : "bg-surface-strong text-muted"
                        }`}
                      >
                        {post.status === "RECRUITING" ? "모집중" : "마감"}
                      </span>
                    </div>
                  </div>

                  {post.status === "RECRUITING" && (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        disabled={processingId === post.id}
                        onClick={() => handleClosePost(post.id)}
                        className="flex flex-1 h-10 items-center justify-center rounded-sm border border-hairline px-3 text-button text-ink disabled:border-coral-disabled disabled:text-coral-disabled"
                      >
                        마감
                      </button>
                      <button
                        type="button"
                        disabled={processingId === post.id}
                        onClick={() => handleDeletePost(post.id)}
                        className="flex flex-1 h-10 items-center justify-center rounded-sm border border-error px-3 text-button text-error disabled:border-coral-disabled disabled:text-coral-disabled"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 참가 요청 탭 */}
      {activeTab === "applications" && (
        <div className="flex flex-col gap-4">
          {isLoadingApplications ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-md bg-surface-soft" />
              ))}
            </div>
          ) : myApplications.length === 0 ? (
            <div className="rounded-md border border-hairline bg-surface-soft px-6 py-12 text-center">
              <p className="text-title-md font-semibold text-ink">
                참가 요청이 없습니다.
              </p>
              <p className="mt-2 text-body-md text-muted">
                다른 사람의 동행글에 참가를 신청하면 여기에 표시됩니다.
              </p>
              <button
                type="button"
                onClick={() => router.push("/mates")}
                className="mt-4 inline-flex h-12 items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral"
              >
                동행 찾아보기
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {myApplications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-md border border-hairline p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-ink">
                      {app.post_id.slice(0, 8)}
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
                  <p className="whitespace-pre-wrap text-body-md text-body">
                    {app.message}
                  </p>

                  {app.status === "PENDING" && (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        disabled={processingId === app.id}
                        onClick={() => handleAcceptApplication(app.id)}
                        className="flex flex-1 h-10 items-center justify-center rounded-sm bg-success px-3 text-button text-on-coral disabled:bg-coral-disabled"
                      >
                        승인
                      </button>
                      <button
                        type="button"
                        disabled={processingId === app.id}
                        onClick={() => handleRejectApplication(app.id)}
                        className="flex flex-1 h-10 items-center justify-center rounded-sm border border-hairline px-3 text-button text-ink"
                      >
                        거절
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 차단 목록 탭 */}
      {activeTab === "blocks" && (
        <div className="flex flex-col gap-4">
          {isLoadingBlocks ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-md bg-surface-soft" />
              ))}
            </div>
          ) : myBlocks.length === 0 ? (
            <div className="rounded-md border border-hairline bg-surface-soft px-6 py-12 text-center">
              <p className="text-title-md font-semibold text-ink">
                차단한 사용자가 없습니다.
              </p>
              <p className="mt-2 text-body-md text-muted">
                문제가 있는 사용자는 여기서 차단할 수 있습니다.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {myBlocks.map((block) => (
                <div
                  key={block.id}
                  className="flex items-center justify-between rounded-md border border-hairline p-4"
                >
                  <span className="text-body-md text-ink">
                    {block.blocked_id.slice(0, 8)}
                  </span>
                  <button
                    type="button"
                    disabled={processingId === block.blocked_id}
                    onClick={() => handleUnblock(block.blocked_id)}
                    className="flex h-10 items-center justify-center rounded-sm border border-hairline px-3 text-button text-ink disabled:border-coral-disabled disabled:text-coral-disabled"
                  >
                    차단 해제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 계정 탭 */}
      {activeTab === "account" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-md border border-hairline p-6">
            <h4 className="text-title-md font-semibold text-ink">계정 관리</h4>
            <p className="mt-2 text-body-md text-muted">
              계정을 삭제하면 모든 데이터가 비식별화됩니다.
            </p>
            <button
              type="button"
              disabled={isDeletingAccount}
              onClick={handleDeleteAccount}
              className="mt-4 flex h-11 items-center justify-center rounded-sm border border-error px-6 text-button text-error disabled:border-coral-disabled disabled:text-coral-disabled"
            >
              {isDeletingAccount ? "처리 중..." : "계정 삭제"}
            </button>
          </div>
        </div>
      )}

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
