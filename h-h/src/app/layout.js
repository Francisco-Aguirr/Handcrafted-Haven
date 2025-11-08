import "./globals.css";
export const metadata = {
  title: "Handcrafted Store",
  description: "Unic Handcrafted Products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
