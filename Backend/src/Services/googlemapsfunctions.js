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
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

function RecommendedStops(distance){
    if (distance < 150) return 0;
    else return Math.floor(distance / 300);
}

//Get the base route for point A to point B
async function getRoute(startCoords, destCoords, ){
    const Params = new URLSearchParams({
        origin,
        destination,
        mode : 'driving',
        key: GOOGLE_MAPS_API_KEY,
    });
    const url = `https://maps.googleapis.com/maps/api/directions/json?${Params.toString()}`;
    const response = await fetch (url);
        if (!response.ok){
            throw new Error ('Failed to fetch route from Google Maps API');
        }
    const data = await response.json();
        if (data.status !== 'OK'){
            throw new Error (`Google Maps API error: ${data.status}`);
        }
    const route = data.routes[0];
    const leg =  route.legs[0];
    const totalDistance = leg.distance.value / 1000; // in km
    const totalDuration = leg.duration.value / 60; // in minutes

    return {
        distance: totalDistance,
        duration: totalDuration,
        stops: leg.steps,
        OverviewPolyline: route.overview_polyline?.points || null,
    };
}
// Determine stops along the route at specified intervals
function RouteStops(route, invtervalKm = 50){
    const stops = [];
    let accumulatedDistance = 0;
    let nextStopDistance = 0;
    const segments = [];
    for (const step of route){
        const start = {
            lat: step.start_location.lat,
            lng: step.start_location.lng,
        };
        const end = {
            lat: step.end_location.lat,
            lng: step.end_location.lng,
        };
        const stepDistance = distanceKm(start, end);
        segments.push({start, end, distKm: stepDistance});
    }
    for (const segment of segments){
        const {start, end, distKm} = segment;
        if (stops.length === 0){
            stops.push({...start, positionOnRoute: 0});
        }
        while (accumulatedDistance + distKm >= nextStopDistance + invtervalKm){
            const remaininingDist = nextStopDistance + invtervalKm - accumulatedDistance;
            const ratio = remaininingDist / distKm;
            const Slat = start.lat + ratio * (end.lat - start.lat);
            const Slng = start.lng + ratio * (end.lng - start.lng);
            stops.push({lat:Slat, lng: Slng});
            nextStopDistance += invtervalKm;
        }
        accumulatedDistance += distKm;
    }
    const totalstops = stops.length;
    return stops,map((p,idx) => ({
        ...p, positionOnRoute: totalstops > 1? idx / (totalstops -1) : 0,}));
}
//Search for places near each stop
async function getPlaces(stop){
    const {lat, lng} = stop;
    const Params = new URLSearchParams({
        location: `${lat},${lng}`,
        radius: 5000, // 5 km radius
        type: 'national park OR State Park OR Historic Site',
        key: GOOGLE_MAPS_API_KEY,
    });
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${Params.toString()}`;
    const response = await fetch (url);
    if (!response.ok){
        throw new Error (`Failed to fetch places from Google Places API : ${response.status}`);
    }
    const data = await response.json();
    if (!data.results) return [];
    return data.results.map((place) => ({
        placeId: place.place_id,
        name: place.name,
        location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
        },
        rating: place.rating || 0,
        userRatingsTotal: place.user_ratings_total || 0,
        positionOnRoute: stop.positionOnRoute,
    }));
}

//Avoid same place suggestions twice
function filterUniquePlaces(places){
    const uniquePlacesMap = new Map();
    for (const place of places){
        if (!uniquePlacesMap.has(place.placeId)){
            uniquePlacesMap.set(place.placeId, place);
        }
    }
    return Array.from (uniquePlacesMap.values());
}

//choose best places based on rating and user reviews
function selectTopPlaces(places, maxPlaces = 5){
    const {rating, userRatingsTotal} = place;
    const capReviews = Math.min(userRatingsTotal, 2000);
    return 2.0 * rating + 0.003 * capReviews;
}
// chose the top places
function selectTopPlaces(places, stops, spacing = 0.15){
    if (stops <= 0) return [];
    const sortedPlaces = [...places].sort((a,b) => selectTopPlaces(b) - selectTopPlaces(a));
    const selectedPlaces = [];
    for (const place of sortedPlaces){
        if (selectedPlaces.length >= stops) break;
        const GoodDistance = selectedPlaces.every(s=> Math.abs(s.positionOnRoute - place.positionOnRoute) >= spacing);
        if (GoodDistance){
            selectedPlaces.push (place);
        }
    }
    return selectedPlaces;
}


//Main function to plan the trip
export async function planTrip (start, destination, vehicleType){
    const baseRoute = await getRoute (start, destination);
    const {distance, duration, stops, OverviewPolyline} = baseRoute;
    const routeStops = RecommendedStops (distance);
    if (routeStops == 0){
        return {
            distance,
            duration,
            polyline: OverviewPolyline,
            stops: [],
        };
    }
    const SampleStops = RouteStops(stops, 50); // get stops every 50 km
    const PlacesPromises = SampleStops.map(p=> getPlaces(p));
    const PlacesResults = await Promise.all (PlacesPromises);
    const allPlaces = PlacesResults.flat();
    const uniquePlaces = filterUniquePlaces (allPlaces);
    const selectedPlaces = selectTopPlaces (uniquePlaces, routeStops, 0.15);
    return {
        distance,
        duration,
        polyline: OverviewPolyline,
        stops: selectedPlaces,
    };
}