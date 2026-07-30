import { useEffect, useState, useRef } from 'react';

// Paleta de colores vibrantes para la ruleta
const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
  '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'
];

export default function Roulette({ questions, spinEvent, onSpinEnd }) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const wheelRef = useRef(null);
  
  // Calcular los segmentos de la ruleta
  const numSegments = questions.length || 1;
  const segmentAngle = 360 / numSegments;
  
  // Construir el conic-gradient
  let conicStops = [];
  for (let i = 0; i < numSegments; i++) {
    const color = COLORS[i % COLORS.length];
    const startAngle = i * segmentAngle;
    const endAngle = (i + 1) * segmentAngle;
    conicStops.push(`${color} ${startAngle}deg ${endAngle}deg`);
  }
  const gradient = `conic-gradient(${conicStops.join(', ')})`;

  useEffect(() => {
    if (spinEvent && spinEvent.targetRotation !== undefined) {
      // Evitar doble giro
      if (isSpinning) return;
      
      setIsSpinning(true);
      setSelectedQuestion(null);
      
      // Aplicar el nuevo ángulo (sumando el actual para mantener la rotación continua)
      // spinEvent.targetRotation trae el ángulo final incluyendo las vueltas
      // Pero para que gire desde donde está, simplemente podemos sumarlo.
      // O, como el servidor manda 'targetRotation' (vueltas + offset),
      // Nos aseguramos de sumar eso a la rotación base.
      
      const newRotation = rotation + spinEvent.targetRotation;
      setRotation(newRotation);
      
      // Calcular cuál es el ganador
      // La ruleta gira 'newRotation' grados en sentido horario.
      // El puntero está en la posición 0 grados (arriba).
      // Después de girar, el ángulo del componente bajo el puntero es:
      // (360 - (newRotation % 360)) % 360
      const normalizedRotation = (360 - (newRotation % 360)) % 360;
      const winningIndex = Math.floor(normalizedRotation / segmentAngle);
      
      // Esperar a que termine la animación (5 segundos)
      setTimeout(() => {
        setIsSpinning(false);
        setSelectedQuestion(questions[winningIndex]);
        if (onSpinEnd) onSpinEnd(); // Cambiar turno
      }, 5500); // 5.5s para asegurar que terminó (transición es 5s)
    }
  }, [spinEvent]);

  if (questions.length === 0) {
    return <div style={{ color: 'var(--text-muted)' }}>No hay preguntas en la ruleta.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      
      {/* Contenedor de la Ruleta */}
      <div style={{ position: 'relative', width: '300px', height: '300px', margin: '2rem 0' }}>
        
        {/* Puntero */}
        <div style={{
          position: 'absolute',
          top: '-15px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '30px',
          height: '30px',
          background: 'var(--text-main)',
          clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
          zIndex: 10,
          filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.5))'
        }}></div>

        {/* Rueda */}
        <div
          ref={wheelRef}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: gradient,
            border: '8px solid var(--glass-border)',
            boxShadow: '0 0 20px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.5)',
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 5s cubic-bezier(0.2, 0.8, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Textos (Opcional: Si son muchos no caben, pero intentaremos poner números o íconos) */}
          {questions.map((q, i) => {
            const angle = (i * segmentAngle) + (segmentAngle / 2);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '50%',
                  height: '50%',
                  transformOrigin: 'bottom',
                  transform: `translateX(-50%) rotate(${angle}deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  paddingTop: '20px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
        
        {/* Centro de la Rueda */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px',
          background: 'var(--bg-dark)',
          borderRadius: '50%',
          border: '4px solid var(--text-main)',
          zIndex: 5
        }}></div>
      </div>

      {/* Mostrar la pregunta seleccionada */}
      <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {selectedQuestion && !isSpinning && (
          <div className="glass-panel" style={{ padding: '1rem 2rem', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid var(--primary)', animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
            <h3 style={{ margin: 0, textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-main)' }}>
              {selectedQuestion}
            </h3>
          </div>
        )}
        
        <style>{`
          @keyframes popIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>

    </div>
  );
}
