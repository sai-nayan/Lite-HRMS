import { useEffect, useState } from "react";
import api from "../services/api";
import { Button, Card, InputField, SectionHeader, TableShell } from "../components/ui";

const blankForm = {
  employee_id: "",
  full_name: "",
  email: "",
  department: "",
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ full_name: "", department: "" });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get("/employees/");
      const data = Array.isArray(res.data) ? res.data : res.data.employees || [];
      setEmployees(data.filter(Boolean));
    } catch (err) {
      console.error(err);
      setEmployees([]);
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    try {
      await api.post("/employees/", form);
      setForm(blankForm);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.detail || "Error adding employee");
    }
  };

  const deleteEmployee = async (id) => {
    setError("");
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      setError("Failed to delete employee");
    }
  };

  const startEdit = (emp) => {
    setEditingId(emp.id);
    setEditForm({
      full_name: emp.full_name,
      department: emp.department,
    });
  };

  const saveInlineEdit = (id) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...editForm } : emp)),
    );
    setEditingId(null);
  };

  const formInput = (key, label, type = "text", placeholder) => (
    <InputField
      label={label}
      type={type}
      placeholder={placeholder}
      value={form[key]}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
    />
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Employees"
        title="Manage your team"
        subtitle="Keep your team roster up to date."
      />

      <Card title="Add employee">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-2"
        >
          {formInput("employee_id", "Employee ID", "text", "E.g., EMP-1001")}
          {formInput("full_name", "Full Name", "text", "Jane Doe")}
          {formInput("email", "Email", "email", "jane@company.com")}
          {formInput("department", "Department", "text", "Engineering")}

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" className="px-4 py-2">
              Add Employee
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <div className="rounded-md border border-amber-300 bg-amber-50 text-amber-800 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <TableShell title="Active employees" count={employees.length}>
        <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
          <tr>
            <th className="text-left px-4 py-3 font-semibold">Name</th>
            <th className="text-left px-4 py-3 font-semibold">Email</th>
            <th className="text-left px-4 py-3 font-semibold">Department</th>
            <th className="text-left px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {loading && (
            <tr>
              <td colSpan="4" className="px-4 py-6 text-center text-slate-500">
                Loading employees…
              </td>
            </tr>
          )}
          {!loading &&
            Array.isArray(employees) &&
            employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-top">
                  {editingId === emp.id ? (
                    <InputField
                      className="px-2 py-1"
                      value={editForm.full_name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, full_name: e.target.value })
                      }
                    />
                  ) : (
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-900">{emp.full_name}</div>
                      <div className="text-xs text-slate-500">{emp.employee_id}</div>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 align-top text-slate-800">{emp.email}</td>
                <td className="px-4 py-3 align-top">
                  {editingId === emp.id ? (
                    <InputField
                      className="px-2 py-1"
                      value={editForm.department}
                      onChange={(e) =>
                        setEditForm({ ...editForm, department: e.target.value })
                      }
                    />
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {emp.department}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 align-top space-x-3">
                  {editingId === emp.id ? (
                    <>
                      <Button
                        variant="success"
                        className="px-2 py-1"
                        type="button"
                        onClick={() => saveInlineEdit(emp.id)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        className="px-2 py-1"
                        type="button"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="px-2 py-1"
                        type="button"
                        onClick={() => startEdit(emp)}
                      >
                        Manual Edit
                      </Button>
                      <Button
                        variant="danger"
                        className="px-2 py-1"
                        type="button"
                        onClick={() => deleteEmployee(emp.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          {!loading && employees.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center px-4 py-6 text-slate-500">
                No employees found. Add your first team member above.
              </td>
            </tr>
          )}
        </tbody>
      </TableShell>
    </div>
  );
}
