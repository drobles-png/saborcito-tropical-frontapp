/**
 * Copy complementario de la experiencia pública (home, menú, producto) que no
 * estaba en site.ts. Mismo tono: jovial, cercano, concreto.
 */
export const home = {
  hero: {
    stickerTop: 'Salchipapas',
    stickerBottom: 'desde',
    stickerFallbackCents: 200, // si el menú no cargó todavía
    stickerSlug: 'salchipapas',
    scroll: 'Baja, que hay más',
  },
  categories: {
    lead: 'Desliza y elige. Cada antojo tiene su lugar.',
    see: 'Ver',
  },
  collection: {
    cta: 'Pedir una nueva',
    hint: 'Desliza',
  },
  combos: {
    cta: 'Ver todos los combos',
    save: 'Todo en uno',
  },
  yogurt: {
    breadTitle: 'Pan de yuca',
    breadText: 'Calientito, recién salido del horno. El compañero perfecto del yogurt.',
    flavorColors: {
      Frutilla: '#e94b4b',
      Mora: '#8e5bb0',
      Durazno: '#f5a25d',
      Mango: '#f2c230',
      Natural: '#f3f1e6',
    } as Record<string, string>,
  },
  story: {
    counterLabel: 'años',
    since: 'Dos décadas en Guayaquil',
  },
  visit: {
    hours: 'Horarios',
    branches: 'Sucursales',
    map: 'Cómo llegar',
    whatsapp: 'Escríbenos por WhatsApp',
    whatsappText: 'Respondemos rápido. También puedes pedir por ahí.',
    open: 'Abierto ahora',
    closed: 'Cerrado ahora',
  },
  states: {
    error: 'Se nos quemó el pan… no pudimos cargar el menú.',
    retry: 'Intentar de nuevo',
    noResults: 'Sin resultados para',
    clear: 'Limpiar búsqueda',
  },
  product: {
    includes: 'Incluye',
    note: 'Nota para la cocina (opcional)',
    notePlaceholder: 'Sin cebolla, salsas aparte…',
    required: 'Obligatorio',
    chooseFirst: 'Elige una opción para continuar',
    add: 'Agregar',
    added: 'Agregado al carrito',
    related: 'También te puede gustar',
    back: 'Volver al menú',
    notFound: 'Este antojo ya no está en el menú.',
  },
  notFound: {
    code: '404',
    title: 'Este plato se nos cayó',
    script: 'de la bandeja',
    text: 'La página que buscas no existe o se movió. Pero el menú sigue calientito.',
    cta: 'Ir al menú',
    home: 'Volver al inicio',
  },
  header: {
    open: 'Abierto',
    closed: 'Cerrado',
    cart: 'Abrir carrito',
    menu: 'Abrir menú',
    close: 'Cerrar menú',
    order: 'Pedir ahora',
  },
  footer: {
    hours: 'Horarios',
    branches: 'Sucursales',
    links: 'Explora',
    contact: 'Contacto',
  },
} as const
