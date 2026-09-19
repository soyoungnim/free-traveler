import { getMyProfile } from "@/lib/db/account";
import { AuthPanel } from "@/app/_components/scr005/AuthPanel";
import { ProfilePanel } from "@/app/_components/scr005/ProfilePanel";
import { MyActivityPanel } from "@/app/_components/scr005/MyActivityPanel";
import { AdminPanel } from "@/app/_components/scr005/AdminPanel";

export default async function AccountPage() {
  const profile = await getMyProfile();

  const isAdmin = profile?.role === "admin";
  const isGuest = !profile;

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 py-16 md:px-20">
      {/* Intro */}
      <div className="flex flex-col gap-2">
        <h1 className="text-display-lg font-bold">
          {isGuest ? "로그인" : isAdmin ? "계정 & 관리" : "계정"}
        </h1>
        <p className="text-body-lg text-body">
          {isGuest
            ? "로그인하거나 가입해서 동행을 시작하세요."
            : isAdmin
              ? "계정 정보를 관리하고 신고 목록을 확인하세요."
              : "프로필을 관리하고 나의 활동을 확인하세요."}
        </p>
      </div>

      {/* Content */}
      {isGuest ? (
        <AuthPanel />
      ) : isAdmin ? (
        <>
          <AdminPanel />
          <div className="border-t border-hairline pt-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-title-lg font-semibold">내 계정</h2>
            </div>
            <div className="mt-6 flex flex-col gap-6">
              <ProfilePanel />
              <MyActivityPanel />
            </div>
          </div>
        </>
      ) : (
        <>
          <ProfilePanel />
          <MyActivityPanel />
        </>
      )}
    </div>
  );
}
