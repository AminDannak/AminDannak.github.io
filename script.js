function initPortfolioUI() {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    sections.forEach((section) => observer.observe(section));
    initAccordions();
}

window.addEventListener("portfolio:rendered", initPortfolioUI);

function initAccordions() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DURATION = 450;
    const EASING = "cubic-bezier(0.33, 1, 0.68, 1)";

    document.querySelectorAll(".accordion").forEach((details) => {
        const summary = details.querySelector("summary");
        const body = details.querySelector(".accordion-body");
        if (!summary || !body) return;

        let panel = body.parentElement;
        if (!panel.classList.contains("accordion-panel")) {
            panel = document.createElement("div");
            panel.className = "accordion-panel";
            body.parentNode.insertBefore(panel, body);
            panel.appendChild(body);
        }

        let activeAnimation = null;
        let isAnimating = false;

        const setOpenVisual = (open) => {
            details.classList.toggle("is-open", open);
            if (open) {
                details.setAttribute("open", "");
            }
        };

        const cancelAnimation = () => {
            if (activeAnimation) {
                activeAnimation.cancel();
                activeAnimation = null;
            }
            panel.style.height = `${panel.getBoundingClientRect().height}px`;
        };

        const finishOpen = () => {
            panel.style.height = "auto";
            panel.style.overflow = "";
            setOpenVisual(true);
        };

        const finishClosed = () => {
            panel.style.height = "0px";
            panel.style.overflow = "";
            details.classList.remove("is-open");
            details.removeAttribute("open");
        };

        const measurePanelHeight = () => {
            const previousHeight = panel.style.height;
            panel.style.height = "auto";
            const height = panel.scrollHeight;
            panel.style.height = previousHeight;
            return height;
        };

        const lockPanelHeight = () => {
            if (panel.style.height === "auto" || !panel.style.height) {
                panel.style.height = `${panel.scrollHeight}px`;
            }
            return panel.getBoundingClientRect().height;
        };

        const openAccordion = () => {
            cancelAnimation();
            isAnimating = true;
            setOpenVisual(true);
            panel.style.overflow = "hidden";

            const targetHeight = measurePanelHeight();

            if (prefersReducedMotion) {
                finishOpen();
                isAnimating = false;
                return;
            }

            panel.style.height = "0px";

            if (typeof panel.animate === "function") {
                activeAnimation = panel.animate(
                    [{ height: "0px" }, { height: `${targetHeight}px` }],
                    { duration: DURATION, easing: EASING, fill: "forwards" }
                );
                activeAnimation.onfinish = () => {
                    activeAnimation.cancel();
                    activeAnimation = null;
                    finishOpen();
                    isAnimating = false;
                };
                return;
            }

            panel.style.transition = `height ${DURATION}ms ${EASING}`;
            requestAnimationFrame(() => {
                panel.style.height = `${targetHeight}px`;
            });
            panel.addEventListener("transitionend", function onEnd(event) {
                if (event.propertyName !== "height") return;
                panel.style.transition = "";
                panel.removeEventListener("transitionend", onEnd);
                finishOpen();
                isAnimating = false;
            });
        };

        const closeAccordion = () => {
            cancelAnimation();
            isAnimating = true;
            panel.style.overflow = "hidden";

            const startHeight = lockPanelHeight();
            setOpenVisual(false);

            if (prefersReducedMotion || startHeight === 0) {
                finishClosed();
                isAnimating = false;
                return;
            }

            panel.offsetHeight;

            if (typeof panel.animate === "function") {
                activeAnimation = panel.animate(
                    [{ height: `${startHeight}px` }, { height: "0px" }],
                    { duration: DURATION, easing: EASING, fill: "forwards" }
                );
                activeAnimation.onfinish = () => {
                    activeAnimation.cancel();
                    activeAnimation = null;
                    finishClosed();
                    isAnimating = false;
                };
                return;
            }

            panel.style.transition = `height ${DURATION}ms ${EASING}`;
            requestAnimationFrame(() => {
                panel.style.height = "0px";
            });
            panel.addEventListener("transitionend", function onEnd(event) {
                if (event.propertyName !== "height") return;
                panel.style.transition = "";
                panel.removeEventListener("transitionend", onEnd);
                finishClosed();
                isAnimating = false;
            });
        };

        if (details.hasAttribute("open")) {
            setOpenVisual(true);
            finishOpen();
        } else {
            finishClosed();
        }

        summary.addEventListener("click", (event) => {
            event.preventDefault();

            if (isAnimating) return;

            if (details.classList.contains("is-open")) {
                closeAccordion();
            } else {
                openAccordion();
            }
        });
    });
}
