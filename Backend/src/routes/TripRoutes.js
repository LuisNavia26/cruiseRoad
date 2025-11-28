import express from 'express';
import {planTrip} from '../Services/googlemapsfunctions.js';
import Trip from '../models/trip.js';

const router = express.Router();

router.post('/plan', async (req, res, next) => {
    try{
        const { destination, start, vehicleType } = req.body;
        console.log("Received trip planning request:", { destination, start, vehicleType });
        const results = await planTrip({start, destination, vehicleType});
        return res.json({
            distance: results.distance,
            duration: results.duration,
            polyline: results.polyline,
            stops: results.stops,
            PriceEstimate: results.PriceEstimate,
        });
    } catch (error){
        console.error('Error in /api/trips/plan:', error);
        next (error);
    }

});

router.post('/save', async (req, res) => {
    try{
        const { username, start, destination,  vehicleType, distance, estimatedSpending,stops } = req.body;
        
        const newTrip = await Trip.create({
            username,
            start,
            destination,
            vehicleType,
            distance,
            estimatedSpending,
            stops
        });
       
        res.status(201).json({ message: 'Trip saved successfully!' , trip: newTrip});
    } catch (error){
        console.error('Error in saving trip', error);
        res.status(500).json({ message: 'Trip saving failed.'});
    
    }


});
router.get('/saved', async (req, res) => {
    try{
        const { username } = req.query;
        
        const trips = await Trip.find({ username}).sort({ createdAt: -1 });
        res.json({ trips });
    } catch (error){
        console.error('Error in fetching saved trips', error);
        res.status(500).json({ message: 'Error while fetching saved trips.'});
    }
});

router.delete("/saved/:id", async (req, res) => {
    try {
        const deleted = await Trip.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Trip not found." });
        }

        res.json({ message: "Trip removed." });
    } catch (err) {
        res.status(500).json({ message: "Error removing trip." });
    }
});

export default router;
