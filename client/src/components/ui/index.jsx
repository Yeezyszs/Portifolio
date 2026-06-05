import { cn } from '../../lib/utils.js';

// Conjunto de primitivos de UI minimalistas, reunidos num arquivo para
// manter o boilerplate baixo. Todos aceitam className para extensão.

export function Button({ variant = 'primary', className, ...props }) {
  const variants = {
    primary: 'bg-brand hover:bg-brand-hover text-white',
    ghost: 'bg-transparent hover:bg-surface-2 text-text',
    outline: 'border border-border hover:bg-surface-2 text-text',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function Input({ className, label, error, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-sm text-text-muted">{label}</span>}
      <input
        className={cn(
          'rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-brand',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  );
}

export function Textarea({ className, label, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-sm text-text-muted">{label}</span>}
      <textarea
        className={cn(
          'min-h-24 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-brand',
          className
        )}
        {...props}
      />
    </label>
  );
}

export function Card({ className, ...props }) {
  return (
    <div
      className={cn('rounded-card border border-border bg-surface p-5', className)}
      {...props}
    />
  );
}

export function Badge({ children, color, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium',
        className
      )}
      style={color ? { borderColor: color, color } : undefined}
    >
      {children}
    </span>
  );
}

export function Avatar({ src, name = '', size = 48 }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return src ? (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className="flex items-center justify-center rounded-full bg-surface-2 text-text-muted font-semibold"
      style={{ width: size, height: size, fontSize: size / 2.5 }}
    >
      {initials || '?'}
    </div>
  );
}

export function Spinner({ className }) {
  return (
    <div
      className={cn(
        'h-6 w-6 animate-spin rounded-full border-2 border-border border-t-brand',
        className
      )}
    />
  );
}
