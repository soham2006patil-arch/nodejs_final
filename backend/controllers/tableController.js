import Table from '../models/Table.js';
import Reservation from '../models/Reservation.js';

const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00`));
const validTime = (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

export async function getTables(req, res, next) {
  try { res.json({ success: true, data: { tables: await Table.find().sort({ tableNumber: 1 }) } }); } catch (error) { next(error); }
}
export async function getTable(req, res, next) {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ success: false, message: 'Table not found' });
    res.json({ success: true, data: { table } });
  } catch (error) { next(error); }
}
export async function createTable(req, res, next) {
  try {
    const { tableNumber, capacity, location } = req.body;
    if (!Number.isInteger(tableNumber) || tableNumber < 1 || !Number.isInteger(capacity) || capacity < 1 || !location?.trim()) return res.status(400).json({ success: false, message: 'Valid table number, capacity, and location are required' });
    const table = await Table.create({ tableNumber, capacity, location: location.trim() });
    res.status(201).json({ success: true, message: 'Table created', data: { table } });
  } catch (error) { next(error); }
}
export async function updateTable(req, res, next) {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!table) return res.status(404).json({ success: false, message: 'Table not found' });
    res.json({ success: true, message: 'Table updated', data: { table } });
  } catch (error) { next(error); }
}
export async function deleteTable(req, res, next) {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) return res.status(404).json({ success: false, message: 'Table not found' });
    res.json({ success: true, message: 'Table deleted' });
  } catch (error) { next(error); }
}
export async function getAvailableTables(req, res, next) {
  try {
    const { date, startTime, endTime, partySize } = req.query;
    if (!validDate(date) || !validTime(startTime) || !validTime(endTime) || startTime >= endTime || !Number.isInteger(Number(partySize)) || Number(partySize) < 1) return res.status(400).json({ success: false, message: 'Valid date, time range, and party size are required' });
    const booked = await Reservation.find({ reservationDate: date, status: 'confirmed', startTime: { $lt: endTime }, endTime: { $gt: startTime } }).distinct('table');
    const tables = await Table.find({ capacity: { $gte: Number(partySize) }, isAvailable: true, _id: { $nin: booked } }).sort({ tableNumber: 1 });
    res.json({ success: true, data: { tables } });
  } catch (error) { next(error); }
}
