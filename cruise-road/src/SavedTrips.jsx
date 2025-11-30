import React from "react";
import { useState, useEffect } from "react";

function SavedTrips({user, closeWindow}) {
    const [savedTrips, setSavedTrips] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState (true);
    const [selectedTrip, setSelectedTrip] = useState (null);
    useEffect(() => {
        // Fetch saved trips for the user
        const fetchSavedTrips = async () => {
            try {
                const response = await fetch(`/api/trips/saved?username=${user.username}`);
                const data = await response.json();
                if (response.ok) {
                    setSavedTrips(data.trips || []);
                }else{
                    setErrorMsg (data.message || "Failed to fetch saved trips.");
                }
            } catch (err) { //adding checks for fetch errors
                console.error('Fetch saved trips error:', err);
                setErrorMsg("Error fetching saved trips, try again later.");
            } finally {
                setLoading(false);
            }

        };
        fetchSavedTrips();
    }, [user.username]);

    //Unfavoriting a trip function
    const handleUnfavorite = async (tripId) => {
        try {
            const response = await fetch(`/api/trips/saved/${encodeURIComponent(tripId)}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (!response.ok) {
                setErrorMsg(data.message || "Failed to unfavorite the trip.");
                return;

            }
            setSavedTrips((prev) => prev.filter((trip) => trip._id !== tripId));
        } catch (err) {
            console.error('Unfavorite trip error:', err);
            setErrorMsg("Error removing the trip, try again later.");
        }
    };
    //opening saved trips
    const handleOpenTrip = (trip) => {
        setSelectedTrip(trip);
    };
    return (
        <div className="popupOverlay">
            <div className="popupBox">
                
                <button type="button" onClick={closeWindow}
                style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                border: "none",
                background: "red",
                color: "white",
                fontSize: "12px",
                cursor: "pointer",
                borderRadius: "4px",
                padding: "2px 6px",
                }}
                >
                X
                </button>
                <h2>💾 Saved Trips</h2>
                {!loading && errorMsg && (
                    <p style={{ color: "red", fontWeight: "bold" }}>{errorMsg}</p>
                )}
                {!loading && !errorMsg && savedTrips.length === 0 && (
                    <p>You have no saved trips.</p>
                )}
                {!loading && savedTrips.length > 0 && (
                    <ul style={{marginTop:"10px",  maxHeight: "400px", overflowY: "auto", paddingRight: "10px"}}>
                        {savedTrips.map((trip) =>
                            <li key={trip._id} className="savedTripItem">
                                <div>
                                    {trip.start} → {trip.destination}
                                </div>
                                <div style={{display: "flex", gap: "10px", marginTop: "5px"}}>
                                    <button className= "savedTripButton" onClick={() => handleOpenTrip(trip)}>Open Trip</button>
                                    <button className= "savedTripButton" onClick={() => handleUnfavorite(trip._id)}>Unfavorite</button>
                                </div>
                            </li>
                        )}

                                    

                    </ul>
                )}
                {selectedTrip && (
                    <div className="tripDetails">
                        <div className="nestedPopUp">
                            <button 
                                style={{
                                    position: "absolute",
                                    top: "8px",
                                    right: "8px",
                                    border: "none",
                                    background: "red",
                                    color: "white",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                    borderRadius: "4px",
                                    padding: "2px 6px",
                                }}
                                onClick={() => setSelectedTrip (null)}
                            >
                                X
                            </button>
                        <h3>Trip Details</h3>
                        <p><strong>From:</strong> {selectedTrip.start}</p>
                        <p><strong>To:</strong> {selectedTrip.destination}</p>
                        <p><strong>Vehicle:</strong> {selectedTrip.vehicleType}</p>
                        <p><strong>Distance:</strong> {selectedTrip.distance}</p>
                        <p><strong>Estimated Spending:</strong> ${selectedTrip.estimatedSpending}</p>

                         {selectedTrip.stops && selectedTrip.stops.length > 0 && (
                                <>
                                    <h4>Stops:</h4>
                                    <ul>
                                        {selectedTrip.stops.map((stop, i) => (
                                            <li key={i}>
                                                {stop.name || "Unnamed"} - {stop.description || "No description"}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default SavedTrips;