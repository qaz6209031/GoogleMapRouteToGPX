// Machine-assisted translation — needs native-speaker review.
import type { Dictionary } from "../dictionary";

export const es: Dictionary = {
  nav: {
    howItWorks: "Cómo funciona",
    feedback: "Comentarios",
    faq: "FAQ",
  },
  hero: {
    badge: "Con la confianza de 2K+ usuarios en 50+ países",
    titleLine1: "Ruta de Google Maps",
    titleLine2: "a archivo GPX",
    subtitle:
      "Convierte cualquier URL de rutas de Google Maps en un archivo GPX para tu dispositivo GPS — en coche, bicicleta o a pie.",
    subtitleBold: "Sin registro. Sin correo. Solo pega y listo.",
  },
  announcement: {
    badge: "Corregido",
    text:
      "Las rutas que modificas arrastrando en Google Maps ahora se conservan en el GPX, junto con las opciones “evitar autopistas / peajes / ferris”. ¡Gracias por tus comentarios!",
  },
  trustBadges: {
    gpxStandard: "Estándar GPX 1.1",
    exactRoute: "Ruta exacta de Google Maps",
    allModes: "Todos los modos de viaje",
    noSignup: "No necesitas registrarte",
  },
  features: {
    heading: "¿Por qué MapsToGPX?",
    subheading:
      "Todo lo que necesitas para convertir tus rutas de Google Maps en un archivo GPX.",
    items: [
      {
        title: "Sin necesidad de cuenta",
        description:
          "A diferencia de otras herramientas, no te pedimos tu correo ni te obligamos a crear una cuenta. Solo pega una URL y descarga tu GPX al instante.",
      },
      {
        title: "Rutas exactas de Google Maps",
        description:
          "Las rutas coinciden exactamente con lo que muestra Google Maps — en coche, bicicleta o a pie. Las mismas calles, caminos y giros.",
      },
      {
        title: "Todos los modos de viaje",
        description:
          "Funciona con rutas en coche, bicicleta, a pie y en transporte público. El modo de viaje se detecta automáticamente desde tu URL.",
      },
      {
        title: "Compatibilidad universal",
        description:
          "El formato estándar GPX 1.1 funciona con Garmin, Bryton, Wahoo y cualquier dispositivo que lea GPX.",
      },
      {
        title: "La confianza de miles de usuarios",
        description:
          "Usado por 2,000+ usuarios en todo el mundo. Sin registro, sin costos ocultos — solo archivos GPX.",
      },
      {
        title: "Todos los formatos de URL",
        description:
          "Admite URLs largas, enlaces cortos (goo.gl), direcciones, coordenadas y rutas con varias paradas.",
      },
    ],
  },
  howItWorks: {
    heading: "Cómo funciona",
    subheading: "Tres pasos sencillos de Google Maps a GPX.",
    steps: [
      {
        step: "1",
        title: "Planifica tu ruta",
        description:
          "Abre Google Maps, crea una ruta de direcciones y copia la URL desde la barra de direcciones de tu navegador.",
      },
      {
        step: "2",
        title: "Convierte a GPX",
        description:
          "Pega la URL arriba y haz clic en Convertir. Generaremos un archivo GPX con la misma ruta exacta de Google Maps.",
      },
      {
        step: "3",
        title: "¡A rodar!",
        description:
          "Descarga el archivo GPX e impórtalo en Garmin Connect, Bryton Active, la app de Wahoo o cualquier dispositivo compatible.",
      },
    ],
  },
  feedbackSection: {
    heading: "Comparte tus comentarios",
    subheading: "¿Encontraste un error o tienes una idea? Cuéntanos.",
  },
  donate: {
    heading: "¿Te gusta MapsToGPX? ¡Invítame un café!",
    description:
      "MapsToGPX es gratis. Las donaciones ayudan a cubrir los costos de la API de Google Maps.",
  },
  donateLinks: { venmo: "Venmo", paypal: "PayPal" },
  footer: {
    builtBy: "Creado por",
    faqLink: "FAQ",
    privacyLink: "Política de privacidad",
    tagline: "Gratis para siempre. Con la confianza de usuarios en todo el mundo.",
  },
  converterForm: {
    placeholder: "Pega aquí la URL de tu ruta de Google Maps...",
    convertButton: "Convertir a GPX",
    convertingButton: "Convirtiendo...",
    stepLabels: {
      idle: "",
      resolving: "Resolviendo enlace corto...",
      routing: "Convirtiendo la ruta — esto puede tardar unos segundos...",
      done: "¡Listo!",
      error: "Error",
    },
    invalidUrlError: "Introduce una URL de Google Maps válida",
    networkError: "Error de red. Inténtalo de nuevo.",
    nonJsonError: "Error al convertir. Inténtalo de nuevo.",
    conversionFailedFallback: "Error al convertir",
    successBanner: "¡Ruta convertida con éxito!",
    distanceLabel: "Distancia",
    waypointsLabel: "Puntos de ruta",
    downloadButton: "Descargar GPX",
    newButton: "Nueva",
  },
  feedbackForm: {
    ratingQuestion: "¿Cómo fue tu experiencia?",
    optionalHint: "(opcional)",
    ratingLabels: ["Mala", "Regular", "Buena", "Muy buena", "Excelente"],
    starAriaLabelOne: "{n} estrella",
    starAriaLabelMany: "{n} estrellas",
    messageLabel: "¿Qué podría mejorar?",
    messageHint: "(errores, rutas que no se convirtieron, ideas de funciones)",
    messagePlaceholder: "Cuéntanos qué piensas...",
    emailLabel: "Correo electrónico",
    emailHint: "(opcional, solo si quieres una respuesta)",
    emailPlaceholder: "you@example.com",
    sendButton: "Enviar comentarios",
    sendingButton: "Enviando...",
    sendMoreButton: "Enviar más comentarios",
    thanksHeading: "¡Gracias por tus comentarios!",
    thanksSubtext: "Leemos cada mensaje y nos ayuda a mejorar MapsToGPX.",
    errorFallback: "No se pudo enviar el comentario",
  },
  homeMeta: {
    title: "Conversor de Rutas de Google Maps a GPX",
    description:
      "Convierte URLs de rutas de Google Maps en archivos GPX. Compatible con rutas en coche, bicicleta y a pie. Gratis, sin necesidad de registro.",
  },
  faqMeta: {
    title: "Preguntas frecuentes",
    description:
      "Respuestas a preguntas frecuentes sobre cómo convertir rutas de Google Maps en archivos GPX: formatos de URL admitidos, modos de viaje, contenido del GPX, compatibilidad de dispositivos, límites y privacidad.",
  },
  faqPage: {
    heading: "Preguntas frecuentes",
    introPrefix: "¿No encuentras tu respuesta aquí? ",
    sendFeedbackLink: "Envíanos tus comentarios",
    introSuffix: ".",
    privacyNotePrefix: "Consulta la ",
    privacyLinkText: "política de privacidad",
    privacyNoteSuffix: " para más detalles sobre qué datos se procesan.",
    backButton: "← Volver al conversor",
    entries: [
      {
        question: "¿Qué formatos de URL de Google Maps admite MapsToGPX?",
        answer:
          "URLs largas de rutas copiadas desde la barra de direcciones, enlaces cortos (goo.gl y maps.app.goo.gl — se expanden automáticamente), URLs creadas a partir de direcciones o nombres de lugares, URLs con coordenadas de latitud/longitud sin procesar, y rutas con varias paradas y múltiples puntos de ruta.",
      },
      {
        question: "¿Cómo sabe qué modo de viaje (coche, bicicleta, a pie) usar?",
        answer:
          "Lee el modo de viaje que Google Maps ya codificó en tu URL — ya sea el parámetro travelmode o el modo incluido cuando elegiste coche, bicicleta, a pie o transporte público en Maps. Si no hay ninguno, usa coche de forma predeterminada.",
      },
      {
        question: "¿Qué contiene exactamente el archivo GPX descargado?",
        answer:
          "Una sola pista (track) GPX 1.1 formada por puntos de track que siguen la ruta exacta devuelta por Google Directions, decodificada a nivel de tramo para obtener el máximo detalle (no la línea general simplificada de Google). Es una pista, no una ruta ni una lista de puntos de ruta, y no incluye datos de elevación.",
      },
      {
        question: "¿Qué dispositivos y aplicaciones pueden usar el archivo GPX?",
        answer:
          "Cualquier aplicación o dispositivo GPS que importe pistas GPX 1.1 estándar — esto incluye dispositivos Garmin, Wahoo, Bryton, Hammerhead Karoo y COROS, entre otros. Solo importa o copia el archivo .gpx descargado igual que harías con cualquier otra pista GPX.",
      },
      {
        question: "¿MapsToGPX es gratis? ¿Necesito crear una cuenta?",
        answer:
          "Sí, es completamente gratis, sin necesidad de cuenta, registro ni inicio de sesión. Pega una URL y descarga tu archivo GPX.",
      },
      {
        question: "¿Admite rutas con varias paradas y rutas que he modificado arrastrando?",
        answer:
          "Sí. Las paradas intermedias de tu URL se recorren en orden — la pista pasa por ellas en lugar de añadirse como marcadores de parada independientes — y los puntos que arrastraste sobre la ruta en Google Maps se conservan como puntos \"via\" que dan forma al trazado sin añadirse como paradas independientes. Las opciones \"evitar autopistas/peajes/ferris\" que configuraste en Maps también se mantienen.",
      },
      {
        question: "¿Por qué la ruta convertida puede diferir un poco de lo que mostraba Google Maps?",
        answer:
          "La ruta se vuelve a calcular con la API de Google Directions — el mismo motor de rutas que usa Google Maps — a partir de tus puntos de ruta, por lo que Google puede devolver un trazado ligeramente distinto si los datos de las calles o el enrutamiento cambiaron desde que copiaste el enlace, o si la URL codificaba una ruta alternativa que no se puede solicitar junto con paradas intermedias. Si tu URL apuntaba a una ruta alternativa específica y tu viaje tiene paradas intermedias, la API de Google Directions no puede devolver alternativas en ese caso, por lo que se usa la ruta principal y se muestra una advertencia.",
      },
      {
        question: "¿Hay límites en el tamaño de la ruta o en la frecuencia de conversión?",
        answer:
          "La API de Google Directions permite un máximo de 25 paradas intermedias; las rutas con más paradas que eso no se pueden convertir. Si tienes menos paradas pero muchos puntos \"via\" arrastrados, estos se reducen de forma uniforme para ajustarse al límite, mientras que cada parada real se conserva. Las conversiones y las búsquedas de enlaces cortos también están limitadas a 10 solicitudes por minuto por dirección IP para mantener el servicio disponible para todos.",
      },
      {
        question: "Mi conversión falló, ¿qué salió mal?",
        answer:
          "Las causas más comunes son: el enlace pegado no es una URL de rutas de Google Maps, no se pudo geocodificar una dirección de la ruta, la API de Google Directions no encontró una ruta entre los puntos indicados, alcanzaste el límite de solicitudes por minuto, o hubo un problema de red temporal. Intenta copiar el enlace de nuevo desde Google Maps, simplificar la ruta o esperar un minuto antes de volver a intentarlo.",
      },
      {
        question: "¿Cómo reporto un error o sugiero una función?",
        answer:
          "Usa el formulario de comentarios en la página principal — puedes dejar una calificación con estrellas, un mensaje, o ambos, y opcionalmente un correo electrónico si quieres recibir una respuesta.",
      },
      {
        question: "¿MapsToGPX guarda mis rutas o datos personales?",
        answer:
          "No — las rutas, URLs y direcciones no se guardan en una base de datos; solo se usan cachés de corta duración para evitar búsquedas repetidas. Consulta la política de privacidad para conocer todos los detalles sobre qué se recopila y qué no.",
      },
    ],
  },
  languageSwitcherLabel: "Idioma",
};
