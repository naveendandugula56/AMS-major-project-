import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";

const CLASSES = ["DnC Basic", "DnC Adv", "2nd Years"];

const MarkAttendance = () => {
  const { isLoggedIn, teacher } = useAuth();
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);
    setSuccess("");
    setError("");

    const fetchStudents = async () => {
      try {
        const res = await API.get(`/attendance/students/${encodeURIComponent(selectedClass)}`);
        const studs = res.data.students;
        setStudents(studs);
        // Initialize all as present
        const init = {};
        studs.forEach((s) => (init[s] = "present"));
        setAttendance(init);
      } catch (err) {
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    // Check if attendance already marked for this date+class
    const checkExisting = async () => {
      try {
        const res = await API.get(
          `/attendance/history/${encodeURIComponent(selectedClass)}/${selectedDate}`
        );
        if (res.data.records) {
          const existing = {};
          res.data.records.forEach(({ studentName, status }) => {
            existing[studentName] = status;
          });
          setAttendance(existing);
        }
      } catch {
        // No existing record, keep defaults
      }
    };

    fetchStudents().then(checkExisting);
  }, [selectedClass, selectedDate]);

  const toggle = (name) => {
    setAttendance((prev) => ({
      ...prev,
      [name]: prev[name] === "present" ? "absent" : "present",
    }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach((s) => (updated[s] = status));
    setAttendance(updated);
  };

  const handleSave = async () => {
    if (!selectedClass || !selectedDate) {
      setError("Please select class and date");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const records = students.map((name) => ({
        studentName: name,
        status: attendance[name] || "absent",
      }));
      await API.post("/attendance/mark", {
        date: selectedDate,
        className: selectedClass,
        records,
      });
      setSuccess("✅ Attendance saved successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(attendance).filter((v) => v === "present").length;
  const absentCount = Object.values(attendance).filter((v) => v === "absent").length;

  return (
    <div className="page mark-page">
      <div className="page-header">
        <h1>✅ Mark Attendance</h1>
        <p>Marking as <strong>{teacher?.name}</strong></p>
      </div>

      <div className="mark-controls">
        <div className="control-group">
          <label>Select Class</label>
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
        </div>

        <div className="control-group">
          <label>Select Date</label>
          <input
            type="date"
            value={selectedDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      {selectedClass && !loading && students.length > 0 && (
        <>
          <div className="attendance-stats">
            <div className="stat present-stat">
              <span className="stat-num">{presentCount}</span>
              <span>Present</span>
            </div>
            <div className="stat absent-stat">
              <span className="stat-num">{absentCount}</span>
              <span>Absent</span>
            </div>
            <div className="stat total-stat">
              <span className="stat-num">{students.length}</span>
              <span>Total</span>
            </div>
          </div>

          <div className="bulk-actions">
            <button className="btn-mark-all present" onClick={() => markAll("present")}>
              ✅ Mark All Present
            </button>
            <button className="btn-mark-all absent" onClick={() => markAll("absent")}>
              ❌ Mark All Absent
            </button>
          </div>

          <div className="student-list">
            {students.map((name, i) => (
              <div
                key={name}
                className={`student-row ${attendance[name] === "present" ? "present" : "absent"}`}
                onClick={() => toggle(name)}
              >
                <div className="student-info">
                  <span className="student-num">{i + 1}</span>
                  <span className="student-name">{name}</span>
                </div>
                <div className={`status-badge ${attendance[name]}`}>
                  {attendance[name] === "present" ? "✅ Present" : "❌ Absent"}
                </div>
              </div>
            ))}
          </div>

          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "💾 Save Attendance"}
          </button>
        </>
      )}

      {loading && <div className="loading">Loading students...</div>}

      {!selectedClass && (
        <div className="empty-state">
          <span>👆</span>
          <p>Select a class to start marking attendance</p>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
