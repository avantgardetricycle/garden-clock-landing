import { useEffect, useMemo, useRef, useState } from "react";

const LOGO_SRC = "/logo.png";
const FEATURE_VIDEO_SRC = "/garden_clock_feature_video.mp4";

const sceneDefs = [
  ["12am", "12am · Midnight"],
  ["1am", "1am · Late night"],
  ["2am", "2am · Quiet hours"],
  ["3am", "3am · Deep night"],
  ["4am", "4am · Before dawn"],
  ["5am", "5am · Pre-dawn"],
  ["6am", "6am · First light"],
  ["7am", "7am · Morning"],
  ["8am", "8am · Morning light"],
  ["9am", "9am · Mid-morning"],
  ["10am", "10am · Late morning"],
  ["11am", "11am · Before noon"],
  ["12pm", "12pm · Full bloom"],
  ["1pm", "1pm · Early afternoon"],
  ["2pm", "2pm · Afternoon"],
  ["3pm", "3pm · Mid-afternoon"],
  ["4pm", "4pm · Golden light"],
  ["5pm", "5pm · Late afternoon"],
  ["6pm", "6pm · Golden hour"],
  ["7pm", "7pm · Sunset"],
  ["8pm", "8pm · Dusk"],
  ["9pm", "9pm · Twilight"],
  ["10pm", "10pm · Night"],
  ["11pm", "11pm · Deep night"],
];

const sceneTimes = sceneDefs.map(([hour, label]) => ({
  hour,
  label,
  imageSrc: `/${hour}.png`,
}));

/** Scene index 1–24 for labels: 2am = 1 … 1am = 24 (screensaver hour order). */
const SCENE_COUNT_ORDER = [
  "2am",
  "3am",
  "4am",
  "5am",
  "6am",
  "7am",
  "8am",
  "9am",
  "10am",
  "11am",
  "12pm",
  "1pm",
  "2pm",
  "3pm",
  "4pm",
  "5pm",
  "6pm",
  "7pm",
  "8pm",
  "9pm",
  "10pm",
  "11pm",
  "12am",
  "1am",
];

function sceneNumberForHour(hour) {
  const i = SCENE_COUNT_ORDER.indexOf(hour);
  return i >= 0 ? i + 1 : 1;
}

const features = [
  {
    number: "01",
    title: "Time-aware scenes",
    body: "24 hand-crafted images - one for every hour. The garden follows your local time so the mood always matches the moment.",
  },
  {
    number: "02",
    title: "Continuous crossfade",
    body: "Scenes blend gradually across the full hour. The transition is always in motion and never feels abrupt.",
  },
  {
    number: "03",
    title: "Precision clock",
    body: "An analog clock design with configurable hand styles and smooth motion, tuned to match the painterly aesthetic.",
  },
  {
    number: "04",
    title: "OLED safe",
    body: "Built-in burn-in protection subtly drifts the composition over time for long-running display safety.",
  },
  {
    number: "05",
    title: "Apple Silicon native",
    body: "Optimized for M-series Macs with low system usage, so it stays beautiful without getting in the way.",
  },
  {
    number: "06",
    title: "One-time purchase",
    body: "Buy once, own forever. No subscription, no account lock-in, and future updates included.",
  },
];

