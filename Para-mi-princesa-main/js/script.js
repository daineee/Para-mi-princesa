/* ======================================================================
   LISTA DE FOTOS
   ----------------------------------------------------------------------
   Ya NO se escribe a mano aquí. Los nombres se cargan automáticamente
   desde el archivo "img/lista.js", que se genera solo al ejecutar:

     - Windows:      doble clic en "generar-lista.bat"
     - Mac / Linux:  ejecutar "generar-lista.sh" en la terminal

   Cada vez que agregues o quites fotos de la carpeta "img", vuelve a
   correr ese script y listo.
   ====================================================================== */
const listaImagenes = (typeof imagenes !== "undefined" && Array.isArray(imagenes))
  ? imagenes
  : [];

if (listaImagenes.length === 0) {
  console.warn(
    "No se encontraron fotos. Agrega imágenes a la carpeta 'img' y " +
    "ejecuta generar-lista.bat (Windows) o generar-lista.sh (Mac/Linux)."
  );
}

/* ======================================================================
   LLUVIA DE FOTOS INFINITA
   ====================================================================== */
const contenedor = document.getElementById("lluvia-fotos");

// Cuántas fotos como máximo puede haber en pantalla al mismo tiempo.
// Se ajusta solo según cuántas fotos reales tengas: si solo tienes 1 o 2,
// no llena la pantalla de copias repetidas; si tienes muchas, se ve más lleno.
const capacidadMaxima = Math.min(Math.max(listaImagenes.length * 4, 5), 30);
let fotosActivas = 0;

function crearFoto() {
  if (listaImagenes.length === 0) return;
  if (fotosActivas >= capacidadMaxima) return; // evita saturar la pantalla

  const archivo = listaImagenes[Math.floor(Math.random() * listaImagenes.length)];

  const img = document.createElement("img");
  img.src = `img/${archivo}`;
  img.className = "foto";
  img.alt = "";
  img.onerror = () => img.remove(); // si el archivo no existe, se ignora

  // Tamaño aleatorio
  const tamano = 130 + Math.random() * 140; // 130px - 270px
  img.style.width = `${tamano}px`;
  img.style.height = `${tamano * 1.15}px`;

  // Posición horizontal aleatoria
  const izquierda = Math.random() * 92; // en %
  img.style.left = `${izquierda}%`;

  // Rotación inicial y final (ligero balanceo)
  const rotInicio = (Math.random() * 16 - 8).toFixed(1);
  const rotFin = (Math.random() * 24 - 12).toFixed(1);
  img.style.setProperty("--rot-inicio", `${rotInicio}deg`);
  img.style.setProperty("--rot-fin", `${rotFin}deg`);

  // Duración y velocidad distintas para cada foto
  const duracion = 14 + Math.random() * 10; // 14s - 24s
  img.style.animationDuration = `${duracion}s`;

  contenedor.appendChild(img);
  fotosActivas++;

  let yaEliminada = false;
  const eliminar = () => {
    if (yaEliminada) return;
    yaEliminada = true;
    img.remove();
    fotosActivas--;
  };

  // Se elimina del DOM cuando termina de caer (rendimiento)
  img.addEventListener("animationend", eliminar);

  // Seguro adicional: si por alguna razón el evento no dispara
  // (pestaña en segundo plano, etc.), se elimina igual pasado su tiempo.
  setTimeout(eliminar, duracion * 1000 + 800);
}

// Genera una nueva foto cada cierto tiempo -> efecto infinito.
// El intervalo se adapta: con pocas fotos, aparecen más espaciadas.
const intervaloSpawn = listaImagenes.length <= 2 ? 1800 : 550;
setInterval(crearFoto, intervaloSpawn);

// Algunas fotos ya visibles desde el primer segundo
const primerasFotos = Math.min(6, capacidadMaxima);
for (let i = 0; i < primerasFotos; i++) {
  setTimeout(crearFoto, i * 300);
}

/* ======================================================================
   MÚSICA DE FONDO
   ----------------------------------------------------------------------
   Coloca tu canción dentro de la carpeta "audio" con el nombre
   "cancion.mp3" (o cambia el nombre en el atributo src del <audio>
   dentro de index.html).

   Los navegadores bloquean el sonido automático si el usuario no ha
   interactuado antes con la página. Por eso primero se intenta
   reproducir sola; si el navegador la bloquea, aparece un botón para
   activarla con un clic.
   ====================================================================== */
const musica = document.getElementById("musica-fondo");
const botonSonido = document.getElementById("boton-sonido");

musica.volume = 0.6;

function intentarReproducir() {
  const intento = musica.play();
  if (intento !== undefined) {
    intento
      .then(() => {
        botonSonido.classList.add("oculto");
      })
      .catch(() => {
        // El navegador bloqueó el autoplay: mostramos el botón
        botonSonido.style.display = "block";
      });
  }
}

intentarReproducir();

botonSonido.addEventListener("click", () => {
  musica.play();
  botonSonido.classList.add("oculto");
});

// Si el usuario toca/hace clic en cualquier parte antes de que cargue,
// aprovechamos ese gesto para activar el audio automáticamente.
function activarConPrimerGesto() {
  if (musica.paused) musica.play().catch(() => {});
  botonSonido.classList.add("oculto");
  window.removeEventListener("click", activarConPrimerGesto);
  window.removeEventListener("touchstart", activarConPrimerGesto);
}
window.addEventListener("click", activarConPrimerGesto);
window.addEventListener("touchstart", activarConPrimerGesto);

/* ======================================================================
   MENSAJE DE INTRODUCCIÓN
   ====================================================================== */
const intro = document.getElementById("intro");
setTimeout(() => {
  intro.classList.add("oculto");
}, 5600);

/* ======================================================================
   PARTÍCULAS DE FONDO (pequeñas luces flotando, como polvo de estrellas)
   ====================================================================== */
const canvas = document.getElementById("particulas");
const ctx = canvas.getContext("2d");

function ajustarCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
ajustarCanvas();
window.addEventListener("resize", ajustarCanvas);

const particulas = Array.from({ length: 70 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.6 + 0.4,
  vy: Math.random() * 0.25 + 0.05,
  vx: Math.random() * 0.2 - 0.1,
  alpha: Math.random() * 0.6 + 0.2,
  fase: Math.random() * Math.PI * 2
}));

function dibujarParticulas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff2df";

  particulas.forEach((p) => {
    p.fase += 0.02;
    const brillo = p.alpha * (0.6 + 0.4 * Math.sin(p.fase));

    ctx.globalAlpha = brillo;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    p.y -= p.vy;
    p.x += p.vx;

    if (p.y < -5) p.y = canvas.height + 5;
    if (p.x < -5) p.x = canvas.width + 5;
    if (p.x > canvas.width + 5) p.x = -5;
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(dibujarParticulas);
}
dibujarParticulas();
