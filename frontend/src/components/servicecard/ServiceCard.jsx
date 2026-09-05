import { Link } from 'react-router-dom'
import './ServiceCard.css'

function ServiceCard({ service, index = 0 }) {
  return (
    <article className="service-card" data-index={index}>
      {service.image && (
        <img
          className="service-card__image"
          src={service.image}
          alt={service.title}
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="service-card__body">
        <h3 className="service-card__title">{service.title}</h3>
        <p className="service-card__description">{service.description}</p>
        <div className="service-card__footer">
          <span className="service-card__price">{service.price} DH</span>
          <Link
            to={`/services/${service.id}`}
            className="service-card__details"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  )
}

export default ServiceCard