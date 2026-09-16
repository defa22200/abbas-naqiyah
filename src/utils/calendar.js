// Calendar utilities for Apple Calendar, Google Calendar, and Android

/**
 * The Wedding Reception — the one and only event on the groom's side.
 * 8:00 PM IST on Saturday, 19 December 2026 (14:30 UTC).
 */
export const RECEPTION_EVENT = {
  id: 'reception',
  title: 'The Wedding Reception — Abbas & Naqiyah',
  description:
    'The Wedding Reception of Abbas & Naqiyah. 8:00 PM onwards, followed by dinner at Dhawan Celebrations, Nagpur.',
  location: 'Dhawan Celebrations, Gorewada Ring Road, Nagpur, Maharashtra, India',
  startDate: '2026-12-19T20:00:00+05:30',
  endDate: '2026-12-20T00:00:00+05:30',
  startUTC: '20261219T143000Z', // 20:00 IST is 14:30 UTC
  endUTC: '20261219T183000Z',   // 00:00 IST (next day) is 18:30 UTC
  hijri: '11 Shehre Rajabul Asab 1448 (Eve)',
  gregorian: 'Saturday, 19 December 2026',
  timeLabel: '8:00 PM onwards',
  program: 'Followed by Dinner',
  venueName: 'Dhawan Celebrations',
  venueAddress: 'Gorewada Ring Road, Nagpur, Maharashtra',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dhawan+Celebrations,+Gorewada+Ring+Road,+Nagpur',
  appleMapsUrl: 'https://maps.apple.com/?q=Dhawan+Celebrations,+Gorewada+Ring+Road,+Nagpur',
};

/** Canonical share URL — never localhost/preview links. */
export const SHARE_URL = 'https://naqiyah-abbas.lovelyday.net/';

/** Canonical instant the countdowns resolve to. */
export const RECEPTION_START_ISO = '2026-12-19T20:00:00+05:30';
export const RECEPTION_TIMESTAMP = new Date(RECEPTION_START_ISO).getTime();

export function getGoogleCalendarUrl(event) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${event.startUTC}/${event.endUTC}`,
    details: `${event.description}\n\nVenue: ${event.location}`,
    location: event.location,
    sf: 'true',
    output: 'xml',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadCalendarEvent(event) {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Abbas & Naqiyah Wedding Reception//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Abbas & Naqiyah — The Wedding Reception',
    'BEGIN:VEVENT',
    `UID:${event.id}-20261219@abbas-naqiyah.wedding`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${event.startUTC}`,
    `DTEND:${event.endUTC}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    'STATUS:CONFIRMED',
    // Reminder 1 day before
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: Tomorrow is ${event.title}`,
    'END:VALARM',
    // Reminder 2 hours before
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${event.title} begins soon`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'abbas-naqiyah-reception.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
