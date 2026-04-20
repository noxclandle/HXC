"use client";

import { useState } from "react";
import { ShieldAlert, Save, RotateCcw, Key, Zap, TrendingUp } from "lucide-react";

export default function MasterOverridePage() {
  const [targetUser, setTargetUser] = useState({
    id: "UUID-001",
    name: "Nox",
    handle: "NOX_VOID",
    rank: "Initiate",
    role: "member",
    rt_balance: 5000
  });

  return (
    <div className="max-w-4xl mx-auto p-12 bg-void min-h-screen text-moonlight">
      <header className="mb-12 border-b border-moonlight/10 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <Key className="text-moonlight animate-pulse" size={24} />
          <h1 className="text-xl tracking-[0.6em] uppercase font-bold">Chief Officer Override</h1>
        </div>
        <p className="text-[10px] tracking-widest opacity-40 uppercase">Caution: Direct modification of the ledger.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40">Core Identity</h2>
            <div className="space-y-4">
              {["name", "handle", "rank", "role"].map((key) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-[8px] uppercase opacity-30">{key}</label>
                  <input
                    type="text"
                    value={(targetUser as any)[key]}
                    onChange={(e) => setTargetUser({ ...targetUser, [key]: e.target.value })}
                    className="bg-gothic-dark/50 border border-moonlight/10 p-3 text-xs tracking-widest focus:border-moonlight outline-none transition-all uppercase"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="p-8 border border-moonlight/10 bg-gothic-dark/10">
            <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-6 flex items-center gap-2">
              <Zap size={14} className="text-moonlight" /> Bestow Title
            </h2>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="ENTER TITLE"
                id="newTitleInput"
                className="flex-1 bg-void border border-moonlight/10 p-2 text-[10px] tracking-widest uppercase focus:border-moonlight outline-none"
              />
              <button 
                onClick={() => {
                  const input = document.getElementById('newTitleInput') as HTMLInputElement;
                  console.log(`Bestowing title: ${input.value} upon soul.`);
                  input.value = "";
                }}
                className="px-4 py-2 border border-moonlight/30 text-[8px] uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                Bestow
              </button>
            </div>
            <p className="text-[7px] opacity-20 uppercase tracking-[0.2em]">Title will be directly etched into the user&apos;s soul record.</p>
          </div>

          <div className="p-8 border border-moonlight/10 bg-gothic-dark/10">
            <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-6 flex items-center gap-2">
              <TrendingUp size={14} className="text-moonlight" /> Bestow Master Grace (RT)
            </h2>
            <div className="flex gap-2 mb-4">
              <input 
                type="number" 
                placeholder="AMOUNT"
                id="rtAmountInput"
                className="flex-1 bg-void border border-moonlight/10 p-2 text-[10px] tracking-widest focus:border-moonlight outline-none font-mono"
              />
              <button 
                onClick={() => {
                  const input = document.getElementById('rtAmountInput') as HTMLInputElement;
                  console.log(`Master Grace: ${input.value} RT bestowed.`);
                  window.dispatchEvent(new CustomEvent("rt-grace-received"));
                  input.value = "";
                }}
                className="px-6 py-2 bg-moonlight text-void text-[8px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(224,224,224,0.3)]"
              >
                Bestow Grace
              </button>
            </div>
            <p className="text-[7px] opacity-20 uppercase tracking-[0.2em]">The target soul will receive a shower of moonlit dust.</p>
          </div>

          <div className="p-8 border border-moonlight/10 bg-gothic-dark/10">
            <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-6 flex items-center gap-2">
              <Zap size={14} className="text-moonlight" /> Mass Grace (Global Bestowal)
            </h2>
            <div className="space-y-4">
              <textarea 
                placeholder="MESSAGE TO ALL SOULS (OPTIONAL)"
                id="massMessage"
                rows={2}
                className="w-full bg-void border border-moonlight/10 p-3 text-[10px] tracking-widest outline-none focus:border-moonlight transition-all uppercase resize-none mb-2"
              />
              <input 
                type="number" 
                placeholder="AMOUNT PER SOUL"
                id="massRtAmount"
                className="w-full bg-void border border-moonlight/10 p-3 text-[10px] tracking-widest focus:border-moonlight outline-none font-mono mb-4"
              />

              <div className="flex items-center gap-4 mb-4 p-4 border border-moonlight/5">
                 <span className="text-[8px] uppercase tracking-widest opacity-40">Schedule Bestowal:</span>
                 <input 
                   type="datetime-local" 
                   className="bg-transparent border-none text-[10px] tracking-widest text-moonlight outline-none cursor-pointer"
                 />
              </div>
              
              <div className="p-4 border border-rose-500/20 bg-rose-500/5 mb-4">
                 <p className="text-[7px] text-rose-500 uppercase tracking-[0.2em] leading-relaxed">
                   CAUTION: この操作は対象者全員の記録を永続的に書き換えます。取り消しは不可能です。
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {["Initiate", "Black Tier", "Sentinel", "All"].map((target) => (
                  <button 
                    key={target}
                    onClick={() => {
                      if(confirm(`本当に ${target} 全員に恩寵を授けますか？`)) {
                        console.log("Mass Bestowal Initiated.");
                      }
                    }}
                    className="py-3 border border-moonlight/10 text-[8px] uppercase tracking-widest hover:bg-rose-500/10 hover:border-rose-500/40 transition-all"
                  >
                    Execute: {target}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 border border-moonlight/10 bg-gothic-dark/10">
            <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-6 flex items-center gap-2">
              <ShieldAlert size={14} className="text-rose-500" /> Administrative Action
            </h2>
            <div className="space-y-4">
              <button className="w-full py-4 bg-moonlight text-void text-[10px] font-bold tracking-[0.5em] uppercase flex items-center justify-center gap-2 hover:bg-white transition-all">
                <Save size={14} /> Commit Changes
              </button>
              <button className="w-full py-4 border border-rose-500/20 text-[10px] tracking-[0.5em] uppercase flex items-center justify-center gap-2 hover:bg-rose-500/20 transition-all">
                <RotateCcw size={14} /> Reset Resonance
              </button>
            </div>
          </div>
          
          <div className="text-[9px] leading-relaxed opacity-20 tracking-widest uppercase italic text-center">
            &quot;Everything is in the hands of the Chief Officer. The Void conforms to your will.&quot;
          </div>
        </section>
      </div>
    </div>
  );
}
