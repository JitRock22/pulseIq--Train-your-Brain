// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { socket } from '../socket';
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area } from 'recharts';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Zap,
//   Brain,
//   TrendingUp,
//   BarChart3,
//   Target,
//   Shield,
//   Crown,
//   Star,
//   ChevronDown,
//   LogOut,
//   Gamepad2,
//   Award,
//   AlertCircle,
//   Search,
//   CheckCircle,
//   Activity,
//   Flame,
//   BookOpen,
//   Cpu,
//   Satellite,
//   Rocket
// } from 'lucide-react';

// // --- LEAGUE CONFIGURATION ---
// const LEAGUES = [
//   { name: 'Rookie', min: 0, max: 1899, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200', shadow: 'shadow-amber-200', gradient: 'from-amber-400 to-orange-500', icon: <BookOpen className="w-8 h-8" /> },
//   { name: 'Apprentice', min: 1900, max: 2799, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200', shadow: 'shadow-blue-200', gradient: 'from-blue-400 to-cyan-500', icon: <Target className="w-8 h-8" /> },
//   { name: 'Challenger', min: 2800, max: 3699, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200', shadow: 'shadow-emerald-200', gradient: 'from-emerald-400 to-green-500', icon: <Zap className="w-8 h-8" /> },
//   { name: 'Striker', min: 3700, max: 4599, color: 'text-violet-600', bg: 'bg-violet-100', border: 'border-violet-200', shadow: 'shadow-violet-200', gradient: 'from-violet-400 to-purple-500', icon: <Flame className="w-8 h-8" /> },
//   { name: 'Warrior', min: 4600, max: 5499, color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200', shadow: 'shadow-orange-200', gradient: 'from-orange-400 to-red-500', icon: <Shield className="w-8 h-8" /> },
//   { name: 'Elite', min: 5500, max: 6399, color: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-200', shadow: 'shadow-rose-200', gradient: 'from-rose-400 to-pink-500', icon: <Crown className="w-8 h-8" /> },
//   { name: 'Master', min: 6400, max: 7299, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200', shadow: 'shadow-purple-200', gradient: 'from-purple-500 to-indigo-600', icon: <Cpu className="w-8 h-8" /> },
//   { name: 'Grandmaster', min: 7300, max: 8199, color: 'text-cyan-600', bg: 'bg-cyan-100', border: 'border-cyan-200', shadow: 'shadow-cyan-200', gradient: 'from-cyan-400 to-blue-600', icon: <Satellite className="w-8 h-8" /> },
//   { name: 'Champion', min: 8200, max: 9099, color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200', shadow: 'shadow-yellow-200', gradient: 'from-yellow-400 to-amber-600', icon: <Star className="w-8 h-8" /> },
//   { name: 'Legend', min: 9100, max: 99999, color: 'text-fuchsia-600', bg: 'bg-fuchsia-100', border: 'border-fuchsia-200', shadow: 'shadow-fuchsia-200', gradient: 'from-fuchsia-500 via-pink-500 to-rose-500', icon: <Rocket className="w-8 h-8" /> }
// ];

// const getLeague = (mmr) => LEAGUES.find(l => mmr >= l.min && mmr <= l.max) || LEAGUES[0];
// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [status, setStatus] = useState('IDLE');
//   const [searchMode, setSearchMode] = useState(null);
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) { navigate('/'); return; }
//       try {
//         const res = await axios.get('http://localhost:3000/api/auth/aboutUser', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setUser(res.data);
//         if (!socket.connected) { socket.auth = { token }; socket.connect(); }
//       } catch (err) {
//         console.error("Auth Error:", err);
//         localStorage.clear();
//         navigate('/');
//       }
//     };
//     fetchUserData();

//     socket.on('match_found', (data) => {
//       setStatus('FOUND');
//       setTimeout(() => navigate(`/game/${data.roomId}`, { state: data }), 1500);
//     });

//     const handleClickOutside = (e) => {
//       if (!e.target.closest('.profile-dropdown') && !e.target.closest('.profile-button')) {
//         setShowProfileDropdown(false);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);

//     return () => {
//       socket.off('match_found');
//       document.removeEventListener('click', handleClickOutside);
//     };
//   }, [navigate]);

//   const findMatch = (mode) => {
//     setStatus('SEARCHING');
//     setSearchMode(mode);
//     socket.emit('find_match', { mode });
//   };


//   const cancelSearch = () => {
//     setStatus('IDLE');
//     setSearchMode(null);
//     socket.emit('cancel_search');
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     socket.disconnect();
//     navigate('/');
//   };

//   if (!user) return (
//     <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         className="z-10 flex flex-col items-center gap-4"
//       >
//         <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//         <p className="text-blue-400 tracking-widest animate-pulse">INITIALIZING...</p>
//       </motion.div>
//     </div>
//   );

