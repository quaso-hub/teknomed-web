import { ArrowRight, CheckCircle2, Clock3, Copy, Loader2, Mail, MapPin, Phone, MessageCircle } from 'lucide-react'
import { useState, useCallback, useRef } from 'react'
import { Reveal } from '../components/Motion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import Section from '../components/Section'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/Card'
import { useToast } from '../components/toast-context'
import { SITE } from '../config/site'
import { submitInquiry } from '../lib/api'

const inputClass =
  'h-11 w-full rounded-md border border-[var(--tm-border)] bg-[var(--tm-surface)] px-3 text-sm text-[var(--tm-text-strong)] outline-none transition-colors focus:border-[var(--tm-primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--tm-primary)_20%,transparent)]'

const inputErrorClass =
  'h-11 w-full rounded-md border border-red-500 bg-[var(--tm-surface)] px-3 text-sm text-[var(--tm-text-strong)] outline-none transition-colors focus:ring-2 focus:ring-red-500/20'

type FormErrors = Partial<Record<'name' | 'email' | 'message', string>>

function validateContact(data: {
  name: string
  email: string
  message: string
}): FormErrors {
  const errors: FormErrors = {}
  if (!data.name.trim()) errors.name = 'Nama wajib diisi'
  if (!data.email.trim()) {
    errors.email = 'Email wajib diisi'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Format email tidak valid'
  }
  if (!data.message.trim()) {
    errors.message = 'Pesan wajib diisi'
  } else if (data.message.trim().length < 10) {
    errors.message = 'Minimal 10 karakter'
  }
  return errors
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const { addToast } = useToast()

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      addToast(`${label} berhasil disalin!`, 'success', 2500)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      addToast('Gagal menyalin. Salin manual ya.', 'error')
    }
  }, [text, label, addToast])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-all hover:opacity-70"
      style={{ color: 'var(--tm-muted)' }}
      aria-label={`Salin ${label}`}
      title={`Salin ${label}`}
    >
      {copied ? (
        <CheckCircle2 className="size-3.5 text-emerald-500" />
      ) : (
        <Copy className="size-3.5" />
      )}
      {copied ? 'Disalin' : 'Salin'}
    </button>
  )
}

