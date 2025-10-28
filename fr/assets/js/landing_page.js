document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".md-header");
  const banner = document.querySelector(".fullscreen-banner");

  const onScroll = () => {
    if (!banner) return;

    const bannerBottom = banner.offsetTop + banner.offsetHeight;

    if (window.scrollY >= bannerBottom - 55) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  };

  document.addEventListener("scroll", onScroll, { passive: true });
});
