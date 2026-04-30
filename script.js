const year = document.getElementById("year");
const galleryUpload = document.getElementById("gallery-upload");
const galleryReset = document.getElementById("gallery-reset");
const galleryPreview = document.getElementById("gallery-preview");
const galleryEmptyState = galleryPreview ? galleryPreview.innerHTML : "";
let galleryObjectUrls = [];

if (year) {
  year.textContent = new Date().getFullYear();
}

const releaseGalleryUrls = () => {
  galleryObjectUrls.forEach((url) => URL.revokeObjectURL(url));
  galleryObjectUrls = [];
};

const resetGalleryPreview = () => {
  releaseGalleryUrls();

  if (galleryPreview) {
    galleryPreview.innerHTML = galleryEmptyState;
  }

  if (galleryUpload) {
    galleryUpload.value = "";
  }
};

if (galleryUpload && galleryPreview) {
  galleryUpload.addEventListener("change", (event) => {
    const files = Array.from(event.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    releaseGalleryUrls();

    if (files.length === 0) {
      galleryPreview.innerHTML = galleryEmptyState;
      return;
    }

    galleryPreview.innerHTML = "";

    files.forEach((file, index) => {
      const url = URL.createObjectURL(file);
      galleryObjectUrls.push(url);

      const figure = document.createElement("figure");
      figure.className = index % 3 === 2 ? "gallery-shot gallery-shot--wide" : "gallery-shot";

      const image = document.createElement("img");
      image.src = url;
      image.alt = `Trabajo subido ${index + 1}`;

      const caption = document.createElement("figcaption");
      const slot = document.createElement("span");
      slot.textContent = `Trabajo ${String(index + 1).padStart(2, "0")}`;

      const copy = document.createElement("p");
      copy.textContent = file.name;

      caption.append(slot, copy);
      figure.append(image, caption);
      galleryPreview.appendChild(figure);
    });
  });
}

if (galleryReset) {
  galleryReset.addEventListener("click", resetGalleryPreview);
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
