/**
 * 자유 텍스트 입력(title, description, bio, message 등)을 저장하기 전에
 * 거치는 최소 방어선. React는 렌더링 시 텍스트를 기본적으로 이스케이프하지만,
 * 저장 단계에서도 태그 자체를 제거해 저장 XSS 표면을 줄인다(Security AC).
 */
export function sanitizeFreeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .trim();
}
