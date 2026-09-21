#!/bin/bash
# Genera img/lista.js automáticamente a partir de las fotos que haya
# dentro de la carpeta img/. Ejecútalo cada vez que agregues fotos nuevas.

shopt -s nullglob nocaseglob

carpeta="img"
archivo="img/lista.js"

archivos=("$carpeta"/*.jpg "$carpeta"/*.jpeg "$carpeta"/*.png "$carpeta"/*.webp "$carpeta"/*.gif)

{
  echo "// Este archivo se genera automaticamente con generar-lista.sh"
  echo "// No lo edites a mano, tus cambios se perderan."
  echo "const imagenes = ["
  for i in "${!archivos[@]}"; do
    nombre=$(basename "${archivos[$i]}")
    if [ "$i" -eq 0 ]; then
      echo "  \"$nombre\""
    else
      echo "  ,\"$nombre\""
    fi
  done
  echo "];"
} > "$archivo"

echo ""
echo "=========================================="
echo "  Listo! Se encontraron ${#archivos[@]} foto(s)."
echo "  Ya puedes abrir index.html"
echo "=========================================="
echo ""
