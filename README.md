# Lownee · Landing page

Página estática (HTML + CSS + JS, sin dependencias ni build).
Abre `index.html` en el navegador, o usa `lownee-unido.html` (todo en un solo archivo, con imágenes incrustadas).

## Configuración (`js/config.js`)
- `whatsappNumber`: ya configurado con el 573044873932 (formato internacional, solo dígitos). Todos los botones de WhatsApp lo usan.
- `instagramUrl`: enlace al perfil @lownee17 (única red del pie de página).
- `messages`: textos prellenados de WhatsApp.

## Pendiente al publicar
- En `index.html`, cambia la ruta de `og:image` por la URL completa de `assets/img/og-lownee.jpg`.

## Dónde editar cada cosa
- Colores y tipografías: variables al inicio de `css/styles.css` (`:root`).
- Textos y productos: `index.html`. Cada tarjeta del catálogo lleva `data-material`, `data-size` y `data-price`
  y `data-hook` (`si` = con gancho trasero, `no` = sin gancho). Si faltan, la ventana muestra los datos generales.
- Precios de la sección de medidas: atributos `data-price` de los `<input>` en `#medidas`.
- Imágenes: `assets/img/` (versiones web WebP de tus originales). Logo y mascota originales sin modificar en `assets/brand/originales/`.
