// Vasanthi Salon — Content & Copy
// Based on: @vasanthi.gulasekharam_salon on Instagram

export const content = {
  salonName: 'Vasanthi Salon',
  tagline:   'Beauty & Elegance, Redefined',

  hero: {
    label:        'Award-Winning Salon',
    heading:      ['Your Beauty,', 'Our Passion'],
    subtext:      'Premium hair, bridal & beauty services by Vasanthi Gulasekharam — trusted by brides and beauty lovers across Sri Lanka.',
    ctaPrimary:   'Book Appointment',
    ctaSecondary: 'View Services',
  },

  services: {
    heading: 'Our Services',
    label:   'What We Offer',
    subtext: 'A curated selection of premium beauty treatments',
    items: [
      { number: '01', title: 'Hair Styling',     description: 'Cuts, blowouts, smoothening, keratin and premium hair colour treatments.' },
      { number: '02', title: 'Bridal Packages',  description: 'Complete bridal makeup and hair packages tailored for your special day.' },
      { number: '03', title: 'Makeup',           description: 'Party, occasion and editorial makeup by our certified artists.' },
      { number: '04', title: 'Skin Treatments',  description: 'Facials, clean-up, bleaching and advanced skincare consultations.' },
      { number: '05', title: 'Nail Care',        description: 'Manicures, pedicures, gel nails and nail art by expert technicians.' },
      { number: '06', title: 'Spa & Wellness',   description: 'Relaxing body treatments, massages and head spa services.' },
    ],
  },

  gallery: {
    label:   'Portfolio',
    heading: 'Gallery',
    images: [
      { id: 1, alt: 'Bridal Makeup',   src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',  wide: true  },
      { id: 2, alt: 'Hair Styling',    src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1969&auto=format&fit=crop',  wide: false },
      { id: 3, alt: 'Nail Art',        src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1974&auto=format&fit=crop',  wide: false },
      { id: 4, alt: 'Makeup Session',  src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1971&auto=format&fit=crop',  wide: false },
      { id: 5, alt: 'Spa Treatment',   src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',  wide: false },
      { id: 6, alt: 'Hair Colour',     src: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=2026&auto=format&fit=crop',  wide: true  },
      { id: 7, alt: 'Salon Interior',  src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop',  wide: true  },
      { id: 8, alt: 'Skin Care',       src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop',  wide: true  },
    ],
  },

  testimonials: {
    label:   'Client Stories',
    heading: 'What Our Clients Say',
    items: [
      { quote: 'Vasanthi did my bridal makeup and I looked absolutely stunning. Every single guest complimented me. She is truly an artist!', name: 'Priya K.', service: 'Bridal Package' },
      { quote: 'Best salon experience I have ever had. The hair treatment left my hair incredibly smooth and shiny for weeks.', name: 'Nisha R.', service: 'Hair Treatment' },
      { quote: 'I have been a regular client for over three years. The quality and care here is unmatched anywhere else in the city.', name: 'Divya M.', service: 'Skin Treatments' },
      { quote: 'My nails have never looked this beautiful. The nail art was exactly what I wanted and the service was so professional.', name: 'Anitha S.', service: 'Nail Care' },
    ],
  },

  cta: {
    label:      'Ready?',
    heading:    'Book Your Appointment Today',
    subtext:    'Experience premium beauty services with Vasanthi Salon. Easy online booking, instant confirmation.',
    buttonText: 'Book Now',
    footnote:   'No registration required · Book in under 2 minutes',
  },

  contact: {
    label:   'Location',
    heading: 'Find Us',
    subtext: 'Visit our salon or get in touch',
    address: ['No. 123, Galle Road,', 'Colombo 03,', 'Sri Lanka'],
    phones:  ['+94 77 123 4567', '+94 11 234 5678'],
    emails:  ['hello@vasanthisalon.lk', 'bookings@vasanthisalon.lk'],
    hours:   ['Mon – Fri: 9:00 AM – 7:00 PM', 'Sat: 9:00 AM – 5:00 PM', 'Sun: By Appointment'],
    mapUrl:  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.9!2d79.856!3d6.914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTQnNTAuNiJOIDc5wrA1MSczMy42IkU!5e0!3m2!1sen!2slk!4v1',
  },

  footer: {
    tagline: 'Premium beauty services by Vasanthi Gulasekharam — trusted by brides and beauty lovers across Sri Lanka.',
    links: [
      { name: 'Home',         href: '#home'         },
      { name: 'Services',     href: '#services'     },
      { name: 'Gallery',      href: '#gallery'      },
      { name: 'Testimonials', href: '#testimonials' },
      { name: 'Contact',      href: '#contact'      },
    ],
    socials: [
      { name: 'Instagram', href: 'https://www.instagram.com/vasanthi.gulasekharam_salon/', letter: 'IG' },
      { name: 'Facebook',  href: '#', letter: 'FB' },
      { name: 'WhatsApp',  href: 'https://wa.me/94771234567',  letter: 'WA' },
    ],
  },
}
