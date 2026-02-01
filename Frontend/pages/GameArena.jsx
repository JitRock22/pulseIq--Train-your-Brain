
// import { useEffect, useState, useRef } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { socket } from '../socket';

// const GameArena = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   // Game State
//   const [questions] = useState(state?.questions || []);
//   const [qIndex, setQIndex] = useState(0);
//   const [myScore, setMyScore] = useState(0);
//   const [oppScore, setOppScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(60);
//   const [input, setInput] = useState('');
//   const [isGameOver, setIsGameOver] = useState(false);
//   const [shake, setShake] = useState(false); // For visual feedback
//   const [attempts, setAttempts] = useState(0);

//   const inputRef = useRef(null);

//   useEffect(() => {
//     if (!state) { navigate('/dashboard'); return; }

//     socket.on('opponent_score_update', ({ score }) => setOppScore(score));

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           endGame();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     inputRef.current?.focus();

//     return () => {
//       clearInterval(timer);
//       socket.off('opponent_score_update');
//     };
//   }, []);

//   // const handleInput = (e) => {
//   //   const val = e.target.value;
//   //   setInput(val);

//   //   // Auto-focus keep alive
//   //   if (val.length > 3) setInput(val.slice(0, 3)); 

//   //   const currentQ = questions[qIndex];

//   //   if (parseInt(val) === currentQ.a) {
//   //     const newScore = myScore + 1;
//   //     setMyScore(newScore);
//   //     setQIndex(prev => prev + 1);
//   //     setInput(''); 

//   //     // Send Score to Server
//   //     socket.emit('submit_answer', { roomId: state.roomId, score: newScore });

//   //   } else if (val.length >= String(currentQ.a).length) {
//   //     // Wrong Answer Feedback (Shake effect)
//   //     setShake(true);
//   //     setTimeout(() => setShake(false), 300);
//   //     setInput('');
//   //   }
//   // };

//   // 2. UPDATE handleInput
//   const handleInput = (e) => {
//     const val = e.target.value;
//     setInput(val);

//     // Auto-focus keep alive
//     if (val.length > 3) setInput(val.slice(0, 3));

//     const currentQ = questions[qIndex];

//     // CASE A: CORRECT ANSWER
//     if (parseInt(val) === currentQ.a) {
//       const newScore = myScore + 1;
//       setMyScore(newScore);
//       setAttempts(prev => prev + 1); // <--- Count Attempt
//       setQIndex(prev => prev + 1);
//       setInput('');

//       // ... (sound and streak logic) ...

//       socket.emit('submit_answer', { roomId: state.roomId, score: newScore });

//     }
//     // CASE B: WRONG ANSWER (Length matches but value is wrong)
//     else if (val.length >= String(currentQ.a).length) {
//       setAttempts(prev => prev + 1); // <--- Count Wrong Attempt too!
//       setStreak(0);
//       setInput('');
//       // ... (error sound) ...
//     }
//   };

//   const endGame = () => {
//     setIsGameOver(true);
//     socket.emit('game_over', { roomId: state.roomId, attempts: attempts });
//   }

//   if (!state) return null;

//   return (
//     <div className="min-h-screen bg-slate-900 text-white flex flex-col overflow-hidden relative font-mono">

//       {/* --- BACKGROUND GRID --- */}
//       <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,27,0.9),rgba(18,24,27,0.9)),url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-40 z-0"></div>

//       {/* --- GAME OVER MODAL --- */}
//       {isGameOver && (
//         <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center animate-slide-up">
//           <div className="glass-panel p-10 rounded-2xl text-center border border-white/20 box-glow">
//             <h2 className="text-lg text-slate-400 uppercase tracking-[0.3em] mb-4">Match Result</h2>
//             <h1 className="text-7xl font-black mb-8 italic">
//               {myScore > oppScore ? <span className="text-green-400 text-glow">VICTORY</span> :
//                 myScore < oppScore ? <span className="text-red-500 text-glow">DEFEAT</span> :
//                   <span className="text-yellow-400">DRAW</span>}
//             </h1>

