// Shared timetable data for the student dashboard and full class routine page.
// Times and course labels are transcribed from the department routine supplied by the user.

export const SECTION_NAMES = ["Section A", "Section B"];

export const TIME_SLOTS = [
  "9:00–9:50",
  "9:50–10:40",
  "10:40–11:30",
  "11:30–12:20",
  "12:20–1:10",
  "1:10–2:00",
  "2:00–2:50",
  "2:50–3:40",
  "3:40–4:30",
  "4:30–5:20",
];

const ROUTINE = {
  "Section A": {
    Tuesday: [
      { start: "9:50 AM", end: "11:30 AM", code: "MCAN303", name: "DM", faculty: "A", room: "309" },
      { start: "11:30 AM", end: "12:20 PM", code: "MCAN301", name: "SR", faculty: "A", room: "309" },
      { start: "2:00 PM", end: "2:50 PM", code: "MCAN303", name: "MB", faculty: "A", room: "309" },
      { start: "3:40 PM", end: "5:20 PM", code: "MCAN-E305B / MCAN-E305G", name: "Practical / lab", faculty: "SR / RM / MN", room: "405 / 309 / 310" },
    ],
    Wednesday: [
      { start: "9:50 AM", end: "11:30 AM", code: "MCAN302", name: "PB", faculty: "A", room: "309" },
      { start: "11:30 AM", end: "12:20 PM", code: "MCAN301", name: "RM", faculty: "A", room: "309" },
      { start: "12:20 PM", end: "2:00 PM", code: "MCAN-E305B / MCAN-E305G", name: "Practical / lab", faculty: "SR / RM / MN", room: "405 / 309 / 310" },
      { start: "2:00 PM", end: "3:40 PM", code: "MCAN302", name: "DM", faculty: "A", room: "309" },
      { start: "3:40 PM", end: "5:20 PM", code: "MCAN-E304B / E304F / E304C / E304D", name: "Practical / lab", faculty: "PB / S. Paul / SGN / SG", room: "309 / 310 / 405 / 306" },
    ],
    Saturday: [
      { start: "9:50 AM", end: "12:20 PM", code: "MCAN-E394B / MCAN-E394F", name: "Elective / FSP classes for remaining students", faculty: "PB, PG / S. Paul, AMD", room: "410 / 411" },
      { start: "12:20 PM", end: "2:00 PM", code: "MCAN-E304B / E304F / E304C / E304D", name: "Practical / lab", faculty: "PB / S. Paul / SGN / SG", room: "309 / 310 / 405 / 306" },
      { start: "2:00 PM", end: "5:20 PM", code: "MCAN-E394C / MCAN-E394D", name: "Elective / FSP classes for remaining students", faculty: "SGN, SC1 / SG, PG", room: "11th Floor Lab / 410" },
    ],
  },
  "Section B": {
    Tuesday: [
      { start: "9:50 AM", end: "11:30 AM", code: "MCAN301", name: "AK", faculty: "B", room: "310" },
      { start: "11:30 AM", end: "12:20 PM", code: "MCAN302", name: "SGN", faculty: "B", room: "310" },
      { start: "2:00 PM", end: "2:50 PM", code: "MCAN303", name: "DM", faculty: "B", room: "310" },
      { start: "3:40 PM", end: "5:20 PM", code: "MCAN-E305B / MCAN-E305G", name: "Practical / lab", faculty: "SR / RM / MN", room: "405 / 309 / 310" },
    ],
    Wednesday: [
      { start: "9:50 AM", end: "11:30 AM", code: "MCAN302", name: "SGN", faculty: "B", room: "310" },
      { start: "11:30 AM", end: "12:20 PM", code: "MCAN301", name: "AK", faculty: "B", room: "310" },
      { start: "12:20 PM", end: "2:00 PM", code: "MCAN-E305B / MCAN-E305G", name: "Practical / lab", faculty: "SR / RM / MN", room: "405 / 309 / 310" },
      { start: "2:00 PM", end: "3:40 PM", code: "MCAN303", name: "MB", faculty: "B", room: "310" },
      { start: "3:40 PM", end: "5:20 PM", code: "MCAN-E304B / E304F / E304C / E304D", name: "Practical / lab", faculty: "PB / S. Paul / SGN / SG", room: "309 / 310 / 405 / 306" },
    ],
    Saturday: [
      { start: "9:50 AM", end: "12:20 PM", code: "MCAN-E394B / MCAN-E394F", name: "Elective / FSP classes for remaining students", faculty: "PB, PG / S. Paul, AMD", room: "410 / 411" },
      { start: "12:20 PM", end: "2:00 PM", code: "MCAN-E304B / E304F / E304C / E304D", name: "Practical / lab", faculty: "PB / S. Paul / SGN / SG", room: "309 / 310 / 405 / 306" },
      { start: "2:00 PM", end: "5:20 PM", code: "MCAN-E394C / MCAN-E394D", name: "Elective / FSP classes for remaining students", faculty: "SGN, SC1 / SG, PG", room: "11th Floor Lab / 410" },
    ],
  },
};

export const ROUTINE_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function getClassesForDay(dayIndex, section) {
  const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex];
  return ROUTINE[section]?.[dayName] || [];
}

export function getClassesForNamedDay(dayName, section) {
  return ROUTINE[section]?.[dayName] || [];
}
