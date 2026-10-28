import { useEffect, useState } from "react";
import { User, Mail, Calendar, Ruler, Weight, Save } from "lucide-react";
import api from "../services/api";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    height: "",
    weight: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile");

      setProfile({
        name: response.data.user.name || "",
        email: response.data.user.email || "",
        age: response.data.user.age || "",
        height: response.data.user.height || "",
        weight: response.data.user.weight || "",
      });
    } catch (error) {
      console.error("Failed to load profile", error);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await api.put("/profile", {
        name: profile.name,
        age: Number(profile.age),
        height: Number(profile.height),
        weight: Number(profile.weight),
      });

      setProfile({
        name: response.data.user.name,
        email: response.data.user.email,
        age: response.data.user.age,
        height: response.data.user.height,
        weight: response.data.user.weight,
      });

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Update failed", error);
      alert(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your personal and fitness information</p>
        </div>
      </div>

      <div className="profile-layout">

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar">
            {profile.name
              ? profile.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <h2>{profile.name}</h2>
          <p>{profile.email}</p>

          <div className="profile-status">
            <span></span>
            Fitness Member
          </div>
        </div>

        {/* Edit Profile */}
        <div className="form-card">

          <div className="form-card-header">
            <div>
              <h2>Personal Information</h2>
              <p>Update your profile information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-group">
                <label>
                  <User size={16} />
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Mail size={16} />
                  Email
                </label>

                <input
                  type="email"
                  value={profile.email}
                  disabled
                />

                <small>Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label>
                  <Calendar size={16} />
                  Age
                </label>

                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  min="1"
                  max="120"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Ruler size={16} />
                  Height (cm)
                </label>

                <input
                  type="number"
                  name="height"
                  value={profile.height}
                  onChange={handleChange}
                  placeholder="Enter height"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Weight size={16} />
                  Weight (kg)
                </label>

                <input
                  type="number"
                  name="weight"
                  value={profile.weight}
                  onChange={handleChange}
                  placeholder="Enter weight"
                  min="1"
                  step="0.1"
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              className="save-profile-btn"
              disabled={saving}
            >
              <Save size={18} />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Profile;