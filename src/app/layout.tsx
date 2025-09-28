import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import SideNav from "@/components/SideNav";
import "./globals.css"; 
import { Toaster } from 'react-hot-toast'; 

// Configure the font
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  // We no longer need the 'variable' property for this approach
});

export const metadata: Metadata = {
  title: "TecDocs",
  description: "Create beautiful proposals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={spaceGrotesk.className}>
        <Toaster position="bottom-center" /> {/* Add the Toaster component */}
        <div className="flex h-screen">
          <div className="hidden md:flex md:w-64 md:flex-col md:inset-y-0">
            <SideNav />
          </div>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}