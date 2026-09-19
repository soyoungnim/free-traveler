export default function PrivacyPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-16 md:px-20">
      <div>
        <div className="flex items-center gap-4">
          <span className="text-display-md">🔒</span>
          <h1 className="text-display-md font-bold">개인정보 처리방침</h1>
        </div>
        <p className="mt-2 text-body-lg text-body">
          Free Traveler의 개인정보 처리방침입니다.
        </p>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-body-md">
        <section>
          <h2 className="text-title-lg font-semibold">개인정보 수집</h2>
          <p>
            Free Traveler는 서비스 제공을 위해 다음의 개인정보를 수집합니다:
          </p>
          <ul className="ml-4 space-y-2">
            <li>• 이메일 주소</li>
            <li>• 회원가입 시 제공한 정보 (나이, 성별, 여행 취향)</li>
            <li>• 서비스 이용 기록</li>
          </ul>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">개인정보 사용 목적</h2>
          <p>
            수집한 개인정보는 다음 목적으로만 사용됩니다:
          </p>
          <ul className="ml-4 space-y-2">
            <li>• 회원 인증 및 서비스 제공</li>
            <li>• 동행 매칭 및 통신</li>
            <li>• 서비스 개선 및 사용성 분석</li>
            <li>• 법적 의무 준수</li>
          </ul>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">개인정보 보호</h2>
          <p>
            Free Traveler는 개인정보를 암호화하여 보관하며, 비인가 접근으로부터 보호합니다. 항공·숙소 검색 정보는 서버에 저장하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">개인정보 제3자 제공</h2>
          <p>
            사용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 법적 요청이 있는 경우 예외적으로 제공할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">쿠키 및 로그</h2>
          <p>
            Free Traveler는 서비스 개선을 위해 쿠키와 접근 로그를 수집합니다. 언제든 브라우저 설정을 통해 거부할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">개인정보 삭제</h2>
          <p>
            계정 탈퇴 시 개인정보는 즉시 삭제되며, 법적 보존 기간을 제외하고 복구되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">정책 변경</h2>
          <p>
            본 개인정보 처리방침은 필요시 변경될 수 있으며, 주요 변경사항은 사전에 공지됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}
