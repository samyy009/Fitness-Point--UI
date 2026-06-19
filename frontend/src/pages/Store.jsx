import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import {
  Search, Eye, ShoppingBag, X, Check, Star,
  ShieldCheck, Truck, RefreshCw, Dumbbell, Zap,
  FlaskConical, Shirt, Activity, Package
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ── Fitness Point Merchandise Catalog ─────────────────────────────── */
const PRODUCTS = [
  // ── Supplements ──────────────────────────────────────────────────────
  {
    id: 's1',
    name: 'FP Whey Protein Isolate',
    price: 59,
    category: 'Supplements',
    rating: 4.9,
    reviews: 218,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop',
    tag: 'Best Seller',
    options: ['Chocolate — 2 lbs', 'Vanilla — 2 lbs', 'Chocolate — 5 lbs'],
    description: 'Fitness Point\'s signature whey isolate delivers 27g of ultra-pure protein per scoop. Zero fillers, no added sugars — just clean, fast-absorbing fuel for lean muscle recovery and growth.',
    specs: ['27g isolate protein per scoop', '5.5g BCAAs + 4g Glutamine', 'Gluten-free & zero lactose', 'Digestive enzyme blend included']
  },
  {
    id: 's2',
    name: 'FP HyperDrive Pre-Workout',
    price: 45,
    category: 'Supplements',
    rating: 4.8,
    reviews: 134,
    image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600&auto=format&fit=crop',
    tag: 'High Energy',
    options: ['Green Apple — 30sv', 'Watermelon — 30sv'],
    description: 'Train harder and push further with our clinical pre-workout blend. Powered by Citrulline Malate, Beta-Alanine, and clean caffeine for explosive pumps, focus, and endurance.',
    specs: ['6g L-Citrulline Malate', '3.2g Beta-Alanine', '300mg Natural Caffeine', 'No artificial dyes or fillers']
  },
  {
    id: 's3',
    name: 'FP Daily Multivitamin Pack',
    price: 28,
    category: 'Supplements',
    rating: 4.7,
    reviews: 87,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop',
    tag: 'Essentials',
    options: ['30-Day Supply', '60-Day Supply'],
    description: 'A complete daily vitamin and mineral blend formulated specifically for active gym-goers. Covers all micronutrient gaps to support immunity, energy, and recovery.',
    specs: ['25 essential vitamins & minerals', 'Added Omega-3 & CoQ10', 'No unnecessary fillers or binders', 'Individually sealed daily sachets']
  },
  // ── Equipment ─────────────────────────────────────────────────────────
  {
    id: 'e1',
    name: 'FP Leather Lifting Belt',
    price: 75,
    category: 'Equipment',
    rating: 4.9,
    reviews: 162,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop',
    tag: 'Heavy Duty',
    options: ['Small', 'Medium', 'Large', 'XL'],
    description: 'Precision-crafted 10mm full-grain leather belt with a stainless steel lever buckle. Designed to maximize intra-abdominal pressure during squats, deadlifts, and overhead presses.',
    specs: ['10mm premium drum-dyed leather', 'Stainless steel lever buckle', 'Padded internal lumbar support', 'Double-stitched edge reinforcement']
  },
  {
    id: 'e2',
    name: 'FP Resistance Band Kit',
    price: 34,
    category: 'Equipment',
    rating: 4.7,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop',
    tag: 'Versatile',
    options: ['5-Band Set', '3-Band Set (Heavy)'],
    description: 'Premium latex resistance bands covering light to ultra-heavy resistance. Perfect for warm-ups, mobility work, progressive overload assistance, and home gym training.',
    specs: ['5 resistance levels (5–125 lbs)', 'Anti-snap natural latex loops', 'Includes carry pouch & guide', 'Stackable up to 300+ lbs combined']
  },
  {
    id: 'e3',
    name: 'FP Foam Roller Pro',
    price: 38,
    category: 'Equipment',
    rating: 4.6,
    reviews: 73,
    image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=600&auto=format&fit=crop',
    tag: 'Recovery',
    options: ['36" Full Length', '18" Compact'],
    description: 'High-density EPP foam roller with a trigger-point grid surface. Breaks down muscle knots, promotes blood flow, and accelerates recovery between training sessions.',
    specs: ['High-density EPP foam core', 'Multi-directional grid surface', 'Hollow core supports 300+ lbs', 'Moisture-resistant surface coating']
  },
  {
    id: 'e4',
    name: 'FP Wrist Wraps & Straps',
    price: 22,
    category: 'Equipment',
    rating: 4.5,
    reviews: 58,
    image: 'https://images.unsplash.com/photo-1614928263436-816b2a740f33?w=600&auto=format&fit=crop',
    tag: 'Essential',
    options: ['Wraps Only', 'Straps Only', 'Combo Set'],
    description: 'Reinforced elasticated wrist wraps and heavy cotton lifting straps. Provides critical joint protection for pressing movements and maximizes grip for pulling exercises.',
    specs: ['18" pro-grade wrist wraps', 'Reinforced thumb loop', 'Heavy-duty cotton lifting straps', 'Industrial Velcro closure']
  },
  // ── Apparel ────────────────────────────────────────────────────────────
  {
    id: 'a1',
    name: 'FP Compression Training Tee',
    price: 42,
    category: 'Apparel',
    rating: 4.7,
    reviews: 104,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop',
    tag: 'New Drop',
    options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Second-skin performance compression tee built with moisture-wicking technology, flatlock stitching, and anti-odor treatment for maximum comfort across every training modality.',
    specs: ['87% polyester / 13% elastane', 'UPF 50+ sun protection', 'Flatlock anti-chafe stitching', 'Printed Fitness Point logo']
  },
  {
    id: 'a2',
    name: 'FP Flex Training Shorts',
    price: 48,
    category: 'Apparel',
    rating: 4.8,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop',
    tag: 'Member Pick',
    options: ['XS', 'S', 'M', 'L', 'XL'],
    description: '4-way stretch training shorts with a 7-inch inseam and built-in liner. The zippered pockets and drawcord waistband keep you locked in through squats, sprints, and everything in between.',
    specs: ['4-way stretch quick-dry fabric', '7" athletic inseam', 'Built-in mesh liner', 'Dual zip-secure pockets']
  },
  {
    id: 'a3',
    name: 'FP Gym Hoodie (Heavyweight)',
    price: 68,
    category: 'Apparel',
    rating: 4.9,
    reviews: 143,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&auto=format&fit=crop',
    tag: 'Premium',
    options: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'A heavyweight 450gsm fleece hoodie in classic Fitness Point colorways. Oversized kangaroo pocket, ribbed cuffs, and brushed inner lining for maximum comfort and warmth between sets.',
    specs: ['450gsm 100% cotton fleece', 'Brushed interior lining', 'Oversized kangaroo pocket', 'Embroidered Fitness Point crest']
  },
  // ── Accessories ────────────────────────────────────────────────────────
  {
    id: 'c1',
    name: 'FP Shaker Bottle (600ml)',
    price: 18,
    category: 'Accessories',
    rating: 4.6,
    reviews: 196,
    image: 'https://images.unsplash.com/photo-1570464197285-9949814674a7?w=600&auto=format&fit=crop',
    tag: 'Fan Fave',
    options: ['Black', 'White', 'Midnight Blue'],
    description: 'Leakproof 600ml Tritan shaker with a snap-lock lid, mixing ball spring, and measurement markings. The perfect companion for your Fitness Point pre and post-workout nutrition routine.',
    specs: ['BPA-free Tritan plastic', 'Snap-lock leakproof lid', 'Stainless steel mixing ball', 'Dishwasher safe']
  },
  {
    id: 'c2',
    name: 'FP Gym Duffel Bag',
    price: 55,
    category: 'Accessories',
    rating: 4.8,
    reviews: 77,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop',
    tag: 'Carry All',
    options: ['40L Standard', '55L Large'],
    description: 'Built for gym warriors — wet/dry separation compartment, padded shoe pocket, laptop sleeve, and durable ripstop exterior. The only bag you\'ll ever need at Fitness Point.',
    specs: ['Water-resistant ripstop exterior', 'Wet/dry separation pocket', 'Padded laptop sleeve', 'Ventilated shoe compartment']
  }
];

const CATEGORY_ICONS = {
  'All': Package,
  'Supplements': FlaskConical,
  'Equipment': Dumbbell,
  'Apparel': Shirt,
  'Accessories': Activity
};

export default function Store() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuickView, setActiveQuickView] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});

  const categories = ['All', 'Supplements', 'Equipment', 'Apparel', 'Accessories'];

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getOption = (id) => selectedOption[id] || PRODUCTS.find(p => p.id === id)?.options[0];

  const handleAddToCart = (product) => {
    const option = getOption(product.id);
    addToCart({ ...product, price: product.price }, option);
    toast.success(`${product.name} added to your bag!`, {
      icon: '🛒',
      style: { background: 'var(--dark-3)', color: 'var(--white)', border: '1px solid rgba(0,229,255,0.2)' }
    });
  };

  const handleQuickViewAdd = (product) => {
    const option = getOption(product.id);
    addToCart({ ...product, price: product.price }, option);
    toast.success(`${product.name} added to your bag!`, {
      icon: '🛒',
      style: { background: 'var(--dark-3)', color: 'var(--white)', border: '1px solid rgba(0,229,255,0.2)' }
    });
    setActiveQuickView(null);
  };

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>

      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #020309 0%, #0d1a2d 60%, #080f1a 100%)',
        borderBottom: '1px solid rgba(0,229,255,0.08)',
        padding: '8rem 0 4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Orbs */}
        <div className="orb" style={{ width: 500, height: 500, background: 'var(--primary)', top: '-200px', right: '-100px' }} />
        <div className="orb" style={{ width: 300, height: 300, background: 'var(--accent-2)', bottom: '-100px', left: '10%' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '50px', padding: '0.4rem 1.25rem', marginBottom: '1.5rem' }}>
              <Dumbbell size={14} color="var(--primary)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Fitness Point Gear Shop</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
              Train Harder.<br />
              <span style={{ background: 'var(--grad-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Recover Smarter.
              </span>
            </h1>
            <p style={{ color: 'var(--text-light)', maxWidth: '520px', margin: '0 auto 2rem', fontSize: '1.05rem', lineHeight: '1.65' }}>
              Official supplements, gym accessories, and branded apparel — exclusively for Fitness Point members and enthusiasts.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Check size={13} color="var(--success)" /> Member Exclusive Pricing</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Check size={13} color="var(--success)" /> Ships Within 24hrs</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Check size={13} color="var(--success)" /> 30-Day Returns</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 2rem 6rem' }}>

        {/* ── Filter & Search Bar ─────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {categories.map(cat => {
              const Icon = CATEGORY_ICONS[cat];
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.55rem 1.2rem',
                    fontSize: '0.82rem', fontWeight: 700,
                    borderRadius: '50px',
                    background: isActive ? 'var(--grad-2)' : 'var(--dark-4)',
                    color: isActive ? 'var(--dark)' : 'var(--text-light)',
                    border: '1px solid',
                    borderColor: isActive ? 'transparent' : 'rgba(255,255,255,0.07)',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 4px 20px rgba(0,229,255,0.3)' : 'none',
                    transition: 'all 0.3s'
                  }}
                >
                  <Icon size={13} />
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', minWidth: '260px', flex: 1, maxWidth: '320px' }}>
            <Search size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search supplements, gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        {/* Results Count */}
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1.75rem' }}>
          Showing <strong style={{ color: 'var(--text-light)' }}>{filteredProducts.length}</strong> products
          {selectedCategory !== 'All' && <> in <strong style={{ color: 'var(--primary)' }}>{selectedCategory}</strong></>}
          {searchQuery && <> matching "<strong style={{ color: 'var(--primary)' }}>{searchQuery}</strong>"</>}
        </p>

        {/* ── Products Grid ─────────────────────────────────────────────── */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-muted)' }}>
            <Dumbbell size={48} strokeWidth={1} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>No products found.</p>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Try a different category or search term.</p>
            <button className="btn btn-outline btn-sm" onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.75rem' }}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => {
                const currentOpt = getOption(product.id);
                return (
                  <motion.div
                    layout key={product.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                    style={{
                      background: 'linear-gradient(135deg, var(--dark-3) 0%, var(--dark-4) 100%)',
                      border: '1px solid rgba(0,229,255,0.08)',
                      borderRadius: 'var(--radius-xl)',
                      overflow: 'hidden',
                      display: 'flex', flexDirection: 'column',
                      transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s'
                    }}
                    whileHover={{ y: -6, boxShadow: '0 24px 64px rgba(0,0,0,0.4), 0 0 32px rgba(0,229,255,0.12)', borderColor: 'rgba(0,229,255,0.25)' }}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative', height: '230px', overflow: 'hidden' }}>
                      <img
                        src={product.image} alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,3,9,0.85) 0%, transparent 55%)' }} />

                      {/* Tag */}
                      {product.tag && (
                        <span className="badge badge-accent" style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 2 }}>
                          {product.tag}
                        </span>
                      )}

                      {/* Quick View Btn */}
                      <button
                        onClick={() => { setSelectedOption(p => ({ ...p, [product.id]: product.options[0] })); setActiveQuickView(product); }}
                        title="Quick View"
                        style={{
                          position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 2,
                          background: 'rgba(8,15,26,0.8)', backdropFilter: 'blur(12px)',
                          border: '1px solid rgba(255,255,255,0.12)', color: '#fff',
                          width: '36px', height: '36px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', transition: 'background 0.3s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(8,15,26,0.8)'}
                      >
                        <Eye size={15} />
                      </button>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            {product.category}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Star size={11} fill="#ffc107" color="#ffc107" />
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--white)' }}>{product.rating}</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({product.reviews})</span>
                          </div>
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--white)', marginBottom: '0.85rem', lineHeight: 1.3 }}>
                          {product.name}
                        </h3>
                      </div>

                      <div>
                        {/* Option Select */}
                        <div style={{ marginBottom: '1rem' }}>
                          <select
                            value={currentOpt}
                            onChange={e => setSelectedOption(p => ({ ...p, [product.id]: e.target.value }))}
                            className="form-select"
                            style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
                          >
                            {product.options.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>

                        {/* Price + Add */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <div>
                            <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary)' }}>${product.price}</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>USD</span>
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="btn btn-primary btn-sm btn-shine"
                          >
                            <ShoppingBag size={13} />
                            Add to Bag
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Trust Badges ────────────────────────────────────────────── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem', marginTop: '5rem', paddingTop: '3.5rem',
          borderTop: '1px solid rgba(255,255,255,0.06)'
        }}>
          {[
            {
              icon: <Truck size={22} />,
              title: 'Free Shipping',
              desc: 'On all orders over $60 nationwide. Dispatched in 24 hours.'
            },
            {
              icon: <ShieldCheck size={22} />,
              title: 'Authentic & Safe',
              desc: 'Every product is lab-tested, certified, and 100% authentic.'
            },
            {
              icon: <Zap size={22} />,
              title: 'Member Discounts',
              desc: 'Active Fitness Point members get exclusive pricing on all gear.'
            },
            {
              icon: <RefreshCw size={22} />,
              title: '30-Day Returns',
              desc: 'Unopened or defective items qualify for full refund or exchange.'
            }
          ].map((badge, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{
                background: 'rgba(0,229,255,0.08)', padding: '0.85rem',
                borderRadius: '12px', border: '1px solid rgba(0,229,255,0.15)',
                color: 'var(--primary)', flexShrink: 0
              }}>
                {badge.icon}
              </div>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff', marginBottom: '0.25rem' }}>{badge.title}</h4>
                <p style={{ fontSize: '0.79rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick View Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {activeQuickView && (
          <div
            className="modal-overlay"
            style={{ zIndex: 2000 }}
            onClick={() => setActiveQuickView(null)}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 30 }}
              transition={{ duration: 0.3 }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '820px', width: '90%', padding: 0, overflow: 'hidden' }}
            >
              {/* Close */}
              <button
                onClick={() => setActiveQuickView(null)}
                style={{
                  position: 'absolute', top: '1rem', right: '1rem', zIndex: 10,
                  background: 'rgba(8,15,26,0.9)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
                  width: '34px', height: '34px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <X size={15} />
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* Image */}
                <div style={{ height: '380px', background: 'var(--dark-2)', position: 'relative' }}>
                  <img
                    src={activeQuickView.image} alt={activeQuickView.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}>
                    <span className="badge badge-primary">{activeQuickView.category}</span>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '2.25rem', background: 'var(--dark-3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* Title & Ratings */}
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--white)', letterSpacing: '-0.01em', marginBottom: '0.4rem' }}>
                      {activeQuickView.name}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', gap: '1px' }}>
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={12} fill={s <= Math.floor(activeQuickView.rating) ? '#ffc107' : 'transparent'} color="#ffc107" />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--white)' }}>{activeQuickView.rating}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>({activeQuickView.reviews} reviews)</span>
                    </div>

                    <p style={{ color: 'var(--text-light)', fontSize: '0.88rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                      {activeQuickView.description}
                    </p>

                    {/* Specs */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                        Product Highlights
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                        {activeQuickView.specs.map((spec, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                            <Check size={12} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Option */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <h4 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
                        Select Option
                      </h4>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {activeQuickView.options.map(opt => {
                          const isSelected = (selectedOption[activeQuickView.id] || activeQuickView.options[0]) === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => setSelectedOption(p => ({ ...p, [activeQuickView.id]: opt }))}
                              style={{
                                padding: '0.4rem 0.85rem', fontSize: '0.78rem', fontWeight: 700,
                                borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s',
                                background: isSelected ? 'var(--primary)' : 'var(--dark-4)',
                                color: isSelected ? 'var(--dark)' : 'var(--text-light)',
                                border: '1px solid',
                                borderColor: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.07)'
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.25rem' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.15rem' }}>Price</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)' }}>${activeQuickView.price}</div>
                    </div>
                    <button
                      onClick={() => handleQuickViewAdd(activeQuickView)}
                      className="btn btn-primary btn-shine"
                      style={{ padding: '0.9rem 1.75rem' }}
                    >
                      <ShoppingBag size={16} />
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
