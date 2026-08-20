import { useState } from 'react';
import { signOut, sendEmailVerification, reload } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { auth } from '../services/firebase';

export default function VerifyEmail() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const checkVerification = async () => {
    setMessage('');
    setError('');

    try {
      await reload(auth.currentUser);
      if (auth.currentUser.emailVerified) {
        navigate('/home');
        return;
      }
      setError('O e-mail ainda não foi verificado. Abra o link recebido e tente novamente.');
    } catch {
      setError('Não foi possível verificar o e-mail agora. Tente novamente.');
    }
  };

  const resendVerification = async () => {
    setMessage('');
    setError('');

    try {
      await sendEmailVerification(auth.currentUser);
      setMessage('E-mail de verificação reenviado. Confira sua caixa de entrada.');
    } catch {
      setError('Não foi possível reenviar o e-mail. Aguarde um pouco e tente novamente.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md p-8 bg-white border border-slate-200 rounded-xl shadow-2xl space-y-6 text-center">
        <MailCheck className="mx-auto w-12 h-12 text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Verifique seu e-mail</h1>
          <p className="mt-2 text-sm text-slate-600">
            Enviamos um link de confirmação para <strong>{auth.currentUser?.email}</strong>.
          </p>
        </div>

        {message && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-sm">{message}</div>}
        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">{error}</div>}

        <div className="space-y-3">
          <button
            type="button"
            onClick={checkVerification}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all cursor-pointer"
          >
            Já verifiquei meu e-mail
          </button>
          <button
            type="button"
            onClick={resendVerification}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-all cursor-pointer"
          >
            Reenviar e-mail
          </button>
          <button type="button" onClick={handleLogout} className="text-sm text-indigo-600 hover:underline cursor-pointer">
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}