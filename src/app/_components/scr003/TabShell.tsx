"use client";

import { useState, type ReactNode } from "react";

export interface TabDefinition {
  id: string;
  label: string;
  panel: ReactNode;
  /** 이 탭 패널 최상위 요소에 붙는 data-testid(E2E 접근 계약) */
  testId: string;
}

export interface TabShellProps {
  intro: string;
  tabs: TabDefinition[];
}

/**
 * 탭 전환 시에도 각 패널을 계속 마운트 상태로 두고 `hidden`으로만 감춘다
 * (탭 상태 완전 분리 — SCREEN_ROUTE_CONTRACT.json의 tab_state_isolation_required).
 * 이렇게 해야 항공/숙소/동행 탭이 각자 독립적인 React 상태를 유지하고,
 * 전환 시 다른 탭 값이 초기화되거나 서로 섞이지 않는다.
 */
export function TabShell({ intro, tabs }: TabShellProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-body-lg text-body">{intro}</p>

      <div role="tablist" aria-label="여행 준비 탭" className="flex gap-6 border-b border-hairline">
        {tabs.map((tab) => {
          const active = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${tab.id}-tab`}
              aria-selected={active}
              aria-controls={`${tab.id}-panel`}
              onClick={() => setActiveId(tab.id)}
              className={
                active
                  ? "border-b-2 border-coral px-1 pb-3 text-button font-medium text-ink"
                  : "border-b-2 border-transparent px-1 pb-3 text-button font-medium text-muted"
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${tab.id}-panel`}
          aria-labelledby={`${tab.id}-tab`}
          data-testid={tab.testId}
          hidden={tab.id !== activeId}
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