//   const currentLeague = getLeague(user.mmr);
//   const totalRange = currentLeague.max - currentLeague.min;
//   const myProgress = user.mmr - currentLeague.min;
//   let progressPercent = (myProgress / totalRange) * 100;
//   if (progressPercent > 100) progressPercent = 100;
//   if (progressPercent < 0) progressPercent = 0;

//   const losses = user.gamesPlayed - user.wins;
//   const winRate = user.gamesPlayed > 0 ? Math.round((user.wins / user.gamesPlayed) * 100) : 0;

//   // --- FIX 1: GRAPH DATA LOGIC ---
//   // Ensure we grab the NEWEST games (slice from end)
//   const history = user.matchHistory || [];

//   // Get last 7 games, but if less than 7, get all.
//   const recentGames = history.slice(-7);

//   const graphData = recentGames.map((game, i) => ({
//     name: `Match ${history.length - recentGames.length + i + 1}`,
//     // Fallback to score if wpm is missing (for old data)
//     speed: game.wpm || game.score || 0,
//     accuracy: game.accuracy || 0,
//     date: new Date(game.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
//   }));

//   // --- FIX 2: RECENT HISTORY LIST LOGIC ---
//   // Create a reversed copy for the list (Newest First)
//   const reversedHistory = [...history].reverse().slice(0, 3);

//   const getUserInitials = () => user.name ? user.name.charAt(0).toUpperCase() : 'U';

//   return (
//     <div className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans overflow-y-auto selection:bg-blue-100">

//       {/* BACKGROUND */}
//       <div className="fixed inset-0 pointer-events-none z-0">
//         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
//         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
//       </div>

//       {/* HEADER */}
//       <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
//           <div className="flex justify-between items-center">

//             {/* LOGO */}
//             <div className="flex items-center space-x-3">
//               <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
//                 <Zap className="w-6 h-6 text-white" fill="currentColor" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
//                   PULSE<span className="text-slate-800 not-italic">IQ</span>
//                 </h1>
//               </div>
//             </div>

//             <div className="flex items-center space-x-6">
//               <div className="hidden md:block text-right">
//                 <div className="flex items-center justify-end space-x-2">
//                   <span className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${currentLeague.gradient} animate-pulse`}></span>
//                   <p className={`text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${currentLeague.gradient}`}>
//                     {currentLeague.name.toUpperCase()}
//                   </p>
//                 </div>
//                 <p className="text-xs font-mono text-slate-500">{user.mmr} MMR</p>
//               </div>

//               {/* PROFILE DROPDOWN */}
//               <div className="relative">
//                 <motion.button
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setShowProfileDropdown(!showProfileDropdown)}
//                   className={`profile-button flex items-center gap-3 p-1.5 pr-3 rounded-full border transition-all duration-200 ${showProfileDropdown ? 'bg-slate-100 border-blue-200 ring-2 ring-blue-100' : 'bg-white border-slate-200 hover:border-blue-300'}`}
//                 >
//                   <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${currentLeague.gradient} shadow-md`}>
//                     {getUserInitials()}
//                   </div>
//                   <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
//                 </motion.button>

//                 <AnimatePresence>
//                   {showProfileDropdown && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
//                       animate={{ opacity: 1, y: 0, scale: 1 }}
//                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
//                       className="profile-dropdown absolute right-0 mt-3 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50"
//                     >
//                       <div className="p-5 border-b border-slate-100 bg-slate-50/50">
//                         <div className="flex items-center space-x-3">
//                           <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${currentLeague.gradient} shadow-lg`}>
//                             {getUserInitials()}
//                           </div>
//                           <div className="space-y-1">
//                             <p className="font-bold text-slate-800 text-base">{user.name}</p>

//                             <div className="flex flex-col gap-1 items-start">
//                               {/* Email Badge */}
//                               <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
//                                 {user.email}
//                               </span>

//                               {/* ID Badge */}
//                               <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-500">
//                                 #{user._id.slice(-4).toUpperCase()}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
//                         <div className="p-3 text-center hover:bg-slate-50">
//                           <p className="text-lg font-bold text-slate-800">{user.gamesPlayed}</p>
//                           <p className="text-[10px] text-slate-500 uppercase">Games</p>
//                         </div>
//                         <div className="p-3 text-center hover:bg-slate-50">
//                           <p className="text-lg font-bold text-emerald-600">{user.wins}</p>
//                           <p className="text-[10px] text-slate-500 uppercase">Wins</p>
//                         </div>
//                         <div className="p-3 text-center hover:bg-slate-50">
//                           <p className="text-lg font-bold text-blue-600">{winRate}%</p>
//                           <p className="text-[10px] text-slate-500 uppercase">WR</p>
//                         </div>
//                       </div>

