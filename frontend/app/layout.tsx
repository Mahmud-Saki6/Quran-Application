import type { Metadata } from "next";
import { Suspense } from "react";

import Header from "@/app/components/Header";
import SettingsSidebar from "@/app/components/SettingsSidebar";
import { SettingsProvider } from "@/context/SettingsContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { PREHYDRATION_SCRIPT } from "@/lib/prehydration";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "SurahFlow - The Holy Quran",
    template: "%s | SurahFlow",
  },
  description: "Read, reflect, and search across the Holy Quran",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <head>
        <script
          id="theme-init"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: PREHYDRATION_SCRIPT }}
        />
      </head>
      <body className="relative overflow-x-hidden" suppressHydrationWarning>
        <ThemeProvider>
          <SettingsProvider>
            <Suspense fallback={<div className="h-28" />}>
              <Header />
            </Suspense>
            <SettingsSidebar />
            <main
              className="relative z-[1]"
              style={{
                maxWidth: "1400px",
                margin: "0 auto",
                padding: "80px 24px 40px",
              }}
            >
              {children}
            </main>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
