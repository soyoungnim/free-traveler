# Free Traveler — Design Manifest

- **Active Design Version:** D-001
- **Status:** LOCKED
- **Active File:** `design-reference/D-001/DESIGN.md`
- **Vendor Reference:** `design-reference/vendor/airbnb/DESIGN.md` (structure/tone reference only — no Airbnb trademark elements reused)
- **Approved Screens:** SCR-001, SCR-002, SCR-003, SCR-004, SCR-005
- **Mobile Variants:** SCR-001, SCR-003

## 사용 규칙

- 모든 화면·컴포넌트 작업은 `design-reference/D-001/DESIGN.md`를 정본으로 따른다.
- `design-reference/vendor/airbnb/DESIGN.md`는 참고 전용이며, 직접 값(컬러 hex, 서체, 컴포넌트 이름 등)을 그대로 가져다 쓰지 않는다.
- D-001이 `LOCKED` 상태인 동안 정본 파일을 변경하려면 새 버전(D-002 등)을 만들고 이 매니페스트의 `Active Design Version`을 갱신한다. D-001 파일 자체를 직접 고쳐 쓰지 않는다.
- Stitch에서 화면을 추가·재생성할 때는 `Approved Screens` 목록의 SCR ID와 `design-reference/D-001/DESIGN.md`의 토큰·규칙을 그대로 참조한다.

## 근거 문서

| 문서 | 역할 |
|---|---|
| `docs/04_UIUX_PLAN.md` | D-001의 1차 소스 — Section 계약, 화면 구조, 토큰 초안 |
| `docs/STITCH_VALIDATION_REPORT.md` | Stitch 생성 결과 검증 기록 — 금지 요소(별점, 신뢰도 배지, Airbnb 텍스트, "정보 확인 필요", 미승인 신원 인증 문구) 발견 근거이자 D-001의 Do Not 항목 출처 |
| `design-reference/vendor/airbnb/DESIGN.md` | 외부 참고본(구조·톤만 참고, 상표·컬러 값 미사용) |

## Known Sync Notes

- Stitch 프로젝트(`https://stitch.withgoogle.com/projects/2159623832949402727`)의 실제 생성 화면은 이 매니페스트의 `Approved Screens`/`Mobile Variants`와 아직 1:1로 동기화되지 않았다: SCR-001만 5개 중복 생성되어 있고 SCR-002~005 및 두 Mobile 변형은 미생성 상태다(`docs/STITCH_VALIDATION_REPORT.md` 참고).
- 이 매니페스트의 `Approved Screens`/`Mobile Variants`는 **디자인 정본상 승인된 범위**를 뜻하며, Stitch 프로젝트의 실제 산출물 상태를 보증하지 않는다. Stitch 산출물을 실제 구현에 반영하기 전에는 반드시 `docs/STITCH_VALIDATION_REPORT.md`의 최신 판정을 재확인한다.
