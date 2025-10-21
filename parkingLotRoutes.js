/**
 * ParkEase Backend - Parking Lot Routes
 * Parking lot management endpoints
 */

const express = require('express');
const router = express.Router();

const {
    getAllParkingLots,
    getParkingLot,
    createParkingLot,
    updateParkingLot,
    deleteParkingLot,
    getNearbyParkingLots,
    getParkingLotStats
} = require('../controllers/parkingLotController');

const { protect, isAdmin } = require('../middleware/auth');
const {
    validateParkingLot,
    validateMongoId,
    validatePagination,
    handleValidationErrors
} = require('../middleware/validator');

// Public routes
router.get('/', validatePagination, handleValidationErrors, getAllParkingLots);
router.get('/nearby', getNearbyParkingLots);
router.get('/:id', validateMongoId, handleValidationErrors, getParkingLot);

// Admin routes
router.post('/', 
    protect, 
    isAdmin, 
    validateParkingLot, 
    handleValidationErrors, 
    createParkingLot
);

router.put('/:id', 
    protect, 
    isAdmin, 
    validateMongoId, 
    handleValidationErrors, 
    updateParkingLot
);

router.delete('/:id', 
    protect, 
    isAdmin, 
    validateMongoId, 
    handleValidationErrors, 
    deleteParkingLot
);

router.get('/:id/stats', 
    protect, 
    isAdmin, 
    validateMongoId, 
    handleValidationErrors, 
    getParkingLotStats
);

module.exports = router;