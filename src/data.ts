/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Inquiry } from './types';

// Let's resolve the actual image URLs we generated.
// Mapping the uploaded raw original images to their correct product labels
const images = {
  // 01. UG 오렌지 철재거치 -> 사용자가 제공한 새로운 고화질 이미지 적용
  ug: '/assets/images/regenerated_image_1781685239299.png',
  
  // 02. 소형 백색 주입용 (White cylinder chemical tank with grey framing and green tape caps)
  un: '/assets/images/uploaded_tank_2_1781683222315.jpg',
  
  // 03. 안전 가드데크 사다리 (Single orange tank with yellow guardrail and yellow ladder outside) -> 고화질 재생성 파일 적용
  deck: '/assets/images/regenerated_image_1781685912943.png',
  
  // 04. 공장 거치형 주황보강 (Orange storage tanks with overhead rectangular frames) -> 고화질 재생성 파일 적용
  ud: '/assets/images/regenerated_image_1781685907524.png',
  
  // 05. UN120 눈금 백색원형 (Cylindrical container with graduation lines and UN120 print)
  small: '/assets/images/uploaded_tank_5_1781683266079.jpg',
  
  // 06. 사각 도징용 백색탱크 (White square dosing container with white lid)
  kid: '/assets/images/uploaded_tank_6_1781683278949.jpg',
  
  // 07. 광택 STS 보강 밴드 (Orange tanks wrapped in stainless steel bands)
  sts: '/assets/images/uploaded_tank_7_1781683291987.jpg',
  
  // 08. 야외 주황 가드 사다리 (Orange tank safety frame and yellow cage ladder inside facility)
  deck_ladder: '/assets/images/uploaded_tank_8_1781683306440.jpg',
};

