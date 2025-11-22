import express, { app } from 'express';
import { useEffect, useState } from 'react';
import dotenv from 'dotenv';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
app.use(express.json());

/*Bring the destination and starting point from Dashboard.jsx to googlemapsfunctions.js to get the coordinates*/
app.post('/api/trips/plan-trip', async (req, res) => {
    const { destination, start, carType } = req.body; 
    console.log("Received trip planning request:", { destination, start, carType });
    res.json({ok: true})
});

function distanceKm(p1,p2){
    const R = 6371; // Radius of the Earth in kilometers
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(p2.lat - p1.lat);
    const dLon = toRad(p2.lng - p1.lng);
}
