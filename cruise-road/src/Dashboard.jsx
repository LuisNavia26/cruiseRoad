import React, {useState} from "react";
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import Profile from "./Profile.jsx";
import SavedTrips from "./SavedTrips.jsx";

const containerStyle = {
    width: '35%',
    height: '350px',
    margin: '1px auto',
    borderRadius: '8px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.15)'
};

const center = {
    lat: 29.6516,
    lng: -82.3248
};

function Dashboard({user, isLogOut}) {
    const [directions, setDirections] = useState(null);
    const [distance, setDistance] = useState("");
    const [CarType, setCar] = useState("");
    const [showPopUp, setShowPopUp] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [menu, setOpenMenu] = useState (false);
    const [profile, setProfile] = useState(false);
    const [tripStarted, setTripStarted] = useState(false);
    const [stops, setStops] = useState([]);
    const [showSavedTrips, setSavedTrips] = useState(false);
    const [Spending, setSpending] = useState("");
    const [formData, setFormData] = useState({
        destination: "",
        start: "",
    });
    // const position = { lat: 29.65, lng: -82.35 }; // Example coordinates (Gainesville, FL)
    const { isLoaded, loadError} = useJsApiLoader({
        id: 'gmaps-script',
        googleMapsApiKey:import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });
    console.log("API Loaded:", isLoaded, "Load Error:", loadError?.message);

    /*Handling trip planning submission*/
    const handleSub = async(e)=>{
        e.preventDefault();
        if (formData.destination.trim() && formData.start.trim() && CarType != ""){
            try{
                const res = await fetch ("/api/trips/plan", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        destination: formData.destination,
                        start: formData.start,
                        vehicleType: CarType,
                    }),
                });
                setShowPopUp(false);
                setTripStarted(true);
                const tripData = await res.json().catch(() => null);
                if (res.ok){ 
                    console.log("Trip planned successfully:", tripData);
                    setErrorMsg ("");
                    if (tripData?.stops && Array.isArray(tripData.stops)){
                        setStops(tripData.stops);
                        setSpending(tripData.PriceEstimate);
                    }else {
                        setStops([]);
                    }
                    // Request directions
                    if (isLoaded && window.google) {
                        const directionsService = new window.google.maps.DirectionsService();
                        directionsService.route(
                            {
                                origin: formData.start,
                                destination: formData.destination,
                                travelMode: window.google.maps.TravelMode.DRIVING,
                                //If we decide to add the stops in the route we add them here
                            },
                            (result, status) => {
                                console.log("Directions status:", status);
                                if (status === window.google.maps.DirectionsStatus.OK) {
                                    setDirections(result);
                                    const leg = result.routes[0]?.legs[0];
                                    if (leg?.distance?.text){
                                        setDistance(leg.distance.text);
                                    }
                                    console.log("Route set successfully");
                                } else {
                                    console.error(`Directions error: ${status}`);
                                    setErrorMsg(`Could not calculate directions: ${status}`);
                                }
                            }
                        );
                    } else {
                        console.error("Google Maps API not loaded");
                        setErrorMsg("Google Maps API not loaded. Please refresh the page.");
                    }
                }else{
                    setErrorMsg (tripData.message || "Failed to plan trip");
                }
             }catch (error){
                console.error("Error:", error);
                setErrorMsg ("An error occurred during trip planning. Please try again later.");
             }
            }else{
                setErrorMsg ("All fields are required. Please fill in all fields." );
            }
    };
    const saveATrip = async () => {
        try {
            const res = await fetch("/api/trips/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: user.username,
                    start: formData.start,
                    destination: formData.destination,
                    vehicleType: CarType,
                    distance: distance,
                    estimatedSpending: Spending,
                    stops: stops
                }),
            });
            const saveTripData = await res.json();
            if (res.ok) {
                alert("Trip saved successfully!");
            } else {
                setErrorMsg(saveTripData.message || "Failed to save trip.");
            }
        } catch (error) {
            console.error("Error saving trip:", error);
            setErrorMsg("An error occurred while saving the trip. Please try again later.");
        }
    };
    return (
        <>
        <div className= "dashboard">
            {/*Menu*/}
            <div className="menu" onClick={()=>setOpenMenu(!menu)}>
                ☰
            </div>
            {menu && (
                <div className="menuDropdown">
                    <a className="menuItem" href="/profile"onClick={(e) => {e.preventDefault();setProfile(true);setOpenMenu(false);}}>
                        Profile
                    </a>
                    <a className="menuItem" href="/saved-trips" onClick={(e) => {e.preventDefault(); setSavedTrips(true); setOpenMenu(false);}}>
                        Saved Trips
                    </a>
                    <a className="menuItem" href="#" onClick={(e) => {e.preventDefault();isLogOut();}}>
                        Log Out
                    </a>
                </div>
            )}
            <h1 style={{
                display: "inline-block",
                backgroundColor: "rgba(255,255,255,0.88)",
                color: "black",
                padding: "10px 15px",
                borderRadius: "6px"}}
                >
                Welcome, {user.username}!</h1>
            <div style={{ textAlign:"center", display: "inline-block",backgroundColor: "rgba(255, 255, 255, 0.88)",color: "black",padding: "8px 15px",borderRadius: "6px",}}>
                <h2>Plan your next road trip!</h2>
            </div>

            {/* Google Map */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '16px', position: 'relative' }}>
                {/* Transparent Sidebar Menu */}
                {tripStarted && (
                    <div style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '330px',
                        maxHeight: '500px',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(5px)',
                        borderRadius: '8px',
                        padding: '15px',
                        overflowY: 'auto',
                        zIndex: 10,
                        color: 'white',
                        fontFamily: 'inherit'
                    }}>
                        <h3 style={{ marginTop: '0', marginBottom: '15px', fontSize: '16px' }}>Trip Details</h3>
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '12px' }}>FROM:</p>
                            <p style={{ margin: '0', fontSize: '13px', color: '#ccc' }}>{formData.start}</p>
                        </div>
                        {/*Stop Descriptions*/}
                        {stops.length > 0 && (
                            <> 
                            {stops.map((stop, index) => (
                                <div key = {stop.placeId || index} style={{ marginBottom: '10px' }}>
                                    <p style = {{ fontWeight: 'bold', margin: '0 0 3px 0', fontSize: '12px' }}>
                                        Stop {index + 1}: {stop.name || 'Unnamed Location'}
                                    </p>
                                    {stop.description && (
                                        <p style={{ margin: '0', fontSize: '11px', color: '#ddd', whiteSpace: 'pre-wrap' }}>
                                            {stop.description}
                                        </p>
                                    )}
                                </div>
                                
                            ))}
                            </>
                        )}
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '12px' }}>TO:</p>
                            <p style={{ margin: '0', fontSize: '13px', color: '#ccc' }}>{formData.destination}</p>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '12px' }}>VEHICLE:</p>
                            <p style={{ margin: '0', fontSize: '13px', color: '#ccc' }}>{CarType }</p>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '10px', width:'0' }}>ESTIMATED DISTANCE:</label>
                            <label style={{ fontSize: '10px', color: '#ccc' }}> {distance || "Caclulating..."}</label>
                        </div>
                        <div style={{ marginBottom: '0' }}>
                            <label style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '10px', width:'0' }}>ESTIMATED FUEL/CHARGE SPENDING:</label>
                            <label style={{ fontSize: '10px', color: '#ccc' }}> {Math.ceil(Spending) || "Calculating..."}</label>
                        </div><br />
                        <hr style={{ borderColor: 'rgba(255, 255, 255, 0.3)', margin: '15px 0' }} />
                        <button className= "planningButton" onClick={() => setTripStarted(false)}>
                            Close Menu
                        </button>
                        <button className="planningButton" onClick={saveATrip}>
                            Save Trip Info                          
                        </button>
                    </div>
                )}
                {loadError && (
        <div style={{ color: 'red', fontWeight: 600 }}>
          Map load error: {loadError.message}
        </div>
      )}
      {!isLoaded ? (
        <div>Loading map…</div>
      ) : (
        <GoogleMap 
            mapContainerStyle={containerStyle} 
            center={center} 
            zoom={10}>
            {directions && <DirectionsRenderer directions={directions} />}
            {stops.map((stop, index) => {
                const position = stop.location ? { lat: stop.location.lat, lng: stop.location.lng } : { lat: stop.lat, lng: stop.lng };
                return <Marker key={stop.placeId || index} position={position} />;
            })}
        </GoogleMap>
      )}
            </div>

        {/*Start Your Trip*/}
            <div style={{ marginTop: "15px" }}
            >
            <button
            type="button"
            onClick={()=>{setShowPopUp(true);
                setErrorMsg("");
            }}
            style={{
                position: "absolute",
                top: "93%",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(8, 114, 41, 0.88)",
                borderRadius: "8px",
                padding: "8px 12px",
                width: "max-content",
                display: "inline-block",
                cursor: "pointer",}}
            >
                Start Planning Here!
            </button>
            </div>   
            </div>
        {profile && (
            <Profile user={user} closeWindow={() => setProfile(false)} />
        )}
        {showSavedTrips && (
            <SavedTrips user={user} closeWindow={() => setSavedTrips(false)} />
        )}

            {/* Pop up for Planning Trip */}
            {showPopUp && (
                <div className={"popupOverlay"}>
                    <div className={"popupBox"}
                    style={{position: "relative",
                        backgroundImage: "url('public/pictures/road.jpg')",
                        backgroundSize: "cover",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                    }}>
                        {/*Close Button*/}
                        <button type= "button"
                            className="closeButton"
                            onClick={()=> {setShowPopUp(false); setErrorMsg("");}}
                            style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                border: "none",
                                background: "red",
                                fontSize: "10px",
                                cursor: "pointer",
                            }}
                            >
                            X
                        </button>
                        <h3>LET THE ROADTRIPPING START HERE</h3>
                        <form onSubmit={handleSub}>
                            <div style={{ marginBottom: "10px" }}>
                                <label htmlFor="destination"style={{display: "block",
                                    color: "#fff",                     
                                    WebkitTextStroke: "0.5px #000",    
                                    textShadow:                        
                                        "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000",
                                    fontWeight: 700,
                                    letterSpacing: "0.3px"}}>Where are we going?</label><br />
                                <input 
                                    type="text" 
                                    id="destination"
                                    placeholder="e.g., Mount Rushmore, SD"
                                    value={formData.destination} 
                                    onChange={(e) => setFormData((s) => ({ ...s, destination: e.target.value }))} 
                                />
                            </div>

                            <div style={{ marginBottom: "10px" }}>
                                <label htmlFor="start"style={{display: "block",
                                    color: "#fff",                     
                                    WebkitTextStroke: "0.5px #000",    
                                    textShadow:                        
                                        "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000",
                                    fontWeight: 700,
                                    letterSpacing: "0.3px"}}>
                                Where are leaving from?:</label><br />
                                <input 
                                    type="text" 
                                    id="start"
                                    placeholder="e.g., Gainesville, Fl"
                                    value={formData.start} 
                                    onChange={(e) => 
                                        setFormData((s)=>({ ...s, start: e.target.value }))}                            
                                />
                            </div>
                            <label style={{display: "block",
                                color: "#fff",                     
                                WebkitTextStroke: "0.5px #000",    
                                textShadow:                        
                                    "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000",
                                fontWeight: 700,
                                letterSpacing: "0.3px"}}>
                                ️What Type of Vehicle are we driving?</label>
                            <select 
                                value={CarType} 
                                onChange={(e) => setCar(e.target.value)}
                                style={{ color: "#9CA3AF"}}>
                                <option value ="" >--Please choose an option--</option>
                                <option value="SUV" >SUV</option>
                                <option value="Sports Car" >Sports Car</option>
                                <option value="Truck" >Truck</option>
                                <option value="Minivan" >Minivan</option>
                                <option value="Electric" >Electric</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Motorcycle">Motorcycle</option>
                                <option value="RV">RV</option>
                                </select>
                           
                            {errorMsg &&(
                                <p style={{ backgroundColor:"rgba(245, 236, 195, 1)",color: "red", fontWeight: "bold", marginTop: "10px" }}>
                                {errorMsg}
                                </p>
                            )}
                            <div style={{marginTop:"30px", textAlign:"Center", display: "inline-block",color: "black",padding: "10px 15px",borderRadius: "6px",}}>
                                <button type="submit">Lets Plan!</button>
                            </div>
                           

                    </form>
                </div>
            </div>
        )}
     </>
    );
}
export default Dashboard;