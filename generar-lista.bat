@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

set "carpeta=img"
set "archivo=img\lista.js"

echo // Este archivo se genera automaticamente con generar-lista.bat> "%archivo%"
echo // No lo edites a mano, tus cambios se perderan.>> "%archivo%"
echo const imagenes = [>> "%archivo%"

set "primero=1"
set "total=0"

for %%f in ("%carpeta%\*.jpg" "%carpeta%\*.jpeg" "%carpeta%\*.png" "%carpeta%\*.webp" "%carpeta%\*.gif" "%carpeta%\*.JPG" "%carpeta%\*.JPEG" "%carpeta%\*.PNG" "%carpeta%\*.WEBP" "%carpeta%\*.GIF") do (
    if exist "%%f" (
        set /a total+=1
        if "!primero!"=="1" (
            echo   "%%~nxf">> "%archivo%"
            set "primero=0"
        ) else (
            echo   ,"%%~nxf">> "%archivo%"
        )
    )
)

echo ];>> "%archivo%"

echo.
echo ==========================================
echo   Listo! Se encontraron !total! foto(s).
echo   Ya puedes abrir index.html
echo ==========================================
echo.
pause
