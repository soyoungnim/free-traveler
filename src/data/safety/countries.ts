/**
 * 국가 안전정보 정적 데이터 (DATA-SAFETY).
 * countryCode는 DATA-DESTINATIONS의 해외 여행지 countryCode와 매칭된다.
 *
 * 이 데이터는 개발자가 직접 작성·유지하는 시드 콘텐츠다(REQ-FUNC-055 EXCLUDED
 * — 편집자 CMS 워크플로 없음). 여기 담긴 여행경보 단계·세부 안내는 참고용
 * 요약이며, 실제 최신 여행경보는 반드시 외교부 해외안전여행(0404.go.kr)
 * 원문을 출국 직전 재확인해야 한다(REQ-FUNC-054) — 이 페이지가 공식 판단을
 * 대체하지 않는다.
 */

export type SafetyScopeType = "COUNTRY" | "REGION";

export interface CountrySafetyCategories {
  /** 치안 */
  security: string[];
  /** 흔한 사기 */
  commonScams: string[];
  /** 현지 법규 */
  localLaw: string[];
  /** 교통 */
  transport: string[];
  /** 재난·기후 */
  disasterWeather: string[];
  /** 보건 */
  health: string[];
  /** 문화·복장 */
  cultureEtiquette: string[];
}

export interface EmergencyContactInfo {
  localPolice: string;
  localAmbulance: string;
  /** 대한민국 영사콜센터(24시간, 국가 공통) */
  consularCallCenter: string;
  note: string;
}

export interface CountrySafety {
  countryCode: string;
  countryName: string;
  scopeType: SafetyScopeType;
  scopeText: string;
  advisoryLevel: string;
  categories: CountrySafetyCategories;
  emergencyContacts: EmergencyContactInfo;
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string;
  editor: string;
}

const CONSULAR_CALL_CENTER =
  "+82-2-3210-0404 (해외 무료 접속 코드는 국가별로 상이, 영사콜센터 24시간 운영)";

