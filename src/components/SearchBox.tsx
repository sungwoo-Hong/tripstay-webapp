'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    // TODO: Phase 4에서 실제 검색 로직 구현 (지역명 → 해당 지역 페이지 이동)
    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <form onSubmit={handleSearch} className="mx-auto flex max-w-lg gap-2">
      <Input
        type="text"
        placeholder="시/군/구명을 입력하세요 (예: 고양시, 강남구)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1"
      />
      <Button
        type="submit"
        className="shrink-0"
        style={{ backgroundColor: '#1f1bc4' }}
      >
        검색
      </Button>
    </form>
  )
}
