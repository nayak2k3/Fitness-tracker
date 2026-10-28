import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Droplets,
  Flame,
  Target,
  Scale,
  Dumbbell,
  LogOut,
  User,
  CalendarDays,
  TrendingUp,
  CheckCircle,
  Clock,
} from "lucide-react";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [water, setWater] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [workouts, setWorkouts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const results = await Promise.allSettled([
        api.get("/profile"),
        api.get("/stats"),
        api.get("/stats/weekly"),
        api.get("/bmi"),
        api.get("/water/today"),
        api.get("/dashboard"),
        api.get("/workouts/recent"),
      ]);

      if (results[0].status === "fulfilled") {
        setProfile(results[0].value.data?.user || results[0].value.data);
      }

      if (results[1].status === "fulfilled") {
        setStats(results[1].value.data);
      }

      if (results[2].status === "fulfilled") {
        setWeekly(results[2].value.data);
      }

      if (results[3].status === "fulfilled") {
        setBmi(results[3].value.data);
      }

      if (results[4].status === "fulfilled") {
        setWater(results[4].value.data);
      }

      if (results[5].status === "fulfilled") {
        setDashboard(results[5].value.data);
      }

      if (results[6].status === "fulfilled") {
        const data = results[6].value.data;

        setWorkouts(
          data?.workouts ||
            data?.recentWorkouts ||
            data?.data ||
            (Array.isArray(data) ? data : [])
        );
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getValue = (...values) => {
    for (const value of values) {
      if (value !== undefined && value !== null) {
        return value;
      }
    }

    return 0;
  };

  const userName = profile?.name || "User";

  const steps = getValue(
    stats?.steps,
    stats?.today?.steps,
    dashboard?.steps
  );

  const calories = getValue(
    stats?.calories,
    stats?.today?.calories,
    dashboard?.calories
  );

  const workoutsCount = getValue(
    stats?.workouts,
    stats?.workoutCount,
    dashboard?.workouts,
    dashboard?.workoutCount
  );

  const waterConsumed = getValue(
    water?.consumed,
    water?.amount,
    water?.water,
    water?.today
  );

  const waterTarget = getValue(
    water?.target,
    water?.goal,
    water?.dailyTarget
  );

  const bmiValue = getValue(
    bmi?.bmi,
    bmi?.value,
    dashboard?.bmi
  );

  const bmiStatus =
    bmi?.status ||
    bmi?.category ||
    dashboard?.bmiStatus ||
    "Normal";

  const weeklyData =
    weekly?.data ||
    weekly?.weekly ||
    weekly?.stats ||
    (Array.isArray(weekly) ? weekly : []);

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-icon">
            <Dumbbell size={24} />
          </div>

          <span>FitTrack</span>
        </div>

        <nav className="sidebar-nav">

          <button className="nav-item active">
            <Activity size={19} />
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/profile")}
          >
            <User size={19} />
            Profile
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/workouts")}
          >
            <Dumbbell size={19} />
            Workouts
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/goals")}
          >
            <Target size={19} />
            Goals
          </button>

        </nav>

        <button className="logout-button" onClick={logout}>
          <LogOut size={19} />
          Logout
        </button>

      </aside>

      {/* MAIN */}
      <main className="dashboard-main">

        {/* HEADER */}
        <header className="dashboard-header">

          <div>
            <p className="small-text">Good day 👋</p>

            <h1>
              Welcome back, {userName}
            </h1>

            <p className="header-description">
              Here's your fitness overview for today.
            </p>
          </div>

          <div className="header-profile">
            <div className="profile-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{userName}</strong>
              <span>Fitness Member</span>
            </div>
          </div>

        </header>

        {loading ? (

          <div className="loading-box">
            <div className="loading-spinner"></div>
            <p>Loading your fitness data...</p>
          </div>

        ) : (

          <>
            {/* STATS */}
            <section className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon purple">
                  <Activity size={23} />
                </div>

                <div>
                  <span>Steps</span>
                  <h2>{steps}</h2>
                  <small>Today's steps</small>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon orange">
                  <Flame size={23} />
                </div>

                <div>
                  <span>Calories</span>
                  <h2>{calories}</h2>
                  <small>Calories burned</small>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon blue">
                  <Dumbbell size={23} />
                </div>

                <div>
                  <span>Workouts</span>
                  <h2>{workoutsCount}</h2>
                  <small>Completed workouts</small>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon green">
                  <Droplets size={23} />
                </div>

                <div>
                  <span>Water</span>
                  <h2>{waterConsumed}</h2>
                  <small>
                    {waterTarget
                      ? `Goal: ${waterTarget}`
                      : "Today's intake"}
                  </small>
                </div>

              </div>

            </section>


            {/* MIDDLE SECTION */}
            <section className="dashboard-grid">

              {/* BMI */}
              <div className="dashboard-card bmi-card">

                <div className="card-header">

                  <div>
                    <h3>BMI Overview</h3>
                    <p>Your current body measurement</p>
                  </div>

                  <div className="card-icon">
                    <Scale size={21} />
                  </div>

                </div>

                <div className="bmi-content">

                  <div className="bmi-number">
                    {bmiValue || "--"}
                  </div>

                  <div className="bmi-status">
                    <CheckCircle size={18} />
                    {bmiStatus}
                  </div>

                </div>

                <div className="bmi-bar">
                  <div className="bmi-progress"></div>
                </div>

                <div className="bmi-labels">
                  <span>Underweight</span>
                  <span>Normal</span>
                  <span>Overweight</span>
                </div>

              </div>


              {/* WATER */}
              <div className="dashboard-card">

                <div className="card-header">

                  <div>
                    <h3>Water Intake</h3>
                    <p>Stay hydrated throughout the day</p>
                  </div>

                  <div className="card-icon blue-bg">
                    <Droplets size={21} />
                  </div>

                </div>

                <div className="water-content">

                  <div className="water-circle">

                    <div>
                      <strong>{waterConsumed}</strong>
                      <span>ml</span>
                    </div>

                  </div>

                  <div className="water-info">

                    <h4>
                      {waterTarget
                        ? `${waterTarget} ml goal`
                        : "Daily goal"}
                    </h4>

                    <p>
                      {waterTarget && waterConsumed
                        ? `${Math.min(
                            100,
                            Math.round(
                              (Number(waterConsumed) /
                                Number(waterTarget)) *
                                100
                            )
                          )}% completed`
                        : "Keep drinking water"}
                    </p>

                  </div>

                </div>

              </div>

            </section>


            {/* WEEKLY */}
            <section className="dashboard-card weekly-card">

              <div className="card-header">

                <div>
                  <h3>Weekly Activity</h3>
                  <p>Your workout activity over the week</p>
                </div>

                <div className="card-icon green-bg">
                  <TrendingUp size={21} />
                </div>

              </div>

              <div className="weekly-chart">

                {weeklyData.length > 0 ? (

                  weeklyData.map((item, index) => {

                    const value = Number(
                      item?.workouts ||
                      item?.count ||
                      item?.value ||
                      item?.calories ||
                      0
                    );

                    const day =
                      item?.day ||
                      item?.date ||
                      ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
                        index
                      ];

                    const height = Math.min(
                      100,
                      Math.max(8, value * 8)
                    );

                    return (
                      <div className="chart-column" key={index}>

                        <div className="chart-value">
                          {value}
                        </div>

                        <div className="chart-bar-container">
                          <div
                            className="chart-bar"
                            style={{ height: `${height}%` }}
                          ></div>
                        </div>

                        <span>{day}</span>

                      </div>
                    );
                  })

                ) : (

                  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <div className="chart-column" key={day}>

                        <div className="chart-value">0</div>

                        <div className="chart-bar-container">
                          <div
                            className="chart-bar"
                            style={{ height: "8%" }}
                          ></div>
                        </div>

                        <span>{day}</span>

                      </div>
                    )
                  )
                )}

              </div>

            </section>


            {/* RECENT WORKOUTS */}
            <section className="dashboard-card">

              <div className="card-header">

                <div>
                  <h3>Recent Workouts</h3>
                  <p>Your latest fitness activities</p>
                </div>

                <button
                  className="view-all-button"
                  onClick={() => navigate("/workouts")}
                >
                  View All
                </button>

              </div>

              {workouts.length > 0 ? (

                <div className="workout-list">

                  {workouts.slice(0, 5).map((workout, index) => (

                    <div className="workout-item" key={workout._id || index}>

                      <div className="workout-icon">
                        <Dumbbell size={19} />
                      </div>

                      <div className="workout-details">

                        <strong>
                          {workout.name ||
                            workout.title ||
                            workout.type ||
                            "Workout"}
                        </strong>

                        <span>
                          {workout.duration
                            ? `${workout.duration} minutes`
                            : "Fitness activity"}
                        </span>

                      </div>

                      <div className="workout-date">

                        <Clock size={15} />

                        {workout.date
                          ? new Date(
                              workout.date
                            ).toLocaleDateString()
                          : "Recent"}

                      </div>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="empty-state">

                  <Dumbbell size={35} />

                  <h4>No recent workouts</h4>

                  <p>
                    Start your first workout to see it here.
                  </p>

                  <button
                    className="primary-button"
                    onClick={() => navigate("/workouts")}
                  >
                    Add Workout
                  </button>

                </div>

              )}

            </section>


            {/* QUICK ACTIONS */}
            <section className="quick-actions">

              <button
                onClick={() => navigate("/workouts")}
                className="quick-action"
              >
                <Dumbbell size={22} />
                <div>
                  <strong>Log Workout</strong>
                  <span>Record today's exercise</span>
                </div>
              </button>

              <button
                onClick={() => navigate("/goals")}
                className="quick-action"
              >
                <Target size={22} />
                <div>
                  <strong>Manage Goals</strong>
                  <span>Track your fitness goals</span>
                </div>
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="quick-action"
              >
                <CalendarDays size={22} />
                <div>
                  <strong>My Profile</strong>
                  <span>Update your information</span>
                </div>
              </button>

            </section>

          </>
        )}

      </main>

    </div>
  );
}

export default Dashboard;