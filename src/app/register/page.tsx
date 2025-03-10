import RegisterForm from "@/components/register-form";
import AuthRedirect from "@/components/auth-redirect";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <AuthRedirect redirectTo="/" whenAuthenticated={true}>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">
            Create Account
          </h1>
          <RegisterForm />

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </AuthRedirect>
  );
}
