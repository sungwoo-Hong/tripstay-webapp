import type { Policy, Region } from '@/types'

export const POLICIES: Policy[] = [
  { id: 'birth-support', name: '출산지원금', icon: '👶', description: '지역별 출산 장려금 및 축하금' },
  { id: 'first-voucher', name: '첫만남이용권', icon: '🎁', description: '출생아 대상 200만원 바우처' },
  { id: 'parental-benefit', name: '부모급여', icon: '💰', description: '만 0~1세 월정액 현금 지원' },
  { id: 'child-allowance', name: '아동수당', icon: '🧒', description: '만 8세 미만 월 10만원 지원' },
  { id: 'childcare-fee', name: '보육료', icon: '🏫', description: '어린이집 이용 보육료 지원' },
  { id: 'nurturing-allowance', name: '양육수당', icon: '🏠', description: '가정양육 시 양육수당 지원' },
  { id: 'postpartum-care', name: '산모신생아건강관리', icon: '🤱', description: '출산 후 건강관리사 파견 지원' },
  { id: 'pregnancy-fee', name: '임신출산진료비', icon: '🏥', description: '임신·출산 의료비 국민행복카드 지원' },
]

export const SIDO_LIST = [
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원특별자치도',
  '충청북도',
  '충청남도',
  '전북특별자치도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
]

// 샘플 지역 데이터 (실제 데이터는 Supabase에서 조회)
export const SAMPLE_REGIONS: Region[] = [
  { name: '고양시', sido: '경기도', code: '41281' },
  { name: '수원시', sido: '경기도', code: '41111' },
  { name: '성남시', sido: '경기도', code: '41131' },
  { name: '강남구', sido: '서울특별시', code: '11680' },
  { name: '해운대구', sido: '부산광역시', code: '26350' },
]

// 더미 전국 공통 혜택 (실제 데이터는 Supabase에서 조회)
export const DUMMY_NATIONAL_BENEFITS = [
  { id: '1', policy_id: 'birth-support', name: '첫만남이용권', amount: '200만원', description: '출생아 1인당 바우처 지급', apply_url: 'https://www.gov.kr' },
  { id: '2', policy_id: 'birth-support', name: '부모급여 (만0세)', amount: '월 100만원', description: '만 0세 아동 가정 현금 지원', apply_url: 'https://www.gov.kr' },
  { id: '3', policy_id: 'birth-support', name: '부모급여 (만1세)', amount: '월 50만원', description: '만 1세 아동 가정 현금 지원', apply_url: 'https://www.gov.kr' },
  { id: '4', policy_id: 'birth-support', name: '아동수당', amount: '월 10만원', description: '만 8세 미만 모든 아동', apply_url: 'https://www.gov.kr' },
]

export const SITE_NAME = '복지다모아'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tripstay.co.kr'
