import React from "react";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <h3 style={{ padding: "20px" }}>Please login first</h3>;
  }

  return (
    <div style={{ padding: "100px" }}>
      <h2>My Profile</h2>

     
      <p style={{ marginTop: "10px", color: "gray" }}>
        Signed in as <strong>{user.email}</strong>
      </p>

     
      <div style={{ marginTop: "20px", lineHeight: "2" }}>
        <p><strong>Name:</strong> {user.firstname}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
}

export default Profile;
