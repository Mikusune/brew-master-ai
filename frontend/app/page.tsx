'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Coffee, Beaker, BrainCircuit, RotateCcw, Droplets, Scale, Thermometer, History } from 'lucide-react';

export default function Home() {
  // State Form Lengkap
  const [method, setMethod] = useState('V60');
  const [bean, setBean] = useState('');
  const [weight, setWeight] = useState('');
  const [water, setWater] = useState('');
  const [roast, setRoast] = useState('Medium');
  const [grind, setGrind] = useState('Medium-Fine');
  const [temp, setTemp] = useState('');
  const [notes, setNotes] = useState('');
  
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [brewHistory, setBrewHistory] = useState([]);

  // Ambil Data Riwayat
  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/history');
      setBrewHistory(res.data);
    } catch (err) { console.error("Gagal ambil history", err); }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/analyze-brew', {
        method, bean_name: bean, bean_weight: parseInt(weight),
        water_amount: parseInt(water), roast_level: roast,
        grind_size: grind, water_temp: parseInt(temp), notes
      });
      setAdvice(response.data.advice);
      fetchHistory(); // Update tabel setelah simpan
    } catch (error) { setAdvice('Error: Pastikan Backend & LM Studio aktif.'); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-[#FAF3E0] p-4 md:p-10 text-[#4A2C2A] font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* --- FORM INPUT --- */}
          <section className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E6DCC3] shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Coffee className="w-8 h-8 text-[#6F4E37]" />
              <h1 className="text-2xl font-black">BrewMaster Log</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[#8D6E63]">Metode</label>
                  <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full p-3 rounded-xl border border-[#E6DCC3] bg-white">
                    <option>V60</option><option>Aeropress</option><option>French Press</option><option>Moka Pot</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#8D6E63]">Biji Kopi</label>
                  <input type="text" value={bean} onChange={(e) => setBean(e.target.value)} placeholder="Gayo Aceh" className="w-full p-3 rounded-xl border border-[#E6DCC3]"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[#8D6E63]">Kopi (Gram)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="15" className="w-full p-3 rounded-xl border border-[#E6DCC3]"/>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#8D6E63]">Air (Ml)</label>
                  <input type="number" value={water} onChange={(e) => setWater(e.target.value)} placeholder="225" className="w-full p-3 rounded-xl border border-[#E6DCC3]"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[#8D6E63]">Roast Level</label>
                  <select value={roast} onChange={(e) => setRoast(e.target.value)} className="w-full p-3 rounded-xl border border-[#E6DCC3] bg-white">
                    <option>Light</option><option>Medium</option><option>Dark</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#8D6E63]">Suhu (°C)</label>
                  <input type="number" value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="92" className="w-full p-3 rounded-xl border border-[#E6DCC3]"/>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#8D6E63]">Ukuran Gilingan</label>
                <input type="text" value={grind} onChange={(e) => setGrind(e.target.value)} placeholder="Medium-Fine (Klik Command)" className="w-full p-3 rounded-xl border border-[#E6DCC3]"/>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#8D6E63]">Catatan Rasa</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Terlalu pahit..." rows={3} className="w-full p-3 rounded-xl border border-[#E6DCC3]"></textarea>
              </div>

              <button disabled={loading} className="w-full p-4 bg-[#6F4E37] text-white rounded-2xl font-bold hover:bg-[#4A2C2A] transition-all">
                {loading ? 'Menganalisis...' : 'Analisis & Simpan'}
              </button>
            </form>
          </section>

          {/* --- OUTPUT AI --- */}
          <section className="bg-[#F0F4F2] p-8 rounded-3xl border border-[#D5E1D9] shadow-inner relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 border-b border-[#D5E1D9] pb-4">
              <BrainCircuit className="w-8 h-8 text-[#4E7D63]" />
              <h2 className="text-2xl font-black text-[#2D4A3A]">Saran Barista AI</h2>
            </div>
            <div className="text-[#3E2723] whitespace-pre-line leading-relaxed italic">
              {advice || "Belum ada analisis. Seduh kopimu dan masukkan datanya!"}
            </div>
          </section>
        </div>

        {/* --- TABEL RIWAYAT --- */}
        <section className="bg-white/50 p-8 rounded-3xl border border-[#E6DCC3]">
          <div className="flex items-center gap-3 mb-6">
            <History className="w-6 h-6" />
            <h2 className="text-xl font-bold">Riwayat Seduhan</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[#8D6E63] border-b border-[#E6DCC3]">
                  <th className="pb-4 px-2">Tanggal</th>
                  <th className="pb-4 px-2">Biji & Metode</th>
                  <th className="pb-4 px-2">Ratio</th>
                  <th className="pb-4 px-2">Detail</th>
                  <th className="pb-4 px-2">Saran AI</th>
                </tr>
              </thead>
              <tbody>
                {brewHistory.map((item: any) => (
                  <tr key={item.id} className="border-b border-[#E6DCC3]/50 hover:bg-white/40 transition-all text-sm">
                    <td className="py-4 px-2">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-2 font-bold">{item.bean_name} <br/><span className="text-xs font-normal text-[#8D6E63]">{item.method}</span></td>
                    <td className="py-4 px-2">{item.bean_weight}g / {item.water_amount}ml</td>
                    <td className="py-4 px-2 text-xs capitalize">{item.roast_level} Roast<br/>{item.grind_size}</td>
                    <td className="py-4 px-2 italic text-xs text-[#5D4037] truncate max-w-[200px]">{item.advice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}