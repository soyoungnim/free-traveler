import { ProfileHeroStats } from "@/app/_components/scr002/ProfileHeroStats";
import { BioPhilosophy } from "@/app/_components/scr002/BioPhilosophy";
import { Timeline } from "@/app/_components/scr002/Timeline";
import { VisitedCountryChips } from "@/app/_components/scr002/VisitedCountryChips";
import { PhotoGallery } from "@/app/_components/scr002/PhotoGallery";
import { RecommendedDestinations } from "@/app/_components/scr002/RecommendedDestinations";

export default function AboutPage() {
  return (
    <>
      <ProfileHeroStats />

      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-16 px-4 py-16 md:px-20">
        <BioPhilosophy />
        <Timeline />
        <VisitedCountryChips />
        <PhotoGallery />
        <RecommendedDestinations />
      </div>
    </>
  );
}
