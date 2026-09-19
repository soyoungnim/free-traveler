import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <h1 className="text-display-md font-bold">페이지를 찾을 수 없습니다</h1>
      <p className="max-w-[448px] text-body-lg text-body">
        주소가 잘못됐거나 더 이상 제공되지 않는 페이지입니다.
      </p>
      <Link
        href="/"
        className="flex h-12 items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral"
      >
        홈으로 가기
      </Link>
    </div>
  );
}
