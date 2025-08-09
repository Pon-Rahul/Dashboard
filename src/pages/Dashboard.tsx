import React, { useEffect, useState } from "react";
import { fetchComments } from "../utils/api";
import type { Comment, SortConfig } from "../types";
import { getFromStorage, saveToStorage } from "../utils/localStorageHelpers";
import "./Dashboard.css";

const PAGE_SIZE_OPTIONS = [10, 50, 100];

const Dashboard: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(() =>
    getFromStorage("searchQuery", "")
  );
  const [page, setPage] = useState(() => getFromStorage("page", 1));
  const [pageSize, setPageSize] = useState(() =>
    getFromStorage("pageSize", 10)
  );
  const [sortConfig, setSortConfig] = useState<SortConfig>(() =>
    getFromStorage("sortConfig", { key: null, order: null })
  );

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments();
        setComments(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, []);

  useEffect(() => {
    saveToStorage("searchQuery", searchQuery);
    saveToStorage("page", page);
    saveToStorage("pageSize", pageSize);
    saveToStorage("sortConfig", sortConfig);
  }, [searchQuery, page, pageSize, sortConfig]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleSort = (key: keyof Comment) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, order: "asc" };
      if (prev.order === "asc") return { key, order: "desc" };
      if (prev.order === "desc") return { key: null, order: null };
      return { key, order: "asc" };
    });
  };

  const filteredData = comments.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.body.toLowerCase().includes(q)
    );
  });

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !sortConfig.order) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortConfig.order === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.order === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="button-box">
          <button onClick={() => handleSort("postId")}>Sort Post ID</button>
          <button onClick={() => handleSort("name")}>Sort Name</button>
          <button onClick={() => handleSort("email")}>Sort Email</button>
        </div>
        <div className="dashboard-search">
          <input
            type="text"
            placeholder="Search name, email, comment"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="comments-table">
            <thead>
              <tr>
                <th>Post ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((comment) => (
                <tr key={comment.id}>
                  <td>{String(comment.postId).padStart(8, "0")}</td>
                  <td>{comment.name}</td>
                  <td>{comment.email}</td>
                  <td>
                    {comment.body.length > 40
                      ? comment.body.slice(0, 40) + "..."
                      : comment.body}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-container">
            <div className="pagination-left">
              {`${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, filteredData.length)} of ${filteredData.length} items`}
            </div>
            <div className="pagination-buttons">
              <div
                className={`pagination-arrow ${page === 1 ? "disabled" : ""}`}
                onClick={() => page > 1 && setPage(page - 1)}
              >
                &lt;
              </div>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (p === 1 || p === totalPages) return true;
                  if (p >= page - 1 && p <= page + 1) return true;
                  return false;
                })
                .reduce<number[]>((acc, curr, idx, arr) => {
                  if (idx > 0 && curr - arr[idx - 1] > 1) acc.push(-1); // ellipsis
                  acc.push(curr);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === -1 ? (
                    <span key={`ellipsis-${i}`} className="pagination-ellipsis">
                      ...
                    </span>
                  ) : (
                    <div
                      key={p}
                      onClick={() => setPage(p)}
                      className={`pagination-page ${page === p ? "active-page" : ""}`}
                    >
                      {p}
                    </div>
                  )
                )}
              <div
                className={`pagination-arrow ${page === totalPages ? "disabled" : ""}`}
                onClick={() => page < totalPages && setPage(page + 1)}
              >
                &gt;
              </div>
            </div>
            <div className="pagination-right">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size} / Page
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
