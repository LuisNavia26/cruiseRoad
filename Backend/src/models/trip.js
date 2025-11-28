import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
    {
    username:{ type: String, required: true, lowercase: true, trim: true, index: true },
    start: { type: String, required: true },
    destination: { type: String, required: true },
    vehicleType:{type: String, required: true },
    distance:{type: String },
    estimatedSpending:{type: Number},
    stops:[
        {
            name: String,
            description: String,
            latitude: Number,
            longitude: Number,
            place_id: String,

        }
    ]
    
    },
);
const Trip = mongoose.model('Trip', tripSchema);
export default Trip;