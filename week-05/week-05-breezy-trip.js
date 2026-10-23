// Week 05, Set 2, Breezy: the trip itself, shared by the web page and the phone.
// Data, the small drawings, and the ride's map, which both lay out the same way.
// ---------- the trip, day by day ----------
// weather: [kind, high, low, words, [[hour, temp] x4]]
// a plan: at [from, to] on the rail; tab, the status on its folder; c, the folder's pastel; who goes (YH, JW); by, how they get there
// (plane, train, tram, metro, bus, car, walk); the row inside: lead 'icon' (ic) | 'avatar' (who) | 'thumb' (photo) | none,
// t, s, v / vs on the right; go: a hotel to open; kind 'flight' or 'car' opens in place; check: a to-do
const BOTH = ['YH', 'JW'];
const DAYS = [
  { key: 'fri', short: 'Fri 24', title: 'Friday', date: 'Oct 24', place: 'Lisbon', note: 'Travel day',
    wx: ['sun', 22, 15, 'Sunny, light breeze', [['09', 17], ['12', 21], ['15', 22], ['18', 19]]], items: [
    { at: ['07:30', '08:00'], tab: 'To do', c: 'cloud', who: ['YH'], check: true, t: 'Pack a light jacket', s: 'Evenings by the river get windy' },
    { at: ['09:40', '19:50'], dur: '15h 10m', tab: 'Flight · booked', c: 'sky', who: BOTH, by: ['plane'], kind: 'flight', lead: 'icon', ic: 'plane', t: 'Seoul to Lisbon', s: 'TAP Air Portugal · 1 stop in Frankfurt', v: 'ICN → LIS', vs: '2 seats' },
    { at: ['20:20', '20:45'], tab: 'Ride', c: 'coral', who: BOTH, by: ['car'], kind: 'ride', ride: 'lis', lead: 'icon', ic: 'car', t: 'Bolt to the hotel', s: 'Lisbon Airport, Arrivals P2 → Alfama', v: '≈ €18', vs: 'pay in app' },
    { at: ['21:00', 'Mon'], dur: '3 nights', tab: 'Stay · paid', c: 'sand', who: BOTH, by: ['walk'], lead: 'thumb', photo: 'memmo', t: 'Memmo Alfama', s: 'Hotel · check in from 15:00 · ref MA-48213', v: '₩612,000', vs: 'paid', go: 'memmo' },
    { at: ['21:30', '23:00'], tab: 'Table for 2', c: 'sun', who: BOTH, by: ['tram'], lead: 'avatar', who1: 'JW', t: 'Dinner with Jiwoo', s: 'Taberna da Rua das Flores · Chiado · tram 28 from Alfama' }] },
  { key: 'sat', short: 'Sat 25', title: 'Saturday', date: 'Oct 25', place: 'Lisbon', note: 'Belém and the hills',
    wx: ['partly', 21, 14, 'Sun and a few clouds', [['09', 16], ['12', 20], ['15', 21], ['18', 18]]], items: [
    { at: ['09:00', '09:45'], tab: 'Breakfast', c: 'sun', who: BOTH, by: ['tram'], lead: 'thumb', photo: 'nata', t: 'Pastéis de Belém', s: 'Rua de Belém 84 · tram 15E · the takeaway window is faster' },
    { at: ['10:30', '12:00'], tab: 'Booked', c: 'lilac', who: BOTH, by: ['walk'], lead: 'icon', ic: 'ticket', t: 'Jerónimos Monastery', s: 'Timed entry · Praça do Império, Belém', v: '€24', vs: '2 tickets' },
    { at: ['12:15', '12:55'], tab: 'Your pick', c: 'coral', who: BOTH, by: ['tram'], lead: 'avatar', who1: 'YH', t: 'Tram 28, end to end', s: 'Martim Moniz → Prazeres · sit on the left for the views', v: '€3.10', vs: 'each' },
    { at: ['13:30', '15:30'], tab: 'Free time', c: 'sea', who: BOTH, by: ['bus'], lead: 'icon', ic: 'pin', t: 'LX Factory', s: 'Rua Rodrigues de Faria 103 · bus 714 · shops and lunch' },
    { at: ['18:40', '19:30'], tab: 'Sunset 18:52', c: 'coral', who: BOTH, by: ['metro', 'walk'], lead: 'thumb', photo: 'sunset', t: 'Sunset at Senhora do Monte', s: 'Miradouro · Graça · bring the jacket' }] },
  { key: 'sun', short: 'Sun 26', title: 'Sunday', date: 'Oct 26', place: 'Sintra', note: 'Day trip to Sintra',
    wx: ['fog', 18, 13, 'Fog in the hills, clearing by noon', [['09', 13], ['12', 17], ['15', 18], ['18', 15]]], items: [
    { at: ['09:11', '09:51'], tab: 'Train', c: 'sea', who: BOTH, by: ['metro', 'train'], lead: 'icon', ic: 'train', t: 'Train to Sintra', s: 'Rossio station, platform 3 · CP Sintra line', v: '€2.40', vs: 'each' },
    { at: ['10:30', '12:30'], tab: 'Booked', c: 'lilac', who: BOTH, by: ['bus', 'walk'], lead: 'icon', ic: 'ticket', t: 'Pena Palace', s: 'Timed entry · bus 434 up the hill, walk from the gate', v: '€40', vs: '2 tickets' },
    { at: ['13:00', '14:15'], tab: 'Lunch', c: 'sun', who: BOTH, by: ['walk'], lead: 'thumb', photo: 'bacalhau', t: 'Lunch at Tascantiga', s: 'Escadinhas da Fonte da Pipa 2 · old town' },
    { at: ['15:00', '17:00'], tab: 'Last entry 17:00', c: 'lilac', who: BOTH, by: ['walk'], lead: 'thumb', photo: 'regaleira', t: 'Quinta da Regaleira', s: 'The initiation well · tunnels to the lake', v: '€30', vs: '2 tickets' },
    { at: ['18:21', '19:01'], tab: 'Train', c: 'sea', who: BOTH, by: ['train'], lead: 'icon', ic: 'train', t: 'Train back to Lisbon', s: 'Sintra → Rossio', v: '€2.40', vs: 'each' }] },
  { key: 'mon', short: 'Mon 27', title: 'Monday', date: 'Oct 27', place: 'Porto', note: 'On to Porto',
    wx: ['rain', 19, 14, 'Showers in the afternoon', [['09', 15], ['12', 18], ['15', 19], ['18', 16]]], items: [
    { at: ['11:00', '11:30'], tab: 'To do', c: 'cloud', who: BOTH, check: true, lead: 'icon', ic: 'bed', t: 'Check out of Memmo Alfama', s: 'Bags can stay at the desk until 11:30' },
    { at: ['12:09', '14:59'], tab: 'Train · booked', c: 'sea', who: BOTH, by: ['metro', 'train'], lead: 'icon', ic: 'train', t: 'Train to Porto', s: 'Alfa Pendular · Santa Apolónia → Campanhã', v: '€62.40', vs: 'car 4 · 41–42' },
    { at: ['15:30', 'Wed'], dur: '2 nights', tab: 'Stay · paid', c: 'sand', who: BOTH, by: ['metro', 'walk'], lead: 'thumb', photo: 'torel', t: 'Torel Avantgarde', s: 'Hotel · Rua da Restauração 336 · ref TA-10577', v: '₩498,000', vs: 'paid', go: 'torel' },
    { at: ['17:30', '18:15'], tab: 'Booked', c: 'lilac', who: BOTH, by: ['walk'], lead: 'icon', ic: 'ticket', t: 'Livraria Lello', s: 'Rua das Carmelitas 144 · voucher counts toward a book', v: '€20', vs: '2 vouchers' },
    { at: ['20:30', '22:00'], tab: 'Table for 2', c: 'sun', who: BOTH, by: ['walk'], lead: 'avatar', who1: 'JW', t: 'Dinner at Cantinho do Avillez', s: 'Rua de Mouzinho da Silveira 166 · Ribeira' }] },
  { key: 'tue', short: 'Tue 28', title: 'Tuesday', date: 'Oct 28', place: 'Douro Valley', note: 'A day in the Douro',
    wx: ['sun', 23, 12, 'Clear and warm by the river', [['09', 14], ['12', 21], ['15', 23], ['18', 18]]], items: [
    { at: ['09:00', '09:20'], tab: 'Pick up', c: 'coral', who: BOTH, by: ['metro'], kind: 'car', lead: 'icon', ic: 'car', t: 'Rental car, Fiat 500X', s: 'Sixt · Porto Campanhã station, desk 3', v: '€64', vs: 'paid' },
    { at: ['09:30', '11:10'], tab: 'Drive', c: 'sky', who: BOTH, by: ['car'], lead: 'icon', ic: 'road', t: 'Drive to Pinhão', s: 'N222 along the river · you drive', v: '≈ €6', vs: 'tolls' },
    { at: ['11:30', '13:00'], tab: 'Booked', c: 'lilac', who: BOTH, by: ['walk'], lead: 'thumb', photo: 'vines', t: 'Wine tasting at Quinta do Crasto', s: 'Gouvinhas · you drive back, so Jiwoo tastes', v: '€70', vs: 'for 2' },
    { at: ['13:30', '15:00'], tab: 'Lunch', c: 'sun', who: BOTH, by: ['car'], lead: 'thumb', photo: 'sardines', t: 'Lunch at DOC', s: 'Folgosa · terrace on the river' },
    { at: ['17:30', '18:00'], tab: 'To do', c: 'cloud', who: ['YH'], by: ['car'], check: true, lead: 'icon', ic: 'car', t: 'Return the car', s: 'Fill up before Campanhã · full to full' }] },
  { key: 'wed', short: 'Wed 29', title: 'Wednesday', date: 'Oct 29', place: 'Porto → Seoul', note: 'Home',
    wx: ['cloud', 17, 12, 'Cloudy, dry', [['09', 13], ['12', 16], ['15', 17], ['18', 15]]], items: [
    { at: ['09:00', '09:30'], tab: 'To do', c: 'cloud', who: BOTH, check: true, lead: 'icon', ic: 'bed', t: 'Check out of Torel Avantgarde', s: 'Taxi booked at the desk for 09:30' },
    { at: ['09:30', '09:55'], tab: 'Ride', c: 'coral', who: BOTH, by: ['car'], kind: 'ride', ride: 'opo', lead: 'icon', ic: 'car', t: 'Taxi to Porto Airport', s: 'Rua da Restauração → OPO', v: '≈ €25', vs: 'card or cash' },
    { at: ['10:30', '10:45'], tab: 'To do', c: 'cloud', who: ['JW'], by: ['walk'], check: true, t: 'Buy pastéis for the office', s: 'Six to a box, they keep for two days' },
    { at: ['12:35', '+1 09:20'], dur: '17h 45m', tab: 'Flight · booked', c: 'sky', who: BOTH, by: ['plane'], lead: 'icon', ic: 'plane', t: 'Porto to Seoul', s: 'Turkish Airlines · 1 stop in Istanbul', v: 'OPO → ICN', vs: '2 seats' }] },
];
const HOTELS = {
  memmo: { name: 'Memmo Alfama', area: 'Lisbon', addr: 'Travessa das Merceeiras 27, Alfama, Lisbon', chips: ['Rooftop pool', 'River view', 'Breakfast in', 'Late check-out'],
    room: ['Deluxe room, river view', '1 king bed · 2 guests · 28 m²'], ref: 'MA-48213', in: ['Fri 24', 'from 15:00'], out: ['Mon 27', 'until 12:00'], nights: 3, total: '₩612,000',
    near: [['Tram 28 stop', '3 min walk'], ['Miradouro de Santa Luzia', '4 min walk'], ['Baixa-Chiado metro', '12 min walk']], photos: ['memmo', 'memmo-room', 'memmo-pool'], alts: ['Alfama rooftops down to the river', 'A room with a king bed', 'The rooftop pool'] },
  torel: { name: 'Torel Avantgarde', area: 'Porto', addr: 'Rua da Restauração 336, Porto', chips: ['Douro view', 'Garden', 'Spa', 'Breakfast in'],
    room: ['Signature room, river view', '1 king bed · 2 guests · 32 m²'], ref: 'TA-10577', in: ['Mon 27', 'from 15:00'], out: ['Wed 29', 'until 11:00'], nights: 2, total: '₩498,000',
    near: [['Jardim do Palácio de Cristal', '5 min walk'], ['Ribeira', '15 min walk'], ['Campanhã station', '12 min by taxi']], photos: ['torel', 'torel-room'], alts: ['The Douro and Porto from the hill by the hotel', 'A room with a king bed'] },
};
const CAR = [['Pick up', 'Tue 28, 09:00', 'Sixt, Porto Campanhã, desk 3'], ['Return', 'Tue 28, 18:00', 'Same desk · full to full'],
  ['Drivers', 'You, and Jiwoo', 'Second driver added, €8'], ['Cover', 'Full protection', 'No excess, glass and tyres in'], ['Booking', 'SX-77120', '€64 paid · free cancel to Mon']];
