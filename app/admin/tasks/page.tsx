"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Trash2, Zap, MessageSquare } from "lucide-react";

export default function ScheduledTasksPage() {
  const [tasks, setTasks] = useState([
    { id: "1", action: "MASS_GRACE", target: "Initiate", amount: 500, time: "2026.04.20 09:00", status: "pending" },
    { id: "2", action: "MESSAGE", target: "All", message: "A new era begins.", time: "2026.04.25 12:00", status: "pending" },
  ]);

  const removeTask = (id: string) => {
    if(confirm("この予定を抹消しますか？")) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16 border-b border-moonlight/10 pb-8">
        <h1 className="text-xl tracking-[0.6em] uppercase flex items-center gap-4">
          <Clock className="text-moonlight opacity-40" size={20} />
          Scheduled Rituals
        </h1>
        <p className="text-[9px] tracking-widest opacity-40 uppercase mt-2">Managing the Future Footprints of the Void</p>
      </header>

      <div className="space-y-4">
        {tasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 border border-moonlight/5 bg-gothic-dark/10 flex justify-between items-center group"
          >
            <div className="flex gap-8 items-center">
               <div className="p-3 border border-moonlight/10 bg-white/5">
                  {task.action === "MASS_GRACE" ? <Zap size={18} /> : <MessageSquare size={18} />}
               </div>
               <div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-xs tracking-[0.3em] uppercase font-bold">{task.action}</span>
                    <span className="text-[8px] px-2 py-0.5 bg-moonlight/10 opacity-40 uppercase tracking-widest">{task.target}</span>
                  </div>
                  <p className="text-[10px] tracking-widest opacity-60 italic">
                    {task.message || `Bestowing ${task.amount} RT to each soul.`}
                  </p>
               </div>
            </div>
            
            <div className="text-right flex flex-col items-end gap-4">
               <div className="text-[9px] font-mono opacity-40 uppercase tracking-widest">
                  Scheduled: {task.time}
               </div>
               <button 
                 onClick={() => removeTask(task.id)}
                 className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-500/60 hover:text-rose-500"
               >
                 <Trash2 size={16} />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
