import type { Metadata } from "next";
import { ContactPageClient } from "@/components/public/contact-page-client";

export const metadata: Metadata = {
  title: "Contact Us - Falcon Driving School",
  description: "Get in touch with Falcon Driving School. Call, email, or visit our office in Abuja, Nigeria.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
