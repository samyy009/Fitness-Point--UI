import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  Dumbbell, 
  Flame, 
  Apple, 
  CheckSquare, 
  TrendingUp, 
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    workoutsCount: 0,
    caloriesBurned: 0,
    mealsCount: 0,
    caloriesConsumed: 0,
    completedHabits: 0,
    totalHabits: 0,
    currentWeight: 'N/A'
  });
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [recentMeals, setRecentMeals] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [wRes, mRes, hRes, pRes] = await Promise.all([
          api.get('/workouts'),
          api.get('/meals'),
          api.get('/habits'),
          api.get('/progress')
        ]);

        const workouts = wRes.data;
        const totalBurned = workouts.reduce((sum, w) => sum + (Number(w.calories) || 0), 0);

        const meals = mRes.data;
        const totalConsumed = meals.reduce((sum, m) => sum + (Number(m.total_calories) || 0), 0);

        const habits = hRes.data;
        const completed = habits.filter(h => h.completed).length;

        const progress = pRes.data;
        const currentWeight = progress.length > 0 ? `${progress[progress.length - 1].weight} kg` : 'N/A';

        setStats({
          workoutsCount: workouts.length,
          caloriesBurned: totalBurned,
          mealsCount: meals.length,
          caloriesConsumed: totalConsumed,
          completedHabits: completed,
          totalHabits: habits.length,
          currentWeight
        });

        setRecentWorkouts(workouts.slice(0, 3));
        setRecentMeals(meals.slice(0, 3));

        const dateMap = {};
        workouts.forEach(w => {
          const dStr = new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (!dateMap[dStr]) dateMap[dStr] = { date: dStr, burned: 0, consumed: 0 };
          dateMap[dStr].burned += Number(w.calories) || 0;
        });

        meals.forEach(m => {
          const dStr = new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (!dateMap[dStr]) dateMap[dStr] = { date: dStr, burned: 0, consumed: 0 };
          dateMap[dStr].consumed += Number(m.total_calories) || 0;
        });

        const sortedChartData = Object.values(dateMap).slice(-7);
        if (sortedChartData.length === 0) {
          setChartData([
            { date: 'Mon', burned: 300, consumed: 1800 },
            { date: 'Tue', burned: 450, consumed: 2100 },
            { date: 'Wed', burned: 200, consumed: 1950 },
            { date: 'Thu', burned: 600, consumed: 2200 },
            { date: 'Fri', burned: 400, consumed: 1850 },
            { date: 'Sat', burned: 500, consumed: 2400 },
            { date: 'Sun', burned: 0, consumed: 1700 }
          ]);
        } else {
          setChartData(sortedChartData);
        }

      } catch (err) {
        console.error('Error fetching dashboard summaries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'grid', gap: '2rem' }}
    >
      <div className="dash-stats-grid">
        <motion.div className="stat-card" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <div className="stat-icon" style={{ background: 'rgba(0,229,255,0.1)', color: 'var(--primary)' }}>
            <Dumbbell size={20} />
          </div>
          <div>
            <div className="stat-value">{stats.workoutsCount}</div>
            <div className="stat-label">Workouts Logged</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <div className="stat-icon" style={{ background: 'rgba(255,56,96,0.1)', color: 'var(--danger)' }}>
            <Flame size={20} />
          </div>
          <div>
            <div className="stat-value">{stats.caloriesBurned} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>kcal</span></div>
            <div className="stat-label">Total Burned</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <div className="stat-icon" style={{ background: 'rgba(0,214,143,0.1)', color: 'var(--success)' }}>
            <Apple size={20} />
          </div>
          <div>
            <div className="stat-value">{stats.caloriesConsumed} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>kcal</span></div>
            <div className="stat-label">Calories Eaten</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <div className="stat-icon" style={{ background: 'rgba(168,85,247,0.1)', color: 'var(--accent-2)' }}>
            <CheckSquare size={20} />
          </div>
          <div>
            <div className="stat-value">{stats.completedHabits}/{stats.totalHabits}</div>
            <div className="stat-label">Habits Today</div>
          </div>
        </motion.div>
      </div>

      <div className="card-glass" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Activity & Calorie Flow</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Comparison of calories consumed vs calories burned</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)' }}>
              <span style={{ width: 10, height: 10, background: 'var(--primary)', borderRadius: '50%', display: 'inline-block' }} /> Burned
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--success)' }}>
              <span style={{ width: 10, height: 10, background: 'var(--success)', borderRadius: '50%', display: 'inline-block' }} /> Consumed
            </span>
          </div>
        </div>
        
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBurned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConsumed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ background: 'var(--dark-3)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: '8px' }}
                labelStyle={{ fontWeight: 'bold', color: '#fff' }}
              />
              <Area type="monotone" dataKey="burned" name="Burned (kcal)" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorBurned)" />
              <Area type="monotone" dataKey="consumed" name="Consumed (kcal)" stroke="var(--success)" strokeWidth={2} fillOpacity={1} fill="url(#colorConsumed)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <div className="card-glass" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Recent Workouts</h3>
            <Link to="/dashboard/workouts" style={{ color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          
          {recentWorkouts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No workouts logged yet. Start today!
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {recentWorkouts.map(w => (
                <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--dark-3)', padding: '1rem', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 'var(--radius)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{w.exercises?.length || 0} Exercises</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} /> {new Date(w.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-primary">{w.duration} mins</span>
                    <p style={{ fontSize: '0.82rem', color: 'var(--danger)', marginTop: '0.35rem', fontWeight: 'bold' }}>🔥 {w.calories} kcal</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-glass" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Recent Meal Logs</h3>
            <Link to="/dashboard/meals" style={{ color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          {recentMeals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No meals logged yet. Start eating healthy!
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {recentMeals.map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--dark-3)', padding: '1rem', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 'var(--radius)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{m.meals?.length || 0} Items Logged</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} /> {new Date(m.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-success">{m.total_calories} kcal</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-glass" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem' }}>Body Metrics</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Current Weight</span>
              <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>{stats.currentWeight}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Target Goal</span>
              <strong style={{ color: 'var(--white)', fontSize: '0.95rem' }}>Stay Healthy</strong>
            </div>
          </div>
          
          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/dashboard/progress" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              <TrendingUp size={14} /> Update Progress Metrics
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
