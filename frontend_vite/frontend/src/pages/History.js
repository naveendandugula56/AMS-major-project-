import React, { useState, useEffect } from "react";
import API from "../utils/api";

const CLASSES = ["DnC Basic", "DnC Adv", "2nd Years"];

const History = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [history, setHistory] = useState(null);
  const [dateRecord, setDateRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateLoading, setDateLoading] = useState(false);
  const [error, setError] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);
    setError("");
    setHistory(null);
    setDateRecord(null);
    setSelectedDate("");

    API.get(`/attendance/history/${encodeURIComponent(selectedClass)}`)
      .then((res) => setHistory(res.data))
      .catch(() => setError("Failed to load history"))
      .finally(() => setLoading(false));
  }, [selectedClass]);

  const fetchDateRecord = () => {
    if (!selectedClass || !selectedDate) return;
    setDateLoading(true);
    setDateError("");
    setDateRecord(null);

    API.get(`/attendance/history/${encodeURIComponent(selectedClass)}/${selectedDate}`)
      .then((res) => setDateRecord(res.data))
      .catch((err) => {
        if (err.response?.status === 404) {
          setDateError("No attendance recorded for this date.");
        } else {
          setDateError("Failed to load record.");
        }
      })
      .finally(() => setDateLoading(false));
  };

  return (
    <div className="page history-page">
      <div className="page-header">
        <h1>📅 Attendance History</h1>
        <p>Browse past attendance sessions by class and date</p>
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

      {selectedClass && (
        <div className="date-search-bar">
          <label>Search by Date</label>
          <div className="date-search-row">
            <input
              type="date"
              value={selectedDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
            />
            <button className="btn-search" onClick={fetchDateRecord} disabled={!selectedDate}>
              🔍 View
            </button>
          </div>
        </div>
      )}

      {dateError && <div className="alert error">{dateError}</div>}

      {dateRecord && (
        <div className="date-record-card">
          <div className="date-record-header">
            <h3>📋 {dateRecord.className} — {dateRecord.date}</h3>
            <span className="marked-by">Marked by: {dateRecord.markedBy}</span>
          </div>
          <div className="date-record-grid">
            {dateRecord.records.map((r, i) => (
              <div key={r.studentName} className={`record-chip ${r.status}`}>
                <span className="chip-num">{i + 1}</span>
                <span className="chip-name">{r.studentName}</span>
                <span className="chip-status">
                  {r.status === "present" ? "✅" : "❌"}
                </span>
              </div>
            ))}
          </div>
          <div className="record-summary">
            <span className="sum-present">
              Present: {dateRecord.records.filter((r) => r.status === "present").length}
            </span>
            <span className="sum-absent">
              Absent: {dateRecord.records.filter((r) => r.status === "absent").length}
            </span>
          </div>
        </div>
      )}

      {error && <div className="alert error">{error}</div>}
      {loading && <div className="loading">Loading history...</div>}

      {history && (
        <>
          <div className="view-meta">
            <strong>{history.className}</strong>
            <span>Total Sessions: {history.totalSessions}</span>
          </div>

          {history.totalSessions === 0 ? (
            <div className="empty-state">
              <span>📭</span>
              <p>No sessions recorded yet for {history.className}</p>
            </div>
          ) : (
            <div className="history-list">
              {history.records.map((rec) => {
                const presentCount = rec.records.filter((r) => r.status === "present").length;
                const total = rec.records.length;
                const pct = Math.round((presentCount / total) * 100);
                return (
                  <div
                    key={rec._id}
                    className="history-card"
                    onClick={() => {
                      setSelectedDate(rec.date);
                      setDateRecord(rec);
                      setDateError("");
                    }}
                  >
                    <div className="history-card-left">
                      <span className="history-date">📅 {rec.date}</span>
                      <span className="history-by">by {rec.markedBy}</span>
                    </div>
                    <div className="history-card-right">
                      <span className="history-present">{presentCount}/{total} present</span>
                      <div className="mini-bar-wrap">
                        <div
                          className={`mini-bar ${pct >= 75 ? "good" : pct >= 50 ? "warn" : "bad"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="history-pct">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {!selectedClass && (
        <div className="empty-state">
          <span>👆</span>
          <p>Select a class to view attendance history</p>
        </div>
      )}
    </div>
  );
};

export default History;
