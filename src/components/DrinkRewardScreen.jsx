import { useState } from 'react';
import { DRINKS } from '../gameConfig';

export default function DrinkRewardScreen({ onPlayAgain }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="reward-screen">
      <div className="reward-screen__card">
        <p className="reward-screen__badge">Phần thưởng</p>
        <h1>Chúc mừng! 🎉</h1>
        <p className="reward-screen__subtitle">
          Bạn đã hoàn thành 5 nhiệm vụ. Chọn một ly đồ uống Leora tặng bạn nhé!
        </p>

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
          <div className="reward-screen__chosen">
            Bạn chọn: <b>{selected.emoji} {selected.name}</b> — ngon lắm!
          </div>
        )}

        <button type="button" className="reward-screen__btn" onClick={onPlayAgain}>
          Chơi lại từ đầu
        </button>
      </div>
    </div>
  );
}