import { useState, useRef, useEffect } from "react";

export default function SearchableSelect({ options, value, onChange, placeholder }) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const containerRef = useRef();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(handler);
  }, [search]);

  // Close dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options
  const filteredOptions = options
    .filter(o =>
      o.label.toLowerCase().trim().includes(debouncedSearch.toLowerCase().trim())
    )
    .slice(0, 50);

  const handleSelect = (option) => {
    onChange(option.label); // simpan nama kota saja
    setSearch(`${option.type} ${option.label}`); // tampilkan tipe di input
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex(prev => (prev + 1) % filteredOptions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(filteredOptions[highlightIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Reset highlight saat filteredOptions berubah
  useEffect(() => {
    setHighlightIndex(0);
  }, [debouncedSearch]);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={search || value || ""}
        onChange={e => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className="p-2 border rounded w-full"
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded max-h-48 overflow-auto mt-1">
          {filteredOptions.map((option, idx) => (
            <li
              key={option.label}
              className={`p-2 cursor-pointer ${idx === highlightIndex ? "bg-gray-300" : "hover:bg-gray-200"}`}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHighlightIndex(idx)}
            >
              {option.type} {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
