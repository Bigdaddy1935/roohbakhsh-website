export default function SignInPage() {
  return (
    <div className="w-full max-w-sm bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-xl font-extrabold text-[var(--ink)]">ورود به پنل مدیریت</h1>
        <p className="text-sm text-gray-400 mt-1">آکادمی روح‌بخش</p>
      </div>
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1.5">
          <label className="text-xs font-bold text-gray-500">ایمیل</label>
          <input
            type="email"
            className="h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-[var(--brand)] transition-colors"
            placeholder="admin@example.com"
          />
        </div>
        <div className="flex flex-col gap-y-1.5">
          <label className="text-xs font-bold text-gray-500">رمز عبور</label>
          <input
            type="password"
            className="h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-[var(--brand)] transition-colors"
            placeholder="••••••••"
          />
        </div>
        <button className="mt-2 w-full h-11 rounded-lg bg-[var(--brand)] text-white font-bold text-sm hover:opacity-90 transition-opacity">
          ورود
        </button>
      </div>
    </div>
  );
}
