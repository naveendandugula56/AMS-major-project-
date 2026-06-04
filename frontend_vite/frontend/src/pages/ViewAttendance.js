import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../utils/api";

const CLASSES = ["DnC Basic", "DnC Adv", "2nd Years"];

const ViewAttendance = () => {
  const [searchParams] = useSearchParams();
  const [selectedClass, setSelectedClass] = useState(searchParams.get("class") || "");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);
    setError("");
    setData(null);

    API.get(`/attendance/percentage/${encodeURIComponent(selectedClass)}`)
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load attendance data"))
      .finally(() => setLoading(false));
  }, [selectedClass]);

  const getColor = (pct) => {
    if (pct >= 75) return "good";
    if (pct >= 50) return "warn";
    return "bad";
  };

  return (
    <div className="page view-page">
      <div className="page-header">
        <h1>📊 Attendance Overview</h1>
        <p>View attendance percentage for each student</p>
      </div>

      <div className="class-tabs">
        {CLASSES.map((c) => (
          <button
            key={c}
            className={`class-tab ${selectedClass === c ? "active" : ""}`}
            onClick={() => setSelectedClass(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {error && <div className="alert error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      {data && (
        <>
          <div className="view-meta">
            <strong>{data.className}</strong>
            <span>Total Sessions: {data.totalSessions}</span>
          </div>

          {data.totalSessions === 0 ? (
            <div className="empty-state">
              <span>📭</span>
              <p>No attendance sessions recorded yet for {data.className}</p>
            </div>
          ) : (
            <div className="student-table">
              <div className="table-header">
                <span>#</span>
                <span>Student Name</span>
                <span>Present</span>
                <span>Absent</span>
                <span>Percentage</span>
              </div>
              {data.students.map((s, i) => (
                <div key={s.name} className={`table-row ${getColor(s.percentage)}`}>
                  <span className="row-num">{i + 1}</span>
                  <span className="row-name">{s.name}</span>
                  <span className="row-present">{s.present}</span>
                  <span className="row-absent">{s.absent}</span>
                  <span className="row-pct">
                    <div className="pct-bar-wrap">
                      <div
                        className={`pct-bar ${getColor(s.percentage)}`}
                        style={{ width: `${s.percentage}%` }}
                      />
                      <span className="pct-label">{s.percentage}%</span>
                    </div>
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="legend">
            <span className="legend-item good">■ ≥75% (Good)</span>
            <span className="legend-item warn">■ 50–74% (At Risk)</span>
            <span className="legend-item bad">■ &lt;50% (Critical)</span>
          </div>
        </>
      )}

      {!selectedClass && (
        <div className="empty-state">
          <span>👆</span>
          <p>Select a class to view attendance data</p>
        </div>
      )}
    </div>
  );
};

export default ViewAttendance;
