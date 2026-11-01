"use client";


import { Show,SignIn,SignUp,useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect,useMemo,useState } from "react";

const roleRedirects = {
  tenant: "/",
  landlord: "/dashboard/landlord",
  admin: "/dashboard/admin",
};

const Login = ({ role }: { role: import("@/types/domain").Role }) => {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [mode, setMode] = useState("signup");

  const redirectUrl = roleRedirects[role];
  const unsafeMetadata = useMemo(() => ({ role }), [role]);

  useEffect(() => {
    if (isSignedIn) router.replace(redirectUrl);
  }, [isSignedIn, redirectUrl, router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative px-4 py-10"
      style={{
        backgroundImage: "url(/images/logo.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/45" />

      <Show when="signed-out">
        <div className="relative w-full max-w-md flex flex-col items-center gap-4">
          <div className="flex w-full rounded-lg bg-white p-1 shadow">
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition ${
                mode === "signup"
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition ${
                mode === "signin"
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Sign in
            </button>
          </div>

          {mode === "signup" ? (
            <SignUp
              routing="hash"
              unsafeMetadata={unsafeMetadata}
              forceRedirectUrl={redirectUrl}
              signInUrl={`/login/${role}`}
              signInForceRedirectUrl={redirectUrl}
            />
          ) : (
            <SignIn
              routing="hash"
              forceRedirectUrl={redirectUrl}
              signUpUrl={`/login/${role}`}
              signUpForceRedirectUrl={redirectUrl}
            />
          )}
        </div>
      </Show>
    </div>
  );
};

export default Login;
