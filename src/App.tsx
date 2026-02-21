/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  LayoutGrid, 
  List, 
  Activity, 
  Smile, 
  DollarSign, 
  Heart,
  Home,
  Settings,
  Search,
  ChevronRight,
  Bell,
  User,
  CalendarDays,
  CalendarRange,
  Plus,
  Trash2,
  X,
  Check,
  Circle,
  Dot,
  Minus,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Image as ImageIcon,
  Camera,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Coffee
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { format, startOfToday, isSameDay, subDays, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from './lib/utils';
import { BulletEntry, Habit, Transaction, MoodEntry, GratitudeEntry, Collection, Tab, UserProfile, VisionItem } from './types';

// --- Persistence Hook ---
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeNav, setActiveNav] = useLocalStorage<Tab>('mb_active_nav', 'Início');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // User Profile State
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('mb_profile', {
    name: 'Usuário',
    photoUrl: ''
  });
  
  // Data States
  const [dailyLog, setDailyLog] = useLocalStorage<BulletEntry[]>('mb_daily', []);
  const [weeklyLog, setWeeklyLog] = useLocalStorage<BulletEntry[]>('mb_weekly', []);
  const [monthlyLog, setMonthlyLog] = useLocalStorage<BulletEntry[]>('mb_monthly', []);
  const [futureLog, setFutureLog] = useLocalStorage<BulletEntry[]>('mb_future', []);
  const [habits, setHabits] = useLocalStorage<Habit[]>('mb_habits', [
    { id: '1', name: 'Beber 2L de água', completedDays: [] },
    { id: '2', name: 'Meditar 10min', completedDays: [] },
    { id: '3', name: 'Ler 20 páginas', completedDays: [] }
  ]);
  const [moods, setMoods] = useLocalStorage<MoodEntry[]>('mb_moods', []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('mb_finances', []);
  const [gratitude, setGratitude] = useLocalStorage<GratitudeEntry[]>('mb_gratitude', []);
  const [collections, setCollections] = useLocalStorage<Collection[]>('mb_collections', []);
  const [visionBoard, setVisionBoard] = useLocalStorage<VisionItem[]>('mb_vision', [
    { id: '1', title: 'Viagem dos Sonhos', imageUrl: 'https://picsum.photos/seed/travel/400/300' },
    { id: '2', title: 'Nova Casa', imageUrl: 'https://picsum.photos/seed/home/400/300' },
    { id: '3', title: 'Foco e Saúde', imageUrl: 'https://picsum.photos/seed/health/400/300' }
  ]);

  const dashboardCards = [
    { title: 'Registro Diário', subtitle: 'Suas tarefas e notas de hoje', icon: <BookOpen className="fill-current" size={18} />, color: 'bg-[#0F172A]' },
    { title: 'Registro Semanal', subtitle: 'Planejamento da semana', icon: <Calendar className="fill-current" size={18} />, color: 'bg-[#0F172A]' },
    { title: 'Registro Mensal', subtitle: 'Visão geral do mês', icon: <CalendarDays className="fill-current" size={18} />, color: 'bg-[#0F172A]' },
    { title: 'Registro Futuro', subtitle: 'Metas e eventos distantes', icon: <CalendarRange className="fill-current" size={18} />, color: 'bg-[#0F172A]' },
    { title: 'Coleções', subtitle: 'Listas e projetos temáticos', icon: <List className="fill-current" size={18} />, color: 'bg-[#0F172A]' },
    { title: 'Hábitos', subtitle: 'Acompanhe sua rotina', icon: <Activity className="fill-current" size={18} />, color: 'bg-[#0F172A]' },
    { title: 'Humor', subtitle: 'Como você se sente hoje?', icon: <Smile className="fill-current" size={18} />, color: 'bg-[#0F172A]' },
    { title: 'Finanças', subtitle: 'Controle de gastos e metas', icon: <DollarSign className="fill-current" size={18} />, color: 'bg-[#0F172A]' },
    { title: 'Gratidão', subtitle: 'Pelo que você é grato?', icon: <Heart className="fill-current" size={18} />, color: 'bg-[#0F172A]' },
    { title: 'Pomodoro', subtitle: 'Foco e produtividade', icon: <Timer className="fill-current" size={18} />, color: 'bg-[#0F172A]' }
  ];

  const renderContent = () => {
    switch (activeNav) {
      case 'Início':
        return (
          <div className="animate-fade-in">
            <header className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="text-[24px] font-semibold text-[#1E293B]">Bem-vindo, {userProfile.name}</h2>
                <p className="text-[14px] text-[#64748B] mt-1 font-medium">
                  {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
              <div className="flex items-center space-x-2 text-[13px] font-semibold text-[#0F172A] bg-white px-4 py-2 rounded-[8px] border border-[#E2E8F0] shadow-sm cursor-pointer hover:bg-[#F8F9FA] transition-colors">
                <span>Hoje</span>
                <ChevronRight size={14} />
              </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
              {dashboardCards.map((card, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -2 }}
                  onClick={() => setActiveNav(card.title as Tab)}
                  className="bg-white p-[20px] rounded-[12px] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all group cursor-pointer"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-[8px] flex items-center justify-center text-white mb-6 transition-transform group-hover:scale-105",
                    card.color
                  )}>
                    {card.icon}
                  </div>
                  <h3 className="text-[16px] font-bold text-[#1E293B] mb-1">{card.title}</h3>
                  <p className="text-[13px] text-[#64748B] leading-relaxed">{card.subtitle}</p>
                </motion.div>
              ))}
            </div>

            {/* Vision Board Section */}
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-[20px] font-bold text-[#1E293B]">Vision Board</h3>
                  <p className="text-[13px] text-[#64748B] mt-1">Visualize seus sonhos e metas</p>
                </div>
                <AddVisionItem onAdd={(item) => setVisionBoard([item, ...visionBoard])} />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                  {visionBoard.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative aspect-[4/5] rounded-[24px] overflow-hidden border border-[#E2E8F0] bg-white shadow-sm hover:shadow-md transition-all"
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                        <p className="text-white font-bold text-sm mb-2">{item.title}</p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setVisionBoard(visionBoard.filter(v => v.id !== item.id));
                          }}
                          className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        );
      case 'Registro Diário':
      case 'Registro Semanal':
      case 'Registro Mensal':
      case 'Registro Futuro':
        const logMap: Record<string, [BulletEntry[], React.Dispatch<React.SetStateAction<BulletEntry[]>>]> = {
          'Registro Diário': [dailyLog, setDailyLog],
          'Registro Semanal': [weeklyLog, setWeeklyLog],
          'Registro Mensal': [monthlyLog, setMonthlyLog],
          'Registro Futuro': [futureLog, setFutureLog],
        };
        const [currentLog, setCurrentLog] = logMap[activeNav];
        return <BulletLogView title={activeNav} entries={currentLog} setEntries={setCurrentLog} onBack={() => setActiveNav('Início')} />;
      case 'Hábitos':
        return <HabitTracker habits={habits} setHabits={setHabits} onBack={() => setActiveNav('Início')} />;
      case 'Humor':
        return <MoodTracker moods={moods} setMoods={setMoods} onBack={() => setActiveNav('Início')} />;
      case 'Finanças':
        return <FinanceTracker transactions={transactions} setTransactions={setTransactions} onBack={() => setActiveNav('Início')} />;
      case 'Gratidão':
        return <GratitudeTracker entries={gratitude} setEntries={setGratitude} onBack={() => setActiveNav('Início')} />;
      case 'Coleções':
        return <CollectionsTracker collections={collections} setCollections={setCollections} onBack={() => setActiveNav('Início')} />;
      case 'Pomodoro':
        return <PomodoroTimer onBack={() => setActiveNav('Início')} />;
      case 'Configurações':
        return <SettingsView profile={userProfile} setProfile={setUserProfile} onBack={() => setActiveNav('Início')} />;
      default:
        return <div className="flex items-center justify-center h-full text-slate-400 italic">Em breve...</div>;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <SplashScreen key="splash" />
      ) : (
        <motion.div 
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen flex bg-[#F8F9FA]"
        >
          {/* Sidebar */}
          <aside className="w-[240px] bg-white border-r border-[#E2E8F0] flex flex-col p-6 sticky top-0 h-screen">
            <div className="mb-12">
              <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Meu Bullet</h1>
              <p className="text-[11px] text-[#64748B] mt-1 font-medium uppercase tracking-wider">Organize sua vida</p>
            </div>

            <nav className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-2">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.2em] px-4 mb-4">Menu</p>
                <SidebarItem 
                  icon={<Home size={18} />} 
                  label="Início" 
                  active={activeNav === 'Início'} 
                  onClick={() => setActiveNav('Início')} 
                />
                <SidebarItem 
                  icon={<Settings size={18} />} 
                  label="Configurações" 
                  active={activeNav === 'Configurações'} 
                  onClick={() => setActiveNav('Configurações')} 
                />
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.2em] px-4 mb-4">Funções</p>
                {dashboardCards.map((card) => (
                  <div key={card.title}>
                    <SidebarItem 
                      icon={card.icon} 
                      label={card.title} 
                      active={activeNav === card.title} 
                      onClick={() => setActiveNav(card.title as Tab)} 
                    />
                  </div>
                ))}
              </div>
            </nav>

            <div className="mt-auto pt-6 border-t border-[#F1F5F9] flex items-center justify-between">
              <button className="p-2 text-[#64748B] hover:text-[#0F172A] transition-colors">
                <Search size={18} />
              </button>
              <button className="p-2 text-[#64748B] hover:text-[#0F172A] transition-colors">
                <Bell size={18} />
              </button>
              <button 
                onClick={() => setActiveNav('Configurações')}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] overflow-hidden hover:ring-2 hover:ring-[#0F172A] transition-all"
              >
                {userProfile.photoUrl ? (
                  <img src={userProfile.photoUrl} alt={userProfile.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={16} />
                )}
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-12 overflow-y-auto custom-scrollbar">
            {renderContent()}
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-[#0F172A] flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 1, 
          ease: "easeOut",
          delay: 0.2
        }}
        className="text-center"
      >
        <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center mb-6 mx-auto shadow-2xl shadow-white/10">
          <BookOpen className="text-[#0F172A]" size={40} />
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tighter mb-2">Meu Bullet</h1>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 text-white text-[10px] font-bold uppercase tracking-[0.3em]"
      >
        Sua vida organizada
      </motion.p>
    </motion.div>
  );
}

