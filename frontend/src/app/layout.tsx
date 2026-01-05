import "./globals.css";

export const metadata = {
  title: "Real Estate Advisor",
  description: "Check if a listing matches your requirements"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
