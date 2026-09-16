import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowDownToLine } from "lucide-react";
import { useActiveSection } from "@/hooks";
import { profile } from "@/data/profile";
import { cn, scrollToId } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(NAV_LINKS.map((l) => l.id));

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the menu, and close it on Escape or if the viewport
  // widens past the breakpoint while it is open.
  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = () => desktop.matches && setMenuOpen(false);

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [menuOpen]);

  function go(id) {
    setMenuOpen(false);
    scrollToId(id);
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300")}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <nav className="container-px mx-auto flex h-16 max-w-7xl items-center justify-between md:h-20">
          <button
            type="button"
            onClick={() => go("top")}
            data-cursor="hover"
            className="rounded font-display text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 md:text-xl"
          >
            Veer<span className="text-accent">.</span>
          </button>

          <motion.ul
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 0.8, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="hidden items-center gap-1 rounded-full border border-line/40 px-1.5 py-1.5 backdrop-blur md:flex"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.id} className="relative">
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => go(link.id)}
                  aria-current={active === link.id ? "true" : undefined}
                  className={cn(
                    "relative z-10 rounded-full px-3.5 py-2 text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 lg:px-4",
                    active === link.id
                      ? "text-void"
                      : "text-ink-dim hover:text-ink",
                  )}
                >
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-highlight"
                      className="absolute inset-0 -z-10 rounded-full bg-accent"
                      transition={{
                        type: "spring",
                        duration: 0.5,
                        bounce: 0.15,
                      }}
                    />
                  )}
                  {link.label}
                </button>
              </li>
            ))}
          </motion.ul>

          <div className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.8 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="hidden rounded-full border border-line/40 backdrop-blur sm:inline-flex"
            >
              <MagneticButton href={profile.resumeUrl} download variant="ghost">
                Résumé <ArrowDownToLine className="h-3.5 w-3.5" />
              </MagneticButton>
            </motion.div>

            <button
              type="button"
              data-cursor="hover"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="relative z-50 grid h-11 w-11 place-items-center rounded-full border border-line bg-void/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-void/95 backdrop-blur-xl md:hidden"
          >
            <div
              className="container-px flex min-h-full flex-col justify-center gap-2"
              style={{
                paddingTop: "calc(6rem + env(safe-area-inset-top))",
                paddingBottom: "calc(3rem + env(safe-area-inset-bottom))",
              }}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.id}
                  type="button"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.05 + i * 0.05,
                    duration: 0.35,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  onClick={() => go(link.id)}
                  aria-current={active === link.id ? "true" : undefined}
                  className={cn(
                    "w-full border-b border-line/50 py-5 text-left font-display text-3xl transition-colors",
                    active === link.id ? "text-accent" : "text-ink",
                  )}
                >
                  {link.label}
                </motion.button>
              ))}

              <motion.a
                href={profile.resumeUrl}
                download
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.35,
                  ease: [0.23, 1, 0.32, 1],
                }}
                onClick={() => setMenuOpen(false)}
                className="mt-8 flex items-center justify-center gap-2 rounded-full border border-accent/60 bg-accent/15 px-6 py-4 text-base font-medium text-ink"
              >
                Download résumé <ArrowDownToLine className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
