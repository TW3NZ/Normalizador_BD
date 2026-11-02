# Normalizador de bases de datos

Herramienta web, 100 % en español, para realizar de forma visual el proceso de normalización de una base de datos: desde la identificación de tablas y campos (1FN) hasta el modelo lógico final con notación de pata de gallo (Crow's Foot), exportable a PDF.

## Funcionalidades

1. **Proyecto**: nombre, autor y fecha (se conserva al recargar).
2. **1FN**: tablas y campos con claves PK (rojo), FK (verde) y UK (azul).
3. **2FN**: llave primaria, DFD y DFT por tabla; la ausencia de DFT la confirma el usuario.
4. **3FN**: diagrama entidad-relación editable (arrastrar tablas, conectar, cardinalidades 1:1, 1:M, M:M).
5. **Eliminar M:M**: crea tablas intermedias con llave primaria compuesta, con confirmación.
6. **Exportar**: PDF del modelo lógico o del proceso completo.
7. Lienzo con zoom, desplazamiento, centrar, ajustar a pantalla, cuadrícula opcional y restablecer distribución. Posiciones, zoom y datos se guardan en `localStorage`.

## Requisitos

- **Node.js 18 o superior** (recomendado: Node 20 o 22 LTS).
- Funciona en macOS con Apple Silicon (M1): no hay dependencias nativas.

Instalar Node en el Mac (si no lo tienes):

```bash
brew install node
node -v
```

## Ejecutar en local

```bash
npm install
npm run dev
```

Abre la dirección que muestra la terminal (normalmente http://localhost:5173).

## Compilar para producción

```bash
npm run build     # genera la carpeta dist/
npm run preview   # sirve dist/ en local para probarla
```

## Subir a GitHub

```bash
git init
git add .
git commit -m "Normalizador de bases de datos"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/normalizador-bd.git
git push -u origin main
```

(Crea antes el repositorio vacío en github.com. `node_modules` y `dist` ya están en `.gitignore`.)

## Desplegar en Vercel

**Opción A, desde la web (recomendada):**

1. Entra en https://vercel.com e inicia sesión con GitHub.
2. Pulsa **Add New… → Project** e importa el repositorio.
3. Vercel detecta Vite automáticamente (`vercel.json` ya define `npm run build` y `dist`). Pulsa **Deploy**.

**Opción B, desde la terminal:**

```bash
npm i -g vercel
vercel          # primer despliegue (vista previa)
vercel --prod   # producción
```

## Estructura

```
normalizador-bd/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── src/
    ├── main.jsx            # punto de entrada
    ├── App.jsx             # estado global, persistencia y navegación
    ├── context.js
    ├── styles.css
    ├── components/         # Sidebar, Modal, Diagram, FieldRow, Legend
    ├── steps/              # Step0 … Step5 (una por sección)
    └── lib/
        ├── geometry.js     # geometría del diagrama y pata de gallo (SVG)
        ├── actions.js      # operaciones sobre el modelo
        ├── pdf.js          # exportación a PDF (jsPDF)
        ├── progress.js
        └── storage.js      # LocalStorage
```

## Notas

- Los datos viven solo en el navegador (`localStorage`, clave `norm_bd_v1`); no hay backend. Cambiar de navegador o dominio empieza un proyecto vacío.
- El diagrama es un lienzo SVG propio (no usa React Flow).
- La exportación a PDF se genera en el navegador con jsPDF; el diagrama se rasteriza desde el mismo SVG que se ve en pantalla.
