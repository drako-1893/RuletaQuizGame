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
  const playerName = location.state?.playerName;

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

  useEffect(() => {
    if (!playerName) {
      navigate('/');
    }
  }, [playerName, navigate]);

  if (!roomData) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando sala...</div>;
  }

  const isMyTurn = roomData.players[roomData.turnIndex]?.id === socketId;
  const activePlayer = roomData.players[roomData.turnIndex];

  const handleCopyLink = () => {
    const link = `${window.location.origin}/`;
    alert(`Código de sala: ${roomId}\nComparte este código para que otros se unan en ${link}`);
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', height: '100%', flex: 1, paddingBottom: '2rem' }}>
      
      {/* Columna Izquierda: Jugadores y Ajustes */}
      <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Sala: {roomId}
            <button className="btn-icon" onClick={handleCopyLink} title="Compartir Sala">
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

      {/* Columna Central: Ruleta */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>
          Turno de: <span style={{ color: 'var(--accent)' }}>{activePlayer?.name || 'Nadie'}</span>
        </h2>
        
        <Roulette 
          questions={roomData.questions} 
          spinEvent={spinEvent} 
          onSpinEnd={nextTurn}
        />
        
        <div style={{ marginTop: '3rem' }}>
          <button 
            className="btn btn-primary" 
            style={{ fontSize: '1.2rem', padding: '1rem 3rem', borderRadius: '50px' }}
            onClick={spinRoulette}
            disabled={!isMyTurn}
          >
            {isMyTurn ? 'GIRAR RULETA' : 'ESPERA TU TURNO'}
          </button>
        </div>
      </div>

      {/* Columna Derecha: Chat */}
      <div style={{ width: '300px' }}>
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
