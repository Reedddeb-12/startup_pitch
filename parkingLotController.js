/**
 * ParkEase Backend - Parking Lot Controller
 * Parking lot CRUD operations
 */

const ParkingLot = require('../models/ParkingLot');
const Booking = require('../models/Booking');
const { PAGINATION } = require('../config/constants');

// @desc    Get all parking lots
// @route   GET /api/parking-lots
// @access  Public
exports.getAllParkingLots = async (req, res, next) => {
    try {
        const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, search } = req.query;

        const query = { isActive: true };

        // Add search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } }
            ];
        }

        const parkingLots = await ParkingLot.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await ParkingLot.countDocuments(query);

        res.status(200).json({
            success: true,
            count: parkingLots.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: parkingLots
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single parking lot
// @route   GET /api/parking-lots/:id
// @access  Public
exports.getParkingLot = async (req, res, next) => {
    try {
        const parkingLot = await ParkingLot.findById(req.params.id);

        if (!parkingLot) {
            return res.status(404).json({
                success: false,
                message: 'Parking lot not found'
            });
        }

        res.status(200).json({
            success: true,
            data: parkingLot
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create parking lot
// @route   POST /api/parking-lots
// @access  Private/Admin
exports.createParkingLot = async (req, res, next) => {
    try {
        const { name, address, lat, lon, totalSlots, pricePerHour, amenities, distance } = req.body;

        const parkingLot = await ParkingLot.create({
            name,
            address,
            lat,
            lon,
            location: {
                type: 'Point',
                coordinates: [lon, lat]
            },
            totalSlots,
            availableSlots: totalSlots,
            pricePerHour,
            amenities: amenities || [],
            distance: distance || '0 km',
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Parking lot created successfully',
            data: parkingLot
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update parking lot
// @route   PUT /api/parking-lots/:id
// @access  Private/Admin
exports.updateParkingLot = async (req, res, next) => {
    try {
        let parkingLot = await ParkingLot.findById(req.params.id);

        if (!parkingLot) {
            return res.status(404).json({
                success: false,
                message: 'Parking lot not found'
            });
        }

        const { lat, lon, ...updateData } = req.body;

        // Update location if lat/lon changed
        if (lat && lon) {
            updateData.lat = lat;
            updateData.lon = lon;
            updateData.location = {
                type: 'Point',
                coordinates: [lon, lat]
            };
        }

        parkingLot = await ParkingLot.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Parking lot updated successfully',
            data: parkingLot
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete parking lot
// @route   DELETE /api/parking-lots/:id
// @access  Private/Admin
exports.deleteParkingLot = async (req, res, next) => {
    try {
        const parkingLot = await ParkingLot.findById(req.params.id);

        if (!parkingLot) {
            return res.status(404).json({
                success: false,
                message: 'Parking lot not found'
            });
        }

        // Soft delete - mark as inactive
        parkingLot.isActive = false;
        await parkingLot.save();

        res.status(200).json({
            success: true,
            message: 'Parking lot deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get nearby parking lots
// @route   GET /api/parking-lots/nearby
// @access  Public
exports.getNearbyParkingLots = async (req, res, next) => {
    try {
        const { lat, lon, maxDistance = 10000 } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                message: 'Please provide latitude and longitude'
            });
        }

        const parkingLots = await ParkingLot.getNearby(
            parseFloat(lat),
            parseFloat(lon),
            parseInt(maxDistance)
        );

        res.status(200).json({
            success: true,
            count: parkingLots.length,
            data: parkingLots
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get parking lot statistics (Admin)
// @route   GET /api/parking-lots/:id/stats
// @access  Private/Admin
exports.getParkingLotStats = async (req, res, next) => {
    try {
        const parkingLot = await ParkingLot.findById(req.params.id);

        if (!parkingLot) {
            return res.status(404).json({
                success: false,
                message: 'Parking lot not found'
            });
        }

        // Get bookings for this parking lot
        const bookings = await Booking.find({ 
            parkingLot: req.params.id,
            status: { $ne: 'cancelled' }
        });

        const stats = {
            totalBookings: bookings.length,
            revenue: bookings.reduce((sum, b) => sum + b.amount, 0),
            occupancyRate: ((parkingLot.totalSlots - parkingLot.availableSlots) / parkingLot.totalSlots * 100).toFixed(1),
            availableSlots: parkingLot.availableSlots,
            totalSlots: parkingLot.totalSlots
        };

        res.status(200).json({
            success: true,
            data: {
                parkingLot,
                stats
            }
        });
    } catch (error) {
        next(error);
    }
};