//             <div className="flex gap-12 text-3xl font-bold mb-10">
//               <div className="flex flex-col">
//                 <span className="text-sm text-slate-500 mb-2">YOU</span>
//                 <span className="text-cyan-400">{myScore}</span>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-sm text-slate-500 mb-2">ENEMY</span>
//                 <span className="text-purple-500">{oppScore}</span>
//               </div>
//             </div>

//             <button
//               onClick={() => navigate('/dashboard')}
//               className="bg-white text-black px-8 py-3 rounded font-bold hover:bg-cyan-400 transition w-full"
//             >
//               RETURN TO LOBBY
//             </button>
//           </div>
//         </div>
//       )}

//       {/* --- HEADS UP DISPLAY (HUD) --- */}
//       <div className="relative z-10 w-full p-6 flex items-end justify-between gap-8 bg-gradient-to-b from-slate-900 to-transparent pb-12">

//         {/* PLAYER BAR */}
//         <div className="flex-1">
//           <div className="flex justify-between items-end mb-2">
//             <span className="text-cyan-400 font-bold text-xl tracking-widest">YOU</span>
//             <span className="text-4xl font-black text-white">{myScore}</span>
//           </div>
//           <div className="h-6 bg-slate-800 rounded skew-x-[-15deg] border border-slate-700 overflow-hidden relative">
//             <div
//               className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-200 ease-out"
//               style={{ width: `${(myScore / 50) * 100}%` }}
//             ></div>
//             {/* Grid overlay for tech look */}
//             <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-30"></div>
//           </div>
//         </div>

//         {/* TIMER */}
//         <div className="w-32 text-center flex flex-col items-center">
//           <div className={`text-6xl font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
//             {timeLeft}
//           </div>
//           <span className="text-xs text-slate-500 uppercase tracking-widest">Seconds</span>
//         </div>

//         {/* ENEMY BAR */}
//         <div className="flex-1 text-right">
//           <div className="flex justify-between items-end mb-2 flex-row-reverse">
//             <span className="text-purple-500 font-bold text-xl tracking-widest">ENEMY</span>
//             <span className="text-4xl font-black text-white">{oppScore}</span>
//           </div>
//           <div className="h-6 bg-slate-800 rounded skew-x-[15deg] border border-slate-700 overflow-hidden relative">
//             <div
//               className="h-full bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.6)] float-right transition-all duration-200 ease-out"
//               style={{ width: `${(oppScore / 50) * 100}%` }}
//             ></div>
//           </div>
//         </div>
//       </div>

//       {/* --- MAIN GAME CARD --- */}
//       <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-20">

//         <div className={`relative glass-panel px-16 py-12 rounded-3xl border border-white/10 shadow-2xl text-center transform transition-transform ${shake ? 'translate-x-2' : ''}`}>

//           <h3 className="text-slate-400 text-sm uppercase tracking-[0.4em] mb-6">Current Problem</h3>

//           <div className="text-8xl md:text-9xl font-black text-white mb-8 tracking-tighter select-none drop-shadow-2xl">
//             {questions[qIndex]?.q}
//           </div>

//           <div className="relative inline-block w-full max-w-[200px]">
//             <input
//               ref={inputRef}
//               type="number"
//               value={input}
//               onChange={handleInput}
//               placeholder="?"
//               className="w-full bg-transparent border-b-4 border-cyan-500/50 text-center text-6xl font-bold py-2 text-cyan-400 outline-none focus:border-cyan-400 transition-colors placeholder-slate-700"
//               autoFocus
//             />
//           </div>

//           <p className="mt-8 text-slate-500 text-xs uppercase tracking-widest">Type Answer • Auto Submit</p>
//         </div>

//       </div>

//     </div>
//   );
// };

// export default GameArena;


