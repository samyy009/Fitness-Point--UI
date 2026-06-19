import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ChatbotWidget from './components/ChatbotWidget';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Classes from './pages/Classes';
import Trainers from './pages/Trainers';
import Plans from './pages/Plans';
import Store from './pages/Store';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Workouts from './pages/dashboard/Workouts';
import Meals from './pages/dashboard/Meals';
import Habits from './pages/dashboard/Habits';
import Progress from './pages/dashboard/Progress';
import Profile from './pages/dashboard/Profile';
import BmiCalculator from './pages/dashboard/BmiCalculator';
import CalorieCalculator from './pages/dashboard/CalorieCalculator';
import WaterTracker from './pages/dashboard/WaterTracker';
import TrainerBooking from './pages/dashboard/TrainerBooking';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageTrainers from './pages/admin/ManageTrainers';
import ManageClasses from './pages/admin/ManageClasses';
import ManagePlans from './pages/admin/ManagePlans';
import ManageBlog from './pages/admin/ManageBlog';
import ManageMessages from './pages/admin/ManageMessages';
import ManageBookings from './pages/admin/ManageBookings';
import ManageGallery from './pages/admin/ManageGallery';

import ScrollToTopButton from './components/ScrollToTopButton';

export default function App() {
  return (
    <>
      <Routes>
        {/* Public with Navbar/Footer */}
        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
        <Route path="/classes" element={<><Navbar /><Classes /><Footer /></>} />
        <Route path="/trainers" element={<><Navbar /><Trainers /><Footer /></>} />
        <Route path="/plans" element={<><Navbar /><Plans /><Footer /></>} />
        <Route path="/store" element={<><Navbar /><Store /><Footer /></>} />
        <Route path="/blog" element={<><Navbar /><Blog /><Footer /></>} />
        <Route path="/blog/:slug" element={<><Navbar /><BlogPost /><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="workouts" element={<Workouts />} />
          <Route path="meals" element={<Meals />} />
          <Route path="habits" element={<Habits />} />
          <Route path="progress" element={<Progress />} />
          <Route path="profile" element={<Profile />} />
          <Route path="bmi" element={<BmiCalculator />} />
          <Route path="calories" element={<CalorieCalculator />} />
          <Route path="water" element={<WaterTracker />} />
          <Route path="booking" element={<TrainerBooking />} />
        </Route>

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="trainers" element={<ManageTrainers />} />
          <Route path="classes" element={<ManageClasses />} />
          <Route path="plans" element={<ManagePlans />} />
          <Route path="blog" element={<ManageBlog />} />
          <Route path="messages" element={<ManageMessages />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="gallery" element={<ManageGallery />} />
        </Route>
      </Routes>
      <ChatbotWidget />
      <ScrollToTopButton />
    </>
  );
}
