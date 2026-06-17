import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { RouteProgressBar } from './components/RouteProgressBar'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import CommandPalette from './components/CommandPalette'
import { ToastProvider } from './components/Toast'
import { ErrorBoundary } from './components/ErrorBoundary'
import {
  PageSkeleton,
  HeroSkeleton,
  CatalogSkeleton,
  ProductDetailSkeleton,
  ContactSkeleton,
} from './components/ui/Skeleton'
import { SmoothScrollProvider } from './components/SmoothScrollProvider'
import { CustomCursor } from './components/Motion'

// Route-level code splitting - each page is a separate chunk
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Projects = lazy(() => import('./pages/Projects'))
const Contact = lazy(() => import('./pages/Contact'))
const Catalog = lazy(() => import('./pages/Catalog'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))

/** Pick a route-aware skeleton so loading state matches incoming layout. */
function RouteSkeleton() {
  const location = useLocation()
  const path = location.pathname

  if (path === '/') return <HeroSkeleton />
  if (path === '/contact') return <ContactSkeleton />
  if (path === '/catalog') return <CatalogSkeleton />
  if (path.startsWith('/catalog/')) return <ProductDetailSkeleton />
  return <PageSkeleton />
}

// Premium page transition: scale+blur (elegant for medical brand)
// Exit: content scales down + blurs out
// Enter: fresh content scales up from 0.96 to 1.0
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.97,
    filter: 'blur(6px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(4px)',
    transition: {
      duration: 0.25,
      ease: [0.7, 0, 1, 1],
    },
  },
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ willChange: 'transform, opacity, filter' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:slug" element={<ProductDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  return (
    <SmoothScrollProvider>
      <ToastProvider>
        <div className="min-h-dvh bg-[var(--tm-page)] text-[var(--tm-text)] transition-colors duration-300">
          {/* Skip to content - a11y */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:rounded focus:bg-[var(--tm-primary)] focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>

          {/* Global QoL overlays */}
          <ScrollProgress />
          <RouteProgressBar />

          {/* Custom cursor - spring physics dot (desktop only) */}
          <CustomCursor />

          <Navbar />
          <main id="main">
            <ErrorBoundary>
              <Suspense fallback={<RouteSkeleton />}>
                <AnimatedRoutes />
              </Suspense>
            </ErrorBoundary>
          </main>
          <Footer />

          {/* Floating elements - always on top */}
          <BackToTop />
          <CommandPalette />
        </div>
      </ToastProvider>
    </SmoothScrollProvider>
  )
}

export default App
