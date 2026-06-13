import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, CheckCircle2, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'checkout', 'success'
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [orderInfo, setOrderInfo] = useState({
    name: '',
    email: '',
    address: '',
    card: ''
  });

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'FITNESS50') {
      setDiscount(0.5);
      toast.success('Promo Code FITNESS50 applied! 50% discount.');
    } else {
      toast.error('Invalid promo code. Try FITNESS50!');
    }
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!orderInfo.name || !orderInfo.email || !orderInfo.address || !orderInfo.card) {
      toast.error('Please fill in all checkout fields.');
      return;
    }
    setCheckoutStep('success');
    toast.success('Order placed successfully!');
  };

  const handleCloseSuccess = () => {
    clearCart();
    setCheckoutStep('cart');
    setOrderInfo({ name: '', email: '', address: '', card: '' });
    setDiscount(0);
    setPromoCode('');
    onClose();
  };

  const finalTotal = cartTotal * (1 - discount);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={checkoutStep === 'success' ? handleCloseSuccess : onClose}
            style={{ zIndex: 1100 }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '100%',
              maxWidth: '440px',
              height: '100vh',
              background: 'var(--glass)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              borderLeft: '1px solid var(--glass-border)',
              boxShadow: '-10px 0 40px rgba(0,0,0,0.6)',
              zIndex: 1200,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={20} color="var(--primary)" />
                {checkoutStep === 'cart' && 'Your Bag'}
                {checkoutStep === 'checkout' && 'Secure Checkout'}
                {checkoutStep === 'success' && 'Order Confirmed'}
              </h3>
              {checkoutStep !== 'success' && (
                <button
                  onClick={onClose}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Content Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {checkoutStep === 'cart' && (
                <>
                  {cart.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', color: 'var(--text-muted)' }}>
                      <ShoppingBag size={48} strokeWidth={1.5} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                      <p style={{ fontWeight: 600 }}>Your bag is empty.</p>
                      <button onClick={onClose} className="btn btn-outline btn-sm" style={{ marginTop: '1.25rem' }}>Shop Apparel & Gear</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {cart.map((item) => (
                        <div key={`${item.id}-${item.size}`} style={{ display: 'flex', gap: '1rem', background: 'var(--dark-4)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                          <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: 'var(--dark-3)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--white)', paddingRight: '1.5rem' }}>{item.name}</h4>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Size: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{item.size}</span></p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--dark-3)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', padding: '0.15rem 0.4rem' }}>
                                <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} style={{ background: 'none', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', cursor: 'pointer' }}><Minus size={12} /></button>
                                <span style={{ fontSize: '0.85rem', minWidth: '16px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} style={{ background: 'none', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', cursor: 'pointer' }}><Plus size={12} /></button>
                              </div>
                              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)' }}>${item.price * item.quantity}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {checkoutStep === 'checkout' && (
                <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={orderInfo.email}
                      onChange={(e) => setOrderInfo({ ...orderInfo, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={orderInfo.name}
                      onChange={(e) => setOrderInfo({ ...orderInfo, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Delivery Address</label>
                    <input
                      type="text"
                      className="form-input"
                      value={orderInfo.address}
                      onChange={(e) => setOrderInfo({ ...orderInfo, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mock Card Info (16 digits)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 4000 1234 5678 9010"
                      value={orderInfo.card}
                      onChange={(e) => setOrderInfo({ ...orderInfo, card: e.target.value })}
                      required
                    />
                  </div>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0.5rem 0' }} />
                  <div style={{ background: 'var(--dark-4)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-light)' }}>Subtotal</span>
                      <span>${cartTotal}</span>
                    </div>
                    {discount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--success)' }}>
                        <span>Discount (50%)</span>
                        <span>-${cartTotal * discount}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                      <span style={{ color: 'var(--white)' }}>Total Due</span>
                      <span style={{ color: 'var(--primary)' }}>${finalTotal}</span>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-shine" style={{ justifyContent: 'center', width: '100%', marginTop: '0.5rem' }}>
                    <CreditCard size={18} /> Place Order
                  </button>
                  <button type="button" className="btn btn-dark" style={{ justifyContent: 'center', width: '100%' }} onClick={() => setCheckoutStep('cart')}>
                    Back to Bag
                  </button>
                </form>
              )}

              {checkoutStep === 'success' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1rem 0' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    style={{ color: 'var(--success)', marginBottom: '1.25rem' }}
                  >
                    <CheckCircle2 size={64} strokeWidth={1.5} />
                  </motion.div>
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>Thank you, {orderInfo.name}!</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Your receipt details are shown below. A confirmation has been sent to {orderInfo.email}.</p>

                  <div className="card" style={{ width: '100%', background: 'var(--dark-4)', padding: '1.5rem', border: '1px dashed rgba(0,229,255,0.25)', borderRadius: '12px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                      <span>ORDER ID: #FP-{Math.floor(100000 + Math.random() * 900000)}</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '140px', overflowY: 'auto', marginBottom: '0.75rem' }}>
                      {cart.map(item => (
                        <div key={`${item.id}-${item.size}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--text-light)' }}>{item.name} ({item.size}) <span style={{ color: 'var(--text-muted)' }}>x{item.quantity}</span></span>
                          <span style={{ fontWeight: 600 }}>${item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                      {discount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--success)', marginBottom: '0.25rem' }}>
                          <span>FITNESS50 Discount</span>
                          <span>-${cartTotal * discount}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 800 }}>
                        <span style={{ color: 'var(--white)' }}>Total Charged</span>
                        <span style={{ color: 'var(--primary)' }}>${finalTotal}</span>
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-primary btn-shine" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }} onClick={handleCloseSuccess}>
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer Summary (only on Cart step) */}
            {checkoutStep === 'cart' && cart.length > 0 && (
              <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,15,26,0.5)' }}>
                {/* Promo Code */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Ticket size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Promo Code (FITNESS50)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      style={{ paddingLeft: '2.25rem', paddingRight: '0.5rem', paddingTop: '0.6rem', paddingBottom: '0.6rem', fontSize: '0.85rem' }}
                    />
                  </div>
                  <button onClick={handleApplyPromo} className="btn btn-dark btn-sm" style={{ padding: '0.5rem 1rem' }}>Apply</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-light)' }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>${cartTotal}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--success)' }}>
                    <span>Discount (50%)</span>
                    <span>-${cartTotal * discount}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '1.15rem', fontWeight: 800 }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>${finalTotal}</span>
                </div>
                <button className="btn btn-primary btn-shine" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setCheckoutStep('checkout')}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
