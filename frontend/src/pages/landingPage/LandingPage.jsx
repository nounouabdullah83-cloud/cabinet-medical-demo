import Hero from '../../components/hero/hero'
import AboutUs from '../../components/aboutus/aboutus'
import Services from '../../components/services/Services'
import BookingForm from '../../components/booking/BookingForm'
import './LandingPage.css'

function LandingPage() {
  return (
    <div className="landing">
      <Hero />
      <AboutUs />
      <Services />

      <section id="book" className="cta">
        <div className="cta__glow" aria-hidden="true" />
        <div className="cta__info">
          <span className="cta__eyebrow">Online booking</span>
          <h2>Ready to see us?</h2>
          <p>Book your visit online in under a minute. Choose your service, pick a slot that suits you, and we&apos;ll take care of the rest.</p>
          <ul className="cta__points">
            <li>Confirm your appointment instantly</li>
            <li>Choose the service you need</li>
            <li>No phone calls, no waiting</li>
          </ul>
        </div>
        <BookingForm />
      </section>
    </div>
  )
}

export default LandingPage
