import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Kae Thesis Radar",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Kae Thesis Radar</h1>
          <p className="mt-2 text-slate-600">Investment research operating system</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
          <form className="space-y-6" method="POST" action="/api/auth/login">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-900">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Continue with Email
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-slate-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Google
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-slate-600">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Status
          </a>
          {" • "}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Docs
          </a>
        </p>
      </div>
    </div>
  );
}
