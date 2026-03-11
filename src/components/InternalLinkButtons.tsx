import Link from 'next/link'

interface LinkItem {
  label: string
  href: string
}

interface InternalLinkButtonsProps {
  links: LinkItem[]
}

export default function InternalLinkButtons({ links }: InternalLinkButtonsProps) {
  return (
    <div className="mt-8">
      <h3 className="mb-3 text-sm font-semibold text-gray-600">관련 정보 더 보기</h3>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-block rounded-xl px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1f1bc4' }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
