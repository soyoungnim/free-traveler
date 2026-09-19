import Image from "next/image";
import { representativeProfile } from "@/data/representative/profile";

export function BioPhilosophy() {
  const { intro, philosophy, contentPrinciple, timeline, gallery } =
    representativeProfile;
  const origin = timeline[0];
  const photo = gallery[2];

  return (
    <section className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-5">
        <h2 className="text-display-md font-bold">소개와 여행 철학</h2>
        <p className="text-body-lg text-body">{intro}</p>
        <p className="text-body-lg text-body">
          {origin.year}년 {origin.place} 여행이 모든 것의 시작이었다.{" "}
          {origin.summary}
        </p>
        <p className="text-body-lg text-body">{philosophy}</p>
        <p className="text-body-lg text-body">{contentPrinciple}</p>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-md">
        <Image src={photo.url} alt={photo.alt} fill className="object-cover" />
      </div>
    </section>
  );
}
