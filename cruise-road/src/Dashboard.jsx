import React, {useState} from "react";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Profile from "./Profile.jsx";

const containerStyle = {
    width: '50%',
    height: '300px',
    margin: '20px auto',
    borderRadius: '8px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.15)'
};

const center = {
    lat: 29.6516,
    lng: -82.3248
};

function Dashboard({user, isLogOut}) {
    const [CarType, setCar] = React.useState('');
    const [showPopUp, setShowPopUp] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [menu, setOpenMenu] = useState (false);
    const [profile, setProfile] = useState(false);
    const [formData, setFormData] = useState({
        destination: "",
        start: "",
    });
    const position = { lat: 29.65, lng: -82.35 }; // Example coordinates (Gainesville, FL)
    /*Handling trip planning submission*/
    const handleSub = async(e)=>{
        e.preventDefault();
        if (!formData.destination || !formData.start){
            setErrorMsg("Please fill out all the fields.");
            return;
        }
        setErrorMsg(""); //Not actual error handling yet, just for show, for now
        setShowPopUp(false);
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
                    <a className="menuItem" href="/saved-trips">Saved Trips</a>
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
            <div style={{ textAlign:"center", display: "inline-block",backgroundColor: "rgba(255, 255, 255, 0.88)",color: "black",padding: "10px 15px",borderRadius: "6px",}}>
                <h2>Plan your next road trip!</h2>
            </div>

            {/* Google Map */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={10}
                        options={{
                            disableDefaultUI: false,
                            zoomControl: true
                        }}
                    >
                        <Marker position={center} />
                    </GoogleMap>
                </LoadScript>
            </div>

        {/*Start Your Trip*/}
            <div style={{ marginTop: "15px" }}
            >
            <button
            type="button"
            onClick={()=>{setShowPopUp(true);
                setErrorMsg("");
            }}
            style={{marginTop:"600px",
                 right:"43.5%",
                 textAlign:"center", 
                 display: "inline-block",
                 backgroundColor: "rgba(8, 114, 41, 0.88)",
                 borderRadius: "6px",}}
            >
                Start Planning Here!
            </button>
            </div>   
            </div>
        {profile && (
            <Profile user={user} closeWindow={() => setProfile(false)} />
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
                                name="Car Type" 
                                value={CarType} onChange={event => handleCategoryChange(event.target.value)}
                                style={{ color: "#9CA3AF"}}>
                                <option id ="" >--Please choose an option--</option>
                                <option id="0" >SUV</option>
                                <option id="1" >Sports Car</option>
                                <option id="2" >Truck</option>
                                <option id="3" >Minivan</option>
                                <option id="4" >Electric</option>
                                <option id="5">Hybrid</option>
                                <option id="6">Motorcycle</option>
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