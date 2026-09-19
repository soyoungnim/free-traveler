"use client";

import Link from "next/link";

type ErrorScreenCopy = {
  title: string;
  description: string;
  showRetry: boolean;
};

/**
 * 오류 원인은 error.message의 마커 접두사로만 구분한다(스택·원본 메시지는
 * 화면에 절대 노출하지 않는다 — Security/Privacy AC).
 */
function copyFor(error: Error): ErrorScreenCopy {
  if (error.message.startsWith("OUTBOUND_LINK_FAILED")) {
    return {
      title: "현재 외부 사이트에 연결할 수 없습니다",
      description:
        "항공·숙소 외부 사이트 연결에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      showRetry: true,
    };
  }
  if (error.message.startsWith("UNAUTHORIZED")) {
    return {
      title: "이 페이지에 접근할 권한이 없습니다",
      description: "로그인 상태나 권한을 확인한 뒤 다시 시도해 주세요.",
      showRetry: false,
    };
  }
  return {
    title: "일시적인 오류가 발생했습니다",
    description: "잠시 후 다시 시도하거나 홈으로 돌아가 주세요.",
    showRetry: true,
  };
}

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const copy = copyFor(error);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <h1 className="text-display-md font-bold">{copy.title}</h1>
      <p className="max-w-[448px] text-body-lg text-body">{copy.description}</p>
      <div className="flex gap-4">
        {copy.showRetry && (
          <button
            type="button"
            onClick={reset}
            className="flex h-12 items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral"
          >
            다시 시도
          </button>
        )}
        <Link
          href="/"
          className="flex h-12 items-center justify-center rounded-sm border border-hairline px-6 text-button text-ink"
        >
          홈으로 가기
        </Link>
      </div>
    </div>
  );
}
