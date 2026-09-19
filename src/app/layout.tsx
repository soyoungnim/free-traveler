import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free Traveler",
  description:
    "어디로 갈지 정하고, 여행 조건을 정리하고, 안전정보와 동행을 한곳에서 확인하는 여행 준비 허브",
};

const NAV_LINKS = [
  { href: "/", label: "홈" },
  { href: "/about", label: "대표 소개" },
  { href: "/travel-tools", label: "여행 준비" },
  { href: "/mates", label: "동행 찾기" },
  { href: "/account", label: "계정" },
];

const FOOTER_SERVICE_LINKS = [
  { href: "/", label: "홈" },
  { href: "/travel-tools", label: "여행 준비" },
  { href: "/mates", label: "동행 찾기" },
  { href: "/about", label: "대표 소개" },
];

const FOOTER_POLICY_LINKS = [
  { href: "/terms", label: "이용약관" },
  { href: "/privacy", label: "개인정보 처리방침" },
  { href: "/safety-guide", label: "동행 안전수칙" },
  { href: "/disclaimer", label: "콘텐츠 면책 안내" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <input
          type="checkbox"
          id="mobile-nav-toggle"
          className="peer sr-only"
        />

        <header className="sticky top-0 z-40 h-16 border-b border-hairline bg-canvas md:h-20">
          <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-4 md:px-8">
            <Link href="/" className="font-sans text-title-md font-semibold">
              Free Traveler
            </Link>

            <nav
              aria-label="주요 메뉴"
              className="hidden items-center gap-8 text-body-md md:flex"
            >
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <label
              htmlFor="mobile-nav-toggle"
              aria-label="메뉴 열기"
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
            >
              <span className="block h-0.5 w-6 bg-ink" />
              <span className="block h-0.5 w-6 bg-ink" />
              <span className="block h-0.5 w-6 bg-ink" />
            </label>
          </div>
        </header>

        <nav
          aria-label="전체 메뉴"
          className="fixed inset-0 z-50 hidden flex-col bg-canvas p-8 peer-checked:flex md:hidden"
        >
          <label
            htmlFor="mobile-nav-toggle"
            aria-label="메뉴 닫기"
            className="mb-8 flex h-11 w-11 items-center justify-center self-end text-title-lg"
          >
            ×
          </label>
          <ul className="flex flex-col gap-6 text-title-md">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <label htmlFor="mobile-nav-toggle">
                  <Link href={link.href}>{link.label}</Link>
                </label>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex flex-1 flex-col">{children}</main>

        <footer className="border-t border-hairline bg-canvas px-4 py-8 md:px-20 md:py-12">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 text-body-md md:grid-cols-3">
            <div className="flex flex-col gap-3">
              <h2 className="text-title-md font-semibold">서비스</h2>
              {FOOTER_SERVICE_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="text-body">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-title-md font-semibold">정책</h2>
              {FOOTER_POLICY_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="text-body">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-title-md font-semibold">문의</h2>
              <Link href="/contact" className="text-body">
                고객 문의
              </Link>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-[1280px] text-caption text-muted">
            © Free Traveler. 안전정보는 외교부 해외안전여행 공식 발표를 우선
            확인하세요.
          </p>
        </footer>
      </body>
    </html>
  );
}
