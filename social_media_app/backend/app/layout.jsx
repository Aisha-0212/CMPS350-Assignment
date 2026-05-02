export const metadata = {
  title: "Social Media App",
  description: "CMPS350 Phase 2",
};
 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}