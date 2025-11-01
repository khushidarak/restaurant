// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
// toggle search box
  document.getElementById("search-icon").addEventListener("click", function(e) {
    e.preventDefault();
    let box = document.getElementById("search-box");
    if (box.style.display === "block") {
      box.style.display = "none";
    } else {
      box.style.display = "block";
      box.querySelector("input").focus(); // auto-focus inside bar
    }
});

document.addEventListener("DOMContentLoaded", function ())
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
