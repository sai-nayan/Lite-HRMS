import { useEffect, useState } from "react";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";

const TABS = [
  { id: "employees", label: "Employees" },
  { id: "attendance", label: "Attendance" },
];

function App() {
  // Read active tab once, synchronously
  const getInitialTab = () => localStorage.getItem("activeTab") || "employees";

  const [page, setPage] = useState(getInitialTab);

  // Persist tab changes
  useEffect(() => {
    localStorage.setItem("activeTab", page);
  }, [page]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
              Lite HRMS
            </p>
            <h1 className="text-xl font-bold text-slate-900">Team Console</h1>
          </div>
          <nav className="flex gap-2" aria-label="Primary">
            {TABS.map((tab) => {
              const isActive = page === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setPage(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:ring-offset-white ${
                    isActive
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-600 hover:text-slate-800 bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {page === "employees" && <Employees />}
        {page === "attendance" && <Attendance />}
      </main>
    </div>
  );
}

export default App;
