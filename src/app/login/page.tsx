import Link from "next/link";

export const metadata = { title: "登录 - AI 抽奖" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur">
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-br from-amber-200 via-purple-200 to-sky-200 bg-clip-text text-3xl font-bold text-transparent">
            🎰 AI 抽奖
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            充值抽余额，单抽保底有，十连必出 R 以上
          </p>
        </div>

        <a
          href="/api/auth/login"
          className="block w-full rounded-lg bg-gradient-to-r from-brand-600 to-purple-600 px-4 py-3 text-center font-semibold text-white shadow-lg transition hover:from-brand-500 hover:to-purple-500"
        >
          使用 OIDC 登录
        </a>

        <div className="mt-6 text-center text-xs text-slate-500">
          登录即代表同意{" "}
          <Link href="/rules" className="underline hover:text-slate-400">
            抽奖规则
          </Link>
        </div>
      </div>
    </main>
  );
}
