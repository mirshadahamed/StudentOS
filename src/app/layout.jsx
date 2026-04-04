import "./globals.css";

export const metadata = {
  title: "StudentOS",
  description: "StudentOS full-stack dashboard for productivity and finance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
