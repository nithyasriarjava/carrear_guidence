import { useState, useEffect } from 'react';
import { 
  Compass, 
  Check, 
  Search, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  TrendingUp, 
  Coins, 
  Lock, 
  User, 
  Mail, 
  LogOut, 
  ExternalLink, 
  Youtube, 
  Sparkles, 
  Cpu, 
  Layers, 
  ChevronRight, 
  Award,
  Book,
  Code,
  Briefcase,
  Layers2,
  ThumbsUp,
  X,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { 
  EDUCATION_OPTIONS, 
  DEPARTMENT_OPTIONS, 
  STATUS_OPTIONS, 
  POPULAR_SKILLS, 
  POPULAR_INTERESTS, 
  DEPT_TYPICAL_SKILLS, 
  calculateCareerMatches, 
  getFallbackRecommendation,
} from './data';
import { supabase } from './supabaseClient';

// Helper for localStorage with safe fallback
const getLocalStorage = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
};

export default function App() {
  // Authentication Sub-states: 'login' | 'signup'
  const [authMode, setAuthMode] = useState('signup');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Logged-in current user state
  const [currentUser, setCurrentUser] = useState(() => {
    return getLocalStorage('session_user', null);
  });

  // Current onboarding/discovery flow state
  // Steps: 'auth' | 'welcome' | 'education' | 'department' | 'status' | 'skills-decision' | 'skills-select' | 'skills-suggested' | 'interests' | 'recommendations'
  const [currentStep, setCurrentStep] = useState(() => {
    const session = getLocalStorage('session_user', null);
    if (!session) return 'auth';
    return getLocalStorage('onboarding_step', 'welcome');
  });

  // Profile fields state
  const [selectedEducation, setSelectedEducation] = useState('');
  const [customEducation, setCustomEducation] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [customDepartment, setCustomDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [knowSkills, setKnowSkills] = useState(null);

  // Skills selection
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Interests selection
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [interestSearchQuery, setInterestSearchQuery] = useState('');
  const [customInterestInput, setCustomInterestInput] = useState('');

  // Active / selected details of the career recommendation
  const [viewingCareerId, setViewingCareerId] = useState(null);

  // Persistence of profile state
  useEffect(() => {
    if (currentUser) {
      const savedProfile = getLocalStorage(`profile_${currentUser.email}`, null);
      if (savedProfile) {
        setSelectedEducation(savedProfile.education || '');
        setCustomEducation(savedProfile.customEducation || '');
        setSelectedDepartment(savedProfile.department || '');
        setCustomDepartment(savedProfile.customDepartment || '');
        setSelectedStatus(savedProfile.status || '');
        setKnowSkills(savedProfile.knowSkills !== undefined ? savedProfile.knowSkills : null);
        setSelectedSkills(savedProfile.skills || []);
        setSelectedInterests(savedProfile.interests || []);
      }
    }
  }, [currentUser]);

  // Save profile helper
  const saveCurrentProfile = (updatedFields) => {
    if (!currentUser) return;
    const currentProfile = getLocalStorage(`profile_${currentUser.email}`, {});
    const merged = { ...currentProfile, ...updatedFields };
    setLocalStorage(`profile_${currentUser.email}`, merged);
  };

  // On step transition
  const navigateToStep = (step) => {
    setCurrentStep(step);
    setLocalStorage('onboarding_step', step);
  };

  // Auth state listener (keeps currentUser in sync with Supabase)
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const user = data?.session?.user;
      if (user) {
        const sessionUser = {
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          email: user.email,
        };
        setCurrentUser(sessionUser);
        setLocalStorage('session_user', sessionUser);
        const step = getLocalStorage('onboarding_step', 'welcome');
        setCurrentStep(step === 'auth' ? 'welcome' : step);
      }
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const u = session.user;
        const sessionUser = {
          name: u.user_metadata?.name || u.email?.split('@')[0] || 'User',
          email: u.email,
        };
        setCurrentUser(sessionUser);
        setLocalStorage('session_user', sessionUser);
        if (currentStep === 'auth') navigateToStep('welcome');
      } else {
        setCurrentUser(null);
        localStorage.removeItem('session_user');
        localStorage.removeItem('onboarding_step');
        navigateToStep('auth');
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sign up with Supabase
  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!emailInput || !passwordInput || !nameInput) {
      setAuthError('Please fill out all fields.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: emailInput.toLowerCase(),
        password: passwordInput,
        options: {
          data: {
            name: nameInput,
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      if (data.session) {
        setAuthSuccess('Registration successful!');
        navigateToStep('welcome');
      } else {
        setAuthSuccess('Check your inbox to confirm your account.');
      }
    } catch (err) {
      setAuthError(err?.message || 'Sign up failed.');
    }
  };

  // Login with Supabase
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!emailInput || !passwordInput) {
      setAuthError('Please enter both email and password.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput.toLowerCase(),
        password: passwordInput,
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      setAuthSuccess('Welcome back!');

      const lastStep = getLocalStorage('onboarding_step', 'welcome');
      setTimeout(() => {
        navigateToStep(lastStep === 'auth' ? 'welcome' : lastStep);
      }, 300);

      if (!data.session) {
        setAuthSuccess('Please confirm your email before signing in.');
      }
    } catch (err) {
      setAuthError(err?.message || 'Login failed.');
    }
  };

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    setAuthError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        setAuthError(error.message);
      }
    } catch (err) {
      setAuthError(err?.message || 'Google login failed.');
    }
  };

  // Demowise single-click guest login for testing
  const handleGuestLogin = () => {
    const guestUser = { name: 'Alex Johnson', email: 'guest@careerdiscovery.app' };

    setCurrentUser(guestUser);
    setLocalStorage('session_user', guestUser);
    navigateToStep('welcome');
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) console.warn('Supabase signOut error', error);
    } catch (err) {
      console.warn('Supabase signOut threw', err);
    }

    setCurrentUser(null);
    localStorage.removeItem('session_user');
    localStorage.removeItem('onboarding_step');
    navigateToStep('auth');

    setEmailInput('');
    setPasswordInput('');
    setNameInput('');
    setAuthSuccess('');
    setAuthError('');
    setViewingCareerId(null);
  };

  // Dynamic lists helper filters
  const filteredPopularSkills = POPULAR_SKILLS.filter(
    (skill) => skill.toLowerCase().includes(skillSearchQuery.toLowerCase()) && !selectedSkills.includes(skill),
  );

  const filteredPopularInterests = POPULAR_INTERESTS.filter(
    (interest) => interest.toLowerCase().includes(interestSearchQuery.toLowerCase()) && !selectedInterests.includes(interest),
  );

  // Skill manipulators
  const addSkill = (skill) => {
    if (!skill.trim()) return;
    const s = skill.trim();
    if (!selectedSkills.includes(s)) {
      const updated = [...selectedSkills, s];
      setSelectedSkills(updated);
      saveCurrentProfile({ skills: updated });
    }
  };

  const removeSkill = (skill) => {
    const updated = selectedSkills.filter((s) => s !== skill);
    setSelectedSkills(updated);
    saveCurrentProfile({ skills: updated });
  };

  // Interest manipulators
  const addInterest = (interest) => {
    if (!interest.trim()) return;
    const i = interest.trim();
    if (!selectedInterests.includes(i)) {
      const updated = [...selectedInterests, i];
      setSelectedInterests(updated);
      saveCurrentProfile({ interests: updated });
    }
  };

  const removeInterest = (interest) => {
    const updated = selectedInterests.filter((i) => i !== interest);
    setSelectedInterests(updated);
    saveCurrentProfile({ interests: updated });
  };

  // Final matches generator based on the path user has picked
  const getResults = () => {
    const dept = selectedDepartment === 'Other' ? customDepartment : selectedDepartment;

    if (knowSkills === false) {
      return getFallbackRecommendation(dept || 'Computer Science', selectedStatus || 'Student').map((c) => ({
        ...c,
        matchScore: 85,
        whyItMatches: `Strategic Academic alignment: Based on your curriculum in "${dept || 'Computer Science'}" and your status as a "${selectedStatus || 'Student'}", this field is an extremely popular, high-yielding career launchpad.`,
      }));
    }

    return calculateCareerMatches(selectedSkills, selectedInterests, dept || 'Computer Science');
  };

  const matches = getResults();

  useEffect(() => {
    if (currentStep === 'recommendations' && matches.length > 0 && !viewingCareerId) {
      setViewingCareerId(matches[0].id);
    }
  }, [currentStep, matches, viewingCareerId]);

  const activeCareer = matches.find((m) => m.id === viewingCareerId) || matches[0];

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/40 via-slate-950 to-slate-950 flex flex-col justify-between" id="app_root_container">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <header className="border-b border-blue-950 bg-slate-950/80 backdrop-blur-md relative z-40 sticky top-0" id="main_app_header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center space-x-3" id="brand_logo_area">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.3)]" id="logo_icon_container">
              <Compass className="w-4.5 h-4.5 text-white animate-spin-slow" />
            </div>
            <div>
              <span className="font-display font-bold text-lg bg-gradient-to-r from-teal-300 via-teal-100 to-blue-400 bg-clip-text text-transparent">
                Career Discovery
              </span>
              <span className="ml-1.5 text-[10px] uppercase tracking-wider text-teal-400 font-mono bg-teal-950/50 px-1.5 py-0.5 rounded border border-teal-900/40">
                PRO
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4" id="header_user_module">
            {currentUser && (
              <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800/80 rounded-full pl-2 pr-3 py-1 text-xs" id="logged_in_pill">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-slate-700 font-bold flex items-center justify-center text-white" id="avatar_mini_badge">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left" id="user_text_block">
                  <div className="font-semibold text-slate-200 line-clamp-1">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">{currentUser.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 text-slate-400 hover:text-red-400 transition-colors rounded-full hover:bg-slate-800/60"
                  title="Logout Account"
                  id="logout_header_btn"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {!currentUser && currentStep !== 'auth' && (
              <button
                onClick={() => navigateToStep('auth')}
                className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 py-1.5 px-3 rounded-md transition-all font-medium"
                id="portal_signin_btn"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {currentStep !== 'auth' && currentStep !== 'welcome' && (
          <div className="w-full bg-slate-900/50 h-[3px] overflow-hidden" id="progressbar_track">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-500 cubic-bezier(0.4,_0,_0.2,_1)"
              style={{
                width:
                  currentStep === 'education'
                    ? '15%'
                    : currentStep === 'department'
                      ? '30%'
                      : currentStep === 'status'
                        ? '45%'
                        : currentStep === 'skills-decision'
                          ? '60%'
                          : currentStep === 'skills-select' || currentStep === 'skills-suggested'
                            ? '75%'
                            : currentStep === 'interests'
                              ? '90%'
                              : '100%',
              }}
              id="progressbar_bar"
            />
          </div>
        )}
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-center relative z-10" id="main_onboarding_canvas">
        {currentStep === 'auth' && (
          <div className="max-w-md w-full mx-auto animate-fade-in py-6" id="auth_view_block">
            <div className="bg-slate-900/75 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,18,50,0.8)] backdrop-blur-xl relative overflow-hidden" id="auth_card">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-500 via-blue-500 to-transparent" />

              <div className="text-center mb-8" id="auth_header_promo">
                <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-3" id="icon_carrier">
                  <Lock className="w-5 h-5 text-teal-400" />
                </div>
                <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
                  {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
                </h1>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  {authMode === 'signup'
                    ? 'Begin your guided path of customized career recommendation matrices'
                    : 'Access your saved career paths and learning parameters'}
                </p>
              </div>

              {authError && (
                <div className="mb-4 bg-red-950/40 border border-red-900/60 p-3 rounded-lg text-xs text-red-300 flex items-start space-x-2" id="auth_error_alert">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="mb-4 bg-teal-950/40 border border-teal-900/60 p-3 rounded-lg text-xs text-teal-300 flex items-start space-x-2 animate-pulse" id="auth_success_alert">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{authSuccess}</span>
                </div>
              )}

              <form onSubmit={authMode === 'signup' ? handleSignUp : handleLogin} className="space-y-4" id="credentials_form">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-teal-400 pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all font-medium focus:ring-1 focus:ring-teal-400/30"
                        required
                        id="user_fullname_input"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-400 pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all font-medium focus:ring-1 focus:ring-teal-400/30"
                      required
                      id="user_email_input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1.5">Secret Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-400 pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all font-medium focus:ring-1 focus:ring-teal-400/30"
                      required
                      id="user_password_input"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Secured safely with mock Supabase tokens.</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-teal-500/10 cursor-pointer text-center relative overflow-hidden"
                  id="submit_credentials_btn"
                >
                  {authMode === 'signup' ? 'Create Free Account' : 'Sign In securely'}
                </button>
              </form>

              <div className="relative my-6 flex py-1 items-center" id="auth_card_divider">
                <div className="flex-grow border-t border-slate-800" />
                <span className="flex-shrink mx-4 text-[10px] uppercase font-mono tracking-widest text-slate-500">OR CONTINUE WITH</span>
                <div className="flex-grow border-t border-slate-800" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center space-x-2 mb-3 cursor-pointer shadow-md"
                id="google_oauth_btn"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                onClick={handleGuestLogin}
                className="w-full bg-slate-950 hover:bg-slate-900 text-teal-400 hover:text-teal-300 border border-slate-800 font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center space-x-2 mb-4 hover:border-teal-500/30 cursor-pointer"
                id="guest_bypass_btn"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Guest Access (Mock Auth Profile)</span>
              </button>

              <div className="mt-6 text-center" id="auth_toggle_wrapper">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'signup' ? 'login' : 'signup');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className="text-xs text-slate-400 hover:text-teal-400 transition-colors"
                  id="auth_type_toggle"
                >
                  {authMode === 'signup' ? 'Have an account? Access credentials here' : 'New to the platform? Create credentials here'}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'welcome' && currentUser && (
          <div className="max-w-2xl w-full mx-auto text-center py-12 animate-fade-in" id="welcome_flow_block">
            <div className="bg-slate-900/60 border border-slate-800/80 p-8 sm:p-12 rounded-3xl backdrop-blur-xl relative overflow-hidden shadow-2xl" id="welcome_card">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-teal-400 to-blue-500 rounded-b-full shadow-[0_0_30px_rgba(20,184,166,0.5)]" />
              <div className="h-20 w-20 mx-auto bg-gradient-to-tr from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl font-display font-black shadow-xl mb-6 relative" id="name_avatar_huge">
                {currentUser.name.charAt(0).toUpperCase()}
                <span className="absolute -bottom-2 -right-2 text-2xl">💥</span>
              </div>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight" id="welcome_title">
                Hi <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-400">{currentUser.name}</span> 💥
              </h1>
              <p className="font-display text-lg sm:text-xl text-slate-300 mt-3 font-medium" id="welcome_subtitle">We'll help you discover your future career</p>
              <p className="text-slate-400 text-sm max-w-md mx-auto mt-4 leading-relaxed">
                By entering parameters regarding your current studies, status metrics, and areas of engineering, our engine yields customized path breakdowns and modern interactive guidelines.
              </p>
              <div className="mt-8 flex justify-center" id="welcome_action_panel">
                <button
                  onClick={() => navigateToStep('education')}
                  className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-teal-500/10 hover:shadow-teal-400/20 active:scale-98 transition-all flex items-center space-x-2 text-sm cursor-pointer"
                  id="welcome_primary_start_btn"
                >
                  <span>Build My Career Matrix</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>
              </div>
              <div className="mt-10 pt-6 border-t border-slate-800/60 grid grid-cols-3 gap-4 text-center text-slate-500 text-[11px] font-mono uppercase tracking-widest" id="welcome_bullets">
                <div id="welcome_b1">1. Academy details</div>
                <div id="welcome_b2">2. Skill Vectors</div>
                <div id="welcome_b3">3. Growth Roadmaps</div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'education' && (
          <div className="max-w-3xl w-full mx-auto animate-fade-in py-8">
            <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-teal-400" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Education Background</h2>
                <p className="text-slate-400">What is your current or highest level of education?</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {EDUCATION_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedEducation(opt);
                      saveCurrentProfile({ education: opt });
                    }}
                    className={`p-4 rounded-xl border transition-all text-sm font-semibold flex items-center justify-center text-center ${
                      selectedEducation === opt
                        ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.2)]'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {selectedEducation === 'Other' && (
                <div className="mt-4 animate-fade-in">
                  <input
                    type="text"
                    placeholder="Specify your education..."
                    value={customEducation}
                    onChange={(e) => {
                      setCustomEducation(e.target.value);
                      saveCurrentProfile({ customEducation: e.target.value });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-400 px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all"
                  />
                </div>
              )}
              <div className="mt-10 flex items-center justify-between border-t border-slate-800/60 pt-6">
                <button
                  onClick={() => navigateToStep('welcome')}
                  className="flex items-center text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Start
                </button>
                <button
                  onClick={() => navigateToStep('department')}
                  disabled={!selectedEducation || (selectedEducation === 'Other' && !customEducation)}
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-2.5 rounded-xl font-bold flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/10 cursor-pointer"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'department' && (
          <div className="max-w-3xl w-full mx-auto animate-fade-in py-8">
            <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Book className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Field of Study</h2>
                <p className="text-slate-400">What is your primary department or focus area?</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {DEPARTMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedDepartment(opt);
                      saveCurrentProfile({ department: opt });
                    }}
                    className={`p-4 rounded-xl border transition-all text-sm font-semibold flex items-center justify-center text-center ${
                      selectedDepartment === opt
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {selectedDepartment === 'Other' && (
                <div className="mt-4 animate-fade-in">
                  <input
                    type="text"
                    placeholder="Specify your department..."
                    value={customDepartment}
                    onChange={(e) => {
                      setCustomDepartment(e.target.value);
                      saveCurrentProfile({ customDepartment: e.target.value });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-400 px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all"
                  />
                </div>
              )}
              <div className="mt-10 flex items-center justify-between border-t border-slate-800/60 pt-6">
                <button
                  onClick={() => navigateToStep('education')}
                  className="flex items-center text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
                <button
                  onClick={() => navigateToStep('status')}
                  disabled={!selectedDepartment || (selectedDepartment === 'Other' && !customDepartment)}
                  className="bg-blue-500 hover:bg-blue-400 text-slate-950 px-6 py-2.5 rounded-xl font-bold flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'status' && (
          <div className="max-w-3xl w-full mx-auto animate-fade-in py-8">
            <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Current Status</h2>
                <p className="text-slate-400">Where are you in your professional journey?</p>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedStatus(opt);
                      saveCurrentProfile({ status: opt });
                    }}
                    className={`p-6 rounded-2xl border transition-all text-sm font-semibold flex flex-col items-center justify-center text-center gap-3 ${
                      selectedStatus === opt
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    {opt === 'Student' && <BookOpen className="w-6 h-6 opacity-80" />}
                    {opt === 'Fresher' && <Sparkles className="w-6 h-6 opacity-80" />}
                    {opt === 'Working Professional' && <Briefcase className="w-6 h-6 opacity-80" />}
                    {opt}
                  </button>
                ))}
              </div>
              
              <div className="mt-10 flex items-center justify-between border-t border-slate-800/60 pt-6">
                <button
                  onClick={() => navigateToStep('department')}
                  className="flex items-center text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
                <button
                  onClick={() => navigateToStep('skills-decision')}
                  disabled={!selectedStatus}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2.5 rounded-xl font-bold flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'skills-decision' && (
          <div className="max-w-2xl w-full mx-auto animate-fade-in py-8">
            <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl backdrop-blur-xl shadow-2xl text-center">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">Do you have technical skills?</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">Knowing your current tech stack helps us map you directly to specific career matches. If you are starting fresh, we can suggest roles based entirely on your domain.</p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => { setKnowSkills(true); saveCurrentProfile({ knowSkills: true }); navigateToStep('skills-select'); }}
                  className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl transition-all group text-left cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold text-lg">Yes, I do</h3>
                    <Code className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">I know some programming, tools, or software packages.</p>
                </button>

                <button
                  onClick={() => { setKnowSkills(false); saveCurrentProfile({ knowSkills: false }); navigateToStep('recommendations'); }}
                  className="bg-slate-950 border border-slate-800 hover:border-teal-500/50 p-6 rounded-2xl transition-all group text-left cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold text-lg">No, not yet</h3>
                    <Compass className="w-5 h-5 text-slate-500 group-hover:text-teal-400 transition-colors" />
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">I am starting completely fresh in my department.</p>
                </button>
              </div>
              
              <div className="mt-8 flex justify-center">
                <button onClick={() => navigateToStep('status')} className="flex items-center text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors cursor-pointer">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'skills-select' && (
          <div className="max-w-3xl w-full mx-auto animate-fade-in py-8">
            <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Code className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Technical Skills</h2>
                <p className="text-slate-400">Select the tools and languages you already know.</p>
              </div>

              {selectedSkills.length > 0 && (
                <div className="mb-6 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Your Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map(skill => (
                      <span key={skill} className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-lg text-sm flex items-center shadow-sm">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="ml-2 text-purple-400 hover:text-purple-200 focus:outline-none cursor-pointer">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="relative mb-6">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search skills (e.g., Python, React)..."
                  value={skillSearchQuery}
                  onChange={(e) => setSkillSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 pl-12 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-1 focus:ring-purple-500/30"
                />
              </div>

              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                {filteredPopularSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => addSkill(skill)}
                    className="bg-slate-800/50 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700/50 hover:border-purple-500/50 text-sm transition-colors flex items-center cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> {skill}
                  </button>
                ))}
                {skillSearchQuery && filteredPopularSkills.length === 0 && (
                  <button
                    onClick={() => { addSkill(skillSearchQuery); setSkillSearchQuery(''); }}
                    className="bg-slate-800/50 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700/50 hover:border-purple-500/50 text-sm transition-colors flex items-center cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add "{skillSearchQuery}"
                  </button>
                )}
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-slate-800/60 pt-6">
                <button onClick={() => navigateToStep('skills-decision')} className="flex items-center text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors cursor-pointer">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
                <button
                  onClick={() => {
                    const dept = selectedDepartment === 'Other' ? customDepartment : selectedDepartment;
                    if (DEPT_TYPICAL_SKILLS[dept]) {
                      navigateToStep('skills-suggested');
                    } else {
                      navigateToStep('interests');
                    }
                  }}
                  className="bg-purple-500 hover:bg-purple-400 text-white px-6 py-2.5 rounded-xl font-bold flex items-center text-sm transition-all shadow-lg shadow-purple-500/10 cursor-pointer"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'skills-suggested' && (
          <div className="max-w-3xl w-full mx-auto animate-fade-in py-8">
            <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Typical Skills in {selectedDepartment === 'Other' ? customDepartment : selectedDepartment}</h2>
                <p className="text-slate-400">Add any of these highly requested skills directly to your profile.</p>
              </div>

              <div className="space-y-4 mb-8">
                {(DEPT_TYPICAL_SKILLS[selectedDepartment === 'Other' ? customDepartment : selectedDepartment] || []).map(item => (
                  <div key={item.skill} className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl flex justify-between items-center transition-all hover:border-slate-700">
                    <div>
                      <h4 className="text-white font-semibold flex items-center text-sm">
                        {item.skill}
                        {selectedSkills.includes(item.skill) && <CheckCircle className="w-4 h-4 text-teal-400 ml-2" />}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                    {!selectedSkills.includes(item.skill) ? (
                      <button onClick={() => addSkill(item.skill)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ml-4 border border-slate-700 cursor-pointer shadow-sm">
                        Add Skill
                      </button>
                    ) : (
                      <button onClick={() => removeSkill(item.skill)} className="bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ml-4 border border-teal-500/20 cursor-pointer shadow-sm">
                        Added
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-slate-800/60 pt-6">
                <button onClick={() => navigateToStep('skills-select')} className="flex items-center text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors cursor-pointer">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
                <button
                  onClick={() => navigateToStep('interests')}
                  className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2.5 rounded-xl font-bold flex items-center text-sm transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'interests' && (
          <div className="max-w-3xl w-full mx-auto animate-fade-in py-8">
            <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ThumbsUp className="w-6 h-6 text-pink-400" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Career Interests</h2>
                <p className="text-slate-400">What topics and industries excite you the most?</p>
              </div>

              {selectedInterests.length > 0 && (
                <div className="mb-6 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Your Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedInterests.map(interest => (
                      <span key={interest} className="bg-pink-500/20 text-pink-300 border border-pink-500/30 px-3 py-1.5 rounded-lg text-sm flex items-center shadow-sm">
                        {interest}
                        <button onClick={() => removeInterest(interest)} className="ml-2 text-pink-400 hover:text-pink-200 focus:outline-none cursor-pointer">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="relative mb-6">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search interests (e.g., UI/UX, Cloud)..."
                  value={interestSearchQuery}
                  onChange={(e) => setInterestSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 pl-12 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-1 focus:ring-pink-500/30"
                />
              </div>

              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                {filteredPopularInterests.map(interest => (
                  <button
                    key={interest}
                    onClick={() => addInterest(interest)}
                    className="bg-slate-800/50 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700/50 hover:border-pink-500/50 text-sm transition-colors flex items-center cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> {interest}
                  </button>
                ))}
                {interestSearchQuery && filteredPopularInterests.length === 0 && (
                  <button
                    onClick={() => { addInterest(interestSearchQuery); setInterestSearchQuery(''); }}
                    className="bg-slate-800/50 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700/50 hover:border-pink-500/50 text-sm transition-colors flex items-center cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add "{interestSearchQuery}"
                  </button>
                )}
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-slate-800/60 pt-6">
                <button 
                  onClick={() => {
                     const dept = selectedDepartment === 'Other' ? customDepartment : selectedDepartment;
                     if (DEPT_TYPICAL_SKILLS[dept]) {
                       navigateToStep('skills-suggested');
                     } else {
                       navigateToStep('skills-select');
                     }
                  }} 
                  className="flex items-center text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
                <button
                  onClick={() => navigateToStep('recommendations')}
                  disabled={selectedInterests.length === 0}
                  className="bg-pink-500 hover:bg-pink-400 text-white px-6 py-2.5 rounded-xl font-bold flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-pink-500/10 cursor-pointer"
                >
                  Generate Matrix <Sparkles className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'recommendations' && (
          <div className="max-w-7xl w-full mx-auto animate-fade-in flex flex-col lg:flex-row gap-6 h-[80vh] min-h-[600px]">
             <div className="lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
                <h2 className="text-xl font-display font-bold text-white mb-2 flex items-center">
                  <Sparkles className="w-5 h-5 text-teal-400 mr-2" />
                  Career Matches
                </h2>
                {matches.map(m => (
                   <button
                     key={m.id}
                     onClick={() => setViewingCareerId(m.id)}
                     className={`text-left p-5 rounded-2xl border transition-all cursor-pointer ${viewingCareerId === m.id ? 'bg-teal-900/20 border-teal-500/50 shadow-lg shadow-teal-500/5' : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700'}`}
                   >
                     <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-white text-lg">{m.name}</h3>
                       {m.matchScore && (
                         <span className="bg-teal-500/10 text-teal-400 text-xs font-mono font-bold px-2 py-1 rounded border border-teal-500/20 shrink-0 ml-3">
                           {m.matchScore}% FIT
                         </span>
                       )}
                     </div>
                     <p className="text-sm text-slate-400 line-clamp-2">{m.description}</p>
                   </button>
                ))}
             </div>

             <div className="lg:w-2/3 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 lg:p-10 overflow-y-auto shadow-2xl backdrop-blur-xl relative">
                {activeCareer ? (
                   <div className="animate-fade-in">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h1 className="text-3xl font-display font-bold text-white mb-2">{activeCareer.name}</h1>
                          <div className="flex flex-wrap gap-3 text-sm">
                            <span className="flex items-center text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md border border-emerald-400/20 font-medium">
                              <Coins className="w-4 h-4 mr-1.5" />
                              {activeCareer.salary}
                            </span>
                            <span className="flex items-center text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-md border border-blue-400/20 font-medium">
                              <TrendingUp className="w-4 h-4 mr-1.5" />
                              {activeCareer.growth}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h3 className="text-slate-300 font-semibold mb-2 flex items-center">
                           <BookOpen className="w-4 h-4 mr-2 text-teal-400" /> Role Overview
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{activeCareer.detailedRole || activeCareer.description}</p>
                      </div>

                      {activeCareer.whyItMatches && (
                         <div className="mb-8 bg-teal-950/30 border border-teal-900/50 p-4 rounded-xl flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                            <div>
                               <h4 className="text-teal-300 font-semibold text-sm mb-1">Why this matches your profile</h4>
                               <p className="text-teal-100/70 text-xs leading-relaxed">{activeCareer.whyItMatches}</p>
                            </div>
                         </div>
                      )}

                      <div className="mb-8">
                         <h3 className="text-slate-300 font-semibold mb-3 flex items-center">
                            <Layers className="w-4 h-4 mr-2 text-blue-400" /> Required Skills
                         </h3>
                         <div className="flex flex-wrap gap-2">
                            {activeCareer.requiredSkills.map(skill => (
                               <span key={skill} className="bg-slate-800/80 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700/50 shadow-sm">
                                  {skill}
                               </span>
                            ))}
                         </div>
                      </div>

                      {activeCareer.roadmap && (
                         <div className="mt-10 border-t border-slate-800/80 pt-8">
                            <h2 className="text-2xl font-display font-bold text-white mb-6">Learning Roadmap</h2>

                            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
                               <Code className="w-5 h-5 mr-2 text-purple-400" /> Core Concepts to Master
                            </h3>
                            <div className="space-y-4 mb-10">
                               {activeCareer.roadmap.skills.map((skill, idx) => (
                                  <div key={skill.id} className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                                     <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-white font-medium flex items-center text-sm">
                                           <span className="text-slate-500 font-mono text-xs mr-2">{idx + 1}.</span>
                                           {skill.title}
                                        </h4>
                                        <span className="text-[10px] uppercase tracking-wider font-semibold text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">
                                           {skill.importance}
                                        </span>
                                     </div>
                                     <p className="text-slate-400 text-xs mb-4">{skill.description}</p>

                                     {skill.resources && (
                                        <div className="flex gap-4">
                                           {skill.resources.youtube && (
                                              <a href={skill.resources.youtube} target="_blank" rel="noreferrer" className="flex items-center text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer font-medium">
                                                 <Youtube className="w-3.5 h-3.5 mr-1" /> YouTube
                                              </a>
                                           )}
                                           {skill.resources.officialDocs && (
                                              <a href={skill.resources.officialDocs} target="_blank" rel="noreferrer" className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-medium">
                                                 <ExternalLink className="w-3.5 h-3.5 mr-1" /> Documentation
                                              </a>
                                           )}
                                        </div>
                                     )}
                                  </div>
                               ))}
                            </div>

                            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
                               <Briefcase className="w-5 h-5 mr-2 text-amber-400" /> Portfolio Projects
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                               {activeCareer.roadmap.projects.map(proj => (
                                  <div key={proj.title} className="bg-amber-950/10 border border-amber-900/20 rounded-xl p-5 hover:border-amber-900/40 transition-colors">
                                     <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-amber-300 font-semibold text-sm">{proj.title}</h4>
                                     </div>
                                     <p className="text-slate-400 text-xs mb-3 leading-relaxed">{proj.description}</p>
                                     <ul className="space-y-1.5 mt-4 border-t border-amber-900/20 pt-3">
                                        {proj.milestones.map((ms, i) => (
                                           <li key={i} className="text-xs text-slate-500 flex items-start">
                                              <ChevronRight className="w-3.5 h-3.5 text-amber-500/50 mr-1 shrink-0" />
                                              {ms}
                                           </li>
                                        ))}
                                     </ul>
                                  </div>
                               ))}
                            </div>
                         </div>
                      )}
                      
                      <div className="mt-10 flex justify-center pb-8 border-t border-slate-800/80 pt-8">
                         <button
                           onClick={() => navigateToStep('welcome')}
                           className="text-slate-400 hover:text-white text-sm font-medium flex items-center transition-colors cursor-pointer bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-lg"
                         >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Start Over
                         </button>
                      </div>
                   </div>
                ) : (
                   <div className="h-full flex flex-col items-center justify-center text-slate-500">
                      <Search className="w-12 h-12 mb-4 opacity-30" />
                      <p className="font-medium">Select a career match to view roadmap</p>
                   </div>
                )}
             </div>
          </div>
        )}
      </main>

      <footer className="border-t border-blue-950/60 bg-slate-950/90 py-6" id="main_app_footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div id="footer_auth_badge">Secure client session validated using custom secure simulation tokens.</div>
          <div className="flex items-center space-x-1 text-slate-400 hover:text-white" id="terms_copyright">
            <span>© 2026 Google AI Studio Build Co.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
