import { useState, useMemo, useDeferredValue, useTransition } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search, X, SlidersHorizontal } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '../components/Motion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import Section from '../components/Section'
import Badge from '../components/ui/Badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/Card'
import Button from '../components/ui/Button'
import { PRODUCTS, PRODUCT_CATEGORIES, type ProductCategory } from '../data/products'



export default function Catalog() {
  useDocumentTitle('Katalog')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('Semua')
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const deferredSearch = useDeferredValue(search)
  const [isPending, startTransition] = useTransition()

  const filtered = useMemo(() => {
    const q = deferredSearch.toLowerCase()
    return PRODUCTS.filter((p) => {
      const matchCategory = activeCategory === 'Semua' || p.category === activeCategory
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.shortName.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      return matchCategory && matchSearch
    })
  }, [deferredSearch, activeCategory])

  const handleCategoryChange = (cat: ProductCategory) => {
    startTransition(() => setActiveCategory(cat))
  }

  const uniqueCategories = [...new Set(PRODUCTS.map((p) => p.category))]

  return (
    <Section className="py-16 md:py-24">
      <Reveal>
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--tm-muted)' }}>Katalog</p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--tm-text-strong)' }}
          >
            Layanan & Produk
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--tm-muted)' }}>
            Solusi konstruksi dan pengadaan untuk fasilitas kesehatan di Jawa Timur, Bali, NTB, NTT, dan Sulawesi.
          </p>
        </div>
      </Reveal>

      {/* Stats Bar */}
      <Reveal>
        <div
          className="flex flex-wrap justify-center gap-6 mb-10 p-4 rounded-xl"
          style={{ backgroundColor: 'var(--tm-surface-muted)', border: '1px solid var(--tm-border)' }}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} style={{ color: 'var(--tm-accent)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--tm-text)' }}>
              <strong style={{ color: 'var(--tm-text-strong)' }}>{PRODUCTS.length}</strong> Produk & Layanan
            </span>
          </div>
          <div
            className="w-px h-5 hidden sm:block"
            style={{ backgroundColor: 'var(--tm-border)' }}
          />
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} style={{ color: 'var(--tm-accent)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--tm-text)' }}>
              <strong style={{ color: 'var(--tm-text-strong)' }}>{uniqueCategories.length}</strong> Kategori
            </span>
          </div>
        </div>
      </Reveal>

      {/* Search Bar */}
      <Reveal>
        <div className="max-w-lg mx-auto mb-8 relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--tm-muted)' }}
          />
          <input
            type="text"
            placeholder="Cari produk atau layanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-10 py-3 rounded-xl text-sm outline-none transition-shadow duration-200 focus:ring-2"
            style={{
              backgroundColor: 'var(--tm-surface)',
              border: '1px solid var(--tm-border)',
              color: 'var(--tm-text)',
              // @ts-expect-error CSS custom property
              '--tw-ring-color': 'var(--tm-accent)',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors hover:opacity-70"
              style={{ color: 'var(--tm-muted)' }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </Reveal>

      {/* Category Tabs */}
      <Reveal>
        <div className="flex justify-center mb-12">
          <div
            className="inline-flex gap-1 p-1 rounded-xl"
            style={{ backgroundColor: 'var(--tm-surface-muted)', border: '1px solid var(--tm-border)' }}
          >
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className="relative px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                style={{
                  backgroundColor: activeCategory === cat ? 'var(--tm-primary)' : 'transparent',
                  color: activeCategory === cat ? '#ffffff' : 'var(--tm-text)',
                  boxShadow: activeCategory === cat ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <Stagger className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${isPending ? 'opacity-60' : ''}`}>
          {filtered.map((product) => {
            const Icon = product.icon
            const isHovered = hoveredCard === product.slug
            return (
              <StaggerItem key={product.slug}>
                <Link to={`/catalog/${product.slug}`} className="block h-full no-underline">
                  <Card
                    className="h-full transition-all duration-300 cursor-pointer group perf-card"
                    style={{
                      border: '1px solid var(--tm-border)',
                      backgroundColor: 'var(--tm-surface)',
                      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                      boxShadow: isHovered
                        ? '0 12px 32px rgba(0,0,0,0.12)'
                        : '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={() => setHoveredCard(product.slug)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, var(--tm-primary), var(--tm-accent))',
                          }}
                        >
                          <Icon size={22} color="#ffffff" />
                        </div>
                        <Badge
                          className="text-xs"
                          style={{
                            backgroundColor: 'var(--tm-surface-muted)',
                            color: 'var(--tm-primary)',
                            border: '1px solid var(--tm-border)',
                          }}
                        >
                          {product.category}
                        </Badge>
                      </div>
                      <CardTitle
                        className="text-lg leading-tight"
                        style={{ color: 'var(--tm-text-strong)' }}
                      >
                        {product.name}
                      </CardTitle>
                      <CardDescription style={{ color: 'var(--tm-muted)' }}>
                        {product.desc}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 flex flex-col flex-1">
                      {/* Specs */}
                      <ul
                        className="space-y-1.5 mb-4 transition-all duration-300 overflow-hidden"
                        style={{ maxHeight: isHovered ? '200px' : '60px' }}
                      >
                        {product.specs
                          .slice(0, isHovered ? 4 : 2)
                          .map((spec, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs"
                              style={{ color: 'var(--tm-text)' }}
                            >
                              <span
                                className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: 'var(--tm-accent)' }}
                              />
                              {spec}
                            </li>
                          ))}
                      </ul>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-md"
                            style={{
                              backgroundColor: 'var(--tm-surface-muted)',
                              color: 'var(--tm-muted)',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div
                        className="flex items-center gap-1 text-sm font-medium transition-all duration-200"
                        style={{ color: 'var(--tm-primary)' }}
                      >
                        Lihat Detail
                        <ArrowRight
                          size={14}
                          className="transition-transform duration-200"
                          style={{ transform: isHovered ? 'translateX(4px)' : 'translateX(0)' }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            )
          })}
        </Stagger>
      ) : (
        <Reveal>
          <div className="text-center py-20">
            <Search size={48} className="mx-auto mb-4" style={{ color: 'var(--tm-muted)' }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--tm-text-strong)' }}>
              Tidak ada hasil
            </h3>
            <p className="mb-6" style={{ color: 'var(--tm-muted)' }}>
              Tidak ditemukan produk untuk &ldquo;{search}&rdquo;
            </p>
            <Button
              onClick={() => {
                setSearch('')
                handleCategoryChange('Semua')
              }}
              style={{ backgroundColor: 'var(--tm-primary)', color: '#ffffff' }}
            >
              Reset Pencarian
            </Button>
          </div>
        </Reveal>
      )}
    </Section>
  )
}
