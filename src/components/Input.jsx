export default function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`
        w-full p-3 rounded-xl border border-gray-200 bg-white
        focus:ring-2 focus:ring-blue-300 focus:border-blue-400
        outline-none transition shadow-sm
        ${className}
      `}
    />
  );
}
