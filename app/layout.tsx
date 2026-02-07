import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stellar Intent Protocol - AI-Powered DeFi on Stellar",
  description: "Convert natural language commands into blockchain transactions on Stellar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#030005] text-white antialiased">
      <body className={`${inter.className} relative min-h-screen overflow-x-hidden`}>
        {/* 0G-style Dotted Background */}
        <div 
          className="fixed inset-0 z-[-1] opacity-20" 
          style={{ 
            backgroundImage: `radial-gradient(#9200E1 0.5px, transparent 0.5px)`, 
            backgroundSize: '30px 30px' 
          }} 
        />
        
        {/* Ambient Glows */}
        <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#9200E1]/10 blur-[120px] rounded-full z-[-1]" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4d65ff]/10 blur-[120px] rounded-full z-[-1]" />
        
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
