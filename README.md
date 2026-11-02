# Normalizador BD

Normalizador BD es una herramienta web, completamente en español, para diseñar y documentar bases de datos relacionales desde un mismo espacio de trabajo. Guía el proceso desde la identificación de tablas y campos hasta la construcción y exportación del modelo lógico.

## ¿Por qué normalizar?

Saber crear un CRUD permite consultar, registrar, actualizar y eliminar información. Pero una base de datos necesita primero una estructura bien diseñada. La normalización ayuda a reducir datos duplicados y a prevenir inconsistencias y anomalías al modificar la información. Por eso, para construir sistemas confiables, comprender cómo normalizar una base de datos es incluso más importante que saber implementar un CRUD: un CRUD trabaja sobre el modelo; la normalización ayuda a que ese modelo esté bien planteado.

## Todas las etapas en un solo lugar

La aplicación reúne el proceso de normalización en una secuencia guiada. Puedes registrar las tablas y sus campos, analizar dependencias funcionales, definir relaciones, resolver relaciones muchos a muchos mediante tablas intermedias y revisar el modelo lógico final sin cambiar de herramienta. Al terminar, puedes exportar el modelo lógico a PDF, o generar un PDF del proceso completo.

## Funcionalidades

1. **Información del proyecto**: registra el nombre, autor y fecha de elaboración.
2. **Primera forma normal (1FN)**: crea tablas y campos, y marca claves primarias (PK), foráneas (FK) y únicas (UK).
3. **Segunda forma normal (2FN)**: define la llave primaria y documenta las dependencias funcionales directas (DFD) y transitivas (DFT) de cada tabla.
4. **Tercera forma normal (3FN)**: construye un diagrama entidad-relación, mueve las tablas libremente y establece relaciones 1:1, 1:M y M:M.
5. **Resolución de relaciones M:M**: crea tablas intermedias con llave primaria compuesta y relaciones 1:M.
6. **Modelo lógico y exportación**: revisa el diagrama final y expórtalo a PDF, o exporta el proceso completo.
7. **Editor del diagrama**: incluye zoom, desplazamiento, centrado, ajuste a pantalla, cuadrícula opcional y restablecimiento de la distribución.

## Datos y privacidad

Los datos del proyecto se guardan en el almacenamiento local del navegador (`localStorage`, clave `norm_bd_v1`). No se envían a un backend. Por ello, los proyectos están disponibles en el navegador y dominio donde se crearon.

## Tecnologías

- React y Vite
- SVG para el editor del diagrama
- jsPDF para generar los archivos PDF
