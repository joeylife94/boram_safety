# 로깅 및 production 번들 내 console 처리 정책

마지막 업데이트: 2025-11-09

요약
- 운영(프로덕션) 번들에 직접적인 `console.*` 호출이 남아 서비스 성능/보안/가독성에 영향을 주지 않도록 관리합니다.
- 채택한 전략(복합):
  1. 빌드 시 대부분의 `console.*` 호출을 제거(drop) — terser를 사용 (Webpack/Terser 설정).
  2. 소스 레벨에서 중요한 로그(`error`, `warn`)는 중앙 `logger`로 대체해 수집/전송(개발 환경에서는 콘솔 출력 유지).
  3. 빌드 산출물(.next)에 남아있는 콘솔 호출은 안전하게 무력화(post-build) 스크립트로 처리(백업 생성).

배경/이유
- 번들에 남은 개발용 콘솔 로그는 민감 정보 노출 가능성, 번들 크기 증가, 로그 노이즈로 인한 모니터링 비용 증가 등의 문제를 일으킵니다.
- 외부 라이브러리나 런타임에서 생성되는 console 호출은 빌드 단계에서 완벽히 제거되지 않을 수 있습니다. 이 경우 서버 로그 보존 여부를 고려해 처리 범위를 조정합니다.

정책(요약)
- 프로덕션 빌드에서는 client 번들과 server 번들(선택)에 대해 `drop_console`를 적용한다.
- 소스에서 `console.error`/`console.warn`는 `src/lib/logger.ts`의 `logger.error`/`logger.warn`로 대체한다. 개발에서는 logger가 console을 사용함.
- 번들 레벨에 남아있는 console.*는 post-build에서 안전하게 무력화(예: `console.` → `__c.`)하되, 원본 파일은 `.bak`으로 보관해 복구 가능토록 한다.

이번 변경(핵심)
- 변경일: 2025-11-09
- 적용된 변경사항:
  - `frontend/next.config.js`에 Terser(webpack) 설정 추가 (production에서 `drop_console: true`).
  - `frontend/package.json`에 `terser-webpack-plugin` 기입 및 `strip-console` npm 스크립트 추가.
  - `frontend/src/lib/logger.ts` 추가(개발: console 출력, 프로덕션: 원격 전송 시도).
  - 여러 소스 파일에서 `console.*` → `logger.*`로 점진적 교체(관리자/검색 컴포넌트 등).
  - `frontend/scripts/strip-console.js` 추가: 빌드 후 `.next`의 JS 파일을 순회하며 `console.` 호출을 `__c.`로 대체하고 원본을 `.bak`으로 백업.

어떻게 재현/검증할까
1. 프론트엔드 루트로 이동:
   ```powershell
   cd frontend
   ```
2. 의존성 설치(필요 시):
   ```powershell
   npm install
   ```
3. production 빌드 실행:
   ```powershell
   npm run build
   ```
4. 빌드 후 post-strip 실행(수동 또는 CI에서 자동화):
   ```powershell
   npm run strip-console
   ```
5. 번들에서 남아있는 `console.` 패턴 확인(선택):
   ```powershell
   Get-ChildItem -Path '.\.next' -Recurse -Filter '*.js' | ForEach-Object { $c = Get-Content -Raw -LiteralPath $_.FullName -ErrorAction SilentlyContinue; if ($null -ne $c -and $c -match 'console\.(error|warn|log)') { Write-Output $_.FullName } }
   ```

롤백/복구
- post-strip가 만든 `.bak` 파일들로 복원 가능합니다. 예: 전체 복원(주의):
  ```powershell
  Get-ChildItem -Path .\.next -Recurse -Filter '*.bak' | ForEach-Object {
    $orig = $_.FullName -replace '\.bak$','';
    Move-Item -Path $_.FullName -Destination $orig -Force;
  }
  ```

보안/운영 주의
- 서버(백엔드) 로그는 운영에서 중요할 수 있으므로 서버 번들에서 console 제거 여부는 서비스 운영팀과 협의 후 결정하세요.
- `logger`가 원격 전송을 시도할 때 민감한 정보를 로깅하지 않도록 필터링/마스킹 정책을 수립하세요.

향후 작업 권장
- 소스 레벨에서 `logger`로의 점진적 전환(특히 `error`/`warn`)을 계속 진행.
- CI 파이프라인에 `npm run strip-console`을 포함해 자동화(또는 빌드 시 terser로 완전 제거 가능하도록 개선).
- 중앙 로깅(예: Sentry, Datadog 등) 연동을 고려.

문서 및 기록
- 변경 내역은 `docs/CHANGELOG.md`에 기록되었고, 이 파일은 프로젝트 릴리스 히스토리와 맞춰 관리하세요.

문의
- 더 자세한 정책(레벨별 어떤 로그를 남길지, 민감정보 필터링 규칙 등) 설계가 필요하면 알려주세요.

***
