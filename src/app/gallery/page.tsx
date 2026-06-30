import Image from "next/image";
import { galleryImages } from "@/data/gallery";

export default function GalleryPage() {
  return (
    <>
      <section className="bg-surface-dark text-white py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            A look inside Falcon. Real students, real vehicles, real roads. Tap any photo to view it larger.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((img, i) => (
              <div key={i} className="group relative overflow-hidden rounded-lg aspect-[4/3]">
                <Image
                  src={img.src}
                  alt={img.caption}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end focus-within:bg-black/40">
                  <p className="text-white text-sm p-4 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100" tabIndex={0}>
                    {img.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
