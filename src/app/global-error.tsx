"use client";

// 이 파일은 Root Layout 자체가 렌더링에 실패했을 때 대신 나타난다.
// globals.css/D-001 토큰이 이미 깨진 상황을 가정해야 하므로, Tailwind
// 유틸리티가 아니라 인라인 스타일만으로 최소 복구 UI를 그린다.
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="ko">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "24px",
          textAlign: "center",
          fontFamily: "sans-serif",
          color: "#262626",
          background: "#ffffff",
        }}
      >
        <h1 style={{ fontSize: "20px", fontWeight: 700 }}>
          문제가 발생했습니다
        </h1>
        <p style={{ fontSize: "16px", color: "#4b4b4b" }}>
          페이지를 표시할 수 없습니다. 새로고침해 주세요.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            height: "48px",
            padding: "0 24px",
            borderRadius: "8px",
            border: "1px solid #262626",
            background: "#ffffff",
            color: "#262626",
            fontSize: "16px",
          }}
        >
          새로고침
        </button>
      </body>
    </html>
  );
}