export default function Contact() {
  useDocumentTitle('Kontak')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const { addToast } = useToast()
  const honeypotRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const data = new FormData(e.currentTarget)
    const name    = (data.get('name') as string) ?? ''
    const email   = (data.get('email') as string) ?? ''
    const company = (data.get('company') as string) ?? ''
    const phone   = (data.get('phone') as string) ?? ''
    const message = (data.get('message') as string) ?? ''
    const hp      = (data.get('website') as string) ?? ''

    // ── Honeypot ──────────────────────────────
    if (hp.trim()) return // bot filled hidden field, silently accept

    const validationErrors = validateContact({ name, email, message })
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      addToast('Periksa kembali isian form', 'warning')
      const firstKey = Object.keys(validationErrors)[0]
      const firstField = e.currentTarget.querySelector<HTMLElement>(`[name="${firstKey}"]`)
      firstField?.focus()
      return
    }

    setErrors({})
    setSending(true)

    try {
      await submitInquiry({
        company_name: company || name,
        contact_person: name,
        email,
        phone: phone || undefined,
        message,
      })
      setSent(true)
      setSending(false)
      addToast('Pesan terkirim! Kami akan menghubungi Anda segera.', 'success')
    } catch (err) {
      setSending(false)
      const msg = err instanceof Error ? err.message : 'Gagal mengirim. Silakan coba lagi.'
      setError(msg)
      addToast(msg, 'error')
    }
  }

  function handleFieldChange(field: keyof FormErrors) {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div>
      <Section
        eyebrow="Kontak"
        title="Hubungi PT Teknomed Indo Timur"
        description="Punya kebutuhan konstruksi fasilitas kesehatan, HVAC, MOT, atau pengadaan? Tim kami siap membantu."
      >
        {/* Contact cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Email */}
          <Reveal delay={0}>
            <Card className="h-full card-shine float-shadow">
              <CardHeader>
                <div
                  className="grid size-11 place-items-center rounded-lg"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--tm-primary) 12%, transparent)', color: 'var(--tm-primary)' }}
                >
                  <Mail className="size-5" />
                </div>
                <CardTitle className="text-lg">Email</CardTitle>
                <CardDescription>Kontak resmi untuk kebutuhan proyek dan penawaran.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={`mailto:${SITE.contact.email}`}
                    className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all hover:opacity-90 hover:shadow-md"
                    style={{ backgroundColor: 'var(--tm-primary)', color: '#ffffff' }}
                  >
                    {SITE.contact.email} <ArrowRight className="size-3.5" />
                  </a>
                  <CopyButton text={SITE.contact.email} label="Email" />
                </div>
              </CardContent>
            </Card>
          </Reveal>

          {/* Phone */}
          <Reveal delay={0.08}>
            <Card className="h-full card-shine float-shadow">
              <CardHeader>
                <div
                  className="grid size-11 place-items-center rounded-lg"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--tm-primary) 12%, transparent)', color: 'var(--tm-primary)' }}
                >
                  <Phone className="size-5" />
                </div>
                <CardTitle className="text-lg">Telepon</CardTitle>
                <CardDescription>Hubungi langsung untuk diskusi cepat.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={SITE.contact.phoneHref}
                      className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all hover:opacity-90 hover:shadow-md"
                      style={{ backgroundColor: 'var(--tm-primary)', color: '#ffffff' }}
                    >
                      {SITE.contact.phone} <ArrowRight className="size-3.5" />
                    </a>
                    <CopyButton text={SITE.contact.phone} label="Nomor telepon" />
                  </div>
                  <a
                    href={SITE.contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium border border-[var(--tm-border)] transition-all hover:bg-[var(--tm-surface-muted)]"
                    style={{ color: 'var(--tm-text)' }}
                  >
                    <MessageCircle className="size-4 text-emerald-500" />
                    Chat via WhatsApp
                  </a>
                </div>
              </CardContent>
            </Card>
          </Reveal>

          {/* Hours */}
          <Reveal delay={0.16}>
            <Card className="h-full card-shine float-shadow">
              <CardHeader>
                <div
                  className="grid size-11 place-items-center rounded-lg"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--tm-primary) 12%, transparent)', color: 'var(--tm-primary)' }}
                >
                  <Clock3 className="size-5" />
                </div>
                <CardTitle className="text-lg">Jam Operasional</CardTitle>
                <CardDescription>{SITE.hours.weekdays}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--tm-muted)]">{SITE.hours.weekend}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400 soft-pulse" />
                  <span className="text-xs text-[var(--tm-muted)]">Kami aktif di jam kerja</span>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>

        {/* Address card */}
        <Reveal>
          <div
            className="mt-6 flex items-start gap-4 rounded-xl border p-5"
            style={{ backgroundColor: 'var(--tm-surface-muted)', borderColor: 'var(--tm-border)' }}
          >
            <div
              className="grid size-10 shrink-0 place-items-center rounded-lg"
              style={{ backgroundColor: 'color-mix(in srgb, var(--tm-primary) 12%, transparent)', color: 'var(--tm-primary)' }}
            >
              <MapPin className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--tm-text-strong)]">{SITE.name}</p>
              <p className="mt-0.5 text-sm text-[var(--tm-muted)]">{SITE.address.full}</p>
            </div>
            <CopyButton text={SITE.address.full} label="Alamat" />
          </div>
        </Reveal>
      </Section>

      {/* Map */}
      <Section
        eyebrow="Lokasi"
        title="Temukan kami di Manado"
        description={SITE.address.full}
      >
        <Reveal>
          <div data-lenis-prevent className="overflow-hidden rounded-xl border border-[var(--tm-border)] shadow-md">
            <iframe
              title="Lokasi PT Teknomed Indo Timur"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15957.6!2d124.8897!3d1.5167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32870c3b3b3b3b3b%3A0x0!2sMapanget%2C+Manado%2C+Sulawesi+Utara!5e0!3m2!1sid!2sid!4v1716000000000!5m2!1sid!2sid"
              width="100%"
              height="400"
              className="map-iframe"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-[var(--tm-border)] bg-[var(--tm-surface-muted)] p-4">
            <MapPin className="mt-0.5 size-4 shrink-0" style={{ color: 'var(--tm-primary)' }} />
            <div>
              <p className="text-sm font-medium text-[var(--tm-text-strong)]">{SITE.name}</p>
              <p className="mt-0.5 text-sm text-[var(--tm-muted)]">{SITE.address.full}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(SITE.address.full)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-80"
                style={{ color: 'var(--tm-primary)' }}
              >
                Buka di Google Maps <ArrowRight className="size-3" />
              </a>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Form */}
      <Section
        eyebrow="Kirim pesan"
        title="Ceritakan kebutuhan proyek Anda"
        description="Isi form di bawah dan kami akan menghubungi Anda secepatnya."
      >
        <Reveal>
          <Card>
            <CardContent className="p-6 sm:p-8">
              {sent ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <CheckCircle2 className="size-12" style={{ color: 'var(--tm-primary)' }} />
                  <div>
                    <p className="font-semibold text-[var(--tm-text-strong)]">Pesan terkirim!</p>
                    <p className="mt-1 text-sm text-[var(--tm-muted)]">
                      Tim kami akan segera menghubungi Anda.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
                    style={{ color: 'var(--tm-primary)' }}
                    onClick={() => setSent(false)}
                  >
                    Kirim pesan lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {/* Honeypot — hidden from humans, bots fill it */}
                  <input
                    type="text"
                    name="website"
                    ref={honeypotRef}
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
                    aria-hidden="true"
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-[var(--tm-text-strong)]">
                        Nama <span className="text-red-500">*</span>
                      </span>
                      <input
                        className={errors.name ? inputErrorClass : inputClass}
                        placeholder="Nama Anda"
                        name="name"
                        autoComplete="name"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        onChange={() => handleFieldChange('name')}
                      />
                      {errors.name && (
                        <span id="name-error" role="alert" className="text-xs text-red-500">
                          {errors.name}
                        </span>
                      )}
                    </label>
                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-[var(--tm-text-strong)]">
                        Email <span className="text-red-500">*</span>
                      </span>
                      <input
                        className={errors.email ? inputErrorClass : inputClass}
                        placeholder="email@domain.com"
                        name="email"
                        type="email"
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        onChange={() => handleFieldChange('email')}
                      />
                      {errors.email && (
                        <span id="email-error" role="alert" className="text-xs text-red-500">
                          {errors.email}
                        </span>
                      )}
                    </label>
                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-[var(--tm-text-strong)]">Perusahaan / Instansi</span>
                      <input className={inputClass} placeholder="Nama rumah sakit / instansi" name="company" autoComplete="organization" />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-[var(--tm-text-strong)]">Telepon</span>
                      <input className={inputClass} placeholder="+62 ..." name="phone" type="tel" autoComplete="tel" />
                    </label>
                    <label className="grid gap-2 sm:col-span-2">
                      <span className="text-sm font-semibold text-[var(--tm-text-strong)]">
                        Kebutuhan proyek <span className="text-red-500">*</span>
                      </span>
                      <textarea
                        className={
                          errors.message
                            ? 'min-h-36 w-full resize-none rounded-md border border-red-500 bg-[var(--tm-surface)] px-3 py-2.5 text-sm text-[var(--tm-text-strong)] outline-none focus:ring-2 focus:ring-red-500/20'
                            : 'min-h-36 w-full resize-none rounded-md border border-[var(--tm-border)] bg-[var(--tm-surface)] px-3 py-2.5 text-sm text-[var(--tm-text-strong)] outline-none transition-colors focus:border-[var(--tm-primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--tm-primary)_20%,transparent)]'
                        }
                        placeholder="Jenis layanan, lokasi proyek, target waktu, dll."
                        name="message"
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                        onChange={() => handleFieldChange('message')}
                      />
                      {errors.message && (
                        <span id="message-error" role="alert" className="text-xs text-red-500">
                          {errors.message}
                        </span>
                      )}
                    </label>
                  </div>

                  {error && (
                    <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                      {error}
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="submit"
                      disabled={sending}
                      className="inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-semibold transition-all hover:opacity-90 hover:shadow-md disabled:opacity-60"
                      style={{ backgroundColor: 'var(--tm-primary)', color: '#ffffff' }}
                    >
                      {sending ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          Kirim Pesan
                          <ArrowRight className="ml-2 size-4" />
                        </>
                      )}
                    </button>
                    <span className="text-xs text-[var(--tm-muted)]">
                      Atau email ke{' '}
                      <a
                        className="font-medium underline underline-offset-2 transition-opacity hover:opacity-80"
                        style={{ color: 'var(--tm-primary)' }}
                        href={`mailto:${SITE.contact.email}`}
                      >
                        {SITE.contact.email}
                      </a>
                    </span>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </Reveal>
      </Section>
    </div>
  )
}
