import { representativeProfile } from "@/data/representative/profile";

export function Timeline() {
  const { timeline } = representativeProfile;
  const sorted = [...timeline].sort((a, b) => a.year - b.year);

  return (
    <section className="flex flex-col gap-6 rounded-md bg-surface-soft px-6 py-10 md:px-10">
      <div>
        <h2 className="text-display-md font-bold">여행 Timeline</h2>
        <p className="mt-1 text-body-lg text-body">
          연도별로 다녀온 여행과 그때 배운 것들이다.
        </p>
      </div>
      <ol className="flex flex-col gap-6 border-l border-hairline pl-6">
        {sorted.map((entry) => (
          <li key={`${entry.year}-${entry.place}`} className="relative">
            <span className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full bg-coral" />
            <p className="text-title-md font-semibold">
              {entry.year} · {entry.place}
            </p>
            <p className="mt-1 text-body-md text-body">{entry.summary}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