export default function LandingPage() {
  const initialScene = sceneTimes.find((scene) => scene.hour === "7pm");
  const initialSrc = initialScene?.imageSrc ?? sceneTimes[0].imageSrc;
  const [activeHour, setActiveHour] = useState(initialScene?.hour ?? sceneTimes[0].hour);
  const [galleryBaseSrc, setGalleryBaseSrc] = useState(initialSrc);
  const [galleryOverlaySrc, setGalleryOverlaySrc] = useState(initialSrc);
  const [galleryBlend, setGalleryBlend] = useState(false);
  const [galleryNoTransition, setGalleryNoTransition] = useState(false);
  const [galleryBusy, setGalleryBusy] = useState(false);
  const [overlayNonce, setOverlayNonce] = useState(0);
  const galleryOverlayNonceRef = useRef(0);
  const galleryTransitionEndedRef = useRef(false);
  const galleryBlendRef = useRef(false);
  const galleryBaseImgRef = useRef(null);
  const galleryBaseSrcRef = useRef(initialSrc);
  const galleryCommittedSrcRef = useRef(initialSrc);
  const [videoMuted, setVideoMuted] = useState(false);
  const featureVideoRef = useRef(null);

  useEffect(() => {
    const el = featureVideoRef.current;
    if (!el) return;
    el.play().catch(() => {
      setVideoMuted(true);
    });
  }, []);

  useEffect(() => {
    const el = featureVideoRef.current;
    if (!el || !videoMuted) return;
    el.play().catch(() => {});
  }, [videoMuted]);

  useEffect(() => {
    galleryBaseSrcRef.current = galleryBaseSrc;
  }, [galleryBaseSrc]);

  const activeScene = useMemo(
    () => sceneTimes.find((scene) => scene.hour === activeHour) ?? sceneTimes[0],
    [activeHour]
  );

  function selectSceneHour(hour) {
    if (hour === activeHour || galleryBusy) return;
    const nextSrc = sceneTimes.find((s) => s.hour === hour)?.imageSrc;
    if (!nextSrc) return;
    setGalleryBusy(true);
    setActiveHour(hour);
    galleryOverlayNonceRef.current += 1;
    setOverlayNonce(galleryOverlayNonceRef.current);
    galleryBlendRef.current = false;
    setGalleryBlend(false);
    setGalleryOverlaySrc(nextSrc);
  }

  function onGalleryOverlayLoad(e) {
    const img = e.currentTarget;
    if (Number(img.dataset.nonce) !== galleryOverlayNonceRef.current) return;
    const baseEl = galleryBaseImgRef.current;
    if (baseEl) {
      try {
        const a = new URL(img.currentSrc, window.location.href).pathname;
        const b = new URL(baseEl.currentSrc, window.location.href).pathname;
        if (a === b) return;
      } catch {
        /* ignore */
      }
    }
    galleryCommittedSrcRef.current = img.currentSrc;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        galleryBlendRef.current = true;
        setGalleryBlend(true);
      });
    });
  }

  function onGalleryOverlayError() {
    setGalleryBusy(false);
    galleryBlendRef.current = false;
    setGalleryBlend(false);
    setGalleryNoTransition(false);
    setGalleryOverlaySrc(galleryBaseSrcRef.current);
    const path = galleryBaseSrcRef.current;
    const hourMatch = path.match(/\/([^/]+)\.png$/i);
    const hour = hourMatch ? hourMatch[1] : null;
    if (hour && sceneTimes.some((s) => s.hour === hour)) {
      setActiveHour(hour);
    }
  }

  function onGalleryTransitionEnd(e) {
    if (e.propertyName !== "opacity") return;
    if (!e.target.classList.contains("scene-gallery-overlay")) return;
    if (!galleryBlendRef.current || galleryTransitionEndedRef.current) return;
    galleryTransitionEndedRef.current = true;
    let path = "";
    try {
      path = new URL(galleryCommittedSrcRef.current, window.location.href).pathname;
    } catch {
      path = galleryCommittedSrcRef.current;
    }
    setGalleryNoTransition(true);
    galleryBlendRef.current = false;
    setGalleryBlend(false);
    setGalleryBaseSrc(path);
    setGalleryOverlaySrc(path);
    setGalleryBusy(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setGalleryNoTransition(false);
      });
    });
    queueMicrotask(() => {
      galleryTransitionEndedRef.current = false;
    });
  }

  return (
    <>
      <nav>
        <a href="#" className="nav-logo">
          <img src={LOGO_SRC} alt="" className="logo-img logo-img-nav" width={36} height={36} />
          Garden Clock
        </a>
        <ul className="nav-links">
          <li>
            <a href="#scenes">Scenes</a>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#specs">Details</a>
          </li>
          <li className="nav-buy-item">
            <button type="button" disabled className="nav-buy">
              Buy - $19
            </button>
            <p className="buy-coming-soon buy-coming-soon--nav">
              <em>Coming soon!</em>
            </p>
          </li>
        </ul>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <img
            src={LOGO_SRC}
            alt="Garden Clock logo"
            className="logo-img logo-img-hero"
            width={120}
            height={120}
          />
          <p className="hero-eyebrow">A macOS Screensaver</p>
          <h1 className="hero-title">
            Garden
            <br />
            <em>Clock</em>
          </h1>
          <p className="hero-subtitle">
            A living garden that changes with every hour of the day. From moonlit midnight to golden dusk -
            always in motion, always in time.
          </p>
          <div className="hero-buy-block">
            <div className="hero-actions">
              <button type="button" disabled className="btn-primary">
                Buy for macOS
              </button>
              <span className="btn-price">$19 - one-time purchase</span>
            </div>
            <p className="buy-coming-soon">
              <em>Coming soon!</em>
            </p>
          </div>
        </div>

        <div className="video-section">
          <div className="video-frame">
            <video
              ref={featureVideoRef}
              className="feature-video"
              autoPlay
              muted={videoMuted}
              loop
              playsInline
              aria-label="Garden Clock screensaver demo"
            >
              <source src={FEATURE_VIDEO_SRC} type="video/mp4" />
            </video>
            <button
              type="button"
              className="video-sound-toggle"
              onClick={() => setVideoMuted((m) => !m)}
              aria-pressed={videoMuted}
              aria-label={videoMuted ? "Unmute demo video" : "Mute demo video"}
            >
              <span className="video-sound-toggle-icon" aria-hidden="true">
                {videoMuted ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <line x1="22" y1="9" x2="16" y2="15" />
                    <line x1="16" y1="9" x2="22" y2="15" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M15.54 8.46a5 5 0 010 7.07" />
                    <path d="M19.07 4.93a10 10 0 010 14.14" />
                  </svg>
                )}
              </span>
              <span className="video-sound-toggle-label">{videoMuted ? "Sound off" : "Sound on"}</span>
            </button>
          </div>
          <p className="video-caption">24 hand-crafted scenes - Real-time clock - Continuous crossfade</p>
        </div>
      </section>

      <section className="scene-switcher" id="scenes">
        <div className="section-header section-header-scenes">
          <span className="section-label">24 Scenes</span>
          <div className="gold-rule"></div>
          <h2 className="section-title">
            Every hour,
            <br />a different <em>world</em>
          </h2>
          <p className="section-body">
            From the stillness of 3am to golden hour, Garden Clock reflects the true passage of time through a
            window into a living garden.
          </p>
        </div>

        <div className="times-strip">
          {sceneTimes.map((scene, index) => (
            <div key={scene.hour} className="time-slot">
              <button
                type="button"
                className={`time-btn${activeHour === scene.hour ? " active" : ""}`}
                onClick={() => selectSceneHour(scene.hour)}
              >
                {scene.hour}
              </button>
              {index !== sceneTimes.length - 1 && <div className="times-divider" aria-hidden="true"></div>}
            </div>
          ))}
        </div>

        <div className="scene-display">
          <div
            className={`scene-image-wrap${galleryBlend ? " gallery-blending" : ""}${galleryNoTransition ? " gallery-no-transition" : ""}`}
          >
            <img
              ref={galleryBaseImgRef}
              className="scene-gallery-layer scene-gallery-base"
              src={galleryBaseSrc}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              width={1920}
              height={1080}
              draggable={false}
            />
            <img
              className="scene-gallery-layer scene-gallery-overlay"
              src={galleryOverlaySrc}
              alt={`Garden Clock at ${activeScene.hour}`}
              data-nonce={overlayNonce}
              loading="eager"
              decoding="async"
              width={1920}
              height={1080}
              draggable={false}
              onLoad={onGalleryOverlayLoad}
              onError={onGalleryOverlayError}
              onTransitionEnd={onGalleryTransitionEnd}
            />
          </div>
          <div className="scene-meta">
            <span className="scene-label-text">{activeScene.label}</span>
            <span className="scene-of">{sceneNumberForHour(activeScene.hour)} of 24 scenes</span>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="features-inner">
          <div className="section-header">
            <span className="section-label section-label-light">Crafted for Mac</span>
            <div className="gold-rule"></div>
            <h2 className="section-title section-title-light">
              Built with <em>intention</em>
            </h2>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <div className="feature" key={feature.number}>
                <p className="feature-number">{feature.number}</p>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-body">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="specs" id="specs">
        <div className="section-header">
          <span className="section-label">Details</span>
          <div className="gold-rule"></div>
          <h2 className="section-title">
            The <em>particulars</em>
          </h2>
        </div>

        <div className="specs-grid">
          <div className="spec-item">
            <p className="spec-label">Compatibility</p>
            <p className="spec-value">macOS 13 Ventura or later</p>
          </div>
          <div className="spec-item">
            <p className="spec-label">Architecture</p>
            <p className="spec-value">Apple Silicon + Intel</p>
          </div>
          <div className="spec-item">
            <p className="spec-label">Scenes</p>
            <p className="spec-value">24 hand-crafted images</p>
          </div>
          <div className="spec-item">
            <p className="spec-label">Clock hands</p>
            <p className="spec-value">Spade, Tapered, Skeleton</p>
          </div>
          <div className="spec-item">
            <p className="spec-label">Crossfade duration</p>
            <p className="spec-value">Continuous - 60-minute cycle</p>
          </div>
          <div className="spec-item">
            <p className="spec-label">Burn-in protection</p>
            <p className="spec-value">Always on - OLED safe</p>
          </div>
          <div className="spec-item">
            <p className="spec-label">Price</p>
            <p className="spec-value">$19 - One-time</p>
          </div>
          <div className="spec-item">
            <p className="spec-label">Updates</p>
            <p className="spec-value">Free forever</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="testimonials-inner">
          <div className="section-header">
            <span className="section-label">Early impressions</span>
            <div className="gold-rule"></div>
            <h2 className="section-title">
              They <em>feel</em> it
            </h2>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial">
              <p className="testimonial-quote">
                "I caught myself just watching it. Forgot I was supposed to be working."
              </p>
              <p className="testimonial-author">- Early tester</p>
            </div>
            <div className="testimonial">
              <p className="testimonial-quote">"The 3am moonlit garden is something else."</p>
              <p className="testimonial-author">- Beta user</p>
            </div>
            <div className="testimonial">
              <p className="testimonial-quote">"Finally a screensaver worth paying for. The crossfade is hypnotic."</p>
              <p className="testimonial-author">- Beta user</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2 className="cta-title">
          Your screen deserves
          <br />
          something <em>alive</em>
        </h2>
        <p className="cta-sub">One-time purchase. Free updates. Instant download.</p>
        <div className="cta-buy-block">
          <button type="button" disabled className="btn-primary cta-btn">
            Buy Garden Clock - $19
          </button>
          <p className="buy-coming-soon">
            <em>Coming soon!</em>
          </p>
        </div>
        <div className="cta-details">
          <span className="cta-detail">
            <span className="cta-dot"></span> macOS 13+
          </span>
          <span className="cta-detail">
            <span className="cta-dot"></span> Apple Silicon & Intel
          </span>
          <span className="cta-detail">
            <span className="cta-dot"></span> OLED safe
          </span>
          <span className="cta-detail">
            <span className="cta-dot"></span> Free updates
          </span>
        </div>
      </section>

      <footer>
        <span className="footer-logo">
          <img src={LOGO_SRC} alt="" className="logo-img logo-img-footer" width={28} height={28} />
          Garden Clock
        </span>
        <ul className="footer-links">
          <li>
            <a href="https://x.com/garden_clock">X / Twitter</a>
          </li>
          <li>
            <a href="mailto:hello@gardenclock.xyz">Contact</a>
          </li>
          <li>
            <a href="/privacy">Privacy</a>
          </li>
        </ul>
        <span className="footer-copy">Copyright 2026 Garden Clock</span>
      </footer>
    </>
  );
}
