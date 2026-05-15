import { MISSIONS_REQUIRED } from '../gameConfig';

export default function MissionMini({ count }) {
  const percent = Math.min((count / MISSIONS_REQUIRED) * 100, 100);

  return (
    <div className="mission-mini">
      <p className="mission-mini__label">Hoàn thành 5 nhiệm vụ cho mèo</p>
      <div className="mission-mini__track">
        <div className="mission-mini__fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="mission-mini__count">{count}/{MISSIONS_REQUIRED}</span>
    </div>
  );
}
