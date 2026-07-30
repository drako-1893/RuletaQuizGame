import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export default function QuestionEditor({ questions: initialQuestions, onSave, onClose }) {
  const [questions, setQuestions] = useState([...initialQuestions]);
  const [newQuestion, setNewQuestion] = useState('');

  const handleAdd = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion('');
    }
  };

  const handleRemove = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
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
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Editar Preguntas</h2>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input
            className="input-field"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Añadir nueva pregunta..."
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button className="btn btn-primary" onClick={handleAdd} style={{ padding: '0.75rem' }}>
            <Plus size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {questions.map((q, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.9rem', flex: 1 }}>{q}</span>
              <button className="btn-icon" style={{ color: 'var(--secondary)' }} onClick={() => handleRemove(i)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {questions.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No hay preguntas. ¡Añade algunas!
            </p>
          )}
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          onClick={() => onSave(questions)}
          disabled={questions.length === 0}
        >
          Guardar y Actualizar Ruleta
        </button>
      </div>
    </div>
  );
}
