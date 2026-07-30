import { useState } from 'react';
import { X } from 'lucide-react';

export default function QuestionEditor({ questions: initialQuestions, onSave, onClose }) {
  // Estado local como un solo bloque de texto
  const [text, setText] = useState(initialQuestions.join('\n'));

  const handleSave = () => {
    // Separar por salto de línea, limpiar espacios en blanco y descartar líneas vacías
    const newQuestions = text
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0);
      
    onSave(newQuestions);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Editar Preguntas</h2>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Escribe una pregunta por línea. Las líneas vacías serán ignoradas.
        </p>

        <textarea
          className="input-field"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ 
            height: '300px', 
            resize: 'vertical', 
            fontFamily: 'inherit', 
            marginBottom: '1.5rem',
            lineHeight: '1.5'
          }}
          placeholder="Escribe tus preguntas aquí..."
        />

        <button 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          onClick={handleSave}
          disabled={!text.trim()}
        >
          Guardar y Actualizar Ruleta
        </button>
      </div>
    </div>
  );
}
