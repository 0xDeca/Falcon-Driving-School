import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, Car, Gamepad2, Users, Shield, CheckCircle } from "lucide-react";

export default function AboutPage() {
  const features = [
    { icon: Clock, title: "Flexible scheduling", desc: "Mornings, evenings, weekends. We fit your life." },
    { icon: Car, title: "Modern vehicles", desc: "Clean, comfortable, dual-control training cars." },
    { icon: Gamepad2, title: "Simulation training", desc: "Realistic virtual driving before the real road." },
    { icon: Users, title: "Certified instructors", desc: "Patient, experienced, accredited professionals." },
  ];

  return (
    <>
      <section className="bg-surface-dark text-white py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Falcon</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Driving school, reimagined for modern Abuja.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-lg text-gray-700 leading-relaxed">
              We started Falcon because too many Nigerians learn to drive in stress — bad cars, rude instructors, no real plan. We do the opposite: structured lessons, modern vehicles, simulator practice and instructors who actually want you to succeed.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="rounded-xl overflow-hidden relative h-80">
              <Image
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
                alt="Virtual driving simulator"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
          <h2 className="text-2xl font-bold">Virtual simulation training</h2>
          <p className="text-muted-foreground">
            Our virtual simulators let you practice highway driving, night driving, hazard response and tricky junctions &mdash; all without ever leaving the classroom. By the time you&rsquo;re on the road, you&rsquo;ve already seen it.
              </p>
              <ul className="space-y-3">
                {["Practice high-risk scenarios safely", "Build muscle memory faster", "Reduce nerves before the first real lesson"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle className="h-5 w-5 text-traffic-green shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-10">Why people choose Falcon.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="text-center p-6 space-y-3">
                  <div className="flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-traffic-green/10">
                      <Icon className="h-6 w-6 text-traffic-green" />
                    </div>
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-surface-dark text-white rounded-xl p-12 text-center">
            <Shield className="h-10 w-10 text-traffic-green mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Safety isn&rsquo;t a feature. It&rsquo;s the whole point.</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every lesson is taught with dual-control vehicles, structured curriculum and defensive-driving principles built in. We don&rsquo;t just teach you to pass &mdash; we teach you to drive well, for life.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
