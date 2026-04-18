(function () {
    const page = document.body.dataset.page;

    const yearElements = document.querySelectorAll("#year");
    yearElements.forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

    const navLinks = document.querySelectorAll("[data-nav]");
    navLinks.forEach(function (link) {
        if (link.dataset.nav === page) {
            link.classList.add("active");
        }
    });

    const header = document.querySelector(".site-header");
    const setHeaderState = function () {
        if (!header) return;
        header.classList.toggle("scrolled", window.scrollY > 20);
    };
    setHeaderState();
    window.addEventListener("scroll", setHeaderState);

    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", function () {
            const expanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", String(!expanded));
            nav.classList.toggle("open");
        });

        nav.addEventListener("click", function (event) {
            if (event.target instanceof HTMLElement && event.target.matches("a")) {
                menuToggle.setAttribute("aria-expanded", "false");
                nav.classList.remove("open");
            }
        });
    }

    const reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && reveals.length) {
        const observer = new IntersectionObserver(
            function (entries, io) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        reveals.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        reveals.forEach(function (el) {
            el.classList.add("visible");
        });
    }

    const counterElements = document.querySelectorAll("[data-counter]");
    counterElements.forEach(function (counter) {
        const end = Number(counter.getAttribute("data-counter"));
        if (!Number.isFinite(end)) return;

        let current = 0;
        const duration = 2200;
        const start = performance.now();

        const step = function (now) {
            const progress = Math.min((now - start) / duration, 1);
            current = Math.floor(end * progress);
            counter.textContent = String(current);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    });

    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(function (item) {
        const trigger = item.querySelector(".faq-trigger");
        if (!trigger) return;

        trigger.addEventListener("click", function () {
            const isOpen = item.classList.contains("open");
            item.classList.toggle("open", !isOpen);
            trigger.setAttribute("aria-expanded", String(!isOpen));
        });
    });

    const form = document.querySelector("[data-contact-form]");
    const feedback = document.querySelector("[data-form-feedback]");

    if (form && form instanceof HTMLFormElement && feedback) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!form.checkValidity()) {
                feedback.textContent = "Revise os campos obrigatórios antes de enviar.";
                feedback.classList.add("error");
                form.reportValidity();
                return;
            }

            feedback.textContent = "Recebido. A gente retorna em até um dia útil.";
            feedback.classList.remove("error");
            form.reset();
        });
    }
})();
