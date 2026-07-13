"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trash2, Zap, MessageSquare } from "lucide-react";
import { logger } from "@/lib/logger";

interface TaskPayload {
  rank?: string;
  amount?: number;
  message?: string;
}

interface ScheduledTask {
  id: string;
  action: string;
  payload: TaskPayload;
  scheduled_at: string;
  status: string;
}

export default function ScheduledTasksPage() {
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [rank, setRank] = useState("All");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/admin/tasks");
      if (res.ok) setTasks(await res.json());
    } catch (error) {
      logger.error("Failed to fetch scheduled tasks", { error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {
    if (!scheduledAt) {
      alert("実行予定日時を指定してください。");
      return;
    }
    if (!amount && !message) {
      alert("RT量またはメッセージのいずれかを入力してください。");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rank,
          amount: amount ? Number(amount) : undefined,
          message: message || undefined,
          scheduledAt: new Date(scheduledAt).toISOString(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAmount("");
        setMessage("");
        setScheduledAt("");
        fetchTasks();
      } else {
        alert(data.error || "タスクの作成に失敗しました。");
      }
    } catch (error) {
      logger.error("Failed to create scheduled task", { error });
      alert("通信エラーが発生しました。");
    } finally {
      setSubmitting(false);
    }
  };

  const removeTask = async (id: string) => {
    if (!confirm("この予定を抹消しますか？")) return;
    try {
      const res = await fetch("/api/admin/tasks/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchTasks();
      } else {
        const data = await res.json();
        alert(data.error || "キャンセルに失敗しました。");
      }
    } catch (error) {
      logger.error("Failed to cancel scheduled task", { error });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16 border-b border-moonlight/10 pb-8">
        <h1 className="text-xl tracking-[0.6em] uppercase flex items-center gap-4">
          <Clock className="text-moonlight opacity-40" size={20} />
          Scheduled Connections
        </h1>
        <p className="text-[9px] tracking-widest opacity-40 uppercase mt-2">Managing the Future Footprints of the Void</p>
      </header>

      <div className="p-8 border border-moonlight/10 bg-gothic-dark/10 mb-12 space-y-4">
        <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-2">New Scheduled Mass Grace</h2>
        <div className="grid grid-cols-2 gap-4">
          <select
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            className="bg-void border border-moonlight/10 p-3 text-[10px] tracking-widest uppercase outline-none focus:border-moonlight"
          >
            {["All", "Member", "Fixer", "Mastermind"].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="bg-void border border-moonlight/10 p-3 text-[10px] tracking-widest outline-none focus:border-moonlight"
          />
          <input
            type="number"
            placeholder="RT AMOUNT (OPTIONAL)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-void border border-moonlight/10 p-3 text-[10px] tracking-widest font-mono outline-none focus:border-moonlight"
          />
          <input
            type="text"
            placeholder="MESSAGE (OPTIONAL)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-void border border-moonlight/10 p-3 text-[10px] tracking-widest uppercase outline-none focus:border-moonlight"
          />
        </div>
        <button
          onClick={createTask}
          disabled={submitting}
          className="px-8 py-3 bg-moonlight text-void text-[9px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-all disabled:opacity-40"
        >
          {submitting ? "Scheduling..." : "Schedule"}
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-[9px] uppercase tracking-widest opacity-20 animate-pulse">読み込み中...</p>
        ) : tasks.length === 0 ? (
          <p className="text-[9px] uppercase tracking-widest opacity-20 italic">予定されたタスクはありません。</p>
        ) : (
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-8 border border-moonlight/5 bg-gothic-dark/10 flex justify-between items-center group"
              >
                <div className="flex gap-8 items-center">
                  <div className="p-3 border border-moonlight/10 bg-white/5">
                    {task.payload.amount ? <Zap size={18} /> : <MessageSquare size={18} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-xs tracking-[0.3em] uppercase font-bold">{task.action}</span>
                      <span className="text-[8px] px-2 py-0.5 bg-moonlight/10 opacity-40 uppercase tracking-widest">{task.payload.rank || "All"}</span>
                      <span className={`text-[8px] px-2 py-0.5 uppercase tracking-widest ${
                        task.status === "pending" ? "text-azure-400" : task.status === "completed" ? "text-emerald-400" : "text-white/20"
                      }`}>{task.status}</span>
                    </div>
                    <p className="text-[10px] tracking-widest opacity-60 italic">
                      {task.payload.message || (task.payload.amount ? `Bestowing ${task.payload.amount} RT to each soul.` : "")}
                    </p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-4">
                  <div className="text-[9px] font-mono opacity-40 uppercase tracking-widest">
                    Scheduled: {new Date(task.scheduled_at).toLocaleString()}
                  </div>
                  {task.status === "pending" && (
                    <button
                      onClick={() => removeTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-500/60 hover:text-rose-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
