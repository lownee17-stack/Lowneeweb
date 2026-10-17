/* ==========================================================
   LOWNEE · CONFIGURACIÓN EDITABLE
   Cambia aquí tu número de WhatsApp, redes y mensajes.
   ========================================================== */
window.LOWNEE_CONFIG = {
  /* Número en formato internacional, SOLO dígitos, sin "+" ni espacios.
     57 = Colombia + 304 4873932. Todos los botones de WhatsApp usan este número. */
  whatsappNumber: "573044873932",

  /* Instagram (es la única red del pie de página). */
  instagramUrl: "https://www.instagram.com/lownee17?xtok=bTg5Y2sxb3JhdHl5",

  /* Mensajes prellenados de WhatsApp (se codifican automáticamente). */
  messages: {
    general:
      "¡Hola, Lownee! Quiero consultar por sus cuadros decorativos.",
    personalizar:
      "¡Hola, Lownee! Quiero personalizar mi cuadro. Mi idea es: ",
    diseno: (nombre, detalle) =>
      detalle
        ? `¡Hola, Lownee! Me interesa el diseño «${nombre}» en ${detalle}. ¿Me confirmas disponibilidad?`
        : `¡Hola, Lownee! Me interesa el diseño «${nombre}». ¿Me cuentas disponibilidad, material y medidas?`,
    producto: (material, medida, precio) =>
      `¡Hola, Lownee! Quiero consultar por un cuadro de ${material}, medida ${medida}, precio de referencia ${precio}. ¿Me ayudas?`
  }
};
