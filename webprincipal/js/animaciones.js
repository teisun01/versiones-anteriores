/* --------- PARALLAX --------- */
const capas = [
  { el: document.getElementById("arbol-amarillo"), speed: 0.33 },
  { el: document.getElementById("selen"), speed: 0.45 },
];
const arbolesfondo = document.getElementById("arbolesfondo-solo");
const hojas = document.getElementById("hojasarbol");
const brilloramas = document.getElementById("layer-brilloramas");
const ramas = document.getElementById("ramas");
const brilloraices = document.getElementById("layer-brilloraices");
const frutos = document.getElementById("layer-frutos");
const descendiente = document.getElementById("layer-descendiente");
const frutosInd = document.getElementById("layer-frutos-ind");
const capitulo1 = document.getElementById("capitulo1");

let scrollActual = 0,
  actualizando = false;
const porcentajeActivacion = 0.7;
const descendientePosicion = 0;
const arbolAmarilloPosicion = 120;
const desplazamientoExtra = 100;
const escalaExtra = 1.1;
let lastScrollY = window.scrollY || 0;

/* === 🌐 ESCALA GLOBAL PARA TODO EL SITIO === */
function actualizarEscalaCSS() {
  const baseWidth = 1920;
  const vw = window.innerWidth;
  const scale = Math.max(vw / baseWidth, 0.6); // escala libre con mínimo 0.6
  document.documentElement.style.setProperty("--site-scale", scale);
}
window.addEventListener("resize", actualizarEscalaCSS);
window.addEventListener("load", actualizarEscalaCSS);
actualizarEscalaCSS();

/* --------- SCROLL PRINCIPAL --------- */
function onScroll() {
  scrollActual = window.scrollY || window.pageYOffset;
  if (!actualizando) requestAnimationFrame(update);
  actualizando = true;
  revisarBrilloraices();
}

function update() {
  const y = scrollActual;
  const contadorWrapper = document.querySelector(".contador-wrapper");

  /* === PARALLAX DE FONDO === */
  if (arbolesfondo) {
    arbolesfondo.dataset.scrollY = y * 0.22;
    arbolesfondo.style.backgroundPositionY = `${arbolesfondo.dataset.scrollY}px`;
  }

  /* === MOVER CAPAS INDIVIDUALES === */
  capas.forEach((l) => {
    if (!l.el) return;
    const t = y * l.speed;
    l.el.dataset.scrollY = t;
    let offset = t;
    if (l.el.id === "arbol-amarillo") offset += arbolAmarilloPosicion;
    l.el.style.transform = `translateX(-50%) translateY(${offset}px)`;
  });

  /* === HOJAS, RAMAS, FRUTOS, DESCENDIENTE === */
  if (capitulo1) {
    const limite = capitulo1.offsetTop - 800;
    const offset = Math.min(y, limite) + desplazamientoExtra;

    if (arbolesfondo) {
      arbolesfondo.style.backgroundPositionY = `${y * 0.22}px`;
    }

    const escalaFinal = escalaExtra;
    [hojas, brilloramas, ramas, brilloraices, frutos].forEach((l) => {
      if (l) l.style.transform = `translateX(-50%) scale(${escalaFinal})`;
    });

    if (frutosInd && !frutosInd.classList.contains("caida")) {
      frutosInd.style.transform = `translateX(-50%) scale(${escalaFinal})`;
    }

    if (descendiente) {
      descendiente.style.transform = `translateX(-50%) scale(${escalaFinal})`;
    }

  }



  actualizando = false;
}

/* --------- BRILLORAICES --------- */
function setBase() {
  if (!brilloraices) return;
  brilloraices.classList.remove("active");
  if (!brilloraices.classList.contains("base"))
    brilloraices.classList.add("base");
}
function setActive() {
  if (!brilloraices) return;
  brilloraices.classList.remove("base");
  if (!brilloraices.classList.contains("active"))
    brilloraices.classList.add("active");
}

