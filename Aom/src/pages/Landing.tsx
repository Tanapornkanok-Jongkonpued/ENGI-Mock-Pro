import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Zap,
  BookOpen,
  BarChart2,
  Brain,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function Landing() {
  useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    setSize();

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.2 + 0.05,
      alpha: Math.random(),
    }));

    let raf: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,200,66,${s.alpha})`;
        ctx.fill();
        s.y -= s.speed;
        s.alpha = Math.abs(Math.sin(Date.now() * 0.001 + s.x));
        if (s.y < 0) s.y = canvas.offsetHeight;
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  const features = [
    {
      icon: <Brain size={28} className="text-accent-gold" />,
      title: "AI สร้างข้อสอบ",
      desc: "ระบบ Google Gemini สร้างข้อสอบเฉพาะตัว ตรงสาขาที่คุณเลือก",
    },
    {
      icon: <BookOpen size={28} className="text-accent-gold" />,
      title: "ครอบคลุม 6 สาขา",
      desc: "โยธา ไฟฟ้า เครื่องกล อุตสาหการ เคมี สิ่งแวดล้อม",
    },
    {
      icon: <BarChart2 size={28} className="text-accent-gold" />,
      title: "วิเคราะห์ผลลัพธ์",
      desc: "ดูจุดอ่อน-จุดแข็ง วางแผนการอ่านหนังสืออย่างมีเป้าหมาย",
    },
    {
      icon: <Zap size={28} className="text-accent-gold" />,
      title: "สอบทดลองสมจริง",
      desc: "โหมด Mock สอบเหมือนจริงพร้อมจับเวลา + Leaderboard",
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-accent-gold mb-8">
            <Sparkles size={12} /> Powered by Google Gemini AI
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl font-extrabold leading-tight mb-4">
            <span className="text-text-primary">ENGI</span>
            <span className="text-accent-gold">-Mock</span>
            <span className="ml-3 text-text-primary">Pro</span>
          </h1>
          <p className="text-lg text-text-muted mb-3">
            แพลตฟอร์มเตรียมสอบใบประกอบวิชาชีพวิศวกรรม (กว.)
          </p>
          <p className="text-sm text-text-muted mb-10">
            ข้อสอบสร้างโดย AI • วิเคราะห์ผล • ฝึกทำได้ตลอด 24/7
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth/register"
              className="btn-gold text-base px-8 py-3 rounded-xl font-bold w-full sm:w-auto text-center"
            >
              <ArrowRight size={16} className="inline" /> เริ่มต้นฟรี
            </Link>
            <Link
              to="/auth/login"
              className="btn-outline text-base px-8 py-3 rounded-xl w-full sm:w-auto text-center"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-text-muted text-xs flex flex-col items-center gap-1">
          <span>เลื่อนดูเพิ่มเติม</span>
          <span>↓</span>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 max-w-5xl mx-auto" id="features">
        <h2 className="font-heading text-3xl font-extrabold text-center mb-12">
          ทำไมต้อง <span className="text-accent-gold">ENGI-Mock Pro</span>?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass-card p-6 text-center hover:-translate-y-1 transition-transform"
            >
              <div className="flex justify-center mb-4">{f.icon}</div>
              <h3 className="font-semibold text-text-primary mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white/2 border-t border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 flex flex-wrap justify-around gap-8 text-center">
          {[
            ["50,000+", "ข้อสอบในระบบ"],
            ["6", "สาขาวิชา"],
            ["10,000+", "ผู้ใช้งาน"],
            ["98%", "ความพึงพอใจ"],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="font-heading text-3xl font-extrabold text-accent-gold">
                {n}
              </p>
              <p className="text-text-muted text-sm mt-1">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center max-w-2xl mx-auto">
        <h2 className="font-heading text-3xl font-bold mb-4">
          พร้อมพิชิต กว. แล้วหรือยัง?
        </h2>
        <p className="text-text-muted mb-8">
          สมัครฟรี ไม่มีค่าใช้จ่าย ฝึกทำข้อสอบได้ทันที
        </p>
        <Link
          to="/auth/register"
          className="btn-gold text-base px-10 py-3 rounded-xl font-bold inline-block"
        >
          เริ่มต้นตอนนี้ →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center text-xs text-text-muted">
        <p>
          ENGI-Mock Pro © 2025 • สร้างโดยใช้ React + Vite + Google Gemini AI
        </p>
      </footer>
    </div>
  );
}
