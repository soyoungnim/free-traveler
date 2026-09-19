"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const categories = [
    { value: "general", label: "일반 문의" },
    { value: "bug", label: "버그 신고" },
    { value: "feature", label: "기능 제안" },
    { value: "partnership", label: "제휴 문의" },
    { value: "other", label: "기타" },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name || !formData.email || !formData.message) {
        setSubmitMessage({
          type: "error",
          text: "모든 필드를 입력해주세요.",
        });
        return;
      }

      setSubmitMessage({
        type: "success",
        text: "문의가 접수되었습니다. 빠른 시간 내에 답변드리겠습니다.",
      });
      setFormData({
        name: "",
        email: "",
        category: "general",
        message: "",
      });
    } catch {
      setSubmitMessage({
        type: "error",
        text: "문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-16 md:px-20">
      <div>
        <div className="flex items-center gap-4">
          <span className="text-display-md">💬</span>
          <h1 className="text-display-md font-bold">고객 문의</h1>
        </div>
        <p className="mt-2 text-body-lg text-body">
          Free Traveler 서비스에 대한 문의사항이 있으시면 아래 양식을 작성해주세요.
        </p>
      </div>

      <div className="rounded-md border border-hairline p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-body-md text-ink">
            이름 <span className="text-error">*</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="성함을 입력해주세요"
              disabled={isSubmitting}
              className="h-11 rounded-sm border border-hairline px-3 text-body-md disabled:bg-surface-soft"
              required
            />
          </label>

          <label className="flex flex-col gap-1.5 text-body-md text-ink">
            이메일 <span className="text-error">*</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              disabled={isSubmitting}
              className="h-11 rounded-sm border border-hairline px-3 text-body-md disabled:bg-surface-soft"
              required
            />
          </label>

          <label className="flex flex-col gap-1.5 text-body-md text-ink">
            문의 분류 <span className="text-error">*</span>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
              className="h-11 rounded-sm border border-hairline px-3 text-body-md disabled:bg-surface-soft"
              required
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-body-md text-ink">
            문의 내용 <span className="text-error">*</span>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="문의 내용을 입력해주세요 (최대 1000자)"
              disabled={isSubmitting}
              maxLength={1000}
              rows={6}
              className="rounded-sm border border-hairline px-3 py-2 text-body-md disabled:bg-surface-soft"
              required
            />
            <span className="text-caption text-muted">
              {formData.message.length} / 1000
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex h-12 items-center justify-center rounded-sm bg-coral px-6 text-button text-on-coral disabled:bg-coral-disabled"
          >
            {isSubmitting ? "전송 중..." : "문의 접수"}
          </button>
        </form>

        {submitMessage && (
          <div
            className={`mt-4 rounded-sm px-4 py-3 text-body-md ${
              submitMessage.type === "success"
                ? "bg-success/10 text-success"
                : "bg-error/10 text-error"
            }`}
          >
            {submitMessage.text}
          </div>
        )}
      </div>

      <div className="rounded-md border border-hairline bg-surface-soft p-6">
        <h2 className="text-title-md font-semibold">자주 묻는 질문</h2>
        <div className="mt-4 space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-ink hover:text-coral">
              계정을 삭제하고 싶어요.
            </summary>
            <p className="mt-2 text-body-md text-body">
              계정 페이지에서 "계정 삭제" 버튼을 클릭하면 계정이 즉시 삭제됩니다. 삭제 후에는 복구할 수 없습니다.
            </p>
          </details>

          <details className="group">
            <summary className="cursor-pointer font-medium text-ink hover:text-coral">
              동행글을 어떻게 작성하나요?
            </summary>
            <p className="mt-2 text-body-md text-body">
              "여행 준비" 페이지의 "동행글 작성" 탭에서 여행 조건을 입력하고 동행을 모집할 수 있습니다. 이메일 인증이 필요합니다.
            </p>
          </details>

          <details className="group">
            <summary className="cursor-pointer font-medium text-ink hover:text-coral">
              다른 사용자를 신고하고 싶어요.
            </summary>
            <p className="mt-2 text-body-md text-body">
              동행 상세 페이지에서 "신고" 버튼을 클릭하고 신고 이유와 내용을 작성하시면 됩니다. 저희는 모든 신고를 신중하게 검토합니다.
            </p>
          </details>

          <details className="group">
            <summary className="cursor-pointer font-medium text-ink hover:text-coral">
              안전정보는 어디서 확인하나요?
            </summary>
            <p className="mt-2 text-body-md text-body">
              홈 페이지의 "국가별 주의사항" 섹션에서 15개국의 공식 안전정보를 확인할 수 있습니다. 최신 정보는 외교부 해외안전여행 사이트에서 확인하세요.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
