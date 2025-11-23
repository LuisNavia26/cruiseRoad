import express from 'express';
import {planTrip} from '../Services/googlemapsfunctions.js';

const router = express.Router();

router.post('/plan-trip', async (req, res, next) => {
    try{
        console.log("Received trip planning request:", { destination, start, vehicleType });
        const { destination, start, vehicleType } = req.body;
        const results = await planTrip({destination, start, vehicleType});
        return res.json({
            distnace: results.distance,
            duration: results.duration,
            polyline: results.OverviewPolyline,
            stops: results.stops,
        });
    } catch (error){
        console.error('Error in /api/trips/plan:', error);
        next (error);
    }

});

export default router;