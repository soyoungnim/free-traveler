import Link from "next/link";
import { listMatePosts } from "@/lib/db/mates-read";
import { countrySafetyList } from "@/data/safety/countries";

function countryNameFor(code: string): string {
  if (code === "KR") return "국내";
  return (
    countrySafetyList.find((c) => c.countryCode === code)?.countryName ?? code
  );
}

function formatDateRange(startDate: string, endDate: string): string {
  const format = (iso: string) => iso.slice(5).replace("-", ".");
  return `${format(startDate)} ~ ${format(endDate)}`;
}

export async function RecentMatePosts() {
  const posts = (await listMatePosts({ status: "RECRUITING", limit: 3 })).slice(
    0,
    3,
  );

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-hairline px-6 py-12 text-center">
        <p className="text-body-lg text-body">
          아직 모집중인 동행글이 없습니다.
        </p>
        <p className="text-body-md text-muted">
          동행 찾기에서 여행 조건이 맞는 동행자를 직접 모집해 보세요.
        </p>
        <Link
          href="/travel-tools"
          className="mt-2 flex h-12 items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral"
        >
          동행 글 작성하기
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {posts.map((post) => (
        <li
          key={post.id}
          className="flex items-center justify-between rounded-md border border-hairline px-4 py-3"
        >
          <div className="flex flex-col gap-1">
            <p className="text-title-md font-semibold">{post.title}</p>
            <p className="text-body-md text-muted">
              {countryNameFor(post.country_code)} · {post.region} ·{" "}
              {formatDateRange(post.start_date, post.end_date)}
            </p>
          </div>
          <span className="rounded-full bg-surface-strong px-3 py-1 text-caption font-medium text-ink">
            모집중
          </span>
        </li>
      ))}
    </ul>
  );
}
