import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Button, Card, Input } from '../../components/ui/index.jsx';

const USERNAME_RE = /^[a-z0-9-]{3,30}$/;

export function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!USERNAME_RE.test(form.username)) {
      setError('Username: 3-30 caracteres, apenas minúsculas, números e hífens.');
      return;
    }
    setLoading(true);
    try {
      await signUp(form);
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16">
        <Card className="text-center">
          <h1 className="text-xl font-bold mb-2">Quase lá! ✉️</h1>
          <p className="text-text-muted mb-6">
            Enviamos um email de confirmação para <strong>{form.email}</strong>. Confirme para
            ativar sua conta.
          </p>
          <Button onClick={() => navigate('/login')}>Ir para o login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <Card>
        <h1 className="text-xl font-bold mb-1">Criar portfólio</h1>
        <p className="text-sm text-text-muted mb-6">Leva menos de um minuto.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nome completo"
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
          <Input
            label="Username (sua URL: /u/...)"
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })}
          />
          <Input
            type="email"
            label="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            type="password"
            label="Senha (mín. 6 caracteres)"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Criando...' : 'Criar conta'}
          </Button>
        </form>
        <p className="text-sm text-text-muted mt-4 text-center">
          Já tem conta?{' '}
          <Link to="/login" className="text-brand">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
