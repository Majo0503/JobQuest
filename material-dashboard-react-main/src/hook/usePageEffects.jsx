import { useEffect } from "react";

function usePageEffects() {
  useEffect(() => {
    const handleScroll = () => {
      const backToTopBtn = document.querySelector(".back-to-top");
      if (!backToTopBtn) return;

      if (window.scrollY > 100) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    };

    const scrollToTop = (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("scroll", handleScroll);

    // Listener en botón, que puede estar en DOM más tarde:
    const interval = setInterval(() => {
      const backToTopBtn = document.querySelector(".back-to-top");
      if (backToTopBtn) {
        backToTopBtn.addEventListener("click", scrollToTop);
        clearInterval(interval);
      }
    }, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      const backToTopBtn = document.querySelector(".back-to-top");
      backToTopBtn?.removeEventListener("click", scrollToTop);
      clearInterval(interval);
    };
  }, []);
}

export default usePageEffects;
