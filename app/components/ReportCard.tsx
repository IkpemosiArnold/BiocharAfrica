import { REPORT } from "../lib/content";

/**
 * The 2024 report, offered as a download.
 *
 * Deliberately a link, not an embedded viewer. The file is 6.6MB, and a large
 * share of this audience is on metered mobile data in Nigeria; an inline PDF
 * viewer would pull all of it down whether or not anyone wanted to read it.
 * Size, page count and format are stated on the button itself so the cost is
 * visible before the tap, not after.
 */
export default function ReportCard() {
  return (
    <div className="report" data-reveal>
      <div className="report__text">
        <p className="eyebrow">
          <span>{REPORT.year}</span>
          <span className="rule-dash" />
          <span>Report</span>
        </p>
        <h3 className="report__title">{REPORT.title}</h3>
        <p className="report__lede">{REPORT.summary}</p>
      </div>

      <div className="report__action">
        <a
          className="btn btn--solid"
          href={REPORT.file}
          download
          /* Same-origin, but noopener costs nothing and target=_blank without
             it is a long-standing footgun. */
          rel="noopener"
        >
          Download the report
        </a>
        <p className="report__meta tabular">
          PDF · {REPORT.pages} pages · {REPORT.size}
        </p>
      </div>
    </div>
  );
}
