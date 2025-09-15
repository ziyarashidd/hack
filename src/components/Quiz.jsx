import React, { useEffect, useState, useRef } from "react";

/*
  Props:
   - questions: array
   - durationMinutes: number
   - onAutoSubmit(result) & onManualSubmit(result)
   - onQuit()
   - meta
*/

export default function Quiz({ questions, durationMinutes=30, onAutoSubmit, onManualSubmit, onQuit, meta }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);

  const totalSeconds = Math.max(1, Math.floor(durationMinutes * 60));
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if(timeLeft <= 0){
      clearInterval(timerRef.current);
      handleSubmit(true);
    }
  }, [timeLeft]);

  const selectOption = i => setSelected(i);

  const handleSubmit = (auto=false) => {
    if(selected !== null){
      const q = questions[index];
      setAnswers(prev => [...prev, {
        questionId: q.id,
        question: q.q,
        selected: Number(selected),
        selectedText: q.options[Number(selected)],
        correctIndex: q.correct,
        correctText: q.options[q.correct]
      }]);
    }

    const finalAnswers = [...answers];
    if(selected !== null && index === questions.length-1) finalAnswers.push({
      questionId: questions[index].id,
      question: questions[index].q,
      selected: Number(selected),
      selectedText: questions[index].options[Number(selected)],
      correctIndex: questions[index].correct,
      correctText: questions[index].options[questions[index].correct]
    });

    const score = finalAnswers.filter(a => a.selected === a.correctIndex).length;
    const result = { score, total: questions.length, answers: finalAnswers };

    if(index + 1 < questions.length){
      setIndex(i => i + 1);
      setSelected(null);
    } else {
      clearInterval(timerRef.current);
      auto ? onAutoSubmit(result) : onManualSubmit(result);
    }
  };

  const quit = () => {
    if(window.confirm("Quit quiz? progress will be lost.")) onQuit();
  };

  const mm = String(Math.floor(Math.max(0,timeLeft)/60)).padStart(2,"0");
  const ss = String(Math.floor(Math.max(0,timeLeft)%60)).padStart(2,"0");
  const progress = Math.round((index / Math.max(1, questions.length)) * 100);

  return (
    <div className="bg-slate-800 p-4 rounded-md">
      <div className="flex justify-between items-center">
        <div className="text-sm text-slate-300">Question {index+1} / {questions.length}</div>
        <div className="text-sm font-medium bg-slate-700 px-2 py-1 rounded">{mm}:{ss}</div>
      </div>

      <h3 className="text-lg font-semibold mt-3 text-emerald-200">{questions[index].q}</h3>

      <div className="mt-3 grid gap-2">
        {questions[index].options.map((op,i)=>(
          <label key={i} className={`p-3 rounded border flex items-center gap-3 cursor-pointer ${
            selected!==null && selected===i ? "border-emerald-400 bg-emerald-950/20" : "border-transparent hover:bg-slate-900"
          }`}>
            <input type="radio" name="opt" value={i} checked={selected===i} onChange={()=>selectOption(i)} />
            <span className="text-white">{op}</span>
          </label>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={()=>handleSubmit(false)} className="px-4 py-2 bg-emerald-600 rounded hover:bg-emerald-500">Submit & Next</button>
        <button onClick={quit} className="px-4 py-2 bg-slate-700 rounded">Quit</button>
      </div>

      <div className="mt-3 text-xs text-slate-400">
        Progress: {index}/{questions.length} • Completed: {answers.length} • Score so far: {answers.filter(a=>a.selected===a.correctIndex).length}
      </div>
      <div className="w-full bg-slate-700 h-2 rounded mt-3">
        <div style={{width:`${progress}%`}} className="h-2 bg-emerald-500 rounded"></div>
      </div>
    </div>
  );
}
