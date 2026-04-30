const year = document.getElementById("year");


if (year) {
  year.textContent = new Date().getFullYear();
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
