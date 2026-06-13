require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { sequelize, User, Trainer, Class, MembershipPlan, BlogPost } = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('✅ Database synced (force)');

    // Admin user
    const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12);
    const admin = await User.create({
      name: 'Admin', email: process.env.ADMIN_EMAIL || 'admin@fitnesspoint.com',
      password_hash: adminHash, role: 'admin', is_active: true
    });
    console.log('✅ Admin user created:', admin.email);

    // Demo user
    const userHash = await bcrypt.hash('User@123', 12);
    const demoUser = await User.create({
      name: 'John Doe', email: 'john@example.com',
      password_hash: userHash, role: 'user',
      fitness_goal: 'Lose weight and build muscle', gender: 'male',
      height_cm: 175, weight_kg: 80, is_active: true
    });
    console.log('✅ Demo user created:', demoUser.email);

    // Trainers
    const trainers = await Trainer.bulkCreate([
      { name: 'David Williams', specialty: 'Body Building & Strength', bio: 'Certified bodybuilding coach with 10+ years of experience transforming physiques.', experience_years: 10, rating: 4.9, certifications: ['NASM-CPT', 'CSCS'] },
      { name: 'Rosy Rivera', specialty: 'Cardio & Weight Loss', bio: 'Former professional athlete specializing in high-intensity cardio and fat-loss programs.', experience_years: 7, rating: 4.8, certifications: ['ACE-CPT', 'ISSA'] },
      { name: 'Matt Stonie', specialty: 'Functional Fitness & CrossFit', bio: 'CrossFit Level 2 trainer passionate about functional movement and athletic performance.', experience_years: 5, rating: 4.7, certifications: ['CrossFit L2', 'NASM-CPT'] },
      { name: 'Sara Johnson', specialty: 'Yoga & Flexibility', bio: 'Certified yoga instructor with expertise in vinyasa, hatha, and therapeutic yoga.', experience_years: 8, rating: 4.9, certifications: ['RYT-500', 'YIN Yoga'] }
    ]);
    console.log('✅ Trainers created:', trainers.length);

    // Classes
    await Class.bulkCreate([
      { title: 'Power Strength Training', description: 'Build raw strength with compound movements.', trainer_id: trainers[0].id, category: 'strength', difficulty: 'intermediate', duration_minutes: 60, capacity: 15, price: 25, schedule: [{ day: 'Monday', time: '07:00' }, { day: 'Wednesday', time: '07:00' }, { day: 'Friday', time: '07:00' }] },
      { title: 'HIIT Cardio Blast', description: 'High-intensity intervals for maximum calorie burn.', trainer_id: trainers[1].id, category: 'hiit', difficulty: 'advanced', duration_minutes: 45, capacity: 20, price: 20, schedule: [{ day: 'Tuesday', time: '06:00' }, { day: 'Thursday', time: '06:00' }, { day: 'Saturday', time: '08:00' }] },
      { title: 'Morning Yoga Flow', description: 'Start your day with energizing yoga sequences.', trainer_id: trainers[3].id, category: 'yoga', difficulty: 'beginner', duration_minutes: 50, capacity: 25, price: 15, schedule: [{ day: 'Monday', time: '06:00' }, { day: 'Wednesday', time: '06:00' }, { day: 'Friday', time: '06:00' }] },
      { title: 'CrossFit WOD', description: 'Workout of the day — push your limits.', trainer_id: trainers[2].id, category: 'crossfit', difficulty: 'advanced', duration_minutes: 60, capacity: 12, price: 30, schedule: [{ day: 'Tuesday', time: '07:00' }, { day: 'Thursday', time: '07:00' }] },
      { title: 'Cardio Dance Party', description: 'Fun dance-based cardio for all fitness levels.', trainer_id: trainers[1].id, category: 'dance', difficulty: 'beginner', duration_minutes: 45, capacity: 30, price: 12, schedule: [{ day: 'Saturday', time: '10:00' }, { day: 'Sunday', time: '10:00' }] }
    ]);
    console.log('✅ Classes created');

    // Membership Plans
    await MembershipPlan.bulkCreate([
      { name: 'Basic Plan', description: 'Perfect for beginners starting their fitness journey.', price: 999, duration_days: 30, features: ['Gym Access during off-peak hours', 'Basic Workout Plan', 'Locker Room Access', '1 Fitness Assessment'], color: '#64748b' },
      { name: 'Standard Plan', description: 'Most popular plan for dedicated fitness enthusiasts.', price: 1999, duration_days: 30, features: ['24/7 Gym Access', 'Customized Workout Plan', 'Group Classes Access', 'Monthly Progress Reports', '2 Fitness Assessments/month'], is_popular: true, color: '#42c8c9' },
      { name: 'Premium Plan', description: 'Premium experience with all features unlocked.', price: 3499, duration_days: 30, features: ['24/7 Gym Access', 'Customized Workout & Diet Plan', 'Personal Trainer (2 sessions/week)', 'Locker & Towel Service', 'Unlimited Group Classes & Steam Bath'], color: '#d6abd8' }
    ]);
    console.log('✅ Membership plans created');

    // Blog posts
    await BlogPost.bulkCreate([
      { title: '10 Best Exercises for Building Core Strength', slug: '10-best-exercises-core-strength', excerpt: 'A strong core is the foundation of every great workout. Discover the top exercises.', content: 'Core strength is essential for athletic performance and daily life. Here are 10 exercises...', author_id: admin.id, category: 'fitness', tags: ['core', 'strength', 'exercises'], is_published: true, published_at: new Date() },
      { title: 'The Ultimate Guide to Meal Prepping for Fitness', slug: 'ultimate-guide-meal-prepping-fitness', excerpt: 'Save time and stay on track with these meal prepping strategies for athletes.', content: 'Meal prepping is one of the most effective ways to maintain a healthy diet...', author_id: admin.id, category: 'nutrition', tags: ['meal prep', 'nutrition', 'diet'], is_published: true, published_at: new Date() },
      { title: 'Why Rest Days Are as Important as Workout Days', slug: 'why-rest-days-are-important', excerpt: 'Overtraining can slow your progress. Learn why recovery matters.', content: 'Recovery is where growth actually happens. Your muscles repair and strengthen...', author_id: admin.id, category: 'wellness', tags: ['recovery', 'rest', 'wellness'], is_published: true, published_at: new Date() },
      { title: 'HIIT vs Steady-State Cardio: Which is Better?', slug: 'hiit-vs-steady-state-cardio', excerpt: 'Compare the two most popular cardio methods and find out which suits your goals.', content: 'Both HIIT and steady-state cardio have their place in a well-rounded fitness program...', author_id: admin.id, category: 'fitness', tags: ['hiit', 'cardio', 'training'], is_published: true, published_at: new Date() }
    ]);
    console.log('✅ Blog posts created');

    console.log('\n🎉 Seeding complete!');
    console.log('   Admin: admin@fitnesspoint.com / Admin@123');
    console.log('   User:  john@example.com / User@123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
