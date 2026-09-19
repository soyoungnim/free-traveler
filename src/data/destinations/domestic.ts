/**
 * 국내 여행지 정적 데이터 (DATA-DESTINATIONS).
 * PROJECT_SCOPE.md에 따라 여행지 콘텐츠는 관리자 CRUD 없이 이 파일을 개발자가
 * 직접 수정해 배포한다(REQ-FUNC-055 EXCLUDED와 동일한 방향).
 *
 * 스키마 정의는 이 파일에 두고 overseas.ts에서 재사용한다(Expected Files가
 * domestic.ts/overseas.ts 두 파일로 고정되어 있어 별도 types 파일을 만들지
 * 않는다).
 */

export type DestinationScope = "domestic" | "overseas";

export interface DestinationBudget {
  /** 숙박 제외, 1인 1일 기준 대략적인 범주형 안내(정확한 가격 보장 아님) */
  excludingLodging: string;
  /** 숙박 포함, 1인 1일 기준 대략적인 범주형 안내 */
  includingLodging: string;
}

export interface DestinationTransport {
  arrival: string;
  local: string;
  payment: string;
}

export interface DestinationFood {
  name: string;
  note?: string;
}

export interface DestinationItineraryDay {
  day: number;
  plan: string;
}

export interface DestinationImage {
  url: string;
  /** 실제 장소·상황을 설명하는 한국어 대체텍스트 */
  alt: string;
}

export interface DestinationSource {
  url: string;
  label: string;
}

export interface DestinationContent {
  slug: string;
  name: string;
  scope: DestinationScope;
  /** ISO 3166-1 alpha-2. 해외 여행지는 국가 안전정보(DATA-SAFETY)와 이 값으로 매칭한다. */
  countryCode: string;
  region: string;
  themes: string[];
  recommendedSeasons: string[];
  /** 추천 여행 기간(일). */
  recommendedDays: number[];
  /** 300자 이상, 추천 대상 포함. */
  overview: string;
  /** 5개 이상. */
  highlights: string[];
  bestTime: { recommended: string; notRecommended: string };
  itinerary1d: string[];
  itinerary3d: DestinationItineraryDay[];
  budget: DestinationBudget;
  transport: DestinationTransport;
  /** 3개 이상. */
  foods: DestinationFood[];
  /** 3개 이상. */
  etiquette: string[];
  image: DestinationImage;
  /** 1개 이상. */
  sources: DestinationSource[];
  updatedAt: string;
}

