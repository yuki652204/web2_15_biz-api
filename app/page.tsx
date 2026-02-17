"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Business {
  id: number;
  name: string;
  story: string;
  aiAnalysis: string;
  tags: string;
  createdAt: string;
}

export default function Home() {
  const [name, setName] = useState("");
  const [story, setStory] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [history, setHistory] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // --- 1. データ取得 (console.logを整理) ---
  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/businesses");
      const data = await res.json();
      if (Array.isArray(data)) {
        setHistory([...data].reverse());
      }
    } catch (err) {
      console.error("履歴の取得に失敗しました");
      toast.error("データの取得に失敗しました");
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  // --- 2. タグクレンジング関数 (Java側が#で返してきても対応可能) ---
  const getCleanTags = (tagString: string) => {
    if (!tagString) return [];
    // カンマ区切り、または#区切りの両方に対応
    const rawTags = tagString.includes(",") ? tagString.split(",") : tagString.split("#");
    return rawTags
      .map(tag => tag.replace(/[\*#\s\n]/g, "").trim())
      .filter(tag => tag !== "");
  };

  // --- 3. 絞り込みロジック ---
  const filteredHistory = activeTag 
    ? history.filter(item => getCleanTags(item.tags).includes(activeTag)) 
    : history;

  // --- 4. 編集開始 ---
  const startEdit = (item: Business) => {
    setEditingId(item.id);
    setName(item.name);
    setStory(item.story);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- 5. 削除処理 ---
  const handleDelete = async (id: number) => {
    if (!confirm("削除しますか？")) return;
    try {
      const res = await fetch(`http://localhost:8081/api/businesses/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("削除しました");
        fetchHistory();
      } else throw new Error();
    } catch {
      toast.error("削除に失敗しました");
    }
  };

  // --- 6. 送信処理 ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = editingId 
      ? `http://localhost:8081/api/businesses/${editingId}`
      : "http://localhost:8081/api/businesses";
    const method = editingId ? "PUT" : "POST";

    const savePromise = fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, story, monthlyRevenue: 1200000 }),
    }).then(async (res) => {
      if (!res.ok) throw new Error("Server Error");
      setEditingId(null);
      setName("");
      setStory("");
      fetchHistory();
      return res;
    });

    toast.promise(savePromise, {
      loading: "AI分析を実行中...",
      success: editingId ? "データを更新しました" : "分析が完了しました！",
      error: "通信に失敗しました。",
    });

    try {
      await savePromise;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-black">
      {/* 入力フォーム */}
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 mb-12 border-t-4 border-blue-500">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {editingId ? "📝 データを編集" : "BizData AI 分析"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input required placeholder="店名" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black" value={name} onChange={e => setName(e.target.value)} />
          <textarea required placeholder="ストーリー" className="w-full border p-3 rounded-lg h-40 focus:ring-2 focus:ring-blue-500 outline-none text-black" value={story} onChange={e => setStory(e.target.value)} />
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300">
              {loading ? "通信中..." : (editingId ? "更新して再分析" : "分析を実行する")}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setName(""); setStory(""); }} className="bg-gray-200 px-6 rounded-lg hover:bg-gray-300">キャンセル</button>
            )}
          </div>
        </form>
      </div>

      {/* フィルタ状態 */}
      {activeTag && (
        <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-blue-800 font-bold">現在 #{activeTag} で絞り込み中</p>
          <button className="text-sm bg-white px-3 py-1 rounded border shadow-sm hover:bg-gray-50" onClick={() => setActiveTag(null)}>✖️ 解除</button>
        </div>
      )}

      {/* 履歴一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {filteredHistory.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group flex flex-col h-full">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => startEdit(item)} className="hover:scale-110 transition-transform">✏️</button>
              <button onClick={() => handleDelete(item.id)} className="hover:scale-110 transition-transform">🗑️</button>
            </div>
            
            <h3 className="font-bold text-lg text-blue-600 mb-4 pr-10">{item.name}</h3>
            
            {/* Business Story: クォーテーションを自然な位置に配置 */}
            {/* Business Story: 装飾としてのクォーテーション */}
{/* Business Story: クォーテーション固定版 */}
<div className="mb-4">
  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Business Story</p>
  <div className="flex bg-gray-50 p-3 rounded-md border-l-2 border-gray-200 italic text-gray-600">
    {/* 開始の引用符 */}
    <span className="text-lg font-serif text-gray-400 self-start">&quot;</span>
    
    {/* 本文：trim() で前後の余計な改行を消去 */}
    <p className="text-sm px-1 whitespace-pre-wrap flex-1">
      {item.story.trim()}
    </p>
    
    {/* 終了の引用符：self-end で必ず右下に固定 */}
    <span className="text-lg font-serif text-gray-400 self-end">&quot;</span>
  </div>
</div>

            <div className="flex-grow">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">AI Expert Analysis</p>
              <div className="text-xs text-gray-700 leading-relaxed bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                {item.aiAnalysis || "分析中..."}
              </div>
            </div>

            {/* タグ表示 */}
            <div className="mt-4 flex flex-wrap gap-2">
              {getCleanTags(item.tags).map((tag, index) => (
                <span 
                  key={index}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-all border ${
                    activeTag === tag 
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                      : "bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200"
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
              <span className="text-[9px] text-gray-300 font-mono tracking-tighter">ID: {item.id}</span>
              <p className="text-[10px] text-gray-400">
                {item.createdAt ? new Date(item.createdAt).toLocaleString('ja-JP') : "-"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}