import { useState, useEffect, useMemo } from 'react';
import Confetti from 'react-confetti';
import { DRINKS, getGiftSurpriseDate, getGiftPageTitle } from '../gameConfig';

export default function DrinkRewardScreen({ onPlayAgain }) {
  const [openingId, setOpeningId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [windowSize, setWindowSize] = useState({ w: 800, h: 600 });

  const surpriseDate = useMemo(() => getGiftSurpriseDate(), []);
  const pageTitle = useMemo(() => getGiftPageTitle(surpriseDate), [surpriseDate]);

  useEffect(() => {
    const update = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const openBox = (drink) => {
    if (openingId || selected) return;
    setOpeningId(drink.id);
    setTimeout(() => {
      setSelected(drink);
      setOpeningId(null);
    }, 650);
  };

  return (
    <div className="reward-screen">
      {selected && (
        <Confetti
          width={windowSize.w}
          height={windowSize.h}
          recycle={false}
          numberOfPieces={160}
          colors={['#f4c430', '#fff9e6', '#ffffff', '#d4a017']}
        />
      )}

      <div className="reward-screen__card reward-screen__card--gift">
        <p className="reward-screen__badge">Phần thưởng</p>
        <h1 className="reward-screen__title-letter">{pageTitle}</h1>

        {!selected ? (
          <div className="gift-phase gift-phase--pick">
            <p className="gift-phase__pick-hint">
              Hộp quà trống — mở một hộp để biết ly nước Leora pha cho bạn!
            </p>
            <div className="gift-box-grid">
              {DRINKS.map((drink) => {
                const isOpening = openingId === drink.id;
                const isDisabled = Boolean(openingId && !isOpening);
                return (
                  <button
                    key={drink.id}
                    type="button"
                    className={`gift-box gift-box--mini ${isOpening ? 'gift-box--opening' : ''} ${isDisabled ? 'gift-box--disabled' : ''}`}
                    onClick={() => openBox(drink)}
                    disabled={isDisabled}
                    aria-label="Mở hộp quà"
                  >
                    <span className="gift-box__ribbon">🎀</span>
                    <span className="gift-box__lid" />
                    <span className="gift-box__body">
                      <span className="gift-box__emoji">🎁</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="gift-phase gift-phase--revealed">
            <div className="gift-box gift-box--mini gift-box--open gift-box--revealed-drink">
              <span className="gift-box__lid gift-box__lid--open" />
              <span className="gift-box__body gift-box__body--open">
                <span className="gift-reveal-drink">
                  <span className="gift-reveal-drink__emoji">{selected.emoji}</span>
                  <strong>{selected.name}</strong>
                  <span className="gift-reveal-drink__desc">{selected.desc}</span>
                </span>
              </span>
            </div>
            <p className="reward-screen__chosen">
              Bạn chọn: <b>{selected.emoji} {selected.name}</b> — ngon lắm!
            </p>
            <button type="button" className="reward-screen__btn" onClick={onPlayAgain}>
              Chơi lại từ đầu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