// rides that open to their way: the drawn route (in the 320 x 150 map), pins, then the steps and the car
const RIDES = {
  lis: { path: 'M34 34 L 62 34 C 96 34, 122 92, 176 90 S 232 98, 254 98 L 290 98', a: ['LIS', 46, 12], b: ['Alfama', 244, 112],
    from: ['20:20', 'Pick up', 'Lisbon Airport, Arrivals P2, lane 3'], via: ['', 'Via 2ª Circular and Av. Infante D. Henrique', '11 km · light traffic after 20:00'],
    to: ['20:45', 'Drop off', 'Memmo Alfama, Travessa das Merceeiras 27'], facts: ['Bolt · white Toyota Corolla', 'AQ-27-LX', 'Rui · 4.9 ★', '≈ €18, in the app'] },
  opo: { path: 'M290 112 L 262 112 C 232 112, 210 64, 160 62 S 92 30, 70 30 L 34 30', a: ['Torel', 238, 84], b: ['OPO', 14, 44],
    from: ['09:30', 'Pick up', 'Torel Avantgarde, the front door'], via: ['', 'Via the A28, north along the coast', '17 km · tolls in the fare'],
    to: ['09:55', 'Drop off', 'Porto Airport, Departures, door 3'], facts: ['Taxi booked at the desk', 'Black Mercedes E', 'Card or cash', '≈ €25'] },
};
const rideHTML = r => `<div class="ride"><div class="rmap" style="--path: path('${r.path}')">
    <svg viewBox="0 0 320 150" width="320" height="150" aria-hidden="true">
      <path d="M0 132 C 80 120, 200 146, 320 128 V150 H0Z" fill="#7fd0f0" opacity=".55"/>
      <g stroke="#fff" stroke-width="5" fill="none" opacity=".9"><path d="M0 60 H320"/><path d="M120 0 V150"/><path d="M0 18 L320 80"/><path d="M230 0 L200 150"/></g>
      <path d="${r.path}" fill="none" stroke="var(--on-p)" stroke-width="2.5" stroke-dasharray="1 6" stroke-linecap="round"/>
      <circle cx="${r.path.split(' ')[0].slice(1)}" cy="${r.path.split(' ')[1]}" r="6" fill="#fff" stroke="var(--on-p)" stroke-width="2.5"/>
      <circle cx="${r.path.split(' ').at(-2)}" cy="${r.path.split(' ').at(-1)}" r="7" fill="var(--coral)" stroke="#fff" stroke-width="2.5"/></svg>
    <b style="left:${r.a[1]}px; top:${r.a[2]}px">${r.a[0]}</b><b style="left:${r.b[1]}px; top:${r.b[2]}px">${r.b[0]}</b>
    <span class="rcar"><svg viewBox="0 0 24 24"><use href="#i-car"/></svg></span></div>
  <div class="steps">${[['', r.from], ['via', r.via], ['', r.to]].map(([k, [t, b, sp]]) => `<div class="step ${k}"><time>${t}</time><div><b>${b}</b><span>${sp}</span></div></div>`).join('')}</div>
  <div class="rfacts">${r.facts.map(f => `<span>${f}</span>`).join('')}</div></div>`;
