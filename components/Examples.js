"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { EXAMPLES, LINKEDIN_URL, posterSrc, videoSrc } from "@/lib/examples";

// Keep in sync with the opacity transition of .ex-video in globals.css.
const FADE_MS = 700;
// The next example starts downloading this long before the current one ends,
// so that the cross-fade at the end has something to fade to.
const PRELOAD_NEXT_S = 8;
const COUNT = EXAMPLES.length;

function subscribeTheme(onChange) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function readTheme() {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

function serverTheme() {
  return null;
}

function ExampleVideo({
  index,
  theme,
  shown,
  preload,
  register,
  getStartTime,
  onProgress,
  onEnded,
}) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    // Autoplay needs the property; the attribute alone is not always applied.
    el.muted = true;
    return register(index, el);
  }, [index, register]);

  return (
    <video
      ref={ref}
      className={`ex-video${shown && ready ? " is-on" : ""}`}
      src={videoSrc(EXAMPLES[index].id, theme)}
      muted
      playsInline
      preload={preload}
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
      aria-hidden="true"
      onLoadedMetadata={(e) => {
        // Both themes share one timeline: after a theme switch, pick up where
        // the other file was.
        const el = e.currentTarget;
        const t = getStartTime(index);
        if (t > 0.3 && t < el.duration - 0.3) el.currentTime = t;
      }}
      onLoadedData={() => setReady(true)}
      onTimeUpdate={(e) => onProgress(index, e.currentTarget)}
      onEnded={() => onEnded(index)}
    />
  );
}

