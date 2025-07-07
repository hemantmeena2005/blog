import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-white min-h-screen flex flex-col`} style={{ fontFamily: 'Inter, sans-serif' }}>
        <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg py-4">
          <nav className="container mx-auto px-4 flex justify-between items-center">
            <Link href="/" className="text-2xl sm:text-3xl font-bold tracking-tight">Truly IAS Blog</Link>
            <div className="space-x-2 sm:space-x-4">
              <Link href="/" className="py-2 px-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 text-sm sm:text-base">Home</Link>
              <Link href="/admin" className="py-2 px-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 text-sm sm:text-base">Admin Dashboard</Link>
              <Link href="/admin/create" className="py-2 px-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 text-sm sm:text-base">Create Post</Link>
            </div>
          </nav>
        </header>
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="bg-gray-800 text-white py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-sm">
            &copy; {new Date().getFullYear()} Truly IAS Blog. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
