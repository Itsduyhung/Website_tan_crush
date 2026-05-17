import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MovePad({ onMove }) {
  const handle = (dx, dy) => (e) => {
    e.preventDefault();
    onMove(dx, dy);
  };

  return (
    <div className="move-pad" aria-label="Điều khiển di chuyển">
      <button
        type="button"
        className="move-pad__btn move-pad__btn--up"
        onPointerDown={handle(0, -1)}
        aria-label="Di chuyển lên"
      >
        <ChevronUp size={22} strokeWidth={2.5} />
      </button>
      <button
        type="button"
        className="move-pad__btn move-pad__btn--left"
        onPointerDown={handle(-1, 0)}
        aria-label="Di chuyển trái"
      >
        <ChevronLeft size={22} strokeWidth={2.5} />
      </button>
      <button
        type="button"
        className="move-pad__btn move-pad__btn--right"
        onPointerDown={handle(1, 0)}
        aria-label="Di chuyển phải"
      >
        <ChevronRight size={22} strokeWidth={2.5} />
      </button>
      <button
        type="button"
        className="move-pad__btn move-pad__btn--down"
        onPointerDown={handle(0, 1)}
        aria-label="Di chuyển xuống"
      >
        <ChevronDown size={22} strokeWidth={2.5} />
      </button>
    </div>
  );
}
