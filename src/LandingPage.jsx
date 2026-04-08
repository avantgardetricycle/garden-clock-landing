import { useEffect, useMemo, useRef, useState } from "react";

const POLAR_LINK = "https://buy.polar.sh/YOUR_POLAR_LINK";
const LOGO_SRC = "/logo.png";
const FEATURE_VIDEO_SRC = "/garden_clock_feature_video.mp4";

const sceneTimes = [
  { hour: "3am", label: "3am - Deep night", bgClass: "ph-3am" },
  { hour: "5am", label: "5am - Pre-dawn", bgClass: "ph-5am" },
  { hour: "6am", label: "6am - First light", bgClass: "ph-6am" },
  { hour: "7am", label: "7am - Morning", bgClass: "ph-7am" },
  { hour: "8am", label: "8am - Morning light", bgClass: "ph-8am" },
  { hour: "9am", label: "9am - Mid-morning", bgClass: "ph-9am" },
  { hour: "11am", label: "11am - Late morning", bgClass: "ph-11am" },
  { hour: "12pm", label: "12pm - Full bloom", bgClass: "ph-12pm" },
  { hour: "2pm", label: "2pm - Afternoon", bgClass: "ph-2pm" },
  { hour: "4pm", label: "4pm - Golden light", bgClass: "ph-4pm" },
  { hour: "5pm", label: "5pm - Late afternoon", bgClass: "ph-5pm" },
  { hour: "6pm", label: "6pm - Golden hour", bgClass: "ph-6pm" },
  { hour: "7pm", label: "7pm - Sunset", bgClass: "ph-7pm" },
  { hour: "8pm", label: "8pm - Dusk", bgClass: "ph-8pm-night" },
  { hour: "9pm", label: "9pm - Twilight", bgClass: "ph-9pm-night" },
  { hour: "10pm", label: "10pm - Night", bgClass: "ph-10pm" },
  { hour: "11pm", label: "11pm - Deep night", bgClass: "ph-11pm-night" },
];

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
  const [activeHour, setActiveHour] = useState(initialScene?.hour ?? sceneTimes[0].hour);
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

  const activeScene = useMemo(
    () => sceneTimes.find((scene) => scene.hour === activeHour) ?? sceneTimes[0],
    [activeHour]
  );

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
          <li>
            <a href={POLAR_LINK} className="nav-buy">
              Buy - $19
            </a>
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
          <div className="hero-actions">
            <a href={POLAR_LINK} className="btn-primary">
              Buy for macOS
            </a>
            <span className="btn-price">$19 - one-time purchase</span>
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
                onClick={() => setActiveHour(scene.hour)}
              >
                {scene.hour}
              </button>
              {index !== sceneTimes.length - 1 && <div className="times-divider" aria-hidden="true"></div>}
            </div>
          ))}
        </div>

        <div className="scene-display">
          <div className="scene-image-wrap">
            <div className={`screenshot-placeholder ${activeScene.bgClass}`} role="img" aria-label={activeScene.label}>
              {activeScene.label}
            </div>
          </div>
          <div className="scene-meta">
            <span className="scene-label-text">{activeScene.label}</span>
            <span className="scene-of">of 24 scenes</span>
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
        <div>
          <a href={POLAR_LINK} className="btn-primary cta-btn">
            Buy Garden Clock - $19
          </a>
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
            <a href="https://x.com/YOUR_HANDLE">X / Twitter</a>
          </li>
          <li>
            <a href="mailto:hello@gardenclock.app">Contact</a>
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
