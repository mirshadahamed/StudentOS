<<<<<<< HEAD
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StudentOS",
  description: "The operating system for students",
=======
import "./globals.css";

export const metadata = {
  title: "StudentOS",
  description: "StudentOS full-stack dashboard for productivity and finance",
>>>>>>> productivity-task
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
=======
      <body className="antialiased">
>>>>>>> productivity-task
        {children}
      </body>
    </html>
  );
}
<<<<<<< HEAD

=======
>>>>>>> productivity-task
