import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function Chat({ messages, onSendMessage }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
        <h3 style={{ margin: 0 }}>Chat</h3>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '0.25rem' }}>
              {msg.playerName}
            </div>
            <div style={{ fontSize: '0.95rem', wordBreak: 'break-word' }}>
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            className="input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mensaje..."
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn-icon" style={{ background: 'var(--primary)', border: 'none', color: 'white' }}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
