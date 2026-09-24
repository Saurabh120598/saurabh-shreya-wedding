import { useEffect, useState } from 'react';

interface Petal {
  id: number;
  x: number;
  size: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  delay: number;
}

export function PetalRain({ active }: { active: boolean }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (!active) {
      setPetals([]);
      return;
    }

    const colors = ['#FFCCD5', '#FFE5EC', '#FFB3C6', '#F8BBD0', '#FDE2E4'];
    const generated: Petal[] = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 10 + Math.random() * 14,
      speed: 8 + Math.random() * 7,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 80,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 5,
    }));
    setPetals(generated);
  }, [active]);

  if (!active || petals.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden" aria-hidden="true">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute opacity-70 will-change-transform"
          style={{
            left: `${petal.x}%`,
            top: '-30px',
            animation: `fall ${petal.speed}s linear infinite`,
            animationDelay: `${petal.delay}s`,
          }}
        >
          <svg
            width={petal.size}
            height={petal.size * 1.3}
            viewBox="0 0 30 40"
            fill="none"
            style={{
              transform: `rotate(${petal.rotation}deg)`,
              filter: 'drop-shadow(0 2px 4px rgba(255, 182, 193, 0.4))',
            }}
          >
            <path
              d="M15 0 C25 10, 30 25, 15 40 C0 25, 5 10, 15 0 Z"
              fill={petal.color}
              opacity="0.85"
            />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg) translateX(0);
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(25px);
          }
          100% {
            transform: translateY(105vh) rotate(360deg) translateX(-15px);
          }
        }
      `}</style>
    </div>
  );
}
