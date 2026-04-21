const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");
const navLinkItems = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");
const yearElement = document.querySelector("#year");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.innerHTML = isOpen
            ? '<i class="bx bx-x"></i>'
            : '<i class="bx bx-menu"></i>';
    });
}

navLinkItems.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = '<i class="bx bx-menu"></i>';
    });
});

const updateActiveNavLink = () => {
    const headerHeight = getComputedStyle(document.documentElement)
        .getPropertyValue("--header-height");
    const headerOffset = parseInt(headerHeight, 10) || 88;
    const scrollPosition = window.scrollY + headerOffset + 24;

    let currentSectionId = sections[0]?.getAttribute("id");

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSectionId = section.getAttribute("id");
        }
    });

    navLinkItems.forEach((link) => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${currentSectionId}`
        );
    });
};

window.addEventListener("scroll", updateActiveNavLink, { passive: true });
window.addEventListener("load", updateActiveNavLink);
updateActiveNavLink();

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    },
    {
        threshold: 0.18,
    }
);

revealItems.forEach((item) => revealObserver.observe(item));

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get("name")?.toString().trim();
        const email = formData.get("email")?.toString().trim();
        const phone = formData.get("phone")?.toString().trim();
        const subject = formData.get("subject")?.toString().trim();
        const message = formData.get("message")?.toString().trim();

        const whatsappMessage = [
            "Hello Sharon,",
            "",
            `My name is ${name}.`,
            `Subject: ${subject}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            "",
            message,
        ].join("\n");

        const whatsappUrl = "https://wa.link/2eqfzi";

        const openWhatsApp = () => {
            if (formNote) {
                formNote.textContent =
                    "Message copied. WhatsApp is opening in a new tab so you can paste and send it.";
            }

            window.open(whatsappUrl, "_blank", "noopener");
            contactForm.reset();
        };

        if (navigator.clipboard?.writeText) {
            navigator.clipboard
                .writeText(whatsappMessage)
                .then(openWhatsApp)
                .catch(() => {
                    if (formNote) {
                        formNote.textContent =
                            "WhatsApp is opening, but your browser blocked automatic copying. Please copy your message before sending.";
                    }

                    window.open(whatsappUrl, "_blank", "noopener");
                });
        } else {
            if (formNote) {
                formNote.textContent =
                    "WhatsApp is opening, but automatic copying is not supported in this browser.";
            }

            window.open(whatsappUrl, "_blank", "noopener");
        }
    });
}

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}
