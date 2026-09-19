"use client";

import { useState, useEffect } from "react";
import {
  listReportsForStaff,
  resolveReport,
  dismissReport,
} from "@/lib/db/moderation";
import {
  getOutboundUrl,
  setOutboundUrl,
  type OutboundUrlKey,
} from "@/lib/db/admin-settings";
import type { ReportRow } from "@/lib/db/types";

interface ToastState {
  message: string;
  type: "success" | "error";
}

export function AdminPanel() {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [reportFilter, setReportFilter] = useState<"OPEN" | "RESOLVED" | "DISMISSED" | "ALL">("OPEN");
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [flightUrl, setFlightUrl] = useState("");
  const [hotelUrl, setHotelUrl] = useState("");
  const [isLoadingUrls, setIsLoadingUrls] = useState(false);
  const [isSavingFlight, setIsSavingFlight] = useState(false);
  const [isSavingHotel, setIsSavingHotel] = useState(false);
  const [processingReportId, setProcessingReportId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const loadReports = async () => {
      setIsLoadingReports(true);
      try {
        const status = reportFilter === "ALL" ? undefined : (reportFilter as "OPEN" | "RESOLVED" | "DISMISSED");
        const data = await listReportsForStaff(status);
        setReports(data);
      } catch {
        setReports([]);
        showToast("신고 목록을 불러오지 못했습니다.", "error");
      } finally {
        setIsLoadingReports(false);
      }
    };

    loadReports();
  }, [reportFilter]);

  useEffect(() => {
    const loadUrls = async () => {
      setIsLoadingUrls(true);
      try {
        const [flight, hotel] = await Promise.all([
          getOutboundUrl("FLIGHT_OUTBOUND_URL"),
          getOutboundUrl("HOTEL_OUTBOUND_URL"),
        ]);
        setFlightUrl(flight || "");
        setHotelUrl(hotel || "");
      } catch {
        showToast("설정을 불러오지 못했습니다.", "error");
      } finally {
        setIsLoadingUrls(false);
      }
    };

    loadUrls();
  }, []);

  const handleResolveReport = async (reportId: string) => {
    setProcessingReportId(reportId);
    try {
      const result = await resolveReport(reportId);
      if (result.error) {
        showToast("처리 중 오류가 발생했습니다.", "error");
      } else {
        showToast("신고를 접수했습니다.", "success");
        setReports((prev) => prev.filter((r) => r.id !== reportId));
      }
    } catch {
      showToast("예상치 못한 오류가 발생했습니다.", "error");
    } finally {
      setProcessingReportId(null);
    }
  };

  const handleDismissReport = async (reportId: string) => {
    setProcessingReportId(reportId);
    try {
      const result = await dismissReport(reportId);
      if (result.error) {
        showToast("처리 중 오류가 발생했습니다.", "error");
      } else {
        showToast("신고를 기각했습니다.", "success");
        setReports((prev) => prev.filter((r) => r.id !== reportId));
      }
    } catch {
      showToast("예상치 못한 오류가 발생했습니다.", "error");
    } finally {
      setProcessingReportId(null);
    }
  };

  const handleSaveUrl = async (key: OutboundUrlKey, url: string, isFlight: boolean) => {
    if (isFlight) {
      setIsSavingFlight(true);
    } else {
      setIsSavingHotel(true);
    }

    try {
      const result = await setOutboundUrl(key, url);
      if (result.error) {
        showToast(`URL 저장 실패: ${result.error}`, "error");
      } else {
        showToast("URL이 저장되었습니다.", "success");
      }
    } catch {
      showToast("예상치 못한 오류가 발생했습니다.", "error");
    } finally {
      if (isFlight) {
        setIsSavingFlight(false);
      } else {
        setIsSavingHotel(false);
      }
    }
  };

  const filteredReports = reportFilter === "ALL"
    ? reports
    : reports.filter((r) => r.status === reportFilter);

  return (
    <div className="flex flex-col gap-8">
      {/* 신고 관리 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-title-md font-semibold">신고 관리</h3>

        {/* 필터 */}
        <div className="flex gap-2">
          {["OPEN", "RESOLVED", "DISMISSED", "ALL"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setReportFilter(status as "OPEN" | "RESOLVED" | "DISMISSED" | "ALL")}
              className={`rounded-full px-4 py-2 text-caption font-medium transition ${
                reportFilter === status
                  ? "bg-coral-soft text-coral-active"
                  : "bg-surface-strong text-ink"
              }`}
            >
              {status === "OPEN"
                ? "접수 대기"
                : status === "RESOLVED"
                  ? "접수됨"
                  : status === "DISMISSED"
                    ? "기각됨"
                    : "전체"}
            </button>
          ))}
        </div>

        {/* 신고 목록 */}
        {isLoadingReports ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-md bg-surface-soft" />
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="rounded-md border border-hairline bg-surface-soft px-6 py-8 text-center">
            <p className="text-body-md font-medium text-ink">신고가 없습니다.</p>
            <p className="mt-1 text-body-md text-muted">
              사용자 신고가 접수되면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="rounded-md border border-hairline p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-body-md font-semibold text-ink">
                        {report.target_type === "POST" ? "동행글" : "기타"} 신고
                      </h4>
                      <span
                        className={`text-caption font-medium ${
                          report.status === "OPEN"
                            ? "text-error"
                            : report.status === "RESOLVED"
                              ? "text-success"
                              : "text-muted"
                        }`}
                      >
                        {report.status === "OPEN"
                          ? "대기"
                          : report.status === "RESOLVED"
                            ? "접수됨"
                            : "기각됨"}
                      </span>
                    </div>
                    <p className="mt-2 text-body-md text-muted">
                      사유: {report.reason_code}
                    </p>
                    {report.description && (
                      <p className="mt-1 whitespace-pre-wrap text-body-md text-body">
                        {report.description}
                      </p>
                    )}
                    <p className="mt-2 text-caption text-muted">
                      신고 ID: {report.id.slice(0, 8)}
                    </p>
                  </div>
                </div>

                {report.status === "OPEN" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={processingReportId === report.id}
                      onClick={() => handleResolveReport(report.id)}
                      className="flex flex-1 h-10 items-center justify-center rounded-sm bg-success px-3 text-button text-on-coral disabled:bg-coral-disabled"
                    >
                      접수
                    </button>
                    <button
                      type="button"
                      disabled={processingReportId === report.id}
                      onClick={() => handleDismissReport(report.id)}
                      className="flex flex-1 h-10 items-center justify-center rounded-sm border border-hairline px-3 text-button text-ink"
                    >
                      기각
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 외부 URL 설정 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-title-md font-semibold">외부 링크 설정</h3>
        <p className="text-body-md text-muted">
          HTTPS URL만 허용됩니다. 항공·숙소 검색 사이트 주소를 설정하세요.
        </p>

        {isLoadingUrls ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-md bg-surface-soft" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <label className="flex flex-col gap-1.5 text-body-md text-ink">
              항공편 검색 사이트
              <input
                type="text"
                value={flightUrl}
                onChange={(e) => setFlightUrl(e.target.value)}
                disabled={isSavingFlight}
                placeholder="https://example.com"
                className="h-11 rounded-sm border border-hairline px-3 text-body-md disabled:bg-surface-soft"
              />
              <button
                type="button"
                disabled={isSavingFlight || !flightUrl}
                onClick={() => handleSaveUrl("FLIGHT_OUTBOUND_URL", flightUrl, true)}
                className="mt-2 flex h-10 items-center justify-center rounded-sm bg-coral px-4 text-button text-on-coral disabled:bg-coral-disabled"
              >
                {isSavingFlight ? "저장 중..." : "저장"}
              </button>
            </label>

            <label className="flex flex-col gap-1.5 text-body-md text-ink">
              숙소 검색 사이트
              <input
                type="text"
                value={hotelUrl}
                onChange={(e) => setHotelUrl(e.target.value)}
                disabled={isSavingHotel}
                placeholder="https://example.com"
                className="h-11 rounded-sm border border-hairline px-3 text-body-md disabled:bg-surface-soft"
              />
              <button
                type="button"
                disabled={isSavingHotel || !hotelUrl}
                onClick={() => handleSaveUrl("HOTEL_OUTBOUND_URL", hotelUrl, false)}
                className="mt-2 flex h-10 items-center justify-center rounded-sm bg-coral px-4 text-button text-on-coral disabled:bg-coral-disabled"
              >
                {isSavingHotel ? "저장 중..." : "저장"}
              </button>
            </label>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-4 left-4 right-4 rounded-sm px-4 py-3 text-body-md text-on-coral md:left-auto md:right-auto md:w-fit md:self-center ${
            toast.type === "success" ? "bg-success" : "bg-error"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
