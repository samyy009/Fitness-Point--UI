import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ChevronRight, Play, Users, Star, Clock, 
  Dumbbell, Shield, Award, Calendar, Heart, Zap, Sparkles, Scale 
} from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }
});

export default function Home() {
  const navigate = useNavigate();
  const [activeScheduleTab, setActiveScheduleTab] = useState('Monday');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  const [bookingModalTrainer, setBookingModalTrainer] = useState(null);
  const [bookingForm, setBookingForm] = useState({ date: '', time: '', notes: '' });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Why Choose Us features
  const whyChooseUs = [
    { icon: <Award size={28} className="gradient-text" />, title: 'Expert Trainers', desc: 'Certified professionals with years of experience.' },
    { icon: <Dumbbell size={28} className="gradient-text" />, title: 'Advanced Equipment', desc: 'Latest machines and training facilities.' },
    { icon: <Zap size={28} className="gradient-text" />, title: 'Customized Programs', desc: 'Workout plans designed for individual goals.' },
    { icon: <Heart size={28} className="gradient-text" />, title: 'Nutrition Guidance', desc: 'Personal diet plans from nutrition experts.' },
    { icon: <Clock size={28} className="gradient-text" />, title: 'Flexible Timings', desc: 'Gym open from early morning to late night.' },
    { icon: <Sparkles size={28} className="gradient-text" />, title: 'Affordable Pricing', desc: 'Multiple membership plans to suit any budget.' },
  ];

  // Programs list
  const programs = [
    { id: 'weight', title: 'Weight Training', desc: 'Build strength, tone muscles, and increase bone density.', icon: '🏋️', path: '/classes?cat=strength' },
    { id: 'cardio', title: 'Cardio Workout', desc: 'Improve cardiovascular health, burn fat, and increase stamina.', icon: '🏃', path: '/classes?cat=cardio' },
    { id: 'personal', title: 'Personal Training', desc: 'One-on-one sessions with our certified trainers for fast results.', icon: '🤝', path: '/classes?cat=personal' },
    { id: 'yoga', title: 'Yoga & Flexibility', desc: 'Enhance flexibility, balance, and mental wellness.', icon: '🧘', path: '/classes?cat=yoga' },
    { id: 'zumba', title: 'Zumba & Dance', desc: 'Fun, high-energy workouts set to rhythmic music.', icon: '💃', path: '/classes?cat=zumba' },
    { id: 'functional', title: 'Functional Training', desc: 'Improve everyday movement, stability, and core strength.', icon: '⚡', path: '/classes?cat=functional' },
  ];

  // Membership plans
  const plans = [
    {
      name: 'Basic Plan',
      price: '₹999',
      features: [
        'Gym Access during off-peak hours',
        'Basic Workout Plan',
        'Locker Room Access',
        '1 Fitness Assessment'
      ],
      popular: false
    },
    {
      name: 'Standard Plan',
      price: '₹1,999',
      features: [
        '24/7 Gym Access',
        'Customized Workout Plan',
        'Group Classes Access',
        'Monthly Progress Reports',
        '2 Fitness Assessments/month'
      ],
      popular: true
    },
    {
      name: 'Premium Plan',
      price: '₹3,499',
      features: [
        '24/7 Gym Access',
        'Customized Workout & Diet Plan',
        'Personal Trainer (2 sessions/week)',
        'Locker & Towel Service',
        'Unlimited Group Classes & Steam Bath'
      ],
      popular: false
    }
  ];

  // Expert trainers
  const trainers = [
    { id: 1, name: 'John Doe', role: 'Head Trainer', certs: 'ISSA Certified', exp: '8+ Years Experience', img: '/assets/mentor-1.jpg' },
    { id: 2, name: 'Jane Smith', role: 'Nutrition & Cardio Specialist', certs: 'ACE Certified', exp: '6+ Years Experience', img: '/assets/mentor-2.jpg' },
    { id: 3, name: 'Mike Johnson', role: 'Strength & Conditioning Coach', certs: 'CSCS Certified', exp: '5+ Years Experience', img: '/assets/mentor-3.jpg' },
    { id: 4, name: 'Sarah Lee', role: 'Yoga & Pilates Instructor', certs: 'RYT-500 Certified', exp: '7+ Years Experience', img: '/assets/facility.jpg' } // Using facility if mentor-4 is missing
  ];

  // Schedule timetable data
  const scheduleData = {
    Monday: [
      { time: '6:00 AM - 7:00 AM', program: 'Cardio Blast', trainer: 'Jane Smith' },
      { time: '8:00 AM - 9:00 AM', program: 'Weight Training', trainer: 'John Doe' },
      { time: '10:00 AM - 11:00 AM', program: 'Yoga & Pilates', trainer: 'Sarah Lee' },
      { time: '4:00 PM - 5:00 PM', program: 'Zumba & Dance', trainer: 'Jane Smith' },
      { time: '6:00 PM - 7:00 PM', program: 'Functional Training', trainer: 'Mike Johnson' }
    ],
    Tuesday: [
      { time: '6:00 AM - 7:00 AM', program: 'Weight Training', trainer: 'John Doe' },
      { time: '8:00 AM - 9:00 AM', program: 'Cardio Blast', trainer: 'Jane Smith' },
      { time: '10:00 AM - 11:00 AM', program: 'Functional Training', trainer: 'Mike Johnson' },
      { time: '4:00 PM - 5:00 PM', program: 'Yoga & Pilates', trainer: 'Sarah Lee' },
      { time: '6:00 PM - 7:00 PM', program: 'Zumba & Dance', trainer: 'Jane Smith' }
    ],
    Wednesday: [
      { time: '6:00 AM - 7:00 AM', program: 'Cardio Blast', trainer: 'Jane Smith' },
      { time: '8:00 AM - 9:00 AM', program: 'Weight Training', trainer: 'John Doe' },
      { time: '10:00 AM - 11:00 AM', program: 'Yoga & Pilates', trainer: 'Sarah Lee' },
      { time: '4:00 PM - 5:00 PM', program: 'Zumba & Dance', trainer: 'Jane Smith' },
      { time: '6:00 PM - 7:00 PM', program: 'Functional Training', trainer: 'Mike Johnson' }
    ],
    Thursday: [
      { time: '6:00 AM - 7:00 AM', program: 'Weight Training', trainer: 'John Doe' },
      { time: '8:00 AM - 9:00 AM', program: 'Cardio Blast', trainer: 'Jane Smith' },
      { time: '10:00 AM - 11:00 AM', program: 'Functional Training', trainer: 'Mike Johnson' },
      { time: '4:00 PM - 5:00 PM', program: 'Yoga & Pilates', trainer: 'Sarah Lee' },
      { time: '6:00 PM - 7:00 PM', program: 'Zumba & Dance', trainer: 'Jane Smith' }
    ],
    Friday: [
      { time: '6:00 AM - 7:00 AM', program: 'Cardio Blast', trainer: 'Jane Smith' },
      { time: '8:00 AM - 9:00 AM', program: 'Weight Training', trainer: 'John Doe' },
      { time: '10:00 AM - 11:00 AM', program: 'Yoga & Pilates', trainer: 'Sarah Lee' },
      { time: '4:00 PM - 5:00 PM', program: 'Zumba & Dance', trainer: 'Jane Smith' },
      { time: '6:00 PM - 7:00 PM', program: 'Functional Training', trainer: 'Mike Johnson' }
    ],
    Saturday: [
      { time: '8:00 AM - 9:30 AM', program: 'Functional Training', trainer: 'Mike Johnson' },
      { time: '10:00 AM - 11:30 AM', program: 'Yoga & Pilates', trainer: 'Sarah Lee' },
      { time: '12:00 PM - 1:00 PM', program: 'Zumba & Dance', trainer: 'Jane Smith' },
      { time: '3:00 PM - 4:30 PM', program: 'Weight Training Masterclass', trainer: 'John Doe' }
    ]
  };

  // Before-After Transformations
  const transformations = [
    { name: 'Alex M.', change: 'Lost 20kg in 6 Months', before: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400', after: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400' },
    { name: 'Emily R.', change: 'Toned body & built muscle in 4 Months', before: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=400', after: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=400' },
    { name: 'Mark T.', change: 'Gained 10kg muscle mass in 5 Months', before: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400', after: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400' },
    { name: 'Jessica W.', change: 'Improved flexibility & core strength in 3 Months', before: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=400', after: 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=400' }
  ];

  // Testimonials
  const testimonials = [
    { name: 'Rohan S.', text: 'Fitness Point has completely changed my life. The trainers are highly knowledgeable, and the community is super supportive!', rating: 5 },
    { name: 'Priya K.', text: 'The best gym in the city! The equipment is top-notch, and the customized diet plans helped me lose weight in no time.', rating: 5 },
    { name: 'Ananya M.', text: "Love the group classes, especially Zumba and Yoga. It's the highlight of my day!", rating: 5 },
    { name: 'Vikram D.', text: 'Highly professional environment. The personal training sessions are intense but totally worth it.', rating: 5 }
  ];

  // Calculate BMI Logic
  const handleCalculateBmi = (e) => {
    e.preventDefault();
    if (!height || !weight) return;
    const heightVal = parseFloat(height);
    const weightVal = parseFloat(weight);
    if (heightVal <= 0 || weightVal <= 0) return;

    const heightInMeters = heightVal / 100;
    const weightInKg = weightVal;
    const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
    
    let category = '';
    let healthTip = '';
    
    if (bmi < 18.5) {
      category = 'Underweight';
      healthTip = 'Consider consultation with a nutritionist to design a structured calorie-surplus diet plan to gain muscle safely.';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal';
      healthTip = 'Great job! Maintain your current BMI with balanced exercise and a nutrient-rich nutrition plan.';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      healthTip = 'Incorporate at least 3 high-intensity cardio classes per week along with portion control for a healthy weight loss.';
    } else {
      category = 'Obese';
      healthTip = 'Consult our certified trainers to formulate a low-impact, sustainable personal training and calorie-deficit regime.';
    }
    
    setBmiResult({ value: bmi, category, healthTip });
  };

  // Trainer Booking submit
  const handleTrainerBooking = (e) => {
    e.preventDefault();
    // Simulate API request
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModalTrainer(null);
      setBookingForm({ date: '', time: '', notes: '' });
    }, 2000);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="hero home-hero" style={{ 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        minHeight: '100vh',
        position: 'relative'
      }}>
        <div className="hero-bg-text">PULSE</div>
        <div className="container hero-content">
          <div className="hero-grid">
            {/* Left Column */}
            <div>
              <motion.div
                className="hero-tag"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span style={{ width: 6, height: 6, background: 'var(--primary)', borderRadius: '50%', display: 'inline-block' }} />
                DON'T STOP TILL YOUR SUCCESS!
              </motion.div>

              <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
              >
                Transform Your Body, <br />
                <span className="gradient-text">Elevate Your Life</span>
              </motion.h1>

              <motion.p
                className="hero-subtitle"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ fontSize: '1.05rem', color: 'var(--text-light)', opacity: 0.9 }}
              >
                Professional trainers, personalized workout plans, and modern equipment to help you achieve your fitness goals.
              </motion.p>

              <motion.div
                className="hero-btns"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
              >
                <Link to="/register" className="btn btn-primary btn-lg btn-shine">
                  Join Now <ArrowRight size={18} />
                </Link>
              </motion.div>

              <motion.div
                className="hero-stats"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '3rem', maxWidth: '450px' }}
              >
                {[
                  { val: '500+', label: 'Active Members' },
                  { val: '20+', label: 'Certified Trainers' },
                  { val: '10+', label: 'Fitness Programs' },
                  { val: '5+', label: 'Years Experience' },
                ].map((s, i) => (
                  <div key={i} className="hero-stat" style={{ borderLeft: '2.5px solid var(--primary)', paddingLeft: '0.85rem' }}>
                    <div className="hero-stat-val" style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary)' }}>{s.val}</div>
                    <div className="hero-stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="hero-img-wrap">
              <img
                src="/assets/header.png"
                alt="Fitness Hero"
                loading="eager"
                style={{ maxWidth: '90%', height: 'auto', margin: '0 auto' }}
              />
              <div className="hero-img-badge top">
                <Users size={16} color="var(--primary)" />
                <div><strong>500+ Members</strong><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active this month</div></div>
              </div>
              <div className="hero-img-badge bottom">
                <Star size={16} color="var(--warning)" />
                <div><strong>4.9 Rating</strong><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trusted by athletes</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Fitness Point Section ─────────────────────────────────── */}
      <section className="section" id="about" style={{ background: 'var(--dark-2)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'center' }}>
          <motion.div {...fadeUp(0)} style={{ position: 'relative' }}>
            <img
              src="/assets/about.png"
              alt="About Fitness Point"
              loading="lazy"
              style={{
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                filter: 'brightness(1.1) drop-shadow(0 0 30px rgba(0,229,255,0.15))'
              }}
            />
            <div style={{
              position: 'absolute', bottom: '-1rem', right: '-1rem',
              background: 'var(--grad-2)', borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 2rem', textAlign: 'center',
              boxShadow: '0 8px 30px rgba(0,229,255,0.3)'
            }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--dark)' }}>5+</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark)', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Years Experience</div>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.15)}>
            <div className="section-tag">About Fitness Point</div>
            <h2 className="section-title" style={{ marginBottom: '1.5rem', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>Transform Your Gym Journey</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem', lineHeight: '1.8', fontSize: '1.05rem' }}>
              Fitness Point is a modern fitness center dedicated to helping individuals achieve their health and fitness goals through expert guidance, advanced equipment, and personalized training programs.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
              {[
                { title: 'Certified Trainers', desc: 'Expert guides' },
                { title: 'Modern Equipment', desc: 'State of the art' },
                { title: 'Personalized Diet Plans', desc: 'Tailored for you' },
                { title: 'Flexible Memberships', desc: 'Multiple options' },
                { title: 'Group Classes', desc: 'High energy' },
                { title: 'Fitness Assessments', desc: 'Track progress' },
              ].map((feat, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--dark-3)', border: '1px solid rgba(0,229,255,0.08)', borderRadius: 'var(--radius)', padding: '1rem' }}>
                  <span style={{ fontSize: '1.5rem', background: 'rgba(0,229,255,0.1)', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✓</span>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--white)' }}>{feat.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
              Get Started Now <ChevronRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us Section ────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <div className="section-tag">Why Fitness Point</div>
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-subtitle">We provide top-tier support and state-of-the-art facilities to streamline your training and yield results.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {whyChooseUs.map((w, idx) => (
              <motion.div
                key={idx}
                className="card"
                {...fadeUp(idx * 0.08)}
                whileHover={{ scale: 1.02 }}
                style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(0,229,255,0.08)' }}
              >
                <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius)', background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {w.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{w.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.6' }}>{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BMI Calculator Section ────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '4rem', alignItems: 'center' }}>
          <motion.div {...fadeUp()}>
            <div className="section-tag">Health Metrics</div>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>Calculate Your Body Mass Index (BMI)</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '2.5rem', lineHeight: '1.8' }}>
              Find out your BMI and get recommendations based on your result. BMI provides a reliable indicator of body fatness for most people and is used to screen for weight categories.
            </p>

            <form onSubmit={handleCalculateBmi} style={{ display: 'grid', gap: '1.25rem', maxWidth: '480px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Height (cm)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 175" 
                    className="form-input" 
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    min="1"
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Weight (kg)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 70" 
                    className="form-input" 
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="1"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-shine" style={{ justifyContent: 'center' }}>
                <Scale size={18} /> Calculate BMI
              </button>
            </form>
          </motion.div>

          <motion.div {...fadeUp(0.15)}>
            <AnimatePresence mode="wait">
              {bmiResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="card-premium"
                  style={{ textAlign: 'center', padding: '2.5rem', border: '1px solid var(--primary)' }}
                >
                  <div className="section-tag" style={{ background: 'rgba(0,229,255,0.15)' }}>BMI Result</div>
                  <div style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--primary)', margin: '1rem 0 0.5rem' }}>
                    {bmiResult.value}
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                    Category: <span className="gradient-text">{bmiResult.category}</span>
                  </h3>
                  <p style={{ color: 'var(--text-light)', lineHeight: '1.7', fontSize: '0.95rem', background: 'var(--dark-4)', padding: '1.25rem', borderRadius: 'var(--radius)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {bmiResult.healthTip}
                  </p>
                  <button 
                    className="btn btn-ghost btn-sm" 
                    style={{ marginTop: '1.5rem' }} 
                    onClick={() => { setBmiResult(null); setHeight(''); setWeight(''); }}
                  >
                    Reset Calculator
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="card"
                  style={{ textAlign: 'center', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderColor: 'rgba(0,229,255,0.2)' }}
                >
                  <Scale size={48} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--white)', marginBottom: '0.5rem' }}>Awaiting Metrics</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '240px' }}>Enter your height and weight on the left to review BMI and customized recommendations.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Workout Schedule Section ──────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--dark-2)' }}>
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <div className="section-tag">Daily Schedule</div>
            <h2 className="section-title">Weekly Class Schedule</h2>
            <p className="section-subtitle">Check our class timings and plan your workouts accordingly.</p>
          </motion.div>

          {/* Schedule tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {Object.keys(scheduleData).map((day) => (
              <button
                key={day}
                onClick={() => setActiveScheduleTab(day)}
                className={`btn btn-sm ${activeScheduleTab === day ? 'btn-primary' : 'btn-dark'}`}
                style={{ minWidth: '100px', justifyContent: 'center', borderRadius: '8px' }}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Schedule Table */}
          <motion.div 
            className="table-wrap" 
            layout
            style={{ maxWidth: '900px', margin: '0 auto', background: 'var(--dark-3)', border: '1px solid rgba(0,229,255,0.08)' }}
          >
            <table className="table">
              <thead>
                <tr>
                  <th>Time Slot</th>
                  <th>Fitness Class</th>
                  <th>Instructor</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData[activeScheduleTab].map((item, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={14} /> {item.time}
                      </div>
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--white)' }}>{item.program}</td>
                    <td>{item.trainer}</td>
                    <td>
                      <button 
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
                        onClick={() => navigate('/register')}
                      >
                        Book Class
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ── Transformation Gallery ────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <div className="section-tag">Transformation Gallery</div>
            <h2 className="section-title">Real Transformations, Real Results</h2>
            <p className="section-subtitle">See how our members have transformed their bodies and lives at Fitness Point.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {transformations.map((t, idx) => (
              <motion.div
                key={idx}
                className="card"
                {...fadeUp(idx * 0.1)}
                whileHover={{ scale: 1.02 }}
                style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(0,229,255,0.08)' }}
              >
                {/* Visual before/after slider mockup */}
                <div style={{ position: 'relative', height: '240px', display: 'flex' }}>
                  <div style={{ width: '50%', height: '100%', overflow: 'hidden', position: 'relative', borderRight: '2px solid var(--primary)' }}>
                    <img 
                      src={t.before} 
                      alt="Before" 
                      style={{ width: '200%', height: '100%', objectFit: 'cover', maxWidth: 'none' }} 
                      onError={(e) => { e.target.src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=200"; }}
                    />
                    <span style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold' }}>BEFORE</span>
                  </div>
                  <div style={{ width: '50%', height: '100%', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={t.after} 
                      alt="After" 
                      style={{ width: '200%', height: '100%', objectFit: 'cover', maxWidth: 'none', marginLeft: '-100%' }} 
                      onError={(e) => { e.target.src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=200"; }}
                    />
                    <span style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', background: 'var(--primary)', color: 'var(--dark)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold' }}>AFTER</span>
                  </div>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.25rem' }}>{t.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>{t.change}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Success Stories / Testimonials ─────────────────────────────── */}
      <section className="section" style={{ background: 'var(--dark-2)' }}>
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <div className="section-tag">Member Success</div>
            <h2 className="section-title">What Our Members Say</h2>
            <p className="section-subtitle">Read the experiences of our active members who achieved their goals with us.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                className="card"
                {...fadeUp(idx * 0.1)}
                whileHover={{ scale: 1.02 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--dark-3)', border: '1px solid rgba(0,229,255,0.08)' }}
              >
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="var(--warning)" color="var(--warning)" />
                  ))}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.7', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--grad-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dark)', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{t.name}</h4>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Verified Member</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trainer Booking Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {bookingModalTrainer && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBookingModalTrainer(null)}
          >
            <motion.div 
              className="modal"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '460px' }}
            >
              <div className="modal-header">
                <h3 className="modal-title">Book Personal Session</h3>
                <button className="modal-close" onClick={() => setBookingModalTrainer(null)}>×</button>
              </div>

              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ fontSize: '3rem', color: 'var(--success)', marginBottom: '1rem' }}>✓</div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Booking Requested!</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    Your session request with <strong>{bookingModalTrainer.name}</strong> has been logged. We will confirm shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTrainerBooking} style={{ display: 'grid', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--dark-4)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={bookingModalTrainer.img} alt={bookingModalTrainer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=400"; }} />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 800 }}>{bookingModalTrainer.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{bookingModalTrainer.role}</p>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Preferred Date</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Preferred Time</label>
                    <input 
                      type="time" 
                      className="form-input" 
                      value={bookingForm.time}
                      onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Special requests / Goals</label>
                    <textarea 
                      placeholder="e.g. Weight loss, posture correction, rehabilitation..." 
                      className="form-textarea"
                      style={{ minHeight: '80px' }}
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-shine" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                    Confirm Booking
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
