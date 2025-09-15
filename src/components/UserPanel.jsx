import React, { useState } from "react";
import Quiz from "./Quiz";

export default function UserPanel() {
   const questions = [
    { id: 1, q: "What stand for IC?", options: ["Internal cut", "Integrated Circuit", "Both", "none"], correct: 1 },
    { id: 2, q: "Which device is used to type letters and numbers into a computer?", options: ["Monitor", "Keyboard", "Speaker", "Printer"], correct: 1 },
    { id: 3, q: "Which part shows the output on the screen?", options: ["CPU", "Monitor", "Scanner", "Printer"], correct: 1 },
    { id: 4, q: "What does RAM store?", options: ["Permanent Files", "Printed pages", "Temporary data", "Sounds"], correct: 2 },
    { id: 5, q: "What is the full form of UPS?", options: ["Uniform Power System", "Uninterruptible Power Supply", "United Power Source", "Universal Power Socket"], correct: 1 },
    { id: 6, q: "Which of these is NOT an input device?", options: ["Scanner", "Microphone", "Mouse", "Speaker"], correct: 3 },
    { id: 7, q: "Which key is used to erase characters to the left of the cursor?", options: ["Enter", "Shift", "Spacebar", "Backspace"], correct: 3 },
    { id: 8, q: "Which storage device is portable and plugs into a USB port?", options: ["Hard Disk", "PenDrive", "CD-ROM", "RAM"], correct: 1 },
    { id: 9, q: "Which of these is an example of application software?", options: ["Windows", "CPU", "MS Excel", "SSD"], correct: 2 },
    { id: 10, q: "Files are organized inside:", options: ["Folder", "CPU", "Icon", "Desktop"], correct: 0 },
    { id: 11, q: "What is the bar at the bottom of the Windows screen called?", options: ["Menu Bar", "Title Bar", "Task Bar", "Scroll Bar"], correct: 2 },
    { id: 12, q: "What is a web browser?", options: ["A device", "A cable", "A program to open websites", "A printer type"], correct: 2 },
    { id: 13, q: "Which of these is a safe practice online?", options: ["Sharing passwords", "Clicking unknown links", "Telling strangers personal info", "Using strong passwords"], correct: 3 },
    { id: 14, q: "Which symbol separates parts of a web address (URL)?", options: ["@", "://", "#", "$"], correct: 1 },
    { id: 15, q: "What does a search engine do?", options: ["Prints pages", "Plays music", "Finds information on the web", "Draws pictures"], correct: 2 },
    { id: 16, q: "Which device reads printed text or photos into the computer?", options: ["Printer", "Scanner", "Projector", "Webcam"], correct: 1 },
    { id: 17, q: "What is the smallest unit of Data?", options: ["Byte", "Bit", "Kilobyte", "MegaByte"], correct: 1 },
    { id: 18, q: "What does the Recycle Bin do?", options: ["Stores deleted files temporarily", "Cleans the desktop", "Installs software", "Scans For Viruses"], correct: 0 },
    { id: 19, q: "Which key creates a space between words?", options: ["Tab", "ALT", "SpaceBar", "Shift"], correct: 2 },
    { id: 20, q: "Which of these helps protect a computer from power cuts?", options: ["UPS", "CPU", "Printer", "Keyboard"], correct: 0 },
    { id: 21, q: "ASCII value stand for?", options: ["American Scientific Code for Information Interchange", "American Standard Code for Information Interface", "American Standard Code for Information Interchange", "American Scientific Code for interchanging Information"], correct: 2 },
    { id: 22, q: "Which Language is understood directly by the computer?", options: ["c", "Assembly language", "Machine language", "Java"], correct: 2 },
    { id: 23, q: "Which type of memory is volatile?", options: ["HardDisk", "Rom", "RAM", "Flash memory"], correct: 2 },
    { id: 24, q: "Which of the following is an Operating System?", options: ["Microsoft Word", "Linux", "Oracle", "Google"], correct: 1 },
    { id: 25, q: "Which of these is a web browser?", options: ["Yahoo", "Mozilla Firefox", "Google Search", "Bing"], correct: 1 },
    { id: 26, q: "In Binary number System , which two digits are used?", options: ["0 & 2", "1 & 2", "0 & 1", "1 & 3"], correct: 2 },
    { id: 27, q: "What does 'IP' in IP Address stand for?", options: ["Internet Provider", "Internet Protocol", "Internal Process", "Intranet Protocol"], correct: 1 },
    { id: 28, q: "Which Company developed Java programming language?", options: ["Google", "Sun Microsystems", "Microsoft", "IBM"], correct: 1 },
    { id: 29, q: "Which of the following is not an operating system?", options: ["Windows", "Linux", "Oracle", "macOS"], correct: 2 },
    { id: 30, q: "Which key is used to move to the next line while typing?", options: ["SpaceBar", "Enter", "SHIFT", "CTRL"], correct: 1 }
  ];

  const [flow, setFlow] = useState("idle"); // idle | form | quiz | finished
  const [meta, setMeta] = useState({ name: "", email: "", phone: "" });
  const [lastResult, setLastResult] = useState(null);
  const duration = 30; // 30 minutes

  function validEmail(s){ return /^\S+@\S+\.\S+$/.test(s.trim()); }
  function validPhone(s){ return /^\d{7,15}$/.test(s.trim()); }

  async function onFormSubmit(e){
    e?.preventDefault();
    const name = meta.name.trim();
    const email = meta.email.trim().toLowerCase();
    const phone = meta.phone.trim();
    if(!name) return alert("Enter name");
    if(!validEmail(email)) return alert("Enter valid email");
    if(!validPhone(phone)) return alert("Enter valid phone (digits)");
    setFlow("quiz");
  }

  async function onFinish(result){
    setLastResult(result);
    setFlow("finished");

    // send to backend
    try{
      await fetch("https://hackcfdb.onrender.com/api/score",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          name: meta.name,
          email: meta.email,
          phone: meta.phone,
          score: result.score,
          total: questions.length,
          answers: result.answers
        })
      });
    } catch(err){ console.error("Error saving score:", err); }
  }

  function resetAll(){
    setMeta({ name:"", email:"", phone:"" });
    setFlow("idle");
    setLastResult(null);
  }

  return (
    <div className="bg-slate-900 rounded-xl p-6 shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-emerald-300">🌟 Take the Quiz</h2>

      {flow==="idle" && (
        <div className="space-y-4">
          <p className="text-slate-300">Click Start, fill your details and take the quiz.</p>
          <button onClick={()=>setFlow("form")} className="px-5 py-2 bg-emerald-600 text-white rounded-md">🚀 Start Quiz</button>
        </div>
      )}

      {flow==="form" && (
        <form className="bg-slate-800 p-6 rounded-md space-y-4" onSubmit={onFormSubmit}>
          <input placeholder="Name" className="w-full p-2 rounded text-white bg-slate-700 placeholder-slate-400" value={meta.name} onChange={e=>setMeta({...meta,name:e.target.value})}/>
          <input placeholder="Email" className="w-full p-2 rounded text-white bg-slate-700 placeholder-slate-400" value={meta.email} onChange={e=>setMeta({...meta,email:e.target.value})}/>
          <input placeholder="Phone" className="w-full p-2 rounded text-white bg-slate-700 placeholder-slate-400" value={meta.phone} onChange={e=>setMeta({...meta,phone:e.target.value})}/>
          <div className="flex gap-4">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">✅ Start</button>
            <button type="button" onClick={resetAll} className="px-4 py-2 bg-slate-700 text-white rounded">🔙 Cancel</button>
          </div>
        </form>
      )}

      {flow==="quiz" && (
        <Quiz
          questions={questions}
          durationMinutes={duration}
          onAutoSubmit={onFinish}
          onManualSubmit={onFinish}
          onQuit={resetAll}
          meta={meta}
        />
      )}

      {flow==="finished" && lastResult && (
        <div className="mt-6 bg-slate-800 p-6 rounded shadow-lg">
          <h3 className="text-xl font-bold text-emerald-300">🎉 Scorecard</h3>
          <p className="mt-3 text-slate-100">{meta.name} — {lastResult.score} / {questions.length} correct</p>
          <button onClick={resetAll} className="px-4 py-2 bg-slate-700 text-white rounded mt-4">🔁 Back to Home</button>
        </div>
      )}
    </div>
  );
}
