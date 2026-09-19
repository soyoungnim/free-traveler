import { representativeProfile } from "@/data/representative/profile";

export function ProfileHeroStats() {
  const { displayName, tripsCount, countriesCount, regions, philosophy } =
    representativeProfile;

  const stats = [
    { label: "Trips", value: tripsCount, testId: "trip-count-stat" },
    { label: "Countries", value: countriesCount, testId: "country-count-stat" },
    { label: "Regions", value: String(regions.length), testId: "region-count-stat" },
  ];

  return (
    <section className="flex max-h-[420px] flex-col justify-center gap-6 bg-surface-soft px-4 py-12 md:px-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-display-lg font-bold text-ink">{displayName}</h1>
          <p className="text-body-lg text-body">{philosophy}</p>
        </div>
        <div
          className="grid grid-cols-3 gap-4"
          data-testid="profile-hero-stats"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              data-testid={stat.testId}
              className="flex flex-col items-center gap-1 rounded-md border border-hairline px-4 py-5 text-center"
            >
              <span className="text-display-md font-bold text-ink">
                {stat.value}
              </span>
              <span className="text-body-md text-muted">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
