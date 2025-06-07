export const environment = {
  production: true,
  baseUrl: 'https://rooms.lapahotel.co.za/connectdblapa',
  dynamicBaseUrl: 'https://rooms.lapahotel.co.za',

  urlEndPoints: {
    getoccupancy: '/get-occupancy.php',
    getAllRoomList: '/get-all-rooms.php',
    addNewBooking: '/add-new-booking.php',
    cancelBooking: '/cancel-booking.php',
    editGuestPersonalDetails: '/edit-personal-details.php',
    getPackages: '/get-all-packages.php',
    getOccupants: '/get-occupants-list.php',
    getAvailableRooms: '/get-available-rooms.php',
    getAllBookingLists: '/get-all-bookings.php',
    bookingStatus: '/change-booking-status.php',
    getRoomOccupancyCounts: '/get-room-occupancy-counts.php',
    getCanceledBookingsLists: '/get-canceled-rooms.php',
    updateBookingStatus: '/update-refund-status.php'
  }
};
