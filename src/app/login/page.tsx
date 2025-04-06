import AuthRedirect from "@/components/auth-redirect";
import LoginForm from "@/components/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <AuthRedirect redirectTo="/" whenAuthenticated={true}>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
          <LoginForm />

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>
    </AuthRedirect>
  );
}
