/**
 * El copy es configuración: todos los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan.
 *
 * Tono (Manual 2.4): jovial, positivo y divertido. 50% comercial y concreto, 50% sencillo.
 * Se vende la experiencia, no el producto. Nada de lenguaje rebuscado ni promocional chillón.
 * La marca se escribe siempre "saborcito TROPICAL" (Manual 1.11).
 */
export const site = {
  name: 'saborcito TROPICAL',
  shortName: 'saborcito TROPICAL',
  tagline: 'El sabor que nos acerca.',
  description:
    'Comida rápida guayaquileña desde hace 20 años. Salchipapas, burgers, alitas, papipollo y yogurt tropical, a domicilio o para retirar.',
  url: 'https://saborcitotropical.com',
  email: 'hola@saborcitotropical.com',
  city: 'Guayaquil',
  // Fallbacks si el API aún no responde: el valor real viene de /settings (panel admin).
  whatsapp: '',
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },
  nav: [
    { label: 'Menú', to: '/menu' },
    { label: 'Combos', to: '/menu?c=combos-de-hamburguesa' },
    { label: 'Sigue tu pedido', to: '/pedido' },
  ],

  hero: {
    eyebrow: '20 años en Guayaquil',
    titleTop: 'Saborcito',
    titleScript: 'que se',
    titleBottom: 'antoja',
    lead: 'Salchipapas, burgers, alitas y yogurt tropical. Pide en dos toques y te lo llevamos calientito.',
    ctaPrimary: 'Pedir ahora',
    ctaSecondary: 'Sigue tu pedido',
    stats: [
      { value: '20', label: 'años sirviendo' },
      { value: '43', label: 'antojos en el menú' },
      { value: '30′', label: 'promedio a tu puerta' },
    ],
  },

  marquee: ['Salchipapas', 'Burgers', 'Alitas', 'Papipollo', 'Tacos', 'Bandejas', 'Yogurt tropical', 'Pan de yuca'],

  sections: {
    categories: {
      eyebrow: 'Elige tu antojo',
      title: '¿Qué se te antoja hoy?',
    },
    featured: {
      eyebrow: 'Los más pedidos',
      title: 'Los favoritos de la casa',
      lead: 'Los que más salen de la cocina. Si no sabes qué pedir, empieza por aquí.',
      cta: 'Ver todo el menú',
    },
    collection: {
      eyebrow: 'Nueva',
      script: 'Colección',
      lead: 'Tres burgers nuevas para salir de la rutina.',
    },
    combos: {
      eyebrow: 'Combos',
      title: 'Más sabor, mejor precio',
      lead: 'Tu plato favorito con yogurt tropical, papas o pan de yuca. Todo en uno.',
    },
    yogurt: {
      eyebrow: 'Clásico de la casa',
      title: 'Yogurt tropical',
      script: 'con pan de yuca',
      lead: 'Cremoso, bien frío y en cinco sabores. El acompañante de siempre, desde hace 20 años.',
      flavors: ['Frutilla', 'Mora', 'Durazno', 'Mango', 'Natural'],
      cta: 'Pedir yogurt',
    },
    how: {
      eyebrow: 'Así de fácil',
      title: 'Tu pedido en 3 pasos',
      steps: [
        { icon: 'fa-solid fa-hand-pointer', title: 'Elige', text: 'Arma tu pedido desde el menú. Sin registrarte.' },
        { icon: 'fa-solid fa-motorcycle', title: 'Delivery o retiro', text: 'Te lo llevamos o lo pasas a retirar listo.' },
        { icon: 'fa-solid fa-face-grin-stars', title: 'Disfruta', text: 'Sigue tu pedido en vivo hasta que llegue.' },
      ],
    },
    story: {
      eyebrow: 'Nuestra historia',
      title: '20 años creciendo juntos',
      text: 'Nos vieron nacer y siguieron nuestros primeros pasos. Con ellos hemos compartido cada etapa hasta lo que somos hoy. Somos el lugar que nos conecta con el niño de ayer y los acolitadores número uno para salir de la rutina.',
    },
    visit: {
      eyebrow: 'Visítanos',
      title: 'Te esperamos',
    },
  },

  shop: {
    title: 'Nuestro menú',
    searchPlaceholder: 'Busca una salchipapa, una burger…',
    empty: 'No encontramos nada con esa búsqueda. Prueba con otra palabra.',
    soldOut: 'Agotado por hoy',
    add: 'Agregar',
  },

  cart: {
    title: 'Tu pedido',
    empty: 'Tu carrito está vacío. Un saborcito te está esperando.',
    emptyCta: 'Ir al menú',
    checkout: 'Ir a pagar',
    keepShopping: 'Seguir pidiendo',
    deliveryHint: 'El delivery se calcula en el siguiente paso.',
  },

  checkout: {
    title: 'Finaliza tu pedido',
    submit: 'Confirmar pedido',
    pay: 'Pagar',
  },

  tracking: {
    title: 'Sigue tu pedido',
    lead: 'Escribe tu código de pedido. Lo recibiste al confirmar (empieza con ST-).',
    steps: {
      received: { label: 'Recibido', text: 'Tu pedido llegó a nuestra cocina.' },
      preparing: { label: 'En cocina', text: 'Lo estamos preparando ahora mismo.' },
      ready: { label: 'Listo', text: 'Tu pedido está listo.' },
      on_the_way: { label: 'En camino', text: 'Va hacia tu dirección.' },
      delivered: { label: 'Entregado', text: '¡Buen provecho! Gracias por elegirnos.' },
      cancelled: { label: 'Cancelado', text: 'Este pedido fue cancelado. Escríbenos si es un error.' },
    },
  },

  payment: {
    cash: { label: 'Efectivo', text: 'Pagas al recibir o al retirar.', icon: 'fa-solid fa-money-bill-wave' },
    transfer: { label: 'Transferencia', text: 'Te mostramos los datos al confirmar.', icon: 'fa-solid fa-building-columns' },
    card: { label: 'Tarjeta', text: 'Pago seguro con Payphone.', icon: 'fa-solid fa-credit-card' },
  },

  footer: {
    legal: 'Todos los derechos reservados.',
    madeBy: 'Hecho por Bakano',
  },
} as const

export function whatsappLink(number: string, message = 'Hola saborcito TROPICAL, quiero hacer un pedido'): string {
  const digits = (number || site.whatsapp).replace(/\D/g, '')
  if (!digits) return '#'
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
