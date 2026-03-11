# 전국 복지정책 웹앱 개발 프롬프트 (Cursor Claude용)

---

## 역할 부여 (Role Prompting)

당신은 **Next.js 15 + Supabase 풀스택 전문가**입니다.
SEO 최적화된 정적 생성(SSG) 웹앱 구축과 애드센스 수익화에 정통한
시니어 개발자로서 아래 프로젝트를 단계별로 구현하세요.

---

## 프로젝트 개요

전국 250개 시/군/구 × 8개 복지정책 = 2,000개 페이지를 정적 생성하는
복지정책 정보 웹앱. 구글 검색 상위 노출 + 애드센스 수익화가 목표.

**레퍼런스:** https://lifewithbaby.co.kr

---

## 기술 스택 (반드시 준수)

- Next.js 15 App Router
- TypeScript
- Tailwind CSS v4 (tailwind.config.js 불필요)
- shadcn/ui + lucide-react
- Supabase (@supabase/supabase-js)
- Vercel 배포

---

## 개발 워크플로우 (단계별 — 절대 한번에 전체 구현 금지)

### PHASE 1: 프로젝트 초기화 및 골격 구축

#### 1-1. Next.js 프로젝트 생성
```bash
npx create-next-app@latest welfare-webapp \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --turbopack
cd welfare-webapp
```

#### 1-2. 의존성 설치
```bash
npm install @supabase/supabase-js
npx shadcn@latest init
npx shadcn@latest add button card badge input
```

#### 1-3. 환경 변수 설정
`.env.local` 파일 생성:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_ADSENSE_ID=ca-pub-1982340875676348
INDEXNOW_KEY=8352bf06e13c46e68d72aaf5842d674f
```

#### 1-4. 디렉토리 구조 생성
```
src/
├── app/
│   ├── layout.tsx               ← 루트 레이아웃 (애드센스 스크립트)
│   ├── page.tsx                 ← 메인 (지역 검색)
│   ├── [sido]/
│   │   └── [city]/
│   │       └── [policy]/
│   │           ├── page.tsx     ← 상세 페이지 (핵심)
│   │           ├── loading.tsx
│   │           └── not-found.tsx
│   ├── policy/
│   │   └── [policyId]/
│   │       └── page.tsx         ← 정책별 목록
│   ├── region/
│   │   └── [sido]/
│   │       └── page.tsx         ← 광역시도별 목록
│   └── sitemap.ts               ← 자동 sitemap 생성
├── components/
│   ├── AdBanner.tsx             ← 애드센스 배너
│   ├── InternalLinkButtons.tsx  ← 전면광고 트리거 버튼
│   └── NationalBenefitsTable.tsx ← 전국 공통 혜택 표
├── lib/
│   ├── supabase.ts              ← Supabase 클라이언트
│   └── constants.ts             ← 정책/지역 상수
└── types/
    └── index.ts                 ← TypeScript 타입 정의
```

#### 1-5. TypeScript 타입 정의 (`src/types/index.ts`)
```typescript
export type Benefit = {
  id: string
  city_name: string
  sido: string
  policy_id: string
  policy_name: string
  title: string
  content: string
  meta_description: string
  tags: string[]
  slug: string
  created_at: string
}

export type NationalBenefit = {
  id: string
  policy_id: string
  name: string
  amount: string
  description: string
  apply_url: string
}

export type Policy = {
  id: string
  name: string
  wpCategorySlug: string
}

