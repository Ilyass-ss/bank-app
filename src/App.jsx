import { useState } from 'react';
import Swal from 'sweetalert2';

const App = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bankBlance, setBankBlance] = useState(1250.00);
  const [receiver, setReceiver] = useState('');
  const [price, setPrice] = useState('');
  const [list, setList] = useState([]);

  const nameRegex = /^[a-zA-Z\s_]{2,30}$/;
  const phoneRegex = /^\d{10}$/;

  const swalConfig = (title, icon, color) => ({
    title,
    icon,
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-[2rem] bg-[#10132E] border border-white/10 text-white shadow-2xl backdrop-blur-xl',
      confirmButton: `bg-${color}-500 hover:bg-${color}-600 text-white font-black py-3 px-8 rounded-xl transition-all uppercase tracking-widest text-[10px]`,
    }
  });

  const handleSignUp = () => {
    if (nameRegex.test(firstName) && nameRegex.test(lastName) && phoneRegex.test(phoneNumber)) {
      const API = `https://69c57d9d8a5b6e2dec2c90c6.mockapi.io/bankapp/users-account`;
      fetch(API)
        .then(res => res.json())
        .then(data => {
          const exists = data.find(u => (u.firstName === firstName && u.lastName === lastName) || u.phoneNumber === phoneNumber);
          if (exists) {
            Swal.fire(swalConfig("Account Exists!", "error", "red"));
            return;
          }
          fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, phoneNumber })
          }).then(() => {
            Swal.fire(swalConfig("Success!", "success", "green"));
            setFirstName(''); setLastName(''); setPhoneNumber('');
          });
        });
    } else {
      Swal.fire(swalConfig("Invalid Rules!", "warning", "orange"));
    }
  };

  const handleSendMoney = () => {
    const amount = Number(price);
    if (!receiver) return Swal.fire(swalConfig("Enter Receiver!", "warning", "orange"));
    if (amount < 1) return Swal.fire(swalConfig("Min 1$ Required", "error", "red"));
    if (amount > bankBlance) return Swal.fire(swalConfig("Insufficient Balance", "error", "red"));

    const TRANSACTION_API = "https://69c57d9d8a5b6e2dec2c90c6.mockapi.io/bankapp/transactions";

    fetch(TRANSACTION_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: receiver,
        price: -amount,
        datetime: new Date().toLocaleString('en-GB')
      })
    })
    .then(res => res.json())
    .then(() => {
      setBankBlance(prev => prev - amount);
      setList(prev => [-amount, ...prev]);
      setReceiver('');
      setPrice('');
      Swal.fire(swalConfig("Transaction Done", "success", "green"));
    })
    .catch(() => {
      Swal.fire(swalConfig("Network Error", "error", "red"));
    });
  };

  return (
    <div className="min-h-screen bg-[#07051F] text-white p-4 md:p-10 font-sans selection:bg-blue-500/30 flex flex-col">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 flex-grow">
        
        <div className="bg-[#10132E]/50 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md self-start">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-8">Create Account</h2>
          <div className="space-y-4">
            <input type="text" placeholder="FIRST NAME" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-[10px] font-bold tracking-widest focus:border-blue-500 focus:outline-none transition-all" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <input type="text" placeholder="LAST NAME" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-[10px] font-bold tracking-widest focus:border-blue-500 focus:outline-none transition-all" value={lastName} onChange={e => setLastName(e.target.value)} />
            <input type="number" placeholder="PHONE NUMBER" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-[10px] font-bold tracking-widest focus:border-blue-500 focus:outline-none transition-all" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
            <button onClick={handleSignUp} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-[10px] shadow-lg shadow-blue-500/20 transition-all active:scale-95">Sign Up Now</button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-60">Total Balance</p>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic">${bankBlance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h1>
            <div className="mt-8 flex justify-between items-center text-[10px] font-bold tracking-widest opacity-80">
              <span>ILYASS VIRTUAL CARD</span>
              <span>04/26</span>
            </div>
          </div>

          <div className="bg-[#10132E]/50 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Quick Transfer
            </h3>
            <div className="grid gap-4">
              <div className="flex gap-2">
                <input type="text" placeholder="RECEIVER NAME" className="flex-grow bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold focus:border-blue-500 focus:outline-none" value={receiver} onChange={e => setReceiver(e.target.value)} />
                <button onClick={() => setReceiver('')} className="px-4 bg-red-500/10 text-red-500 rounded-xl text-[9px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">Clear</button>
              </div>
              <div className="flex gap-2">
                <input type="number" placeholder="AMOUNT $" className="flex-grow bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold focus:border-blue-500 focus:outline-none" value={price} onChange={e => setPrice(e.target.value)} />
                <button onClick={() => setPrice('')} className="px-4 bg-red-500/10 text-red-500 rounded-xl text-[9px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">Clear</button>
              </div>
              <div className="pt-2">
                <button onClick={handleSendMoney} className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Send Money Now</button>
              </div>
            </div>
          </div>

          <div className="bg-[#10132E]/30 rounded-[2rem] p-6 max-h-[300px] overflow-y-auto custom-scrollbar">
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-40">Recent History</h4>
            <div className="space-y-3">
              {list.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 animate-slide-in">
                  <div>
                    <p className={`text-[11px] font-black ${item < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {item > 0 ? `+${item.toFixed(2)}` : `${item.toFixed(2)}`}$
                    </p>
                    <p className="text-[8px] text-white/30 uppercase mt-1 font-bold">Transfer Success</p>
                  </div>
                  <span className="text-[9px] font-mono text-white/20 italic">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-12 mb-6 text-center">
        <p className="text-[10px] font-black tracking-[0.5em] opacity-20 uppercase">© 2026 ILYASS</p>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        @keyframes slide-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;