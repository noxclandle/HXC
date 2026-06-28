"use client";

import { useState, useEffect } from "react";
import { 
  Search, User, Mail, Phone, MapPin, Calendar, 
  ArrowLeft, Filter, MoreVertical, Trash2, Camera, X, Edit2, Download, Smartphone 
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Contact {
  id: string;
  name: string;
  handle_name?: string; // 会社名・部署名・役職
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at: string;
}

export default function LibraryPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // ソート状態のみ管理
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "name_asc" | "org_asc">("date_desc");

  // モーダル表示用状態
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Contact | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/contacts/list")
      .then(res => res.json())
      .then(data => {
        setContacts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 日本語の日付フォーマットに変換するユーティリティ
  const formatJapaneseDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  // 検索・フィルタリングされたリスト
  const filtered = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.handle_name?.toLowerCase().includes(search.toLowerCase())
  );

  // ソート処理を適用
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "date_desc") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === "date_asc") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sortBy === "name_asc") {
      return a.name.localeCompare(b.name, "ja");
    }
    if (sortBy === "org_asc") {
      const orgA = a.handle_name || "";
      const orgB = b.handle_name || "";
      if (!orgA) return 1; // 組織名がないものは末尾へ
      if (!orgB) return -1;
      return orgA.localeCompare(orgB, "ja");
    }
    return 0;
  });

  // 全データをCSVとしてダウンロードする処理 (Excelの文字化けを防ぐBOM付き)
  const exportToCSV = () => {
    if (contacts.length === 0) {
      alert("No data to export. / 出力するデータがありません。");
      return;
    }
    
    const headers = ["名前 (Name)", "会社名・役職 (Organization/Title)", "メールアドレス (Email)", "電話番号 (Phone)", "住所 (Address)", "メモ (Memo)", "登録日 (Registered Date)"];
    const rows = contacts.map(c => [
      c.name,
      c.handle_name || "",
      c.email || "",
      c.phone || "",
      c.address || "",
      c.notes || "",
      formatJapaneseDate(c.created_at)
    ]);
    
    const csvContent = [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(","),
      ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `hxc_contacts_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 個人の連絡先をvCard (.vcf) 形式でスマホ・PCの連絡先アプリに書き出す処理
  const handleDownloadVCard = (contact: Contact) => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${contact.name}`,
      `N:${contact.name};;;;`,
      contact.handle_name ? `ORG:${contact.handle_name}` : "",
      contact.email ? `EMAIL;TYPE=INTERNET:${contact.email}` : "",
      contact.phone ? `TEL;TYPE=CELL:${contact.phone}` : "",
      contact.address ? `ADR;TYPE=WORK:;;${contact.address};;;;` : "",
      contact.notes ? `NOTE:${contact.notes.replace(/\n/g, '\\n')}` : "",
      "END:VCARD"
    ].filter(Boolean).join("\n");

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${contact.name}.vcf`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 編集保存処理
  const handleSaveEdit = async () => {
    if (!editForm || !editForm.name) return;
    setIsSaving(true);

    try {
      const res = await fetch("/api/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editForm.id,
          name: editForm.name,
          role: editForm.handle_name || "",
          email: editForm.email || "",
          phone: editForm.phone || "",
          address: editForm.address || "",
          notes: editForm.notes || "",
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setContacts(prev => prev.map(c => c.id === editForm.id ? result.contact : c));
        setSelectedContact(result.contact);
        setIsEditing(false);
      } else {
        alert("Failed to update contact.");
      }
    } catch (err) {
      console.error("Save Error:", err);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  // 削除処理
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact? / この連絡先を削除してもよろしいですか？")) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/contacts?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setContacts(prev => prev.filter(c => c.id !== id));
        setSelectedContact(null);
      } else {
        alert("Failed to delete contact.");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-void text-moonlight pt-24 pb-24 px-4 md:px-8">
      <header className="max-w-6xl mx-auto mb-12">
        <Link href="/hub" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity mb-8">
          <ArrowLeft size={12} /> Back to Home
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl tracking-[0.3em] md:tracking-[0.5em] uppercase font-extralight text-white mb-2">Contacts</h1>
            <p className="text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold">名刺帳・ライブラリ</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {/* CSV出力 */}
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-5 py-3.5 border border-white/10 hover:border-white/25 hover:bg-white/[0.02] text-[9px] tracking-[0.2em] uppercase text-white/70 hover:text-white transition-all font-bold rounded-none"
            >
              <Download size={12} /> Export CSV / CSV出力
            </button>

            {/* 並び替え */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white/[0.02] border border-white/5 px-4 py-3.5 pr-8 text-[9px] tracking-widest uppercase focus:border-azure-500/40 outline-none transition-all text-white rounded-none cursor-pointer font-bold"
              >
                <option value="date_desc" className="bg-void text-white">Newest / 登録日新しい順</option>
                <option value="date_asc" className="bg-void text-white">Oldest / 登録日古い順</option>
                <option value="name_asc" className="bg-void text-white">Name / 名前順 (A-Z)</option>
                <option value="org_asc" className="bg-void text-white">Org / 組織名順</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-[8px]">▼</div>
            </div>

            {/* 検索入力 */}
            <div className="relative w-full md:w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-azure-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search Contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 p-4 pl-12 text-[11px] tracking-widest focus:border-azure-500/40 outline-none transition-all uppercase"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {/* Scan Card Panel */}
        <div className="mb-10 p-6 border border-azure-500/10 bg-azure-500/[0.01] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-azure-500/20" />
           <div className="flex-1">
              <h2 className="text-sm tracking-[0.3em] uppercase font-bold text-white mb-2 flex items-center gap-2">
                 <Camera size={14} className="text-azure-400" /> Scan Card / 名刺スキャン
              </h2>
              <p className="text-[9px] tracking-wider text-white/40 leading-relaxed">
                 ここにかざしたスキャンカードは、このカメラで受け取った名刺を撮影するだけでデータ登録が行えます。<br />
                 <span className="opacity-40 text-[7px]">The Scan Card placed here registers data simply by capturing the received card with this camera.</span>
              </p>
           </div>
           <Link 
              href="/scan" 
              className="px-6 py-3 border border-azure-500/30 bg-azure-500/5 hover:bg-azure-500/10 text-azure-300 text-[9px] tracking-[0.3em] font-bold uppercase transition-all duration-300 shrink-0 self-stretch md:self-auto text-center"
           >
              Open Camera / カメラ起動
           </Link>
        </div>

        {loading ? (
          // --- ローディング ---
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-white/5 border-t-white/40 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[10px] tracking-[1em] uppercase opacity-20 ml-[1em]">Updating Contacts</p>
          </div>
        ) : sorted.length === 0 ? (
          // --- データなし ---
          <div className="py-24 border border-dashed border-white/5 text-center">
            <p className="text-[10px] tracking-[0.5em] uppercase opacity-20 italic">No identities found in this coordinate.</p>
          </div>
        ) : (
          // --- 簡略化されたカード一覧リスト ---
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {sorted.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedContact(c)}
                  className="p-6 bg-white/[0.01] border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden cursor-pointer"
                >
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between items-center w-full">
                    {/* 左側：組織名 ＆ 名前 */}
                    <div className="space-y-1 pr-4 flex-1">
                      {c.handle_name ? (
                        <p className="text-[9px] tracking-widest text-azure-400 font-bold uppercase truncate">{c.handle_name}</p>
                      ) : (
                        <p className="text-[9px] tracking-widest text-white/20 uppercase">No Organization</p>
                      )}
                      <h3 className="text-[14px] tracking-[0.2em] uppercase text-white font-light group-hover:tracking-[0.3em] transition-all">{c.name}</h3>
                    </div>

                    {/* 右側：登録日 ＆ メニュー */}
                    <div className="text-right flex-shrink-0 flex flex-col items-end justify-between h-full min-h-[42px]">
                      <span className="text-[8px] tracking-widest opacity-25 uppercase font-mono">
                        {formatJapaneseDate(c.created_at)}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContact(c);
                        }} 
                        className="opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity p-1 mt-1"
                      >
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* 詳細 ＆ 編集モーダル */}
      <AnimatePresence>
        {selectedContact && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSaving && !isDeleting) {
                  setSelectedContact(null);
                  setIsEditing(false);
                }
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-void border border-white/10 p-6 md:p-8 relative z-10 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button 
                onClick={() => {
                  setSelectedContact(null);
                  setIsEditing(false);
                }}
                className="absolute right-6 top-6 text-white/40 hover:text-white transition-colors"
                disabled={isSaving || isDeleting}
              >
                <X size={18} />
              </button>

              {!isEditing ? (
                // --- 詳細閲覧表示 (View Mode) ---
                <div className="space-y-6 pt-4">
                  <div>
                    {selectedContact.handle_name ? (
                      <p className="text-[10px] tracking-[0.2em] text-azure-400 font-bold uppercase mb-1">{selectedContact.handle_name}</p>
                    ) : (
                      <p className="text-[10px] tracking-[0.2em] text-white/20 uppercase mb-1">No Organization</p>
                    )}
                    <h2 className="text-xl tracking-[0.2em] uppercase text-white font-light">{selectedContact.name}</h2>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    {selectedContact.email && (
                      <div className="space-y-1">
                        <span className="text-[8px] tracking-[0.2em] opacity-40 uppercase block">Email</span>
                        <a 
                          href={`mailto:${selectedContact.email}`} 
                          className="text-[12px] tracking-wider text-azure-300 hover:text-azure-400 transition-colors flex items-center gap-2 underline break-all"
                        >
                          <Mail size={12} className="shrink-0" /> {selectedContact.email}
                        </a>
                      </div>
                    )}

                    {selectedContact.phone && (
                      <div className="space-y-1">
                        <span className="text-[8px] tracking-[0.2em] opacity-40 uppercase block">Phone</span>
                        <a 
                          href={`tel:${selectedContact.phone}`} 
                          className="text-[12px] tracking-wider text-azure-300 hover:text-azure-400 transition-colors flex items-center gap-2 underline"
                        >
                          <Phone size={12} className="shrink-0" /> {selectedContact.phone}
                        </a>
                      </div>
                    )}

                    {selectedContact.address && (
                      <div className="space-y-1">
                        <span className="text-[8px] tracking-[0.2em] opacity-40 uppercase block">Location</span>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedContact.address)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[12px] tracking-wider text-azure-300 hover:text-azure-400 transition-colors flex items-center gap-2 underline leading-relaxed"
                        >
                          <MapPin size={12} className="shrink-0" /> {selectedContact.address}
                        </a>
                      </div>
                    )}

                    {selectedContact.notes && (
                      <div className="space-y-1">
                        <span className="text-[8px] tracking-[0.2em] opacity-40 uppercase block">Private Memo</span>
                        <div className="text-[11px] tracking-widest text-white/70 bg-white/[0.02] p-4 border border-white/5 rounded-none whitespace-pre-wrap leading-relaxed">
                          {selectedContact.notes}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-[8px] tracking-widest opacity-25 uppercase font-mono pt-4">
                      <Calendar size={10} /> Registered at {formatJapaneseDate(selectedContact.created_at)}
                    </div>
                  </div>

                  {/* iPhone/PCの連絡先への追加ボタン */}
                  <button 
                    onClick={() => handleDownloadVCard(selectedContact)}
                    className="w-full py-4 border border-azure-500/30 bg-azure-500/5 hover:bg-azure-500/10 text-azure-300 text-[10px] uppercase tracking-[0.2em] transition-all font-bold flex items-center justify-center gap-2 mt-4"
                  >
                    <Smartphone size={14} /> Add to Contacts / 端末の連絡先に追加
                  </button>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t border-white/5">
                    <button 
                      onClick={() => handleDelete(selectedContact.id)}
                      className="flex-1 py-3 border border-red-500/20 text-red-400 hover:bg-red-500/5 text-[9px] uppercase tracking-widest transition-all font-bold flex items-center justify-center gap-2"
                      disabled={isDeleting}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                    <button 
                      onClick={() => {
                        setEditForm(selectedContact);
                        setIsEditing(true);
                      }}
                      className="flex-1 py-3 bg-white text-void hover:scale-105 active:scale-95 text-[9px] uppercase tracking-widest transition-all font-bold flex items-center justify-center gap-2"
                    >
                      <Edit2 size={12} /> Edit Details
                    </button>
                  </div>
                </div>
              ) : (
                // --- 編集フォーム表示 (Edit Mode) ---
                <div className="space-y-5 pt-4">
                  <div>
                    <h2 className="text-sm tracking-[0.3em] uppercase text-white font-light mb-1">Edit Contact</h2>
                    <p className="text-[8px] tracking-[0.2em] opacity-30 uppercase font-bold">情報を編集する</p>
                  </div>

                  {editForm && (
                    <div className="space-y-4 pt-4 border-t border-white/5 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin">
                      <div className="space-y-1">
                        <label className="text-[8px] tracking-[0.2em] opacity-45 uppercase block">Name / お名前 <span className="text-red-500/80">*</span></label>
                        <input 
                          type="text" 
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full bg-white/[0.02] border border-white/10 px-4 py-2.5 text-[11px] tracking-widest focus:border-white/30 outline-none text-white rounded-none"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] tracking-[0.2em] opacity-45 uppercase block">Company & Title / 組織名・役職</label>
                        <input 
                          type="text" 
                          value={editForm.handle_name || ""}
                          onChange={(e) => setEditForm({ ...editForm, handle_name: e.target.value })}
                          className="w-full bg-white/[0.02] border border-white/10 px-4 py-2.5 text-[11px] tracking-widest focus:border-white/30 outline-none text-white rounded-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] tracking-[0.2em] opacity-45 uppercase block">Email / メールアドレス</label>
                        <input 
                          type="text" 
                          value={editForm.email || ""}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full bg-white/[0.02] border border-white/10 px-4 py-2.5 text-[11px] tracking-widest focus:border-white/30 outline-none text-white rounded-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] tracking-[0.2em] opacity-45 uppercase block">Phone / 電話番号</label>
                        <input 
                          type="text" 
                          value={editForm.phone || ""}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full bg-white/[0.02] border border-white/10 px-4 py-2.5 text-[11px] tracking-widest focus:border-white/30 outline-none text-white rounded-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] tracking-[0.2em] opacity-45 uppercase block">Location / 所在地</label>
                        <input 
                          type="text" 
                          value={editForm.address || ""}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                          className="w-full bg-white/[0.02] border border-white/10 px-4 py-2.5 text-[11px] tracking-widest focus:border-white/30 outline-none text-white rounded-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] tracking-[0.2em] opacity-45 uppercase block">Private Memo / メモ</label>
                        <textarea 
                          value={editForm.notes || ""}
                          onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                          rows={3}
                          className="w-full bg-white/[0.02] border border-white/10 p-4 text-[11px] tracking-widest focus:border-white/30 outline-none text-white rounded-none resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Edit Actions */}
                  <div className="flex gap-4 pt-4 border-t border-white/5">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-3 border border-white/10 text-[9px] uppercase tracking-widest hover:bg-white/5 transition-all font-bold"
                      disabled={isSaving}
                    >
                      Cancel / キャンセル
                    </button>
                    <button 
                      onClick={handleSaveEdit}
                      className="flex-1 py-3 bg-white text-void hover:scale-105 active:scale-95 text-[9px] uppercase tracking-widest transition-all font-bold"
                      disabled={isSaving || !editForm?.name}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
