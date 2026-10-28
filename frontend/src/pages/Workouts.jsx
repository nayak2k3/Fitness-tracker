import { useEffect, useState } from "react";
import {
  Dumbbell,
  Plus,
  Clock,
  Flame,
  Trash2,
  X,
} from "lucide-react";
import api from "../services/api";

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    calories: "",
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await api.get("/workouts/recent");

      const data = response.data;

      if (Array.isArray(data)) {
        setWorkouts(data);
      } else if (Array.isArray(data.workouts)) {
        setWorkouts(data.workouts);
      } else {
        setWorkouts([]);
      }
    } catch (error) {
      console.error("Failed to load workouts", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/workouts", {
        name: formData.name,
        duration: Number(formData.duration),
        calories: Number(formData.calories),
      });

      alert("Workout added successfully");

      setFormData({
        name: "",
        duration: "",
        calories: "",
      });

      setShowForm(false);

      fetchWorkouts();
    } catch (error) {
      console.error("Failed to add workout", error);

      alert(
        error.response?.data?.message ||
          "Failed to add workout"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this workout?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/workouts/${id}`);

      setWorkouts(
        workouts.filter((workout) => workout._id !== id)
      );

      alert("Workout deleted successfully");
    } catch (error) {
      console.error("Delete failed", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete workout"
      );
    }
  };

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header workout-page-header">
        <div>
          <h1>Workouts</h1>
          <p>
            Track and manage your fitness activities
          </p>
        </div>

        <button
          className="add-workout-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          Add Workout
        </button>
      </div>

      {/* Add Workout Form */}
      {showForm && (
        <div className="workout-form-card">

          <div className="workout-form-header">
            <div>
              <h2>Add New Workout</h2>
              <p>Record your workout details</p>
            </div>

            <button
              className="close-form-btn"
              onClick={() => setShowForm(false)}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="workout-form-grid">

              <div className="form-group">
                <label>Workout Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Running"
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration (minutes)</label>

                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Example: 30"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Calories Burned</label>

                <input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleChange}
                  placeholder="Example: 250"
                  min="0"
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              className="save-workout-btn"
            >
              <Plus size={18} />
              Add Workout
            </button>

          </form>
        </div>
      )}

      {/* Workout List */}
      <div className="workouts-section">

        <div className="section-title">
          <div>
            <h2>Recent Workouts</h2>
            <p>Your latest fitness activities</p>
          </div>
        </div>

        {loading ? (
          <div className="empty-workouts">
            Loading workouts...
          </div>
        ) : workouts.length === 0 ? (
          <div className="empty-workouts">

            <div className="empty-workout-icon">
              <Dumbbell size={30} />
            </div>

            <h3>No workouts yet</h3>

            <p>
              Start tracking your workouts to see them here.
            </p>

            <button
              className="add-workout-btn"
              onClick={() => setShowForm(true)}
            >
              <Plus size={18} />
              Add Your First Workout
            </button>

          </div>
        ) : (
          <div className="workout-list">

            {workouts.map((workout) => (
              <div
                className="workout-item"
                key={workout._id}
              >

                <div className="workout-icon">
                  <Dumbbell size={22} />
                </div>

                <div className="workout-info">
                  <h3>
                    {workout.name || "Workout"}
                  </h3>

                  <div className="workout-details">

                    <span>
                      <Clock size={15} />
                      {workout.duration || 0} min
                    </span>

                    <span>
                      <Flame size={15} />
                      {workout.calories || 0} kcal
                    </span>

                  </div>
                </div>

                <button
                  className="delete-workout-btn"
                  onClick={() =>
                    handleDelete(workout._id)
                  }
                  title="Delete workout"
                >
                  <Trash2 size={18} />
                </button>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Workouts;