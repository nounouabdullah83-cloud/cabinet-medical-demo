import { useEffect, useState } from 'react'
import { getBookings } from '../api/BookingService'
import { getServices } from '../api/ServicesService'
import { getBookingStatusMap, saveStatsSnapshot, BOOKING_STATUS } from '../utils/bookingStatus'

const WEEKS = 8
const WEEK_MS = 604800000

function startOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day + 6) % 7
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - diff)
  return d
}

function buildWeeklyBuckets() {
  const now = new Date()
  const buckets = []
  for (let i = WEEKS - 1; i >= 0; i--) {
    const start = startOfWeek(now)
    start.setTime(start.getTime() - i * WEEK_MS)
    const end = new Date(start.getTime() + WEEK_MS)
    buckets.push({
      key: start.toISOString().slice(0, 10),
      start,
      end,
      label: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      done: 0,
      cancelled: 0,
    })
  }
  return buckets
}

async function fetchAllBookings() {
  const all = []
  let page = 1
  for (;;) {
    const data = await getBookings(page)
    const results = data.results || []
    all.push(...results)
    const total = data.count || all.length
    const pages = Math.max(1, Math.ceil(total / 10))
    if (page >= pages || all.length >= total) break
    page += 1
  }
  return all
}

export function useDashboardData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let active = true
    const run = async () => {
      try {
        const [bookings, services] = await Promise.all([
          fetchAllBookings(),
          getServices(),
        ])

        const serviceById = {}
        services.forEach((s) => {
          serviceById[s.id] = { title: s.title, price: Number(s.price) || 0 }
        })

        const statusMap = getBookingStatusMap()

        const priceFor = (b) => {
          const svc = serviceById[b.service]
          if (svc) return svc.price
          const direct = services.find((s) => s.title === b.service_title)
          return direct ? Number(direct.price) || 0 : 0
        }

        const buckets = buildWeeklyBuckets()
        const serviceStats = {}

        let total = 0
        let done = 0
        let cancelled = 0
        let earned = 0
        let lost = 0

        bookings.forEach((booking) => {
          const price = priceFor(booking)
          const status = statusMap[booking.id] || BOOKING_STATUS.PENDING
          total += 1
          if (status === BOOKING_STATUS.DONE) {
            done += 1
            earned += price
          } else if (status === BOOKING_STATUS.CANCELLED) {
            cancelled += 1
            lost += price
          }

          const bookingDate = booking.created_at ? new Date(booking.created_at) : new Date()
          const bucket = buckets.find(
            (b) => bookingDate >= b.start && bookingDate < b.end
          )
          if (bucket) {
            if (status === BOOKING_STATUS.DONE) bucket.done += price
            else if (status === BOOKING_STATUS.CANCELLED) bucket.cancelled += price
          }

          const key = booking.service_title || 'Other'
          if (!serviceStats[key]) {
            serviceStats[key] = { title: key, count: 0, revenue: 0 }
          }
          serviceStats[key].count += 1
          serviceStats[key].revenue += price
        })

        const serviceDonut = Object.values(serviceStats).sort((a, b) => b.revenue - a.revenue)

        if (active) {
          const computedData = {
            totals: { total, done, cancelled, pending: total - done - cancelled },
            revenue: { earned, lost, booked: earned + lost },
            weekly: buckets,
            services: serviceDonut,
          }
          setData(computedData)
          saveStatsSnapshot(computedData)
        }
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => {
      active = false
    }
  }, [tick])

  const reload = () => {
    setLoading(true)
    setError('')
    setTick((t) => t + 1)
  }

  return { data, loading, error, reload }
}
