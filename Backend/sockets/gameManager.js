const jwt = require('jsonwebtoken');
const User = require('../models/userSchema'); // Ensure this matches your file name

let waitingQueue = [];
let activeGames = {};
let playerTimers = {}; // To track how long a user has been waiting

// "Ghost" Names to mimic real players
const botNames = ["SpeedDemon", "MathWiz99", "ProCoder", "Alex_Dev", "ShadowHunter", "NeuralNet", "PixelViper"];

const socketSetup = (io) => {

  // 1. AUTH MIDDLEWARE
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication error"));

      const secret = process.env.ACCESS_TOKEN_SECRET || "PulseIQSecretKey123";
      const decoded = jwt.verify(token, secret);

      socket.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[SOCKET] ⚡ Client Connected: ${socket.id}`);

    // 2. FIND MATCH (With Bot Fallback)
    // ---------------------------------------------------------
    // 2. FIND MATCH (Fixed: Safely defaults to 'classic')
    // ---------------------------------------------------------
    // Change ({ mode }) to ({ mode } = {}) to prevent crash if data is missing
    socket.on('find_match', (data = {}) => { 
      
      const userId = socket.user._id.toString();
      const mode = data.mode || 'classic'; // Default to 'classic' if missing

      // Prevent duplicates
      // We check if user is already in queue (and update their mode if they switched)
      const existingPlayerIndex = waitingQueue.findIndex(p => p.userId === userId);
      if (existingPlayerIndex !== -1) {
          // Optional: If they click "Find Match" again, just update their mode
          waitingQueue[existingPlayerIndex].mode = mode;
          return;
      }

      // Add to Queue
      const playerObj = { 
        socketId: socket.id, 
        userId: userId,
        username: socket.user.name,
        mmr: socket.user.mmr,
        mode: mode 
      };
      
      waitingQueue.push(playerObj);
      console.log(`[QUEUE] User ${socket.user.name} joined [${mode}]. Total: ${waitingQueue.length}`);

      // Filter Queue: Only match players in the SAME mode
      const modeQueue = waitingQueue.filter(p => p.mode === mode);

      if (modeQueue.length >= 2) {
        // Pass the specific mode queue AND the mode string
        createRealMatch(io, modeQueue, mode); 
      } else {
        // Start Timer for Bot
        playerTimers[userId] = setTimeout(() => {
          createBotMatch(io, playerObj, mode);
        }, 10000); 
      }
    });

    // 3. SUBMIT ANSWER
    socket.on('submit_answer', ({ roomId, score }) => {
      const userId = socket.user._id.toString();
      if (activeGames[roomId]) {
        activeGames[roomId].scores[userId] = score;
        socket.to(roomId).emit('opponent_score_update', { userId, score });
      }
    });

    // 4. GAME OVER
    // socket.on('game_over', async ({ roomId }) => {
    //   const game = activeGames[roomId];
    //   if (!game || game.processed) return; 
    //   game.processed = true; 
    //   game.botActive = false; // <--- STOP THE LOOP FLAG

    //   // CLEAR TIMEOUT (Updated)
    //   if (game.botTimer) clearTimeout(game.botTimer);

    //   const p1Id = Object.keys(game.scores)[0];
    //   const p2Id = Object.keys(game.scores)[1];
    //   const s1 = game.scores[p1Id];
    //   const s2 = game.scores[p2Id];

    //   try {
    //     // Handle Player 1 (Real User)
    //     const p1 = await User.findById(p1Id);
    //     if (p1) {
    //         p1.gamesPlayed = (p1.gamesPlayed || 0) + 1;

    //         // Check if P2 is a Bot
    //         if (p2Id.startsWith('bot_')) {
    //             // Logic against Bot
    //             if (s1 > s2) { p1.wins++; p1.mmr += 15; } // Less MMR for beating a bot
    //             else if (s2 > s1) { p1.mmr = Math.max(0, p1.mmr - 10); } // Lose less against bot

    //             await p1.save();
    //             console.log(`[GAME] 🤖 Bot Match Finished. ${p1.name} stats updated.`);
    //         } else {
    //             // Real PvP Logic (Your existing code)
    //             const p2 = await User.findById(p2Id);
    //             p2.gamesPlayed = (p2.gamesPlayed || 0) + 1;

    //             if (s1 > s2) { p1.wins++; p1.mmr += 25; p2.mmr -= 25; }
    //             else if (s2 > s1) { p2.wins++; p2.mmr += 25; p1.mmr -= 25; }

    //             await p1.save();
    //             await p2.save();
    //         }
    //     }
    //   } catch (err) { console.error(err); }

    //   delete activeGames[roomId];
    // });
    // ---------------------------------------------------------
    // 4. GAME OVER (Optimized: History + Stats + Parallel Save)
    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // 4. GAME OVER (Fixed 'attempts' error)
    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // 4. GAME OVER (Updated: +5/-2 Base Logic + Performance Bonus)
    // ---------------------------------------------------------
    socket.on('game_over', async ({ roomId, attempts }) => {
      const game = activeGames[roomId];

      if (!game || game.processed) return;
      game.processed = true;
      game.botActive = false; // Stop Bot Loop
      if (game.botTimer) clearTimeout(game.botTimer);

      const p1Id = Object.keys(game.scores)[0];
      const p2Id = Object.keys(game.scores)[1];
      const s1 = game.scores[p1Id] || 0;
      const s2 = game.scores[p2Id] || 0;

      const senderId = socket.user._id.toString();

      try {
        const p1 = await User.findById(p1Id);

        if (p1) {
          // Init Stats
          p1.gamesPlayed = (p1.gamesPlayed || 0) + 1;
          p1.matchHistory = p1.matchHistory || [];

          // Stats Calc
          const safeAttempts = attempts || s1;
          const p1Attempts = (p1Id === senderId) ? safeAttempts : s1;
          const p1Acc = p1Attempts > 0 ? Math.round((s1 / p1Attempts) * 100) : 0;

          // Performance Diff (Used for MMR Bonus)
          const scoreDiff = Math.abs(s1 - s2);
          
          // BONUS CALCULATION:
          // Win Bonus: +1 MMR per 2 points lead
          const winBonus = Math.round(scoreDiff * 0.5); 
          // Loss Penalty: -1 MMR per 4 points deficit
          const lossPenalty = Math.round(scoreDiff * 0.25); 

          // --- SCENARIO A: BOT MATCH ---
          if (p2Id.startsWith('bot_')) {
            if (s1 > s2) { 
                p1.wins++; 
                // Bot Win: Base 5 + Bonus (Max +25)
                const gain = Math.min(25, 5 + winBonus);
                p1.mmr += gain;
            } 
            else if (s2 > s1) { 
                // Bot Loss: Fixed -2 (Forgiving)
                p1.mmr = Math.max(0, p1.mmr - 2); 
            }

            // Save History
            p1.matchHistory.push({
              result: s1 > s2 ? "WIN" : s1 < s2 ? "LOSS" : "DRAW",
              score: s1,
              wpm: s1,
              accuracy: p1Acc,
              date: new Date()
            });

            if (p1.matchHistory.length > 10) p1.matchHistory.shift();
            await p1.save();
            console.log(`[GAME] 🤖 Bot Match Saved. Accuracy: ${p1Acc}%`);
          }

          // --- SCENARIO B: PVP MATCH ---
          else {
            const p2 = await User.findById(p2Id);
            if (p2) {
              p2.gamesPlayed = (p2.gamesPlayed || 0) + 1;
              p2.matchHistory = p2.matchHistory || [];

              // PvP Logic: +5 Win / -2 Loss (Base) + Scaling
              if (s1 > s2) { 
                  p1.wins++; 
                  const gain = 5 + winBonus;
                  const loss = 2 + lossPenalty;
                  
                  p1.mmr += gain; 
                  p2.mmr = Math.max(0, p2.mmr - loss);
              } 
              else if (s2 > s1) { 
                  p2.wins++; 
                  const gain = 5 + winBonus;
                  const loss = 2 + lossPenalty;

                  p2.mmr += gain; 
                  p1.mmr = Math.max(0, p1.mmr - loss);
              }
              else {
                  // Draw: Small reward (+1) for playing
                  p1.mmr += 1;
                  p2.mmr += 1;
              }

              // P2 Stats (Opponent accuracy is approximated here for now)
              const p2Acc = 100; 

              p1.matchHistory.push({ result: s1 > s2 ? "WIN" : s1 < s2 ? "LOSS" : "DRAW", score: s1, wpm: s1, accuracy: p1Acc, date: new Date() });
              p2.matchHistory.push({ result: s2 > s1 ? "WIN" : s2 < s1 ? "LOSS" : "DRAW", score: s2, wpm: s2, accuracy: p2Acc, date: new Date() });

              if (p1.matchHistory.length > 10) p1.matchHistory.shift();
              if (p2.matchHistory.length > 10) p2.matchHistory.shift();

              await Promise.all([p1.save(), p2.save()]);
              console.log(`[GAME] ⚔️ PvP Saved. P1 Acc: ${p1Acc}%`);
            }
          }
        }
      } catch (err) {
        console.error(`[GAME] ❌ Error saving game:`, err);
      }

      // --- CRITICAL FIX: Tell frontend the game is done ---
      io.to(roomId).emit('game_finished');

      delete activeGames[roomId];
    });

    // 5. DISCONNECT
    socket.on('disconnect', () => {
      // Clear Bot Timer if user leaves queue early
      if (socket.user && playerTimers[socket.user._id]) {
        clearTimeout(playerTimers[socket.user._id]);
        delete playerTimers[socket.user._id];
      }
      waitingQueue = waitingQueue.filter(p => p.socketId !== socket.id);
    });
  });
};

// --- HELPER: Create Real Match ---
function createRealMatch(io) {
  if (waitingQueue.length < 2) return;

  const p1 = waitingQueue.shift();
  const p2 = waitingQueue.shift();

  // Clear timers since they found a match
  clearTimeout(playerTimers[p1.userId]);
  clearTimeout(playerTimers[p2.userId]);

  const roomId = `room_${p1.userId}_${p2.userId}`;
  const s1 = io.sockets.sockets.get(p1.socketId);
  const s2 = io.sockets.sockets.get(p2.socketId);

  if (s1 && s2) {
    s1.join(roomId); s2.join(roomId);

    activeGames[roomId] = { scores: {} };
    activeGames[roomId].scores[p1.userId] = 0;
    activeGames[roomId].scores[p2.userId] = 0;

    const questions = mode === 'algebra'
      ? generateAlgebraQuestions(50)
      : generateMathQuestions(50);
    io.to(roomId).emit('match_found', {
      roomId, questions,
      opponent: { p1: p1.username, p2: p2.username }
    });
  }
}

// --- HELPER: Create Bot Match ---
// --- HELPER: Create Smart Bot Match ---
function createBotMatch(io, realPlayer,mode) {
  // 1. Setup Match
  waitingQueue = waitingQueue.filter(p => p.socketId !== realPlayer.socketId);
  if (playerTimers[realPlayer.userId]) delete playerTimers[realPlayer.userId];

  const botId = `bot_${Date.now()}`;
  const botName = botNames[Math.floor(Math.random() * botNames.length)];
  const roomId = `room_${realPlayer.userId}_${botId}`;

  const socket = io.sockets.sockets.get(realPlayer.socketId);
  if (!socket) return;

  socket.join(roomId);

  // 2. Initialize Scores
  activeGames[roomId] = { scores: {} };
  activeGames[roomId].scores[realPlayer.userId] = 0;
  activeGames[roomId].scores[botId] = 0;
  activeGames[roomId].botActive = true; // Flag to stop loop later

  const questions = mode === 'algebra' 
        ? generateAlgebraQuestions(50) 
        : generateMathQuestions(50);

  socket.emit('match_found', {
    roomId,
    questions,
    opponent: { p1: realPlayer.username, p2: botName }
  });

  console.log(`[BOT] 🤖 Spawning Smart Bot ${botName} vs ${realPlayer.username}`);

  // --- 3. THE SMART LOOP (Recursive) ---
  const runBotTurn = () => {
    // Stop if game ended
    if (!activeGames[roomId] || !activeGames[roomId].botActive) return;

    const userScore = activeGames[roomId].scores[realPlayer.userId] || 0;
    const currentBotScore = activeGames[roomId].scores[botId] || 0;
    const scoreDiff = userScore - currentBotScore;

    // --- DYNAMIC SPEED LOGIC ---
    let nextDelay;

    if (scoreDiff > 5) {
      // USER IS CRUSHING IT -> BOT GOES "GOD MODE"
      // Delay: 800ms to 1500ms (Very Fast)
      nextDelay = Math.floor(Math.random() * 700) + 800;
      console.log(`[BOT] 🚀 ${botName} speeding up! Gap: ${scoreDiff}`);
    }
    else if (scoreDiff < -2) {
      // BOT IS WINNING -> BOT "CHILLS OUT"
      // Delay: 3000ms to 5000ms (Slow)
      nextDelay = Math.floor(Math.random() * 2000) + 3000;
    }
    else {
      // CLOSE MATCH -> NORMAL SPEED
      // Delay: 1500ms to 3500ms
      nextDelay = Math.floor(Math.random() * 2000) + 1500;
    }

    // Make the move
    if (Math.random() > 0.05) { // 95% Accuracy
      activeGames[roomId].scores[botId] = currentBotScore + 1;
      io.to(roomId).emit('opponent_score_update', {
        userId: botId,
        score: currentBotScore + 1
      });
    }

    // Check Win Condition for Bot
    if (currentBotScore + 1 >= 50) {
      // Bot Wins logic handled by client reporting game_over usually, 
      // but we can just stop the loop here.
      activeGames[roomId].botActive = false;
      return;
    }

    // Schedule NEXT turn with the calculated speed
    activeGames[roomId].botTimer = setTimeout(runBotTurn, nextDelay);
  };

  // Start the loop after 2 seconds
  activeGames[roomId].botTimer = setTimeout(runBotTurn, 2000);
}

// ... (Keep your generateMathQuestions helper here) ...
function generateMathQuestions(count) {
  // ... Paste your Math Logic here ...
  const questions = [];
  const ops = ['+', '-', '*', '/'];

  for (let i = 0; i < count; i++) {
    const op = ops[Math.floor(Math.random() * ops.length)];
    let q, a;

    switch (op) {
      case '+':
        const add1 = Math.floor(Math.random() * 50) + 1;
        const add2 = Math.floor(Math.random() * 50) + 1;
        q = `${add1} + ${add2}`;
        a = add1 + add2;
        break;
      case '-':
        const sub1 = Math.floor(Math.random() * 50) + 1;
        const sub2 = Math.floor(Math.random() * 50) + 1;
        const big = Math.max(sub1, sub2);
        const small = Math.min(sub1, sub2);
        q = `${big} - ${small}`;
        a = big - small;
        break;
      case '*':
        const mul1 = Math.floor(Math.random() * 11) + 2;
        const mul2 = Math.floor(Math.random() * 11) + 2;
        q = `${mul1} * ${mul2}`;
        a = mul1 * mul2;
        break;
      case '/':
        const divAns = Math.floor(Math.random() * 11) + 2;
        const divBy = Math.floor(Math.random() * 11) + 2;
        const dividend = divAns * divBy;
        q = `${dividend} / ${divBy}`;
        a = divAns;
        break;
    }
    questions.push({ q, a });
  }
  return questions;
  // return Array.from({length: count}, () => ({q: "1+1", a: 2}));
}

// --- HELPER: Algebra/IQ Mode Generator ---
function generateAlgebraQuestions(count) {
  const questions = [];
  const ops = ['+', '-', '*', '/'];

  for (let i = 0; i < count; i++) {
    const op = ops[Math.floor(Math.random() * ops.length)];
    let num1, num2, result;
    let qString, answer;

    // 1. Generate Base Numbers (Same logic as Classic to keep difficulty balanced)
    switch (op) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        result = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        // Ensure result is positive
        if (num1 < num2) [num1, num2] = [num2, num1];
        result = num1 - num2;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 12) + 2;
        num2 = Math.floor(Math.random() * 12) + 2;
        result = num1 * num2;
        break;
      case '/':
        answer = Math.floor(Math.random() * 12) + 2;
        num2 = Math.floor(Math.random() * 12) + 2;
        num1 = answer * num2;
        result = answer;
        break;
    }

    // 2. Randomly Choose Question Format (The "Mode" Logic)
    // 0 = Standard (10 + 5)
    // 1 = Find Middle (10 + ? = 15)
    // 2 = Find First (? + 5 = 15)
    const format = Math.random();

    if (format < 0.33) {
      // STANDARD
      qString = `${num1} ${op} ${num2}`;
      answer = (op === '/') ? result : (op === '+' ? num1 + num2 : op === '-' ? num1 - num2 : num1 * num2);
    }
    else if (format < 0.66) {
      // FIND MIDDLE: "10 + ? = 15"
      // Note: For Division "20 / ? = 4", the answer is 5.
      const displayResult = (op === '/') ? result : (op === '+' ? num1 + num2 : op === '-' ? num1 - num2 : num1 * num2);
      qString = `${num1} ${op} ? = ${displayResult}`;
      answer = num2;
    }
    else {
      // FIND FIRST: "? + 5 = 15"
      const displayResult = (op === '/') ? result : (op === '+' ? num1 + num2 : op === '-' ? num1 - num2 : num1 * num2);
      qString = `? ${op} ${num2} = ${displayResult}`;
      answer = num1;
    }

    questions.push({ q: qString, a: answer });
  }
  return questions;
}


module.exports = socketSetup;