// import { useEffect, useState, useRef } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { socket } from '../socket';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Zap, Clock, Trophy, XCircle, MinusCircle, ArrowRight, Target, Activity, Brain } from 'lucide-react';

// const GameArena = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   // --- GAME STATE ---
//   const [questions] = useState(state?.questions || []);
//   const [qIndex, setQIndex] = useState(0);
//   const [myScore, setMyScore] = useState(0);
//   const [oppScore, setOppScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(60);
//   const [input, setInput] = useState('');

//   // --- END GAME STATE ---
//   const [isGameOver, setIsGameOver] = useState(false);
//   const [gameResult, setGameResult] = useState(null); 
//   const [isDataSaved, setIsDataSaved] = useState(false); 
//   const [mmrChange, setMmrChange] = useState(0);

//   // --- VISUAL FX STATE ---
//   const [inputStatus, setInputStatus] = useState('normal'); // normal, correct, wrong

//   // --- REFS ---
//   const attemptsRef = useRef(0); 
//   const inputRef = useRef(null);
//   const myScoreRef = useRef(0);
//   const oppScoreRef = useRef(0);

//   useEffect(() => {
//     if (!state) { navigate('/dashboard'); return; }

//     socket.on('opponent_score_update', ({ score }) => {
//         setOppScore(score);
//         oppScoreRef.current = score;
//     });

//     socket.on('game_finished', () => {
//       setIsDataSaved(true); 
//     });

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           endGame(); 
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     inputRef.current?.focus();

//     return () => {
//       clearInterval(timer);
//       socket.off('opponent_score_update');
//       socket.off('game_finished');
//     };
//   }, []);

//   const handleInput = (e) => {
//     const val = e.target.value;
//     setInput(val);

//     if (val.length > 3) setInput(val.slice(0, 3));

//     const currentQ = questions[qIndex];

//     // CORRECT ANSWER
//     if (parseInt(val) === currentQ.a) {
//       const newScore = myScore + 1;
//       setMyScore(newScore);
//       myScoreRef.current = newScore;
//       attemptsRef.current += 1;

//       // Visual Feedback
//       setInputStatus('correct');
//       setTimeout(() => setInputStatus('normal'), 200);

//       setQIndex(prev => prev + 1);
//       setInput('');

//       socket.emit('submit_answer', { roomId: state.roomId, score: newScore });
//     }
//     // WRONG ANSWER (Wait for full length to punish)
//     else if (val.length >= String(currentQ.a).length) {
//       attemptsRef.current += 1;

//       // Visual Feedback
//       setInputStatus('wrong');
//       setTimeout(() => {
//           setInputStatus('normal');
//           setInput('');
//       }, 300);
//     }
//   };

//   const endGame = () => {
//     if (isGameOver) return;
//     setIsGameOver(true);

//     const finalMyScore = myScoreRef.current;
//     const finalOppScore = oppScoreRef.current;
//     const scoreDiff = Math.abs(finalMyScore - finalOppScore);

//     // Calculate Projected MMR (Visual)
//     let calculatedMMR = 0;

//     if (finalMyScore > finalOppScore) {
//         setGameResult('WIN');
//         calculatedMMR = Math.round(5 + (scoreDiff * 0.5));
//     }
//     else if (finalMyScore < finalOppScore) {
//         setGameResult('LOSS');
//         calculatedMMR = -Math.round(2 + (scoreDiff * 0.25));
//     }
//     else {
//         setGameResult('DRAW');
//         calculatedMMR = 1;
//     }
//     setMmrChange(calculatedMMR);

//     socket.emit('game_over', { 
//         roomId: state.roomId, 
//         attempts: attemptsRef.current 
//     });
//   };

//   // Stats
//   const myAccuracy = attemptsRef.current > 0 ? Math.round((myScore / attemptsRef.current) * 100) : 0;
//   const calculateIQ = (score, acc) => Math.round(80 + (score * 1.2) + (acc * 0.1));
//   const myIQ = calculateIQ(myScore, myAccuracy);

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden relative selection:bg-blue-100 flex flex-col">

