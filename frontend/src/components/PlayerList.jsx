import { User } from 'lucide-react';

export default function PlayerList({ players, turnIndex, socketId }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {players.map((player, index) => {
        const isTurn = index === turnIndex;
        const isMe = player.id === socketId;
        
        return (
          <div 
            key={player.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              background: isTurn ? 'rgba(139, 92, 246, 0.2)' : 'rgba(0,0,0,0.2)',
              border: `1px solid ${isTurn ? 'var(--primary)' : 'transparent'}`,
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              transform: isTurn ? 'scale(1.02)' : 'scale(1)'
            }}
          >
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: isTurn ? 'var(--primary)' : 'var(--glass-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={16} />
            </div>
            <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span style={{ fontWeight: isTurn ? '600' : '400', color: isTurn ? 'white' : 'var(--text-muted)' }}>
                {index + 1}. {player.name} {isMe && '(Tú)'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
