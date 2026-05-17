export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const CAT_SIZE = 100;
export const STEP = 20;
export const NEED_SPAWN_DELAY = 4000;
export const NEED_TIMEOUT = 14000;
export const MOOD_DISPLAY_MS = 3200;
export const MISSIONS_REQUIRED = 5;

export const ZONES = [
  { id: 'kitchen', x: 142, y: 218, action: 'eating', text: 'Măm măm 🐟' },
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

/**
 * Số ngày cộng từ hôm nay để hiển thị trong hộp quà.
 * 0 = hôm nay, 1 = ngày mai, 2 = ngày kia, ...
 */
export const GIFT_DAYS_OFFSET = 1;

export function formatDateDDMMYYYY(date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getGiftSurpriseDate(daysOffset = GIFT_DAYS_OFFSET) {
  const target = new Date();
  target.setHours(12, 0, 0, 0);
  target.setDate(target.getDate() + daysOffset);
  return formatDateDDMMYYYY(target);
}

export function getGiftDayLabel(daysOffset = GIFT_DAYS_OFFSET) {
  if (daysOffset === 0) return 'hôm nay';
  if (daysOffset === 1) return 'ngày mai';
  if (daysOffset === 2) return 'ngày kia';
  return `sau ${daysOffset} ngày`;
}

/** Tiêu đề trang chọn quà (có ngày động) */
export function getGiftPageTitle(date) {
  return `Ngày ${date} bạn sẽ nhận được một người bạn nhỏ để trò chuyện vào dịp này. Đây là món bất ngờ của Leora tặng bạn. Trân trọng!`;
}

export const GIFTS = [
  { id: 'cake', name: 'Bánh kem', desc: 'Ngọt ngào, tan chảy trong miệng' },
  { id: 'juice', name: 'Nước trái cây', desc: 'Mát lạnh, đầy vitamin' },
  { id: 'teddy', name: 'Gấu bông', desc: 'Ôm ấm, dễ thương không lối thoát' },
  {
    id: 'mystery',
    name: 'Phần quà bí ẩn',
    desc: 'Được gửi từ tương lai vào dịp đặc biệt',
    textOnly: true,
  },
];

export function pickRandomNeed(excludeZoneId = null) {
  const pool = excludeZoneId
    ? CAT_NEEDS.filter((n) => n.zoneId !== excludeZoneId)
    : CAT_NEEDS;
  return pool[Math.floor(Math.random() * pool.length)];
}
