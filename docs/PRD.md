# 복지정책 정보 웹앱 PRD (tripstay-webapp)

## 목적
"원주시 출산지원금" 같은 [지역명+정책명] 키워드 검색 시
구글 상위 노출 → 애드센스 수익 창출.

## 도메인
tripstay.co.kr (기존 애드센스 승인 도메인)

## 기술 스택
- Next.js 15 App Router + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Supabase (PostgreSQL, Seoul)
- Vercel 배포

## URL 구조
/ : 메인 (지역 검색창 + 정책 카드)
/[sido]/[city]/[policy] : 상세 페이지 (색인 핵심)
/policy/[policyId] : 정책별 전국 목록
/region/[sido] : 광역시도별 목록

## Supabase
- Project ID: uwbzmtjttwdbxbtmpysk
- Region: Seoul
- 테이블: benefits, national_benefits

## 8개 정책
- birth-support: 출산지원금
- first-meeting: 첫만남이용권
- parental-allowance: 부모급여
- child-allowance: 아동수당
- childcare-fee: 보육료
- nurturing-allowance: 양육수당
- postpartum-care: 산모신생아건강관리
- pregnancy-care: 임신출산진료비

## 수익화
- AdSense ID: ca-pub-1982340875676348
- 자동광고 + 전면광고 ON
- 내부 링크 버튼 3개 클릭 시 전면광고 트리거

## SEO
- generateStaticParams → 빌드 시 최대 1,840개 정적 페이지
- sitemap.xml 자동 생성
- IndexNow key: 8352bf06e13c46e68d72aaf5842d674f

## 배포 순서
1. Supabase benefits 테이블에 데이터 100개 이상 확인
2. npm run build 성공 확인
3. GitHub push → Vercel 연결
4. tripstay.co.kr DNS → Vercel로 전환
5. IndexNow 일괄 색인 요청
