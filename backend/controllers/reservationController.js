import Reservation from '../models/Reservation.js';
import Table from '../models/Table.js';

const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00`));
const validTime = (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
const reservationQuery = (date) => date ? { reservationDate: date } : {};

export async function createReservation(req, res, next) {
  try {
    const { table: tableId, reservationDate, startTime, endTime, partySize } = req.body;
    const size = Number(partySize);
    if (!validDate(reservationDate) || !validTime(startTime) || !validTime(endTime) || startTime >= endTime || !Number.isInteger(size) || size <= 0) return res.status(400).json({ success: false, message: 'Valid date, time range, and positive party size are required' });
    const today = new Date().toISOString().slice(0, 10);
    if (reservationDate < today) return res.status(400).json({ success: false, message: 'Reservation date cannot be in the past' });
    const table = await Table.findById(tableId);
    if (!table || !table.isAvailable) return res.status(404).json({ success: false, message: 'Available table not found' });
    if (size > table.capacity) return res.status(400).json({ success: false, message: 'Party size exceeds table capacity' });
    const conflict = await Reservation.findOne({ table: tableId, reservationDate, status: 'confirmed', startTime: { $lt: endTime }, endTime: { $gt: startTime } });
    if (conflict) return res.status(409).json({ success: false, message: 'Table is already reserved during this time slot' });
    const reservation = await Reservation.create({ customer: req.user.userId, table: tableId, reservationDate, startTime, endTime, partySize: size });
    await reservation.populate([{ path: 'customer', select: 'name email' }, { path: 'table', select: 'tableNumber capacity location' }]);
    res.status(201).json({ success: true, message: 'Reservation confirmed', data: { reservation } });
  } catch (error) { next(error); }
}

export async function getMyReservations(req, res, next) {
  try {
    const reservations = await Reservation.find({ customer: req.user.userId }).populate('table', 'tableNumber capacity location').sort({ reservationDate: -1, startTime: 1 });
    res.json({ success: true, data: { reservations } });
  } catch (error) { next(error); }
}

export async function getReservations(req, res, next) {
  try {
    const reservations = await Reservation.find(reservationQuery(req.query.date)).populate('customer', 'name email').populate('table', 'tableNumber capacity location').sort({ reservationDate: 1, startTime: 1 });
    res.json({ success: true, data: { reservations } });
  } catch (error) { next(error); }
}

export async function cancelReservation(req, res, next) {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });
    if (req.user.role !== 'admin' && reservation.customer.toString() !== req.user.userId) return res.status(403).json({ success: false, message: 'You can only cancel your own reservations' });
    reservation.status = 'cancelled';
    await reservation.save();
    res.json({ success: true, message: 'Reservation cancelled', data: { reservation } });
  } catch (error) { next(error); }
}
