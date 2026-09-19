"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MateFilterList } from "@/app/_components/scr004/MateFilterList";
import { MateDetailPanel } from "@/app/_components/scr004/MateDetailPanel";
import { ApplicationForm } from "@/app/_components/scr004/ApplicationForm";
import { ReportBlockActions } from "@/app/_components/scr004/ReportBlockActions";
import type { MatePostWithComputedStatus } from "@/lib/db/mates-read";
import {
  listApplicationsForPost,
  listMyApplications,
} from "@/lib/db/mate-applications";
import { listMyBlocks } from "@/lib/db/moderation";
import { getMyProfile } from "@/lib/db/account";
import type { UserProfileRow, MateApplicationRow, UserBlockRow } from "@/lib/db/types";

export default function MatesPage() {
  const router = useRouter();
  const [selectedPost, setSelectedPost] =
    useState<MatePostWithComputedStatus | null>(null);
  const [profile, setProfile] = useState<UserProfileRow | null>(null);
  const [myApplications, setMyApplications] = useState<MateApplicationRow[]>([]);
  const [postApplications, setPostApplications] = useState<
    MateApplicationRow[]
  >([]);
  const [myBlocks, setMyBlocks] = useState<UserBlockRow[]>([]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const isAuthenticated = !!profile;
  const isAdult = profile?.is_adult ?? false;
  const isPostAuthor = selectedPost?.author_id === profile?.id;
  const isPostAuthorBlocked = myBlocks.some(
    (b) => b.blocked_id === selectedPost?.author_id,
  );

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const p = await getMyProfile();
        setProfile(p);
      } catch {
        setProfile(null);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    const loadMyApplications = async () => {
      if (!isAuthenticated) return;
      try {
        const apps = await listMyApplications();
        setMyApplications(apps);
      } catch {
        setMyApplications([]);
      }
    };

    loadMyApplications();
  }, [isAuthenticated]);

  useEffect(() => {
    const loadPostApplications = async () => {
      if (!selectedPost || !isPostAuthor) {
        setPostApplications([]);
        return;
      }
      try {
        const apps = await listApplicationsForPost(selectedPost.id);
        setPostApplications(apps);
      } catch {
        setPostApplications([]);
      }
    };

    loadPostApplications();
  }, [selectedPost, isPostAuthor]);

  useEffect(() => {
    const loadMyBlocks = async () => {
      if (!isAuthenticated) return;
      try {
        const blocks = await listMyBlocks();
        setMyBlocks(blocks);
      } catch {
        setMyBlocks([]);
      }
    };

    loadMyBlocks();
  }, [isAuthenticated]);

  const handleLoginRequired = () => {
    router.push("/account");
  };

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 py-16 md:px-20">
      {/* Intro with Write CTA */}
      <div className="flex flex-col gap-2">
        <h1 className="text-display-lg font-bold">동행 찾기</h1>
        <p className="text-body-lg text-body">
          같은 일정으로 여행할 동료를 찾고, 안전하게 동행을 신청하세요.
        </p>
        <button
          type="button"
          onClick={() => router.push("/travel-tools")}
          className="mt-2 flex h-12 w-fit items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral"
        >
          동행 글 작성하기
        </button>
      </div>

      <>
        {/* Filter + Detail Split (Desktop) / Filter + Modal (Mobile) */}
        <div className="flex flex-col gap-6 lg:gap-8 lg:flex-row">
          {/* Filter List */}
          <div className="w-full lg:w-[400px] lg:flex-shrink-0">
            <MateFilterList
              onSelectPost={(post) => {
                setSelectedPost(post);
                if (window.innerWidth < 1024) {
                  setMobileDrawerOpen(true);
                }
              }}
              selectedPost={selectedPost}
            />
          </div>

          {/* Detail Panel - Desktop */}
          <div className="hidden flex-1 lg:block">
            {selectedPost && (
              <MateDetailPanel
                post={selectedPost}
                isOpen={true}
                onClose={() => setSelectedPost(null)}
              />
            )}
          </div>
        </div>

          {/* Detail Panel - Mobile Modal */}
          <MateDetailPanel
            post={selectedPost}
            isOpen={mobileDrawerOpen && !!selectedPost}
            onClose={() => setMobileDrawerOpen(false)}
          />

          {/* Application Section (if post selected) */}
          {selectedPost && (
            <div className="rounded-md border border-hairline bg-surface-soft p-6">
              <h2 className="text-title-md font-semibold">참가 신청</h2>
              <div className="mt-4">
                <ApplicationForm
                  postId={selectedPost.id}
                  isPostAuthor={isPostAuthor}
                  userApplications={myApplications}
                  postAuthorApplications={postApplications}
                  isAuthenticated={isAuthenticated}
                  isAdult={isAdult}
                  onLoginRequired={handleLoginRequired}
                />
              </div>
            </div>
          )}

          {/* Application Steps Guide */}
          <div className="rounded-md border border-hairline p-6">
            <h2 className="text-title-md font-semibold">참가 방법</h2>
            <ol className="mt-4 flex flex-col gap-4 lg:flex-row">
              {[
                { step: 1, title: "글 선택", desc: "마음에 드는 동행을 찾아 선택하세요." },
                { step: 2, title: "신청", desc: "간단한 메시지와 함께 참가를 신청하세요." },
                { step: 3, title: "만남", desc: "승인 후 작성자와 일정을 협의하세요." },
              ].map(({ step, title, desc }) => (
                <li key={step} className="flex flex-1 flex-col gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-coral text-button font-bold text-on-coral">
                    {step}
                  </div>
                  <h3 className="text-body-md font-semibold">{title}</h3>
                  <p className="text-body-md text-muted">{desc}</p>
                </li>
              ))}
            </ol>
          </div>

        {/* Safety + Report/Block Section */}
        {selectedPost && (
          <ReportBlockActions
            post={selectedPost}
            isAuthenticated={isAuthenticated}
            isAdult={isAdult}
            isAuthor={isPostAuthor}
            isBlocked={isPostAuthorBlocked}
            onLoginRequired={handleLoginRequired}
          />
        )}
      </>
    </div>
  );
}
