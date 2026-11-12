import AppProviders from "@/providers/AppProviders";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: { default: "Talaash — The search ends here", template: "%s | Talaash" },
  description: "Discover rental homes and connect with property owners on Talaash.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider signInUrl="/login/tenant" signUpUrl="/login/tenant" appearance={{ theme: shadcn, variables: { colorPrimary: "#244b3b", colorBackground: "#fcfbf7", colorForeground: "#26372e", colorMutedForeground: "#6d756d", borderRadius: "0.75rem", fontFamily: "Aptos, Segoe UI, Arial, sans-serif" } }}>
          <AppProviders>{children}</AppProviders>
        </ClerkProvider>
      </body>
    </html>
  );
}

