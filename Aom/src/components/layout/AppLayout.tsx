import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
