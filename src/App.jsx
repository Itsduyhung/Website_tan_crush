import React, { useState, useEffect, useRef, useCallback } from 'react';
import Lottie from 'lottie-react';
import { Smile, Angry, Brain } from 'lucide-react';
import catAnimation from './cat.json';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const CAT_SIZE = 100;
const STEP = 20;

const NEED_SPAWN_DELAY = 4000;
const NEED_TIMEOUT = 14000;
const MOOD_DISPLAY_MS = 3200;

const ZONES = [
  { id: 'kitchen', x: 150, y: 150, action: 'eating', text: 'Măm măm 🐟' },
  { id: 'play_area', x: 650, y: 150, action: 'playing', text: 'Chơi đùa nàoo 🧶' },
  { id: 'living_room', x: 150, y: 450, action: 'watching_tv', text: 'Coi phim thui 📺' },
  { id: 'bedroom', x: 650, y: 450, action: 'sleeping', text: 'Zzz... 💤' }
];

const CAT_NEEDS = [
  { zoneId: 'kitchen', thought: 'Đói! → Bếp ăn', hint: 'Đói bụng quá — đưa tớ đến bếp ăn!' },
  { zoneId: 'play_area', thought: 'Chơi đi! → Khu vui chơi', hint: 'Muốn chơi đùa — đến khu vui chơi nhé!' },
  { zoneId: 'living_room', thought: 'TV đi! → Phòng khách', hint: 'Nhàm chán — coi TV ở phòng khách!' },
  { zoneId: 'bedroom', thought: 'Ngủ! → Giường', hint: 'Buồn ngủ rồi — đưa tớ lên giường!' }
];

