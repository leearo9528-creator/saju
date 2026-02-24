"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import type { SajuResult } from "@/lib/sajuCalendar";
import { detailedInterpretations } from "@/lib/detailedInterpretations";
import { iljuDetails, normalizeDetail } from "@/lib/iljuDetails";

interface ResultSectionProps {
  name: string;
  result: SajuResult;
  onShareKakao: () => void;
}

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0 },
};

export default function ResultSection({
  name,
  result,
  onShareKakao,
}: ResultSectionProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const { pillars } = result;
  const fromIljuDetails = normalizeDetail(iljuDetails[pillars.day]);
  const fromDetailed = detailedInterpretations[pillars.day] ?? detailedInterpretations._default;
  const detail = fromIljuDetails ?? fromDetailed;

  const handleDownloadImage = async () => {
    if (captureRef.current === null) return;
    try {
      // 1. 화질 개선을 위해 픽셀 밀도를 3배로 높임 (pixelRatio)
      // 2. 폰트 깨짐 방지를 위해 캐시 버스팅 사용
      const dataUrl = await toPng(captureRef.current, {
        cacheBust: true,
        backgroundColor: "#111111", // 실제 배경색과 맞춤
        pixelRatio: 3, // 숫자가 높을수록 고화질 (너무 높으면 파일이 무거워짐)
        style: {
          // 캡처 시 레이아웃이 틀어지지 않도록 강제 고정
          transform: "scale(1)",
        },
      });
      const link = document.createElement("a");
      link.download = `${name}님의_사주결과.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("이미지 저장 실패", err);
      alert("이미지 저장에 실패했습니다.");
    }
  };

  return (
    <motion.section
      className="w-full max-w-lg mx-auto px-4 pb-24"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="result-card-gradient-border"
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="rounded-2xl bg-deep/95 backdrop-blur result-card-glow relative overflow-hidden">
          {/* 캡처 영역: 버튼 제외, 이미지 저장 시 여백 확보 */}
          <div ref={captureRef} className="rounded-t-2xl bg-[#1a1a24] p-8 sm:p-10 relative">
          {/* 카드 위 은은한 반짝임 입자 */}
          <div className="absolute inset-0 pointer-events-none">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.span
                key={i}
                className="absolute w-1 h-1 rounded-full bg-gold"
                style={{
                  left: `${8 + (i * 15) % 84}%`,
                  top: `${12 + (i * 18) % 76}%`,
                }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.4, 0],
                }}
                transition={{
                  duration: 2.8,
                  delay: 1.2 + i * 0.4,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                }}
              />
            ))}
          </div>

          <p className="text-gold/80 text-sm mb-5 relative">{name}님의 사주 명식</p>

          {/* 네 기둥 한자 표기 */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            <div className="text-center py-2 rounded-lg bg-gold/10 border border-gold/30">
              <p className="text-gold/70 text-xs">년주</p>
              <p className="text-gold font-bold text-lg">{pillars.yearHan}</p>
              <p className="text-gold/80 text-sm">{pillars.year}</p>
            </div>
            <div className="text-center py-2 rounded-lg bg-gold/10 border border-gold/30">
              <p className="text-gold/70 text-xs">월주</p>
              <p className="text-gold font-bold text-lg">{pillars.monthHan}</p>
              <p className="text-gold/80 text-sm">{pillars.month}</p>
            </div>
            <div className="text-center py-2 rounded-lg bg-gold/10 border border-gold/30">
              <p className="text-gold/70 text-xs">일주</p>
              <p className="text-gold font-bold text-xl">{pillars.dayHan}</p>
              <p className="text-gold/80 text-sm font-medium">{pillars.day}</p>
            </div>
            <div className="text-center py-2 rounded-lg bg-gold/10 border border-gold/30">
              <p className="text-gold/70 text-xs">시주</p>
              <p className="text-gold font-bold text-lg">{pillars.hourHan}</p>
              <p className="text-gold/80 text-sm">{pillars.hour}</p>
            </div>
          </div>

          {/* 일주 명칭 강조 */}
          <p className="text-gold font-bold text-2xl sm:text-3xl mb-8 tracking-wide text-center">
            {pillars.day}
            <span className="text-gold/90 font-semibold text-lg sm:text-xl ml-1">일주</span>
          </p>

          {/* 당신은 이런 사람? */}
          <div className="mb-8">
            <p className="text-gold/80 text-sm font-semibold mb-3">
              당신은 이런 사람?
            </p>
            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2.5"
            >
              {detail.characteristics.map((ch, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-2 text-gold/90 text-[14px] leading-relaxed"
                >
                  <span className="mt-[2px]">✅</span>
                  <span>{ch}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* 찰떡 궁합 / 조금 조심할 성향 */}
          <div className="mt-4 pt-4 border-t border-gold/20 grid gap-4 sm:grid-cols-2 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-xl bg-gold/5 border border-gold/25 p-4"
            >
              <p className="text-gold/80 text-xs font-semibold mb-2">
                찰떡 궁합 🤝
              </p>
              <ul className="space-y-1.5 text-gold/90 text-[13px] leading-relaxed">
                {detail.goodMatch.map((gm, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span>✨</span>
                    <span>{gm}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-xl bg-deep/60 border border-gold/25 p-4"
            >
              <p className="text-gold/80 text-xs font-semibold mb-2">
                조금 조심할 성향 ⚡
              </p>
              <ul className="space-y-1.5 text-gold/90 text-[13px] leading-relaxed">
                {detail.badMatch.map((bm, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span>⚡</span>
                    <span>{bm}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          </div>

          <div className="px-8 sm:px-10 pb-8 sm:pb-10 flex flex-col gap-4">
            <motion.button
              type="button"
              onClick={handleDownloadImage}
              className="w-full py-4 rounded-xl border-2 border-gold/50 text-gold font-semibold text-[15px] flex items-center justify-center gap-2 bg-deep/80 hover:bg-gold/10 active:scale-[0.98] transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>📸</span>
              결과 이미지로 저장
            </motion.button>
            <motion.button
              type="button"
              onClick={onShareKakao}
              className="w-full py-4 rounded-xl bg-[#FEE500] text-[#191919] font-bold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-[#FEE500]/30 ring-2 ring-[#FEE500]/50 active:scale-[0.98]"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 8px 24px rgba(254, 229, 0, 0.35)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span>💬</span>
              카카오톡으로 내 운세 공유하기
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
