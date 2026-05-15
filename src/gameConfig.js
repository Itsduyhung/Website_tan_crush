export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const CAT_SIZE = 100;
export const STEP = 20;
export const NEED_SPAWN_DELAY = 4000;
export const NEED_TIMEOUT = 14000;
export const MOOD_DISPLAY_MS = 3200;
export const MISSIONS_REQUIRED = 5;

export const ZONES = [
  { id: 'kitchen', x: 150, y: 150, action: 'eating', text: 'Măm măm 🐟' },
  { id: 'play_area', x: 650, y: 150, action: 'playing', text: 'Chơi đùa nàoo 🧶' },
  { id: 'living_room', x: 150, y: 450, action: 'watching_tv', text: 'Coi phim thui 📺' },
  { id: 'bedroom', x: 650, y: 450, action: 'sleeping', text: 'Zzz... 💤' },
];

export const CAT_NEEDS = [
  { zoneId: 'kitchen', thought: 'Đói! → Bếp ăn', hint: 'Đói bụng quá — đưa tớ đến bếp ăn!' },
  { zoneId: 'play_area', thought: 'Chơi đi! → Khu vui chơi', hint: 'Muốn chơi đùa — đến khu vui chơi nhé!' },
  { zoneId: 'living_room', thought: 'TV đi! → Phòng khách', hint: 'Nhàm chán — coi TV ở phòng khách!' },
  { zoneId: 'bedroom', thought: 'Ngủ! → Giường', hint: 'Buồn ngủ rồi — đưa tớ lên giường!' },
];

export const MISSIONS = [
  { id: 1, title: 'Cho Leora ăn no', desc: 'Đưa mèo đến bếp ăn', zoneId: 'kitchen', icon: '🍽️' },
  { id: 2, title: 'Chơi cùng Leora', desc: 'Đến khu vui chơi', zoneId: 'play_area', icon: '🧶' },
  { id: 3, title: 'Coi TV với Leora', desc: 'Đến phòng khách', zoneId: 'living_room', icon: '📺' },
  { id: 4, title: 'Ru Leora ngủ', desc: 'Đưa mèo lên giường', zoneId: 'bedroom', icon: '💤' },
  { id: 5, title: 'Làm Leora vui thêm', desc: 'Hoàn thành thêm 1 nhu cầu', zoneId: null, icon: '⭐' },
];

export const DRINKS = [
  { id: 'matcha', name: 'Matcha Latte', emoji: '🍵', desc: 'Thanh mát, béo nhẹ' },
  { id: 'latte', name: 'Latte', emoji: '☕', desc: 'Sữa nóng, thơm cà phê' },
  { id: 'peach_tea', name: 'Trà đào', emoji: '🍑', desc: 'Ngọt thanh, mát lạnh' },
  { id: 'milk_tea', name: 'Trà sữa truyền thống', emoji: '🧋', desc: 'Đậm trà, béo sữa' },
];

export function pickRandomNeed(excludeZoneId = null) {
  const pool = excludeZoneId
    ? CAT_NEEDS.filter((n) => n.zoneId !== excludeZoneId)
    : CAT_NEEDS;
  return pool[Math.floor(Math.random() * pool.length)];
}
