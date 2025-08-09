import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../utils/api";
import type { User } from "../types";
import "./Header.css";

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const users = await fetchUsers();
        setUser(users[0]);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };

    loadUser();
  }, []);

  return (
    <header className="app-header">
      <div className="logo">Swift</div>
      <div className="profile" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
        <div className="profile-icon">
          {user ? user.name.split(" ").map((part) => part[0][0]).join("") : "?"}
        </div>
        <span className="profile-name">{user?.name || "Loading..."}</span>
      </div>
    </header>
  );
};

export default Header;
