import { Link } from "react-router-dom";

export default function AuthLayout({
  title,
  subtitle,
  children,
  bottomLink,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  bottomLink?: { text: string; to: string };
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-slate-200/40 dark:shadow-black/30 rounded-2xl p-6 sm:p-8 border border-slate-400 dark:border-slate-800">
          <div className="text-center space-y-1 mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {subtitle}
              </p>
            )}
          </div>
          {children}
          {bottomLink && (
            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
              {bottomLink.text.split("[")[0]}
              <Link
                to={bottomLink.to}
                className="ml-1 font-medium text-slate-900 dark:text-white underline underline-offset-4"
              >
                {bottomLink.text.split("]")[0].split("[")[1] ?? ""}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