export type Region = {
  name: string
  sido: string
  code: string
}
```

#### 1-6. Supabase 클라이언트 (`src/lib/supabase.ts`)
서버/클라이언트 분리하여 생성.
공식 문서: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

---

### PHASE 2: Supabase DB 설계 및 데이터 파이프라인 연결

#### 2-1. Supabase 테이블 생성 SQL
Supabase MCP를 사용하여 아래 테이블 생성:

```sql
-- benefits 테이블
CREATE TABLE benefits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  city_name text NOT NULL,
  sido text NOT NULL,
  policy_id text NOT NULL,
  policy_name text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  meta_description text,
  tags text[],
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 인덱스 (검색 성능)
CREATE INDEX idx_benefits_city_policy ON benefits(city_name, policy_id);
CREATE INDEX idx_benefits_sido ON benefits(sido);
CREATE INDEX idx_benefits_policy_id ON benefits(policy_id);

-- RLS 정책
ALTER TABLE benefits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "benefits_public_read" ON benefits
  FOR SELECT USING (true);

-- national_benefits 테이블 (전국 공통 혜택)
CREATE TABLE national_benefits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_id text NOT NULL,
  name text NOT NULL,
  amount text NOT NULL,
  description text,
  apply_url text
);

ALTER TABLE national_benefits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "national_benefits_public_read" ON national_benefits
  FOR SELECT USING (true);
```

#### 2-2. 기존 파이프라인 수정 (tripstay-pipeline 프로젝트)
`src/uploader.js` 교체:
- WordPress REST API 호출 제거
- Supabase INSERT로 교체
- `@supabase/supabase-js` 설치 후 구현
- upsert 사용 (slug 중복 시 업데이트)

---

### PHASE 3: 정적 UI 구축 (더미 데이터 기반)

> 비즈니스 로직 연동 전 마크업 먼저 완성 — UI 수정 시 로직 오염 방지

#### 3-1. 레이아웃 (`src/app/layout.tsx`)
- 애드센스 스크립트 삽입
  ```html
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1982340875676348" crossorigin="anonymous"></script>
  ```
- 공통 헤더 (사이트명: 복지다모아)
- 공통 푸터

#### 3-2. 상세 페이지 UI (`src/app/[sido]/[city]/[policy]/page.tsx`)
더미 데이터로 아래 구조 구현:

```
[제목] 고양시 출산지원금 신청방법 및 지원금액 총정리

[전국 공통 혜택 표]
혜택명 | 지원금액 | 대상
첫만남이용권 | 200만원 | 출생아
부모급여 | 만0세 100만원, 만1세 50만원 | 만0~1세
아동수당 | 월 10만원 | 만8세 미만

[애드센스 배너]

[Gemini 생성 콘텐츠 HTML 렌더링]
  - dangerouslySetInnerHTML 사용
  - prose 클래스 적용

[내부 링크 버튼 3개] ← 전면광고 트리거
  - 경기도 전체 출산지원금 보기
  - 전국 출산지원금 모아보기
  - 복지정책 전체보기

[외부 링크 버튼 3개]
  - 복지로 출산지원 안내
  - 정부24 신청
  - 아이사랑 보육포털
```

#### 3-3. 내부 링크 버튼 컴포넌트 (`src/components/InternalLinkButtons.tsx`)
- Next.js Link 컴포넌트 사용
- 전면광고는 애드센스 자동광고가 처리 (별도 코드 불필요)
- 버튼 스타일: background #1f1bc4, 흰색 텍스트, border-radius 12px

#### 3-4. 메인 페이지 (`src/app/page.tsx`)
- 지역 검색창 (도시명 입력 → 해당 지역 페이지로 이동)
- 8개 정책 카드 (아이콘 + 정책명)
- 최근 등록 지역 목록

---

### PHASE 4: 핵심 기능 구현 (Supabase 연동)

#### 4-1. 상세 페이지 데이터 페칭
```typescript
// generateStaticParams: 빌드 시 2,000개 페이지 정적 생성
export async function generateStaticParams() {
  const { data } = await supabase
    .from('benefits')
    .select('sido, city_name, policy_id')
  
  return data?.map(item => ({
    sido: encodeURIComponent(item.sido),
    city: encodeURIComponent(item.city_name),
    policy: encodeURIComponent(item.policy_id),
  })) ?? []
}

