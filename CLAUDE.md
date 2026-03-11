# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**복지다모아** — 전국 250개 시/군/구 × 8개 복지정책 = 2,000개 정적 페이지를 생성하는 복지정책 정보 웹앱. 구글 SEO 상위 노출 + 애드센스 수익화 목표.

## Tech Stack

- **Next.js 15 App Router** + TypeScript
- **Tailwind CSS v4** — `tailwind.config.js` 불필요, `globals.css`에 인라인 테마 정의
- **Supabase** (`@supabase/supabase-js`) — PostgreSQL 백엔드
- **shadcn/ui** + lucide-react
- **Vercel** 배포

## Commands

```bash
npm run dev      # 개발 서버 (localhost:3000, Turbopack)
npm run build    # 프로덕션 빌드 (반드시 Phase 완료 후 실행)
npm run lint     # ESLint 검사
npm start        # 프로덕션 서버 실행
```

**작업 완료 후 항상 `npm run build` 실행 — TypeScript 에러 0개 유지.**

## Architecture

### URL Structure

```
/[sido]/[city]/[policy]    ← 상세 페이지 (핵심, 2,000개 SSG)
/policy/[policyId]         ← 정책별 전국 목록
/region/[sido]             ← 광역시도별 목록
```

### Directory Layout

```
src/
├── app/
│   ├── layout.tsx                  ← 루트 레이아웃 (애드센스 스크립트 포함)
│   ├── page.tsx                    ← 메인 (지역 검색 + 8개 정책 카드)
│   ├── [sido]/[city]/[policy]/
│   │   └── page.tsx                ← 상세 페이지 (generateStaticParams + generateMetadata)
│   ├── policy/[policyId]/page.tsx  ← 정책별 목록
│   ├── region/[sido]/page.tsx      ← 광역시도별 목록
│   └── sitemap.ts                  ← 자동 sitemap (Supabase에서 2,000개 URL)
├── components/
│   ├── AdBanner.tsx                ← 애드센스 배너
│   ├── InternalLinkButtons.tsx     ← 내부 링크 버튼 (전면광고 트리거)
│   └── NationalBenefitsTable.tsx   ← 전국 공통 혜택 표
├── lib/
│   ├── supabase.ts                 ← 서버/클라이언트 분리된 Supabase 클라이언트
│   └── constants.ts                ← 정책/지역 상수
└── types/
    └── index.ts                    ← Benefit, NationalBenefit, Policy, Region 타입
```

### Key Patterns

**Static Generation:** `generateStaticParams`로 빌드 시 Supabase에서 전체 `(sido, city_name, policy_id)` 조회 → 2,000개 페이지 정적 생성.

**Server/Client Component 분리:**
- 서버 컴포넌트: Supabase 데이터 페칭, `generateStaticParams`, `generateMetadata`
- 클라이언트 컴포넌트: 검색창, 인터랙티브 UI (파일 상단 `"use client"`)
- `SUPABASE_SERVICE_ROLE_KEY`는 서버 컴포넌트에서만 사용

**HTML 콘텐츠 렌더링:** Gemini 생성 콘텐츠는 `dangerouslySetInnerHTML` + `prose` 클래스 적용.

**내부 링크 버튼 스타일:** `background: #1f1bc4`, 흰색 텍스트, `border-radius: 12px`

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_ADSENSE_ID=ca-pub-1982340875676348
INDEXNOW_KEY=8352bf06e13c46e68d72aaf5842d674f
```

## Supabase Schema

**`benefits` 테이블:** `id`, `city_name`, `sido`, `policy_id`, `policy_name`, `title`, `content`, `meta_description`, `tags[]`, `slug` (UNIQUE), `created_at`
- 인덱스: `(city_name, policy_id)`, `sido`, `policy_id`
- RLS: public read 허용

**`national_benefits` 테이블:** `id`, `policy_id`, `name`, `amount`, `description`, `apply_url`
- RLS: public read 허용

## AdSense

레이아웃에 삽입:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1982340875676348" crossorigin="anonymous"></script>
```

## Development Phases

전체 구현 계획은 `docs/welfare-cursor-prompt.md` 참조. 한 번에 전체 구현 금지 — Phase별 순차 진행:
1. 프로젝트 초기화 및 골격
2. Supabase DB 설계 및 데이터 파이프라인
3. 정적 UI 구축 (더미 데이터)
4. 핵심 기능 구현 (Supabase 연동)
5. SEO 최적화 및 Vercel 배포

각 Phase 완료 시 `npm run build` 검증 후 Git 커밋 (Conventional Commits).
