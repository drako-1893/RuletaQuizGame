import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import Roulette from '../components/Roulette';
import Chat from '../components/Chat';
import PlayerList from '../components/PlayerList';
import QuestionEditor from '../components/QuestionEditor';
import { Settings, Share2 } from 'lucide-react';

export default function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Guardamos el nombre del jugador en estado local por si entran directamente por URL
  const [playerName, setPlayerName] = useState(location.state?.playerName || '');
  const [tempName, setTempName] = useState('');

  const {
    socketId,
    isConnected,
    roomData,
    spinEvent,
    spinRoulette,
    nextTurn,
    updateQuestions,
    sendMessage
  } = useSocket(roomId, playerName);

  const [showEditor, setShowEditor] = useState(false);

  // Si no tiene nombre, mostramos un prompt antes de entrar a la sala real
  if (!playerName) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Unirse a la sala {roomId}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              className="input-field"
              placeholder="Escribe tu nombre..."
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && tempName.trim() && setPlayerName(tempName.trim())}
            />
            <button 
              className="btn btn-primary" 
              onClick={() => setPlayerName(tempName.trim())}
              disabled={!tempName.trim()}
            >
              Entrar
            </button>
            <button 
              className="btn" 
              style={{ background: 'transparent', color: 'var(--text-muted)' }}
              onClick={() => navigate('/')}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!roomData) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Conectando a la sala...</div>;
  }

  const isMyTurn = roomData.players[roomData.turnIndex]?.id === socketId;
  const activePlayer = roomData.players[roomData.turnIndex];

  const handleCopyLink = () => {
    const link = `${window.location.origin}/room/${roomId}`;
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(link).then(() => {
        alert('¡Enlace copiado al portapapeles!');
      });
    } else {
      alert(`Comparte este enlace:\n\n${link}`);
    }
  };

  return (
    <div className="room-layout">
      
      {/* Información de Sala y Jugadores */}
      <div className="room-sidebar">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem' }}>
            Sala: {roomId}
            <button className="btn-icon" onClick={handleCopyLink} title="Compartir Enlace">
              <Share2 size={18} />
            </button>
          </h2>
          <PlayerList players={roomData.players} turnIndex={roomData.turnIndex} socketId={socketId} />
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: 'auto' }}>
          <button className="btn" style={{ width: '100%', background: 'var(--glass-bg)', color: 'white', border: '1px solid var(--glass-border)' }} onClick={() => setShowEditor(true)}>
            <Settings size={18} />
            Editar Preguntas
          </button>
        </div>
      </div>

      {/* Ruleta */}
      <div className="glass-panel room-main">
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>
          Turno de: <span style={{ color: 'var(--accent)' }}>{activePlayer?.name || 'Nadie'}</span>
        </h2>
        
        <Roulette 
          questions={roomData.questions} 
          spinEvent={spinEvent} 
          onSpinEnd={nextTurn}
        />
        
        <div style={{ marginTop: '2rem' }}>
          <button 
            className="btn btn-primary" 
            style={{ fontSize: '1.2rem', padding: '1rem 2rem', borderRadius: '50px' }}
            onClick={spinRoulette}
            disabled={!isMyTurn}
          >
            {isMyTurn ? 'GIRAR RULETA' : 'ESPERA TU TURNO'}
          </button>
        </div>
      </div>

      {/* Chat */}
      <div className="room-chat">
        <Chat messages={roomData.chat} onSendMessage={sendMessage} />
      </div>

      {showEditor && (
        <QuestionEditor 
          questions={roomData.questions} 
          onSave={(newQuestions) => {
            updateQuestions(newQuestions);
            setShowEditor(false);
          }} 
          onClose={() => setShowEditor(false)} 
        />
      )}
    </div>
  );
}
