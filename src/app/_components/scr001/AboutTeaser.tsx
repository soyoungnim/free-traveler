import Image from "next/image";
import Link from "next/link";
import { representativeProfile } from "@/data/representative/profile";

export function AboutTeaser() {
  const { displayName, tripsCount, countriesCount, intro, gallery } =
    representativeProfile;
  const heroImage = gallery[0];

  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <h2 className="text-display-md font-bold">{displayName} 소개</h2>
        <p className="text-body-lg text-body">{intro}</p>
        <div className="flex gap-3">
          <span className="rounded-full bg-surface-strong px-4 py-1 text-caption font-medium text-ink">
            {tripsCount} Trips
          </span>
          <span className="rounded-full bg-surface-strong px-4 py-1 text-caption font-medium text-ink">
            {countriesCount} Countries
          </span>
        </div>
        <Link
          href="/about"
          className="mt-2 flex h-12 w-fit items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral"
        >
          대표 이야기 더 보기
        </Link>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-md">
        <Image
          src={heroImage.url}
          alt={heroImage.alt}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
