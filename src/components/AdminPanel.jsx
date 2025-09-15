// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPanel({ setIsAdminAuth }) {
  const navigate = useNavigate();

  // ------------------- Tabs -------------------
  const [tab, setTab] = useState("questions");

  // ------------------- Questions -------------------
  const [questions, setQuestions] = useState([]);
  const emptyQuestion = { q: "", options: ["", "", "", ""], correct: 0 };
  const [form, setForm] = useState(emptyQuestion);
  const [editingId, setEditingId] = useState(null);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/questions");
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addOrUpdateQuestion = async (e) => {
    e.preventDefault();
    if (!form.q.trim() || form.options.some((o) => !o.trim())) {
      alert("Please fill all fields.");
      return;
    }

    try {
      let res;
      if (editingId) {
        res = await fetch(`http://localhost:5000/api/questions/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch("http://localhost:5000/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      await res.json();
      setForm(emptyQuestion);
      setEditingId(null);
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await fetch(`http://localhost:5000/api/questions/${id}`, { method: "DELETE" });
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------- Scorecards -------------------
  const [scorecards, setScorecards] = useState([]);
  const fetchScorecards = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/participants");
      const data = await res.json();
      setScorecards(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteScorecard = async (id) => {
    if (!window.confirm("Delete this scorecard?")) return;
    try {
      await fetch(`http://localhost:5000/api/score/${id}`, { method: "DELETE" });
      fetchScorecards();
    } catch (err) {
      console.error(err);
      alert("Error deleting scorecard. See console for details.");
    }
  };

  // ------------------- Permissions -------------------
  const [permissions, setPermissions] = useState([]);
  const fetchPermissions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/permissions");
      const data = await res.json();
      setPermissions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const togglePermission = async (email, remaining) => {
    try {
      await fetch(`http://localhost:5000/api/permission/${email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remaining: remaining > 0 ? 0 : 1 }),
      });
      fetchPermissions();
    } catch (err) {
      console.error(err);
    }
  };

  const deletePermission = async (email) => {
    if (!window.confirm("Delete this permission?")) return;
    try {
      await fetch(`http://localhost:5000/api/permission/${email}`, { method: "DELETE" });
      fetchPermissions();
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------- PDF Submissions -------------------
  const [submissions, setSubmissions] = useState([]);
  const [loadingPDFs, setLoadingPDFs] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("http://localhost:5000/submissions");
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPDFs(false);
    }
  };

  const handleDeletePDF = async (id) => {
    if (!window.confirm("Delete this PDF submission?")) return;
    try {
      await fetch(`http://localhost:5000/submissions/${id}`, { method: "DELETE" });
      fetchSubmissions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRatePDF = async (id, rating) => {
    try {
      await fetch(`http://localhost:5000/submissions/${id}/rate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: Number(rating) }),
      });
      fetchSubmissions();
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------- Logout -------------------
  const logout = () => {
    setIsAdminAuth(false);
    navigate("/");
  };

  // ------------------- Fetch all data on mount -------------------
  useEffect(() => {
    fetchQuestions();
    fetchScorecards();
    fetchPermissions();
    fetchSubmissions();
  }, []);

  // ------------------- Render -------------------
  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-900 text-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <button onClick={logout} className="px-3 py-1 bg-red-600 rounded">Logout</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {["questions", "scorecards", "permissions", "pdfs"].map((t) => (
          <button
            key={t}
            className={`px-3 py-1 rounded ${tab === t ? "bg-emerald-600" : "bg-slate-800"}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Questions Tab */}
      {tab === "questions" && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Manage Questions</h3>
          <form className="space-y-3 mb-4" onSubmit={addOrUpdateQuestion}>
            <input
              type="text"
              placeholder="Question"
              className="w-full p-2 text-black rounded"
              value={form.q}
              onChange={(e) => setForm({ ...form, q: e.target.value })}
              required
            />
            {form.options.map((opt, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 p-2 text-black rounded"
                  value={opt}
                  onChange={(e) => {
                    const copy = [...form.options];
                    copy[i] = e.target.value;
                    setForm({ ...form, options: copy });
                  }}
                  required
                />
                <input
                  type="radio"
                  name="correct"
                  checked={form.correct === i}
                  onChange={() => setForm({ ...form, correct: i })}
                />
                <span>Correct</span>
              </div>
            ))}
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 px-4 py-1 rounded">
                {editingId ? "Update Question" : "Add Question"}
              </button>
              <button
                type="button"
                onClick={() => { setForm(emptyQuestion); setEditingId(null); }}
                className="bg-slate-700 px-4 py-1 rounded"
              >
                Reset
              </button>
            </div>
          </form>

          <ul className="space-y-2">
            {questions.map((q) => (
              <li key={q._id} className="p-2 bg-slate-800 rounded flex justify-between">
                <div>
                  <p className="font-bold">{q.q}</p>
                  <ul className="ml-4 list-disc">
                    {q.options.map((opt, i) => (
                      <li key={i} className={q.correct === i ? "text-green-400" : ""}>{opt}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setForm(q); setEditingId(q._id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="bg-blue-500 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteQuestion(q._id)}
                    className="bg-red-500 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Scorecards Tab */}
      {tab === "scorecards" && (
        <div>
          <h3 className="text-xl font-semibold mb-2">User Scorecards</h3>
          {scorecards.length === 0 ? <p>No scorecards yet.</p> : (
            <table className="min-w-full border border-gray-300 text-black">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Phone</th>
                  <th className="border px-4 py-2">Score</th>
                  <th className="border px-4 py-2">Total</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {scorecards.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{s.name}</td>
                    <td className="border px-4 py-2">{s.email}</td>
                    <td className="border px-4 py-2">{s.phone}</td>
                    <td className="border px-4 py-2">{s.score}</td>
                    <td className="border px-4 py-2">{s.total}</td>
                    <td className="border px-4 py-2">{new Date(s.date).toLocaleString()}</td>
                    <td className="border px-4 py-2">
                      <button onClick={() => deleteScorecard(s._id)} className="bg-red-500 px-3 py-1 rounded text-white">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Permissions Tab */}
      {tab === "permissions" && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Permissions</h3>
          {permissions.length === 0 ? <p>No permissions yet.</p> : (
            <ul className="space-y-2">
              {permissions.map((p) => (
                <li key={p.email} className="p-2 bg-slate-800 rounded flex justify-between items-center">
                  <div>
                    <div className="font-medium">{p.email}</div>
                    <div className="text-sm">{p.remaining > 0 ? "Allowed" : "Not allowed"}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => togglePermission(p.email, p.remaining)} className="bg-emerald-500 px-3 py-1 rounded">Toggle</button>
                    <button onClick={() => deletePermission(p.email)} className="bg-red-500 px-3 py-1 rounded">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* PDFs Tab */}
      {tab === "pdfs" && (
        <div>
          <h3 className="text-xl font-semibold mb-4">PDF Submissions ({submissions.length})</h3>
          {loadingPDFs ? <p>Loading PDFs...</p> : submissions.length === 0 ? <p>No PDFs yet.</p> : (
            <table className="min-w-full border border-gray-300 text-black">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Phone</th>
                  <th className="border px-4 py-2">PDF</th>
                  <th className="border px-4 py-2">Submitted At</th>
                  <th className="border px-4 py-2">Rating</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{sub.name}</td>
                    <td className="border px-4 py-2">{sub.email}</td>
                    <td className="border px-4 py-2">{sub.phone}</td>
                    <td className="border px-4 py-2 text-center">
                      <a href={`data:application/pdf;base64,${sub.pdf}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mr-2">View</a>
                      <a href={`data:application/pdf;base64,${sub.pdf}`} download={`${sub.name}_submission.pdf`} className="text-green-600 underline">Download</a>
                    </td>
                    <td className="border px-4 py-2">{sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : "-"}</td>
                    <td className="border px-4 py-2 text-center">
                      <select value={sub.rating || ""} onChange={(e) => handleRatePDF(sub._id, e.target.value)} className="p-1 rounded">
                        <option value="">Rate</option>
                        {Array.from({ length: 10 }, (_, i) => <option key={i+1} value={i+1}>⭐ {i+1}</option>)}
                      </select>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button onClick={() => handleDeletePDF(sub._id)} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

    </div>
  );
}
