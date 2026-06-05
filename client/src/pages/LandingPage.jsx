import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui/index.jsx';

const steps = [
  { n: '1', title: 'Crie sua conta', desc: 'Cadastre-se com email e escolha seu username.' },
  { n: '2', title: 'Adicione projetos', desc: 'Liste seus trabalhos, skills e links.' },
  { n: '3', title: 'Compartilhe', desc: 'Seu portfólio fica em devfolio.app/u/seu-user.' },
];

export function LandingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      {/* Hero */}
      <section className="py-20 text-center flex flex-col items-center gap-6">
        <h1 className="text-4xl sm:text-5xl font-bold max-w-2xl leading-tight">
          Seu portfólio de programador, <span className="text-brand">do seu jeito</span>.
        </h1>
        <p className="text-text-muted max-w-xl text-lg">
          Uma plataforma onde cada dev monta sua própria vitrine de projetos. Cadastre-se,
          adicione seus trabalhos e compartilhe um único link.
        </p>
        <div className="flex gap-3">
          <Link to="/signup">
            <Button className="px-6 py-3">Criar meu portfólio</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="px-6 py-3">
              Já tenho conta
            </Button>
          </Link>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-12">
        <h2 className="text-center text-2xl font-semibold mb-8">Como funciona</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {steps.map((s) => (
            <Card key={s.n} className="flex flex-col gap-2">
              <span className="text-brand text-2xl font-bold">{s.n}</span>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-text-muted">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
