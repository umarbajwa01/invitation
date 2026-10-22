import config from './invitation.config.json';
export const invitationConfig = config;

export const defaultInvitation = `With hearts full of happiness and gratitude, we warmly invite you to join us as we celebrate our engagement and the beautiful beginning of our journey together.

Your presence would bring us immense joy, and it would be our privilege to share this precious moment with you.

We would be truly honored to have you by our side as we create memories to cherish forever.`;
export const defaultThankYou = `Your presence brings warmth to our hearts and makes this celebration even more meaningful.

Thank you for sharing in our happiness, surrounding us with your love, and making this beautiful beginning one we will always treasure.`;

export function messageParagraphs(override: string, fallback: string) {
  return (override.trim() || fallback).split(/\n\s*\n/).filter(Boolean);
}
export function eventDisplay(event = config.event) {
  let date: Date | null = null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
    const parsed = new Date(`${event.date}T12:00:00Z`);
    if (!isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === event.date) date = parsed;
  }
  // A calendar date is a local event date, not a UTC instant: never shift it across timezones.
  const part = (options: Intl.DateTimeFormatOptions, fallback: string) => date
    ? new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' }).format(date) : fallback;
  let time = event.timeLabel.trim() || '[EVENT TIME]';
  if (/^([01]\d|2[0-3]):[0-5]\d$/.test(event.time)) {
    const [h,m] = event.time.split(':').map(Number);
    time = `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
  }
  let zone = '';
  try {
    const sample = new Date(`${date ? event.date : '2000-01-01'}T12:00:00Z`);
    zone = new Intl.DateTimeFormat('en', { timeZone: event.timezone, timeZoneName: 'longGeneric' })
      .formatToParts(sample).find(p => p.type === 'timeZoneName')?.value || event.timezone;
  } catch { zone = 'Time zone to be confirmed'; }
  return { day: part({ day:'2-digit' }, '[DAY]'), month: part({ month:'long' }, '[MONTH]'),
    year: part({ year:'numeric' }, '[YEAR]'), weekday: part({ weekday:'long' }, '[WEEKDAY]'), time, zone };
}
