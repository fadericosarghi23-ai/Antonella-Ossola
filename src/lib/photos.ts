/*
  [SEGNAPOSTO] Tutte le foto sono provvisorie, da Unsplash (licenza Unsplash, uso libero).
  Vanno sostituite con foto reali dei percorsi di Antonella. Crediti in /crediti-foto.txt
*/
import heroChiome from '@/assets/photos/hero-chiome.webp'
import heroChiomeSm from '@/assets/photos/hero-chiome-sm.webp'
import heroNebbia from '@/assets/photos/hero-nebbia-calda.webp'
import heroNebbiaSm from '@/assets/photos/hero-nebbia-calda-sm.webp'
import gruppoBosco from '@/assets/photos/gruppo-bosco.webp'
import gruppoBoscoSm from '@/assets/photos/gruppo-bosco-sm.webp'
import bivio from '@/assets/photos/bivio.webp'
import bivioSm from '@/assets/photos/bivio-sm.webp'
import albaLago from '@/assets/photos/alba-lago.webp'
import albaLagoSm from '@/assets/photos/alba-lago-sm.webp'
import lagoColline from '@/assets/photos/lago-colline.webp'
import lagoCollineSm from '@/assets/photos/lago-colline-sm.webp'
import ruscello from '@/assets/photos/ruscello.webp'
import ruscelloSm from '@/assets/photos/ruscello-sm.webp'
import sentieroAutunno from '@/assets/photos/sentiero-autunno.webp'
import sentieroAutunnoSm from '@/assets/photos/sentiero-autunno-sm.webp'
import castagne from '@/assets/photos/castagne.webp'
import castagneSm from '@/assets/photos/castagne-sm.webp'
import muschio from '@/assets/photos/muschio.webp'
import muschioSm from '@/assets/photos/muschio-sm.webp'
import nebbiaAbeti from '@/assets/photos/nebbia-abeti.webp'
import nebbiaAbetiSm from '@/assets/photos/nebbia-abeti-sm.webp'
import lagoDallAlto from '@/assets/photos/lago-dall-alto.webp'
import lagoDallAltoSm from '@/assets/photos/lago-dall-alto-sm.webp'
import pontile from '@/assets/photos/pontile.webp'
import pontileSm from '@/assets/photos/pontile-sm.webp'
import luceBosco from '@/assets/photos/luce-bosco.webp'
import luceBoscoSm from '@/assets/photos/luce-bosco-sm.webp'
import sentieroVerde from '@/assets/photos/sentiero-verde.webp'
import sentieroVerdeSm from '@/assets/photos/sentiero-verde-sm.webp'

export type PhotoSrc = { src: string; sm: string; w: number; h: number; alt: string }

export const photos = {
  chiome: { src: heroChiome, sm: heroChiomeSm, w: 1870, h: 1052, alt: 'Chiome degli alberi viste dal basso, con il cielo al centro' },
  hero: { src: heroNebbia, sm: heroNebbiaSm, w: 2200, h: 1467, alt: 'Bosco di abeti nella nebbia del mattino' },
  gruppo: { src: gruppoBosco, sm: gruppoBoscoSm, w: 1600, h: 2400, alt: 'Un piccolo gruppo cammina su un sentiero nel bosco' },
  bivio: { src: bivio, sm: bivioSm, w: 1600, h: 1071, alt: 'Un sentiero nel bosco che si divide in due' },
  albaLago: { src: albaLago, sm: albaLagoSm, w: 1600, h: 1067, alt: 'Lago al sorgere del sole, con un pontile' },
  lagoColline: { src: lagoColline, sm: lagoCollineSm, w: 1600, h: 2133, alt: 'Lago tra colline boscose e montagne' },
  ruscello: { src: ruscello, sm: ruscelloSm, w: 1360, h: 907, alt: 'Torrente tra le rocce del bosco, con un ponticello' },
  sentieroAutunno: { src: sentieroAutunno, sm: sentieroAutunnoSm, w: 1156, h: 771, alt: 'Sentiero coperto di foglie in autunno' },
  castagne: { src: castagne, sm: castagneSm, w: 1600, h: 1197, alt: 'Ricci di castagno e foglie sul sentiero' },
  muschio: { src: muschio, sm: muschioSm, w: 1600, h: 2400, alt: 'Muschio sulle rocce del sottobosco' },
  nebbiaAbeti: { src: nebbiaAbeti, sm: nebbiaAbetiSm, w: 1600, h: 2400, alt: 'Abeti nella nebbia visti dall’alto' },
  lagoDallAlto: { src: lagoDallAlto, sm: lagoDallAltoSm, w: 1156, h: 1734, alt: 'Lago visto dall’alto tra gli alberi' },
  pontile: { src: pontile, sm: pontileSm, w: 1600, h: 1067, alt: 'Pontile di legno sul lago al tramonto' },
  luceBosco: { src: luceBosco, sm: luceBoscoSm, w: 1600, h: 1067, alt: 'Luce del mattino su un sentiero nel bosco' },
  sentieroVerde: { src: sentieroVerde, sm: sentieroVerdeSm, w: 1156, h: 771, alt: 'Sentiero tra l’erba e gli alberi in primavera' },
} satisfies Record<string, PhotoSrc>
