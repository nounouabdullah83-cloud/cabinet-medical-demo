import './Footer.css'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner footer__inner--cols">
        <div className="footer__brand">
          <span className="footer__logo">CM</span>
          <p className="footer__tagline">
            Modern, compassionate medical care tailored to you — general
            practice, cardiology, pediatrics and on-site laboratory testing,
            all under one roof.
          </p>
        </div>

        <div className="footer__col">
          <h3 className="footer__heading">Clinic</h3>
          <ul className="footer__list">
            <li><a href="#about">About us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#location">Location</a></li>
            <li><a href="#book">Book a visit</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h3 className="footer__heading">Contact</h3>
          <ul className="footer__list">
            <li>
              <a href="https://www.google.com/maps/place/cabinet+l%27espoir/@35.174158,1.5035174,18.11z/data=!4m6!3m5!1s0x1287215a5c6d18c3:0x9131dd0f81f93447!8m2!3d35.1742349!4d1.5043973!16s%2Fg%2F11nvkr55sj?entry=ttu" target="_blank" rel="noopener noreferrer">
                Cabinet L&apos;Espoir · Tiaret
              </a>
            </li>
            <li><a href="tel:+21346000000">+213 (0) 46 00 00 00</a></li>
            <li><a href="mailto:contact@cabinet-espoir.dz">contact@cabinet-espoir.dz</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h3 className="footer__heading">Hours</h3>
          <ul className="footer__list footer__list--muted">
            <li>Mon – Fri · 8:30 AM – 6:00 PM</li>
            <li>Saturday · 9:00 AM – 4:00 PM</li>
            <li>Sunday · Closed</li>
          </ul>
        </div>
      </div>

      <div className="footer__bar">
        <div className="footer__inner footer__bar-inner">
          <p className="footer__copy">© {year} Cabinet L&apos;Espoir. All rights reserved.</p>
          <p className="footer__legal">Designed with care · Tiaret, Algeria</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer