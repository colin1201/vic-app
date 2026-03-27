import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Family() {
  const { members, addMember } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Guy');
  const [bDay, setBDay] = useState('');
  const [bMonth, setBMonth] = useState('1');
  const [error, setError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required'); return; }
    if (!bDay || Number(bDay) < 1 || Number(bDay) > 31) { setError('Valid birthday is required'); return; }
    addMember({ name: name.trim(), gender, birthday_day: Number(bDay), birthday_month: Number(bMonth) });
    setName(''); setBDay(''); setBMonth('1'); setError('');
  };

  const guys = members.filter(m => m.gender === 'Guy');
  const girls = members.filter(m => m.gender === 'Girl');

  return (
    <div className="min-h-svh px-5 py-5">
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => navigate('/')} className="text-earth-light text-sm">←</button>
        <h1 className="font-title text-xl text-earth-dark font-semibold">The Family</h1>
      </div>

      <div className="bg-warm-card rounded-2xl p-4 mb-5 shadow-sm border border-warm-border">
        <form onSubmit={handleAdd} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-full bg-warm-bg border border-warm-border text-xs placeholder-earth-light/50 focus:outline-none focus:ring-2 focus:ring-dusty-pink/30" />
            <select value={gender} onChange={(e) => setGender(e.target.value)}
              className="px-2 py-1.5 rounded-full bg-warm-bg border border-warm-border text-xs focus:outline-none focus:ring-2 focus:ring-dusty-pink/30">
              <option value="Guy">Guy</option>
              <option value="Girl">Girl</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-earth-light">Birthday:</span>
            <input type="number" min="1" max="31" placeholder="Day" value={bDay} onChange={(e) => setBDay(e.target.value)}
              className="w-12 px-2 py-1 rounded-full bg-warm-bg border border-warm-border text-[10px] text-center focus:outline-none focus:ring-2 focus:ring-dusty-pink/30" />
            <select value={bMonth} onChange={(e) => setBMonth(e.target.value)}
              className="px-2 py-1 rounded-full bg-warm-bg border border-warm-border text-[10px] focus:outline-none focus:ring-2 focus:ring-dusty-pink/30">
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <button type="submit" className="ml-auto px-4 py-1.5 rounded-full bg-forest text-white font-medium text-[10px] hover:bg-forest-dark transition-colors shadow-sm whitespace-nowrap">
              + Add
            </button>
          </div>
          {error && <p className="text-dusty-pink text-[10px] px-1">{error}</p>}
        </form>
      </div>

      <div className="mb-5">
        <h2 className="text-[10px] font-semibold text-earth-light uppercase tracking-widest mb-2 px-1">Guys</h2>
        <div className="flex flex-wrap gap-1.5">
          {guys.map((m) => (
            <button key={m.id} onClick={() => navigate(`/family/${m.id}`)}
              className="px-3 py-1 rounded-full bg-warm-card border border-warm-border text-[11px] text-earth shadow-sm hover:border-dusty-pink hover:shadow-md transition-all">
              {m.name}
            </button>
          ))}
          {guys.length === 0 && <p className="text-[10px] text-earth-light/50 px-1">No members yet</p>}
        </div>
      </div>

      <div className="mb-5">
        <h2 className="text-[10px] font-semibold text-earth-light uppercase tracking-widest mb-2 px-1">Girls</h2>
        <div className="flex flex-wrap gap-1.5">
          {girls.map((m) => (
            <button key={m.id} onClick={() => navigate(`/family/${m.id}`)}
              className="px-3 py-1 rounded-full bg-warm-card border border-warm-border text-[11px] text-earth shadow-sm hover:border-dusty-pink hover:shadow-md transition-all">
              {m.name}
            </button>
          ))}
          {girls.length === 0 && <p className="text-[10px] text-earth-light/50 px-1">No members yet</p>}
        </div>
      </div>
    </div>
  );
}
