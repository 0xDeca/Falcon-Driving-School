import { TESTIMONIALS_DATA } from "@/types";

export default function ReviewsPage() {
  return (
    <>
      <section className="bg-surface-dark text-white py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Reviews</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Real stories. Real licenses. What our students say after passing their test with Falcon.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {TESTIMONIALS_DATA.map((t) => (
              <div key={t.id} className="border border-border rounded-3xl p-6 space-y-4 bg-card">
                <p className="text-foreground leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="pt-2 border-t border-border">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-traffic-green">{t.course}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