//                       <div className="p-2 bg-slate-50">
//                         <button
//                           onClick={handleLogout}
//                           className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
//                         >
//                           <LogOut className="w-4 h-4" />
//                           Sign Out
//                         </button>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* --- DASHBOARD CONTENT --- */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//           {/* LEFT COLUMN */}
//           <div className="lg:col-span-2 space-y-8">

//             {/* LEAGUE BANNER */}
//             {/* LEAGUE BANNER - CLEAN VERSION */}
// <motion.div
//   initial={{ y: 20, opacity: 0 }}
//   animate={{ y: 0, opacity: 1 }}
//   className={`bg-white rounded-3xl border ${currentLeague.border} p-8 shadow-sm transition-all hover:shadow-md`}
// >
//   <div className="flex flex-col md:flex-row items-center gap-8">
    
//     {/* 1. Simplified Icon (No Glow) */}
//     <div className={`w-24 h-24 flex-shrink-0 rounded-full bg-slate-50 flex items-center justify-center border-2 ${currentLeague.border}`}>
//        <div className={`${currentLeague.color} transform scale-125`}>
//          {currentLeague.icon}
//        </div>
//     </div>

//     {/* 2. Info Section */}
//     <div className="flex-1 w-full">
//        {/* Header Row */}
//        <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left mb-6">
//           <div>
//              <h2 className={`text-4xl font-bold tracking-tight ${currentLeague.color} mb-1`}>
//                 {currentLeague.name}
//              </h2>
//              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Current Standing</p>
//           </div>
          
//           <div className="mt-4 md:mt-0 flex flex-col items-center md:items-end">
//              <span className="text-4xl font-black text-slate-900 leading-none">{user.mmr}</span>
//              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">MMR Rating</span>
//           </div>
//        </div>

//        {/* Progress Bar Section */}
//        <div className="space-y-2">
//           <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
//              <span>{currentLeague.min}</span>
//              <span className={currentLeague.color}>{Math.round(progressPercent)}% to Promotion</span>
//              <span>{currentLeague.max}</span>
//           </div>
          
//           <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
//              <motion.div 
//                 initial={{ width: 0 }}
//                 animate={{ width: `${progressPercent}%` }}
//                 transition={{ duration: 1, ease: "circOut" }}
//                 className={`h-full rounded-full bg-gradient-to-r ${currentLeague.gradient}`}
//              />
//           </div>
//        </div>
//     </div>

//   </div>
// </motion.div>

//             {/* SMALL STATS */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {[
//                 { label: 'Total Games', value: user.gamesPlayed, icon: <Gamepad2 className="w-5 h-5" />, color: 'text-slate-700', bg: 'bg-white', border: 'border-slate-200' },
//                 { label: 'Victories', value: user.wins, icon: <Award className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
//                 { label: 'Win Ratio', value: `${winRate}%`, icon: <TrendingUp className="w-5 h-5" />, color: winRate >= 50 ? 'text-blue-600' : 'text-amber-600', bg: winRate >= 50 ? 'bg-blue-50' : 'bg-amber-50', border: winRate >= 50 ? 'border-blue-200' : 'border-amber-200' },
//                 { label: 'Defeats', value: losses, icon: <AlertCircle className="w-5 h-5" />, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' }
//               ].map((stat, idx) => (
//                 <motion.div
//                   key={idx}
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.1 * idx + 0.2 }}
//                   className={`${stat.bg} ${stat.border} border p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300`}
//                 >
//                   <div className="flex items-center gap-3 mb-2">
//                     <div className={`p-2 rounded-lg bg-white shadow-sm ${stat.color}`}>{stat.icon}</div>
//                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</span>
//                   </div>
//                   <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
//                 </motion.div>
//               ))}
//             </div>

//             {/* CHART */}
//             <motion.div
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.4 }}
//               className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8"
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
//                     <Activity className="w-5 h-5 text-blue-500" />
//                     Performance Trend
//                   </h3>
//                   <p className="text-slate-500 text-sm">Speed vs Accuracy (Last 7 Matches)</p>
//                 </div>