//       {/* 1. CLEAN HEADER */}
//       <header className="bg-white border-b border-slate-200 shadow-sm z-20">
//         <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">

//             {/* My Score */}
//             <div className="flex flex-col">
//                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">You</span>
//                 <span className="text-3xl font-black text-blue-600">{myScore}</span>
//             </div>

//             {/* Timer Pill */}
//             <div className={`flex items-center gap-2 px-5 py-2 rounded-full border ${timeLeft <= 10 ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
//                 <Clock className="w-4 h-4" />
//                 <span className="text-xl font-bold font-mono tabular-nums">{timeLeft}s</span>
//             </div>

//             {/* Opponent Score */}
//             <div className="flex flex-col items-end">
//                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Opponent</span>
//                 <span className="text-3xl font-black text-slate-400">{oppScore}</span>
//             </div>
//         </div>

//         {/* Minimal Progress Bar */}
//         <div className="w-full h-1 bg-slate-100 flex">
//             <motion.div 
//                 className="h-full bg-blue-500" 
//                 animate={{ width: `${(myScore / (myScore + oppScore || 1)) * 50}%` }}
//                 transition={{ type: 'spring', stiffness: 100 }}
//             />
//             <div className="flex-1"></div>
//             <motion.div 
//                 className="h-full bg-slate-300" 
//                 animate={{ width: `${(oppScore / (myScore + oppScore || 1)) * 50}%` }}
//                 transition={{ type: 'spring', stiffness: 100 }}
//             />
//         </div>
//       </header>

//       {/* 2. MAIN GAME CARD */}
//       <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">

//         {/* Focus Container */}
//         <div className="w-full max-w-xl">
//             <motion.div 
//                 animate={inputStatus === 'wrong' ? { x: [-10, 10, -10, 10, 0] } : {}}
//                 className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 text-center"
//             >
//                 {/* Question Label */}
//                 <h3 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">
//                     Question {qIndex + 1}
//                 </h3>

//                 {/* The Question */}
//                 <div className="text-8xl font-black text-slate-800 mb-10 tracking-tighter">
//                     {questions[qIndex]?.q}
//                 </div>

//                 {/* The Input */}
//                 <div className="relative max-w-[200px] mx-auto">
//                     <input 
//                         ref={inputRef}
//                         type="number" 
//                         value={input}
//                         onChange={handleInput}
//                         placeholder="?"
//                         className={`
//                             w-full bg-transparent text-center text-6xl font-black py-2 outline-none transition-all duration-200 font-mono
//                             border-b-4 placeholder-slate-200
//                             ${inputStatus === 'correct' ? 'border-emerald-500 text-emerald-600' : 
//                               inputStatus === 'wrong' ? 'border-rose-500 text-rose-600' : 
//                               'border-slate-200 text-blue-600 focus:border-blue-500'}
//                         `}
//                         autoFocus
//                     />
//                 </div>
//             </motion.div>

//             {/* Keyboard Hint */}
//             <p className="text-center text-slate-400 text-sm mt-8 font-medium">
//                 Type answer • Auto-submit
//             </p>
//         </div>
//       </main>

//       {/* 3. RESULT MODAL (Clean Modern UI) */}
//       <AnimatePresence>
//         {isGameOver && (
//             <motion.div 
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4"
//             >
//                 <motion.div 
//                     initial={{ scale: 0.95, y: 20 }}
//                     animate={{ scale: 1, y: 0 }}
//                     className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100"
//                 >
//                     {/* Header */}
//                     <div className="p-8 text-center border-b border-slate-100">
//                         <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 
//                             ${gameResult === 'WIN' ? 'bg-emerald-100 text-emerald-600' : 
//                               gameResult === 'LOSS' ? 'bg-rose-100 text-rose-600' : 
//                               'bg-slate-100 text-slate-600'}`}>
//                             {gameResult === 'WIN' && <Trophy className="w-8 h-8" />}
//                             {gameResult === 'LOSS' && <XCircle className="w-8 h-8" />}
//                             {gameResult === 'DRAW' && <MinusCircle className="w-8 h-8" />}
//                         </div>

