const year = document.getElementById("year");


if (year) {
  year.textContent = new Date().getFullYear();
}

const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector("[data-menu-toggle]");
const primaryNavigation = document.querySelector("[data-primary-navigation]");

if (topbar && menuToggle && primaryNavigation) {
  const navigationLinks = Array.from(primaryNavigation.querySelectorAll("a"));

  const closeMenu = () => {
    topbar.classList.remove("is-menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  };

  const toggleMenu = () => {
    const isOpen = topbar.classList.toggle("is-menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menu" : "Abrir menu");
  };

  menuToggle.addEventListener("click", toggleMenu);
  navigationLinks.forEach((link) => link.addEventListener("click", closeMenu));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 840) {
      closeMenu();
    }
  });
}

const galleryCarousel = document.querySelector("[data-gallery-carousel]");

if (galleryCarousel) {
  const galleryWindow = galleryCarousel.querySelector(".gallery-window");
  const track = galleryCarousel.querySelector(".gallery-track");
  const slides = Array.from(galleryCarousel.querySelectorAll("[data-gallery-slide]"));
  const prevButton = galleryCarousel.querySelector("[data-gallery-prev]");
  const nextButton = galleryCarousel.querySelector("[data-gallery-next]");
  const dots = Array.from(galleryCarousel.querySelectorAll("[data-gallery-dot]"));
  const galleryImages = Array.from(galleryCarousel.querySelectorAll("img"));
  let currentIndex = 0;

  const syncCarouselHeight = () => {
    if (!galleryWindow || slides.length === 0) {
      return;
    }

    const activeSlide = slides[currentIndex];
    galleryWindow.style.height = `${activeSlide.offsetHeight}px`;
  };

  const updateCarousel = (nextIndex) => {
    if (!track || slides.length === 0) {
      return;
    }

    currentIndex = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, index) => {
      const isActive = index === currentIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, index) => {
      const isActive = index === currentIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });

    requestAnimationFrame(syncCarouselHeight);
  };

  if (prevButton) {
    prevButton.addEventListener("click", () => updateCarousel(currentIndex - 1));
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => updateCarousel(currentIndex + 1));
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => updateCarousel(index));
  });

  galleryImages.forEach((image) => {
    if (image.complete) {
      return;
    }

    image.addEventListener("load", syncCarouselHeight);
  });

  window.addEventListener("resize", syncCarouselHeight);

  updateCarousel(0);
}

const lightbox = document.querySelector("[data-image-lightbox]");

if (lightbox) {
  const lightboxPreview = lightbox.querySelector("[data-lightbox-preview]");
  const lightboxClose = lightbox.querySelector(".image-lightbox__close");
  const lightboxCloseButtons = Array.from(lightbox.querySelectorAll("[data-lightbox-close]"));
  const lightboxImages = Array.from(document.querySelectorAll("[data-lightbox-image]"));
  let lastFocusedElement = null;

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.setAttribute("inert", "");
    document.body.classList.remove("has-lightbox");

    if (lightboxPreview) {
      lightboxPreview.src = "";
      lightboxPreview.alt = "";
    }

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  const openLightbox = (image) => {
    if (!lightboxPreview) {
      return;
    }

    lastFocusedElement = document.activeElement;
    lightboxPreview.src = image.currentSrc || image.src;
    lightboxPreview.alt = image.alt;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    lightbox.removeAttribute("inert");
    document.body.classList.add("has-lightbox");
    lightboxClose?.focus();
  };

  lightboxImages.forEach((image) => {
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `${image.alt}. Ver imagen ampliada`);

    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  lightboxCloseButtons.forEach((button) => {
    button.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window && revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