//                 <div className="flex gap-4">
//                   <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
//                     <div className="w-2 h-2 rounded-full bg-blue-500"></div>
//                     <span className="text-xs font-bold text-blue-700">Speed</span>
//                   </div>
//                   <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
//                     <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
//                     <span className="text-xs font-bold text-emerald-700">Accuracy</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="h-64 w-full">
//                 {graphData.length > 0 ? (
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={graphData}>
//                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
//                       <XAxis
//                         dataKey="name"
//                         axisLine={false}
//                         tickLine={false}
//                         tick={{ fill: '#94a3b8', fontSize: 10 }}
//                         dy={10}
//                       />
//                       <YAxis
//                         yAxisId="left"
//                         orientation="left"
//                         axisLine={false}
//                         tickLine={false}
//                         tick={{ fill: '#3b82f6', fontSize: 10, fontWeight: 700 }}
//                         width={30}
//                       />
//                       <YAxis
//                         yAxisId="right"
//                         orientation="right"
//                         axisLine={false}
//                         tickLine={false}
//                         tick={{ fill: '#10b981', fontSize: 10, fontWeight: 700 }}
//                         width={30}
//                       />
//                       <Tooltip
//                         contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
//                         itemStyle={{ color: '#fff' }}
//                       />
//                       <defs>
//                         {/* Gradients for Lines to make them glow */}
//                         <linearGradient id="speedGradient" x1="0" y1="0" x2="1" y2="0">
//                           <stop offset="0%" stopColor="#3b82f6" />
//                           <stop offset="100%" stopColor="#6366f1" />
//                         </linearGradient>
//                         <linearGradient id="accuracyGradient" x1="0" y1="0" x2="1" y2="0">
//                           <stop offset="0%" stopColor="#10b981" />
//                           <stop offset="100%" stopColor="#34d399" />
//                         </linearGradient>
//                       </defs>

//                       {/* 1. SPEED LINE (Blue) - Changed from Area to Line for visibility */}
//                       <Line
//                         yAxisId="left"
//                         type="monotone"
//                         dataKey="speed"
//                         stroke="url(#speedGradient)"
//                         strokeWidth={4}
//                         dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
//                         activeDot={{ r: 6 }}
//                       />

