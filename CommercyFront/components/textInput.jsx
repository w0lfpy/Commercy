'use client';

export default function TextInput({ placeholder, value, onChange }) {
  return (
    <input
      className="w-full p-2 mt-4 rounded-md"
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}