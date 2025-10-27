const customScroll = document.querySelector(".scrollbar .scrolled");
const nav = document.querySelector("nav");
const themeDark = document.querySelector("#theme-dark");

// متغیر سراسری برای VANTA effect
let vantaEffect = null;

// ========== تنظیم VANTA Background ==========
function initVanta() {
  const isDark = document.documentElement.classList.contains("dark");
  const bgColor = isDark ? "#0A0E1A" : "#ECF3FF";
  const itemSmall = isDark ? "#46A6FF" : "#005CFF";
  const itemHeader = isDark ? "#FFD34D" : "#FFB300";

  if (vantaEffect) {
    vantaEffect.destroy();
  }

  if (typeof VANTA !== "undefined" && typeof THREE !== "undefined") {
    vantaEffect = VANTA.DOTS({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: itemSmall,
      color2: itemHeader,
      backgroundColor: bgColor,
      spacing: 20.0,
      showLines: true,
    });
  }
}

// ========== آپدیت استایل Nav ==========
function updateNavStyle() {
  const isDark = document.documentElement.classList.contains("dark");

  if (window.scrollY > 0) {
    if (isDark) {
      nav.style.background =
        "linear-gradient(135deg, rgba(0, 102, 255, 0.4), rgba(255, 221, 0, 0.4))";
    } else {
      nav.style.background =
        "linear-gradient(135deg, rgba(0, 102, 255, 0.8), rgba(0, 94, 188, 0.9))";
    }
    nav.style.backdropFilter = "blur(12px)";
    nav.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.2)";
  } else {
    if (isDark) {
      nav.style.background =
        "linear-gradient(135deg, rgba(0, 102, 255, 0.3), rgba(255, 221, 0, 0.3))";
    } else {
      nav.style.background = "#005ebc";
    }
    nav.style.backdropFilter = "blur(0px)";
    nav.style.boxShadow = "none";
  }
}

// ========== تغییر تم ==========
function toggleTheme() {
  const htmlElement = document.documentElement;
  const isDark = htmlElement.classList.contains("dark");

  if (isDark) {
    htmlElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    htmlElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }

  // آیکون دکمه رو عوض کن
  updateThemeIcon(!isDark);

  // استایل Nav رو آپدیت کن
  updateNavStyle();

  // VANTA رو بازسازی کن
  setTimeout(() => {
    initVanta();
  }, 100);
}

// ========== آپدیت آیکون دکمه ==========
function updateThemeIcon(isDark) {
  if (!themeDark) {
    console.error("دکمه theme-dark پیدا نشد!"); // دیباگ
    return;
  }

  if (isDark) {
    // آیکون خورشید برای حالت روشن
    themeDark.innerHTML = `
      <svg class="w-6 h-6 m-auto text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
      </svg>
    `;
  } else {
    // آیکون ماه برای حالت تاریک
    themeDark.innerHTML = `
      <svg class="w-6 h-6 m-auto text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
      </svg>
    `;
  }
}

// ========== تنظیم اولیه تم ==========
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const htmlElement = document.documentElement;

  console.log("تم ذخیره شده:", savedTheme); // دیباگ

  if (savedTheme === "dark") {
    htmlElement.classList.add("dark");
    updateThemeIcon(true);
  } else {
    htmlElement.classList.remove("dark");
    updateThemeIcon(false);
  }

  // استایل اولیه Nav
  updateNavStyle();
}

// ========== Event Listener ==========
if (themeDark) {
  console.log("دکمه تم پیدا شد!"); // دیباگ
  themeDark.addEventListener("click", toggleTheme);
  themeDark.style.cursor = "pointer";
} else {
  console.error("خطا: دکمه با id='theme-dark' پیدا نشد!"); // دیباگ
}

// ========== راه‌اندازی اولیه ==========
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();

  setTimeout(() => {
    initVanta();
  }, 100);

  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1200,
      once: true,
      offset: 100,
    });
  }
});

// ========== Resize Handler ==========
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (vantaEffect) {
      initVanta();
    }
  }, 300);
});

// ========== Scroll Handler ==========
window.addEventListener("scroll", () => {
  updateNavStyle();

  // نوار پیشرفت
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrollValue = Math.floor((scrollTop / scrollHeight) * 100);

  if (customScroll) {
    customScroll.style.width = `${scrollValue}%`;
  }
});
//=========nav Mobile==========
const menuHambgre = document.querySelector("#menu-hambgre");
const bgNavMobile = document.querySelector("#nav-mobile-bg");
const navItem = document.querySelector("#nav-item");
function menuClick() {
  if (navItem.classList.contains("w-0")) {
    bgNavMobile.classList.remove("hidden");
    navItem.classList.remove("w-0");
    navItem.classList.add("w-[75%]");
  } else {
    bgNavMobile.classList.add("hidden");
    navItem.classList.add("w-0");
    navItem.classList.remove("w-[75%]");
  }
}
menuHambgre.addEventListener("click", menuClick);
bgNavMobile.addEventListener("click", menuClick);
// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Parallax effect for particles
document.addEventListener("mousemove", (e) => {
  const particles = document.querySelectorAll(".particle");
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  particles.forEach((particle, index) => {
    const speed = (index + 1) * 10;
    particle.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });
});