function revisarBrilloraices() {
  const escenario = document.getElementById("escenario");
  if (!escenario || !brilloraices) return;
  const rect = escenario.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const visiblePercent = Math.min(
    1,
    Math.max(0, (viewportHeight - rect.top) / (rect.height + viewportHeight))
  );
  const currentScroll = window.scrollY || window.pageYOffset;
  const scrollingDown = currentScroll > lastScrollY;
  const scrollingUp = currentScroll < lastScrollY;

  if (visiblePercent >= porcentajeActivacion && scrollingDown) {
    brilloraices.classList.remove("reverse");
    setActive();

    // --- FRUTOS: iniciar caída + respiración ---
    if (
      frutosInd &&
      !frutosInd.classList.contains("caida") &&
      !frutosInd.classList.contains("respira")
    ) {
      frutosInd.classList.remove("respira");
      frutosInd.classList.add("caida");

      setTimeout(() => {
        if (frutosInd.classList.contains("caida")) {
          frutosInd.classList.remove("caida");
          frutosInd.classList.add("respira");
        }
      }, 3000);
    }
  } else if (visiblePercent < porcentajeActivacion && scrollingUp) {
    brilloraices.classList.remove("base", "active");
    if (!brilloraices.classList.contains("reverse"))
      brilloraices.classList.add("reverse");
    if (frutosInd) frutosInd.classList.remove("caida", "respira");
  } else if (visiblePercent < 0.1) {
    brilloraices.classList.remove("reverse", "active");
    setBase();
    if (frutosInd) frutosInd.classList.remove("caida", "respira");
  }

  lastScrollY = currentScroll;
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", () => {
  update();
  revisarBrilloraices();
});
if (
  brilloraices &&
  !brilloraices.classList.contains("base") &&
  !brilloraices.classList.contains("active")
)
  brilloraices.classList.add("base");
update();
revisarBrilloraices();

/* --------- PARALLAX MOUSE --------- */
const arbolAmarillo = document.getElementById("arbol-amarillo");
const selen = document.getElementById("selen");
window.addEventListener("mousemove", (e) => {
  const x = e.clientX / window.innerWidth - 0.5;
  const y = e.clientY / window.innerHeight - 0.5;
  const fondoScrollY = parseFloat(arbolesfondo?.dataset.scrollY || 0);
  let offsetX = x * 30;
  if (offsetX > 0) offsetX = 0;
  if (offsetX < -50) offsetX = -50;
  const offsetY = fondoScrollY + Math.min(0, y * 0.04 * 100);
  if (arbolesfondo)
    arbolesfondo.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
  if (arbolAmarillo) {
    const arbolAmarilloScrollY = parseFloat(
      arbolAmarillo.dataset.scrollY || 0
    );
    arbolAmarillo.style.transform = `translateX(calc(-50% + ${
      x * 15
    }px)) translateY(${
      arbolAmarilloScrollY + arbolAmarilloPosicion + y * 0.04 * 40
    }px)`;
  }
  if (selen) {
    const selenScrollY = parseFloat(selen.dataset.scrollY || 0);
    selen.style.transform = `translateX(calc(-50% + ${
      x * -60
    }px)) translateY(${selenScrollY + y * 0.04 * 80}px)`;
  }
});

/* --------- CONTADOR --------- */
const contador = document.getElementById("contador");
const fechaEvento = new Date("2025-11-15T20:00:00").getTime();

function actualizarContador() {
  if (!contador) return;
  const ahora = new Date().getTime();
  const distancia = fechaEvento - ahora;

  if (distancia <= 0) {
    contador.innerHTML = `<div class='bloque-tiempo'><div class='fila-numeros'><div class='digito'>0</div><div class='digito'>0</div></div><div class='etiqueta-tiempo'>finalizó</div></div>`;
    clearInterval(intervalo);
    return;
  }

  const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((distancia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((distancia / (1000 * 60)) % 60);
  const segundos = Math.floor((distancia / 1000) % 60);

  const diasStr = String(dias).padStart(2, "0");
  const horasStr = String(horas).padStart(2, "0");
  const minStr = String(minutos).padStart(2, "0");
  const segStr = String(segundos).padStart(2, "0");

  function generarCuadros(texto) {
    return texto
      .split("")
      .map((c) => `<div class='digito'>${c}</div>`)
      .join("");
  }

  let fase = 1;
  if (dias <= 0) fase = 2;
  if (dias <= 0 && horas <= 0) fase = 3;

  if (fase === 1) {
    contador.innerHTML = `<div class='bloque-tiempo'><div class='fila-numeros'>${generarCuadros(
      diasStr
    )}</div><div class='etiqueta-tiempo'>días</div></div><div class='bloque-tiempo'><div class='fila-numeros'>${generarCuadros(
      horasStr
    )}</div><div class='etiqueta-tiempo'>horas</div></div>`;
  } else if (fase === 2) {
    contador.innerHTML = `<div class='bloque-tiempo'><div class='fila-numeros'>${generarCuadros(
      horasStr
    )}</div><div class='etiqueta-tiempo'>horas</div></div><div class='bloque-tiempo'><div class='fila-numeros'>${generarCuadros(
      minStr
    )}</div><div class='etiqueta-tiempo'>minutos</div></div>`;
  } else if (fase === 3) {
    contador.innerHTML = `<div class='bloque-tiempo'><div class='fila-numeros'>${generarCuadros(
      minStr
    )}</div><div class='etiqueta-tiempo'>minutos</div></div><div class='bloque-tiempo'><div class='fila-numeros'>${generarCuadros(
      segStr
    )}</div><div class='etiqueta-tiempo'>segundos</div></div>`;
  }
}

const intervalo = setInterval(actualizarContador, 1000);
actualizarContador();

/* --------- ANIMACIONES DE SECCIONES --------- */
const secciones = document.querySelectorAll("section.historia");
const observer = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      const seccion = entrada.target;
      if (entrada.isIntersecting) {
        seccion.classList.add("visible");
        seccion.classList.remove("saliente");
      } else {
        seccion.classList.remove("visible");
        seccion.classList.add("saliente");
      }
    });
  },
  { threshold: 0.3 }
);
secciones.forEach((sec) => observer.observe(sec));

