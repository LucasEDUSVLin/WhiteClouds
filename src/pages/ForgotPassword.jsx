import { useState } from 'react';
import { auth } from '../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('E-mail de redefinição enviado! Verifique sua caixa de entrada.');
    } catch {
      setError('Erro ao enviar e-mail. Verifique se o endereço está correto.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md p-8 bg-white border border-slate-200 rounded-xl shadow-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-600 tracking-wider">WhiteClouds</h1>
        <p className="text-sm text-center text-slate-600">Recuperar acesso à conta</p>

        {message && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-sm text-center">{message}</div>}
        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm text-center">{error}</div>}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="text-xs text-slate-600">E-mail cadastrado</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all cursor-pointer"
          >
            Enviar E-mail de Recuperação
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs text-indigo-600 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}
