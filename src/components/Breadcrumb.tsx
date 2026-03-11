import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="mb-5">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1">
            {idx > 0 && <span className="text-gray-300">›</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-[#1f1bc4] hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-800">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
