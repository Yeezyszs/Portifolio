import { Badge } from '../ui/index.jsx';

// Agrupa as skills por categoria e renderiza badges.
export function SkillsSection({ skills }) {
  if (!skills?.length) return null;

  const byCategory = skills.reduce((acc, s) => {
    const key = s.category || 'Outras';
    (acc[key] ||= []).push(s);
    return acc;
  }, {});

  return (
    <section className="py-6">
      <h2 className="text-lg font-semibold mb-4">Skills</h2>
      <div className="flex flex-col gap-4">
        {Object.entries(byCategory).map(([category, items]) => (
          <div key={category}>
            <p className="text-xs uppercase tracking-wide text-text-muted mb-2">{category}</p>
            <div className="flex flex-wrap gap-2">
              {items.map((s) => (
                <Badge key={s.id}>{s.name}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
