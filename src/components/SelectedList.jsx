import React, { useEffect, useState } from "react";

export default function SelectedList() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch("https://hackcfdb.onrender.com/submissions");
        const data = await res.json();
        setSubmissions(data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-slate-900 text-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-emerald-300 mb-4">📋 Selection Results</h2>

      {loading ? (
        <p>Loading submissions...</p>
      ) : submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <table className="w-full border border-slate-700 text-left">
          <thead className="bg-slate-800">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Rating</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s, i) => (
              <tr key={i} className="hover:bg-slate-800">
                <td className="p-2 border">{s.name}</td>
                <td className="p-2 border text-center">{s.rating ?? "Not Rated"}</td>
                <td className="p-2 border text-center">
                  {s.rating >= 6 ? (
                    <span className="text-green-400 font-bold">✅ Selected</span>
                  ) : s.rating ? (
                    <span className="text-red-400">❌ Not Selected</span>
                  ) : (
                    <span className="text-yellow-400">⏳ Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
