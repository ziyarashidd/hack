import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const ADMIN_USER = "srimt";
const ADMIN_PASS = "srimt2k25";

export default function AdminLogin({ setIsAdminAuth }){
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  function doLogin(e){
    e?.preventDefault?.();
    if(user === ADMIN_USER && pass === ADMIN_PASS){
      setIsAdminAuth(true);
      navigate("/admin/panel");
    } else {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <form onSubmit={doLogin} className="bg-slate-800 p-6 rounded-lg w-full max-w-md shadow">
        <h3 className="text-xl font-bold mb-3">Admin Login</h3>
        <input placeholder="Username" className="w-full p-2 rounded mb-2 text-black" value={user} onChange={e=>setUser(e.target.value)} />
        <input placeholder="Password" type="password" className="w-full p-2 rounded mb-4 text-black" value={pass} onChange={e=>setPass(e.target.value)} />
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-amber-500 rounded text-slate-900">Login</button>
          <Link to="/" className="px-4 py-2 bg-slate-700 rounded">Back</Link>
        </div>
        {/* <p className="text-sm text-slate-400 mt-3">Demo creds: <strong>admin / admin123</strong></p> */}
      </form>
    </div>
  );
}