export default function Examples() {
  // null on the server and during hydration, then "dark" or "light".
  const theme = useSyncExternalStore(subscribeTheme, readTheme, serverTheme);
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState(null); // example fading out
  const [warm, setWarm] = useState(null); // example being preloaded
  const [near, setNear] = useState(false); // close to the viewport: load
  const [inView, setInView] = useState(false); // visible enough: play
  const [tabHidden, setTabHidden] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [needsTap, setNeedsTap] = useState(false); // no autoplay: wait for a click

  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const fillRef = useRef(null);
  const videos = useRef(new Map()); // example index -> its <video>
  const playhead = useRef({ index: 0, time: 0 });
  const leaveTimer = useRef(null);
  const drag = useRef(null);
  const swiped = useRef(false);

  const register = useCallback((index, el) => {
    videos.current.set(index, el);
    return () => {
      if (videos.current.get(index) === el) videos.current.delete(index);
    };
  }, []);

  const getStartTime = useCallback(
    (index) => (playhead.current.index === index ? playhead.current.time : 0),
    []
  );

  function select(index) {
    if (index === active) return;
    const incoming = videos.current.get(index);
    if (incoming && incoming.readyState > 0) incoming.currentTime = 0;
    playhead.current = { index, time: 0 };
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setLeaving(null), FADE_MS + 80);
    setLeaving(active);
    setWarm(null);
    setActive(index);
    setUserPaused(false);
  }

  function handleProgress(index, el) {
    if (index !== active) return;
    playhead.current = { index, time: el.currentTime };
    if (el.duration - el.currentTime < PRELOAD_NEXT_S) {
      setWarm((index + 1) % COUNT);
    }
  }

  function handleEnded(index) {
    if (index === active) select((active + 1) % COUNT);
  }

  // The stretched dot of the current example is also its seek bar: a click or
  // a drag along it moves through the video.
  function seek(event) {
    const video = videos.current.get(active);
    if (!video || !(video.duration > 0)) return;
    const bar = event.currentTarget.firstElementChild.getBoundingClientRect();
    const ratio = (event.clientX - bar.left) / bar.width;
    // Stop just short of the end, so the last picture shows before moving on.
    const time = Math.min(
      Math.max(0, ratio) * video.duration,
      video.duration - 0.3
    );
    video.currentTime = time;
    playhead.current = { index: active, time };
  }

  function toggle() {
    const video = videos.current.get(active);
    if (needsTap || userPaused || (video && video.paused)) {
      setNeedsTap(false);
      setUserPaused(false);
      // Called from the click itself, so it also works where autoplay is refused.
      video?.play().catch(() => {});
    } else {
      setUserPaused(true);
    }
  }

  // People who asked for less motion or less data start the videos themselves.
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion || navigator.connection?.saveData) setNeedsTap(true);
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setNear(true);
      setInView(true);
      return;
    }
    const nearObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          nearObserver.disconnect();
        }
      },
      { rootMargin: "800px 0px" }
    );
    nearObserver.observe(sectionRef.current);
    const viewObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setInView(entry.intersectionRatio >= 0.4);
      },
      { threshold: [0, 0.4, 0.8] }
    );
    viewObserver.observe(stageRef.current);
    return () => {
      nearObserver.disconnect();
      viewObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(leaveTimer.current);
    };
  }, []);

  // Only the active example plays, and only while it is on screen.
  useEffect(() => {
    for (const [index, el] of videos.current) {
      if (index !== active && !el.paused) el.pause();
    }
    const video = videos.current.get(active);
    if (!video) return;
    if (inView && !tabHidden && !userPaused && !needsTap) {
      video.play().catch((error) => {
        if (error?.name === "NotAllowedError") setNeedsTap(true);
      });
    } else if (!video.paused) {
      video.pause();
    }
  }, [theme, near, active, inView, tabHidden, userPaused, needsTap]);

  // The active dot fills up as its video plays.
  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const tick = () => {
      const video = videos.current.get(active);
      const fill = fillRef.current;
      if (fill) {
        const done =
          video && video.duration > 0 ? video.currentTime / video.duration : 0;
        fill.style.transform = `scaleX(${Math.min(1, done)})`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [theme, active, inView]);

  // Always in the same order: moving a <video> in the DOM would pause it and
  // cut its fade short.
  const mounted =
    near && theme
      ? EXAMPLES.map((_, index) => index).filter(
          (index) => index === active || index === leaving || index === warm
        )
      : [];
  const paused = needsTap || userPaused;
  const example = EXAMPLES[active];

  return (
    <section className="examples" id="exemples" ref={sectionRef}>
      <h2 className="visually-hidden">Exemples</h2>

      <a
        className="ex-linkedin"
        href={LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
          />
        </svg>
        <span>Retrouvez-nous sur LinkedIn</span>
      </a>

      <div
        className="ex-player"
        lang="en"
        role="group"
        aria-roledescription="carousel"
        aria-label="Examples"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") select((active + 1) % COUNT);
          else if (e.key === "ArrowLeft") select((active + COUNT - 1) % COUNT);
        }}
      >
        <div className="ex-stage" ref={stageRef}>
          <div className="ex-screen">
            <noscript>
              <img
                className="ex-poster"
                src={posterSrc(EXAMPLES[0].id, "dark")}
                alt={EXAMPLES[0].description}
              />
            </noscript>
            {needsTap && theme && (
              <img
                className="ex-poster"
                src={posterSrc(example.id, theme)}
                alt=""
              />
            )}
            {mounted.map((index) => (
              <ExampleVideo
                key={`${EXAMPLES[index].id}-${theme}`}
                index={index}
                theme={theme}
                shown={index === active}
                preload={
                  needsTap ? "none" : index === leaving ? "metadata" : "auto"
                }
                register={register}
                getStartTime={getStartTime}
                onProgress={handleProgress}
                onEnded={handleEnded}
              />
            ))}
          </div>
          <button
            type="button"
            className="ex-toggle"
            aria-label={paused ? "Play" : "Pause"}
            onPointerDown={(e) => {
              drag.current = { x: e.clientX, y: e.clientY };
            }}
            onPointerUp={(e) => {
              const start = drag.current;
              drag.current = null;
              if (!start) return;
              const dx = e.clientX - start.x;
              const dy = e.clientY - start.y;
              if (Math.abs(dx) > 48 && Math.abs(dx) > 1.5 * Math.abs(dy)) {
                // A horizontal swipe changes example; ignore the click it may end with.
                swiped.current = true;
                setTimeout(() => {
                  swiped.current = false;
                }, 350);
                select((active + (dx < 0 ? 1 : COUNT - 1)) % COUNT);
              }
            }}
            onClick={() => {
              if (swiped.current) {
                swiped.current = false;
                return;
              }
              toggle();
            }}
          >
            <span
              className={`ex-play${paused ? " is-on" : ""}`}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" focusable="false">
                <path fill="currentColor" d="M8.5 5.6v12.8L19 12z" />
              </svg>
            </span>
          </button>
        </div>

        <div className="ex-nav">
          <button
            type="button"
            className="ex-arrow"
            aria-label="Previous example"
            onClick={() => select((active + COUNT - 1) % COUNT)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M14.5 5.5 8 12l6.5 6.5" />
            </svg>
          </button>

          <div className="ex-dots">
            {EXAMPLES.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className="ex-dot"
                aria-label={`Example ${index + 1} of ${COUNT}: ${item.caption}`}
                aria-current={index === active ? "true" : undefined}
                onClick={() => select(index)}
                onPointerDown={(e) => {
                  if (index !== active || e.button !== 0) return;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  seek(e);
                }}
                onPointerMove={(e) => {
                  if (
                    index === active &&
                    e.currentTarget.hasPointerCapture(e.pointerId)
                  ) {
                    seek(e);
                  }
                }}
              >
                <span className="ex-dot-track">
                  <span
                    className="ex-dot-fill"
                    ref={index === active ? fillRef : undefined}
                  />
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="ex-arrow"
            aria-label="Next example"
            onClick={() => select((active + 1) % COUNT)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M9.5 5.5 16 12l-6.5 6.5" />
            </svg>
          </button>
        </div>

        <p className="ex-caption" key={example.id}>
          {example.caption}
          <span className="visually-hidden">. {example.description}</span>
        </p>
      </div>
    </section>
  );
}
