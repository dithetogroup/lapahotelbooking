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
    getRegularGuest: '/get-regular-guests.php',
    //addRegularGuest: '/add-regular-guest.php',
    updateRegularClient: '/update-regular-client.php',
    addRegularClient: '/add-regular-client.php',
    deleteRegularClient: '/delete-regular-client.php'
  }
};
