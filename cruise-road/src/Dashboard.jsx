import React from "react";

function Dashboard({user, isLogOut}) {
    return (
        <div className= "dashboard">
            <h2>Welcome, {user.firstName} {user.lastName}!</h2>
            <p>Your username: {user.username}</p>
            <div style={{marginTop:"25px"}}>
                <button onClick={isLogOut}>Log Out</button>

            </div>
            <div style={{marginTop:"40px", textAlign:"left"}}>
                <h2>Plan your next road trip!</h2>
                <p>You have no planned trips yet, choose your next destination now.</p>
            </div>
        </div>
    );
}
export default Dashboard;