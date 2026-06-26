import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Falcon Driving School - Learn to Drive with Confidence",
  description:
    "Nigeria's premier driving school offering professional driving lessons, defensive driving courses, and driver license assistance. Enroll today!",
  keywords:
    "driving school, driving lessons, Nigeria, automatic, manual, defensive driving, driver license",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "8px",
              background: "#1B2A4A",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
