// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true); // Toggle between Login/Register
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     otp: ''
//   });
//   const [step, setStep] = useState(1); // For Registration: Step 1 = Details, Step 2 = OTP

//   // Handle Input Change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // --- ACTIONS ---

//   // 1. LOGIN (Direct Entry)
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:3000/api/auth/login', {
//         email: formData.email,
//         password: formData.password
//       });
      
//       // Save Token & User Info
//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('user', JSON.stringify(res.data));
      
//       // Go to Dashboard
//       navigate('/dashboard');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Login Failed');
//     }
//   };

//   // 2. REGISTER - STEP 1 (Send OTP)
//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:3000/api/auth/sendOTP', { email: formData.email });
//       setStep(2); // Show OTP Input
//       alert('OTP Sent to ' + formData.email);
//     } catch (err) {
//       alert(err.response?.data?.message || 'Error sending OTP');
//     }
//   };

//   // 3. REGISTER - STEP 2 (Verify & Create)
//   const handleRegisterComplete = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:3000/api/auth/register', formData);
      
//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('user', JSON.stringify(res.data));
//       navigate('/dashboard');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Invalid OTP');
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
      
//       <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 w-96">
//         <h1 className="text-3xl font-bold text-center mb-6 text-neon-blue">
//           Pulse<span className="text-white">IQ</span>
//         </h1>

//         {/* TOGGLE TABS */}
//         <div className="flex mb-6 bg-slate-700 rounded-lg p-1">
//           <button 
//             className={`flex-1 py-1 rounded-md text-sm ${isLogin ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
//             onClick={() => setIsLogin(true)}
//           >
//             Login
//           </button>
//           <button 
//             className={`flex-1 py-1 rounded-md text-sm ${!isLogin ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
//             onClick={() => setIsLogin(false)}
//           >
//             Register
//           </button>
//         </div>

//         {/* --- LOGIN FORM --- */}
//         {isLogin && (
//           <form onSubmit={handleLogin} className="flex flex-col gap-4">
//             <input 
//               name="email" placeholder="Email" onChange={handleChange} 
//               className="bg-slate-700 p-3 rounded text-white outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input 
//               type="password" name="password" placeholder="Password" onChange={handleChange} 
//               className="bg-slate-700 p-3 rounded text-white outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button type="submit" className="bg-blue-600 hover:bg-blue-500 p-3 rounded font-bold transition">
//               ENTER GAME
//             </button>
//           </form>
//         )}

//         {/* --- REGISTER FORM --- */}
//         {!isLogin && step === 1 && (
//           <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
//             <input 
//               name="name" placeholder="Username" onChange={handleChange} 
//               className="bg-slate-700 p-3 rounded text-white outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input 
//               name="email" placeholder="Email" onChange={handleChange} 
//               className="bg-slate-700 p-3 rounded text-white outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input 
//               type="password" name="password" placeholder="Password" onChange={handleChange} 
//               className="bg-slate-700 p-3 rounded text-white outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button type="submit" className="bg-green-600 hover:bg-green-500 p-3 rounded font-bold transition">
//               SEND OTP
//             </button>
//           </form>
//         )}

//         {/* --- OTP VERIFY FORM --- */}
//         {!isLogin && step === 2 && (
//           <form onSubmit={handleRegisterComplete} className="flex flex-col gap-4">
//              <p className="text-sm text-center text-slate-400">Enter code sent to {formData.email}</p>
//             <input 
//               name="otp" placeholder="Enter 6-digit OTP" onChange={handleChange} 
//               className="bg-slate-700 p-3 rounded text-white outline-none text-center tracking-widest text-xl focus:ring-2 focus:ring-green-500"
//             />
//             <button type="submit" className="bg-green-600 hover:bg-green-500 p-3 rounded font-bold transition">
//               VERIFY & PLAY
//             </button>
//           </form>
//         )}

//       </div>
//     </div>
//   );
// };

// export default Login;