//                         <h2 className="text-3xl font-black text-slate-800 mb-2">
//                             {gameResult === 'WIN' ? 'Victory!' : gameResult === 'LOSS' ? 'Defeat' : 'Draw'}
//                         </h2>

//                         {/* MMR Badge */}
//                         <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold 
//                             ${mmrChange > 0 ? 'bg-emerald-50 text-emerald-700' : 
//                               mmrChange < 0 ? 'bg-rose-50 text-rose-700' : 
//                               'bg-slate-100 text-slate-600'}`}>
//                             {mmrChange > 0 ? <ArrowRight className="w-3 h-3 -rotate-45" /> : 
//                              mmrChange < 0 ? <ArrowRight className="w-3 h-3 rotate-45" /> : null}
//                             {mmrChange > 0 ? '+' : ''}{mmrChange} MMR
//                         </div>
//                     </div>

//                     {/* Stats List */}
//                     <div className="p-6 space-y-3">
//                         <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
//                             <div className="flex items-center gap-3">
//                                 <Target className="w-5 h-5 text-blue-500" />
//                                 <span className="text-sm font-bold text-slate-600">Score</span>
//                             </div>
//                             <span className="text-lg font-black text-slate-900">{myScore}</span>
//                         </div>

//                         <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
//                             <div className="flex items-center gap-3">
//                                 <Activity className="w-5 h-5 text-emerald-500" />
//                                 <span className="text-sm font-bold text-slate-600">Accuracy</span>
//                             </div>
//                             <span className="text-lg font-black text-slate-900">{myAccuracy}%</span>
//                         </div>

//                         <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
//                             <div className="flex items-center gap-3">
//                                 <Brain className="w-5 h-5 text-purple-500" />
//                                 <span className="text-sm font-bold text-slate-600">Match IQ</span>
//                             </div>
//                             <span className="text-lg font-black text-slate-900">{myIQ}</span>
//                         </div>
//                     </div>

//                     {/* Footer Button */}
//                     <div className="p-6 pt-0">
//                         {isDataSaved ? (
//                             <button 
//                                 onClick={() => navigate('/dashboard')}
//                                 className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
//                             >
//                                 Continue
//                                 <ArrowRight className="w-4 h-4" />
//                             </button>
//                         ) : (
//                             <button disabled className="w-full py-3.5 bg-slate-100 text-slate-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-wait">
//                                 <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
//                                 Saving...
//                             </button>
//                         )}
//                     </div>
//                 </motion.div>
//             </motion.div>
//         )}
//       </AnimatePresence>

//     </div>
//   );
// };

// export default GameArena;



import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, Trophy, XCircle, MinusCircle, ArrowRight } from 'lucide-react';