// --- Sub-components ---

function BulletLogView({ title, entries, setEntries, onBack }: { title: string, entries: BulletEntry[], setEntries: React.Dispatch<React.SetStateAction<BulletEntry[]>>, onBack: () => void }) {
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState<'task' | 'event' | 'note'>('task');

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newEntry: BulletEntry = {
      id: crypto.randomUUID(),
      type: inputType,
      content: inputValue,
      status: 'pending',
      createdAt: Date.now(),
    };
    setEntries([newEntry, ...entries]);
    setInputValue('');
  };

  const toggleStatus = (id: string) => {
    setEntries(entries.map(entry => {
      if (entry.id !== id || entry.type !== 'task') return entry;
      const order: BulletEntry['status'][] = ['pending', 'completed', 'migrated', 'cancelled'];
      const next = order[(order.indexOf(entry.status) + 1) % order.length];
      return { ...entry, status: next };
    }));
  };

  const deleteEntry = (id: string) => setEntries(entries.filter(e => e.id !== id));

  const getSymbol = (entry: BulletEntry) => {
    if (entry.type === 'note') return <Minus size={14} className="text-[#64748B]" />;
    if (entry.type === 'event') return <Circle size={14} className="text-[#64748B]" />;
    switch (entry.status) {
      case 'completed': return <X size={16} className="text-[#0F172A] font-bold" />;
      case 'migrated': return <ChevronRight size={16} className="text-[#0F172A]" />;
      case 'cancelled': return <div className="w-4 h-[1px] bg-[#CBD5E1] rotate-45 absolute" />;
      default: return <div className="w-1.5 h-1.5 bg-[#0F172A] rounded-full" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <button onClick={onBack} className="flex items-center space-x-2 text-[#64748B] hover:text-[#0F172A] mb-8 transition-colors">
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Voltar ao Dashboard</span>
      </button>
      <h2 className="text-3xl font-bold text-[#0F172A] mb-12">{title}</h2>
      
      <form onSubmit={addEntry} className="mb-12 space-y-4">
        <div className="flex items-center space-x-2">
          {(['task', 'event', 'note'] as const).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setInputType(type)}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center border transition-all",
                inputType === type ? "bg-[#0F172A] text-white border-[#0F172A]" : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#64748B]"
              )}
            >
              {type === 'task' ? <Dot size={24} /> : type === 'event' ? <Circle size={12} /> : <Minus size={16} />}
            </button>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Adicionar entrada rápida..."
            className="w-full bg-white border border-[#E2E8F0] rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-[#0F172A] transition-all"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-[#0F172A] text-white rounded-lg">
            <Plus size={20} />
          </button>
        </div>
      </form>

      <div className="space-y-1">
        {entries.map(entry => (
          <div key={entry.id} className="group flex items-start py-3 px-4 hover:bg-white rounded-xl transition-all">
            <button onClick={() => toggleStatus(entry.id)} className="w-8 h-8 flex items-center justify-center relative flex-shrink-0 mr-4">
              {getSymbol(entry)}
            </button>
            <span className={cn(
              "flex-1 text-lg leading-relaxed pt-0.5",
              entry.status === 'completed' && "text-[#CBD5E1] line-through",
              entry.status === 'cancelled' && "text-[#E2E8F0] line-through opacity-50",
              entry.type === 'note' && "italic text-[#64748B]"
            )}>
              {entry.content}
            </span>
            <button onClick={() => deleteEntry(entry.id)} className="opacity-0 group-hover:opacity-100 p-2 text-[#CBD5E1] hover:text-red-500 transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function HabitTracker({ habits, setHabits, onBack }: { habits: Habit[], setHabits: React.Dispatch<React.SetStateAction<Habit[]>>, onBack: () => void }) {
  const [newHabit, setNewHabit] = useState('');
  const [viewMode, setViewMode] = useLocalStorage<'chart' | 'matrix'>('mb_habit_view', 'matrix');
  const [chartOrientation, setChartOrientation] = useLocalStorage<'vertical' | 'horizontal'>('mb_habit_orient', 'vertical');
  const today = format(new Date(), 'yyyy-MM-dd');

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    setHabits([...habits, { id: crypto.randomUUID(), name: newHabit, completedDays: [] }]);
    setNewHabit('');
  };

  const toggleHabit = (id: string, dateStr: string = today) => {
    setHabits(habits.map(h => {
      if (h.id !== id) return h;
      const completed = h.completedDays.includes(dateStr)
        ? h.completedDays.filter(d => d !== dateStr)
        : [...h.completedDays, dateStr];
      return { ...h, completedDays: completed };
    }));
  };

  const deleteHabit = (id: string) => setHabits(habits.filter(h => h.id !== id));

  // Chart Data: Completion per day for the last 7 days
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  });

  const chartData = last7Days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const count = habits.reduce((acc, h) => acc + (h.completedDays.includes(dateStr) ? 1 : 0), 0);
    return {
      name: format(day, 'EEE', { locale: ptBR }),
      count,
      fullDate: format(day, "d 'de' MMM", { locale: ptBR }),
      dateStr
    };
  });

  // Habit specific stats
  const habitStats = habits.map(h => ({
    name: h.name,
    value: h.completedDays.length
  }));

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center space-x-2 text-[#64748B] hover:text-[#0F172A] transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Voltar ao Dashboard</span>
        </button>
        <div className="flex bg-white p-1 rounded-lg border border-[#E2E8F0]">
          <button 
            onClick={() => setViewMode('matrix')}
            className={cn("px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all", viewMode === 'matrix' ? "bg-[#0F172A] text-white" : "text-[#64748B] hover:bg-[#F8F9FA]")}
          >
            Matriz
          </button>
          <button 
            onClick={() => setViewMode('chart')}
            className={cn("px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all", viewMode === 'chart' ? "bg-[#0F172A] text-white" : "text-[#64748B] hover:bg-[#F8F9FA]")}
          >
            Gráfico
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-bold text-[#0F172A]">Hábitos</h2>
        <form onSubmit={addHabit} className="relative w-72">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Novo hábito..."
            className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#0F172A] transition-all"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#0F172A] text-white rounded-lg">
            <Plus size={16} />
          </button>
        </form>
      </div>

      {viewMode === 'matrix' ? (
        <div className="bg-white p-8 rounded-[24px] border border-[#E2E8F0] card-shadow overflow-x-auto mb-12">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[200px_repeat(7,1fr)] gap-4 mb-6">
              <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest self-end">Hábito / Dia</div>
              {last7Days.map(day => (
                <div key={day.toString()} className="text-center">
                  <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-1">{format(day, 'EEE', { locale: ptBR })}</p>
                  <p className="text-sm font-bold text-[#1E293B]">{format(day, 'd')}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              {habits.map(habit => (
                <div key={habit.id} className="grid grid-cols-[200px_repeat(7,1fr)] gap-4 items-center group">
                  <div className="flex items-center justify-between pr-4">
                    <span className="text-sm font-bold text-[#1E293B] truncate">{habit.name}</span>
                    <button onClick={() => deleteHabit(habit.id)} className="opacity-0 group-hover:opacity-100 text-[#CBD5E1] hover:text-red-500 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {last7Days.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCompleted = habit.completedDays.includes(dateStr);
                    return (
                      <button
                        key={dateStr}
                        onClick={() => toggleHabit(habit.id, dateStr)}
                        className={cn(
                          "aspect-square rounded-lg border-2 transition-all flex items-center justify-center",
                          isCompleted 
                            ? "bg-[#0F172A] border-[#0F172A] text-white" 
                            : "bg-[#F8F9FA] border-transparent hover:border-[#CBD5E1]"
                        )}
                      >
                        {isCompleted && <Check size={16} />}
                      </button>
                    );
                  })}
                </div>
              ))}
              {habits.length === 0 && (
                <div className="py-12 text-center text-slate-400 italic text-sm">Nenhum hábito cadastrado ainda.</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 bg-white p-8 rounded-[24px] border border-[#E2E8F0] card-shadow">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-widest">Progresso Semanal</h3>
              <button 
                onClick={() => setChartOrientation(prev => prev === 'vertical' ? 'horizontal' : 'vertical')}
                className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest hover:text-[#0F172A] transition-colors border border-[#E2E8F0] px-2 py-1 rounded"
              >
                {chartOrientation === 'vertical' ? 'Horizontal' : 'Vertical'}
              </button>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartData} 
                  layout={chartOrientation === 'horizontal' ? 'vertical' : 'horizontal'}
                  margin={{ left: chartOrientation === 'horizontal' ? 40 : 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={chartOrientation === 'horizontal'} horizontal={chartOrientation === 'vertical'} stroke="#F1F5F9" />
                  {chartOrientation === 'vertical' ? (
                    <>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                      <YAxis hide />
                    </>
                  ) : (
                    <>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dx={-10} />
                    </>
                  )}
                  <Tooltip 
                    cursor={{ fill: '#F8F9FA' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ fontWeight: 'bold', color: '#1E293B' }}
                  />
                  <Bar dataKey="count" radius={chartOrientation === 'vertical' ? [4, 4, 0, 0] : [0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.count === habits.length && habits.length > 0 ? '#10B981' : '#0F172A'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[24px] border border-[#E2E8F0] card-shadow flex flex-col">
            <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-widest mb-8">Distribuição</h3>
            <div className="flex-1 flex items-center justify-center">
              {habits.length > 0 ? (
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={habitStats}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {habitStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#0F172A', '#334155', '#475569', '#64748B', '#94A3B8'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-slate-300 italic text-sm text-center">Adicione hábitos para ver estatísticas</p>
              )}
            </div>
            <div className="mt-4 space-y-2">
              {habitStats.slice(0, 3).map((stat, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <span className="text-[#64748B] truncate mr-2">{stat.name}</span>
                  <span className="font-bold text-[#1E293B]">{stat.value} check-ins</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Habits List Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {habits.map(habit => (
          <div key={habit.id} className="bg-white p-4 rounded-xl border border-[#E2E8F0] flex items-center justify-between group hover:border-[#0F172A] transition-all">
            <div className="flex items-center space-x-3 truncate">
              <div className={cn("w-2 h-2 rounded-full", habit.completedDays.includes(today) ? "bg-emerald-500" : "bg-slate-200")} />
              <span className="text-sm font-bold text-[#1E293B] truncate">{habit.name}</span>
            </div>
            <span className="text-[10px] font-bold text-[#64748B]">{habit.completedDays.length}d</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoodTracker({ moods, setMoods, onBack }: { moods: MoodEntry[], setMoods: React.Dispatch<React.SetStateAction<MoodEntry[]>>, onBack: () => void }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const currentMood = moods.find(m => m.date === today)?.mood;

  const setMood = (mood: MoodEntry['mood']) => {
    const filtered = moods.filter(m => m.date !== today);
    setMoods([...filtered, { date: today, mood }]);
  };

  const moodIcons = {
    great: { icon: '🤩', label: 'Incrível' },
    good: { icon: '😊', label: 'Bem' },
    neutral: { icon: '😐', label: 'Neutro' },
    bad: { icon: '😔', label: 'Mal' },
    awful: { icon: '😫', label: 'Péssimo' }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <button onClick={onBack} className="flex items-center space-x-2 text-[#64748B] hover:text-[#0F172A] mb-8 transition-colors">
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Voltar ao Dashboard</span>
      </button>
      <h2 className="text-3xl font-bold text-[#0F172A] mb-12">Humor</h2>

      <div className="bg-white p-12 rounded-[32px] border border-[#E2E8F0] text-center">
        <h3 className="text-xl font-bold text-[#1E293B] mb-8">Como você está se sentindo hoje?</h3>
        <div className="flex justify-center space-x-4">
          {Object.entries(moodIcons).map(([key, { icon, label }]) => (
            <button
              key={key}
              onClick={() => setMood(key as MoodEntry['mood'])}
              className={cn(
                "flex flex-col items-center p-4 rounded-2xl border-2 transition-all w-24",
                currentMood === key ? "bg-[#0F172A] border-[#0F172A] text-white scale-110" : "bg-[#F8F9FA] border-transparent text-[#64748B] hover:border-[#CBD5E1]"
              )}
            >
              <span className="text-3xl mb-2">{icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FinanceTracker({ transactions, setTransactions, onBack }: { transactions: Transaction[], setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>, onBack: () => void }) {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !amount) return;
    const t: Transaction = {
      id: crypto.randomUUID(),
      description: desc,
      amount: parseFloat(amount),
      type,
      date: Date.now()
    };
    setTransactions([t, ...transactions]);
    setDesc('');
    setAmount('');
  };

  const total = transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <button onClick={onBack} className="flex items-center space-x-2 text-[#64748B] hover:text-[#0F172A] mb-8 transition-colors">
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Voltar ao Dashboard</span>
      </button>
      <h2 className="text-3xl font-bold text-[#0F172A] mb-12">Finanças</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-[#0F172A] p-8 rounded-[24px] text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-2">Saldo Total</p>
          <h3 className="text-4xl font-bold tracking-tight">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
        <form onSubmit={addTransaction} className="bg-white p-8 rounded-[24px] border border-[#E2E8F0] space-y-4">
          <div className="flex space-x-2">
            <button type="button" onClick={() => setType('income')} className={cn("flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all", type === 'income' ? "bg-emerald-500 border-emerald-500 text-white" : "border-[#E2E8F0] text-[#64748B]")}>Entrada</button>
            <button type="button" onClick={() => setType('expense')} className={cn("flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all", type === 'expense' ? "bg-red-500 border-red-500 text-white" : "border-[#E2E8F0] text-[#64748B]")}>Saída</button>
          </div>
          <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descrição" className="w-full bg-[#F8F9FA] border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0F172A]" />
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Valor (R$)" className="w-full bg-[#F8F9FA] border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0F172A]" />
          <button type="submit" className="w-full bg-[#0F172A] text-white py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all">Adicionar</button>
        </form>
      </div>

      <div className="space-y-3">
        {transactions.map(t => (
          <div key={t.id} className="bg-white p-4 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", t.type === 'income' ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500")}>
                {t.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              </div>
              <div>
                <p className="font-bold text-[#1E293B]">{t.description}</p>
                <p className="text-[10px] text-[#64748B] uppercase tracking-widest">{format(t.date, 'd MMM, HH:mm', { locale: ptBR })}</p>
              </div>
            </div>
            <p className={cn("font-bold", t.type === 'income' ? "text-emerald-500" : "text-red-500")}>
              {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GratitudeTracker({ entries, setEntries, onBack }: { entries: GratitudeEntry[], setEntries: React.Dispatch<React.SetStateAction<GratitudeEntry[]>>, onBack: () => void }) {
  const [newEntry, setNewEntry] = useState('');

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;
    setEntries([{ id: crypto.randomUUID(), content: newEntry, date: Date.now() }, ...entries]);
    setNewEntry('');
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <button onClick={onBack} className="flex items-center space-x-2 text-[#64748B] hover:text-[#0F172A] mb-8 transition-colors">
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Voltar ao Dashboard</span>
      </button>
      <h2 className="text-3xl font-bold text-[#0F172A] mb-12">Gratidão</h2>

      <form onSubmit={addEntry} className="mb-12">
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Pelo que você é grato hoje?"
          className="w-full h-32 bg-white border border-[#E2E8F0] rounded-2xl p-6 text-lg focus:outline-none focus:border-[#0F172A] transition-all resize-none mb-4"
        />
        <button type="submit" className="w-full bg-[#0F172A] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all">Registrar Gratidão</button>
      </form>

      <div className="space-y-6">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white p-8 rounded-[24px] border border-[#E2E8F0] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-400" />
            <p className="text-lg text-[#1E293B] leading-relaxed italic">"{entry.content}"</p>
            <p className="text-[10px] text-[#64748B] mt-4 uppercase tracking-widest font-bold">{format(entry.date, "d 'de' MMMM", { locale: ptBR })}</p>
            <button onClick={() => setEntries(entries.filter(e => e.id !== entry.id))} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-[#CBD5E1] hover:text-red-500 transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollectionsTracker({ collections, setCollections, onBack }: { collections: Collection[], setCollections: React.Dispatch<React.SetStateAction<Collection[]>>, onBack: () => void }) {
  const [newName, setNewName] = useState('');

  const addCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCollections([{ id: crypto.randomUUID(), name: newName, items: [] }, ...collections]);
    setNewName('');
  };

  const addItem = (id: string, item: string) => {
    if (!item.trim()) return;
    setCollections(collections.map(c => c.id === id ? { ...c, items: [...c.items, item] } : c));
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <button onClick={onBack} className="flex items-center space-x-2 text-[#64748B] hover:text-[#0F172A] mb-8 transition-colors">
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Voltar ao Dashboard</span>
      </button>
      <h2 className="text-3xl font-bold text-[#0F172A] mb-12">Coleções</h2>

      <form onSubmit={addCollection} className="mb-12 relative">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nova coleção (ex: Livros para Ler, Viagens...)"
          className="w-full bg-white border border-[#E2E8F0] rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-[#0F172A] transition-all"
        />
        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-[#0F172A] text-white rounded-lg">
          <Plus size={20} />
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map(c => (
          <div key={c.id} className="bg-white p-8 rounded-[24px] border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#1E293B]">{c.name}</h3>
              <button onClick={() => setCollections(collections.filter(col => col.id !== c.id))} className="text-[#CBD5E1] hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="space-y-2 mb-6">
              {c.items.map((item, i) => (
                <div key={i} className="flex items-center space-x-3 text-sm text-[#64748B]">
                  <Dot size={16} className="text-[#0F172A]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Adicionar item..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addItem(c.id, (e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
              className="w-full bg-[#F8F9FA] border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#0F172A]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsView({ profile, setProfile, onBack }: { profile: UserProfile, setProfile: React.Dispatch<React.SetStateAction<UserProfile>>, onBack: () => void }) {
  const [name, setName] = useState(profile.name);
  const [photoUrl, setPhotoUrl] = useState(profile.photoUrl);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ name, photoUrl });
    onBack();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <button onClick={onBack} className="flex items-center space-x-2 text-[#64748B] hover:text-[#0F172A] mb-8 transition-colors">
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Voltar ao Dashboard</span>
      </button>
      <h2 className="text-3xl font-bold text-[#0F172A] mb-12">Configurações de Perfil</h2>

      <form onSubmit={handleSave} className="bg-white p-10 rounded-[32px] border border-[#E2E8F0] space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div 
            onClick={triggerFileInput}
            className="w-24 h-24 rounded-full bg-[#F8F9FA] border-2 border-dashed border-[#CBD5E1] flex items-center justify-center overflow-hidden relative group cursor-pointer"
          >
            {photoUrl ? (
              <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-[#CBD5E1]" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-[10px] text-white font-bold uppercase tracking-wider">Alterar</p>
            </div>
          </div>
          <p className="text-xs text-[#64748B] text-center">Clique no círculo para carregar uma foto da galeria</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Seu Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como quer ser chamado?"
              className="w-full bg-[#F8F9FA] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#0F172A] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Ou cole a URL da Foto</label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://exemplo.com/foto.jpg"
              className="w-full bg-[#F8F9FA] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#0F172A] transition-all"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#0F172A] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full h-10 flex items-center space-x-3 px-4 rounded-[8px] transition-all duration-200 text-[14px] font-medium",
        active 
          ? "sidebar-item-active" 
          : "text-[#64748B] hover:bg-[#F8F9FA] hover:text-[#0F172A]"
      )}
    >
      <span className={cn("transition-transform", active && "scale-110")}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function PomodoroTimer({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<'work' | 'short' | 'long'>('work');
  const [durations, setDurations] = useLocalStorage('mb_pomo_durations', { work: 25, short: 5, long: 15 });
  const [timeLeft, setTimeLeft] = useState(durations.work * 60);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Optional: Play sound or notification
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durations[mode] * 60);
  };

  const switchMode = (newMode: 'work' | 'short' | 'long') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(durations[newMode] * 60);
  };

  const updateDuration = (key: keyof typeof durations, value: string) => {
    const num = parseInt(value) || 1;
    const newDurations = { ...durations, [key]: num };
    setDurations(newDurations);
    if (mode === key) {
      setTimeLeft(num * 60);
      setIsActive(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <button onClick={onBack} className="flex items-center space-x-2 text-[#64748B] hover:text-[#0F172A] mb-8 transition-colors">
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Voltar ao Dashboard</span>
      </button>

      <div className={cn(
        "p-12 rounded-[40px] border transition-all duration-500 text-center relative overflow-hidden",
        mode === 'work' ? "bg-rose-50 border-rose-100" : mode === 'short' ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"
      )}>
        <div className="flex justify-center space-x-2 mb-12">
          {(['work', 'short', 'long'] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={cn(
                "px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all",
                mode === m 
                  ? "bg-[#0F172A] text-white shadow-lg shadow-slate-900/20" 
                  : "text-[#64748B] hover:bg-white/50"
              )}
            >
              {m === 'work' ? 'Foco' : m === 'short' ? 'Pausa Curta' : 'Pausa Longa'}
            </button>
          ))}
        </div>

        <div className="relative mb-12">
          <h2 className="text-[120px] font-bold text-[#0F172A] tracking-tighter leading-none tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </h2>
          <p className="text-[14px] font-bold text-[#64748B] uppercase tracking-[0.3em] mt-4">
            {mode === 'work' ? 'Hora de focar' : 'Hora de descansar'}
          </p>
        </div>

        <div className="flex justify-center items-center space-x-6">
          <button 
            onClick={resetTimer}
            className="w-14 h-14 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1] transition-all"
          >
            <RotateCcw size={24} />
          </button>
          <button 
            onClick={toggleTimer}
            className="w-24 h-24 rounded-[32px] bg-[#0F172A] text-white flex items-center justify-center shadow-xl shadow-slate-900/20 hover:scale-105 transition-all"
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="w-14 h-14 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1] transition-all"
          >
            <Settings size={24} />
          </button>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-12 pt-12 border-t border-black/5"
            >
              <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-6">Configurar Tempos (minutos)</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Foco</label>
                  <input 
                    type="number" 
                    value={durations.work} 
                    onChange={(e) => updateDuration('work', e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-center font-bold text-[#0F172A]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Curta</label>
                  <input 
                    type="number" 
                    value={durations.short} 
                    onChange={(e) => updateDuration('short', e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-center font-bold text-[#0F172A]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Longa</label>
                  <input 
                    type="number" 
                    value={durations.long} 
                    onChange={(e) => updateDuration('long', e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-center font-bold text-[#0F172A]"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] text-center">
          <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-1">Sessões</p>
          <p className="text-2xl font-bold text-[#0F172A]">0</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] text-center">
          <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-1">Foco Total</p>
          <p className="text-2xl font-bold text-[#0F172A]">0m</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] text-center">
          <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-1">Meta</p>
          <p className="text-2xl font-bold text-[#0F172A]">8h</p>
        </div>
      </div>
    </div>
  );
}

function AddVisionItem({ onAdd }: { onAdd: (item: VisionItem) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;
    onAdd({ id: crypto.randomUUID(), title, imageUrl });
    setTitle('');
    setImageUrl('');
    setIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 bg-[#0F172A] text-white px-4 py-2 rounded-xl text-[13px] font-bold uppercase tracking-wider hover:bg-slate-800 transition-all"
      >
        <Plus size={16} />
        <span>Adicionar</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-[#1E293B]">Novo Item</h3>
                <button onClick={() => setIsOpen(false)} className="text-[#64748B] hover:text-[#0F172A]">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video rounded-2xl border-2 border-dashed border-[#E2E8F0] bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:border-[#0F172A] transition-all overflow-hidden"
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Camera size={32} className="text-[#CBD5E1] mb-2" />
                        <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Upload de Foto</p>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Título / Meta</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Viagem para o Japão"
                      className="w-full bg-[#F8F9FA] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0F172A]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Ou URL da Imagem</label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="w-full bg-[#F8F9FA] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0F172A]"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#0F172A] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all"
                >
                  Adicionar ao Vision Board
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
