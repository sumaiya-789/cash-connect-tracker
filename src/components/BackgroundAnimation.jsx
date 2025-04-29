import React, { useEffect, useState } from 'react';

const BackgroundAnimation = () => {
  const [particles, setParticles] = useState([]);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1000,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    const newParticles = [];
    const numParticles = Math.min(Math.floor(windowSize.width / 60), 25);

    const gradients = [
      'bg-gradient-to-r from-red-500 to-orange-400',
      'bg-gradient-to-r from-yellow-400 to-pink-500',
      'bg-gradient-to-r from-green-400 to-lime-300',
      'bg-gradient-to-r from-blue-400 to-indigo-500',
      'bg-gradient-to-r from-purple-500 to-pink-400',
      'bg-gradient-to-r from-cyan-400 to-blue-300',
      'bg-gradient-to-r from-emerald-400 to-teal-300',
      'bg-gradient-to-r from-violet-500 to-fuchsia-400',
    ];

    for (let i = 0; i < numParticles; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * windowSize.width,
        y: Math.random() * windowSize.height,
        size: Math.random() * 40 + 30,
        variant: Math.floor(Math.random() * 4) + 1,
        color: gradients[Math.floor(Math.random() * gradients.length)],
        speed: Math.random() * 5 + 10,
      });
    }

    setParticles(newParticles);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [windowSize.width, windowSize.height]);

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      <div className="absolute inset-0 bg-gradient-radial from-teal-50 via-blue-50 to-purple-50/30 opacity-90"></div>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${particle.color}`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            filter: 'blur(6px)',
            opacity: 0.7,
            animation: `
              particle-move-${particle.variant} ${particle.speed + 2}s ease-in-out infinite ${particle.id % 5}s,
              pulse-soft 3s ease-in-out infinite ${particle.id % 7}s
            `,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation;
