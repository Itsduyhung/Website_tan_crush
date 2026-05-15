import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { DRINKS, GIFT_SURPRISE_DATE, GIFT_LETTER_MESSAGE } from '../gameConfig';

export default function DrinkRewardScreen({ onPlayAgain }) {
  const [phase, setPhase] = useState('intro'); // intro | closed | opening | revealed | drinks
  const [selected, setSelected] = useState(null);
  const [windowSize, setWindowSize] = useState({ w: 800, h: 600 });

  useEffect(() => {
    const update = () =>
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const openGift = () => {
    setPhase('opening');
    setTimeout(() => setPhase('revealed'), 700);
  };

  const showDrinks = () => setPhase('drinks');

  return (
    <div className="reward-screen">
      {phase === 'revealed' || phase === 'drinks' ? (
        <Confetti
          width={windowSize.w}
          height={windowSize.h}
          recycle={false}
          numberOfPieces={180}
          colors={['#f4c430', '#fff9e6', '#ffffff', '#d4a017']}
        />
      ) : null}

      <div className="reward-screen__card reward-screen__card--gift">
        {phase === 'intro' && (
          <div className="gift-phase gift-phase--intro">
            <div className="mascot-host">
              <div className="mascot-host__avatar" aria-hidden>
                <span className="mascot-host__face">👩</span>
                <span className="mascot-host__bow">🎀</span>
              </div>
              <div className="mascot-host__bubble">
                <p className="mascot-host__thanks">Cảm ơn bạn đã chăm sóc Leora thật tốt!</p>
                <p>
                  Mình là <b>bà Leora</b> — chủ nhà này. Bạn đã hoàn thành 5 nhiệm vụ, xin mời bạn
                  nhận <b>hộp quà bất ngờ</b> nhé!
                </p>
              </div>
            </div>
            <button type="button" className="reward-screen__btn" onClick={() => setPhase('closed')}>
              Nhận quà 🎁
            </button>
          </div>
        )}

        {(phase === 'closed' || phase === 'opening') && (
          <div className="gift-phase gift-phase--box">
            <p className="gift-phase__hint">Hộp quà đang được đóng gói kỹ — mở ra mới biết bên trong!</p>
            <button
              type="button"
              className={`gift-box ${phase === 'opening' ? 'gift-box--opening' : ''}`}
              onClick={phase === 'closed' ? openGift : undefined}
              disabled={phase === 'opening'}
              aria-label="Mở hộp quà"
            >
              <span className="gift-box__ribbon">🎀</span>
              <span className="gift-box__lid" />
              <span className="gift-box__body">
                <span className="gift-box__emoji">🎁</span>
              </span>
              {phase === 'closed' && (
                <span className="gift-box__tap">Chạm để mở</span>
              )}
            </button>
            {phase === 'closed' && (
              <button type="button" className="reward-screen__btn reward-screen__btn--secondary" onClick={openGift}>
                Mở hộp quà
              </button>
            )}
          </div>
        )}

        {phase === 'revealed' && (
          <div className="gift-phase gift-phase--revealed">
            <div className="gift-box gift-box--open" aria-hidden>
              <span className="gift-box__lid gift-box__lid--open" />
              <span className="gift-box__body gift-box__body--open">
                <span className="gift-letter">
                  <span className="gift-letter__sparkle">✨</span>
                  <p className="gift-letter__date">Ngày {GIFT_SURPRISE_DATE}</p>
                  <p className="gift-letter__text">{GIFT_LETTER_MESSAGE}</p>
                  <p className="gift-letter__sign">— Bà Leora 🏠</p>
                </span>
              </span>
            </div>
            <button type="button" className="reward-screen__btn" onClick={showDrinks}>
              Chọn ly nước thưởng ☕
            </button>
            <button type="button" className="reward-screen__btn reward-screen__btn--ghost" onClick={onPlayAgain}>
              Chơi lại
            </button>
          </div>
        )}

        {phase === 'drinks' && (
          <div className="gift-phase gift-phase--drinks">
            <p className="reward-screen__badge">Thưởng thêm</p>
            <h2>Chọn một ly Leora pha cho bạn</h2>
            <div className="drink-grid">
              {DRINKS.map((drink) => (
                <button
                  key={drink.id}
                  type="button"
                  className={`drink-card ${selected?.id === drink.id ? 'drink-card--selected' : ''}`}
                  onClick={() => setSelected(drink)}
                >
                  <span className="drink-card__emoji">{drink.emoji}</span>
                  <strong>{drink.name}</strong>
                  <span className="drink-card__desc">{drink.desc}</span>
                </button>
              ))}
            </div>
            {selected && (
              <p className="reward-screen__chosen">
                Bạn chọn: <b>{selected.emoji} {selected.name}</b> — ngon lắm!
              </p>
            )}
            <button type="button" className="reward-screen__btn" onClick={onPlayAgain}>
              Chơi lại từ đầu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
