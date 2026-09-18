import type { Config } from "tailwindcss";

// Tailwind v4는 CSS-first(@theme)로 토큰을 정의한다. 이 프로젝트의 색상·타이포·
// spacing·radius·shadow 토큰 정본은 design-reference/D-001/DESIGN.md이며,
// 실제 등록 위치는 src/app/globals.css의 @theme 블록이다. 이 파일은 토큰을
// 재선언하지 않고 content 경로만 지정한다(v4에서는 자동 감지되므로 필수는
// 아니지만, Task 계약(Expected Files)에 따라 명시적으로 둔다).
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
};

export default config;