const LEGS = [['09:40 ICN → 15:35 FRA', 'LH 713 · 12h 55m · seat 34K'], ['2h 10m in Frankfurt', 'Change to gate B44'], ['17:45 FRA → 19:50 LIS', 'TP 579 · 3h 05m · seat 12A']];

// ---------- small drawings ----------
const ICON = {
  plane: '<use href="#i-plane"/>', train: '<use href="#i-train"/>', bed: '<use href="#i-bed"/>',
  car: '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M5 16h14M4 16v-3l2-5a2 2 0 0 1 1.9-1.4h8.2A2 2 0 0 1 18 8l2 5v3M4 13h16"/><circle cx="7.5" cy="16.5" r="1.8" fill="currentColor"/><circle cx="16.5" cy="16.5" r="1.8" fill="currentColor"/>',
  ticket: '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z"/><path stroke="currentColor" stroke-width="1.6" stroke-dasharray="2 2" d="M14 7v10"/>',
  pin: '<path fill="none" stroke="currentColor" stroke-width="1.8" d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2" fill="currentColor"/>',
  road: '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M8 21L10 3M16 21L14 3"/><path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M12 6v2M12 11v2M12 16v2"/>',
};
const WX = {
  sun: '<circle cx="16" cy="16" r="7" fill="#ffb341"/><g stroke="#ffb341" stroke-width="2" stroke-linecap="round"><path d="M16 3v3M16 26v3M3 16h3M26 16h3M6.8 6.8l2 2M23.2 23.2l2 2M6.8 25.2l2-2M23.2 8.8l2-2"/></g>',
  partly: '<circle cx="12" cy="12" r="6" fill="#ffb341"/><path d="M10 25h13a5 5 0 0 0 0-10 7 7 0 0 0-13 2 4 4 0 0 0 0 8z" fill="#fff" stroke="#b8cbdb" stroke-width="1.5"/>',
  cloud: '<path d="M8 24h16a6 6 0 0 0 0-12 8 8 0 0 0-15.5 2.5A5 5 0 0 0 8 24z" fill="#e3ebf2" stroke="#9fb3c4" stroke-width="1.5"/>',
  rain: '<path d="M8 20h16a6 6 0 0 0 0-12 8 8 0 0 0-15.5 2.5A5 5 0 0 0 8 20z" fill="#e3ebf2" stroke="#9fb3c4" stroke-width="1.5"/><g stroke="#2f8fe8" stroke-width="2" stroke-linecap="round"><path d="M11 23l-1.5 4M17 23l-1.5 4M23 23l-1.5 4"/></g>',
  fog: '<circle cx="16" cy="12" r="6" fill="#ffd9a0"/><g stroke="#9fb3c4" stroke-width="2.2" stroke-linecap="round"><path d="M5 18h22M8 22h17M5 26h20"/></g>',
};
const wxIcon = k => `<svg class="wx-i" viewBox="0 0 32 32" aria-hidden="true">${WX[k]}</svg>`;
const carSVG = '<svg viewBox="0 0 200 90" aria-hidden="true"><path d="M20 62 Q22 40 50 36 L74 20 Q82 14 96 14 L132 14 Q146 14 154 24 L168 38 Q186 42 186 60 L186 66 L20 66 Z" fill="#ff7a5c"/><path d="M80 24 Q86 20 96 20 L112 20 L112 38 L66 38 Z M118 20 L132 20 Q142 20 148 28 L156 38 L118 38 Z" fill="#cfe9ff"/><circle cx="58" cy="66" r="14" fill="#12324a"/><circle cx="58" cy="66" r="6" fill="#dbe4ec"/><circle cx="150" cy="66" r="14" fill="#12324a"/><circle cx="150" cy="66" r="6" fill="#dbe4ec"/><rect x="172" y="46" width="12" height="6" rx="2" fill="#ffd27a"/></svg>';

const PEOPLE = { YH: ['You', 'var(--coral)'], JW: ['Jiwoo', 'var(--sea)'] };
const BY = { plane: 'plane', train: 'train', tram: 'tram', metro: 'metro', bus: 'bus', car: 'car', walk: 'on foot' };
