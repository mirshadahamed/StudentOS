import '../src/app/globals.css';

export const metadata = {
  title: 'StudentOS',
  description: 'The operating system for students',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
