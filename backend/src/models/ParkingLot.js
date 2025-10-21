/**
 * ParkEase Backend - Parking Lot Model
 * Parking lot schema and methods
 */

const mongoose = require('mongoose');

const parkingLotSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a parking lot name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    address: {
        type: String,
        required: [true, 'Please provide an address'],
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere'
        }
    },
    lat: {
        type: Number,
        required: [true, 'Please provide latitude']
    },
    lon: {
        type: Number,
        required: [true, 'Please provide longitude']
    },
    distance: {
        type: String,
        default: '0 km'
    },
    totalSlots: {
        type: Number,
        required: [true, 'Please provide total slots'],
        min: [1, 'Total slots must be at least 1']
    },
    availableSlots: {
        type: Number,
        required: true
    },
    pricePerHour: {
        type: Number,
        required: [true, 'Please provide price per hour'],
        min: [0, 'Price cannot be negative']
    },
    amenities: [{
        type: String,
        trim: true
    }],
    rating: {
        type: Number,
        default: 4.0,
        min: 0,
        max: 5
    },
    images: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index for geospatial queries
parkingLotSchema.index({ location: '2dsphere' });

// Calculate distance (helper method)
parkingLotSchema.statics.getNearby = async function(lat, lon, maxDistance = 10000) {
    return this.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [lon, lat]
                },
                $maxDistance: maxDistance
            }
        },
        isActive: true
    });
};

// Update available slots
parkingLotSchema.methods.updateAvailability = async function(increment = false) {
    if (increment) {
        this.availableSlots = Math.min(this.availableSlots + 1, this.totalSlots);
    } else {
        this.availableSlots = Math.max(this.availableSlots - 1, 0);
    }
    await this.save();
};

// Check if slots are available
parkingLotSchema.methods.hasAvailableSlots = function() {
    return this.availableSlots > 0;
};

module.exports = mongoose.model('ParkingLot', parkingLotSchema);