export const domesticDestinations: DestinationContent[] = [
  {
    slug: "seoul",
    name: "서울",
    scope: "domestic",
    countryCode: "KR",
    region: "서울",
    themes: ["도시", "쇼핑", "미식", "역사"],
    recommendedSeasons: ["봄", "가을"],
    recommendedDays: [2, 3, 4],
    overview:
      "서울은 궁궐과 한옥마을 같은 전통 공간과 강남·성수의 현대적인 거리가 함께 있는 도시다. 지하철망이 촘촘해 짧은 일정에도 여러 동네를 효율적으로 오갈 수 있고, 야간에도 상점과 식당이 늦게까지 문을 여는 편이라 일정 밀도를 높이기 좋다. 도시 여행이 처음이거나 짧은 휴가로 다양한 경험을 압축해서 하고 싶은 여행자, 미식과 쇼핑을 동시에 즐기려는 여행자에게 추천한다. 궁궐 관람과 카페 투어, 야시장을 하루에 이어서 계획해도 이동 부담이 크지 않다. 짧은 주말 일정이라면 지하철 1일권을 활용해 궁궐과 번화가를 하루 안에 연결하는 것도 좋은 방법이다.",
    highlights: [
      "경복궁과 북촌 한옥마을 산책",
      "명동·홍대 거리 쇼핑과 길거리 음식",
      "성수동 카페 거리와 편집숍",
      "한강공원 자전거·피크닉",
      "광장시장 전통 먹거리 투어",
      "N서울타워 야경",
    ],
    bestTime: {
      recommended: "4~5월, 9~10월(온화한 기온과 단풍·벚꽃 시기)",
      notRecommended: "7~8월 장마·고온 다습 시기는 야외 일정이 힘들 수 있음",
    },
    itinerary1d: [
      "경복궁 관람 → 북촌 한옥마을 산책",
      "인사동에서 점심, 전통 공예품 구경",
      "명동 쇼핑과 길거리 음식",
      "N서울타워에서 야경 감상",
    ],
    itinerary3d: [
      { day: 1, plan: "경복궁·북촌·인사동, 명동 야시장" },
      { day: 2, plan: "홍대·연남동 거리, 한강공원 피크닉" },
      { day: 3, plan: "성수동 카페 거리, 광장시장 먹거리 투어" },
    ],
    budget: {
      excludingLodging: "1인 1일 약 6만~10만원(식비·입장료·교통비)",
      includingLodging: "1인 1일 약 12만~20만원(중급 호텔 기준)",
    },
    transport: {
      arrival: "인천국제공항에서 공항철도(AREX) 또는 리무진버스로 시내 진입",
      local: "지하철·버스 환승이 편리하며 대부분 관광지가 지하철역 도보 거리",
      payment: "교통카드(T-money)와 신용카드 대부분 매장에서 사용 가능",
    },
    foods: [
      { name: "삼겹살", note: "저녁 식사로 대중적" },
      { name: "떡볶이", note: "길거리·전문점 모두 흔함" },
      { name: "설렁탕", note: "든든한 한 끼 국밥류" },
      { name: "빙수", note: "카페 디저트로 인기" },
    ],
    etiquette: [
      "식당·카페 대부분 콜벨로 직원을 부르고 자리에서 결제하는 경우가 많음",
      "대중교통에서는 조용히 하고 노약자석을 비워두는 문화가 있음",
      "실내 신발 착용 여부는 한옥·게스트하우스 등에서 안내를 따름",
    ],
    image: {
      url: "https://images.unsplash.com/photo-1745687237545-c9975e7035f4",
      alt: "서울 경복궁에 벚꽃이 활짝 핀 봄철 풍경",
    },
    sources: [
      {
        url: "https://korean.visitkorea.or.kr",
        label: "한국관광공사 대한민국 구석구석",
      },
    ],
    updatedAt: "2026-08-20",
  },
  {
    slug: "busan",
    name: "부산",
    scope: "domestic",
    countryCode: "KR",
    region: "부산",
    themes: ["해변", "미식", "도시"],
    recommendedSeasons: ["봄", "여름", "가을"],
    recommendedDays: [2, 3],
    overview:
      "부산은 해운대·광안리 같은 해변과 감천문화마을처럼 색색의 계단식 마을이 함께 있는 항구도시다. 신선한 해산물을 파는 자갈치시장과 국제시장이 도심 가까이 있어 먹거리 여행과 바다 풍경을 같은 일정에 넣기 좋다. 서울과는 다른 분위기의 바다 도시를 원하는 여행자, 걷기 좋은 골목과 전망 좋은 카페를 좋아하는 여행자에게 추천한다. KTX로 서울에서 약 2시간 30분이면 도착해 주말 짧은 여행으로도 무리 없다. 숙소를 해운대나 남포동 중 한 곳으로 정하면 나머지 구역은 지하철로도 충분히 오갈 수 있다. 특히 KTX 부산역에서 도보로 이동 가능한 원도심 숙소를 고르면 짐을 가볍게 두고 다닐 수 있어 편리하다.",
    highlights: [
      "해운대·광안리 해변 산책",
      "감천문화마을 골목 투어",
      "자갈치시장 해산물",
      "태종대 절벽 산책로",
      "광안대교 야경",
      "국제시장·부평시장 먹거리",
    ],
    bestTime: {
      recommended: "5~6월, 9~10월(해변 산책과 야외활동에 좋은 기온)",
      notRecommended: "장마철(7월 초~중순)은 야외 일정 조정이 필요",
    },
    itinerary1d: [
      "감천문화마을 오전 산책",
      "자갈치시장에서 점심",
      "해운대 해변 산책",
      "광안리에서 야경과 저녁",
    ],
    itinerary3d: [
      { day: 1, plan: "감천문화마을, 자갈치시장, 해운대" },
      { day: 2, plan: "태종대, 국제시장, 광안리 야경" },
      { day: 3, plan: "송정 해변, 카페 거리, 부산역 주변 시장" },
    ],
    budget: {
      excludingLodging: "1인 1일 약 5만~9만원",
      includingLodging: "1인 1일 약 10만~18만원",
    },
    transport: {
      arrival: "KTX로 서울에서 약 2시간 30분, 김해국제공항 이용 가능",
      local:
        "지하철과 버스로 대부분 관광지 이동 가능, 해변 지역은 도보 이동 편리",
      payment: "교통카드·신용카드 대부분 매장에서 사용 가능",
    },
    foods: [
      { name: "돼지국밥", note: "부산식 대표 국밥" },
      { name: "밀면", note: "여름철 인기 메뉴" },
      { name: "씨앗호떡", note: "길거리 간식" },
      { name: "회·해산물", note: "자갈치시장에서 즉석 손질" },
    ],
    etiquette: [
      "시장에서는 가격을 먼저 확인하고 구매하는 것이 일반적",
      "해변에서는 지정된 흡연 구역을 지키는 것이 좋음",
      "대중교통 혼잡 시간대(출퇴근)에는 캐리어 이동에 유의",
    ],
    image: {
      url: "https://images.unsplash.com/photo-1788145748876-137bb6fd9ead",
      alt: "부산 여름 해변과 도심 스카이라인이 함께 보이는 전경",
    },
    sources: [
      {
        url: "https://korean.visitkorea.or.kr",
        label: "한국관광공사 대한민국 구석구석",
      },
    ],
    updatedAt: "2026-08-20",
  },
  {
    slug: "jeju",
    name: "제주",
    scope: "domestic",
    countryCode: "KR",
    region: "제주",
    themes: ["자연", "해변", "휴양"],
    recommendedSeasons: ["봄", "가을"],
    recommendedDays: [3, 4, 5],
    overview:
      "제주는 한라산과 오름, 해안 산책로가 어우러진 섬으로 렌터카로 자유롭게 도는 여행이 특히 인기다. 동쪽 성산일출봉부터 서쪽 협재해변까지 해안선을 따라 풍경이 크게 달라져 하루에도 여러 분위기를 경험할 수 있다. 자연 속에서 천천히 쉬고 싶은 여행자, 카페와 오름 산책을 좋아하는 여행자에게 추천한다. 비행기로 각지에서 1시간 내로 도착해 접근성도 좋다. 섬 일주가 부담스럽다면 동부나 서부 한쪽 권역만 골라 렌터카 동선을 짧게 잡는 것도 좋은 선택이다. 여름철에는 자외선이 강한 편이라 오름이나 해안 트레킹 시 모자와 자외선 차단제를 꼭 챙기는 것이 좋다.",
    highlights: [
      "성산일출봉 일출 트레킹",
      "협재·함덕 해변",
      "한라산 둘레길 산책",
      "우도 자전거 투어",
      "오설록 티뮤지엄과 카페 거리",
      "동문시장 야시장",
    ],
    bestTime: {
      recommended: "4~5월, 9~10월(선선한 기온으로 트레킹에 좋음)",
      notRecommended: "여름 태풍 시기(8~9월 일부)는 항공편 결항 가능성 고려",
    },
    itinerary1d: [
      "성산일출봉 트레킹",
      "우도 배편 이동, 자전거 투어",
      "함덕 해변에서 휴식",
      "동문시장 야시장 저녁",
    ],
    itinerary3d: [
      { day: 1, plan: "성산일출봉, 우도, 함덕 해변" },
      { day: 2, plan: "협재해변, 오설록, 애월 카페 거리" },
      { day: 3, plan: "한라산 둘레길, 서귀포 매일올레시장" },
    ],
    budget: {
      excludingLodging: "1인 1일 약 6만~11만원(렌터카·유류비 포함)",
      includingLodging: "1인 1일 약 13만~22만원",
    },
    transport: {
      arrival: "국내 각지에서 항공 1시간 내",
      local: "렌터카가 가장 편리하며 노선버스도 운행",
      payment: "신용카드 대부분 매장에서 사용 가능, 렌터카는 사전 예약 권장",
    },
    foods: [
      { name: "흑돼지", note: "제주 대표 고기 요리" },
      { name: "전복죽", note: "해녀 문화와 연결된 음식" },
      { name: "고기국수", note: "제주식 국수" },
      { name: "한라봉", note: "제철 과일" },
    ],
    etiquette: [
      "오름·둘레길은 지정된 탐방로를 벗어나지 않는 것이 원칙",
      "해변 야영·취사는 지역별 규정을 확인",
      "렌터카 운전 시 오름 근처 좁은 도로에서 서행",
    ],
    image: {
      url: "https://images.unsplash.com/photo-1740329289249-e1b8bbd56fc8",
      alt: "제주 한라산 정상에 눈이 쌓인 겨울 설경",
    },
    sources: [
      {
        url: "https://korean.visitkorea.or.kr",
        label: "한국관광공사 대한민국 구석구석",
      },
    ],
    updatedAt: "2026-08-20",
  },
  {
    slug: "gyeongju",
    name: "경주",
    scope: "domestic",
    countryCode: "KR",
    region: "경주",
    themes: ["역사", "문화유산"],
    recommendedSeasons: ["봄", "가을"],
    recommendedDays: [1, 2],
    overview:
      "경주는 신라 천년의 유적이 도심 곳곳에 남아 있는 역사 도시다. 불국사와 석굴암 같은 세계문화유산부터 동궁과 월지의 야경까지 짧은 일정에도 밀도 있게 역사 탐방을 할 수 있다. 역사와 문화유산에 관심 있는 여행자, 사진 찍기 좋은 야경 명소를 찾는 여행자에게 추천한다. 도시 자체가 크지 않아 자전거로 주요 유적을 도는 여행자도 많다. 당일치기로도 핵심 유적을 볼 수 있지만, 야경까지 보려면 최소 1박을 계획하는 것이 좋다. 자전거 대여소가 시내 곳곳에 있어 도보보다 자전거로 유적 사이를 이동하면 체력 부담을 줄일 수 있다. 짐이 많다면 경주역보다 신경주역 근처 숙소가 이동에 더 편리하다.",
    highlights: [
      "불국사·석굴암 문화유산 탐방",
      "동궁과 월지 야경",
      "대릉원 고분군 산책",
      "첨성대 주변 자전거 투어",
      "황리단길 카페 거리",
    ],
    bestTime: {
      recommended: "4~5월, 10~11월(벚꽃과 단풍 시기)",
      notRecommended: "한여름 낮 시간대는 야외 유적 탐방이 더울 수 있음",
    },
    itinerary1d: [
      "불국사·석굴암 오전 탐방",
      "대릉원·첨성대 산책",
      "황리단길에서 점심과 카페",
      "동궁과 월지 야경",
    ],
    itinerary3d: [
      { day: 1, plan: "불국사, 석굴암, 대릉원" },
      { day: 2, plan: "첨성대, 황리단길, 동궁과 월지 야경" },
      { day: 3, plan: "경주국립박물관, 보문호 주변 산책" },
    ],
    budget: {
      excludingLodging: "1인 1일 약 4만~7만원",
      includingLodging: "1인 1일 약 9만~15만원",
    },
    transport: {
      arrival: "KTX 신경주역 또는 고속버스로 접근",
      local: "시내버스와 자전거 대여가 일반적",
      payment: "교통카드·신용카드 사용 가능",
    },
    foods: [
      { name: "경주빵", note: "지역 대표 간식" },
      { name: "황남빵", note: "전통 과자류" },
      { name: "쌈밥", note: "한정식류 식사" },
    ],
    etiquette: [
      "문화유산 관람 시 지정된 구역 밖 출입 금지",
      "사찰 경내에서는 정숙 유지",
      "야간 조명 시설은 촬영 시 다른 관람객과 거리를 둘 것",
    ],
    image: {
      url: "https://images.unsplash.com/photo-1717346486980-1944518800fb",
      alt: "경주 동궁과 월지, 가을 단풍이 연못 주변을 감싼 풍경",
    },
    sources: [
      {
        url: "https://korean.visitkorea.or.kr",
        label: "한국관광공사 대한민국 구석구석",
      },
    ],
    updatedAt: "2026-08-20",
  },
  {
    slug: "gangneung",
    name: "강릉",
    scope: "domestic",
    countryCode: "KR",
    region: "강릉",
    themes: ["해변", "카페", "자연"],
    recommendedSeasons: ["봄", "여름", "가을"],
    recommendedDays: [2, 3],
    overview:
      "강릉은 안목해변의 커피거리와 경포호수, 정동진 같은 해안 명소가 모여 있는 동해안 도시다. KTX 강릉선이 개통된 뒤 서울에서 2시간 내로 접근할 수 있어 주말 여행지로 인기가 많다. 바다를 보며 커피를 마시고 천천히 걷는 여행을 좋아하는 여행자, 사진 찍기 좋은 해안 풍경을 찾는 여행자에게 추천한다. 겨울에는 눈 내린 해변과 온천 여행도 함께 즐길 수 있다. 커피거리는 낮보다 해질 무렵 방문하면 바다와 조명이 겹쳐 분위기가 한층 좋아진다. 겨울철에는 온천 여행을 함께 묶어 눈 내린 해변과 온천욕을 같은 일정에 넣는 여행자도 많다.",
    highlights: [
      "안목해변 커피거리",
      "경포호수 산책·자전거",
      "정동진 일출",
      "주문진 수산시장",
      "오죽헌 등 전통 가옥 탐방",
    ],
    bestTime: {
      recommended: "5~6월, 9~10월(해변 산책에 적합한 기온)",
      notRecommended: "한겨울 강풍 시기는 해변 활동이 제한될 수 있음",
    },
    itinerary1d: [
      "경포호수 산책",
      "안목해변 커피거리",
      "주문진 수산시장 점심",
      "정동진 해안도로 드라이브",
    ],
    itinerary3d: [
      { day: 1, plan: "경포호수, 안목해변 커피거리" },
      { day: 2, plan: "주문진 수산시장, 정동진 일출" },
      { day: 3, plan: "오죽헌, 강릉중앙시장" },
    ],
    budget: {
      excludingLodging: "1인 1일 약 5만~8만원",
      includingLodging: "1인 1일 약 10만~17만원",
    },
    transport: {
      arrival: "KTX 강릉선으로 서울에서 약 2시간",
      local: "시내버스와 렌터카 병행이 편리",
      payment: "교통카드·신용카드 사용 가능",
    },
    foods: [
      { name: "초당순두부", note: "지역 대표 음식" },
      { name: "물회", note: "여름철 인기 메뉴" },
      { name: "곳감빵", note: "카페 디저트" },
    ],
    etiquette: [
      "해변 취사·야영은 지정 구역에서만 허용",
      "수산시장에서는 가격을 먼저 확인",
      "카페 골목 주차는 지정 주차장 이용 권장",
    ],
    image: {
      url: "https://images.unsplash.com/photo-1779279285794-d6eda226bf6e",
      alt: "강릉 해변, 맑은 여름 하늘과 잔잔한 바다 풍경",
    },
    sources: [
      {
        url: "https://korean.visitkorea.or.kr",
        label: "한국관광공사 대한민국 구석구석",
      },
    ],
    updatedAt: "2026-08-20",
  },
  {
    slug: "jeonju",
    name: "전주",
    scope: "domestic",
    countryCode: "KR",
    region: "전주",
    themes: ["한옥", "미식", "문화"],
    recommendedSeasons: ["봄", "가을"],
    recommendedDays: [1, 2],
    overview:
      "전주는 700여 채의 한옥이 모여 있는 전주한옥마을을 중심으로 전통과 미식을 함께 즐길 수 있는 도시다. 비빔밥과 콩나물국밥 같은 향토 음식이 유명해 미식 여행지로도 자주 꼽힌다. 한복을 입고 한옥 골목을 걷는 사진 여행을 좋아하는 여행자, 전통문화 체험을 원하는 여행자에게 추천한다. 서울에서 KTX나 고속버스로 2~3시간이면 도착해 주말 여행으로도 적당하다. 한복 체험은 성수기 주말에 대기가 길어질 수 있어 오전 일찍 방문하는 것을 권장한다. 한옥마을 숙소는 방음이 약한 편이라 늦은 시간 큰 소리는 피하는 것이 이웃에 대한 예의다.",
    highlights: [
      "전주한옥마을 한복 체험",
      "경기전·전동성당",
      "남부시장 청년몰",
      "전주향교 산책",
      "오목대 전망대",
    ],
    bestTime: {
      recommended: "4~5월, 9~10월(한복 체험과 야외 산책에 좋은 날씨)",
      notRecommended: "한여름 고온기는 한복 체험 시 더울 수 있음",
    },
    itinerary1d: [
      "경기전·전동성당 관람",
      "한옥마을 골목 산책, 한복 체험",
      "남부시장 청년몰 점심",
      "오목대 전망대에서 마무리",
    ],
    itinerary3d: [
      { day: 1, plan: "경기전, 전동성당, 한옥마을" },
      { day: 2, plan: "남부시장, 전주향교, 오목대" },
      { day: 3, plan: "덕진공원, 전주 막걸리 골목" },
    ],
    budget: {
      excludingLodging: "1인 1일 약 4만~7만원(한복 체험비 포함)",
      includingLodging: "1인 1일 약 9만~15만원",
    },
    transport: {
      arrival: "KTX 또는 고속버스로 서울에서 약 2~3시간",
      local: "한옥마을 일대는 도보 이동이 기본",
      payment: "신용카드·현금 병용, 일부 노점은 현금 위주",
    },
    foods: [
      { name: "전주비빔밥", note: "지역 대표 음식" },
      { name: "콩나물국밥", note: "해장 음식으로 유명" },
      { name: "모주", note: "전통 음료" },
    ],
    etiquette: [
      "한복 대여 후 실내 매장 출입 시 자리 확인",
      "한옥 골목은 주거지와 인접해 있어 정숙 유지",
      "사찰·성당 관람 시 복장·소음에 유의",
    ],
    image: {
      url: "https://images.unsplash.com/photo-1779093284989-a0f8016bc895",
      alt: "전주한옥마을 기와지붕과 붉게 물든 단풍나무",
    },
    sources: [
      {
        url: "https://korean.visitkorea.or.kr",
        label: "한국관광공사 대한민국 구석구석",
      },
    ],
    updatedAt: "2026-08-20",
  },
  {
    slug: "yeosu",
    name: "여수",
    scope: "domestic",
    countryCode: "KR",
    region: "여수",
    themes: ["해변", "야경", "미식"],
    recommendedSeasons: ["봄", "여름", "가을"],
    recommendedDays: [2, 3],
    overview:
      "여수는 밤바다 야경과 해상 케이블카로 유명한 남해안 도시다. 낮에는 오동도와 향일암 같은 해안 명소를, 밤에는 이순신광장과 낭만포차 거리에서 야경을 즐길 수 있어 하루 안에도 분위기가 크게 바뀐다. 바다를 보며 야경 사진을 남기고 싶은 여행자, 해산물 미식 여행을 좋아하는 여행자에게 추천한다. KTX로 서울에서 약 3시간이면 도착한다. 야경 명소가 몰려 있어 저녁 일정에 무게를 두고 낮에는 이동 위주로 짜는 것이 효율적이다. 야경 명소가 도심에 모여 있어 저녁 시간대는 대중교통 대신 도보로 이동해도 충분하다. 여름 성수기에는 숙소가 빨리 마감되니 서둘러 예약하는 것이 좋다.",
    highlights: [
      "여수 밤바다·이순신광장 야경",
      "해상 케이블카",
      "오동도 산책로",
      "낭만포차 거리",
      "향일암 일출",
    ],
    bestTime: {
      recommended: "5~6월, 9~10월(야외 야경 산책에 좋은 기온)",
      notRecommended: "장마철은 케이블카 운행이 제한될 수 있음",
    },
    itinerary1d: [
      "오동도 산책",
      "해상 케이블카 탑승",
      "낭만포차 거리에서 저녁",
      "이순신광장 야경",
    ],
    itinerary3d: [
      { day: 1, plan: "오동도, 해상 케이블카, 낭만포차 거리" },
      { day: 2, plan: "향일암, 만성리 해변" },
      { day: 3, plan: "여수 수산시장, 이순신광장 야경" },
    ],
    budget: {
      excludingLodging: "1인 1일 약 5만~9만원(케이블카 비용 포함)",
      includingLodging: "1인 1일 약 11만~19만원",
    },
    transport: {
      arrival: "KTX로 서울에서 약 3시간",
      local: "시내버스와 도보, 해안 구간은 택시 병행",
      payment: "신용카드·교통카드 사용 가능",
    },
    foods: [
      { name: "여수 게장", note: "지역 대표 음식" },
      { name: "돌게탕", note: "해산물 국물 요리" },
      { name: "갓김치", note: "여수 특산 반찬" },
    ],
    etiquette: [
      "케이블카 탑승 시 지정 시간대 예약 권장",
      "해안 산책로는 야간 조명 구간 안전선을 지킬 것",
      "포차 거리는 혼잡 시간대 대기가 있을 수 있음",
    ],
    image: {
      url: "https://images.unsplash.com/photo-1671975418019-c2ed45dc0e98",
      alt: "여수 해안, 짙은 초록빛 절벽과 여름 바다",
    },
    sources: [
      {
        url: "https://korean.visitkorea.or.kr",
        label: "한국관광공사 대한민국 구석구석",
      },
    ],
    updatedAt: "2026-08-20",
  },
  {
    slug: "sokcho",
    name: "속초",
    scope: "domestic",
    countryCode: "KR",
    region: "속초",
    themes: ["자연", "해변", "산"],
    recommendedSeasons: ["봄", "가을", "겨울"],
    recommendedDays: [2, 3],
    overview:
      "속초는 설악산과 동해 바다를 함께 즐길 수 있는 강원도 대표 여행지다. 케이블카로 오르는 권금성 전망과 속초해변·아바이마을 같은 바다 풍경이 가까이 있어 산과 바다를 한 일정에 담을 수 있다. 등산과 해변 산책을 모두 좋아하는 여행자, 겨울 설경을 보고 싶은 여행자에게 추천한다. 서울에서 고속버스로 약 2시간 30분이면 도착한다. 설악산 케이블카는 날씨에 따라 운행이 중단될 수 있어 대체 일정을 함께 준비하는 것이 좋다. 설악산 케이블카 대기가 길 경우 오전 첫 운행 시간대를 노리는 것이 대기 시간을 줄이는 방법이다. 수산시장은 오전 시간대가 상대적으로 한산해 여유롭게 둘러보기 좋다.",
    highlights: [
      "설악산 케이블카·권금성",
      "속초해변 산책",
      "아바이마을 갯배 체험",
      "속초관광수산시장",
      "영금정 일출",
    ],
    bestTime: {
      recommended: "5~6월, 9~10월(등산에 좋은 기온), 12~1월(설경)",
      notRecommended: "장마철은 설악산 탐방로 통제 가능성 있음",
    },
    itinerary1d: [
      "설악산 케이블카 탑승",
      "권금성 전망대",
      "속초관광수산시장 점심",
      "아바이마을 갯배 체험",
    ],
    itinerary3d: [
      { day: 1, plan: "설악산 케이블카, 권금성" },
      { day: 2, plan: "속초해변, 아바이마을, 수산시장" },
      { day: 3, plan: "영금정, 속초등대전망대" },
    ],
    budget: {
      excludingLodging: "1인 1일 약 5만~9만원(케이블카 비용 포함)",
      includingLodging: "1인 1일 약 11만~18만원",
    },
    transport: {
      arrival: "고속버스로 서울에서 약 2시간 30분",
      local: "시내버스와 도보, 설악산 구간은 셔틀 이용",
      payment: "교통카드·신용카드 사용 가능",
    },
    foods: [
      { name: "오징어순대", note: "지역 대표 음식" },
      { name: "명태회냉면", note: "동해안 향토 음식" },
      { name: "닭강정", note: "수산시장 인기 간식" },
    ],
    etiquette: [
      "설악산 탐방로는 지정 코스만 이용",
      "갯배 체험은 정원 인원을 지킴",
      "해변 취사·야영은 지정 구역만 허용",
    ],
    image: {
      url: "https://images.unsplash.com/photo-1765702507427-b626efd230eb",
      alt: "속초 설악산 골짜기에 눈이 쌓인 겨울 설경",
    },
    sources: [
      {
        url: "https://korean.visitkorea.or.kr",
        label: "한국관광공사 대한민국 구석구석",
      },
    ],
    updatedAt: "2026-08-20",
  },
  {
    slug: "tongyeong",
    name: "통영",
    scope: "domestic",
    countryCode: "KR",
    region: "통영",
    themes: ["해변", "예술", "미식"],
    recommendedSeasons: ["봄", "가을"],
    recommendedDays: [2, 3],
    overview:
      "통영은 케이블카로 오르는 미륵산 전망과 동피랑 벽화마을 같은 예술적인 골목이 어우러진 남해안 도시다. 신선한 굴과 멍게 등 해산물 미식으로도 알려져 있어 짧은 일정에도 바다·예술·미식을 함께 경험할 수 있다. 벽화마을 산책과 사진 촬영을 좋아하는 여행자, 조용한 항구 도시 분위기를 원하는 여행자에게 추천한다. 부산에서 차로 약 1시간 30분 거리다. 동피랑은 계단이 많은 골목이라 편한 신발을 준비하는 것이 좋다. 동피랑과 서피랑을 같은 날 모두 오르면 체력 소모가 커 하루에 한 곳만 정해 여유 있게 도는 것이 좋다. 여객선 시간표를 미리 확인해두면 한산도 일정을 놓치지 않는다.",
    highlights: [
      "동피랑 벽화마을",
      "미륵산 케이블카",
      "통영중앙시장",
      "한산도 이순신 유적",
      "강구안 항구 산책",
    ],
    bestTime: {
      recommended: "4~5월, 9~10월",
      notRecommended: "한여름 고온기는 벽화마을 계단 산책이 힘들 수 있음",
    },
    itinerary1d: [
      "동피랑 벽화마을 산책",
      "통영중앙시장 점심",
      "미륵산 케이블카",
      "강구안 항구 야경",
    ],
    itinerary3d: [
      { day: 1, plan: "동피랑 벽화마을, 통영중앙시장" },
      { day: 2, plan: "미륵산 케이블카, 한산도" },
      { day: 3, plan: "강구안 항구, 서피랑 전망대" },
    ],
    budget: {
      excludingLodging: "1인 1일 약 5만~8만원(케이블카 비용 포함)",
      includingLodging: "1인 1일 약 10만~17만원",
    },
    transport: {
      arrival: "부산에서 차로 약 1시간 30분, 고속버스 이용 가능",
      local: "시내버스와 도보, 골목길은 도보 이동이 기본",
      payment: "신용카드·교통카드 사용 가능",
    },
    foods: [
      { name: "충무김밥", note: "지역 대표 음식" },
      { name: "굴요리", note: "겨울철 별미" },
      { name: "시락국", note: "향토 국밥류" },
    ],
    etiquette: [
      "벽화마을은 주민 생활공간과 인접해 정숙 유지",
      "케이블카 탑승은 대기 시간을 고려해 계획",
      "시장에서는 사진 촬영 전 상점 양해를 구할 것",
    ],
    image: {
      url: "https://images.unsplash.com/photo-1778040971728-011cb73d55d6",
      alt: "통영 벽화마을의 색색 계단과 흐드러진 벚꽃",
    },
    sources: [
      {
        url: "https://korean.visitkorea.or.kr",
        label: "한국관광공사 대한민국 구석구석",
      },
    ],
    updatedAt: "2026-08-20",
  },
  {
    slug: "incheon",
    name: "인천",
    scope: "domestic",
    countryCode: "KR",
    region: "인천",
    themes: ["차이나타운", "해변", "역사"],
    recommendedSeasons: ["봄", "가을"],
    recommendedDays: [1, 2],
    overview:
      "인천은 국제공항 관문 도시이자 개항기 역사와 차이나타운이 함께 있는 곳이다. 짜장면의 발생지로 알려진 차이나타운 거리와 송도 센트럴파크의 현대적인 스카이라인이 대비를 이루어 짧은 경유 일정에도 다채로운 풍경을 볼 수 있다. 입출국 전후 반나절이나 하루 정도 여유가 있는 여행자, 이국적인 거리 산책을 좋아하는 여행자에게 추천한다. 공항에서 대중교통으로 30분 내 접근할 수 있다. 환승 시간이 짧다면 차이나타운과 월미도만 묶어 반나절 코스로도 충분하다. 송도와 원도심(차이나타운·월미도)은 거리가 있어 하루에 둘 다 넣기보다 하나를 골라 집중하는 것이 좋다.",
    highlights: [
      "차이나타운 거리",
      "송도 센트럴파크",
      "월미도 놀이공원·바다열차",
      "인천개항박물관",
      "소래포구 어시장",
    ],
    bestTime: {
      recommended: "4~5월, 9~10월",
      notRecommended: "한여름 습도가 높은 시기는 야외 일정이 힘들 수 있음",
    },
    itinerary1d: [
      "차이나타운 거리 산책",
      "인천개항박물관 관람",
      "월미도 해안 산책",
      "소래포구 어시장 저녁",
    ],
    itinerary3d: [
      { day: 1, plan: "차이나타운, 개항박물관, 월미도" },
      { day: 2, plan: "송도 센트럴파크, 소래포구" },
      { day: 3, plan: "인천대공원, 을왕리 해변" },
    ],
    budget: {
      excludingLodging: "1인 1일 약 4만~7만원",
      includingLodging: "1인 1일 약 9만~15만원",
    },
    transport: {
      arrival: "인천국제공항에서 공항철도로 도심 접근",
      local: "지하철·버스로 대부분 관광지 이동 가능",
      payment: "교통카드·신용카드 사용 가능",
    },
    foods: [
      { name: "짜장면", note: "차이나타운 발생 음식" },
      { name: "쫄면", note: "인천 향토 음식" },
      { name: "닭강정", note: "신포시장 인기 간식" },
    ],
    etiquette: [
      "차이나타운 매장은 대기줄이 길 수 있어 시간을 여유롭게 잡을 것",
      "포구·시장에서는 가격을 먼저 확인",
      "공항 이용객이 많은 지역이라 캐리어 이동 시 주변에 유의",
    ],
    image: {
      url: "https://images.unsplash.com/photo-1762860958249-2e893cd15e7c",
      alt: "인천 차이나타운, 노랗게 물든 은행나무와 붉은 전통 건축",
    },
    sources: [
      {
        url: "https://korean.visitkorea.or.kr",
        label: "한국관광공사 대한민국 구석구석",
      },
    ],
    updatedAt: "2026-08-20",
  },
];
