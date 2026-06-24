import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Gallery - Falcon Driving School",
  description: "View photos of our training sessions, modern vehicles, graduates, and school activities.",
};

const galleryImages = [
  { src: "/images/gallery/training-1.jpg", alt: "Driving training session", category: "Training" },
  { src: "/images/gallery/training-2.jpg", alt: "Student behind the wheel", category: "Training" },
  { src: "/images/gallery/vehicle-1.jpg", alt: "Modern training vehicle", category: "Vehicles" },
  { src: "/images/gallery/vehicle-2.jpg", alt: "Fleet of training cars", category: "Vehicles" },
  { src: "/images/gallery/graduate-1.jpg", alt: "Graduate with certificate", category: "Graduates" },
  { src: "/images/gallery/graduate-2.jpg", alt: "Happy graduates", category: "Graduates" },
  { src: "/images/gallery/classroom-1.jpg", alt: "Classroom session", category: "Training" },
  { src: "/images/gallery/event-1.jpg", alt: "School event", category: "Events" },
  { src: "/images/gallery/training-3.jpg", alt: "Practical training", category: "Training" },
];

export default function GalleryPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary to-primary/95 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            A glimpse into life at Falcon Driving School
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image, i) => (
              <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <span className="text-sm">{image.alt}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-medium">{image.alt}</p>
                    <span className="text-gray-300 text-xs">{image.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
