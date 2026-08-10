import Link from "next/link";
import { COMPANY } from "../lib/content";

const COLUMNS = [
  {
    heading: "Site",
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/services", label: "Services" },
      { href: "/impact", label: "Impact" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Services",
    links: [
      { href: "/services#production", label: "Biochar Production" },
      { href: "/services#application", label: "Biochar Application" },
      { href: "/services#research", label: "Research & Development" },
      { href: "/services#consulting", label: "Consulting" },
      { href: "/services#briquettes", label: "Briquettes" },
      { href: "/services#training", label: "Training & Education" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      className="foot"
      data-ground="#0c0a08"
      data-ink="#ded8cd"
      data-ink-dim="#7d7568"
      data-rule="#241f19"
    >
      <div className="shell">
        <div className="foot__top">
          <p className="foot__statement">
            Carbon out of the sky,
            <br />
            into Nigerian soil,
            <br />
            <em>for a thousand years.</em>
          </p>

          <div className="foot__cols">
            {COLUMNS.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <h2 className="eyebrow foot__heading">
                  <span>{col.heading}</span>
                </h2>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h2 className="eyebrow foot__heading">
                <span>Contact</span>
              </h2>
              <address className="foot__address">
                {COMPANY.address}
                <br />
                {COMPANY.country}
                <br />
                <br />
                {COMPANY.phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/\s/g, "")}`}>
                    {p}
                  </a>
                ))}
                <a href={`mailto:${COMPANY.emails[0]}`}>{COMPANY.emails[0]}</a>
              </address>
            </div>
          </div>
        </div>

        <hr className="rule" />

        <div className="foot__base">
          <p className="tabular">
            © {new Date().getFullYear()} {COMPANY.legalName}
          </p>
          <p className="tabular foot__coords">9.03°N 5.80°E · Niger State</p>
        </div>
      </div>
    </footer>
  );
}
