import BookingForm from '../../../components/booking/BookingForm'
import './AddBookingManual.css'

function AddBookingManual() {
  return (
    <div className="addbooking">
      <div className="addbooking__head">
        <h2 className="addbooking__title">Add booking manually</h2>
        <p className="addbooking__sub">Fill in the details to register a booking for a patient.</p>
      </div>
      <BookingForm />
    </div>
  )
}

export default AddBookingManual
