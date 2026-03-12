# tripstay-webapp

## 역할
복지정책 정보 웹앱. Supabase DB 데이터를 읽어 정적 페이지로 렌더링.

## 핵심 규칙
1. 작업 완료 후 항상 npm run build 실행
2. TypeScript 에러 0개 유지
3. 서버 컴포넌트 / 클라이언트 컴포넌트 명확히 구분
4. 한국어로 응답

## URL 구조
- 상세: /[sido]/[city]/[policy]
- 목록: /policy/[policyId]
- 지역: /region/[sido]

## Supabase
- 클라이언트: src/lib/supabase.ts
- 서버 전용 키(SERVICE_ROLE_KEY)는 서버 컴포넌트에서만 사용

## 환경변수 (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://uwbzmtjttwdbxbtmpysk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_ADSENSE_ID=ca-pub-1982340875676348
INDEXNOW_KEY=8352bf06e13c46e68d72aaf5842d674f
