const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Estado en memoria de las salas
const rooms = {};

const createRoom = (roomId) => {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      players: [],
      questions: [
        '¿Cuál es tu película favorita y por qué?',
        'Si pudieras viajar en el tiempo, ¿a dónde irías?',
        '¿Qué superpoder elegirías tener?',
        '¿Cuál es el momento más embarazoso de tu vida?',
        '¿Qué comida odias que a todos les encanta?'
      ],
      turnIndex: 0,
      chat: []
    };
  }
};

io.on('connection', (socket) => {
  console.log('Un usuario conectado:', socket.id);

  socket.on('join_room', ({ roomId, playerName }) => {
    createRoom(roomId);
    
    // Unirse al canal de Socket.io
    socket.join(roomId);
    
    // Añadir jugador
    const player = { id: socket.id, name: playerName };
    rooms[roomId].players.push(player);
    
    // Emitir estado actualizado a la sala
    io.to(roomId).emit('room_updated', rooms[roomId]);
    console.log(`${playerName} se unió a la sala ${roomId}`);
  });

  socket.on('spin_roulette', ({ roomId }) => {
    if (rooms[roomId]) {
      // Generar un ángulo aleatorio para que todos vean el mismo giro
      const targetRotation = Math.floor(Math.random() * 360) + (360 * 5); // 5 vueltas + ángulo
      
      io.to(roomId).emit('roulette_spun', { targetRotation });
    }
  });

  socket.on('next_turn', ({ roomId }) => {
    if (rooms[roomId]) {
      const room = rooms[roomId];
      if (room.players.length > 0) {
        room.turnIndex = (room.turnIndex + 1) % room.players.length;
        io.to(roomId).emit('room_updated', room);
      }
    }
  });

  socket.on('update_questions', ({ roomId, questions }) => {
    if (rooms[roomId]) {
      rooms[roomId].questions = questions;
      io.to(roomId).emit('room_updated', rooms[roomId]);
    }
  });

  socket.on('send_message', ({ roomId, message, playerName }) => {
    if (rooms[roomId]) {
      const chatMsg = { id: Date.now(), playerName, message };
      rooms[roomId].chat.push(chatMsg);
      io.to(roomId).emit('room_updated', rooms[roomId]);
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
    // Remover al jugador de las salas
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        
        // Ajustar el turnIndex si es necesario
        if (room.players.length === 0) {
          delete rooms[roomId]; // Limpiar sala vacía
        } else {
          if (room.turnIndex >= room.players.length) {
            room.turnIndex = 0;
          }
          io.to(roomId).emit('room_updated', room);
        }
        break; // Un socket solo está en una sala en nuestra lógica simple
      }
    }
  });
});

// Integración para despliegue (Render)
// Servir archivos estáticos del frontend en producción
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
