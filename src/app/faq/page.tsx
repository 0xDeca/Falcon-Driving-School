import type { Metadata } from "next";
import { FAQClient } from "@/components/public/faq-client";

export const metadata: Metadata = {
  title: "FAQ - Falcon Driving School",
  description: "Frequently asked questions about Falcon Driving School's programs, enrollment, scheduling, payments, and certification.",
};

export default function FAQPage() {
  return <FAQClient />;
}
