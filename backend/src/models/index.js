const sequelize = require('../config/database');
const User = require('./User');
const Trainer = require('./Trainer');
const Class = require('./Class');
const MembershipPlan = require('./MembershipPlan');
const Membership = require('./Membership');
const WorkoutLog = require('./WorkoutLog');
const MealLog = require('./MealLog');
const HabitLog = require('./HabitLog');
const ProgressLog = require('./ProgressLog');
const BlogPost = require('./BlogPost');
const ContactMessage = require('./ContactMessage');
const Booking = require('./Booking');
const GalleryItem = require('./GalleryItem');

// ── Associations ──────────────────────────────────────────────────────────────
// User <-> Trainer (trainer has one user account)
User.hasOne(Trainer, { foreignKey: 'user_id', as: 'trainerProfile' });
Trainer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Trainer -> Classes
Trainer.hasMany(Class, { foreignKey: 'trainer_id', as: 'classes' });
Class.belongsTo(Trainer, { foreignKey: 'trainer_id', as: 'trainer' });

// User -> Bookings
User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Trainer -> Bookings
Trainer.hasMany(Booking, { foreignKey: 'trainer_id', as: 'bookings' });
Booking.belongsTo(Trainer, { foreignKey: 'trainer_id', as: 'trainer' });

// User -> Memberships
User.hasMany(Membership, { foreignKey: 'user_id', as: 'memberships' });
Membership.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// MembershipPlan -> Memberships
MembershipPlan.hasMany(Membership, { foreignKey: 'plan_id', as: 'memberships' });
Membership.belongsTo(MembershipPlan, { foreignKey: 'plan_id', as: 'plan' });

// User -> WorkoutLogs
User.hasMany(WorkoutLog, { foreignKey: 'user_id', as: 'workoutLogs' });
WorkoutLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User -> MealLogs
User.hasMany(MealLog, { foreignKey: 'user_id', as: 'mealLogs' });
MealLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User -> HabitLogs
User.hasMany(HabitLog, { foreignKey: 'user_id', as: 'habitLogs' });
HabitLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User -> ProgressLogs
User.hasMany(ProgressLog, { foreignKey: 'user_id', as: 'progressLogs' });
ProgressLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User -> BlogPosts (author)
User.hasMany(BlogPost, { foreignKey: 'author_id', as: 'blogPosts' });
BlogPost.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

module.exports = {
  sequelize,
  User,
  Trainer,
  Class,
  MembershipPlan,
  Membership,
  WorkoutLog,
  MealLog,
  HabitLog,
  ProgressLog,
  BlogPost,
  ContactMessage,
  Booking,
  GalleryItem
};
