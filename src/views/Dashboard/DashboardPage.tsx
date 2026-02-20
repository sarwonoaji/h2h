import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import { useState } from "react";
import { icons } from "./SidebarIcons";
import "./DashboardPage.css";

const menuItems = [
  {
    key: "masterHS",
    label: "Master HS",
    icon: icons.masterHS,
    path: "/dashboard/masterHS"
  },
  {
    key: "peb",
    label: "PEB",
    icon: icons.peb,
    path: "/dashboard/peb",
    children: [
      {
        key: "bc30",
        label: "BC 30",
        icon: icons.folder,
        path: "/dashboard/peb/bc30"
      },
    ]
  },
  {
    key: "tpb",
    label: "TPB",
    icon: icons.tpb,
    path: "/dashboard/tpb",
    children: [
      {
        key: "bc23",
        label: "BC 23",
        icon: icons.folder,
        path: "/dashboard/tpb/bc23"
      },
      {
        key: "bc25",
        label: "BC 25",
        icon: icons.folder,
        path: "/dashboard/tpb/bc25"
      },
      {
        key: "bc261",
        label: "BC 2.6.1",
        icon: icons.folder,
        path: "/dashboard/tpb/bc261"
      },
      {
        key: "bc262",
        label: "BC 2.6.2",
        icon: icons.folder,
        path: "/dashboard/tpb/bc262"
      },
      {
        key: "bc27out",
        label: "BC 2.7 Out",
        icon: icons.folder,
        path: "/dashboard/tpb/bc27out"
      },

    ]
  },
];

const DashboardPage = () => {
  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [minimized, setMinimized] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Decode username from JWT token
  let username = "User";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      username = payload.username || "User";
    } catch {}
  }

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleToggleSidebar = () => setMinimized((m) => !m);
  const handleSubMenu = (key: string) => {
    setOpenSubMenu((prev) => (prev === key ? null : key));
  };

  return (
    <div className={`dashboard-container${minimized ? " minimized" : ""}`}>
      <aside className={`sidebar${minimized ? " minimized" : ""}`}>
        <div className="sidebar-header">
          <h4
            className="sidebar-title"
            style={{ display: minimized ? "none" : undefined, cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
            title="Go to Dashboard"
          >
            H2H CEISA
            <p style={{fontSize: "12px", margin: "0px 0 0 0"}}>PT. Danliris</p>
          </h4>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.children && item.children.some((c) => location.pathname === c.path));
              return (
                <li key={item.key} className={`${!item.children ? "no-children" : ""} ${isActive ? "active" : ""}`}>
                  {item.children ? (
                    <>
                      <button
                        className="sidebar-menu-btn"
                        onClick={() => handleSubMenu(item.key)}
                        title={item.label}
                      >
                        <Icon />
                        {!minimized && <span>{item.label}</span>}
                        {!minimized && (
                          <span className="sidebar-dropdown-icon">
                            {openSubMenu === item.key ? "▾" : "▸"}
                          </span>
                        )}
                      </button>
                      {openSubMenu === item.key && !minimized && (
                        <ul className="sidebar-submenu">
                          {item.children.map((child) => {
                            const ChildIcon = child.icon;
                            return (
                              <li
                                key={child.key}
                                className={
                                  location.pathname === child.path ? "active" : ""
                                }
                              >
                                <Link to={child.path} title={child.label}>
                                  <ChildIcon />
                                  <span>{child.label}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link to={item.path} title={item.label}>
                      <Icon />
                      {!minimized && <span>{item.label}</span>}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <div className="navbar">
        <div className="navbar-content">
          <button
            className="navbar-minimize-btn"
            onClick={handleToggleSidebar}
            title={minimized ? "Expand sidebar" : "Minimize sidebar"}
          >
            <icons.expand />
          </button>
          <div className="navbar-username" onClick={() => setDropdownOpen((open) => !open)}>
            <span>{username}</span>
            <span className="navbar-dropdown-icon">▼</span>
          </div>
          {dropdownOpen && (
            <div className="navbar-dropdown">
              <button className="navbar-logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPage;