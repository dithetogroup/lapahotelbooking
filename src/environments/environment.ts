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
    getRegularGuest: '/get-regular-guests.php',
    addRegularGuest: '/add-regular-guest.php',
    addNewBooking: '/add-new-booking.php',
    cancelBooking: '/cancel-booking.php',
    editGuestPersonalDetails: '/edit-personal-details.php',
    getPackages: '/get-all-packages.php',
    getOccupants: '/get-occupants-list.php',
    getAvailableRooms: '/get-available-rooms.php',
    getAllBookingLists: '/get-all-bookings.php',
    bookingStatus: '/change-booking-status.php',
    paymentStatus: '/change-payment-status.php',
    getRoomOccupancyCounts: '/get-room-occupancy-counts.php',
    getCanceledBookingsLists: '/get-canceled-rooms.php',
    updateBookingStatus: '/update-refund-status.php',
    getRoomBookedDates: '/get-room-booked-dates.php',
    getAllBookingInvoices: '/get-booking-invoices.php',
    loginUser: '/login.php',    
    logoutUser: '/logout.php',
    getAllRoomRates: '/get-all-rooms-rates.php',
    updateRoomRates: '/update-room-rates.php',

    getRegularClients: '/get-all-clients.php',

  }
};
