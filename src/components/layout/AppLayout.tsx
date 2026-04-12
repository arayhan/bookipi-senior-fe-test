import { Link, Outlet } from "react-router-dom";
import { LuBrainCircuit } from "react-icons/lu";

export const AppLayout = () => (
  <div className="min-h-screen flex flex-col">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-slate-900 font-semibold">
          <LuBrainCircuit className="text-brand-600" size={22} />
          <span>Quiz Maker</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-600">
          <Link to="/builder" className="hover:text-brand-700">Create</Link>
          <Link to="/play" className="hover:text-brand-700">Take</Link>
        </nav>
      </div>
    </header>
    <main className="flex-1">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </div>
    </main>
    <footer className="border-t border-slate-200 bg-white py-4">
      <div className="mx-auto max-w-5xl px-6 text-xs text-slate-500">
        Bookipi take-home — Quiz Maker
      </div>
    </footer>
  </div>
);
