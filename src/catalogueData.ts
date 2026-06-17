/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChemicalResistanceRecord {
  name: string;      // 약품명
  formula: string;   // 화학기호
  concentration: string; // 농도 (%)
  res20: 'GOOD' | 'OK' | 'BAD' | 'CRACK' | string; // 20℃ 성능
  res60: 'GOOD' | 'OK' | 'BAD' | 'CRACK' | string; // 60℃ 성능
  note: string;      // 비고
}

export interface UNKIDSpecRecord {
  model: string;     // 품명
  capacity: string;  // 용량 (L)
  diameter: string;  // 외경 (mm)
  height: string;    // 전고 (mm)
  thickness: string; // 두께 (mm)
  note?: string;     // 비고
}

export const CHEMICAL_RESISTANCE_DATA: ChemicalResistanceRecord[] = [
  { name: '염산 (HCl)', formula: 'HCl', concentration: '각종 농도', res20: 'GOOD', res60: 'GOOD', note: '가장 널리 유통되는 저항 성능 우수' },
  { name: '황산 (H₂SO₄)', formula: 'H₂SO₄', concentration: '10~60%', res20: 'GOOD', res60: 'GOOD', note: '안심 저장 가능' },
  { name: '황산 (H₂SO₄) 고농도', formula: 'H₂SO₄', concentration: '70%', res20: 'GOOD', res60: 'OK', note: '온도 저하 유의 필요' },
  { name: '황산 (H₂SO₄) 극고농도', formula: 'H₂SO₄', concentration: '95%', res20: 'OK', res60: 'BAD', note: '반응열 유의 및 40℃ 이하 권장' },
  { name: '질산 (HNO₃)', formula: 'HNO₃', concentration: '5~25%', res20: 'GOOD', res60: 'OK', note: '희석 질산 저항 양호' },
  { name: '질산 (HNO₃) 강산형', formula: 'HNO₃', concentration: '50%', res20: 'OK', res60: 'BAD', note: '고온 비축 삼가 권장' },
  { name: '수산화나트륨 (NaOH / 가성소다)', formula: 'NaOH', concentration: '40% 이상', res20: 'GOOD', res60: 'GOOD', note: '알칼리 중화 안심 보증' },
  { name: '차아염소산나트륨 (락스)', formula: 'NaClO', concentration: '15%', res20: 'GOOD', res60: 'GOOD', note: '수처리 정량 투입 탱크 적합' },
  { name: '불화수소산 (HF / 불산)', formula: 'HFaq', concentration: '60%', res20: 'GOOD', res60: 'GOOD', note: '폴리에틸렌 특수 특화 저장 성능 극대' },
  { name: '불화수소산 (HF / 불산)', formula: 'HFaq', concentration: '70%', res20: 'GOOD', res60: 'OK', note: '정기 점검 요망' },
  { name: '암모니아수 (NH₃aq)', formula: 'NH₃aq', concentration: '0.88 비중액', res20: 'GOOD', res60: 'GOOD', note: '특유의 가스 기밀 뚜껑 필요' },
  { name: '초산 (빙초산 / CH₃COOH)', formula: 'CH₃COOH', concentration: '10~60%', res20: 'GOOD', res60: 'GOOD', note: '농도 무관 우수 지탱' },
  { name: '에틸알코올 (주정)', formula: 'C₂H₅OH', concentration: '100%', res20: 'GOOD', res60: 'OK', note: '인화 기화 벤트 밸브 필요' },
  { name: '벤젠 (C₆H₆)', formula: 'C₆H₆', concentration: '100%', res20: 'BAD', res60: 'BAD', note: 'E(환경응력균열) 우려 대상' },
  { name: '구연산', formula: '(OH)C₃H₄(COOH)₃', concentration: '포화액', res20: 'GOOD', res60: 'GOOD', note: '양호한 비축' },
  { name: '해수 (바닷물)', formula: 'NaCl', concentration: '포화농도', res20: 'GOOD', res60: 'GOOD', note: '부식 없이 평생 안심 사용' },
  { name: '아세톤', formula: 'CH₃COCH₃', concentration: '100%', res20: 'OK', res60: 'BAD', note: '장기 비축 유의 요함' },
];

export const UN_KID_SPEC_DATA: UNKIDSpecRecord[] = [
  { model: 'UN-50', capacity: '60 L', diameter: 'Ø 430', height: '520', thickness: '3' },
  { model: 'UN-100', capacity: '120 L', diameter: 'Ø 530', height: '670', thickness: '3' },
  { model: 'UN-200', capacity: '220 L', diameter: 'Ø 630', height: '860', thickness: '3' },
  { model: 'KID-100 (사각)', capacity: '120 L', diameter: '480 x 480', height: '620', thickness: '5' },
  { model: 'KID-200 (사각)', capacity: '220 L', diameter: '570 x 570', height: '760', thickness: '5' },
];

export const CAUTION_DATA = {
  structural: [
    '본체 강도가 뛰어난 원료를 활용하여 유통 기한이 반영구적입니다.',
    '본체는 강성 및 내충격성이 뛰어난 수지를 사용하여 3,000L 이하의 탱크에는 별도 보강쇠가 필요 없습니다.',
    '울트라 탱크는 상압(상시 상압) 사용을 원칙으로 하며 가압, 감압 상태로 사용하지 않도록 강하게 권고합니다.',
    '비축 액체의 사용 온도는 지속 안정성을 위해 50℃ 이하를 권장합니다. (최대 한계온도 60℃)'
  ],
  logistics: [
    '운반중 트럭의 가대와 접촉하는 부분에는 완충재를 필히 설치하여 탱크 본체 긁힘이나 마모를 예방하십시오.',
    '탱크를 지상으로 끌어 올리거나 들어 올릴 때는 탱크 상부 특수 피팅(휀고리)이나 공식 아이볼트 전용 부속에 로프를 체결하십시오.',
    '기타 주변 배관 부속을 잡고 로프를 체결하여 당길 경우 크랙 파인 현상이 발생할 수 있습니다.'
  ],
  setup: [
    '탱크 설치 바닥은 돌출물이나 잡물이 없도록 매끈한 시멘트 몰탈 마감 완료 상태를 유지해 주어야 수압이 균일 분산됩니다.',
    '철제 가대(기초대) 위에 고정 조치할 경우, 보강 거더 안목 간격을 최소화하고 10t 이상의 철판(수평판)을 반드시 보완 지지판으로 깔아 주십시오.',
    '탱크 충수 테스트: 현장 배관 플랜지 수평 정렬을 연결한 후에는 반드시 물을 가득 채워 수위 누출 유무(배관 체결 정밀도 및 균열)를 최초 24시간 검사하신 후에 정식 케미칼 원단을 채워 넣으십시오.'
  ]
};
