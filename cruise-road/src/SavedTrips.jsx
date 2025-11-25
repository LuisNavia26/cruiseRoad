import React from "react";
import { useState, useEffect } from "react";

function SavedTrips({user, closeWindow}) {
    const [savedTrips, setSavedTrips] = useState([]);
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
                setErrorMsg("Error fetching saved trips, try again later.");
            }
        };
        fetchSavedTrips();
    }, [user.username]);
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
                {/* {errorMsg && (
                    <p style={{ color: "red", fontWeight: "bold" }}>{errorMsg}</p>
                )} */}

        
            </div>
        </div>
    )
}
export default SavedTrips;