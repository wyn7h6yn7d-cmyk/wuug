export default function Page() {
  const todos = [
    { id: "t1", name: "This is a mock page (Supabase disabled)." },
    { id: "t2", name: "Use /manager and role switching in the TopBar." },
  ];

  return (
    <ul className="space-y-2 p-6">
      {todos.map((todo) => (
        <li key={todo.id} className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-800">
          {todo.name}
        </li>
      ))}
    </ul>
  );
}
