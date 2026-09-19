export default function TermsPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-16 md:px-20">
      <div>
        <div className="flex items-center gap-4">
          <span className="text-display-md">📋</span>
          <h1 className="text-display-md font-bold">이용약관</h1>
        </div>
        <p className="mt-2 text-body-lg text-body">
          Free Traveler 서비스 이용약관입니다.
        </p>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-body-md">
        <section>
          <h2 className="text-title-lg font-semibold">서비스 소개</h2>
          <p>
            Free Traveler는 여행지 탐색, 항공·숙소 조건 정리, 안전정보 확인, 동행 찾기 등 여행 준비에 필요한 모든 정보를 제공하는 서비스입니다.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">이용 조건</h2>
          <p>
            본 서비스는 만 14세 이상의 사용자를 대상으로 합니다. 동행 모집 및 참가는 만 19세 이상 성인만 가능합니다.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">사용자의 책임</h2>
          <p>
            사용자는 본 서비스를 이용하며 타인의 개인정보 침해, 명예훼손, 불법적 행동을 해서는 안 됩니다. 모든 책임은 사용자에게 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">콘텐츠 저작권</h2>
          <p>
            본 서비스의 모든 콘텐츠는 Free Traveler 또는 제휴사에 의해 저작권이 보호됩니다. 사용자의 무단 복사, 배포, 수정은 금지됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">서비스 중단</h2>
          <p>
            Free Traveler는 운영 상의 이유로 사전 공지 후 서비스를 중단할 수 있습니다. 이로 인한 손해는 책임지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">약관 변경</h2>
          <p>
            본 약관은 필요시 변경될 수 있으며, 변경 사항은 서비스 공지사항을 통해 안내됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}
