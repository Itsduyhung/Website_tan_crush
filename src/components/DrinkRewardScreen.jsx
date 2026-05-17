import { useState, useEffect, useMemo } from 'react';
import Confetti from 'react-confetti';
import { GIFTS } from '../gameConfig';
import giftMascot from '../assets/gift-mascot.png';
import giftCake from '../assets/gift-cake.png';
import giftJuice from '../assets/gift-juice.png';
import giftTeddy from '../assets/gift-teddy.png';

const GIFT_IMAGES = {
  cake: giftCake,
  juice: giftJuice,
  teddy: giftTeddy,
};

const OPEN_ANIM_MS = 650;

function getThanksMessage(name) {
  return `Cảm ơn ${name} vì đã giúp mình bé mèo lúc mình đi vắng. Để đền đáp sự chân thành này mình có chút lòng thành muốn gửi tặng ${name}`;
}

function GiftRevealContent({ gift }) {
  return (
    <div className="gift-reveal gift-reveal--simple">
      <strong className="gift-reveal__name">{gift.name}</strong>
    </div>
  );
}

export default function DrinkRewardScreen({ onPlayAgain }) {
  const [phase, setPhase] = useState('nickname');
  const [nickname, setNickname] = useState('');
  const [nicknameInput, setNicknameInput] = useState('');
  const [openingId, setOpeningId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [windowSize, setWindowSize] = useState({ w: 800, h: 600 });

  useEffect(() => {
    const update = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const displayName = nickname.trim() || 'bạn';

  const handleNicknameSubmit = (e) => {
    e.preventDefault();
    const trimmed = nicknameInput.trim();
    if (!trimmed) return;
    setNickname(trimmed);
    setPhase('pick');
  };

  const openBox = (gift) => {
    if (openingId || selected) return;
    setOpeningId(gift.id);
    setTimeout(() => {
      setSelected(gift);
      setOpeningId(null);
    }, OPEN_ANIM_MS);
  };

  if (phase === 'nickname') {
    return (
      <div className="reward-screen">
        <div className="reward-screen__card reward-screen__card--nickname">
          <p className="reward-screen__badge">Phần thưởng</p>
          <h1 className="reward-screen__heading">Leora có quà cho bạn!</h1>
          <p className="reward-screen__subtitle">Trước tiên, bạn tên gì nhỉ?</p>
          <form className="nickname-form" onSubmit={handleNicknameSubmit}>
            <input
              type="text"
              className="nickname-form__input"
              placeholder="Nhập nick name của bạn..."
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              maxLength={24}
              autoFocus
            />
            <button type="submit" className="reward-screen__btn" disabled={!nicknameInput.trim()}>
              Tiếp tục
            </button>
          </form>
        </div>
      </div>
    );
  }

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

      <div className="reward-screen__card reward-screen__card--gift-pick">
        <div className="gift-pick-layout">
          <aside className="gift-mascot">
            <img src={giftMascot} alt="Leora" className="gift-mascot__img" />
          </aside>

          <div className="gift-pick-content">
            <p className="reward-screen__badge">Phần thưởng</p>

            {!selected ? (
              <>
                <div className="gift-dialogue">
                  <p className="gift-dialogue__text">{getThanksMessage(displayName)}</p>
                  <p className="gift-dialogue__hint">Chạm vào một hộp quà để mở nhé!</p>
                </div>

                <div className="gift-box-grid gift-box-grid--pick">
                  {GIFTS.map((gift) => {
                    const isOpening = openingId === gift.id;
                    const isDisabled = Boolean(openingId && !isOpening);
                    return (
                      <button
                        key={gift.id}
                        type="button"
                        className={`gift-box gift-box--pick ${isOpening ? 'gift-box--opening' : ''} ${isDisabled ? 'gift-box--disabled' : ''}`}
                        onClick={() => openBox(gift)}
                        disabled={isDisabled}
                        aria-label={`Mở hộp quà ${gift.name}`}
                      >
                        <span className="gift-box__ribbon">🎀</span>
                        <span className="gift-box__lid" />
                        <span className={`gift-box__body ${GIFT_IMAGES[gift.id] ? 'gift-box__body--image' : ''}`}>
                          {GIFT_IMAGES[gift.id] ? (
                            <img src={GIFT_IMAGES[gift.id]} alt={gift.name} />
                          ) : (
                            <span className="gift-box__emoji">🎁</span>
                          )}
                        </span>
                        <span className="gift-box__label">{gift.name}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="gift-phase gift-phase--revealed">
                <div className="gift-box gift-box--pick gift-box--open gift-box--revealed">
                  <span className="gift-box__lid gift-box__lid--open" />
                  <span className="gift-box__body gift-box__body--open">
                    <GiftRevealContent gift={selected} />
                  </span>
                </div>

                <p className="reward-screen__chosen">
                  {displayName} đã chọn món quà "{selected.name}"
                </p>
                <button type="button" className="reward-screen__btn" onClick={onPlayAgain}>
                  Chơi lại từ đầu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
