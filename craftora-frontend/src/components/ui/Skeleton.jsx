export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--parchment)', border: '1px solid var(--sand)' }}>
      <div className="skeleton aspect-square" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-5 w-28 rounded" />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4 rounded"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 12 }) {
  return <div className={`skeleton w-${size} h-${size} rounded-full`} />;
}

export function SkeletonBanner() {
  return (
    <div className="skeleton rounded-3xl h-96 w-full" />
  );
}