export const countrySafetyList: CountrySafety[] = [
  {
    countryCode: "JP",
    countryName: "일본",
    scopeType: "COUNTRY",
    scopeText: "전역(일부 원전 인근 지역은 별도 제한 구역 존재)",
    advisoryLevel: "특별한 조치 없음(출국 전 공식 사이트 재확인 필요)",
    categories: {
      security: [
        "대체로 치안이 안정적이나 관광지 소매치기는 유의",
        "번화가 심야 시간대 음주 관련 다툼 주의",
      ],
      commonScams: [
        "과도한 호객·바 강매 주의(일부 유흥가)",
        "가짜 티켓·투어 판매 주의",
      ],
      localLaw: [
        "도로 무단횡단·자전거 역주행 단속 대상",
        "실내 다수 구역 금연, 지정 흡연 구역만 허용",
      ],
      transport: [
        "지하철·기차 정시성이 높으나 혼잡 시간대 매너 준수 필요",
        "렌터카는 국제운전면허 필요",
      ],
      disasterWeather: [
        "지진·태풍 발생 가능 지역, 긴급 알림 앱 설치 권장",
        "여름 태풍 시기(8~10월) 항공·열차 지연 가능",
      ],
      health: [
        "의료 수준이 높으나 여행자 보험 필수",
        "일부 의약품 반입 제한(성분 확인 필요)",
      ],
      cultureEtiquette: [
        "신발을 벗는 실내 공간이 많음",
        "대중교통 내 전화 통화 자제",
      ],
    },
    emergencyContacts: {
      localPolice: "110",
      localAmbulance: "119",
      consularCallCenter: CONSULAR_CALL_CENTER,
      note: "재외공관: 주일본대한민국대사관(도쿄) 및 각 지역 총영사관",
    },
    sourceName: "외교부 해외안전여행",
    sourceUrl: "https://www.0404.go.kr/",
    verifiedAt: "2026-08-20",
    editor: "content-team",
  },
  {
    countryCode: "TW",
    countryName: "대만",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "특별한 조치 없음(출국 전 공식 사이트 재확인 필요)",
    categories: {
      security: [
        "전반적으로 치안이 양호",
        "야시장 등 혼잡 구역 소지품 관리 필요",
      ],
      commonScams: ["관광지 인근 과다요금 택시 주의", "온라인 숙소 사기 주의"],
      localLaw: [
        "대중교통 음식물 섭취 금지",
        "스쿠터 렌트 시 국제운전면허 필요",
      ],
      transport: [
        "MRT·기차망이 편리, 근교는 버스·기차 병행",
        "태풍철 항공편 결항 가능성 있음",
      ],
      disasterWeather: ["지진·태풍 발생 가능, 여름~가을 태풍 주의보 확인 필요"],
      health: ["의료 수준 양호, 여행자 보험 권장"],
      cultureEtiquette: ["사찰 방문 시 정숙 유지", "명함·선물 교환 문화 존재"],
    },
    emergencyContacts: {
      localPolice: "110",
      localAmbulance: "119",
      consularCallCenter: CONSULAR_CALL_CENTER,
      note: "재외공관: 주타이베이대한민국대표부(한국-대만은 비수교 관계로 대표부 형태로 운영)",
    },
    sourceName: "외교부 해외안전여행",
    sourceUrl: "https://www.0404.go.kr/",
    verifiedAt: "2026-08-20",
    editor: "content-team",
  },
  {
    countryCode: "TH",
    countryName: "태국",
    scopeType: "REGION",
    scopeText:
      "대부분 지역 안전, 남부 일부 접경 지역은 별도 경보 가능성 있어 최신 공지 확인 필요",
    advisoryLevel: "여행유의(지역별 상이, 공식 사이트 확인 필요)",
    categories: {
      security: [
        "관광지 소매치기·가방 날치기 주의",
        "심야 유흥가 음주 사고 주의",
      ],
      commonScams: [
        "보석·투어 사기(친절을 가장한 호객) 주의",
        "미터기 없는 툭툭·택시 요금 사전 협의 필요",
      ],
      localLaw: [
        "왕실 관련 언급은 엄격히 규제됨(불경죄 처벌 가능)",
        "전자담배 소지·판매 금지",
      ],
      transport: [
        "BTS·MRT 이용 권장, 육상 교통은 혼잡할 수 있음",
        "오토바이 렌트 시 안전모 착용 의무",
      ],
      disasterWeather: [
        "우기(6~10월) 집중호우·홍수 가능성",
        "일부 해안 지역 해파리 등 주의",
      ],
      health: [
        "뎅기열 등 모기 매개 질병 예방 필요",
        "여행자 보험 및 방역 정보 사전 확인",
      ],
      cultureEtiquette: [
        "사원 방문 시 노출 적은 복장 필요",
        "머리를 만지는 행동은 실례로 여겨짐",
      ],
    },
    emergencyContacts: {
      localPolice: "191",
      localAmbulance: "1669",
      consularCallCenter: CONSULAR_CALL_CENTER,
      note: "재외공관: 주태국대한민국대사관(방콕)",
    },
    sourceName: "외교부 해외안전여행",
    sourceUrl: "https://www.0404.go.kr/",
    verifiedAt: "2026-08-20",
    editor: "content-team",
  },
  {
    countryCode: "VN",
    countryName: "베트남",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "특별한 조치 없음(출국 전 공식 사이트 재확인 필요)",
    categories: {
      security: [
        "오토바이 이용 소매치기(주행 중 낚아채기) 주의",
        "관광지 밀집 지역 소지품 관리 필요",
      ],
      commonScams: ["환전 사기·거짓 잔돈 주의", "과다요금 택시·투어 주의"],
      localLaw: [
        "헬멧 미착용 오토바이 탑승 단속 대상",
        "마약류 처벌이 매우 엄격함",
      ],
      transport: [
        "오토바이 통행량이 많아 도로 횡단 시 유의",
        "장거리 이동은 슬리핑버스·기차 이용",
      ],
      disasterWeather: ["중부·북부 태풍철(9~11월) 홍수 가능성"],
      health: ["길거리 음식은 위생 상태를 확인 후 섭취", "여행자 보험 권장"],
      cultureEtiquette: [
        "사원·유적 방문 시 단정한 복장 필요",
        "정치 관련 발언은 신중히 다룰 것",
      ],
    },
    emergencyContacts: {
      localPolice: "113",
      localAmbulance: "115",
      consularCallCenter: CONSULAR_CALL_CENTER,
      note: "재외공관: 주베트남대한민국대사관(하노이), 호찌민 총영사관",
    },
    sourceName: "외교부 해외안전여행",
    sourceUrl: "https://www.0404.go.kr/",
    verifiedAt: "2026-08-20",
    editor: "content-team",
  },
  {
    countryCode: "SG",
    countryName: "싱가포르",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "특별한 조치 없음(출국 전 공식 사이트 재확인 필요)",
    categories: {
      security: ["치안이 매우 우수한 편", "관광지에서도 큰 위험 사례는 드묾"],
      commonScams: ["온라인 렌털·티켓 사기는 주의"],
      localLaw: [
        "껌 판매·반입 제한, 무단횡단·쓰레기 투기 벌금 부과",
        "마약류 처벌이 매우 엄격함(사형 포함)",
      ],
      transport: ["MRT·버스가 매우 편리하고 정확함"],
      disasterWeather: ["열대성 스콜(단시간 폭우)이 자주 발생"],
      health: ["의료 수준이 높음, 여행자 보험 권장"],
      cultureEtiquette: ["다민족 국가로 종교·문화적 예의를 존중할 것"],
    },
    emergencyContacts: {
      localPolice: "999",
      localAmbulance: "995",
      consularCallCenter: CONSULAR_CALL_CENTER,
      note: "재외공관: 주싱가포르대한민국대사관",
    },
    sourceName: "외교부 해외안전여행",
    sourceUrl: "https://www.0404.go.kr/",
    verifiedAt: "2026-08-20",
    editor: "content-team",
  },
  {
    countryCode: "ID",
    countryName: "인도네시아",
    scopeType: "REGION",
    scopeText:
      "발리 등 주요 관광지는 대체로 안전, 일부 지역은 별도 경보 가능성 있어 최신 공지 확인 필요",
    advisoryLevel: "여행유의(지역별 상이, 공식 사이트 확인 필요)",
    categories: {
      security: ["관광지 소매치기, 오토바이 이용 날치기 주의"],
      commonScams: [
        "환전소 사기·불법 환전 주의",
        "렌트 스쿠터 파손 시 과다 청구 주의",
      ],
      localLaw: [
        "마약류 처벌이 매우 엄격함(사형 포함)",
        "종교 관련 발언·행동에 유의",
      ],
      transport: [
        "스쿠터 이용 시 국제운전면허·헬멧 필수",
        "도로 사정이 지역마다 상이",
      ],
      disasterWeather: ["화산·지진 활동 지역, 우기(11~3월) 홍수 가능성"],
      health: ["뎅기열 등 예방접종·모기 기피제 권장"],
      cultureEtiquette: [
        "사원 방문 시 사롱 착용, 여성은 생리 중 일부 사원 출입 제한될 수 있음",
      ],
    },
    emergencyContacts: {
      localPolice: "110",
      localAmbulance: "118",
      consularCallCenter: CONSULAR_CALL_CENTER,
      note: "재외공관: 주인도네시아대한민국대사관(자카르타), 발리 분관",
    },
    sourceName: "외교부 해외안전여행",
    sourceUrl: "https://www.0404.go.kr/",
    verifiedAt: "2026-08-20",
    editor: "content-team",
  },
  {
    countryCode: "PH",
    countryName: "필리핀",
    scopeType: "REGION",
    scopeText:
      "세부·보라카이 등 주요 관광지는 대체로 안전, 일부 지역은 특별여행주의보 등 별도 경보 가능성 있어 최신 공지 확인 필요",
    advisoryLevel: "여행유의(지역별 상이, 공식 사이트 확인 필요)",
    categories: {
      security: ["일부 치안 취약 지역 존재, 야간 단독 이동 자제 권장"],
      commonScams: ["택시·투어 과다요금 주의", "카드 복제(스키밍) 사고 주의"],
      localLaw: [
        "마약류 처벌이 매우 엄격함",
        "총기 관련 사건 보도가 있어 유흥가 심야 이동 자제",
      ],
      transport: [
        "지프니·트라이시클 이용 시 요금 사전 협의",
        "도서 간 이동은 항공·선박 일정 여유 필요",
      ],
      disasterWeather: ["태풍(6~11월)·지진 발생 가능 지역"],
      health: ["뎅기열 등 예방접종 권장, 식수는 생수 이용"],
      cultureEtiquette: ["가톨릭 문화권으로 종교 시설 방문 시 예의 필요"],
    },
    emergencyContacts: {
      localPolice: "911",
      localAmbulance: "911",
      consularCallCenter: CONSULAR_CALL_CENTER,
      note: "재외공관: 주필리핀대한민국대사관(마닐라), 세부 분관",
    },
    sourceName: "외교부 해외안전여행",
    sourceUrl: "https://www.0404.go.kr/",
    verifiedAt: "2026-08-20",
    editor: "content-team",
  },
  {
    countryCode: "MY",
    countryName: "말레이시아",
    scopeType: "COUNTRY",
    scopeText: "전역(사바 동부 일부 해상 지역은 별도 경보 가능성 있음)",
    advisoryLevel: "특별한 조치 없음(출국 전 공식 사이트 재확인 필요)",
    categories: {
      security: ["대체로 안전하나 관광지 소매치기 주의"],
      commonScams: ["렌터카·투어 과다요금 주의"],
      localLaw: [
        "마약류 처벌이 매우 엄격함(사형 포함)",
        "이슬람 관련 법규를 존중할 것",
      ],
      transport: ["LRT·모노레일이 도심 이동에 편리"],
      disasterWeather: ["우기(11~1월) 홍수 가능성"],
      health: ["의료 수준 양호, 여행자 보험 권장"],
      cultureEtiquette: [
        "이슬람 사원 방문 시 복장 규정 준수",
        "다민족 국가 특성상 종교적 예의 필요",
      ],
    },
    emergencyContacts: {
      localPolice: "999",
      localAmbulance: "999",
      consularCallCenter: CONSULAR_CALL_CENTER,
      note: "재외공관: 주말레이시아대한민국대사관(쿠알라룸푸르)",
    },
    sourceName: "외교부 해외안전여행",
    sourceUrl: "https://www.0404.go.kr/",
    verifiedAt: "2026-08-20",
    editor: "content-team",
  },
  {
    countryCode: "FR",
    countryName: "프랑스",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "특별한 조치 없음(출국 전 공식 사이트 재확인 필요)",
    categories: {
      security: ["관광지·대중교통 소매치기 매우 빈번, 소지품 관리 필수"],
      commonScams: ["서명 요청·팔찌 강매 주의", "가짜 설문·기부 요청 주의"],
      localLaw: [
        "대중교통 무임승차 적발 시 벌금",
        "공공장소 시위 시 우회 이동 권장",
      ],
      transport: [
        "지하철 소매치기 빈발 구간 유의",
        "파업으로 인한 교통 지연 가능성 있음",
      ],
      disasterWeather: ["특별한 자연재해 위험은 낮은 편"],
      health: ["의료 수준이 높음, 여행자 보험 권장"],
      cultureEtiquette: ["식당 입장 시 안내를 받아 착석하는 문화"],
    },
    emergencyContacts: {
      localPolice: "17",
      localAmbulance: "15",
      consularCallCenter: CONSULAR_CALL_CENTER,
      note: "재외공관: 주프랑스대한민국대사관(파리), 공통 응급 112",
    },
    sourceName: "외교부 해외안전여행",
    sourceUrl: "https://www.0404.go.kr/",
    verifiedAt: "2026-08-20",
    editor: "content-team",
  },
  {
    countryCode: "IT",
    countryName: "이탈리아",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "특별한 조치 없음(출국 전 공식 사이트 재확인 필요)",
    categories: {
      security: ["관광지·기차역 소매치기 빈번, 소지품 관리 필수"],
      commonScams: [
        "가짜 티켓 판매·서명 요청 주의",
        "택시 미터기 미사용 요금 분쟁 주의",
      ],
      localLaw: ["문화유산 훼손 시 처벌 대상", "무임승차 적발 시 벌금"],
      transport: ["기차 파업으로 인한 지연 가능성 있음"],
      disasterWeather: ["일부 지역 지진 발생 가능"],
      health: ["의료 수준이 높음, 여행자 보험 권장"],
      cultureEtiquette: [
        "성당 방문 시 복장 규정 준수",
        "레스토랑 자릿세(coperto) 존재",
      ],
    },
    emergencyContacts: {
      localPolice: "112",
      localAmbulance: "112",
      consularCallCenter: CONSULAR_CALL_CENTER,
      note: "재외공관: 주이탈리아대한민국대사관(로마), 밀라노 총영사관",
    },
    sourceName: "외교부 해외안전여행",
    sourceUrl: "https://www.0404.go.kr/",
    verifiedAt: "2026-08-20",
    editor: "content-team",
  },
  {
    countryCode: "ES",
    countryName: "스페인",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "특별한 조치 없음(출국 전 공식 사이트 재확인 필요)",
    categories: {
      security: ["관광지·대중교통 소매치기 매우 빈번"],
      commonScams: [
        "신문지·박스 위장 소매치기 수법 주의",
        "가짜 경찰 사기 주의",
      ],
      localLaw: [
        "투우 등 전통 행사 관련 규정 상이",
        "심야 소음 규제 지역 존재",
      ],
      transport: ["지하철·버스 소매치기 빈발 구간 유의"],
      disasterWeather: ["특별한 자연재해 위험은 낮은 편"],
      health: ["의료 수준이 높음, 여행자 보험 권장"],
      cultureEtiquette: [
        "늦은 저녁 식사 문화, 낮잠(시에스타) 시간대 일부 상점 휴무",
      ],
    },
    emergencyContacts: {
      localPolice: "112",
      localAmbulance: "112",
      consularCallCenter: CONSULAR_CALL_CENTER,
      note: "재외공관: 주스페인대한민국대사관(마드리드)",
    },
    sourceName: "외교부 해외안전여행",
    sourceUrl: "https://www.0404.go.kr/",
    verifiedAt: "2026-08-20",
    editor: "content-team",
  },
  {
    countryCode: "GB",
    countryName: "영국",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "특별한 조치 없음(출국 전 공식 사이트 재확인 필요)",
    categories: {
      security: ["대체로 안전하나 관광지·야간 유흥가 소매치기 주의"],
      commonScams: ["가짜 티켓·투어 판매 주의"],
      localLaw: ["대중교통 무임승차 적발 시 벌금"],
      transport: ["지하철(튜브) 에스컬레이터는 오른쪽으로 서서 이용"],
      disasterWeather: ["특별한 자연재해 위험은 낮은 편"],
      health: ["의료 수준이 높음, 여행자 보험 권장"],
      cultureEtiquette: ["펍 이용 시 카운터에서 직접 주문·결제"],
    },
    emergencyContacts: {
      localPolice: "999",
      localAmbulance: "999",
      consularCallCenter: CONSULAR_CALL_CENTER,
      note: "재외공관: 주영국대한민국대사관(런던), 공통 응급 112 병행 가능",
    },
    sourceName: "외교부 해외안전여행",
    sourceUrl: "https://www.0404.go.kr/",
    verifiedAt: "2026-08-20",
    editor: "content-team",
  },
  {
    countryCode: "US",
    countryName: "미국",
    scopeType: "REGION",
    scopeText:
      "주(State)·도시별 치안 차이가 커 방문 지역의 최신 공지를 반드시 확인 필요",
    advisoryLevel: "지역별 상이(공식 사이트 확인 필요)",
    categories: {
      security: ["도시별 치안 차이가 크며 일부 구역은 야간 이동 자제 권장"],
      commonScams: ["렌터카 과다 보험 강매 주의", "관광지 소매치기 주의"],
      localLaw: [
        "주(State)별 법규가 상이(음주·대마 관련 등)",
        "총기 소지 관련 사건 보도에 유의",
      ],
      transport: ["도시 대부분 자동차 중심, 대중교통은 도시별 차이가 큼"],
      disasterWeather: ["지역에 따라 허리케인·토네이도·지진 위험 상이"],
      health: ["의료비가 매우 높아 여행자 보험 필수"],
      cultureEtiquette: ["레스토랑·택시 등에서 팁(15~20%) 문화가 일반적"],
    },
    emergencyContacts: {
      localPolice: "911",
      localAmbulance: "911",
      consularCallCenter: CONSULAR_CALL_CENTER,
      note: "재외공관: 주미국대한민국대사관(워싱턴) 및 각 지역 총영사관",
    },
    sourceName: "외교부 해외안전여행",
    sourceUrl: "https://www.0404.go.kr/",
    verifiedAt: "2026-08-20",
    editor: "content-team",
  },
  {
    countryCode: "AU",
    countryName: "호주",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "특별한 조치 없음(출국 전 공식 사이트 재확인 필요)",
    categories: {
      security: ["대체로 치안이 우수한 편"],
      commonScams: ["렌터카·투어 과다요금 주의"],
      localLaw: [
        "엄격한 검역 규정(농축산물 반입 제한)",
        "해변 음주 규제 구역 존재",
      ],
      transport: ["도심은 트램·기차, 장거리는 렌터카·항공 이용"],
      disasterWeather: ["산불(여름철)·홍수 가능성, 자외선이 매우 강함"],
      health: ["해파리·상어 등 해양 위험 요소 주의, 여행자 보험 권장"],
      cultureEtiquette: ["해변에서는 깃발로 표시된 안전 구역 내에서 수영"],
    },
    emergencyContacts: {
      localPolice: "000",
      localAmbulance: "000",
      consularCallCenter: CONSULAR_CALL_CENTER,
      note: "재외공관: 주호주대한민국대사관(캔버라), 시드니 총영사관",
    },
    sourceName: "외교부 해외안전여행",
    sourceUrl: "https://www.0404.go.kr/",
    verifiedAt: "2026-08-20",
    editor: "content-team",
  },
  {
    countryCode: "NZ",
    countryName: "뉴질랜드",
    scopeType: "COUNTRY",
    scopeText: "전역",
    advisoryLevel: "특별한 조치 없음(출국 전 공식 사이트 재확인 필요)",
    categories: {
      security: ["대체로 치안이 우수한 편"],
      commonScams: ["렌터카·액티비티 과다요금 주의"],
      localLaw: ["엄격한 검역 규정(농축산물·자연물 반입 제한)"],
      transport: ["렌터카가 주요 이동 수단, 좌측 운전 숙지 필요"],
      disasterWeather: ["지진 발생 가능 지역, 산간 지역 기상 변화가 심함"],
      health: ["의료 수준 양호, 여행자 보험 권장"],
      cultureEtiquette: ["자연보호구역에서는 동식물 채집 금지"],
    },
    emergencyContacts: {
      localPolice: "111",
      localAmbulance: "111",
      consularCallCenter: CONSULAR_CALL_CENTER,
      note: "재외공관: 주뉴질랜드대한민국대사관(웰링턴)",
    },
    sourceName: "외교부 해외안전여행",
    sourceUrl: "https://www.0404.go.kr/",
    verifiedAt: "2026-08-20",
    editor: "content-team",
  },
];
