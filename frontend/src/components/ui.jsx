const baseButton =
  "inline-flex items-center justify-center rounded-md font-semibold text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition";

const variants = {
  primary:
    "bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:opacity-70 focus-visible:ring-blue-500",
  ghost:
    "text-slate-700 hover:text-slate-900 focus-visible:ring-slate-400",
  danger:
    "text-red-600 hover:text-red-700 focus-visible:ring-red-500",
  success:
    "text-green-600 hover:text-green-700 focus-visible:ring-green-500",
};

export function Button({ variant = "primary", className = "", ...props }) {
  return (
    <button
      className={`${baseButton} ${variants[variant] || ""} ${className}`}
      {...props}
    />
  );
}

export function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="space-y-1">
      {eyebrow && (
        <p className="text-sm font-semibold text-blue-700">{eyebrow}</p>
      )}
      {title && <h2 className="text-2xl font-bold text-slate-900">{title}</h2>}
      {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
    </header>
  );
}

export function Card({ title, right, children, className = "" }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-lg shadow-sm ${className}`}>
      {(title || right) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          {title && <h3 className="text-sm font-semibold text-slate-800">{title}</h3>}
          {right}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

export function TableShell({ title, count, children }) {
  return (
    <Card
      title={title}
      right={<p className="text-sm text-slate-600">{count} record(s)</p>}
      className="overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {children}
        </table>
      </div>
    </Card>
  );
}

export function InputField({
  label,
  id,
  type = "text",
  className = "",
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />
    </div>
  );
}
