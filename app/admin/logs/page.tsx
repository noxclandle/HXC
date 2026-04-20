"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Activity, Eye, Terminal, Radio } from "lucide-react";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([
    { id: "1", action: "PROFILE_UPDATE", user: "Nox", time: "2:14 PM", details: "Changed Phone" },
    { id: "2", action: "UNAUTHORIZED_ACCESS", user: "Unknown", time: "1:45 PM", details: "UID: 04:X1:99:ZZ" },
    { id: "3", action: "LOGIN_ATTEMPT", user: "Sera", time: "11:20 AM", details: "Success" },
  ]);

  return (
    <div className="max-w-7xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16 flex justify-between items-end border-b border-moonlight/10 pb-8">
        <div>
          <h1 className="text-xl tracking-[0.6em] uppercase flex items-center gap-4">
            <Terminal className="text-rose-500 animate-pulse" size={20} />
            Chief&apos;s Gaze
          </h1>
          <p className="text-[9px] tracking-widest opacity-40 uppercase mt-2">Historical Records of the Void</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: General Audit Logs */}
        <div className="lg:col-span-2 space-y-2">
          <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-6 flex items-center gap-2">
            <Activity size={14} /> Historical Records
          </h2>
          {logs.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`grid grid-cols-3 p-5 bg-gothic-dark/10 border ${log.action === 'UNAUTHORIZED_ACCESS' ? 'border-rose-500/20' : 'border-moonlight/5'} items-center`}
            >
              <div className="text-[10px] tracking-[0.2em] font-mono">
                <span className={`px-2 py-1 rounded-sm text-void ${log.action === 'UNAUTHORIZED_ACCESS' ? 'bg-rose-500' : 'bg-moonlight/40'}`}>
                  {log.action}
                </span>
              </div>
              <div className="text-[11px] tracking-widest">{log.user}</div>
              <div className="text-[10px] text-right opacity-30 font-mono">{log.time}</div>
            </motion.div>
          ))}
        </div>

        {/* Right: Master Proclamations (Mass Messages) */}
        <aside className="space-y-6">
           <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 flex items-center gap-2">
            <Radio size={14} /> Master Proclamations
          </h2>
          <div className="space-y-4">
             {[
               { msg: "Welcome to the First Phase.", date: "2026.04.17", target: "All" },
               { msg: "RT distribution for Early Birds.", date: "2026.04.15", target: "Black Tier" },
             ].map((p, i) => (
               <div key={i} className="p-6 border border-moonlight/5 bg-white/5 space-y-2">
                  <p className="text-[10px] tracking-widest leading-relaxed italic opacity-80">&quot;{p.msg}&quot;</p>
                  <div className="flex justify-between items-center text-[7px] tracking-widest uppercase opacity-30">
                     <span>To: {p.target}</span>
                     <span>{p.date}</span>
                  </div>
               </div>
             ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
