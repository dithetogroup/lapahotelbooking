export class RoomTypeDetails {
  roomTypeId: number;
  roomCode: string;
  roomName: string;
  weekendRate: string;
  weekRate: string;
  discountedRate: string;
  bedType: string;
  totalRooms: number;

  constructor(data: Partial<RoomTypeDetails>) {
    this.roomTypeId = data.roomTypeId || 0;
    this.roomCode = data.roomCode || '';
    this.roomName = data.roomName || '';
    this.weekendRate = data.weekendRate || '';
    this.weekRate = data.weekRate || '';
    this.discountedRate = data.discountedRate || '';
    this.bedType = data.bedType || '';
    this.totalRooms = data.totalRooms || 0;
  }
}
