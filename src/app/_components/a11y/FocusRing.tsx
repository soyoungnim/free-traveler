import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * D-001 접근성 공통 규칙(§0-1-5)을 만족시키기 위해 다른 Component Task가
 * 가져다 쓰는 공통 유틸리티다. 색상만으로 상태를 구분하지 않고, 키보드
 * 포커스를 항상 시각적으로 표시하며, 터치 대상을 44×44px 이상으로 유지한다.
 */

/** `:focus-visible`에서만 ink 색 2px 아웃라인을 보여준다(마우스 클릭 시엔 표시하지 않음). */
export const focusRingClassName =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

/** 모든 인터랙션 요소(버튼·링크·탭·입력)의 최소 터치 영역. */
export const minTouchTargetClassName = "min-h-[44px] min-w-[44px]";

/** 위 두 규칙을 한 번에 적용하는 조합 클래스. */
export const interactiveClassName = `${focusRingClassName} ${minTouchTargetClassName}`;

type FocusRingProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/**
 * 버튼·링크가 아닌 커스텀 인터랙션 요소(예: 카드 전체를 클릭 대상으로 쓰는 경우)를
 * 감싸 focus-visible 아웃라인과 최소 터치 영역을 강제한다.
 */
export function FocusRing<T extends ElementType = "div">({
  as,
  children,
  className = "",
  ...rest
}: FocusRingProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      className={`${interactiveClassName} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Component>
  );
}

/**
 * 색상 단독으로 상태를 구분하지 않기 위한 텍스트 라벨을 화면에는 숨기고
 * 스크린리더에만 제공한다(예: 아이콘만 있는 버튼의 설명 텍스트).
 */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}
