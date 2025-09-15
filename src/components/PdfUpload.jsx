import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PdfUpload = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("pdf", file);

    try {
      const res = await fetch("https://hackcfdb.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "" });
        setFile(null);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleCancel = () => {
    setForm({ name: "", email: "", phone: "" });
    setFile(null);
    navigate("/");
  };

  return (
    <div className="max-w-xl mx-auto bg-slate-900 text-white p-6 rounded-lg shadow-md mt-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-emerald-300 mb-4">📄 Submit Your PDF</h2>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Upload PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required
              className="w-full bg-slate-800 text-white"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded transition"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center text-green-400 font-semibold text-lg mt-4">
          ✅ PDF submitted successfully!
          <div className="mt-4">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition"
            >
              Go to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfUpload;
