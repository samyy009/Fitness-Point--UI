const router = require('express').Router();
const c = require('../controllers/adminController');
const tc = require('../controllers/trainerController');
const cc = require('../controllers/classController');
const pc = require('../controllers/planController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// ── Public / User Bookings & Gallery (Before admin role restriction) ──
router.get('/gallery', c.getGallery);
router.post('/bookings', auth, c.createBooking);
router.get('/bookings/me', auth, c.getMyBookings);

// ── Admin-Only Routes ──────────────────────────────────────────────────
router.use(auth, admin);

// Stats
router.get('/stats', c.getStats);

// Users
router.get('/users', c.getUsers);
router.put('/users/:id', c.updateUser);
router.delete('/users/:id', c.deleteUser);

// Trainers
router.post('/trainers', tc.create);
router.put('/trainers/:id', tc.update);
router.delete('/trainers/:id', tc.remove);

// Classes
router.post('/classes', cc.create);
router.put('/classes/:id', cc.update);
router.delete('/classes/:id', cc.remove);

// Plans
router.post('/plans', pc.create);
router.put('/plans/:id', pc.update);
router.delete('/plans/:id', pc.remove);

// Memberships
router.get('/memberships', c.getAllMemberships);

// Bookings Management
router.get('/bookings', c.getAllBookings);
router.put('/bookings/:id', c.updateBookingStatus);

// Gallery Management
router.post('/gallery', c.createGalleryItem);
router.delete('/gallery/:id', c.deleteGalleryItem);

module.exports = router;
