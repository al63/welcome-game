export function Tooltip({ text }: { text: string }) {
  return (
    <span
      className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute
-bottom-10 opacity-0 m-4"
    >
      {text}
    </span>
  );
}
