import React, { useState, useEffect, useRef, useCallback } from 'react';
import Lottie from 'lottie-react';
import { Smile, Angry, Brain } from 'lucide-react';
import catAnimation from './cat.json';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  CAT_SIZE,
  STEP,
  NEED_SPAWN_DELAY,
  NEED_TIMEOUT,
  MOOD_DISPLAY_MS,
  MISSIONS_REQUIRED,
  ZONES,
  pickRandomNeed,
} from './gameConfig';
import MissionMini from './components/MissionMini';
import DrinkRewardScreen from './components/DrinkRewardScreen';
import MovePad from './components/MovePad';

export default function App() {
  const [screen, setScreen] = useState('game');
  const [position, setPosition] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
  const [direction, setDirection] = useState(1);
  const [activeZone, setActiveZone] = useState(null);
  const [needPhase, setNeedPhase] = useState('idle');
  const [currentNeed, setCurrentNeed] = useState(null);
  const [missionCount, setMissionCount] = useState(0);

  const lottieRef = useRef(null);
  const moodTimerRef = useRef(null);
  const spawnTimerRef = useRef(null);
  const timeoutTimerRef = useRef(null);
  const lastNeedZoneRef = useRef(null);
  const rewardScheduledRef = useRef(false);

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

  const showMoodThenReset = useCallback(
    (mood, zoneId) => {
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);

      if (mood === 'happy') {
        setMissionCount((prev) => {
          const next = Math.min(prev + 1, MISSIONS_REQUIRED);
          if (next >= MISSIONS_REQUIRED && prev < MISSIONS_REQUIRED && !rewardScheduledRef.current) {
            rewardScheduledRef.current = true;
            setTimeout(() => setScreen('reward'), MOOD_DISPLAY_MS);
          }
          return next;
        });
      }

      setNeedPhase(mood);
      if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
      moodTimerRef.current = setTimeout(() => resetToIdle(), MOOD_DISPLAY_MS);
    },
    [resetToIdle]
  );

  const moveCat = useCallback((dx, dy) => {
    setPosition((prev) => {
      let newX = prev.x + dx * STEP;
      let newY = prev.y + dy * STEP;

      if (dx < 0) setDirection(-1);
      if (dx > 0) setDirection(1);

      if (newX < CAT_SIZE / 2) newX = CAT_SIZE / 2;
      if (newX > GAME_WIDTH - CAT_SIZE / 2) newX = GAME_WIDTH - CAT_SIZE / 2;
      if (newY < CAT_SIZE / 2) newY = CAT_SIZE / 2;
      if (newY > GAME_HEIGHT - CAT_SIZE / 2) newY = GAME_HEIGHT - CAT_SIZE / 2;

      return { x: newX, y: newY };
    });
  }, []);

  const handlePlayAgain = () => {
    clearMoodTimers();
    rewardScheduledRef.current = false;
    setScreen('game');
    setMissionCount(0);
    setPosition({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
    setDirection(1);
    setActiveZone(null);
    setNeedPhase('idle');
    setCurrentNeed(null);
    lastNeedZoneRef.current = null;
    scheduleNextNeed(NEED_SPAWN_DELAY);
  };

  useEffect(() => {
    if (screen !== 'game') return undefined;
    scheduleNextNeed(NEED_SPAWN_DELAY);
    return () => clearMoodTimers();
  }, [screen, scheduleNextNeed, clearMoodTimers]);

  useEffect(() => {
    if (screen !== 'game' || needPhase !== 'wanting' || !currentNeed) return undefined;

    timeoutTimerRef.current = setTimeout(() => {
      showMoodThenReset('angry', null);
    }, NEED_TIMEOUT);

    return () => {
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    };
  }, [screen, needPhase, currentNeed, showMoodThenReset]);

  useEffect(() => {
    if (screen !== 'game') return undefined;

    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          moveCat(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          moveCat(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          moveCat(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          moveCat(1, 0);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, moveCat]);

  useEffect(() => {
    if (screen !== 'game') return;

    let currentZone = null;
    for (const zone of ZONES) {
      const distance = Math.hypot(position.x - zone.x, position.y - zone.y);
      if (distance < 85) {
        currentZone = zone;
        break;
      }
    }

    setActiveZone(currentZone);

    if (lottieRef.current) {
      if (currentZone?.action === 'playing') {
        lottieRef.current.setSpeed(2);
      } else if (currentZone?.action === 'sleeping') {
        lottieRef.current.setSpeed(0.35);
      } else {
        lottieRef.current.setSpeed(1);
      }
    }
  }, [screen, position]);

  useEffect(() => {
    if (screen !== 'game' || needPhase !== 'wanting' || !currentNeed || !activeZone) return;
    if (activeZone.id === currentNeed.zoneId) {
      showMoodThenReset('happy', activeZone.id);
    }
  }, [screen, needPhase, currentNeed, activeZone, showMoodThenReset]);

  if (screen === 'reward') {
    return <DrinkRewardScreen onPlayAgain={handlePlayAgain} />;
  }

  const bubbleText =
    needPhase === 'wanting'
      ? currentNeed?.thought
      : needPhase === 'happy'
        ? 'Vui lắm~'
        : needPhase === 'angry'
          ? 'Giận rồi!'
          : activeZone?.text;

  const isSleeping = activeZone?.action === 'sleeping';

  return (
    <div className="app-layout">
      <h1>Ngôi Nhà Của Mèo Leora 🏠</h1>

      <div className="game-column">
          <div className={`need-hud need-hud--${needPhase}`}>
            {needPhase === 'idle' && <span>Chờ mèo nghĩ ra nhu cầu tiếp theo...</span>}
            {needPhase === 'wanting' && (
              <>
                <Brain size={20} />
                <span>
                  <b>Mèo đang muốn:</b> {currentNeed?.hint ?? currentNeed?.thought}
                </span>
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

          <div className="game-container" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
            <MissionMini count={missionCount} />

            {isSleeping && <div className="sleep-overlay" aria-hidden />}

            {needPhase === 'wanting' &&
              currentNeed &&
              ZONES.filter((z) => z.id === currentNeed.zoneId).map((z) => (
                <div
                  key={z.id}
                  className={`need-zone-hint ${z.id === 'kitchen' ? 'need-zone-hint--kitchen' : ''}`}
                  style={{ left: z.x, top: z.y }}
                />
              ))}

            <div
              className="cat-anchor"
              style={{ left: `${position.x}px`, top: `${position.y}px` }}
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
                    <div
                      className={`status-text status-text--${needPhase === 'idle' ? 'zone' : needPhase}`}
                    >
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

                {isSleeping && (
                  <div className="sleep-zzz" aria-hidden>
                    <span className="zzz zzz-1">Z</span>
                    <span className="zzz zzz-2">z</span>
                    <span className="zzz zzz-3">Z</span>
                  </div>
                )}

                <div
                  className={`cat-sprite ${activeZone ? `action-${activeZone.action}` : ''} ${needPhase === 'angry' ? 'mood-angry' : ''} ${needPhase === 'happy' ? 'mood-happy' : ''}`}
                  style={{ '--facing': direction }}
                >
                  <Lottie
                    lottieRef={lottieRef}
                    animationData={catAnimation}
                    loop
                    style={{
                      width: '100%',
                      height: '100%',
                      filter:
                        'sepia(0.45) saturate(1.8) hue-rotate(8deg) brightness(1.2) contrast(1.02)',
                    }}
                  />
                </div>
              </div>
            </div>

            <MovePad onMove={moveCat} />
          </div>

          <p className="instructions">
            Dùng <b>W, A, S, D</b> hoặc <b>phím mũi tên</b> bên dưới để di chuyển mèo. Hoàn thành{' '}
            <b>5 nhiệm vụ</b> để mở hộp quà bất ngờ!
          </p>
        </div>
    </div>
  );
}
