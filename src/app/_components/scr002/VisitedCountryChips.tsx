import { representativeProfile } from "@/data/representative/profile";

export function VisitedCountryChips() {
  const { visitedCountriesByRegion } = representativeProfile;
  const totalCount = visitedCountriesByRegion.reduce(
    (sum, group) => sum + group.countries.length,
    0,
  );

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="text-display-md font-bold">방문 국가</h2>
        <p className="mt-1 text-body-lg text-body">
          지금까지 {totalCount}개국을 직접 다녀왔다.
        </p>
      </div>
      <div className="flex flex-col gap-5">
        {visitedCountriesByRegion.map((group) => (
          <div key={group.region} className="flex flex-col gap-3">
            <h3 className="text-title-md font-semibold">{group.region}</h3>
            <div className="flex flex-wrap gap-2">
              {group.countries.map((country) => (
                <span
                  key={country}
                  className="rounded-full bg-surface-strong px-4 py-1.5 text-caption font-medium text-ink"
                >
                  {country}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
