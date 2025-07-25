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
    //Regular guests
    getRegularGuest: '/get-regular-guests.php',
    updateRegularClient: '/update-regular-client.php',
    addRegularClient: '/add-regular-client.php',
    deleteRegularClient: '/delete-regular-client.php',
    //spa
    getSpaBookings: '/get-spa-bookings.php',
    deleteSpaBooking: '/delete-spa-booking.php',
    updateSpaBooking: '/update-spa-booking.php',
    addSpaBooking: '/add-spa-booking.php',
    getSpaTherapists: '/get-spa-therapists.php',
    getSpaBookedSlots: '/get-spa-booked-slots.php',

    //Packages',
    updatePackage: '/update-package.php',
    deletePackage: '/delete-package.php',
    addPackage: '/add-package.php',

    //Therapists
    updateTherapist: '/update-therapist.php',
    deleteTherapist: '/delete-therapist.php',
    addTherapist: '/add-therapist.php',

  }
};
