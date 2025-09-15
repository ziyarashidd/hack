import React, { useEffect, useState } from "react";

export default function Participants() {
  const [scorecards, setScorecards] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/participants")
      .then(res => res.json())
      .then(setScorecards);
  }, []);

  const high = scorecards.filter(s => (s.score / s.total) * 100 >= 60);

  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow text-white">
      <h2 className="text-2xl font-bold mb-4">Participants ({scorecards.length})</h2>
      {scorecards.length === 0 ? <p className="text-slate-400">No participants yet.</p> : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 text-sm">
            <thead>
              <tr className="bg-slate-800">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Correct</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {scorecards.map((s, idx) => {
                const percent = ((s.score / s.total) * 100).toFixed(1);
                return (
                  <tr key={idx} className="hover:bg-slate-800">
                    <td className="border px-4 py-2">{s.name}</td>
                    <td className="border px-4 py-2">{s.email}</td>
                    <td className="border px-4 py-2 text-center">{s.score}</td>
                    <td className="border px-4 py-2 text-center">{s.total}</td>
                    <td className="border px-4 py-2 text-center">{percent}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <h3 className="text-lg font-semibold mt-6 mb-2">High Scorers (≥ 60%)</h3>
      {high.length === 0 ? <p className="text-slate-400">No high scorers yet.</p> : (
        <ul className="list-disc ml-6">
          {high.map((h, i) => (
            <li key={i}>{h.name} — {((h.score / h.total) * 100).toFixed(1)}%</li>
          ))}
        </ul>
      )}
    </div>
  );
}
