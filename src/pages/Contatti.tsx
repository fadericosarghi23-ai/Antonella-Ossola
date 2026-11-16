import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { ContactCard } from '@/components/ui/contact-card'
import { PageHeader, Section } from '@/components/site/blocks'
import { RequestForm } from '@/components/site/RequestForm'
import { Ph } from '@/components/site/Ph'
import { contatti } from '@/lib/site'
import { useSeo } from '@/hooks/use-seo'
import meta from '@/lib/routes-meta.json'

export default function Contatti() {
  useSeo({ ...meta['/contatti'], path: '/contatti' })
  return (
    <>
      <PageHeader
        kicker="Contatti"
        title="Raccontami cosa cerchi."
        lead={<p>Bastano tre passi e due minuti. Se preferisci, scrivimi direttamente su WhatsApp o per email.</p>}
      />
      <Section className="pt-12 md:pt-16">
        <ContactCard
          title="Scrivimi"
          description={<Ph as="p">Rispondo di persona, di solito entro qualche giorno.</Ph>}
          contactInfo={[
            { icon: MessageCircle, label: 'WhatsApp', value: 'Scrivimi un messaggio', href: `https://wa.me/${contatti.whatsapp}` },
            { icon: Mail, label: 'Email', value: contatti.email, href: `mailto:${contatti.email}` },
            { icon: Phone, label: 'Telefono', value: contatti.telefono, href: `tel:${contatti.telefono.replace(/\s/g, '')}` },
            { icon: MapPin, label: 'Dove', value: contatti.zona },
          ]}
        >
          <RequestForm />
        </ContactCard>
      </Section>
    </>
  )
}