export const PRODUCT_DATA: Product[] = [
  {
    id: 'ug-3000',
    name: 'PE 케미칼탱크 UG형',
    category: 'UG_STANDARD',
    categoryName: 'UG 보강형 일반 탱크',
    image: images.ug,
    capacity: '1,000 L ~ 30,000 L',
    dimensions: '다양한 표준용적 규격품',
    features: [
      '고밀도 폴리에틸렌(HDPE) 원료 일체 회전 성형 공법',
      '신강도 높은 뛰어난 내충격성 및 강력한 내약품 복원',
      '기본 이중 보강 밴드 장착으로 반영구적 수명 보장',
      '산, 알칼리성 화합물 및 다양한 케미칼 정밀 보관소',
    ],
    specs: {
      model: 'UG-STANDARD',
      capacity: '1,000 ~ 30,000 L',
      diameter: '1,095 ~ 2,800 mm',
      height: '1,430 ~ 5,670 mm',
      manhole: 'Ø 450 ~ 600 mm',
      thickness: '6 ~ 15 mm',
    },
    isNew: true,
  },
  {
    id: 'un-mixer',
    name: 'PE 케미칼탱크 교반형',
    category: 'UN_AGITATION',
    categoryName: 'UN조 탱크',
    image: images.un,
    capacity: '1,000 L ~ 5,000 L',
    dimensions: '상부 모터 보강 프레임 규격',
    features: [
      '상부 구동부 감속 기어모터 최적 설계 마운트',
      '완벽 기밀 구조 채택으로 회전 가스 완벽 누설 차단',
      'SUS316 / 테플론 몰딩 샤프트 선택 기본 사양',
      '화합 반응 공정 및 다양한 고주파 액상 혼합조 전용',
    ],
    specs: {
      model: 'UN-MIXER',
      capacity: '1,000 ~ 5,000 L',
      diameter: '1,095 ~ 1,880 mm',
      height: '1,430 ~ 2,430 mm',
      manhole: 'Ø 450 mm',
      thickness: '6 ~ 10 mm',
    },
    isNew: true,
  },
  {
    id: 'sts-band-tank',
    name: 'PE 케미칼탱크 STS밴드형',
    category: 'DECK_STS',
    categoryName: 'STS 보강형 일반 탱크',
    image: images.sts,
    capacity: '10,000 L ~ 30,000 L',
    dimensions: '다중 강도 보강 밴딩형',
    features: [
      '스테인리스 고탄력 외력 밴드를 고밀도 등간격 배치',
      '야외 설치 시 장기 수위 변동 배부름 변형 최소화',
      '최고 등급 화학 플랜트 규격에 맞춘 안전성 명품 시공 사양',
    ],
    specs: {
      model: 'STS-BAND-MAX',
      capacity: '10,000 ~ 30,000 L',
      diameter: '2,340 ~ 2,800 mm',
      height: '3,060 ~ 5,670 mm',
      manhole: 'Ø 600 mm',
      thickness: '12 ~ 15 mm',
    },
    isNew: true,
  },
  {
    id: 'deck-type-tank',
    name: 'PE 케미칼탱크 DECK 형',
    category: 'DECK_STS',
    categoryName: 'STS 보강형 일반 탱크',
    image: images.deck,
    capacity: '5,000 L ~ 30,000 L',
    dimensions: '상부 스틸/SUS 난간 무장형',
    features: [
      '상부 전면부 안전 체크 안전 플레이트 데크판 일체 시공',
      '고고도 안전 난간 가이드 및 외부 안전 규격 수직 사다리',
      '유동량이 과대하여 수시 안전 점검이 필요한 사이트 최적형',
    ],
    specs: {
      model: 'DK-STAGE-PRO',
      capacity: '5,000 ~ 30,000 L',
      diameter: '1,880 ~ 2,800 mm',
      height: '2,430 ~ 5,670 mm',
      manhole: 'Ø 500 ~ 600 mm',
      thickness: '8 ~ 15 mm',
    },
    isNew: true,
  },
  {
    id: 'ud-discharge-tank',
    name: 'PE 케미칼탱크 하부배출형',
    category: 'UD_DISCHARGE',
    categoryName: 'UD 완전배출 탱크',
    image: images.ud,
    capacity: '1,000 L ~ 10,000 L',
    dimensions: '바닥 Cone-Bottom 콘형 배출',
    features: [
      '하부 초정밀 원추형 성형 사양으로 잔량 제로 100% 완전출액',
      '침전 정체 부식을 원천 예방하고 대형 플랜지 배관 완봉 연결',
      '전용 설계된 충격 및 진화 예방 고품격 아웃라인 스탠드 프레임',
    ],
    specs: {
      model: 'UD-CONE',
      capacity: '1,000 ~ 10,000 L',
      diameter: '1,095 ~ 2,340 mm',
      height: '1,430 ~ 3,060 mm',
      manhole: 'Ø 450 ~ 500 mm',
      thickness: '6 ~ 14 mm',
    },
    isNew: true,
  },
  {
    id: 'un-standard-tank',
    name: 'PE 케미칼탱크 UN형',
    category: 'UN_AGITATION',
    categoryName: 'UN조 탱크',
    image: images.small,
    capacity: '500 L ~ 3,000 L',
    dimensions: '소형 도징 약질 주입형',
    features: [
      '자가 체크용 약액 스케일 투과 눈금 바디 시스템 탑재',
      '소형 피스톤식 / 다이아프램식 정량 주입 펌프 장착 편의성',
      '수처리 반응물질 공급 및 소규모 연수 수처리 콤팩트 모델',
    ],
    specs: {
      model: 'UN-SMALL',
      capacity: '500 ~ 3,000 L',
      diameter: '920 ~ 1,535 mm',
      height: '1,180 ~ 2,080 mm',
      manhole: 'Ø 450 mm',
      thickness: '4 ~ 8 mm',
    },
    isNew: true,
  },
  {
    id: 'kid-dosing-tank',
    name: 'PE 케미칼탱크 KID형',
    category: 'UN_AGITATION',
    categoryName: 'UN조 탱크',
    image: images.kid,
    capacity: '200 L ~ 1,000 L',
    dimensions: '사각 콤팩트 실험실 설계',
    features: [
      '정형 사각형 몸체로 계량 장치 및 펌프 패널 상부 배치 유리',
      '공간 집적도가 극대화된 복도, 좁은 가압 지하 장소 진입 편리',
      '투과성이 우수하여 한눈에 액 보존량 확인 가능한 스페셜 바디',
    ],
    specs: {
      model: 'KID-CUBE',
      capacity: '200 ~ 1,000 L',
      diameter: '폭 650 ~ 1,200 mm',
      height: '850 ~ 1,180 mm',
      manhole: 'Ø 350 mm',
      thickness: '4 ~ 6 mm',
    },
    isNew: true,
  },
  {
    id: 'un-mixed-agitation',
    name: 'PE 케미칼탱크 UN조 교반형',
    category: 'UN_AGITATION',
    categoryName: 'UN조 탱크',
    image: images.deck_ladder,
    capacity: '1,000 L ~ 5,000 L',
    dimensions: '진동 방지 강화 플레이트',
    features: [
      '상시 급정 가동 수력 저항에 맞서도록 이중 상판 프레임 성형',
      '회전 시 발생하는 축 흔들림을 원천 억제하는 고정형 마운팅 피벗',
      '농수산 특수 액비 기화 정밀 교반 및 고강성 하수 응집 탱크 최적',
    ],
    specs: {
      model: 'UN-AGITATOR-PRO',
      capacity: '1,000 ~ 5,000 L',
      diameter: '1,095 ~ 1,880 mm',
      height: '1,430 ~ 2,430 mm',
      manhole: 'Ø 450 ~ 500 mm',
      thickness: '6 ~ 10 mm',
    },
    isNew: true,
  },
];

