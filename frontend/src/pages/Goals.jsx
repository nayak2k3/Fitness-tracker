import { useEffect, useState } from "react";
import { Target, Plus, Trash2, X } from "lucide-react";
import api from "../services/api";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    target: "",
    unit: "",
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await api.get("/goals");

      const data = response.data;

      if (Array.isArray(data)) {
        setGoals(data);
      } else if (Array.isArray(data.goals)) {
        setGoals(data.goals);
      } else {
        setGoals([]);
      }
    } catch (error) {
      console.error("Failed to load goals", error);
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
      await api.post("/goals", {
        title: formData.title,
        target: Number(formData.target),
        unit: formData.unit,
      });

      alert("Goal added successfully");

      setFormData({
        title: "",
        target: "",
        unit: "",
      });

      setShowForm(false);
      fetchGoals();
    } catch (error) {
      console.error("Failed to add goal", error);

      alert(
        error.response?.data?.message ||
          "Failed to add goal"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this goal?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/goals/${id}`);

      setGoals(
        goals.filter((goal) => goal._id !== id)
      );

      alert("Goal deleted successfully");
    } catch (error) {
      console.error("Delete failed", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete goal"
      );
    }
  };

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header workout-page-header">
        <div>
          <h1>Goals</h1>
          <p>
            Set and track your fitness goals
          </p>
        </div>

        <button
          className="add-workout-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          Add Goal
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="workout-form-card">

          <div className="workout-form-header">
            <div>
              <h2>Add New Goal</h2>
              <p>
                Create a target for your fitness journey
              </p>
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
                <label>Goal Name</label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Example: Daily Steps"
                  required
                />
              </div>

              <div className="form-group">
                <label>Target</label>

                <input
                  type="number"
                  name="target"
                  value={formData.target}
                  onChange={handleChange}
                  placeholder="Example: 10000"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Unit</label>

                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="Example: steps"
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              className="save-workout-btn"
            >
              <Plus size={18} />
              Add Goal
            </button>

          </form>
        </div>
      )}

      {/* Goals */}
      <div className="workouts-section">

        <div className="section-title">
          <div>
            <h2>My Goals</h2>
            <p>
              Keep working towards your targets
            </p>
          </div>
        </div>

        {loading ? (
          <div className="empty-workouts">
            Loading goals...
          </div>
        ) : goals.length === 0 ? (
          <div className="empty-workouts">

            <div className="empty-workout-icon">
              <Target size={30} />
            </div>

            <h3>No goals yet</h3>

            <p>
              Create your first fitness goal.
            </p>

            <button
              className="add-workout-btn"
              onClick={() => setShowForm(true)}
            >
              <Plus size={18} />
              Add Your First Goal
            </button>

          </div>
        ) : (
          <div className="workout-list">

            {goals.map((goal) => (
              <div
                className="workout-item"
                key={goal._id}
              >

                <div className="workout-icon">
                  <Target size={22} />
                </div>

                <div className="workout-info">
                  <h3>
                    {goal.title || goal.name}
                  </h3>

                  <div className="workout-details">
                    <span>
                      Target: {goal.target}{" "}
                      {goal.unit}
                    </span>
                  </div>
                </div>

                <button
                  className="delete-workout-btn"
                  onClick={() =>
                    handleDelete(goal._id)
                  }
                  title="Delete goal"
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

export default Goals;