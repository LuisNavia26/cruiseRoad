import express from 'express';
import {planTrip} from '../Services/googlemapsfunctions.js';

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

export default router;
