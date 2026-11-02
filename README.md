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



- Los datos viven solo en el navegador (`localStorage`, clave `norm_bd_v1`); no hay backend. Cambiar de navegador o dominio empieza un proyecto vacío.
- El diagrama es un lienzo SVG propio (no usa React Flow).
- La exportación a PDF se genera en el navegador con jsPDF; el diagrama se rasteriza desde el mismo SVG que se ve en pantalla.
