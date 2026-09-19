import { TabShell } from "@/app/_components/scr003/TabShell";
import { FlightTab } from "@/app/_components/scr003/FlightTab";
import { HotelTab } from "@/app/_components/scr003/HotelTab";
import { MateWriteForm } from "@/app/_components/scr003/MateWriteForm";

export default function TravelToolsPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 py-16 md:px-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-display-lg font-bold">여행 준비</h1>
      </div>

      <TabShell
        intro="항공·숙소는 조건을 정리해 외부 사이트로 이동해서 검색하고, 동행은 이 페이지에서 바로 모집글을 작성할 수 있습니다."
        tabs={[
          {
            id: "flight",
            label: "항공편",
            testId: "flight-tab-panel",
            panel: <FlightTab />,
          },
          {
            id: "hotel",
            label: "숙소",
            testId: "hotel-tab-panel",
            panel: <HotelTab />,
          },
          {
            id: "mate",
            label: "동행 구하기",
            testId: "mate-tab-panel",
            panel: <MateWriteForm />,
          },
        ]}
      />
    </div>
  );
}