function pickRandomNeed(excludeZoneId = null) {
  const pool = excludeZoneId
    ? CAT_NEEDS.filter((n) => n.zoneId !== excludeZoneId)
    : CAT_NEEDS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function App() {
  // Tọa độ là tâm điểm của mèo
  const [position, setPosition] = useState({
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2
  });
  
  const [direction, setDirection] = useState(1);
  const [activeZone, setActiveZone] = useState(null);
  const [needPhase, setNeedPhase] = useState('idle'); // idle | wanting | happy | angry
  const [currentNeed, setCurrentNeed] = useState(null);

  const lottieRef = useRef(null);
  const moodTimerRef = useRef(null);
  const spawnTimerRef = useRef(null);
  const timeoutTimerRef = useRef(null);
  const lastNeedZoneRef = useRef(null);

  const clearMoodTimers = useCallback(() => {
    if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    moodTimerRef.current = null;
    spawnTimerRef.current = null;
    timeoutTimerRef.current = null;
  }, []);

  const scheduleNextNeed = useCallback((delay = NEED_SPAWN_DELAY) => {
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    spawnTimerRef.current = setTimeout(() => {
      const need = pickRandomNeed(lastNeedZoneRef.current);
      lastNeedZoneRef.current = need.zoneId;
      setCurrentNeed(need);
      setNeedPhase('wanting');
    }, delay);
  }, []);

  const resetToIdle = useCallback((nextDelay = NEED_SPAWN_DELAY) => {
    setNeedPhase('idle');
    setCurrentNeed(null);
    scheduleNextNeed(nextDelay);
  }, [scheduleNextNeed]);

  const showMoodThenReset = useCallback((mood) => {
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    setNeedPhase(mood);
    if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
    moodTimerRef.current = setTimeout(() => resetToIdle(), MOOD_DISPLAY_MS);
  }, [resetToIdle]);

  useEffect(() => {
    scheduleNextNeed(NEED_SPAWN_DELAY);
    return () => clearMoodTimers();
  }, [scheduleNextNeed, clearMoodTimers]);

  useEffect(() => {
    if (needPhase !== 'wanting' || !currentNeed) return;

    timeoutTimerRef.current = setTimeout(() => {
      showMoodThenReset('angry');
    }, NEED_TIMEOUT);

    return () => {
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    };
  }, [needPhase, currentNeed, showMoodThenReset]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      setPosition((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        switch (e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            newY -= STEP;
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            newY += STEP;
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            newX -= STEP;
            setDirection(-1);
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            newX += STEP;
            setDirection(1);
            break;
          default:
            break;
        }

        // Chặn biên
        if (newX < CAT_SIZE / 2) newX = CAT_SIZE / 2;
        if (newX > GAME_WIDTH - CAT_SIZE / 2) newX = GAME_WIDTH - CAT_SIZE / 2;
        if (newY < CAT_SIZE / 2) newY = CAT_SIZE / 2;
        if (newY > GAME_HEIGHT - CAT_SIZE / 2) newY = GAME_HEIGHT - CAT_SIZE / 2;

        return { x: newX, y: newY };
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Xử lý logic mỗi khi mèo di chuyển (Kiểm tra xem mèo có vào Zone không)
  useEffect(() => {
    let currentZone = null;
    
    for (const zone of ZONES) {
      // Tính khoảng cách từ tâm mèo đến tâm zone (Hypotenuse)
      const distance = Math.hypot(position.x - zone.x, position.y - zone.y);
      if (distance < 85) { // Bán kính nhận diện
        currentZone = zone;
        break;
      }
    }

    setActiveZone(currentZone);

    // Tương tác trực tiếp với Lottie (Ví dụ: Đổi tốc độ phát)
    if (lottieRef.current) {
      if (currentZone?.action === 'playing') {
        lottieRef.current.setSpeed(2); // Chơi thì tua nhanh gấp đôi
      } else if (currentZone?.action === 'sleeping') {
        lottieRef.current.setSpeed(0.5); // Ngủ thì thở chậm lại
      } else {
        lottieRef.current.setSpeed(1); // Bình thường
      }
    }

  }, [position]);

  useEffect(() => {
    if (needPhase !== 'wanting' || !currentNeed || !activeZone) return;
    if (activeZone.id === currentNeed.zoneId) {
      showMoodThenReset('happy');
    }
  }, [needPhase, currentNeed, activeZone, showMoodThenReset]);

  const bubbleText =
    needPhase === 'wanting'
      ? currentNeed?.thought
      : needPhase === 'happy'
        ? 'Vui lắm~'
        : needPhase === 'angry'
          ? 'Giận rồi!'
          : activeZone?.text;

  return (
    <div className="app-layout">
      <h1>Ngôi Nhà Của Mèo Leora 🏠</h1>

      <div className={`need-hud need-hud--${needPhase}`}>
        {needPhase === 'idle' && <span>Chờ mèo nghĩ ra nhu cầu tiếp theo...</span>}
        {needPhase === 'wanting' && (
          <>
            <Brain size={20} />
            <span><b>Mèo đang muốn:</b> {currentNeed?.hint ?? currentNeed?.thought}</span>
          </>
        )}
        {needPhase === 'happy' && (
          <>
            <Smile size={20} />
            <span>Đáp ứng đúng — mèo rất vui!</span>
          </>
        )}
        {needPhase === 'angry' && (
          <>
            <Angry size={20} />
            <span>Đợi quá lâu — mèo giận rồi!</span>
          </>
        )}
      </div>

      <div 
        className="game-container" 
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {needPhase === 'wanting' && currentNeed && ZONES.filter((z) => z.id === currentNeed.zoneId).map((z) => (
          <div key={z.id} className="need-zone-hint" style={{ left: z.x, top: z.y }} />
        ))}

        <div 
          className="cat-anchor"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          {(bubbleText || needPhase === 'wanting') && (
            <div className="cat-ui-layer">
              {needPhase === 'wanting' && (
                <div className="need-timer-bar" key={currentNeed?.zoneId}>
                  <div
                    className="need-timer-fill"
                    style={{ animationDuration: `${NEED_TIMEOUT}ms` }}
                  />
                </div>
              )}
              {bubbleText && (
                <div className={`status-text status-text--${needPhase === 'idle' ? 'zone' : needPhase}`}>
                  {bubbleText}
                </div>
              )}
            </div>
          )}

          <div className="cat-body">
          {needPhase !== 'idle' && (
            <div className={`mood-badge mood-badge--${needPhase}`}>
              {needPhase === 'wanting' && <Brain size={22} strokeWidth={2.5} />}
              {needPhase === 'happy' && <Smile size={22} strokeWidth={2.5} />}
              {needPhase === 'angry' && <Angry size={22} strokeWidth={2.5} />}
            </div>
          )}

            <div
            className={`cat-sprite ${activeZone ? `action-${activeZone.action}` : ''} ${needPhase === 'angry' ? 'mood-angry' : ''} ${needPhase === 'happy' ? 'mood-happy' : ''}`}
            style={{ '--facing': direction }}
          >
            <Lottie 
              lottieRef={lottieRef}
              animationData={catAnimation} 
              loop={true} 
              style={{ 
                width: '100%', 
                height: '100%',
                filter: 'sepia(1) saturate(300%) hue-rotate(-15deg) brightness(1.05)'
              }}
            />
          </div>
          </div>
        </div>
      </div>

      <p className="instructions">
        Dùng <b>W, A, S, D</b> để di chuyển mèo. Đọc suy nghĩ của mèo, đưa tới đúng khu vực trước khi hết thời gian — đúng thì <b>vui</b>, trễ thì <b>giận</b>!
      </p>
    </div>
  );
}
