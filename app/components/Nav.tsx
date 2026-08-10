"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/impact", label: "Impact" },
];

/**
 * The nav inherits --ink from the section behind it, so it stays legible as the
 * page migrates from carbon black through paper white to acid green without
 * needing per-section overrides or a scrim.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Hide going down, reveal going up, but never hide within the first
      // screen, where hiding just looks like a bug.
      setHidden(y > 220 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A menu that stays open behind a route change is a classic mobile bug.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`nav ${hidden && !open ? "nav--hidden" : ""}`}>
      <div className="nav__inner shell">
        <Link href="/" className="nav__mark" onClick={() => setOpen(false)}>
          <span className="nav__glyph" aria-hidden="true">
            {/* Carbon going into ground: a filled half turning to green. The
                brand's own recycling-arrow lockup lives on the letterhead; this
                is its reduction to a single 20px mark. */}
            <svg viewBox="0 0 24 24" width="22" height="22">
              <circle cx="12" cy="12" r="10.5" className="glyph-ring" />
              <path d="M12 1.5a10.5 10.5 0 0 1 0 21z" className="glyph-fill" />
              <path
                d="M12 16.5v-6M12 10.5c0-2 1.6-3.4 3.4-3.4 0 2-1.5 3.4-3.4 3.4ZM12 12.4c0-1.7-1.4-2.9-2.9-2.9 0 1.7 1.3 2.9 2.9 2.9Z"
                className="glyph-sprout"
              />
            </svg>
          </span>
          <span className="nav__word">
            Biochar Solutions <span className="nav__word-dim">Africa</span>
          </span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="nav__cta">
            Talk to us
          </Link>
        </nav>

        <button
          className="nav__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="nav-drawer"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div id="nav-drawer" className={`nav__drawer ${open ? "is-open" : ""}`}>
        {[...LINKS, { href: "/contact", label: "Contact" }].map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            style={{ transitionDelay: `${60 + i * 45}ms` }}
          >
            <span className="tabular nav__drawer-num">
              0{i + 1}
            </span>
            {l.label}
          </Link>
        ))}
        <p className="nav__drawer-foot">
          27 Ali Baba Crescent, Jabi
          <br />
          Abuja, Nigeria
        </p>
      </div>
    </header>
  );
}
