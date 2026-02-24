"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateSaju, type SajuResult } from "@/lib/sajuCalendar";
import { sendToGoogleSheets } from "@/lib/googleSheets";
import type { Gender } from "@/lib/sajuLogic";
import { iljuDetails } from "@/lib/iljuDetails";
import LoadingAnimation from "@/components/LoadingAnimation";
import ResultSection from "@/components/ResultSection";

const STEPS = { form: "form", loading: "loading", result: "result" } as const;

function formatBirthDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatBirthTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export default function Home() {
  const [step, setStep] = useState<keyof typeof STEPS>("form");
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("0");
  const [gender, setGender] = useState<Gender>("male");
  const [result, setResult] = useState<SajuResult | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 99 + i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    const h = parseInt(hour, 10);
    const min = parseInt(minute, 10);
    if (!name.trim() || !year || !month || !day || isNaN(y) || isNaN(m) || isNaN(d)) {
      alert("이름과 생년월일을 모두 입력해 주세요.");
      return;
    }
    if (m < 1 || m > 12 || d < 1 || d > 31) {
      alert("올바른 날짜를 입력해 주세요.");
      return;
    }

    setStep("loading");

    const hourNum = isNaN(h) ? 12 : h;
    const minuteNum = isNaN(min) ? 0 : min;

    await new Promise((r) => setTimeout(r, 2200));
    const res = calculateSaju(y, m, d, hourNum, minuteNum);
    setResult(res);

    try {
      await sendToGoogleSheets({
        name: name.trim(),
        birthDate: formatBirthDate(y, m, d),
        birthTime: formatBirthTime(hourNum, minuteNum),
        gender: gender === "male" ? "남" : "여",
        resultType: res.typeName,
        resultTitle: res.title,
      });
    } catch {}

    setStep("result");
  };

  const handleShareKakao = () => {
    if (!result) return;
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const iljuName = result.pillars.day;
    const detail = iljuDetails[iljuName];
    const threeLines = detail?.characteristics?.slice(0, 3).map((c) => `✔️ ${c}`).join("\n")
      ?? `${result.title}\n✔️ 당신의 일간과 일지가 만드는 성향입니다.`;
    const shareMessage = `✨ [나의 사주 운명 결과] ✨\n\n${name}님은 어떤 사람일까요? 👀\n\n${threeLines}\n\n... (더 보기)\n\n👇 3초만에 내 운명 확인하기\n${shareUrl}`;
    const copyAndAlert = () => {
      copyToClipboard(shareMessage);
      alert("링크와 결과가 복사되었습니다. 카톡창에 붙여넣어 주세요!");
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: "나의 사주 결과",
          text: shareMessage,
        })
        .catch(copyAndAlert);
    } else {
      copyAndAlert();
    }
  };

  return (
    <main className="min-h-screen pattern-bg pb-8">
      <div className="max-w-lg mx-auto px-4 pt-6 sm:pt-10">
        <motion.header
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-block mb-3 text-gold/60 text-3xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            ☯
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gold tracking-wide">
            나의 사주 운명
          </h1>
          <p className="text-gold/70 text-sm mt-2">
            이름과 생년월일로 읽는 나만의 사주
          </p>
        </motion.header>

        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="rounded-xl border border-gold/30 bg-deep/60 backdrop-blur p-5"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-gold/90 text-sm font-medium mb-2">
                  이름
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 rounded-lg bg-deep border border-gold/40 text-gold placeholder-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  maxLength={20}
                />
              </motion.div>

              <motion.div
                className="rounded-xl border border-gold/30 bg-deep/60 backdrop-blur p-5"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <label className="block text-gold/90 text-sm font-medium mb-2">
                  생년월일
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="px-3 py-3 rounded-lg bg-deep border border-gold/40 text-gold focus:outline-none focus:ring-2 focus:ring-gold/50"
                  >
                    <option value="">년</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}년
                      </option>
                    ))}
                  </select>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="px-3 py-3 rounded-lg bg-deep border border-gold/40 text-gold focus:outline-none focus:ring-2 focus:ring-gold/50"
                  >
                    <option value="">월</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {m}월
                      </option>
                    ))}
                  </select>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="px-3 py-3 rounded-lg bg-deep border border-gold/40 text-gold focus:outline-none focus:ring-2 focus:ring-gold/50"
                  >
                    <option value="">일</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        {d}일
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>

              <motion.div
                className="rounded-xl border border-gold/30 bg-deep/60 backdrop-blur p-5"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-gold/90 text-sm font-medium mb-2">
                  태어난 시간
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className="px-3 py-3 rounded-lg bg-deep border border-gold/40 text-gold focus:outline-none focus:ring-2 focus:ring-gold/50"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i}시
                      </option>
                    ))}
                  </select>
                  <select
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    className="px-3 py-3 rounded-lg bg-deep border border-gold/40 text-gold focus:outline-none focus:ring-2 focus:ring-gold/50"
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {i}분
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>

              <motion.div
                className="rounded-xl border border-gold/30 bg-deep/60 backdrop-blur p-5"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <label className="block text-gold/90 text-sm font-medium mb-2">
                  성별
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === "male"}
                      onChange={() => setGender("male")}
                      className="w-4 h-4 accent-gold"
                    />
                    <span className="text-gold">남성</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === "female"}
                      onChange={() => setGender("female")}
                      className="w-4 h-4 accent-gold"
                    />
                    <span className="text-gold">여성</span>
                  </label>
                </div>
              </motion.div>

              <motion.button
                type="submit"
                className="w-full py-4 rounded-xl bg-gold text-deep font-bold text-lg shadow-lg hover:bg-gold-light active:scale-[0.98] transition-colors"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                나의 운명 확인하기
              </motion.button>
            </motion.form>
          )}

          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingAnimation />
            </motion.div>
          )}

          {step === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ResultSection
                name={name}
                result={result}
                onShareKakao={handleShareKakao}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {step === "result" && (
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              type="button"
              onClick={() => {
                setStep("form");
                setResult(null);
              }}
              className="text-gold/70 text-sm underline hover:text-gold"
            >
              다시 풀어보기
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}

function copyToClipboard(text: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return;
  }
  navigator.clipboard.writeText(text);
}
