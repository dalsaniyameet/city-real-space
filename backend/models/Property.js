const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, default: '' },
  description: { type: String, default: '' },
  price:       { type: Number, required: true },
  priceLabel:  { type: String, default: '' }, // e.g. "₹1.2 Cr"
  type:        { type: String, enum: ['apartment', 'villa', 'plot', 'office', 'shop', 'showroom', 'warehouse', 'rowhouse', 'bungalow', 'factory', 'coworking', 'industrial_land'], required: true },
  category:    { type: String, enum: ['residential', 'commercial'], default: 'residential' },
  status:      { type: String, enum: ['for-sale', 'for-rent', 'new-launch', 'sold', 'rented'], default: 'for-sale' },
  location: {
    area:    { type: String, required: true },
    city:    { type: String, default: 'Ahmedabad' },
    state:   { type: String, default: 'Gujarat' },
    pincode: { type: String, default: '' },
    lat:     { type: Number, default: null },
    lng:     { type: Number, default: null }
  },
  specs: {
    beds:  { type: Number, default: 0 },
    baths: { type: Number, default: 0 },
    sqft:  { type: Number, default: 0 },
    floors:{ type: Number, default: 1 }
  },
  images:    [{ type: String }],
  amenities: [{ type: String }],
  extraDetails: {
    // Basic
    balconies:    { type: Number, default: 0 },
    floor:        { type: String, default: '' },
    totalFloors:  { type: String, default: '' },
    furnished:    { type: String, default: '' },
    possession:   { type: String, default: 'Ready to Move' },
    project:      { type: String, default: '' },
    tokenAmount:  { type: String, default: '' },
    postedAs:     { type: String, default: '' },
    subArea:      { type: String, default: '' },
    // Residential
    beds:         { type: String, default: '' },
    baths:        { type: String, default: '' },
    carpetArea:   { type: Number, default: 0 },
    superBuiltUp: { type: Number, default: 0 },
    facing:       { type: String, default: '' },
    ownership:    { type: String, default: '' },
    ageOfProperty:{ type: String, default: '' },
    lift:         { type: String, default: '' },
    coveredParking: { type: String, default: '0' },
    openParking:    { type: String, default: '0' },
    // Amenities
    security:     { type: String, default: '' },
    cctv:         { type: String, default: '' },
    waterSupply:  { type: String, default: '' },
    powerBackup:  { type: String, default: '' },
    garden:       { type: String, default: '' },
    gymPool:      { type: String, default: '' },
    // Rent
    availFrom:    { type: String, default: '' },
    suitableFor:  { type: String, default: '' },
    lockIn:       { type: String, default: '' },
    noticePeriod: { type: String, default: '' },
    brokerage:    { type: String, default: '' },
    maintenance_rent: { type: Number, default: 0 },
    rentIncrease: { type: String, default: '' },
    // Sell pricing
    allInclusive:     { type: String, default: '' },
    negotiable:       { type: String, default: '' },
    taxCharges:       { type: String, default: '' },
    bookingAmount:    { type: Number, default: 0 },
    maintenance:      { type: Number, default: 0 },
    annualDues:       { type: Number, default: 0 },
    membershipCharge: { type: Number, default: 0 },
    reraNo:           { type: String, default: '' },
    deposit:          { type: String, default: '' },
    availDate:        { type: String, default: '' },
    // Commercial
    commLiftPassenger: { type: Number, default: 0 },
    commLiftService:   { type: Number, default: 0 },
    commLiftCommon:    { type: Number, default: 0 },
    commTotalFloors:   { type: String, default: '' },
    commYourFloor:     { type: String, default: '' },
    commParking:       { type: String, default: '' },
    // Office
    oCarpet:       { type: Number, default: 0 },
    oSBA:          { type: Number, default: 0 },
    oCabins:       { type: Number, default: 0 },
    oMinSeats:     { type: Number, default: 0 },
    oMaxSeats:     { type: Number, default: 0 },
    oWorkstations: { type: Number, default: 0 },
    oConferenceRooms: { type: Number, default: 0 },
    oMeetingRooms: { type: String, default: '' },
    oReception:    { type: String, default: '' },
    oPantry:       { type: String, default: '' },
    oFurnishing:   { type: String, default: '' },
    oAC:           { type: String, default: '' },
    oParking:      { type: String, default: '' },
    oTotalFloors:  { type: String, default: '' },
    oYourFloor:    { type: String, default: '' },
    oStaircase:    { type: Number, default: 0 },
    oFireNOC:      { type: String, default: '' },
    oOccupancy:    { type: String, default: '' },
    oUPS:          { type: String, default: '' },
    oOwnership:    { type: String, default: '' },
    oPrevUsed:     { type: String, default: '' },
    oSuitableFor:  { type: String, default: '' },
    officeLiftPassenger: { type: Number, default: 0 },
    officeLiftService:   { type: Number, default: 0 },
    officeLiftOwner:     { type: Number, default: 0 },
    // Lease
    cLockIn:       { type: String, default: '' },
    cNoticePeriod: { type: String, default: '' },
    cRentIncrease: { type: String, default: '' },
    cBrokerage:    { type: String, default: '' }
  },
  videoUrl:  { type: String, default: '' },
  floorPlan: { type: String, default: '' },
  facing:    { type: String, default: '' },
  ageOfProperty: { type: String, default: '' },
  pricePerSqft:  { type: Number, default: 0 },
  isRERA:    { type: Boolean, default: false },
  reraNo:    { type: String, default: '' },
  isFeatured:{ type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false },
  rejectedReason: { type: String, default: '' },
  views:          { type: Number, default: 0 },
  recentContacts:  { type: Number, default: 0 },
  lastContactReset:{ type: Date, default: Date.now },
  agent: {
    name:  { type: String, default: '' },
    phone: { type: String, default: '' },
    initials: { type: String, default: '' }
  },
  postedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Text search index
propertySchema.index({ title: 'text', 'location.area': 'text', 'location.city': 'text' });
propertySchema.index({ slug: 1 });

// Slug generator
function generateSlug(type, status, id) {
  const base = (type + '-' + status)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-');
  return base + '-' + String(id).slice(-8);
}
propertySchema.statics.generateSlug = generateSlug;

module.exports = mongoose.model('Property', propertySchema);
