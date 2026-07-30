import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!playerName.trim()) return;
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/room/${newRoomId}`, { state: { playerName } });
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomId.trim()) return;
    navigate(`/room/${roomId.toUpperCase()}`, { state: { playerName } });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          GiraGira
        </h1>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            className="input-field"
            placeholder="Tu nombre..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleCreateRoom}
            disabled={!playerName.trim()}
          >
            Crear Nueva Sala
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>O</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              className="input-field"
              placeholder="Código de sala..."
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button 
              className="btn btn-primary" 
              onClick={handleJoinRoom}
              disabled={!playerName.trim() || !roomId.trim()}
            >
              Unirse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
