import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { Button, Card, InputField, SectionHeader, TableShell } from "../components/ui";

const STORAGE_KEY = "attendanceRecords";
const STATUS_OPTIONS = ["Present", "Absent"];

const sanitizeRecords = (items = []) =>
  items.filter(
    (rec) => rec && (rec.employeeId || rec.employee_id) && rec.date && rec.status,
  );

function loadStoredAttendance() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return sanitizeRecords(parsed).map((rec) => ({
      ...rec,
      employeeId: rec.employeeId || rec.employee_id,
    }));
  } catch (err) {
    console.warn("Failed to read attendance from storage", err);
    return [];
  }
}

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState(loadStoredAttendance);
  const [form, setForm] = useState({
    employeeId: "",
    date: "",
    status: "Present",
  });
  const [error, setError] = useState("");
  const [employeeError, setEmployeeError] = useState("");
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);

  // Fetch employees once
  useEffect(() => {
    const loadEmployees = async () => {
      setEmployeeLoading(true);
      setEmployeeError("");
      try {
        const res = await api.get("/employees/");
        const data = Array.isArray(res.data) ? res.data : res.data.employees || [];
        setEmployees(data.filter(Boolean));
      } catch (err) {
        console.error(err);
        setEmployees([]);
        setEmployeeError("Failed to load employees for attendance.");
      } finally {
        setEmployeeLoading(false);
      }
    };

    loadEmployees();
  }, []);

  // Persist attendance to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (err) {
      console.warn("Failed to persist attendance", err);
      setError("Unable to persist attendance locally. Please check storage availability.");
    }
  }, [records]);

  const employeeMap = useMemo(
    () =>
      employees.reduce((acc, emp) => {
        acc[emp.employee_id] = emp;
        return acc;
      }, {}),
    [employees],
  );

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (savingId) return;
    if (!form.employeeId || !form.date) {
      setError("Employee and date are required.");
      return;
    }

    const selectedEmployee = employeeMap[form.employeeId];
    if (!selectedEmployee) {
      setError("Select a valid employee.");
      return;
    }

    const optimisticId = `temp-${Date.now()}`;
    const optimisticRecord = {
      id: optimisticId,
      employeeId: form.employeeId,
      employeeName: selectedEmployee.full_name,
      date: form.date,
      status: form.status,
      optimistic: true,
    };

    setRecords((prev) => [optimisticRecord, ...prev]);
    setSavingId(optimisticId);
    setError("");

    try {
      const payload = {
        employee_id: form.employeeId,
        date: form.date,
        status: form.status,
      };
      const res = await api.post("/attendance", payload);

      setRecords((prev) =>
        prev.map((rec) =>
          rec.id === optimisticId
            ? {
                ...rec,
                id: res.data.id,
                employeeId: payload.employee_id,
                // keep existing name from optimistic entry
                status: res.data.status,
                optimistic: false,
              }
            : rec,
        ),
      );

      setForm((prev) => ({ ...prev, date: "", status: "Present" }));
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        (err.response?.status === 400
          ? "Attendance for this date already exists."
          : "Failed to save attendance");
      setError(message);
      setRecords((prev) => prev.filter((rec) => rec.id !== optimisticId));
    } finally {
      setSavingId(null);
    }
  };

  const updateStatus = (id, status) => {
    setRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status } : rec)),
    );
  };

  const sortedRecords = useMemo(
    () =>
      [...records].sort((a, b) => {
        if (a.date === b.date) return 0;
        return a.date > b.date ? -1 : 1;
      }),
    [records],
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Attendance"
        title="Mark daily status"
        subtitle="Record daily presence and keep a quick reference log."
      />

      <Card title="Add attendance">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-[1.2fr,1fr,0.8fr,auto] items-end"
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">Employee</label>
            <select
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.employeeId}
              onChange={(e) => handleChange("employeeId", e.target.value)}
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employee_id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>

          <InputField
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">Status</label>
            <div className="inline-flex rounded-md border border-slate-300 bg-slate-50 p-1">
              {STATUS_OPTIONS.map((option) => {
                const active = form.status === option;
                return (
                  <Button
                    key={option}
                    type="button"
                    variant="ghost"
                    className={`px-3 py-2 font-medium rounded-md ${
                      active ? "bg-blue-600 text-white shadow hover:text-white" : ""
                    }`}
                    onClick={() => handleChange("status", option)}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>
          </div>

          <Button
            type="submit"
            className="h-full px-4 py-2"
            disabled={!!savingId}
          >
            {savingId ? "Saving..." : "Add record"}
          </Button>
        </form>
      </Card>

      {(error || employeeError) && (
        <div className="rounded-md border border-amber-300 bg-amber-50 text-amber-800 px-4 py-3 text-sm">
          {error || employeeError}
        </div>
      )}

      <TableShell title="Recent attendance" count={records.length}>
        <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
          <tr>
            <th className="text-left px-4 py-3 font-semibold">Employee</th>
            <th className="text-left px-4 py-3 font-semibold">Date</th>
            <th className="text-left px-4 py-3 font-semibold">Status</th>
            <th className="text-left px-4 py-3 font-semibold">State</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {employeeLoading && (
            <tr>
              <td colSpan="4" className="px-4 py-6 text-center text-slate-500">
                Loading employees…
              </td>
            </tr>
          )}
          {!employeeLoading &&
            sortedRecords.map((rec) => (
            <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 align-top">
                <div className="font-semibold text-slate-900">{rec.employeeName || rec.employeeId}</div>
                <div className="text-xs text-slate-500">{rec.employeeId}</div>
              </td>
              <td className="px-4 py-3 align-top text-slate-800">{rec.date || "–"}</td>
              <td className="px-4 py-3 align-top">
                <select
                  value={rec.status}
                  onChange={(e) => updateStatus(rec.id, e.target.value)}
                  className="rounded-md border border-slate-300 px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 align-top">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    rec.optimistic ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {rec.optimistic ? "Pending" : "Saved"}
                </span>
              </td>
            </tr>
          ))}
          {!employeeLoading && sortedRecords.length === 0 && (
            <tr>
              <td colSpan="4" className="px-4 py-6 text-center text-slate-500">
                No attendance yet. Add the first record.
              </td>
            </tr>
          )}
        </tbody>
      </TableShell>
    </div>
  );
}
