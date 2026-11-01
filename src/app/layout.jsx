import { ClerkProvider } from "@clerk/nextjs";
import AppProviders from "@/providers/AppProviders";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: { default: "Talaash — The search ends here", template: "%s | Talaash" },
  description: "Discover rental homes and connect with property owners on Talaash.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider signInUrl="/login/tenant" signUpUrl="/login/tenant">
          <AppProviders>{children}</AppProviders>
        </ClerkProvider>
      </body>
    </html>
  );
}

