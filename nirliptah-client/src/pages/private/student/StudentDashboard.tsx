import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const sidelinks = [
    { title: "Enrolled Courses", href: "/student/enrolled-courses" },
    { title: "Lessons", href: "/student/lessons" },
    { title: "Retreats", href: "/student/retreats" },
    { title: "Profile", href: "/student/profile" },
];

function Sidebar({
                     isCollapsed,
                     setIsCollapsed,
                 }: {
    isCollapsed: boolean;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <aside
            style={{
                width: isCollapsed ? "60px" : "200px",
                backgroundColor: "#f8f9fa",
                height: "100vh",
                transition: "width 0.3s",
                padding: "10px",
            }}
        >
            <button onClick={() => setIsCollapsed(!isCollapsed)} style={{ marginBottom: "20px" }}>
                {isCollapsed ? "▶" : "◀"}
            </button>
            <nav>
                {sidelinks.map((link) => (
                    <Link
                        key={link.title}
                        to={link.href}
                        style={{
                            display: "block",
                            padding: "10px 5px",
                            textDecoration: "none",
                            color: "#333",
                            marginBottom: "5px",
                            textAlign: isCollapsed ? "center" : "left",
                        }}
                    >
                        {link.title}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}

export default function StudentDashboard() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
            {/* Sidebar */}
            <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

            {/* Main Content */}
            <div style={{ flex: 1, padding: "20px" }}>
                <Link to="/student" style={{ textDecoration: "none", color: "inherit" }}>
                    <header
                        style={{
                            marginBottom: "20px",
                            borderBottom: "1px solid #ddd",
                            paddingBottom: "10px",
                            cursor: "pointer",
                        }}
                    >
                        <h1>Student Dashboard</h1>
                    </header>
                </Link>
                <div>
                    {/* Render nested routes */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
}