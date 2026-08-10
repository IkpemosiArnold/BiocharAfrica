import manifest from "../lib/photo-manifest.json";

type PhotoKey = keyof typeof manifest;

/**
 * Field photography, served from pre-built AVIF/WebP derivatives.
 *
 * Hand-rolled <picture> rather than next/image because the source set is fixed,
 * generated at build time by scripts/build-images.mjs, and critically nothing
 * in it exceeds 1280px. next/image would happily request widths the
 * source cannot honour. Here the srcset only ever offers widths that exist.
 *
 * The LQIP is an inlined 20px WebP painted underneath, so the frame is never
 * empty on a slow Nigerian mobile connection.
 */
export default function Photo({
  name,
  alt,
  sizes = "100vw",
  priority = false,
  className = "",
  ratio,
}: {
  name: PhotoKey;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Override the intrinsic ratio when art-directed cropping via object-fit. */
  ratio?: string;
}) {
  const meta = manifest[name];
  if (!meta) throw new Error(`Unknown photo: ${name}`);

  const srcset = (ext: "avif" | "webp") =>
    meta.widths.map((w) => `/media/photos/${name}-${w}.${ext} ${w}w`).join(", ");

  const fallbackWidth = meta.widths[meta.widths.length - 1];

  return (
    <figure
      className={`photo ${className}`}
      style={{
        aspectRatio: ratio ?? `${meta.width} / ${meta.height}`,
        backgroundImage: `url(${meta.lqip})`,
      }}
    >
      <picture>
        <source type="image/avif" srcSet={srcset("avif")} sizes={sizes} />
        <source type="image/webp" srcSet={srcset("webp")} sizes={sizes} />
        <img
          src={`/media/photos/${name}-${fallbackWidth}.webp`}
          alt={alt}
          width={meta.width}
          height={meta.height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
        />
      </picture>
    </figure>
  );
}
