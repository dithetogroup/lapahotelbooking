export class RoomRates {
  id: number;
  roomType: string;
  ratePlan: string;
  baseRate: string;
  seasonalRate: string;
  promotionalRate: string;
  additionalCharges: string;
  effectiveDate: string;
  endDate: string;
  bookingWindow: string;
  cancellationPolicy: string;
  minimumStay: string;
  maxOccupancy: string;
  action: string;
  status: string;

  // ✅ New fields from SQL query
  roomCode: string;
  weekendRate: string;
  discountedRate: string;
  bedType: string;
  totalRooms: number;

  constructor(roomRates: Partial<RoomRates>) {
    this.id = roomRates.id || this.getRandomID();
    this.roomType = roomRates.roomType || '';
    this.ratePlan = roomRates.ratePlan || '';
    this.baseRate = roomRates.baseRate || '';
    this.seasonalRate = roomRates.seasonalRate || '';
    this.promotionalRate = roomRates.promotionalRate || '';
    this.additionalCharges = roomRates.additionalCharges || '';
    this.effectiveDate = roomRates.effectiveDate || '';
    this.endDate = roomRates.endDate || '';
    this.bookingWindow = roomRates.bookingWindow || '';
    this.cancellationPolicy = roomRates.cancellationPolicy || '';
    this.minimumStay = roomRates.minimumStay || '';
    this.maxOccupancy = roomRates.maxOccupancy || '';
    this.action = roomRates.action || '';
    this.status = roomRates.status || '';

    // ✅ New fields initialization
    this.roomCode = roomRates.roomCode || '';
    this.weekendRate = roomRates.weekendRate || '';
    this.discountedRate = roomRates.discountedRate || '';
    this.bedType = roomRates.bedType || '';
    this.totalRooms = roomRates.totalRooms || 0;
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
