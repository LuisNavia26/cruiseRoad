import React, { useEffect } from "react";
import { useState } from "react";

const stopTypeOptions = [
  { value: "national-parks", label: "National Parks" },
  { value: "state-parks", label: "State Parks" },
  { value: "historic-sites", label: "Historic Sites" },
  { value: "museums", label: "Museums" },
  { value: "bars", label: "Bars" },
  { value: "restaurants", label: "Restaurants" },
  { value: "attractions", label: "Attractions" },
  { value: "beaches", label: "Beaches" },
  { value: "hiking", label: "Hiking Trails" },
  { value: "campgrounds", label: "Campgrounds" },
  { value: "scenic-lookouts", label: "Scenic Lookouts" },
  { value: "zoos-aquariums", label: "Zoos and Aquariums" },
  { value: "theme-parks", label: "Theme Parks" },
  { value: "shopping", label: "Shopping" },
  { value: "coffee", label: "Coffee Shops" },
  { value: "live-music", label: "Live Music" },
  { value: "art-galleries", label: "Art Galleries" },
  { value: "botanical-gardens", label: "Botanical Gardens" },
];

function Profile({user, closeWindow, onLogout, onUserUpdate}) {
  const [showPass, setShowPass] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [emsg, setEMsg] = useState("");
  const [preferredStopTypes, setPreferredStopTypes] = useState(user.preferredStopTypes ?? []);
  const [prefsMsg, setPrefsMsg] = useState("");
  const [prefsSaving, setPrefsSaving] = useState(false);

  //upgrade to pro
  const [role, setRole] = useState(user.role ?? "user");
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeMsg, setUpgradeMsg] = useState("");
  useEffect(() => {
    setRole(user.role);
  }, [user.role]);
  useEffect(() => {
    setPreferredStopTypes(user.preferredStopTypes ?? []);
  }, [user.preferredStopTypes]);

  const handlePreferencesSave = async () => {
    setPrefsMsg("");
    if (preferredStopTypes.length === 0) {
      setPrefsMsg("Select at least one stop type");
      return;
    }
    try {
      setPrefsSaving(true);
      const response = await fetch("/api/users/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ preferredStopTypes }),
      });
      const data = await response.json();
      if (!response.ok) {
        setPrefsMsg(data.message || "Error updating preferences");
        return;
      }
      if (typeof onUserUpdate === "function") {
        onUserUpdate({ ...user, preferredStopTypes: data.preferredStopTypes });
      }
      setPrefsMsg("Stop preferences updated");
    } catch (error) {
      console.error("Update preferences error:", error);
      setPrefsMsg("Server error");
    } finally {
      setPrefsSaving(false);
    }
  };

  const handleUpgrade = async () => {
    setUpgradeMsg("");
    try {
      setUpgradeLoading(true);
      const response = await fetch("/api/users/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        const newRole = data.role ?? 'pro';
        setRole(newRole);
        // inform parent about the new role if callback provided
        if (typeof onUserUpdate === 'function') {
          onUserUpdate({ ...user, role: newRole });
        }
        setUpgradeMsg("User upgraded to pro successfully");
      } else {
        setUpgradeMsg(data.message || "Error upgrading user");
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      setUpgradeMsg("Server error");
    } finally {
      setUpgradeLoading(false);
    }
  };

 
  //changing password
  const handlePassChange = async () => {
    setEMsg("");



   
    try {
      const response = await fetch("/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
      });
      const data = await response.json();
      if (response.ok) {
        setEMsg("Password changed successfully");
        setOldPass("");
        setNewPass("");

      } else {
        setEMsg(data.message || "Error changing password");
      }
    } catch (error) {
      console.error('Change password error:', error);
      setEMsg("Server error");
    }
  };
  //deleting account
  const handleDeleteAccount = async () => {
    setEMsg("");
    try {
      const response = await fetch("/api/users/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setEMsg(data.message || "Error deleting account");
        return;
      }
      alert("Account deleted successfully");
      if (typeof onLogout === 'function') {
        onLogout();
      } else {
        closeWindow();
        window.location.reload();
      }
    } catch (error) {
      console.error('Delete account error:', error);
      setEMsg("Server error");
    }
  };
  return (
    <div className="profilePage">
      <div className="profilePageCard">
        {/* Close button */}
        <button
          type="button"
          onClick={closeWindow}
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

        <h2>👤 Your Profile</h2>
        {/* <p><b>First Name:</b> {user.firstname}</p>
        <p><b>Last Name:</b> {user.lastname}</p> */}
        <div className="profileSummary">
          <div className="profileSummaryTopRow">
            <p style={{ margin: "4px 0" }}><b>Username:</b> {user.username}</p>
            <div className="profileSummaryRightColumn">
              <p style={{ margin: "4px 0" }}><b>Password:</b>******** </p>
              <p className="accountTypeLine" style={{ margin: "4px 0", alignSelf: "flex-end", transform: "translateX(80px)" }}><b>Account Type:</b> {" "}{role === 'pro' ? "Pro User" : "Standard User"}</p>
            </div>
          </div>
        </div>
        <div className="profilePreferences">
          <p style={{ margin: "12px 0 8px" }}><b>Preferred Stops:</b></p>
          <div className="profileStopTypePanel">
            {stopTypeOptions.map((option) => (
              <label
                key={option.value}
                className={`profileStopTypeChip${preferredStopTypes.includes(option.value) ? " isSelected" : ""}`}
              >
                <input
                  type="checkbox"
                  className="stopTypeCheckbox"
                  checked={preferredStopTypes.includes(option.value)}
                  onChange={(e) => {
                    setPreferredStopTypes((current) =>
                      e.target.checked
                        ? [...current, option.value]
                        : current.filter((item) => item !== option.value)
                    );
                  }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          <div style={{ marginTop: "10px" }}>
            <button className="passwordChangeButton" onClick={handlePreferencesSave} disabled={prefsSaving}>
              {prefsSaving ? "Saving..." : "Save Stop Preferences"}
            </button>
          </div>
          {prefsMsg && (
            <p style={{ color: prefsMsg.includes("updated") ? "lightgreen" : "red", margin: "8px 0 0" }}>
              <b>{prefsMsg}</b>
            </p>
          )}
        </div>
        {role !== "pro" && (
          <div style={{ marginBottom: "10px" }}>
            <button
              className="upgradeButton"
              onClick={handleUpgrade}
              disabled={upgradeLoading}
              style={{
                marginBottom: "6px",
                padding: "6px 10px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#f5b400",
                color: "black",
                fontWeight: "bold",
              }}
            >
              {upgradeLoading ? "Upgrading..." : "Upgrade to Pro"}
            </button>

            {upgradeMsg && (
              <p
                style={{
                  color: upgradeMsg.includes("success")
                    ? "lightgreen"
                    : "red",
                  backgroundColor: "white",
                  padding: "4px 6px",
                  borderRadius: "4px",
                  display: "inline-block",
                  marginLeft: "8px",
                }}
              >
                <b>{upgradeMsg}</b>
              </p>
            )}
          </div>
        )}
        <div style={{display: "flex", gap: "10px"}}>
            <button className = "passwordChangeButton"onClick={() =>setShowPass(true)}>Change Password</button>
            <button className = "deleteButton" onClick={() => setShowDelete(true)}><b>Delete Account</b></button>
        </div>

        {/* changing password popup */}
        {showPass && (
            <div className="tripDetails">
                <div className="nestedPass">
                  <button onClick={() => {
                    setShowPass(false);
                    setEMsg("")}}
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
                    }}>
                      X
                    </button>
        
                    <p style={{backgroundColor: "white", padding: "5px", display: "inline-block"}}><b>Change Password</b></p>
                    <input 
                      type="password" 
                      placeholder="Type..." 
                      value={oldPass} 
                      onChange={(e) => setOldPass(e.target.value)} 
                      className="inputs" 
                      style={{
                        width: "100%", 
                        marginBottom: "20px",
                        color: "white",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        padding: "8px",
                        border: "none",
                        borderRadius: "4px"
                      }}/>
                    <input 
                      type="password" 
                      placeholder="Type..." 
                      value={newPass} 
                      onChange={(e) => setNewPass(e.target.value)} 
                      className="inputs" 
                      style={{
                        width: "100%", 
                        marginBottom: "20px",
                        color: "white",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        padding: "8px",
                        border: "none",
                        borderRadius: "4px"
                      }}/>
                    {emsg && (
                      <p
                        style={{
                        color: emsg.includes("success") ? "lightgreen" : "red",
                        backgroundColor: "white",
                        padding: "5px",
                        borderRadius: "4px",
                        marginBottom: "15px",
                        display: "inline-block",
                      
                        }}
                      >
                        <b>{emsg}</b>
                        
                      </p>
                    )}
                    <br />

                    <button className="submitButton" onClick={handlePassChange}>Submit</button>
                    </div>
            </div>
        )}
        {/* delete account popup */}
        {showDelete && (
          <div className="tripDetails">
            <div className="nestedDeletePopUp">
              <button onClick={() => {
                setShowDelete(false);
                setEMsg("")}}
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
                }}>
                  X
                </button>
             <p style={{marginTop: "2px",backgroundColor: "white", padding: "5px", display: "inline-block"}}><b>Are you sure you want to delete your account?</b></p>
              <button className="deleteConfirm" onClick={handleDeleteAccount}><b>Yes, Delete My Account</b></button>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}

export default Profile;




  

