"use client";

import { useEffect, useRef, useState } from "react";

export type ClipName =
  | "broadcast-elder"
  | "broadcast-strawhat"
  | "broadcast-headwrap"
  | "broadcast-mountains"
  | "broadcast-braids"
  | "training-tiller";

/**
 * A framed window of field footage.
 *
 * The source is WhatsApp-compressed phone video, 576×1024 at best. It is
 * graded and grained at build time (scripts/build-video.sh) so its softness
 * reads as film texture, but that illusion only holds at moderate display size.
 * Hence the deliberate constraint: these panels are never full-bleed and never
 * scaled past their native width. Framing is what makes the footage look
 * intentional rather than merely low-resolution.
 *
 * Loading is strictly earn-your-place: preload="none" until the panel is
 * actually near the viewport, and the 384px encode on narrow screens. On a
 * metered Nigerian mobile plan, autoplaying six clips on load would be rude.
 */
export default function VideoPanel({
  clip,
  caption,
  place,
  className = "",
  eager = false,
}: {
  clip: ClipName;
  caption: string;
  /** Where it was shot. This footage has real provenance, so we cite it. */
  place?: string;
  className?: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(eager);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || armed) return;

    // Arm well before the panel is visible so the poster has been swapped for
    // moving footage by the time it is actually looked at.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  // Play only while on screen. A muted loop running off-screen still decodes
  // frames and still costs battery.
  useEffect(() => {
    const video = ref.current;
    if (!video || !armed) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay can still be refused; a visible poster is a fine outcome.
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [armed]);

  return (
    <div ref={wrapRef} className={`video-panel ${className}`}>
      <div className="video-panel__frame">
        <video
          ref={ref}
          poster={`/media/video/${clip}-poster.webp`}
          muted
          loop
          playsInline
          preload={armed ? "metadata" : "none"}
          aria-label={caption}
        >
          {armed && (
            <>
              {/* Narrow screens take the 384px encode, roughly half the bytes
                  of the 576, and indistinguishable at phone display sizes.
                  H.264 only: VP9 encoded LARGER than H.264 on this grainy phone
                  footage, so a WebM source would be dead weight, not a fallback. */}
              <source
                media="(max-width: 640px)"
                src={`/media/video/${clip}-384.mp4`}
                type="video/mp4"
              />
              <source src={`/media/video/${clip}-576.mp4`} type="video/mp4" />
            </>
          )}
        </video>
      </div>
      <figcaption className="video-panel__caption">
        <span>{caption}</span>
        {place && <span className="video-panel__place tabular">{place}</span>}
      </figcaption>
    </div>
  );
}
