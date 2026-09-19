export default function DisclaimerPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-16 md:px-20">
      <div>
        <div className="flex items-center gap-4">
          <span className="text-display-md">⚠️</span>
          <h1 className="text-display-md font-bold">콘텐츠 면책 안내</h1>
        </div>
        <p className="mt-2 text-body-lg text-body">
          Free Traveler 서비스 이용 시 제공되는 정보의 정확성 및 책임에 관한 안내입니다.
        </p>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-body-md">
        <section>
          <h2 className="text-title-lg font-semibold">콘텐츠의 정확성</h2>
          <p>
            Free Traveler에서 제공하는 모든 여행지 정보, 안전정보, 여행 팁은 신뢰할 수 있는 출처를 바탕으로 작성되었습니다. 다만, 정보의 완전성과 정확성을 보장하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">사용자 생성 콘텐츠</h2>
          <p>
            동행 모집글, 댓글, 후기 등 사용자가 작성한 콘텐츠는 작성자의 의견이며, Free Traveler의 의견을 대표하지 않습니다. 부정확하거나 불건전한 콘텐츠 신고 시 검토 후 삭제할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">안전정보의 출처</h2>
          <p>
            안전정보는 외교부 해외안전여행, WHO, 현지 정부 공식 발표 등을 바탕으로 제공됩니다. 최신 정보는 해당 기관 공식 사이트에서 직접 확인하세요.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">외부 링크</h2>
          <p>
            Free Traveler에서 제공하는 외부 링크(항공, 숙소 예약 사이트 등)는 참고용이며, 해당 서비스의 정책, 가격, 품질에 대해 책임지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">여행 결정</h2>
          <p>
            Free Traveler의 정보를 참고하여 여행을 결정하시기 바랍니다만, 최종 판단은 사용자의 책임입니다. 정보 오류로 인한 손해는 Free Traveler가 책임지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">동행 매칭</h2>
          <p>
            동행 매칭은 사용자 정보와 여행 조건을 바탕으로 제공되는 참고 기능입니다. 실제 호환성, 신뢰성, 안전성은 보장하지 않습니다. 상대방과의 모든 거래와 결정은 사용자의 책임입니다.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">서비스 이용 약관</h2>
          <p>
            본 면책 안내는 Free Traveler 이용약관의 일부입니다. 전체 약관을 확인하시고 동의한 후 서비스를 이용해주세요.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">분쟁 해결</h2>
          <p>
            본 서비스로 인한 분쟁은 대한민국 법을 적용받으며, 관할 법원은 서울중앙지방법원입니다. 사용자 간의 분쟁은 당사자 간 합의를 권장합니다.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">책임 제한</h2>
          <p>
            Free Traveler는 서비스 제공 중 발생한 손해(직접, 간접, 부수적, 특수적, 징벌적 손해)에 대해 책임지지 않습니다. 단, 법적으로 제한할 수 없는 경우는 예외입니다.
          </p>
        </section>

        <section>
          <h2 className="text-title-lg font-semibold">정책 변경</h2>
          <p>
            본 면책 안내는 필요시 변경될 수 있으며, 변경 사항은 서비스 내 공지됩니다. 변경 후 계속 서비스를 이용하시면 변경된 내용에 동의한 것으로 간주합니다.
          </p>
        </section>
      </div>
    </div>
  );
}
