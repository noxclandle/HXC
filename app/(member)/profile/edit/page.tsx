"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, ArrowLeft, User, Phone, MapPin, Tag, Lock, Globe, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfileEditPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "Chief Officer",
    handle: "ARCHITECT",
    phone: "090-XXXX-XXXX",
    address: "GLOBAL COMMAND CENTER 1-1",
    email: "str1yf5x@gmail.com",
    photo_url: "/logo.png",
    secret_msg: "Everything is connected in the silence.",
    link_x: "",
    link_instagram: "",
    link_website: ""
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = "Name required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) router.push("/dashboard");
      else alert("Failed to sync identity.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6 pb-24 text-moonlight">
      <header className="mb-16 flex justify-between items-center">
        <div>
          <h1 className="text-2xl tracking-[0.4em] uppercase mb-2">Identity Tuning</h1>
          <p className="text-[10px] tracking-widest opacity-40 uppercase">Modify your public reflection.</p>
        </div>
        <Link href="/dashboard" className="opacity-40 hover:opacity-100 transition-opacity">
          <ArrowLeft size={20} />
        </Link>
      </header>

      <section className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { label: "Real Name", key: "name", icon: <User size={14} /> },
            { label: "Public Handle", key: "handle", icon: <Tag size={14} /> },
            { label: "Contact Phone", key: "phone", icon: <Phone size={14} /> },
            { label: "Postal Address", key: "address", icon: <MapPin size={14} /> },
          ].map((f) => (
            <div key={f.key} className="space-y-2 group">
              <label className="text-[9px] uppercase tracking-widest opacity-30 flex items-center gap-2 group-focus-within:opacity-100 transition-opacity">
                {f.icon} {f.label}
              </label>
              <input
                type="text"
                value={(formData as any)[f.key]}
                onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                className="w-full bg-gothic-dark/30 border border-moonlight/10 p-4 text-xs tracking-widest focus:border-moonlight outline-none transition-all uppercase"
              />
            </div>
          ))}
        </div>

        {/* Social & Web Links */}
        <div className="p-8 border border-moonlight/10 bg-gothic-dark/20 backdrop-blur-sm space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2">
              <Globe size={14} /> Social Connections
            </h2>
            <button 
              onClick={() => {
                alert("SNSから情報を抽出中...");
                setFormData({ ...formData, secret_msg: "Xでの活動に基づき、コンシェルジュがあなたの信条を言葉にしました。静寂の中に真理を求める旅人。" });
              }}
              className="text-[7px] border border-moonlight/30 px-3 py-1 uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              AI Auto-Sync
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "X (Twitter)", key: "link_x", icon: <Twitter size={12}/> },
              { label: "Instagram", key: "link_instagram", icon: <Instagram size={12}/> },
              { label: "Website", key: "link_website", icon: <Globe size={12}/> },
            ].map((s) => (
              <div key={s.key} className="space-y-2">
                <label className="text-[8px] uppercase tracking-widest opacity-30 flex items-center gap-2">{s.icon} {s.label}</label>
                <input
                  type="url"
                  value={(formData as any)[s.key]}
                  onChange={(e) => setFormData({ ...formData, [s.key]: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-void border border-moonlight/5 p-3 text-[10px] tracking-widest outline-none focus:border-moonlight transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Secret Message for Card Back */}
        <div className="space-y-4">
          <label className="text-[9px] uppercase tracking-widest opacity-30 flex items-center gap-2">
            <Lock size={14} /> Secret Message (Card Back)
          </label>
          <textarea
            value={formData.secret_msg}
            onChange={(e) => setFormData({ ...formData, secret_msg: e.target.value })}
            placeholder="ENTER YOUR INNER WILL..."
            rows={4}
            className="w-full bg-gothic-dark/30 border border-moonlight/10 p-6 text-xs tracking-[0.2em] leading-relaxed focus:border-moonlight outline-none transition-all uppercase resize-none italic"
          />
        </div>

        {/* Portrait Settings with Explanation */}
        <div className="p-8 border border-moonlight/10 bg-gothic-dark/20 backdrop-blur-sm space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <User size={20} className="opacity-40" />
            <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 font-bold">Identity Portrait</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 border border-moonlight/20 bg-void overflow-hidden flex items-center justify-center relative group">
               <img src={formData.photo_url || "/logo.png"} alt="Preview" className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-opacity" />
               <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-void/60 transition-opacity cursor-pointer text-[8px] uppercase tracking-widest">
                 Update Photo
                 <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
               </label>
            </div>
            
            <div className="flex-1 space-y-4">
              <p className="text-[11px] tracking-widest text-moonlight/80 leading-relaxed uppercase">
                名刺の裏面にあなたの肖像を刻みます。
              </p>
              <p className="text-[9px] tracking-widest text-moonlight/40 leading-relaxed uppercase">
                裏面に写真を載せることで、相手が後で見返した際にあなたの存在を鮮明に思い出せるようになります。
              </p>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-moonlight/5 flex justify-end gap-6">
           <button onClick={handleSave} className="px-16 py-4 bg-moonlight text-void text-[10px] font-bold tracking-[0.6em] uppercase hover:bg-white transition-all flex items-center gap-3">
             <Save size={14} /> Commit Identity
           </button>
        </div>
      </section>

      <footer className="mt-24 opacity-10 text-[8px] tracking-[0.5em] uppercase text-center italic">
        &quot;Your presence is defined by the records you leave behind.&quot;
      </footer>
    </div>
  );
}