/* Animación descendiente */
const descendienteObserver = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        descendiente?.classList.add("visible");
        descendiente?.classList.remove("saliente");
      } else {
        descendiente?.classList.remove("visible");
        descendiente?.classList.add("saliente");
      }
    });
  },
  { threshold: 0.3 }
);
if (capitulo1) descendienteObserver.observe(capitulo1);

/* Scroll detect descendiente */
let ultimoScrollY_desc = window.scrollY;
let animacionActiva = "entrada";
window.addEventListener("scroll", () => {
  if (!capitulo1) return;
  const actualY = window.scrollY;
  const direccionArriba = actualY < ultimoScrollY_desc;
  const direccionAbajo = actualY > ultimoScrollY_desc;
  const triggerY = capitulo1.offsetTop;
  const distanciaDesdeCapitulo = actualY - triggerY;
  const umbral = window.innerHeight * 0.1;
  if (
    direccionArriba &&
    distanciaDesdeCapitulo < -umbral &&
    animacionActiva !== "salida"
  ) {
    descendiente?.classList.remove("visible");
    descendiente?.classList.add("saliente");
    animacionActiva = "salida";
  }
  if (
    direccionAbajo &&
    distanciaDesdeCapitulo > -umbral &&
    animacionActiva !== "entrada"
  ) {
    descendiente?.classList.add("visible");
    descendiente?.classList.remove("saliente");
    animacionActiva = "entrada";
  }
  ultimoScrollY_desc = actualY;
});

/* --------- FRUTOS IND (solo al bajar) --------- */
if (frutosInd) {
  const linkInicial = document.getElementById("link-frutos-inicial");
  const linkFinal = document.getElementById("link-frutos-final");
  const seccionArbol = document.querySelector(".seccion-arbol");

  let estado = "inicial";
  let animacionEjecutada = false;

  function actualizarFrutos() {
    const scrollY = window.scrollY || window.pageYOffset;
    const arbolTop = seccionArbol.offsetTop;
    const arbolHeight = seccionArbol.offsetHeight;
    const ventanaAltura = window.innerHeight;
    const progreso = (scrollY - arbolTop) / (arbolHeight - ventanaAltura);
    const bajando = scrollY > (actualizarFrutos.lastScrollY || 0);
    actualizarFrutos.lastScrollY = scrollY;

    if (
      bajando &&
      progreso > 0.3 &&
      progreso < 0.8 &&
      estado === "inicial" &&
      !animacionEjecutada
    ) {
      frutosInd.classList.remove("respira");
      frutosInd.classList.add("caida");
      estado = "caida";
      animacionEjecutada = true;

      setTimeout(() => {
        if (estado === "caida") {
          frutosInd.classList.remove("caida");
          frutosInd.classList.add("respira");
          estado = "respira";
          if (linkInicial) linkInicial.style.display = "none";
          if (linkFinal) linkFinal.style.display = "block";
          animacionEjecutada = false;
        }
      }, 3000);
    }

    if (!bajando && estado === "respira" && progreso < 0) {
      frutosInd.classList.remove("respira");
      estado = "inicial";
      animacionEjecutada = false;
      if (linkInicial) linkInicial.style.display = "block";
      if (linkFinal) linkFinal.style.display = "none";
    }

    requestAnimationFrame(actualizarFrutos);
  }

  requestAnimationFrame(actualizarFrutos);
}

(() => {
  const docH = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );
  console.log("document height:", docH, "viewport height:", window.innerHeight);
})();
