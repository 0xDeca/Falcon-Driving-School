import type { Metadata } from "next";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { AuthProvider } from "@/contexts/auth-context";
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
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
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
