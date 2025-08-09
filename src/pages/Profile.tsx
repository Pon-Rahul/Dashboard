

import React, { useEffect, useState } from "react";
import { fetchUsers } from "../utils/api";
import type { User } from "../types";
import { useNavigate } from "react-router-dom";
import "./Profile.css"

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const users = await fetchUsers();
        setUser(users[0]);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      {user && (
        <>
          <button className="profile-back-button" onClick={() => navigate("/dashboard")}>
            ← Welcome, {user?.name}
          </button>

          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {user.name.split(" ").map((part) => part[0]).join("")}
              </div>
              <div>
                <div className="profile-user-info">{user.name}</div>
                <div className="profile-user-email">{user.email}</div>
              </div>
            </div>

            <div className="profile-grid">
              <div>
                <div className="profile-label">User ID</div>
                <div className="profile-value">{user.id}</div>
              </div>
              <div>
                <div className="profile-label">Name</div>
                <div className="profile-value">{user.name}</div>
              </div>
              <div>
                <div className="profile-label">Email ID</div>
                <div className="profile-value">{user.email}</div>
              </div>
              <div>
                <div className="profile-label">Address</div>
                <div className="profile-value">
                  {`${user.address.street}, ${user.address.city}`}
                </div>
              </div>
              <div>
                <div className="profile-label">Phone</div>
                <div className="profile-value">{user.phone}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;