import { cn } from '../../lib/utils'

type SkeletonProps = {
  className?: string
  width?: string
  height?: string
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

export function CardSkeleton() {
  return (
    <div
      className="rounded-lg p-6 space-y-3"
      style={{ border: '1px solid var(--tm-border)', background: 'var(--tm-surface)' }}
    >
      <div className="flex justify-between">
        <Skeleton className="h-6 w-10" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-14" />
      </div>
    </div>
  )
}

/** Generic page skeleton - dipakai sebagai default Suspense fallback */
export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto max-w-full" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

/** Hero skeleton - 2 column dengan text panel + visual card */
export function HeroSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-12 w-full max-w-md" />
          <Skeleton className="h-12 w-full max-w-sm" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <Skeleton className="h-4 w-3/4 max-w-md" />
          <div className="mt-8 flex gap-3">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
      </div>
    </div>
  )
}

/** Catalog skeleton - filter row + 6 product cards grid */
export function CatalogSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <div className="mb-6 flex gap-3">
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

/** Product detail skeleton - 2 column dengan info + visual placeholder */
export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <Skeleton className="mb-3 h-4 w-32" />
      <Skeleton className="mb-2 h-10 w-full max-w-md" />
      <Skeleton className="mb-8 h-5 w-full max-w-2xl" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <div className="flex gap-2 pt-3">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="space-y-3 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          <div className="flex gap-3 pt-6">
            <Skeleton className="h-11 w-40" />
            <Skeleton className="h-11 w-32" />
          </div>
        </div>
        <Skeleton className="aspect-video w-full rounded-lg" />
      </div>
    </div>
  )
}

/** Contact skeleton - 3 cards row + map block + form area */
export function ContactSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-96 max-w-full" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[var(--tm-border)] bg-[var(--tm-surface)] p-6 space-y-3">
            <Skeleton className="size-11 rounded-lg" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-9 w-40" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-8 h-[400px] w-full rounded-xl" />
    </div>
  )
}

export default Skeleton
