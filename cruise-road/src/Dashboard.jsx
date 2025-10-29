import React from "react";

function Dashboard({user, isLogOut}) {
    return (
        <div className= "dashboard">
            <h1 style={{display: "inline-block",backgroundColor: "rgba(255,255,255,0.88)",color: "black", padding: "10px 15px",borderRadius: "6px"}}>Welcome, {user.username}!</h1>
            <div>
                <button onClick={isLogOut}>Log Out</button>

            </div>
            <div style={{marginTop:"40px", textAlign:"center", display: "inline-block",backgroundColor: "rgba(255, 255, 255, 0.88)",color: "black",padding: "10px 15px",borderRadius: "6px",}}>
                <h2>Plan your next road trip!</h2>
                <p>Choose your next destination now.</p>
            </div>
        </div>
    );
}
export default Dashboard;