export const STATIC_SPEC_TABLE = [
  { model: 'UG-30000', capacity: '30,000 L', diameter: '2,800 mm', height: '5,670 mm', thickness: '15t' },
  { model: 'UG-20000', capacity: '20,000 L', diameter: '2,800 mm', height: '3,980 mm', thickness: '13~15t' },
  { model: 'UG-15000', capacity: '15,000 L', diameter: '2,570 mm', height: '3,600 mm', thickness: '12~14t' },
  { model: 'UG-10000', capacity: '10,000 L', diameter: '2,340 mm', height: '3,060 mm', thickness: '12~14t' },
  { model: 'UG-8000',  capacity: '8,000 L',  diameter: '2,110 mm', height: '3,000 mm', thickness: '12~14t' },
  { model: 'UG-6000',  capacity: '6,000 L',  diameter: '1,900 mm', height: '2,870 mm', thickness: '10~12t' },
  { model: 'UG-5000',  capacity: '5,000 L',  diameter: '1,880 mm', height: '2,430 mm', thickness: '7~9t' },
  { model: 'UG-4000',  capacity: '4,000 L',  diameter: '1,710 mm', height: '2,380 mm', thickness: '7~9t' },
  { model: 'UG-3000',  capacity: '3,000 L',  diameter: '1,535 mm', height: '2,080 mm', thickness: '6~8t' },
  { model: 'UG-2000',  capacity: '2,000 L',  diameter: '1,380 mm', height: '1,760 mm', thickness: '5~6t' },
  { model: 'UG-1500',  capacity: '1,500 L',  diameter: '1,240 mm', height: '1,700 mm', thickness: '5~6t' },
  { model: 'UG-1000',  capacity: '1,000 L',  diameter: '1,095 mm', height: '1,430 mm', thickness: '4~6t' },
  { model: 'UG-800',   capacity: '800 L',   diameter: '990 mm',   height: '1,450 mm', thickness: '4~6t' },
  { model: 'UG-600',   capacity: '600 L',   diameter: '925 mm',   height: '1,180 mm', thickness: '4~5t' },
  { model: 'UG-400',   capacity: '400 L',   diameter: '840 mm',   height: '1,050 mm', thickness: '4~5t' },
  { model: 'UG-200',   capacity: '200 L',   diameter: '650 mm',   height: '850 mm',   thickness: '3~4t' },
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-101',
    companyName: '(주)한일화학개발',
    picName: '정우성 부장',
    phone: '010-4492-3882',
    email: 'wsjung@hanilchem.co.kr',
    productType: '케미칼저장탱크 (UG 일반형)',
    capacityNeeded: '10,000 리터 (10톤) 2기',
    content: '신설 공장 염산 저장조 설계용으로 외장 보강 밴드가 강화된 사양의 규격과 도면, 그리고 견적 공문을 요청합니다.',
    hasDrawings: false,
    submittedAt: '2026-06-15 14:32',
    status: '검토중',
  },
  {
    id: 'inq-102',
    companyName: '태평양테크',
    picName: '이지은 과장',
    phone: '010-8273-1996',
    email: 'jieun@taepyoungtech.com',
    productType: '완전배출형 (UD)',
    capacityNeeded: '5,000 리터 (5톤) 1기',
    content: '중화제 투입용 완전배출형 탱크 견적 및 매설 안전 프레임 상세 규격 요청드립니다. 설계 캐드 도면이 있으시면 메일로 전송 부탁드립니다.',
    hasDrawings: true,
    drawingFileName: 'discharge_support_spec.dwg',
    submittedAt: '2026-06-16 09:15',
    status: '접수대기',
  },
];