import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Mail, Lock, User, ArrowRight, ShieldCheck, 
  Gamepad2, Sparkles, Eye, EyeOff, CheckCircle, 
  Target, Trophy, Brain, Clock, Shield, RotateCcw
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    otp: '' 
  });
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const containerRef = useRef(null);

  // Clear error when switching modes
  useEffect(() => setError(null), [isLogin, step]);

  // Prevent scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  // --- ACTIONS ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      setShowConfetti(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Login Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:3000/api/auth/sendOTP', { 
        email: formData.email 
      });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterComplete = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      setShowConfetti(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="h-screen w-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white overflow-hidden relative"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [100, 0, 100],
            y: [50, 0, 50],
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"
        />
      </div>

      {/* LEFT SIDE - VISUALS */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-2xl"
        >
          {/* Main Logo */}
          <motion.div
            initial={{ rotate: -5, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              delay: 0.2
            }}
            className="w-32 h-32 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-blue-500/30 transform -rotate-6"
          >
            <div className="relative">
              <Zap className="w-16 h-16 text-white" fill="currentColor" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-spin-slow" />
            </div>
          </motion.div>
          
          {/* Title */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-6 text-center"
          >
            PULSE<span className="text-white not-italic">IQ</span>
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-300 text-lg text-center max-w-md mx-auto leading-relaxed mb-12"
          >
            Test your speed, accuracy, and logic in the ultimate competitive arithmetic arena.
          </motion.p>
          
          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { icon: <Gamepad2 className="w-5 h-5" />, text: "Ranked Matches", color: "blue" },
              { icon: <Brain className="w-5 h-5" />, text: "Real-time Analytics", color: "indigo" },
              { icon: <Clock className="w-5 h-5" />, text: "Speed Challenges", color: "purple" },
              { icon: <Trophy className="w-5 h-5" />, text: "Leaderboards", color: "amber" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-slate-600 transition-all"
              >
                <div className={`p-2 rounded-lg bg-${feature.color}-500/10 border border-${feature.color}-500/20`}>
                  <div className={`text-${feature.color}-400`}>
                    {feature.icon}
                  </div>
                </div>
                <span className="font-bold text-slate-300">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 relative">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 mb-4">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">
                Welcome to Arena
              </span>
            </div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-3">
              {isLogin ? 'Welcome Back!' : step === 1 ? 'Create Account' : 'Verify Email'}
            </h2>
            <p className="text-slate-400">
              {isLogin 
                ? 'Continue your legacy in the arithmetic arena.' 
                : step === 1 ? 'Join the elite players and climb the ranks.' : 'Enter verification code sent to your email'}
            </p>
          </motion.div>

          {/* ERROR MESSAGE */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6 p-4 rounded-xl bg-gradient-to-r from-rose-900/30 to-pink-900/30 border border-rose-800/50 backdrop-blur-sm flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-rose-900/50">
                  <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-rose-300">{error}</p>
                  <p className="text-sm text-rose-400/70 mt-1">
                    Please check your credentials and try again
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FORM CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-blue-500/5 overflow-hidden"
          >
            {/* Glowing Border */}
            <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
            
            <div className="p-6">
              {/* TOGGLE SWITCH - Only show on step 1 */}
              {step === 1 && (
                <div className="flex p-1 bg-slate-700/50 rounded-xl mb-6 backdrop-blur-sm">
                  <motion.button
                    layout
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all relative ${isLogin ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
                  >
                    {isLogin && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-slate-700 rounded-lg shadow-sm"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLogin && <CheckCircle className="w-4 h-4" />}
                      Login
                    </span>
                  </motion.button>
                  
                  <motion.button
                    layout
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all relative ${!isLogin ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
                  >
                    {!isLogin && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-slate-700 rounded-lg shadow-sm"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {!isLogin && <Shield className="w-4 h-4" />}
                      Register
                    </span>
                  </motion.button>
                </div>
              )}

              {/* FORMS */}
              <AnimatePresence mode="wait">
                {isLogin ? (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    <FloatingInput
                      icon={<Mail className="w-5 h-5" />}
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    
                    <FloatingInput
                      icon={<Lock className="w-5 h-5" />}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      endAdornment={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-300"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      }
                    />
                    
                    <div className="pt-2">
                      <GradientButton
                        loading={isLoading}
                        text="ENTER ARENA"
                        icon={<ArrowRight className="w-5 h-5" />}
                      />
                    </div>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={step === 1 ? handleSendOtp : handleRegisterComplete}
                    className={step === 1 ? "space-y-4" : "space-y-6"}
                  >
                    {step === 1 ? (
                      <>
                        <FloatingInput
                          icon={<User className="w-5 h-5" />}
                          name="name"
                          placeholder="Choose a Username"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        
                        <FloatingInput
                          icon={<Mail className="w-5 h-5" />}
                          name="email"
                          type="email"
                          placeholder="Your Email Address"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        
                        <FloatingInput
                          icon={<Lock className="w-5 h-5" />}
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a Secure Password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          endAdornment={
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-slate-400 hover:text-slate-300"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          }
                        />
                        
                        <div className="pt-2">
                          <GradientButton
                            loading={isLoading}
                            text="SEND VERIFICATION CODE"
                            icon={<ShieldCheck className="w-5 h-5" />}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {/* OTP SECTION */}
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-center"
                        >
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                            <Mail className="w-10 h-10 text-blue-400" />
                          </div>
                          <p className="text-sm font-bold text-slate-300 mb-1">
                            Verification Code Sent
                          </p>
                          <p className="text-xs text-slate-400 mb-2">
                            Enter the 6-digit code sent to
                          </p>
                          <p className="text-sm font-bold text-blue-400 truncate max-w-full px-4">
                            {formData.email}
                          </p>
                        </motion.div>
                        
                        {/* OTP Input */}
                        <div className="space-y-6">
                          <OTPInput
                            value={formData.otp}
                            onChange={(value) => setFormData({ ...formData, otp: value })}
                          />
                          
                          <div className="pt-2">
                            <GradientButton
                              loading={isLoading}
                              text="VERIFY & START PLAYING"
                              icon={<Gamepad2 className="w-5 h-5" />}
                            />
                          </div>
                          
                          <div className="flex justify-between items-center pt-2">
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-300 transition-colors"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Change Email
                            </button>
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Resend Code
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <p className="text-xs text-slate-500">
              By continuing, you agree to our{' '}
              <button className="text-blue-400 hover:text-blue-300 font-bold">
                Terms
              </button>{' '}
              and{' '}
              <button className="text-blue-400 hover:text-blue-300 font-bold">
                Privacy Policy
              </button>
            </p>
            <p className="text-xs text-slate-600 mt-2">
              © 2026 PulseIQ. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: -50,
                  x: Math.random() * window.innerWidth,
                  rotate: 0,
                  scale: 0
                }}
                animate={{ 
                  y: window.innerHeight + 100,
                  rotate: 360,
                  scale: 1
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.02,
                  ease: "easeOut"
                }}
                className={`absolute w-2 h-2 rounded-full ${
                  ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500'][i % 3]
                }`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- COMPONENTS ---

const FloatingInput = ({ icon, name, type = "text", placeholder, value, onChange, required, endAdornment }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="relative"
    >
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
        isFocused || value ? 'text-blue-400' : 'text-slate-500'
      }`}>
        {icon}
      </div>
      
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        className="w-full bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-xl py-3.5 pl-12 pr-11 text-white font-medium outline-none transition-all duration-300 placeholder:text-slate-500 hover:border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
      />
      
      {endAdornment && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {endAdornment}
        </div>
      )}
    </motion.div>
  );
};

const OTPInput = ({ value, onChange }) => {
  const digits = value.split('');
  const inputRefs = useRef([]);
  
  const handleChange = (index, digit) => {
    const newDigits = [...digits];
    newDigits[index] = digit.replace(/\D/g, '');
    const newValue = newDigits.join('');
    onChange(newValue);
    
    // Auto-focus next
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <input
            ref={el => inputRefs.current[index] = el}
            type="text"
            maxLength={1}
            value={digits[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={(e) => e.target.select()}
            className="w-14 h-14 bg-slate-700/50 backdrop-blur-sm border-2 border-slate-600/50 rounded-xl text-center text-2xl font-black text-white outline-none transition-all duration-300 hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          />
          {digits[index] && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

const GradientButton = ({ loading, text, icon }) => {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/35 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
    >
      <motion.div
        animate={{ x: ['100%', '-100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
      
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
          />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <span className="relative z-10">{text}</span>
          <motion.div
            initial={{ x: -5 }}
            animate={{ x: 5 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.5 }}
            className="relative z-10"
          >
            {icon}
          </motion.div>
        </>
      )}
    </motion.button>
  );
};

export default Login;