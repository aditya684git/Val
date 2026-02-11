import { useEffect, useState } from "react";

interface BurstHeart {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

const HeartBurst = () => {
  const [hearts, setHearts] = useState<BurstHeart[]>([]);

  useEffect(() => {
    const burst: BurstHeart[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: 30 + Math.random() * 40,
      size: 16 + Math.random() * 30,
      duration: 1.5 + Math.random() * 1.5,
      delay: Math.random() * 0.8,
    }));
    setHearts(burst);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="burst-heart"
          style={{
            left: `${h.left}%`,
            bottom: "30%",
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {["❤️", "💕", "💖", "💗", "💘"][h.id % 5]}
        </div>
      ))}
    </div>
  );
};

export default HeartBurst;
