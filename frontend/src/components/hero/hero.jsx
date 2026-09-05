import { useEffect } from 'react';
import './hero.css';

const Hero = () => {
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    };

    const observerOptions = {
      threshold: 0.15,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elementsToAnimate = document.querySelectorAll('.scroll-reveal');

    elementsToAnimate.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero-container">
      {/* Background Video with Dark Overlay */}
      <div className="video-overlay"></div>
      <video className="hero-video" autoPlay loop muted playsInline>
        <source src="https://assets.mixkit.co/videos/preview/mixkit-tech-abstract-loop-42864-large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Main Content Container */}
      <div className="hero-content">
        
        {/* Left Column: Text Content */}
        <div className="hero-left">
          <div className="header-box scroll-reveal">
            <h1 className="hero-title">Putting your health first</h1>
            <p className="hero-subtitle">
              Modern, compassionate medical care tailored to you — from routine
              check-ups to specialist treatment.
            </p>
          </div>

          <div className="description-box scroll-reveal">
            <p className="business-description">
              General practice, cardiology, pediatrics and on-site laboratory
              testing — all under one roof. Our clinicians combine experience
              with modern digital tools to keep every consultation fast,
              clear and personal.
            </p>
          </div>
        </div>

        {/* Right Column: Stacked Card Animation & CTAs */}
        <div className="hero-right">
          <div className="cards-wrapper scroll-reveal">
            <div className="card card-1">
              <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=500" alt="Modern medical consultation" />
            </div>
            <div className="card card-2">
              <img src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=500" alt="On-site laboratory and diagnostics" />
            </div>
            <div className="card card-3">
              <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=500" alt="Specialist patient care" />
            </div>
          </div>

          <div className="cta-group scroll-reveal">
            <a href="#about" className="btn btn-secondary">About Us</a>
            <a href="#book" className="btn btn-primary">Book Now</a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;