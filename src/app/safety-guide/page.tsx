export default function SafetyGuidePage() {
  const guidelines = [
    {
      icon: "👤",
      title: "신원 확인",
      content: "만남 전 상대방의 신원을 충분히 확인하세요. 프로필 정보가 일치하지 않거나 의심스러운 점이 있으면 만남을 취소하고 신고해주세요.",
    },
    {
      icon: "📍",
      title: "공개된 장소에서 만나기",
      content: "처음 만나는 동행자와는 반드시 공개된 장소(카페, 로비, 관광지 등)에서 만나세요. 개인 숙소나 폐쇄된 장소는 피하시기 바랍니다.",
    },
    {
      icon: "📱",
      title: "일정 공유",
      content: "신뢰할 수 있는 친구나 가족에게 동행자 정보, 만나는 시간, 장소, 예상 귀가 시간을 미리 알려두세요.",
    },
    {
      icon: "🤐",
      title: "개인정보 보호",
      content: "집주소, 전화번호, 직장 정보 등 민감한 개인정보를 섣불리 공개하지 마세요. 필요한 최소한의 정보만 공유하세요.",
    },
    {
      icon: "💰",
      title: "금전 거래 주의",
      content: "항공, 숙소 예약금 등 금전 거래는 신중하게 하세요. 사기 의심 시 거래를 중단하고 즉시 신고하세요.",
    },
    {
      icon: "💬",
      title: "의사소통",
      content: "명확한 여행 계획, 비용 분담, 기대사항을 사전에 논의하세요. 불편하거나 불안한 점이 생기면 즉시 대화하세요.",
    },
    {
      icon: "🚨",
      title: "응급 상황 대처",
      content: "위급한 상황이 발생하면 즉시 경찰(112 또는 해외 현지 긴급신고)에 신고하세요. Free Traveler에도 함께 신고해주세요.",
    },
    {
      icon: "🚫",
      title: "차단 및 신고 기능 활용",
      content: "불쾌한 행동이나 부적절한 요청이 있는 사용자는 즉시 차단하고 신고하세요. Free Traveler는 이러한 신고를 신중하게 검토합니다.",
    },
    {
      icon: "🍺",
      title: "약물 및 음주",
      content: "낯선 사람과 함께할 때는 음식이나 음료를 절대 자리에 두지 마세요. 자신의 상태를 항상 인지하고 안전을 최우선으로 하세요.",
    },
    {
      icon: "🌍",
      title: "정부 안전정보 확인",
      content: "여행 전 외교부 해외안전여행 사이트에서 방문 국가의 최신 안전정보를 확인하세요. Free Traveler도 이를 제공합니다.",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-16 md:px-20">
      <div>
        <div className="flex items-center gap-4">
          <span className="text-display-md">🛡️</span>
          <h1 className="text-display-md font-bold">동행 안전수칙</h1>
        </div>
        <p className="mt-2 text-body-lg text-body">
          Free Traveler 동행 서비스 이용 시 안전을 위한 필수 수칙입니다.
        </p>
      </div>

      <div className="space-y-6">
        {guidelines.map((guideline, index) => (
          <section key={index} className="flex gap-4">
            <span className="flex-shrink-0 text-title-lg">{guideline.icon}</span>
            <div>
              <h2 className="text-title-lg font-semibold">{guideline.title}</h2>
              <p className="mt-2 text-body-md text-body">{guideline.content}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
