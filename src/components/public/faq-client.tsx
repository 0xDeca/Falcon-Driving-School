"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_DATA } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FAQClient() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary to-primary/95 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Find answers to common questions about our programs and services
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ_DATA.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center space-y-4 bg-gray-50 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-primary">Still Have Questions?</h3>
            <p className="text-gray-600">
              Contact us and we&apos;ll be happy to help.
            </p>
            <Link href="/contact">
              <Button variant="gold" size="lg">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