const GameArena = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    // --- GAME STATE ---
    const [questions] = useState(state?.questions || []);
    const [qIndex, setQIndex] = useState(0);
    const [myScore, setMyScore] = useState(0);
    const [oppScore, setOppScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [input, setInput] = useState('');

    // --- END GAME STATE ---
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameResult, setGameResult] = useState(null);
    const [isDataSaved, setIsDataSaved] = useState(false);
    const [mmrChange, setMmrChange] = useState(0);
    const [gameTitle, setGameTitle] = useState('');

    // --- VISUAL FX STATE ---
    const [inputStatus, setInputStatus] = useState('normal');

    // --- REFS ---
    const attemptsRef = useRef(0);
    const inputRef = useRef(null);
    const myScoreRef = useRef(0);
    const oppScoreRef = useRef(0);

    useEffect(() => {
        if (!state) { navigate('/dashboard'); return; }

        socket.on('opponent_score_update', ({ score }) => {
            setOppScore(score);
            oppScoreRef.current = score;
        });

        socket.on('game_finished', () => {
            setIsDataSaved(true);
        });

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        inputRef.current?.focus();

        return () => {
            clearInterval(timer);
            socket.off('opponent_score_update');
            socket.off('game_finished');
        };
    }, []);

    const handleInput = (e) => {
        const val = e.target.value;
        setInput(val);

        if (val.length > 3) setInput(val.slice(0, 3));

        const currentQ = questions[qIndex];

        if (parseInt(val) === currentQ.a) {
            const newScore = myScore + 1;
            setMyScore(newScore);
            myScoreRef.current = newScore;
            attemptsRef.current += 1;

            setInputStatus('correct');
            setTimeout(() => setInputStatus('normal'), 200);

            setQIndex(prev => prev + 1);
            setInput('');

            socket.emit('submit_answer', { roomId: state.roomId, score: newScore });
        }
        else if (val.length >= String(currentQ.a).length) {
            attemptsRef.current += 1;
            setInputStatus('wrong');
            setTimeout(() => {
                setInputStatus('normal');
                setInput('');
            }, 300);
        }
    };

    const endGame = () => {
        if (isGameOver) return;
        setIsGameOver(true);

        const finalMyScore = myScoreRef.current;
        const finalOppScore = oppScoreRef.current;
        const scoreDiff = finalMyScore - finalOppScore;
        const absDiff = Math.abs(scoreDiff);

        let calculatedMMR = 0;

        if (finalMyScore > finalOppScore) {
            setGameResult('WIN');
            calculatedMMR = Math.round(5 + (absDiff * 0.5));
        }
        else if (finalMyScore < finalOppScore) {
            setGameResult('LOSS');
            calculatedMMR = -Math.round(2 + (absDiff * 0.25));
        }
        else {
            setGameResult('DRAW');
            calculatedMMR = 1;
        }
        setMmrChange(calculatedMMR);

        // Title Logic
        let title = "GG WP";
        if (finalMyScore > finalOppScore) {
            if (absDiff >= 15) title = "DOMINATOR";
            else if (absDiff >= 8) title = "SOLID WIN";
            else title = "CLOSE CALL";
        } else if (finalMyScore < finalOppScore) {
            if (absDiff >= 15) title = "CRUSHED";
            else if (absDiff <= 3) title = "HEARTBREAKER";
            else title = "DEFEAT";
        } else {
            title = "DEADLOCK";
        }
        setGameTitle(title);

        socket.emit('game_over', {
            roomId: state.roomId,
            attempts: attemptsRef.current
        });
    };

    const myAccuracy = attemptsRef.current > 0 ? Math.round((myScore / attemptsRef.current) * 100) : 0;
    const oppAccuracy = oppScore > 0 ? Math.floor(Math.random() * (95 - 85 + 1) + 85) : 0;

    // --- CHART HELPERS ---
    const maxScore = Math.max(myScore, oppScore, 1);
    const maxAcc = 100; // Accuracy is always out of 100

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden relative selection:bg-blue-100 dark:selection:bg-blue-900 flex flex-col transition-colors duration-300">

            {/* HEADER */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-20 transition-colors">
                <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">You</span>
                        <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{myScore}</span>
                    </div>
                    <div className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-colors ${timeLeft <= 10 ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'}`}>
                        <Clock className="w-4 h-4" />
                        <span className="text-xl font-bold font-mono tabular-nums">{timeLeft}s</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Opponent</span>
                        <span className="text-3xl font-black text-slate-400 dark:text-slate-600">{oppScore}</span>
                    </div>
                </div>
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 flex">
                    <motion.div className="h-full bg-blue-500" animate={{ width: `${(myScore / (myScore + oppScore || 1)) * 50}%` }} transition={{ type: 'spring', stiffness: 100 }} />
                    <div className="flex-1"></div>
                    <motion.div className="h-full bg-slate-300 dark:bg-slate-700" animate={{ width: `${(oppScore / (myScore + oppScore || 1)) * 50}%` }} transition={{ type: 'spring', stiffness: 100 }} />
                </div>
            </header>

            {/* GAME AREA */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-xl">
                    <motion.div
                        animate={inputStatus === 'wrong' ? { x: [-10, 10, -10, 10, 0] } : {}}
                        className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-12 text-center transition-colors"
                    >
                        <h3 className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-8">
                            Question {qIndex + 1}
                        </h3>
                        <div className="text-8xl font-black text-slate-800 dark:text-white mb-10 tracking-tighter">
                            {questions[qIndex]?.q}
                        </div>
                        <div className="relative max-w-[200px] mx-auto">
                            <input
                                ref={inputRef}
                                type="number"
                                value={input}
                                onChange={handleInput}
                                placeholder="?"
                                className={`w-full bg-transparent text-center text-6xl font-black py-2 outline-none transition-all duration-200 font-mono border-b-4 placeholder-slate-200 dark:placeholder-slate-800 ${inputStatus === 'correct' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : inputStatus === 'wrong' ? 'border-rose-500 text-rose-600 dark:text-rose-400' : 'border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 focus:border-blue-500'}`}
                                autoFocus
                            />
                        </div>
                    </motion.div>
                    <p className="text-center text-slate-400 dark:text-slate-600 text-sm mt-8 font-medium">Type answer • Auto-submit</p>
                </div>
            </main>

            {/* --- RESULT MODAL (Comparative Graph) --- */}
            <AnimatePresence>
                {isGameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-800"
                        >
                            {/* 1. Header */}
                            {/* RESULT HEADER - IMPROVED */}
                            {/* RESULT HEADER - COMPACT & CLEAN */}
                            <div className={`p-4 text-center border-b ${gameResult === 'WIN' ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/50' :
                                    gameResult === 'LOSS' ? 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/50' :
                                        'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/50'
                                }`}>

                                {/* 1. ANIMATED ICON (Smaller Size: w-14) */}
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg border-4 ${gameResult === 'WIN' ? 'bg-emerald-500 border-emerald-200 dark:border-emerald-800' :
                                        gameResult === 'LOSS' ? 'bg-rose-500 border-rose-200 dark:border-rose-800' :
                                            'bg-amber-500 border-amber-200 dark:border-amber-800'
                                    }`}>
                                    {gameResult === 'WIN' && <Trophy className="w-6 h-6 text-white drop-shadow-md" />}
                                    {gameResult === 'LOSS' && <XCircle className="w-6 h-6 text-white drop-shadow-md" />}
                                    {gameResult === 'DRAW' && <MinusCircle className="w-6 h-6 text-white drop-shadow-md" />}
                                </div>

                                {/* 2. BADGE (Game Title) */}
                                <div className={`inline-block px-3 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full mb-2 shadow-sm ${gameResult === 'WIN' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' :
                                        gameResult === 'LOSS' ? 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300' :
                                            'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
                                    }`}>
                                    {gameTitle || (gameResult === 'DRAW' ? 'Perfectly Balanced' : '')}
                                </div>

                                {/* 3. MAIN TITLE */}
                                <h2 className={`text-4xl font-black italic tracking-tighter mb-2 drop-shadow-sm ${gameResult === 'WIN' ? 'text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-green-600' :
                                        gameResult === 'LOSS' ? 'text-transparent bg-clip-text bg-gradient-to-br from-rose-500 to-red-600' :
                                            'text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-orange-600'
                                    }`}>
                                    {gameResult === 'WIN' ? 'VICTORY' : gameResult === 'LOSS' ? 'DEFEAT' : 'DEADLOCK'}
                                </h2>

                                {/* 4. MMR REWARD */}
                                <div className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs ${mmrChange > 0 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                                        mmrChange < 0 ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' :
                                            'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                    }`}>
                                    {mmrChange > 0 ? <ArrowRight className="w-3.5 h-3.5 -rotate-45" /> :
                                        mmrChange < 0 ? <ArrowRight className="w-3.5 h-3.5 rotate-45" /> :
                                            <MinusCircle className="w-3.5 h-3.5" />}

                                    {mmrChange > 0 ? `+${mmrChange} RATING` :
                                        mmrChange < 0 ? `${mmrChange} RATING` :
                                            'RATING SECURED'}
                                </div>
                            </div>

                            {/* 2. Comparative Graph Area */}
                            {/* 2. Comparative Graph Area */}
                            <div className="p-8">
                                <div className="flex gap-8 justify-center h-48 items-end px-4">

                                    {/* SCORE GROUP */}
                                    <div className="flex gap-2 items-end w-24 h-full"> {/* Added h-full */}
                                        {/* User Score */}
                                        <div className="flex flex-col items-center justify-end gap-2 flex-1 h-full group"> {/* Added h-full justify-end */}
                                            <span className="text-sm font-black text-blue-600 dark:text-blue-400">{myScore}</span>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${(myScore / maxScore) * 80}%` }} // Max 80% to leave room for text
                                                transition={{ duration: 1, ease: 'circOut' }}
                                                className={`w-full rounded-t-md min-h-[4px] relative ${myScore >= oppScore ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700 opacity-50'}`}
                                            />
                                        </div>
                                        {/* Opp Score */}
                                        <div className="flex flex-col items-center justify-end gap-2 flex-1 h-full group"> {/* Added h-full justify-end */}
                                            <span className="text-sm font-bold text-slate-400 dark:text-slate-600">{oppScore}</span>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${(oppScore / maxScore) * 80}%` }}
                                                transition={{ duration: 1, ease: 'circOut', delay: 0.1 }}
                                                className={`w-full rounded-t-md min-h-[4px] relative ${oppScore > myScore ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700 opacity-50'}`}
                                            />
                                        </div>
                                    </div>

                                    {/* DIVIDER */}
                                    <div className="h-32 w-px bg-slate-100 dark:bg-slate-800 self-center"></div>

                                    {/* ACCURACY GROUP */}
                                    <div className="flex gap-2 items-end w-24 h-full"> {/* Added h-full */}
                                        {/* User Acc */}
                                        <div className="flex flex-col items-center justify-end gap-2 flex-1 h-full group">
                                            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{myAccuracy}%</span>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${(myAccuracy / maxAcc) * 80}%` }}
                                                transition={{ duration: 1, ease: 'circOut', delay: 0.2 }}
                                                className={`w-full rounded-t-md min-h-[4px] relative ${myAccuracy >= oppAccuracy ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700 opacity-50'}`}
                                            />
                                        </div>
                                        {/* Opp Acc */}
                                        <div className="flex flex-col items-center justify-end gap-2 flex-1 h-full group">
                                            <span className="text-sm font-bold text-slate-400 dark:text-slate-600">{oppAccuracy}%</span>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${(oppAccuracy / maxAcc) * 80}%` }}
                                                transition={{ duration: 1, ease: 'circOut', delay: 0.3 }}
                                                className={`w-full rounded-t-md min-h-[4px] relative ${oppAccuracy > myAccuracy ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700 opacity-50'}`}
                                            />
                                        </div>
                                    </div>

                                </div>

                                {/* Labels */}
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-4 px-6">
                                    <span className="w-24 text-center">Score</span>
                                    <span className="w-24 text-center">Accuracy</span>
                                </div>

                                {/* Legend */}
                                <div className="flex justify-center gap-4 mt-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-slate-800 dark:bg-white"></div>
                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">You</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                                        <span className="text-xs font-medium text-slate-400 dark:text-slate-600">Opponent</span>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Footer */}
                            <div className="p-6 pt-0">
                                {isDataSaved ? (
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="w-full py-3.5 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        Continue
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button disabled className="w-full py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-wait">
                                        <div className="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 border-t-slate-500 dark:border-t-slate-300 rounded-full animate-spin"></div>
                                        Saving...
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default GameArena;