//                       {/* 2. ACCURACY LINE (Green) */}
//                       <Line
//                         yAxisId="right"
//                         type="monotone"
//                         dataKey="accuracy"
//                         stroke="url(#accuracyGradient)"
//                         strokeWidth={4}
//                         dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
//                         activeDot={{ r: 6 }}
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 ) : (
//                   <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
//                     <BarChart3 className="w-10 h-10 text-slate-300 mb-2" />
//                     <p className="text-slate-400 font-medium">No match data available</p>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="space-y-6">

//             {/* MODE SELECTION */}
//             <div className="sticky top-24">
//               <AnimatePresence mode="wait">
//                 {status === 'IDLE' ? (
//                   <motion.div
//                     key="idle"
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     className="space-y-4"
//                   >
//                     <div className="flex items-center justify-between px-2">
//                       <h3 className="font-bold text-slate-800">Select Mode</h3>
//                       <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-md animate-pulse">Online</span>
//                     </div>

//                     <button
//                       onClick={() => findMatch('classic')}
//                       className="group w-full relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-1 shadow-xl shadow-blue-500/20 hover:shadow-blue-600/30 transition-all duration-300 hover:-translate-y-1"
//                     >
//                       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
//                       <div className="relative bg-white/10 backdrop-blur-sm rounded-[20px] p-6 text-left border border-white/10 group-hover:bg-white/15 transition-colors">
//                         <div className="flex justify-between items-start mb-4">
//                           <div className="p-3 bg-white/20 rounded-2xl text-white">
//                             <Zap className="w-8 h-8" fill="currentColor" />
//                           </div>
//                           <ArrowIcon />
//                         </div>
//                         <h3 className="text-2xl font-black italic text-white mb-1">CLASSIC</h3>
//                         <p className="text-blue-100 text-sm font-medium">Speed Arithmetic • Ranked</p>
//                       </div>
//                     </button>

//                     <button
//                       onClick={() => findMatch('algebra')}
//                       className="group w-full relative overflow-hidden bg-gradient-to-br from-violet-600 to-fuchsia-700 rounded-3xl p-1 shadow-xl shadow-violet-500/20 hover:shadow-violet-600/30 transition-all duration-300 hover:-translate-y-1"
//                     >
//                       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
//                       <div className="relative bg-white/10 backdrop-blur-sm rounded-[20px] p-6 text-left border border-white/10 group-hover:bg-white/15 transition-colors">
//                         <div className="flex justify-between items-start mb-4">
//                           <div className="p-3 bg-white/20 rounded-2xl text-white">
//                             <Brain className="w-8 h-8" />
//                           </div>
//                           <ArrowIcon />
//                         </div>
//                         <h3 className="text-2xl font-black italic text-white mb-1">IQ CHALLENGE</h3>
//                         <p className="text-violet-100 text-sm font-medium">Logic & Algebra • Ranked</p>
//                       </div>
//                     </button>

//                   </motion.div>
//                 ) : status === 'SEARCHING' ? (
//                   <motion.div
//                     key="searching"
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     className="bg-white rounded-3xl shadow-2xl border border-blue-100 p-8 text-center relative overflow-hidden"
//                   >
//                     <div className="absolute inset-0 bg-blue-50/50"></div>
//                     <div className="relative z-10">
//                       <div className="relative w-24 h-24 mx-auto mb-6">
//                         <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
//                         <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
//                         <div className="absolute inset-0 flex items-center justify-center">
//                           <Search className="w-8 h-8 text-blue-500" />
//                         </div>
//                       </div>
//                       <h3 className="text-xl font-black text-slate-800">SEARCHING</h3>
//                       <p className="text-sm text-blue-600 font-bold mb-6 tracking-wide uppercase">
//                         {searchMode === 'algebra' ? 'IQ Protocol' : 'Classic Protocol'}
//                       </p>
//                       <button
//                         onClick={cancelSearch}
//                         className="px-6 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </motion.div>
//                 ) : (
//                   <motion.div
//                     key="found"
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl shadow-2xl shadow-emerald-500/30 p-8 text-center text-white"
//                   >
//                     <motion.div
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       transition={{ type: "spring", stiffness: 200 }}
//                       className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
//                     >
//                       <CheckCircle className="w-10 h-10 text-emerald-600" />
//                     </motion.div>
//                     <h3 className="text-2xl font-black italic">MATCH FOUND!</h3>
//                     <p className="text-emerald-100 font-medium">Preparing battlefield...</p>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               {/* RECENT MATCHES TABLE */}
//               <div className="mt-8 bg-white rounded-3xl border border-slate-200 shadow-lg p-6">
//                 <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Recent History</h4>
//                 <div className="space-y-4">
//                   {reversedHistory.length > 0 ? (
//                     reversedHistory.map((match, i) => (
//                       <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
//                         <div className="flex items-center gap-3">
//                           <div className={`w-2 h-10 rounded-full ${match.result === 'WIN' || match.won ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
//                           <div>
//                             <p className={`font-black text-sm ${match.result === 'WIN' || match.won ? 'text-emerald-600' : 'text-rose-600'}`}>
//                               {match.result === 'WIN' || match.won ? 'VICTORY' : 'DEFEAT'}
//                             </p>
//                             <p className="text-xs text-slate-400">Classic Mode</p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-sm font-bold text-slate-700">{match.wpm || match.score || 0} wpm</p>
//                           <p className="text-xs text-slate-400">{match.accuracy || 0}% acc</p>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-6 text-slate-400 text-sm">No matches played yet.</div>
//                   )}
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ArrowIcon = () => (
//   <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m9 18 6-6-6-6" /></svg>
//   </div>
// );

// export default Dashboard;



import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { socket } from '../socket';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Brain, TrendingUp, BarChart3, Target, Shield, Crown, Star, 
  ChevronDown, LogOut, Gamepad2, Award, AlertCircle, Search, 
  CheckCircle, Activity, Flame, BookOpen, Cpu, Satellite, Rocket, 
  Moon, Sun // <--- Added Icons
} from 'lucide-react';

// --- LEAGUE CONFIGURATION (Unchanged) ---
const LEAGUES = [
  { name: 'Rookie',      min: 0,    max: 1899,  color: 'text-amber-600 dark:text-amber-400',    bg: 'bg-amber-100 dark:bg-amber-900/20',    border: 'border-amber-200 dark:border-amber-800',    gradient: 'from-amber-400 to-orange-500', icon: <BookOpen className="w-8 h-8" /> },
  { name: 'Apprentice',  min: 1900, max: 2799,  color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-100 dark:bg-blue-900/20',     border: 'border-blue-200 dark:border-blue-800',     gradient: 'from-blue-400 to-cyan-500',    icon: <Target className="w-8 h-8" /> },
  { name: 'Challenger',  min: 2800, max: 3699,  color: 'text-emerald-600 dark:text-emerald-400',  bg: 'bg-emerald-100 dark:bg-emerald-900/20',  border: 'border-emerald-200 dark:border-emerald-800',  gradient: 'from-emerald-400 to-green-500', icon: <Zap className="w-8 h-8" /> },
  { name: 'Striker',     min: 3700, max: 4599,  color: 'text-violet-600 dark:text-violet-400',   bg: 'bg-violet-100 dark:bg-violet-900/20',   border: 'border-violet-200 dark:border-violet-800',   gradient: 'from-violet-400 to-purple-500', icon: <Flame className="w-8 h-8" /> },
  { name: 'Warrior',     min: 4600, max: 5499,  color: 'text-orange-600 dark:text-orange-400',   bg: 'bg-orange-100 dark:bg-orange-900/20',   border: 'border-orange-200 dark:border-orange-800',   gradient: 'from-orange-400 to-red-500',    icon: <Shield className="w-8 h-8" /> },
  { name: 'Elite',       min: 5500, max: 6399,  color: 'text-rose-600 dark:text-rose-400',     bg: 'bg-rose-100 dark:bg-rose-900/20',     border: 'border-rose-200 dark:border-rose-800',     gradient: 'from-rose-400 to-pink-500',     icon: <Crown className="w-8 h-8" /> },
  { name: 'Master',      min: 6400, max: 7299,  color: 'text-purple-600 dark:text-purple-400',   bg: 'bg-purple-100 dark:bg-purple-900/20',   border: 'border-purple-200 dark:border-purple-800',   gradient: 'from-purple-500 to-indigo-600', icon: <Cpu className="w-8 h-8" /> },
  { name: 'Grandmaster', min: 7300, max: 8199,  color: 'text-cyan-600 dark:text-cyan-400',     bg: 'bg-cyan-100 dark:bg-cyan-900/20',     border: 'border-cyan-200 dark:border-cyan-800',     gradient: 'from-cyan-400 to-blue-600',     icon: <Satellite className="w-8 h-8" /> },
  { name: 'Champion',    min: 8200, max: 9099,  color: 'text-yellow-600 dark:text-yellow-400',   bg: 'bg-yellow-100 dark:bg-yellow-900/20',   border: 'border-yellow-200 dark:border-yellow-800',   gradient: 'from-yellow-400 to-amber-600',  icon: <Star className="w-8 h-8" /> },
  { name: 'Legend',      min: 9100, max: 99999, color: 'text-fuchsia-600 dark:text-fuchsia-400',  bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/20',  border: 'border-fuchsia-200 dark:border-fuchsia-800',  gradient: 'from-fuchsia-500 via-pink-500 to-rose-500', icon: <Rocket className="w-8 h-8" /> }
];

const getLeague = (mmr) => LEAGUES.find(l => mmr >= l.min && mmr <= l.max) || LEAGUES[0];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('IDLE');
  const [searchMode, setSearchMode] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // --- DARK MODE STATE ---
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    // Apply theme to HTML tag
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  // -----------------------

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/'); return; }
      try {
        const res = await axios.get('http://localhost:3000/api/auth/aboutUser', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        if (!socket.connected) { socket.auth = { token }; socket.connect(); }
      } catch (err) { 
        console.error("Auth Error:", err);
        localStorage.clear(); 
        navigate('/'); 
      }
    };
    fetchUserData();

    socket.on('match_found', (data) => {
      setStatus('FOUND');
      setTimeout(() => navigate(`/game/${data.roomId}`, { state: data }), 1500);
    });

    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-dropdown') && !e.target.closest('.profile-button')) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      socket.off('match_found');
      document.removeEventListener('click', handleClickOutside);
    };
  }, [navigate]);

  const findMatch = (mode) => {
    setStatus('SEARCHING');
    setSearchMode(mode);
    socket.emit('find_match', { mode }); 
  };

  const cancelSearch = () => { 
    setStatus('IDLE'); 
    setSearchMode(null); 
    socket.emit('cancel_search'); 
  };

  const handleLogout = () => {
    localStorage.clear();
    socket.disconnect();
    navigate('/');
  };

  if (!user) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="z-10 flex flex-col items-center gap-4"
      >
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-400 font-mono tracking-widest animate-pulse">INITIALIZING...</p>
      </motion.div>
    </div>
  );

  const currentLeague = getLeague(user.mmr);
  const totalRange = currentLeague.max - currentLeague.min;
  const myProgress = user.mmr - currentLeague.min;
  let progressPercent = (myProgress / totalRange) * 100;
  if(progressPercent > 100) progressPercent = 100; 
  if(progressPercent < 0) progressPercent = 0;

  const losses = user.gamesPlayed - user.wins;
  const winRate = user.gamesPlayed > 0 ? Math.round((user.wins / user.gamesPlayed) * 100) : 0;
  const history = user.matchHistory || [];
  const recentGames = history.slice(-7); 
  
  const graphData = recentGames.map((game, i) => ({
      name: `Match ${history.length - recentGames.length + i + 1}`,
      speed: game.wpm || game.score || 0, 
      accuracy: game.accuracy || 0,
      date: new Date(game.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const reversedHistory = [...history].reverse().slice(0, 3);
  const getUserInitials = () => user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    // MAIN CONTAINER: Handles Dark Background
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-y-auto selection:bg-blue-100 dark:selection:bg-blue-900 transition-colors duration-300">
      
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            
            {/* LOGO */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
                <Zap className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <div>
                <h1 className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  PULSE<span className="text-slate-800 dark:text-white not-italic">IQ</span>
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* THEME TOGGLE */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <div className="hidden md:block text-right">
                <div className="flex items-center justify-end space-x-2">
                    <span className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${currentLeague.gradient} animate-pulse`}></span>
                    <p className={`text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${currentLeague.gradient}`}>
                        {currentLeague.name.toUpperCase()}
                    </p>
                </div>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">{user.mmr} MMR</p>
              </div>

              {/* PROFILE DROPDOWN */}
              <div className="relative">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className={`profile-button flex items-center gap-3 p-1.5 pr-3 rounded-full border transition-all duration-200 ${showProfileDropdown ? 'bg-slate-100 dark:bg-slate-800 border-blue-200 dark:border-blue-700 ring-2 ring-blue-100 dark:ring-blue-900' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'}`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${currentLeague.gradient} shadow-md`}>
                    {getUserInitials()}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="profile-dropdown absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden z-50"
                    >
                      {/* Dropdown Header */}
                      <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                           <div className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-2xl bg-gradient-to-br ${currentLeague.gradient} shadow-lg ring-4 ring-white dark:ring-slate-700`}>
                                {getUserInitials()}
                           </div>
                           <div className="flex-1 min-w-0 pt-0.5">
                                <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-tight truncate">
                                    {user.name || user.username}
                                </h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-1">
                                    {user.email}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border ${currentLeague.border} ${currentLeague.color}`}>
                                        {currentLeague.name}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400 bg-slate-200/50 dark:bg-slate-700 px-1.5 py-0.5 rounded truncate max-w-[100px]">
                                        #{user._id.slice(-4).toUpperCase()}
                                    </span>
                                </div>
                           </div>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-700 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                         <div className="p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <p className="text-xl font-black text-slate-800 dark:text-white">{user.gamesPlayed}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Games</p>
                         </div>
                         <div className="p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <p className="text-xl font-black text-emerald-500">{user.wins}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Wins</p>
                         </div>
                         <div className="p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <p className="text-xl font-black text-blue-500">{winRate}%</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Win Rate</p>
                         </div>
                      </div>

                      <div className="p-2 bg-slate-50 dark:bg-slate-900/50">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-100/50 dark:hover:bg-rose-900/30 hover:text-rose-700 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* LEAGUE BANNER */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`bg-white dark:bg-slate-900 rounded-3xl border ${currentLeague.border} dark:border-slate-800 p-8 shadow-sm transition-all hover:shadow-md`}
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                
                <div className={`w-24 h-24 flex-shrink-0 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border-2 ${currentLeague.border} dark:border-slate-700`}>
                   <div className={`${currentLeague.color} transform scale-125`}>
                     {currentLeague.icon}
                   </div>
                </div>

                <div className="flex-1 w-full">
                   <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left mb-6">
                      <div>
                         <h2 className={`text-4xl font-bold tracking-tight ${currentLeague.color} mb-1`}>
                            {currentLeague.name}
                         </h2>
                         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Current Standing</p>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex flex-col items-center md:items-end">
                         <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">{user.mmr}</span>
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">MMR Rating</span>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                         <span>{currentLeague.min}</span>
                         <span className={currentLeague.color}>{Math.round(progressPercent)}% to Promotion</span>
                         <span>{currentLeague.max}</span>
                      </div>
                      
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                         <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1, ease: "circOut" }}
                            className={`h-full rounded-full bg-gradient-to-r ${currentLeague.gradient}`}
                         />
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* SMALL STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { label: 'Total Games', value: user.gamesPlayed, icon: <Gamepad2 className="w-5 h-5" />, color: 'text-slate-700 dark:text-slate-300', bg: 'bg-white dark:bg-slate-900', border: 'border-slate-200 dark:border-slate-800' },
                 { label: 'Victories', value: user.wins, icon: <Award className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800' },
                 { label: 'Win Ratio', value: `${winRate}%`, icon: <TrendingUp className="w-5 h-5" />, color: winRate >= 50 ? 'text-blue-600' : 'text-amber-600', bg: winRate >= 50 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-amber-50 dark:bg-amber-900/20', border: winRate >= 50 ? 'border-blue-200 dark:border-blue-800' : 'border-amber-200 dark:border-amber-800' },
                 { label: 'Defeats', value: losses, icon: <AlertCircle className="w-5 h-5" />, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800' }
               ].map((stat, idx) => (
                 <motion.div
                    key={idx}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * idx + 0.2 }}
                    className={`${stat.bg} ${stat.border} border p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300`}
                 >
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm ${stat.color}`}>{stat.icon}</div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{stat.label}</span>
                    </div>
                    <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                 </motion.div>
               ))}
            </div>

            {/* CHART */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 sm:p-8"
            >
                {/* Chart Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                           <Activity className="w-5 h-5 text-blue-500" />
                           Performance Trend
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Speed vs Accuracy (Last 10 Matches)</p>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Speed</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Accuracy</span>
                        </div>
                    </div>
                </div>

                <div className="h-64 w-full">
                    {graphData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={graphData}>
                                <defs>
                                    <linearGradient id="speedGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#6366f1" />
                                    </linearGradient>
                                    <linearGradient id="accuracyGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#34d399" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                                <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{fill: '#3b82f6', fontSize: 10, fontWeight: 700}} width={30} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#10b981', fontSize: 10, fontWeight: 700}} width={30} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff'}}
                                    itemStyle={{color: '#fff'}}
                                />
                                <Line yAxisId="left" type="monotone" dataKey="speed" stroke="url(#speedGradient)" strokeWidth={4} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                                <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="url(#accuracyGradient)" strokeWidth={4} dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                            <BarChart3 className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
                            <p className="text-slate-400 dark:text-slate-500 font-medium">No match data available</p>
                        </div>
                    )}
                </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
             
             {/* MODE SELECTION */}
             <div className="sticky top-24">
                <AnimatePresence mode="wait">
                    {status === 'IDLE' ? (
                        <motion.div 
                            key="idle"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between px-2">
                                <h3 className="font-bold text-slate-800 dark:text-white">Select Mode</h3>
                                <span className="text-xs font-bold px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md animate-pulse">Online</span>
                            </div>

                            <button
                                onClick={() => findMatch('classic')}
                                className="group w-full relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-1 shadow-xl shadow-blue-500/20 hover:shadow-blue-600/30 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                <div className="relative bg-white/10 backdrop-blur-sm rounded-[20px] p-6 text-left border border-white/10 group-hover:bg-white/15 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-white/20 rounded-2xl text-white">
                                            <Zap className="w-8 h-8" fill="currentColor" />
                                        </div>
                                        <ArrowIcon />
                                    </div>
                                    <h3 className="text-2xl font-black italic text-white mb-1">CLASSIC</h3>
                                    <p className="text-blue-100 text-sm font-medium">Speed Arithmetic • Ranked</p>
                                </div>
                            </button>

                            <button
                                onClick={() => findMatch('algebra')}
                                className="group w-full relative overflow-hidden bg-gradient-to-br from-violet-600 to-fuchsia-700 rounded-3xl p-1 shadow-xl shadow-violet-500/20 hover:shadow-violet-600/30 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                <div className="relative bg-white/10 backdrop-blur-sm rounded-[20px] p-6 text-left border border-white/10 group-hover:bg-white/15 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-white/20 rounded-2xl text-white">
                                            <Brain className="w-8 h-8" />
                                        </div>
                                        <ArrowIcon />
                                    </div>
                                    <h3 className="text-2xl font-black italic text-white mb-1">IQ CHALLENGE</h3>
                                    <p className="text-violet-100 text-sm font-medium">Logic & Algebra • Ranked</p>
                                </div>
                            </button>

                        </motion.div>
                    ) : status === 'SEARCHING' ? (
                        <motion.div
                            key="searching"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-blue-100 dark:border-slate-800 p-8 text-center relative overflow-hidden"
                        >
                             <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10"></div>
                             <div className="relative z-10">
                                <div className="relative w-24 h-24 mx-auto mb-6">
                                    <div className="absolute inset-0 border-4 border-blue-100 dark:border-slate-700 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Search className="w-8 h-8 text-blue-500" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white">SEARCHING</h3>
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-bold mb-6 tracking-wide uppercase">
                                    {searchMode === 'algebra' ? 'IQ Protocol' : 'Classic Protocol'}
                                </p>
                                <button 
                                    onClick={cancelSearch}
                                    className="px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-slate-600 dark:text-slate-300 hover:text-rose-600 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
                                >
                                    Cancel
                                </button>
                             </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="found"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl shadow-2xl shadow-emerald-500/30 p-8 text-center text-white"
                        >
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                                <CheckCircle className="w-10 h-10 text-emerald-600" />
                            </motion.div>
                            <h3 className="text-2xl font-black italic">MATCH FOUND!</h3>
                            <p className="text-emerald-100 font-medium">Preparing battlefield...</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* RECENT HISTORY TABLE */}
                <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg p-6">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Recent History</h4>
                    <div className="space-y-4">
                        {reversedHistory.length > 0 ? (
                            reversedHistory.map((match, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-10 rounded-full ${match.result === 'WIN' || match.won ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                        <div>
                                            <p className={`font-black text-sm ${match.result === 'WIN' || match.won ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {match.result === 'WIN' || match.won ? 'VICTORY' : 'DEFEAT'}
                                            </p>
                                            <p className="text-xs text-slate-400">Classic Mode</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{match.wpm || match.score || 0} wpm</p>
                                        <p className="text-xs text-slate-400">{match.accuracy || 0}% acc</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-slate-400 text-sm">No matches played yet.</div>
                        )}
                    </div>
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowIcon = () => (
    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m9 18 6-6-6-6"/></svg>
    </div>
);

export default Dashboard;