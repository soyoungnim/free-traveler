import Image from "next/image";
import { representativeProfile } from "@/data/representative/profile";

export function PhotoGallery() {
  const { gallery } = representativeProfile;

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="text-display-md font-bold">여행 사진</h2>
        <p className="mt-1 text-body-lg text-body">
          지금까지 다녀온 장소들의 순간을 모았다.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {gallery.map((photo) => (
          <div
            key={photo.url}
            className="relative aspect-square overflow-hidden rounded-md"
          >
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              loading="lazy"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
