import React, { useState } from 'react';

export function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In this demo, any email/password works to show the app
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 font-sans text-slate-200">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-xl shadow-2xl">
        
        {/* Logo/Icon Area */}
        <div className="text-center">
          <div className="inline-block rounded-2xl bg-cyan-500/10 p-3 mb-4">
            <span className="text-3xl">✈️</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white italic">Traveloop</h1>
          <p className="mt-2 text-slate-400 text-sm">Automated Itinerary & Budgeting</p>
        </div>

        {/* Input Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              placeholder="nirupathunga@srit.ac.in"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 rounded-2xl bg-cyan-600 py-4 font-bold text-white shadow-lg transition hover:bg-cyan-500 hover:shadow-cyan-500/20 active:scale-[0.98]"
          >
            Sign In to Plan
          </button>
        </form>

        {/* Branding Footer */}
        <div className="pt-6 text-center border-t border-slate-800/50">
          <p className="text-[10px] text-slate-500 tracking-[0.2em] uppercase font-bold">
            Innovation Ambassador Prototype
          </p>
        </div>
      </div>
    </div>
  );
}