import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="container mx-auto px-4 py-6 flex-grow">
                <Outlet />
            </main>
        </div>
    );
}
