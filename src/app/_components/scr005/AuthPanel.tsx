"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/db/client-browser";
import type { User } from "@supabase/supabase-js";

type AuthMode = "signin" | "signup" | "reset";

interface ToastState {
  message: string;
  type: "success" | "error";
}

export function AuthPanel() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser ?? null);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("이메일과 비밀번호를 입력하세요.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = await createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("로그인되었습니다.", "success");
        setEmail("");
        setPassword("");
        router.refresh();
      }
    } catch {
      showToast("로그인 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("이메일과 비밀번호를 입력하세요.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = await createSupabaseBrowserClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("가입 링크를 이메일로 발송했습니다.", "success");
        setEmail("");
        setPassword("");
        setAuthMode("signin");
      }
    } catch {
      showToast("가입 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast("이메일을 입력하세요.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = await createSupabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/account`,
      });

      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("비밀번호 재설정 링크를 이메일로 발송했습니다.", "success");
        setEmail("");
        setAuthMode("signin");
      }
    } catch {
      showToast("요청 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setIsSubmitting(true);
    try {
      const supabase = await createSupabaseBrowserClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        showToast("로그아웃 중 오류가 발생했습니다.", "error");
      } else {
        showToast("로그아웃되었습니다.", "success");
        setUser(null);
        router.refresh();
      }
    } catch {
      showToast("로그아웃 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-soft border-t-coral" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-md border border-hairline p-6">
          <h3 className="text-title-md font-semibold">계정 정보</h3>
          <p className="mt-4 text-body-md text-ink">
            이메일: <span className="font-medium">{user.email}</span>
          </p>
          <p className="mt-2 text-body-md text-muted">
            {user.email_confirmed_at
              ? "이메일 인증됨"
              : "이메일 인증 대기 중"}
          </p>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSignOut}
            className="mt-6 flex h-11 items-center justify-center rounded-sm border border-error px-6 text-button text-error disabled:border-coral-disabled disabled:text-coral-disabled"
          >
            {isSubmitting ? "처리 중..." : "로그아웃"}
          </button>
        </div>

        {!user.email_confirmed_at && (
          <div className="rounded-md border border-warning bg-warning/10 px-4 py-3">
            <p className="text-body-md font-medium text-ink">
              이메일 인증이 필요합니다.
            </p>
            <p className="mt-1 text-caption text-body">
              받은 메일의 링크를 클릭해 이메일을 인증해주세요.
              동행 쓰기는 인증 후 가능합니다.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-md border border-hairline p-6">
        <h3 className="text-title-md font-semibold text-ink">
          {authMode === "signin"
            ? "로그인"
            : authMode === "signup"
              ? "가입하기"
              : "비밀번호 재설정"}
        </h3>

        <form
          onSubmit={
            authMode === "signin"
              ? handleSignIn
              : authMode === "signup"
                ? handleSignUp
                : handleResetPassword
          }
          className="mt-4 flex flex-col gap-3"
        >
          <label className="flex flex-col gap-1.5 text-body-md text-ink">
            이메일
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              placeholder="your@email.com"
              className="h-11 rounded-sm border border-hairline px-3 text-body-md disabled:bg-surface-soft"
            />
          </label>

          {authMode !== "reset" && (
            <label className="flex flex-col gap-1.5 text-body-md text-ink">
              비밀번호
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="••••••••"
                className="h-11 rounded-sm border border-hairline px-3 text-body-md disabled:bg-surface-soft"
              />
            </label>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex h-12 items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral disabled:bg-coral-disabled"
          >
            {isSubmitting
              ? "처리 중..."
              : authMode === "signin"
                ? "로그인"
                : authMode === "signup"
                  ? "가입하기"
                  : "재설정 링크 발송"}
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-2 border-t border-hairline pt-4 text-body-md">
          {authMode === "signin" && (
            <>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("reset");
                  setEmail("");
                  setPassword("");
                }}
                className="text-left text-coral hover:underline"
              >
                비밀번호를 잊으셨나요?
              </button>
              <p className="text-muted">
                계정이 없으신가요?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signup");
                    setEmail("");
                    setPassword("");
                  }}
                  className="text-coral hover:underline"
                >
                  가입하기
                </button>
              </p>
            </>
          )}
          {authMode === "signup" && (
            <p className="text-muted">
              이미 계정이 있으신가요?{" "}
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signin");
                  setEmail("");
                  setPassword("");
                }}
                className="text-coral hover:underline"
              >
                로그인
              </button>
            </p>
          )}
          {authMode === "reset" && (
            <button
              type="button"
              onClick={() => {
                setAuthMode("signin");
                setEmail("");
                setPassword("");
              }}
              className="text-left text-coral hover:underline"
            >
              로그인으로 돌아가기
            </button>
          )}
        </div>
      </div>

      <div className="rounded-md border border-hairline p-6">
        <h4 className="text-body-md font-semibold text-ink">
          로그인 후 가능한 기능
        </h4>
        <ul className="mt-3 space-y-2 text-body-md text-ink">
          <li className="flex gap-2">
            <span className="flex-shrink-0">✓</span>
            <span>동행글 작성 및 관리</span>
          </li>
          <li className="flex gap-2">
            <span className="flex-shrink-0">✓</span>
            <span>동행 신청 및 수락</span>
          </li>
          <li className="flex gap-2">
            <span className="flex-shrink-0">✓</span>
            <span>사용자 신고 및 차단</span>
          </li>
        </ul>
      </div>

      <div className="rounded-md border border-warning bg-warning/10 px-4 py-3">
        <p className="text-body-md font-medium text-ink">
          보안 안내
        </p>
        <p className="mt-1 text-caption text-body">
          개인정보는 절대 공유하지 마세요. 안전한 만남을 위해 항상 신원을 확인하세요.
        </p>
      </div>

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
