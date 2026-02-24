import { Solar } from "lunar-javascript";

export interface SajuPillars {
  year: string;
  month: string;
  day: string;
  hour: string;
  yearHan: string;
  monthHan: string;
  dayHan: string;
  hourHan: string;
}

export interface SajuResult {
  pillars: SajuPillars;
  typeName: string;
  dayPillarName: string;
  title: string;
  description: string;
  keywords: string[];
  advice: string;
  verified: boolean;
}

// 한자 → 한글 변환 (간지 매칭용)
const hanjaToHangulMap: Record<string, string> = {
  甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계",
  子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해",
};

const STEMS_HAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
const BRANCHES_HAN = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

function toHangul(hanjaStr: string): string {
  return hanjaStr.split("").map((c) => hanjaToHangulMap[c] ?? c).join("");
}

/** 한자 간지 2글자에서 천간·지지 인덱스 (0~9, 0~11) */
function ganZhiToIndices(ganZhi: string): { stem: number; branch: number } | null {
  if (ganZhi.length < 2) return null;
  const gan = ganZhi[0];
  const zhi = ganZhi[1];
  const stem = STEMS_HAN.indexOf(gan as (typeof STEMS_HAN)[number]);
  const branch = BRANCHES_HAN.indexOf(zhi as (typeof BRANCHES_HAN)[number]);
  if (stem < 0 || branch < 0) return null;
  return { stem, branch };
}

function getInterpretation(
  dayStem: number,
  dayBranch: number
): { title: string; description: string; keywords: string[]; advice: string } {
  const titles: Record<number, string> = {
    0: "늘 푸른 대나무", 1: "바람에 흔들리는 등나무", 2: "밝은 태양", 3: "따뜻한 등불",
    4: "넓은 산과 대지", 5: "비옥한 논밭", 6: "단단한 쇠와 검", 7: "빛나는 보석",
    8: "넓은 바다", 9: "맑은 이슬",
  };
  const stemNames = ["갑목", "을목", "병화", "정화", "무토", "기토", "경금", "신금", "임수", "계수"];
  const branchNames = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
  return {
    title: titles[dayStem] ?? "나만의 사주",
    description: "당신의 일간과 일지가 만드는 성향입니다. 사주는 참고용으로만 활용하세요.",
    keywords: [stemNames[dayStem] ?? "", branchNames[dayBranch] ?? ""].filter(Boolean),
    advice: "오늘도 좋은 하루 되세요.",
  };
}

/** 검증용: 기대 한자 4기둥 (년 월 일 시) */
const EXPECTED_CASE_A = "乙亥 己卯 庚申 己卯";
const EXPECTED_CASE_B = "乙酉 丁亥 丁未 庚子";
const EXPECTED_CASE_C = "壬戌 壬子 辛卯 癸巳";

/** 3개 검증 케이스가 정확히 나오는지 내부 점검 (개발/테스트용) */
export function verifyEngine(): boolean {
  const a = calculateSaju(1995, 3, 30, 5, 32);
  const b = calculateSaju(2005, 11, 18, 23, 44);
  const c = calculateSaju(1983, 1, 3, 10, 25);
  const gotA = `${a.pillars.yearHan} ${a.pillars.monthHan} ${a.pillars.dayHan} ${a.pillars.hourHan}`;
  const gotB = `${b.pillars.yearHan} ${b.pillars.monthHan} ${b.pillars.dayHan} ${b.pillars.hourHan}`;
  const gotC = `${c.pillars.yearHan} ${c.pillars.monthHan} ${c.pillars.dayHan} ${c.pillars.hourHan}`;
  const ok = gotA === EXPECTED_CASE_A && gotB === EXPECTED_CASE_B && gotC === EXPECTED_CASE_C;
  if (!ok) {
    console.error("만세력 검증 실패:", { gotA, gotB, gotC, EXPECTED_CASE_A, EXPECTED_CASE_B, EXPECTED_CASE_C });
  }
  return ok;
}

export function calculateSaju(
  y: number,
  m: number,
  d: number,
  h?: number,
  min?: number
): SajuResult {
  const solar = Solar.fromYmdHms(
    y,
    m,
    d,
    h !== undefined ? h : 12,
    min !== undefined ? min : 0,
    0
  );
  const lunar = solar.getLunar();
  const bazi = lunar.getEightChar();

  const yearHan = bazi.getYear();
  const monthHan = bazi.getMonth();
  let dayHan = bazi.getDay();
  const hourNum = h !== undefined ? h : 12;

  // 야자시/조자시 보정: 23시 이후면 일주를 다음 날 것으로 계산
  if (hourNum >= 23) {
    const nextDaySolar = solar.next(1);
    dayHan = nextDaySolar.getLunar().getEightChar().getDay();
  }

  const year = toHangul(yearHan);
  const month = toHangul(monthHan);
  const day = toHangul(dayHan);
  // 시간 정보가 있을 때만 시주 계산, 없으면 공란
  const hour = h !== undefined ? toHangul(bazi.getTime()) : "";
  const hourHan = h !== undefined ? bazi.getTime() : "";

  const typeName = hour
    ? `${year}년 ${month}월 ${day}일 ${hour}시`
    : `${year}년 ${month}월 ${day}일 (시간모름)`;
  const dayPillarName = `${day}일주`;

  const indices = ganZhiToIndices(dayHan);
  const dayStem = indices?.stem ?? 0;
  const dayBranch = indices?.branch ?? 0;
  const { title, description, keywords, advice } = getInterpretation(dayStem, dayBranch);

  const verified =
    hourHan !== "" &&
    (`${yearHan} ${monthHan} ${dayHan} ${hourHan}` === EXPECTED_CASE_A ||
      `${yearHan} ${monthHan} ${dayHan} ${hourHan}` === EXPECTED_CASE_B ||
      `${yearHan} ${monthHan} ${dayHan} ${hourHan}` === EXPECTED_CASE_C);

  return {
    pillars: {
      year,
      month,
      day,
      hour,
      yearHan,
      monthHan,
      dayHan,
      hourHan,
    },
    typeName,
    dayPillarName,
    title,
    description,
    keywords,
    advice,
    verified,
  };
}
