/**
 * free_traveler 대표 프로필 정적 데이터 (DATA-REPRESENTATIVE).
 * 대표명·50+ Trips·30+ Countries는 이 파일을 전역 단일 소스로 사용한다
 * (docs/01_PRD.md §6-1 확정 프로필, §6-2 소개문 원문을 그대로 승계).
 *
 * 문의·SNS 링크(REQ-FUNC-062)는 관리자 설정(app_settings, API-ADMIN-SETTINGS)
 * 에서 오는 값이라 이 정적 데이터 파일에는 포함하지 않는다.
 */

export interface RepresentativeTimelineEntry {
  year: number;
  place: string;
  summary: string;
}

export interface RepresentativeRegionCountries {
  region: string;
  countries: string[];
}

export interface RepresentativeImage {
  url: string;
  /** 실제 장소·상황을 설명하는 한국어 대체텍스트 */
  alt: string;
}

export interface RepresentativeProfile {
  displayName: string;
  tripsCount: string;
  countriesCount: string;
  regions: string[];
  expertise: string[];
  philosophy: string;
  contentPrinciple: string;
  intro: string;
  visitedCountriesByRegion: RepresentativeRegionCountries[];
  /** 6개 이상. */
  timeline: RepresentativeTimelineEntry[];
  /** 4개, DATA-DESTINATIONS의 slug와 교차 참조. */
  memorableDestinationSlugs: string[];
  /** 8장 이상. */
  gallery: RepresentativeImage[];
  updatedAt: string;
}

export const representativeProfile: RepresentativeProfile = {
  displayName: "free_traveler",
  tripsCount: "50+",
  countriesCount: "30+",
  regions: ["아시아", "유럽", "북미", "오세아니아"],
  expertise: [
    "첫 자유여행 설계",
    "도시 간 이동 동선 설계",
    "일정 밀도 조절",
    "예산과 안전의 균형",
  ],
  philosophy:
    "좋은 여행은 많이 보는 여행이 아니라, 내가 감당할 수 있는 속도로 현지를 이해하는 여행이다.",
  contentPrinciple:
    "직접 이해한 정보와 공식 출처를 구분하고, 변동 가능한 정보에는 확인일을 표시한다.",
  intro:
    "free_traveler는 50회 이상의 자유여행으로 30개국 이상을 경험한 여행 큐레이터다. 유명 명소만 나열하기보다 이동 동선, 머무는 시간, 여행자의 체력, 안전정보까지 함께 살피는 여행을 지향한다. 처음 해외여행을 준비하는 사람도 목적지와 일정을 스스로 결정할 수 있도록 여행지의 장점뿐 아니라 불편한 점과 주의할 점을 함께 소개한다.",
  visitedCountriesByRegion: [
    {
      region: "아시아",
      countries: [
        "일본",
        "대만",
        "태국",
        "베트남",
        "싱가포르",
        "인도네시아",
        "필리핀",
        "말레이시아",
        "캄보디아",
        "라오스",
      ],
    },
    {
      region: "유럽",
      countries: [
        "프랑스",
        "이탈리아",
        "스페인",
        "영국",
        "독일",
        "포르투갈",
        "그리스",
        "체코",
        "오스트리아",
        "네덜란드",
      ],
    },
    {
      region: "북미",
      countries: ["미국", "캐나다", "멕시코"],
    },
    {
      region: "오세아니아",
      countries: ["호주", "뉴질랜드", "피지"],
    },
    {
      region: "중남미·아프리카",
      countries: [
        "아르헨티나",
        "페루",
        "모로코",
        "남아프리카공화국",
        "튀르키예",
      ],
    },
  ],
  timeline: [
    {
      year: 2016,
      place: "대만 타이베이",
      summary:
        "첫 단독 해외여행. 야시장과 대중교통만으로 도시를 도는 법을 익혔다.",
    },
    {
      year: 2017,
      place: "태국 방콕·치앙마이",
      summary: "두 도시를 기차로 잇는 이동형 일정을 처음 시도했다.",
    },
    {
      year: 2018,
      place: "이탈리아·프랑스 3개 도시",
      summary:
        "유럽 첫 여행. 도시 간 이동 시간을 촘촘히 계산하는 습관이 생겼다.",
    },
    {
      year: 2019,
      place: "베트남 다낭·호이안",
      summary: "가족 동반 여행에서 일정 밀도를 낮추는 법을 배웠다.",
    },
    {
      year: 2021,
      place: "제주 한 달 살기",
      summary: "국내 장기 체류로 여행과 일상의 경계를 다시 생각한 계기가 됐다.",
    },
    {
      year: 2022,
      place: "발리·롬복",
      summary: "섬 간 이동과 날씨 변수에 대응하는 여유 일정을 실험했다.",
    },
    {
      year: 2023,
      place: "뉴질랜드 남섬 렌터카 여행",
      summary: "장거리 운전과 계절별 액티비티 구성을 정리했다.",
    },
    {
      year: 2024,
      place: "스페인·포르투갈",
      summary: "미식과 도보 여행을 중심으로 한 저강도 일정을 시도했다.",
    },
  ],
  memorableDestinationSlugs: ["kyoto", "bali", "queenstown", "jeju"],
  gallery: [
    {
      url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
      alt: "일본 교토 야사카탑 골목에서 기모노를 입은 여행자들이 바라보는 노을",
    },
    {
      url: "https://images.unsplash.com/photo-1508009603885-50cf7c579365",
      alt: "태국 방콕 차이나타운의 네온 간판과 비 내린 밤거리, 툭툭",
    },
    {
      url: "https://images.unsplash.com/photo-1687817997684-c9335cce7c5c",
      alt: "이탈리아 피렌체 두오모 성당의 붉은 돔, 맑은 하늘 아래 도심 전경",
    },
    {
      url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      alt: "프랑스 파리 센 강변에서 바라본 에펠탑 노을",
    },
    {
      url: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b",
      alt: "베트남 다낭 바나힐의 골든브릿지",
    },
    {
      url: "https://images.unsplash.com/photo-1548115184-bc6544d06a58",
      alt: "한국 전통 한옥마을 기와지붕 골목과 노을",
    },
    {
      url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      alt: "발리 울룬다누 브라탄 사원과 호수에 비친 반영",
    },
    {
      url: "https://images.unsplash.com/photo-1511497031365-bc08e320bcf9",
      alt: "뉴질랜드 퀸스타운 와카티푸 호수, 눈 쌓인 겨울 산맥",
    },
    {
      url: "https://images.unsplash.com/photo-1583422409516-2895a77efded",
      alt: "스페인 바르셀로나 사그라다 파밀리아 대성당이 보이는 도심 항공뷰",
    },
  ],
  updatedAt: "2026-08-20",
};
