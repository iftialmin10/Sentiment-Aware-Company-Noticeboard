import Providers from "./Providers";

export const metadata = { title: "Sentiment-Aware Company Noticeboard" };

export const viewport = { themeColor: "#6366f1" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
