/**
 * 일간(日干) 기반 심리테스트형 사주 로직
 * 생년월일시를 숫자 시드로 사용해 8가지 성향 중 하나를 결정
 */

export type Gender = "male" | "female";

export interface SajuInput {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: Gender;
}

export interface SajuResult {
  typeId: number;
  typeName: string;
  title: string;
  description: string;
  keywords: string[];
  advice: string;
}

// 8가지 성향 (일간/오행 이미지에 맞춘 성격 유형)
const SAJU_TYPES: Omit<SajuResult, "typeId">[] = [
  {
    typeName: "갑목(甲木)",
    title: "늘 푸른 대나무",
    description:
      "똑바로 자라나는 대나무처럼 의지가 굳고 리더십이 있습니다. 새로운 일을 주도하며 주변을 이끄는 타입입니다. 때로는 고집이 세 보일 수 있으나, 한번 정한 길은 끝까지 가는 신뢰감을 줍니다.",
    keywords: ["리더십", "의지", "정직", "도전"],
    advice: "무리하지 말고 가끔은 휴식도 취해보세요. 주변 사람들에게도 기회를 나눠주면 더 큰 결실을 맺을 수 있습니다.",
  },
  {
    typeName: "을목(乙木)",
    title: "바람에 흔들리는 등나무",
    description:
      "유연하고 감수성이 풍부한 등나무처럼 상황에 잘 적응하며, 예술·감성 분야에 소질이 있습니다. 섬세한 관찰력으로 남의 마음을 잘 읽지만, 결정이 느릴 수 있어 용기를 내보세요.",
    keywords: ["유연함", "감성", "협력", "섬세함"],
    advice: "스스로를 너무 낮추지 마세요. 당신의 섬세함이 많은 사람에게 위로가 됩니다.",
  },
  {
    typeName: "병화(丙火)",
    title: "밝은 태양",
    description:
      "태양처럼 밝고 열정적이며 주변을 따뜻하게 만듭니다. 표현력이 뛰어나고 인기가 많지만, 감정 기복이 있을 수 있어 휴식과 조절이 필요합니다.",
    keywords: ["열정", "리더십", "표현력", "인기"],
    advice: "에너지를 나눠주다 지치지 않도록, 나만의 시간을 꼭 갖도록 하세요.",
  },
  {
    typeName: "정화(丁火)",
    title: "따뜻한 등불",
    description:
      "등불처럼 은은하고 따뜻한 존재감을 가집니다. 꼼꼼하고 분석력이 뛰어나며, 신뢰를 주는 타입입니다. 내면의 불이 꺼지지 않도록 소중한 것에 에너지를 쏟아보세요.",
    keywords: ["신뢰", "꼼꼼", "분석력", "온기"],
    advice: "완벽을 추구하다 지치지 않도록, 때로는 '충분히 좋다'를 선택해보세요.",
  },
  {
    typeName: "무토(戊土)",
    title: "넓은 산과 대지",
    description:
      "산처럼 든든하고 안정감을 주는 타입입니다. 책임감이 강하고 약속을 지키며, 주변에서 의지가 됩니다. 고집이 셀 수 있으니 다양한 의견에도 귀 기울여보세요.",
    keywords: ["안정", "책임감", "신뢰", "포용"],
    advice: "모든 짐을 혼자 지지 말고, 나눌 수 있는 것은 나눠보세요.",
  },
  {
    typeName: "기토(己土)",
    title: "비옥한 논밭",
    description:
      "논밭처럼 모든 것을 받아들이고 키우는 포용력이 있습니다. 인내심이 강하고 세밀한 일을 잘해 땀 흘려 결실을 맺는 타입입니다. 자기 자신도 소중히 돌보세요.",
    keywords: ["포용", "인내", "성실", "성장"],
    advice: "남을 돌보기 전에 자신의 컵을 채우는 시간을 가져보세요.",
  },
  {
    typeName: "경금(庚金)",
    title: "단단한 쇠와 검",
    description:
      "쇠처럼 단단한 의지와 원칙을 가진 타입입니다. 정의감이 강하고 결단력이 있으며, 어려움을 잘 견딥니다. 때로는 부드러운 말 한마디가 관계를 풍요롭게 합니다.",
    keywords: ["원칙", "결단력", "정의", "강인함"],
    advice: "원칙을 지키되, 상황에 따라 유연하게 대처해보세요.",
  },
  {
    typeName: "신금(辛金)",
    title: "빛나는 보석",
    description:
      "보석처럼 빛나며 세련된 감각을 가진 타입입니다. 완벽을 추구하고 품격을 중시하며, 예술·미학에 소질이 있습니다. 자신만의 기준을 유지하되 타인과의 조화도 생각해보세요.",
    keywords: ["세련됨", "완벽주의", "품격", "감각"],
    advice: "완벽보다 행복한 선택을 할 수 있는 날이 오길 바랍니다.",
  },
];

/**
 * 입력값을 기반으로 결정론적이면서도 '일간' 느낌의 시드 생성
 * 년월일시 + 이름 첫 글자 유니코드 등으로 시드 합산
 */
function getSeed(input: SajuInput): number {
  const dateSeed =
    input.year * 10000 +
    input.month * 100 +
    input.day +
    input.hour * 60 +
    input.minute;
  let nameSeed = 0;
  for (let i = 0; i < Math.min(input.name.length, 5); i++) {
    nameSeed += input.name.charCodeAt(i) * (i + 1);
  }
  const genderSeed = input.gender === "male" ? 7 : 13;
  return dateSeed + nameSeed + genderSeed;
}

/**
 * 시드로 0~7 중 하나의 타입 인덱스 반환 (재현 가능한 랜덤)
 */
function getTypeIndex(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return Math.floor((x - Math.floor(x)) * 8 + 0) % 8;
}

export function getSajuResult(input: SajuInput): SajuResult {
  const seed = getSeed(input);
  const typeIndex = Math.abs(getTypeIndex(seed)) % 8;
  const type = SAJU_TYPES[typeIndex];
  return {
    typeId: typeIndex,
    ...type,
  };
}
