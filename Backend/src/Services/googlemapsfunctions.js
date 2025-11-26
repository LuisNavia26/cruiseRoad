import dotenv from 'dotenv';
dotenv.config();
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/*Bring the destination and starting point from Dashboard.jsx to googlemapsfunctions.js to get the coordinates*/


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
async function getRoute(origin, destination){
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
    const route         = data.routes[0];
    const leg           =  route.legs[0];
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
    return stops.map((p,idx) => ({
        ...p, positionOnRoute: totalstops > 1? idx / (totalstops -1) : 0,}));
}
//Search for places near each stop
async function getPlaces(stop){
    const {lat, lng} = stop;
    const Params = new URLSearchParams({
        location: `${lat},${lng}`,
        radius: 50000, // 31.1 mi radius max allowed
        keyword: 'national park State Park Historic Sites Museum Destillery',
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
function scorePlace(place) {
  const rating = place.rating ?? 0;
  const userRatingsTotal = place.userRatingsTotal ?? 0;
  const capReviews = Math.min(userRatingsTotal, 2000);
  return 2.0 * rating + 0.003 * capReviews;
}
// chose the top places

function pickTopPlaces(places, maxPlaces, spacing = 0.15) {
    if (maxPlaces <= 0) return [];

    const sorted = [...places].sort((a, b) => scorePlace(b) - scorePlace(a));
    const selected = [];

    for (const place of sorted) {
        if (selected.length >= maxPlaces) break;

        const farEnough = selected.every(
            (s) => Math.abs(s.positionOnRoute - place.positionOnRoute) >= spacing
        );

        if (farEnough) {
        selected.push(place);
        }
    }
    return selected;
}



//Main function to plan the trip
export async function planTrip ({start, destination, vehicleType}){
    const baseRoute = await getRoute(start, destination);
    const {distance, duration, stops, OverviewPolyline} = baseRoute;
    const routeStops = RecommendedStops (distance);
    if (routeStops == 0){
        const PriceEstimate = GasEstimate(distance, vehicleType);
        return {
            distance,
            duration,
            polyline: OverviewPolyline,
            stops: [],
            PriceEstimate,
        };
    }
    const SampleStops = RouteStops(stops, 50); // get stops every 50 km
    const PlacesPromises = SampleStops.map(p=> getPlaces(p));
    const PlacesResults = await Promise.all (PlacesPromises);
    const allPlaces = PlacesResults.flat();
    const uniquePlaces = filterUniquePlaces (allPlaces);
    const selectedPlaces = pickTopPlaces (uniquePlaces, routeStops, 0.15);
    const PriceEstimate = GasEstimate (distance, vehicleType);
    const detailedPlaces = await Promise.all(
        selectedPlaces.map(async (place) => {
            try{
                const details = await getPlaceDetails(place.placeId);
                return {
                    ...place,
                    description: details?.description || '',
                };  
            }
            catch (error){
                console.error('Error fetching place details:', error);
                return {place,description: ""}; // return place without description on error
            }
        })
    );
    return {
        distance,
        duration,
        polyline: OverviewPolyline,
        stops: detailedPlaces,
        PriceEstimate
    };
}

function GasEstimate(distance, vehicleType){
    const vehicleEfficiency = {
        'SUV': 27, // mpg
        'Sports Car': 30, // mpg
        'Truck': 22, // mpg
        'Minivan': 25, // mpg
        'Electric': 300, // miles per full charge (approximation)
        'Hybrid': 50, // mpg
        'Motorcycle': 60, // mpg
        'RV': 11.6, // mpg
    }
    if (vehicleType != 'Electric'){
        const mpg = vehicleEfficiency[vehicleType];
        const gallonsNeeded = distance * 0.621371 / mpg; // convert km to miles
        const averageGasPricePerGallon = 3.50;
        return gallonsNeeded * averageGasPricePerGallon;
    } else { // Electric vehicle
        const milesNeeded = distance * 0.621371; // convert km to miles
        const stopsNeeded = milesNeeded / vehicleEfficiency['Electric'];
        const costPerCharge = 20.00; // average cost per full charge
        return stopsNeeded * costPerCharge;
    }

}

async function getPlaceDetails(placeId){
    const Params = new URLSearchParams({
        place_id: placeId,
        key: GOOGLE_MAPS_API_KEY,
        fields: 'place_id,name,editorial_summary,reviews',
    });
    const url = `https://maps.googleapis.com/maps/api/place/details/json?${Params.toString()}`;
    const response = await fetch (url);
    if (!response.ok){
        throw new Error (`Failed to fetch place details from Google Places API : ${response.status}`);
    }
    const data = await response.json();
    const place = data.result;
    if(!place){
        return null;
    }
    const description = place.editorial_summary?.overview || place.reviews?.[0]?.text || '';
    return {
        placeId :place.place_id,
        name: place.name,
        description,
    };
}
