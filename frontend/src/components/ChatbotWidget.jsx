import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, HelpCircle } from 'lucide-react';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your Fitness Point Assistant. How can I help you reach your goals today?' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const faqResponses = {
    classes: 'We offer a wide range of training categories: Weight Training, Cardio Workout, Personal Training, Yoga & Flexibility, Zumba & Dance, and Functional Training! You can view timings on our Classes page.',
    plans: 'Our membership plans are designed to fit your goals: Basic Plan is ₹999/mo, Standard (Most Popular) is ₹1,999/mo, and Premium is ₹3,499/mo. Check them out on the Plans page.',
    booking: 'To book a session with one of our certified trainers, head over to the Trainers tab on the website or navigate to the "Book Trainer" page inside your dashboard.',
    about: 'Fitness Point is a premium, modern gym committed to helping you transform your physique through state-of-the-art facilities, certified trainers, and personalized programs.',
    location: 'We are located at 123 Health Ave, Fitness District, Mumbai, India. The gym is open 24/7 for Standard and Premium members!'
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (text) => {
    if (!text.trim()) return;

    // User message
    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Match bot response
    setTimeout(() => {
      let reply = "I'm sorry, I didn't quite get that. Could you ask about our classes, pricing plans, trainer booking, about us, or location?";
      const lowercase = text.toLowerCase();

      if (lowercase.includes('class') || lowercase.includes('program') || lowercase.includes('workout')) {
        reply = faqResponses.classes;
      } else if (lowercase.includes('price') || lowercase.includes('plan') || lowercase.includes('pricing') || lowercase.includes('cost') || lowercase.includes('membership')) {
        reply = faqResponses.plans;
      } else if (lowercase.includes('book') || lowercase.includes('trainer') || lowercase.includes('session') || lowercase.includes('coach')) {
        reply = faqResponses.booking;
      } else if (lowercase.includes('about') || lowercase.includes('what is') || lowercase.includes('who are')) {
        reply = faqResponses.about;
      } else if (lowercase.includes('location') || lowercase.includes('where') || lowercase.includes('address') || lowercase.includes('open')) {
        reply = faqResponses.location;
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--grad-2)',
          border: 'none',
          color: 'var(--dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(0,229,255,0.4)',
          outline: 'none'
        }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>

      {/* Expanded Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            style={{
              position: 'absolute',
              bottom: '70px',
              right: 0,
              width: '350px',
              height: '480px',
              background: 'var(--glass)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-lg)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(0,229,255,0.05)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--grad-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} color="var(--dark)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>Fitness Point Bot</h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></span> Online
                </p>
              </div>
            </div>

            {/* Message Area */}
            <div style={{ flexGrow: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start' }}>
                  {m.sender === 'bot' && (
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--dark-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Bot size={12} color="var(--primary)" />
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: '75%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '12px',
                      fontSize: '0.82rem',
                      lineHeight: '1.5',
                      background: m.sender === 'user' ? 'var(--grad-2)' : 'var(--dark-4)',
                      color: m.sender === 'user' ? 'var(--dark)' : 'var(--text-light)',
                      fontWeight: m.sender === 'user' ? 600 : 500,
                      border: m.sender === 'bot' ? '1px solid rgba(255,255,255,0.03)' : 'none'
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick buttons helper */}
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', padding: '0.5rem 1rem', borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.15)', flexShrink: 0 }}>
              {[
                { text: 'Programs', tag: 'classes' },
                { text: 'Pricing', tag: 'plans' },
                { text: 'Book Coach', tag: 'booking' },
                { text: 'Location', tag: 'location' }
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(opt.text)}
                  style={{
                    background: 'var(--dark-4)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: 'var(--primary)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.35rem 0.65rem',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
                  onMouseOut={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                >
                  {opt.text}
                </button>
              ))}
            </div>

            {/* Input area */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              style={{ padding: '0.85rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
              <input
                type="text"
                placeholder="Ask about pricing, programs..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                  flexGrow: 1,
                  background: 'var(--dark-4)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  padding: '0.55rem 1rem',
                  fontSize: '0.82rem',
                  color: '#fff'
                }}
              />
              <button
                type="submit"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--grad-2)',
                  border: 'none',
                  color: 'var(--dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