// generateMetadata: SEO 메타태그 자동 생성
export async function generateMetadata({ params }) { ... }
```

#### 4-2. 정책 목록 페이지 (`/policy/[policyId]`)
- 해당 정책의 전국 지역 목록
- 지역별 카드 (도시명 + 광역시도)
- 페이지네이션 (50개씩)

#### 4-3. 광역시도 목록 페이지 (`/region/[sido]`)
- 해당 광역시도 내 시/군/구 목록
- 정책별 바로가기 링크

---

### PHASE 5: SEO 최적화 및 배포

#### 5-1. sitemap.ts (`src/app/sitemap.ts`)
```typescript
// Supabase에서 전체 slug 조회 → 2,000개 URL 반환
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { ... }
```

#### 5-2. robots.ts
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://도메인.com/sitemap.xml',
  }
}
```

#### 5-3. Vercel 배포
- GitHub 연동 후 Vercel 배포
- 환경 변수 등록 (Supabase URL, Key, AdSense ID)
- 배포 완료 후 IndexNow 일괄 요청

---

## 개발 원칙 (반드시 준수)

### 코드 품질
- 모든 작업 완료 후 `npm run build` + TypeScript 체크 수행
- 에러 발생 시 성공할 때까지 스스로 수정
- 모르는 API 스펙은 추측하지 말고 공식 문서 확인

### 컨텍스트 관리
- 토큰 70% 초과 시 `/compact` 실행
- Phase 완료 시 반드시 Git 커밋 (Conventional Commits)
  ```
  feat: Phase 1 골격 구축 완료
  feat: Phase 2 Supabase DB 연동 완료
  ```

### 보안
- 환경 변수 하드코딩 금지
- SUPABASE_SERVICE_ROLE_KEY는 서버 컴포넌트에서만 사용
- RLS 정책 반드시 설정

---

## CLAUDE.md에 포함할 규칙

프로젝트 루트에 `CLAUDE.md` 생성 후 아래 내용 포함:

```markdown
# 복지다모아 웹앱 개발 규칙

## 기술 스택
- Next.js 15 App Router + TypeScript
- Tailwind CSS v4 (config 파일 불필요)
- Supabase + shadcn/ui
- Vercel 배포

## 필수 규칙
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
- 서버 전용 키는 서버 컴포넌트에서만 사용

## 애드센스
- ID: ca-pub-1982340875676348
- layout.tsx에 스크립트 삽입
```

---

## 서브에이전트 구성 (.claude/agents/)

### nextjs-expert.md
Next.js 15 App Router 전문가. generateStaticParams, generateMetadata,
서버/클라이언트 컴포넌트 구분, 라우팅 구조 설계 담당.

### supabase-expert.md
Supabase PostgreSQL 전문가. 테이블 설계, RLS 정책, 쿼리 최적화,
인덱스 설계 담당. 모르면 공식 문서 확인 후 구현.

### ui-ux-expert.md
Tailwind CSS + shadcn/ui 전문가. 반응형 레이아웃, 애드센스 배너 배치,
내부 링크 버튼 스타일 담당.

### seo-expert.md
Next.js SEO 전문가. sitemap.ts, robots.ts, generateMetadata,
IndexNow 일괄 요청 스크립트 담당.

---

## 시작 명령어

```bash
# 1. 프로젝트 생성
npx create-next-app@latest welfare-webapp --typescript --tailwind --eslint --app --src-dir --turbopack

# 2. Claude Code 실행
cd welfare-webapp
claude --bypass-permissions

# 3. 첫 번째 명령
/init ultrathink
```

첫 번째 명령 후 아래 입력:
```
docs/PRD.md를 읽고 PHASE 1부터 시작해줘.
구조 우선 접근법(Skeleton-First)으로 뼈대부터 잡고,
각 Phase 완료 시 반드시 npm run build로 검증 후 git commit해줘.
ultrathink
```
