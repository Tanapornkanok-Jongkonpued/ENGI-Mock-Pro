import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Send, Trash2, Copy, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendChatMessage } from "../api/gemini";
import { useUIStore } from "../stores/uiStore";
import { updateStreak } from "../hooks/useStreak";
import { checkAchievements } from "../hooks/useAchievements";
import { achievementDefs } from "../data/achievements";
import type { ChatMessage } from "../types";

export default function AiChat() {
  const { t } = useTranslation();
  const { language, addToast } = useUIStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(messages, userMsg.content);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        timestamp: new Date().toISOString(),
      };
      setMessages([...newMessages, aiMsg]);
      updateStreak();
      // Check AI explorer achievement
      const newBadges = checkAchievements();
      newBadges.forEach((id) => {
        const def = achievementDefs.find((a) => a.id === id);
        if (def)
          addToast({
            type: "achievement",
            message: t("achievementUnlocked", {
              name: language === "th" ? def.titleTH : def.titleEN,
            }),
            duration: 5000,
          });
      });
    } catch {
      addToast({ type: "error", message: t("chatError") });
    } finally {
      setLoading(false);
    }
  }

  function copyMsg(content: string) {
    navigator.clipboard.writeText(content);
    addToast({ type: "success", message: "คัดลอกแล้ว" });
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center">
            <Bot size={20} className="text-accent-blue" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-text-primary">
              ENGI-Assistant
            </h1>
            <p className="text-xs text-text-muted">{t("aiSystemHint")}</p>
          </div>
        </div>
        <button
          onClick={() => setMessages([])}
          className="btn-ghost flex items-center gap-1.5 text-sm"
        >
          <Trash2 size={14} /> {t("clearChat")}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pr-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <Bot size={48} className="text-text-muted" />
            <p className="text-text-muted text-sm max-w-xs">
              ถามเกี่ยวกับข้อสอบ กว. สูตร กฎหมาย หรือแนวทางการเรียน
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 w-full max-w-sm">
              {[
                "อธิบาย Carnot Cycle ให้เข้าใจง่าย",
                "กฎหมายวิชาชีพวิศวกรรม มาตรา 26 คืออะไร",
                "วิธีคำนวณ EOQ แบบ step-by-step",
                "เปรียบเทียบ CSTR กับ PFR",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="glass-card px-3 py-2 text-left text-xs text-text-muted hover:text-text-primary hover:border-accent-gold/30 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center mr-2 shrink-0 mt-1">
                  <Bot size={14} className="text-accent-blue" />
                </div>
              )}
              <div
                className={`max-w-[80%] group relative ${m.role === "user" ? "bg-accent-gold/10 border border-accent-gold/20" : "glass-card"} rounded-2xl px-4 py-3`}
              >
                <pre className="whitespace-pre-wrap text-sm text-text-primary font-sans leading-relaxed">
                  {m.content}
                </pre>
                {m.role === "assistant" && (
                  <button
                    onClick={() => copyMsg(m.content)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-text-primary"
                  >
                    <Copy size={12} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="w-7 h-7 rounded-full bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center mr-2 shrink-0">
              <Bot size={14} className="text-accent-blue" />
            </div>
            <div className="glass-card rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-accent-blue rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-3">
        <input
          className="input-field flex-1"
          placeholder={t("aiPlaceholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="btn-gold px-4 disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
