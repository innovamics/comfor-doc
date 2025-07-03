
/*Parallax effect */

document.addEventListener("scroll", function () {
    const scrollY = window.scrollY;
    document.body.style.backgroundPositionY = -(scrollY * 2) + "px";
});

/*Homepage detection for background*/

document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;


    if (path.endsWith("/index.html") || path.endsWith("/comfor-doc/") || path === "/comfor-doc") {
        document.body.classList.add("home");
    }
});