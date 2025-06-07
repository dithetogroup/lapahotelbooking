export const environment = {
  production: false,
  baseUrl: 'http://localhost/connectdblapa',
  dynamicBaseUrl: 'http://localhost',
  // production: true,
  // baseUrl: 'https://board.dithetogroup.co.za/connectdbhiking',
  // dynamicBaseUrl: 'https://board.dithetogroup.co.za/',


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
