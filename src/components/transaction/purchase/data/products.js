// src/components/purchase/data/products.js
export const PRODUCTS = [
  // Entretenimiento
  {
    id: "ent-001",
    title: "Suscripción Netflix 1 mes",
    category: "Entretenimiento",
    price: 89.99,
    promo: "10% de descuento pagando con tu cuenta Banca Kinal",
    description:
      "Acceso ilimitado a series y películas durante 30 días. Código digital entregado al instante.",
    terms:
      "Promoción válida hasta agotar existencias. Código para cuentas nuevas o reactivación.",
    image:
      "https://images.unsplash.com/photo-1605902711622-cfb43c44367f?auto=format&fit=crop&w=800&q=70",
    provider: "Netflix Inc.",
  },
  {
    id: "ent-002",
    title: "Spotify Premium 3 meses",
    category: "Entretenimiento",
    price: 149.0,
    promo: "2x1 en planes individuales en julio",
    description:
      "Escucha música sin anuncios y descarga tus playlists favoritas.",
    terms: "Solo para cuentas nuevas. Código digital.",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=70",
    provider: "Spotify AB",
  },
  {
    id: "ent-003",
    title: "Xbox Game Pass Ultimate 1 mes",
    category: "Entretenimiento",
    price: 99.0,
    promo: "Incluye EA Play y xCloud",
    description:
      "Más de 100 juegos en consola, PC y la nube. Código digital.",
    terms: "No acumulable con otras promos.",
    image:
      "https://images.unsplash.com/photo-1580128665647-91ff5b91a5c0?auto=format&fit=crop&w=800&q=70",
    provider: "Microsoft",
  },
  {
    id: "ent-004",
    title: "Disney+ 1 año",
    category: "Entretenimiento",
    price: 749.0,
    promo: "Regalo de 1 mes adicional",
    description:
      "Series y películas de Disney, Pixar, Marvel y Star Wars. Suscripción anual.",
    terms: "Código válido 12 meses.",
    image:
      "https://images.unsplash.com/photo-1603308824943-93ec24c27835?auto=format&fit=crop&w=800&q=70",
    provider: "Disney",
  },
  {
    id: "ent-005",
    title: "HBO Max 6 meses",
    category: "Entretenimiento",
    price: 299.0,
    promo: "Precio especial mitad de año",
    description: "Las mejores series originales y películas recientes.",
    terms: "Código para cuentas nuevas o existentes (no prepago).",
    image:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=70",
    provider: "Warner Media",
  },

  // Comida / Restaurantes
  {
    id: "food-001",
    title: "Cupón Q100 en Pizza Hut",
    category: "Comida",
    price: 85.0,
    promo: "20% menos del valor nominal",
    description: "Cupón digital para consumo en línea o restaurante.",
    terms: "Válido solo en Guatemala. No acumulable con otras promos.",
    image:
      "https://images.unsplash.com/photo-1564936282906-1463abe140c5?auto=format&fit=crop&w=800&q=70",
    provider: "Pizza Hut Guatemala",
  },
  {
    id: "food-002",
    title: "Gift Card Q150 Starbucks",
    category: "Comida",
    price: 142.0,
    promo: "Incluye bebida de cortesía",
    description: "Tarjeta digital para bebidas y alimentos.",
    terms: "Vigencia 6 meses.",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=70",
    provider: "Starbucks Guatemala",
  },
  {
    id: "food-003",
    title: "Descuento 30% Uber Eats (3 pedidos)",
    category: "Comida",
    price: 59.0,
    promo: "Hasta Q50 por pedido",
    description:
      "Código de descuento para usar en la app. Aplican T&C del proveedor.",
    terms: "No aplica en alcohol. Monto mínimo Q75.",
    image:
      "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=800&q=70",
    provider: "Uber Eats",
  },
  {
    id: "food-004",
    title: "Combo BigMac x2",
    category: "Comida",
    price: 49.5,
    promo: "2x1 exclusivo pagando con Banca Kinal",
    description: "Cuponera digital para canjear en mostrador.",
    terms: "Vigencia 30 días.",
    image:
      "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=70",
    provider: "McDonald's Guatemala",
  },
  {
    id: "food-005",
    title: "Cupón Q200 en Pollo Campero",
    category: "Comida",
    price: 180.0,
    promo: "Bonificación de Q20 por compra",
    description: "Cupón digital consumible en sucursales participantes.",
    terms: "Válido solo en GT. No canjeable por efectivo.",
    image:
      "https://images.unsplash.com/photo-1606756790138-8fd88f03fefd?auto=format&fit=crop&w=800&q=70",
    provider: "Pollo Campero",
  },

  // Hogar
  {
    id: "home-001",
    title: "Tarjeta Regalo Amazon USD 25",
    category: "Hogar",
    price: 205.0,
    promo: "Sin comisión de emisión",
    description: "Código digital aplicable en amazon.com",
    terms: "No retornable. Se convierte a USD al pagar.",
    image:
      "https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=800&q=70",
    provider: "Amazon",
  },
  {
    id: "home-002",
    title: "IKEA Gift Card EUR 50",
    category: "Hogar",
    price: 430.0,
    promo: "Incluye envío del código al instante",
    description: "Compra mobiliario y decoración.",
    terms: "El tipo de cambio puede variar.",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=70",
    provider: "IKEA",
  },
  {
    id: "home-003",
    title: "Descuento 25% lámparas Philips Hue",
    category: "Hogar",
    price: 0.0,
    promo: "Cupón gratuito solo por ser cliente",
    description: "Iluminación inteligente para tu hogar.",
    terms: "Se requiere orden mínima de Q500.",
    image:
      "https://images.unsplash.com/photo-1600585154340-1ffe7d206b58?auto=format&fit=crop&w=800&q=70",
    provider: "Philips",
  },
  {
    id: "home-004",
    title: "Cupón Q300 en Cemaco",
    category: "Hogar",
    price: 270.0,
    promo: "10% de descuento + envío gratis",
    description: "Úsalo en tienda o en línea.",
    terms: "No se acumula a otras promos.",
    image:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=70",
    provider: "Cemaco",
  },
  {
    id: "home-005",
    title: "Kit Inicio Jardinería",
    category: "Hogar",
    price: 120.0,
    promo: "Incluye semillas de regalo",
    description: "Todo lo básico para tu huerto en casa.",
    terms: "Stock limitado.",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=70",
    provider: "GreenHome",
  },

  // Tecnología
  {
    id: "tech-001",
    title: "Tarjeta Steam USD 20",
    category: "Tecnología",
    price: 165.0,
    promo: "Bonus de USD 2 por tiempo limitado",
    description: "Código digital para tu billetera Steam.",
    terms: "Solo para cuentas en región compatible.",
    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=800&q=70",
    provider: "Valve",
  },
  {
    id: "tech-002",
    title: "Google Play Gift Card USD 15",
    category: "Tecnología",
    price: 125.0,
    promo: "Sin comisiones ocultas",
    description: "Apps, juegos y más en Google Play.",
    terms: "No reembolsable.",
    image:
      "https://images.unsplash.com/photo-1587614203976-365c74645e83?auto=format&fit=crop&w=800&q=70",
    provider: "Google",
  },
  {
    id: "tech-003",
    title: "Apple Gift Card USD 25",
    category: "Tecnología",
    price: 205.0,
    promo: "Incluye 3 meses de Apple TV+",
    description: "Compra en App Store, iTunes o Apple Store.",
    terms: "Código con restricción regional.",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=70",
    provider: "Apple",
  },
  {
    id: "tech-004",
    title: "PlayStation Plus Essential 12 meses",
    category: "Tecnología",
    price: 499.0,
    promo: "15% off por temporada",
    description: "Juegos mensuales y multijugador online.",
    terms: "No acumulable con otros planes.",
    image:
      "https://images.unsplash.com/photo-1614680376739-414d95ff43df?auto=format&fit=crop&w=800&q=70",
    provider: "Sony",
  },
  {
    id: "tech-005",
    title: "Audífonos Bluetooth JBL TUNE",
    category: "Tecnología",
    price: 329.0,
    promo: "Envío gratis y 5% cashback",
    description: "Sonido de alta calidad y batería de larga duración.",
    terms: "Garantía de 1 año.",
    image:
      "https://images.unsplash.com/photo-1583225152210-d45e337df968?auto=format&fit=crop&w=800&q=70",
    provider: "JBL",
  },

  // Viajes
  {
    id: "travel-001",
    title: "Cupón Q500 para Airbnb",
    category: "Viajes",
    price: 465.0,
    promo: "Válido en reservas mayores a Q2,000",
    description: "Hospédate donde quieras y ahorra.",
    terms: "No reembolsable, fechas restringidas.",
    image:
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=70",
    provider: "Airbnb",
  },
  {
    id: "travel-002",
    title: "Descuento 15% en Booking.com",
    category: "Viajes",
    price: 0,
    promo: "Cupón gratuito para clientes BK",
    description: "Reserva hoteles con descuento inmediato.",
    terms: "No acumulable, algunas cadenas excluidas.",
    image:
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=70",
    provider: "Booking.com",
  },
  {
    id: "travel-003",
    title: "Tarjeta regalo Uber USD 20",
    category: "Viajes",
    price: 165.0,
    promo: "Incluye 1 viaje gratis de hasta Q35",
    description: "Aplica en Uber y Uber Eats.",
    terms: "Ver condiciones en la app.",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=70",
    provider: "Uber",
  },
  {
    id: "travel-004",
    title: "Descuento 20% en Seguro de Viaje",
    category: "Viajes",
    price: 0,
    promo: "Código gratuito",
    description: "Cobertura internacional con Assist Card.",
    terms: "Compra mínima Q300.",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=70",
    provider: "Assist Card",
  },
  {
    id: "travel-005",
    title: "Gift Card JetBlue USD 50",
    category: "Viajes",
    price: 410.0,
    promo: "Sin fee de emisión",
    description: "Vuela a USA y el Caribe.",
    terms: "Valido 12 meses.",
    image:
      "https://images.unsplash.com/photo-1504198266285-165a9a210f98?auto=format&fit=crop&w=800&q=70",
    provider: "JetBlue",
  },

  // Salud & Belleza
  {
    id: "health-001",
    title: "Cuponera Q200 Farmacia Meykos",
    category: "Salud",
    price: 180.0,
    promo: "Incluye entrega a domicilio gratis",
    description: "Medicamentos y artículos de cuidado personal.",
    terms: "No aplica vacunas.",
    image:
      "https://images.unsplash.com/photo-1580281657521-389b3cfeaf2c?auto=format&fit=crop&w=800&q=70",
    provider: "Meykos",
  },
  {
    id: "health-002",
    title: "Sesión Spa 60 min",
    category: "Salud",
    price: 299.0,
    promo: "Incluye masaje relajante y aromaterapia",
    description: "Ubicaciones en zona 10 y 14.",
    terms: "Reserva previa requerida.",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=70",
    provider: "Relax Spa",
  },
  {
    id: "health-003",
    title: "Plan Gimnasio 1 mes",
    category: "Salud",
    price: 250.0,
    promo: "Acceso ilimitado 24/7",
    description: "Includes clases grupales.",
    terms: "Tarifa no reembolsable.",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9d8d8?auto=format&fit=crop&w=800&q=70",
    provider: "GymPower",
  },
  {
    id: "health-004",
    title: "Descuento 30% en lentes Ópticas Deluxe",
    category: "Salud",
    price: 0,
    promo: "Solo para monturas seleccionadas",
    description: "Incluye examen de la vista gratuito.",
    terms: "No combinable con otras promociones.",
    image:
      "https://images.unsplash.com/photo-1573495617419-87fef2ddb586?auto=format&fit=crop&w=800&q=70",
    provider: "Ópticas Deluxe",
  },
  {
    id: "health-005",
    title: "Kit de cuidado de la piel",
    category: "Salud",
    price: 189.0,
    promo: "15% de descuento + envío gratis",
    description: "Incluye limpiador, tónico y crema hidratante.",
    terms: "Stock limitado.",
    image:
      "https://images.unsplash.com/photo-1585238341267-1f23f68e7f21?auto=format&fit=crop&w=800&q=70",
    provider: "SkinCare Co.",
  },

  // Moda
  {
    id: "fashion-001",
    title: "Cuponera Q150 Zara",
    category: "Moda",
    price: 140.0,
    promo: "Cashback Q10 en tu próxima compra",
    description: "Usable en tiendas físicas.",
    terms: "No aplica en rebajas.",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=70",
    provider: "Zara",
  },
  {
    id: "fashion-002",
    title: "Gift Card H&M Q200",
    category: "Moda",
    price: 190.0,
    promo: "5% extra de saldo",
    description: "Código digital.",
    terms: "Vigencia 6 meses.",
    image:
      "https://images.unsplash.com/photo-1617317373242-b54149b77742?auto=format&fit=crop&w=800&q=70",
    provider: "H&M",
  },
  {
    id: "fashion-003",
    title: "Descuento 25% Nike Store",
    category: "Moda",
    price: 0,
    promo: "Cupón gratuito exclusivo BK",
    description: "Ropa y calzado deportivo.",
    terms: "Compra mínima Q300.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=70",
    provider: "Nike",
  },
  {
    id: "fashion-004",
    title: "Cuponera Q100 Adoc",
    category: "Moda",
    price: 85.0,
    promo: "Incluye envío gratis",
    description: "Calzado para toda la familia.",
    terms: "No acumulable.",
    image:
      "https://images.unsplash.com/photo-1600180758890-6b94519d9f3b?auto=format&fit=crop&w=800&q=70",
    provider: "Adoc",
  },
  {
    id: "fashion-005",
    title: "Gift Card Forever 21 Q250",
    category: "Moda",
    price: 230.0,
    promo: "Regalo sorpresa por cada compra",
    description: "Aplica en tienda y online.",
    terms: "No reembolsable.",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=70",
    provider: "Forever 21",
  },

  // Educación
  {
    id: "edu-001",
    title: "Curso Online Inglés 3 meses",
    category: "Educación",
    price: 399.0,
    promo: "Incluye tutoría personalizada",
    description: "Plataforma interactiva 24/7.",
    terms: "No reembolsable.",
    image:
      "https://images.unsplash.com/photo-1584697964198-39b8d92a3321?auto=format&fit=crop&w=800&q=70",
    provider: "ProEnglish",
  },
  {
    id: "edu-002",
    title: "Udemy Gift Card USD 30",
    category: "Educación",
    price: 245.0,
    promo: "Cursos desde $9.99",
    description: "Aprende cualquier habilidad al mejor precio.",
    terms: "No reembolsable.",
    image:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=70",
    provider: "Udemy",
  },
  {
    id: "edu-003",
    title: "Descuento 50% Platzi 1 mes",
    category: "Educación",
    price: 65.0,
    promo: "Acceso a todos los cursos",
    description: "Cupón digital canjeable una sola vez.",
    terms: "No combinable con otras promos.",
    image:
      "https://images.unsplash.com/photo-1518085250887-2f903c200fee?auto=format&fit=crop&w=800&q=70",
    provider: "Platzi",
  },
  {
    id: "edu-004",
    title: "E-book Pack (5 libros)",
    category: "Educación",
    price: 49.0,
    promo: "Incluye guía exclusiva de finanzas",
    description: "Libros en formato PDF/EPUB.",
    terms: "Descarga inmediata.",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=70",
    provider: "Edubooks",
  },
  {
    id: "edu-005",
    title: "Licencia Anual Duolingo Plus",
    category: "Educación",
    price: 899.0,
    promo: "Mes extra gratis",
    description: "Aprende idiomas sin anuncios.",
    terms: "Código para 12 meses.",
    image:
      "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=70",
    provider: "Duolingo",
  },
];
