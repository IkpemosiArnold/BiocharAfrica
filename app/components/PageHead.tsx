import GroundShift from "./GroundShift";

/**
 * Interior page masthead. Interior pages do not repeat the home page's seven-act
 * colour migration; they open on carbon and stay there, so the migration reads
 * as something the home page does rather than a site-wide gimmick.
 */
export default function PageHead({
  index,
  label,
  title,
  lede,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  lede?: string;
}) {
  return (
    <>
      <GroundShift />
      <header
        className="phead"
        data-ground="#100e0b"
        data-ink="#ece7dd"
        data-ink-dim="#8d857a"
        data-rule="#2b261f"
      >
        <div className="shell">
          <p className="eyebrow phead__eyebrow" data-reveal>
            <span>{index}</span>
            <span className="rule-dash" />
            <span>{label}</span>
          </p>
          <h1 className="phead__title" data-reveal>
            {title}
          </h1>
          {lede && (
            <p className="phead__lede measure-wide" data-reveal data-reveal-delay="120">
              {lede}
            </p>
          )}
        </div>
      </header>
    </>
  );
}
