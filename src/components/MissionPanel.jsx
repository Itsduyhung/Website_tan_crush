import { CheckCircle2, Circle } from 'lucide-react';
import { MISSIONS, MISSIONS_REQUIRED } from '../gameConfig';

export default function MissionPanel({ completedIds }) {
  const doneCount = completedIds.length;

  return (
    <aside className="mission-panel">
      <div className="mission-panel__header">
        <h2>Bảng nhiệm vụ</h2>
        <span className="mission-panel__progress">
          {doneCount}/{MISSIONS_REQUIRED}
        </span>
      </div>
      <ul className="mission-list">
        {MISSIONS.map((mission) => {
          const done = completedIds.includes(mission.id);
          return (
            <li key={mission.id} className={`mission-item ${done ? 'mission-item--done' : ''}`}>
              {done ? (
                <CheckCircle2 size={20} className="mission-item__icon mission-item__icon--done" />
              ) : (
                <Circle size={20} className="mission-item__icon" />
              )}
              <div className="mission-item__body">
                <span className="mission-item__emoji">{mission.icon}</span>
                <div>
                  <strong>{mission.title}</strong>
                  <p>{mission.desc}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {doneCount >= MISSIONS_REQUIRED && (
        <p className="mission-panel__complete">🎉 Đủ 5 nhiệm vụ — nhận quà ngay!</p>
      )}
    </aside>
  );
}
