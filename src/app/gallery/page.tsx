import Image from "next/image";

const images = [
  { src: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80", caption: "One-on-one coaching", w: 600, h: 450 },
  { src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80", caption: "Steering fundamentals", w: 600, h: 450 },
  { src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80", caption: "Our training fleet", w: 600, h: 450 },
  { src: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=600&q=80", caption: "Highway code theory", w: 600, h: 450 },
  { src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80", caption: "Virtual simulator practice", w: 600, h: 450 },
  { src: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80", caption: "Highway confidence drills", w: 600, h: 450 },
  { src: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=600&q=80", caption: "License day", w: 600, h: 450 },
  { src: "https://images.unsplash.com/photo-1532751203793-812308a10d8e?auto=format&fit=crop&w=600&q=80", caption: "Branded training fleet", w: 600, h: 450 },
  { src: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80", caption: "Pre-drive checks", w: 600, h: 450 },
  { src: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80", caption: "Parking mastery", w: 600, h: 450 },
  { src: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80", caption: "Friendly certified instructors", w: 600, h: 450 },
  { src: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80", caption: "City road sessions", w: 600, h: 450 },
];

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
            {images.map((img, i) => (
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
