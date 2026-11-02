
// Shared timetable data for the full routine page and student dashboard.
// MCA routine is preserved. BCA has its own editable dummy timetable.

export const SECTION_NAMES = ["Section A", "Section B"];

export const ROUTINE_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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

// --------------------------------------------------
// MCA ROUTINE — EXISTING DATA PRESERVED
// --------------------------------------------------

const MCA_ROUTINE = {
  "Section A": {
    Tuesday: [
      { start: "9:50 AM", end: "11:30 AM", code: "MCAN303", name: "Theoretical", faculty: "DM", room: "309" },
      { start: "11:30 AM", end: "12:20 PM", code: "MCAN301", name: "Theoretical", faculty: "SR", room: "309" },
      { start: "2:00 PM", end: "2:50 PM", code: "MCAN303", name: "Theoretical", faculty: "MB", room: "309" },
      { start: "3:40 PM", end: "5:20 PM", code: "MCAN-E305B / MCAN-E305G", name: "Practical / lab", faculty: "SR / RM / MN", room: "405 / 309 / 310" },
    ],
    Wednesday: [
      { start: "9:50 AM", end: "11:30 AM", code: "MCAN302", name: "Theoretical", faculty: "PB", room: "309" },
      { start: "11:30 AM", end: "12:20 PM", code: "MCAN301", name: "Theoretical", faculty: "RM", room: "309" },
      { start: "12:20 PM", end: "2:00 PM", code: "MCAN-E305B / MCAN-E305G", name: "Practical / lab", faculty: "SR / RM / MN", room: "405 / 309 / 310" },
      { start: "2:00 PM", end: "3:40 PM", code: "MCAN302", name: "Theoretical", faculty: "DM", room: "309" },
      { start: "3:40 PM", end: "5:20 PM", code: "MCAN-E304B / E304F / E304C / E304D", name: "Practical / lab", faculty: "PB / S. Paul / SGN / SG", room: "309 / 310 / 405 / 306" },
    ],
    Saturday: [
      { start: "9:50 AM", end: "12:20 PM", code: "MCAN-E304B / E304F / E304C / E304D", name: "Practical / lab", faculty: "PB / S. Paul / SGN / SG", room: "309 / 310 / 405 / 306" },
      { start: "12:20 PM", end: "2:00 PM", code: "MCAN-E304B / E304F / E304C / E304D", name: "Practical / lab", faculty: "PB / S. Paul / SGN / SG", room: "309 / 310 / 405 / 306" },
      { start: "2:00 PM", end: "5:20 PM", code: "MCAN-E394C / MCAN-E394D", name: "Elective / FSP classes for remaining students", faculty: "SGN, SC1 / SG, PG", room: "11th Floor Lab / 410" },
    ],
  },

  "Section B": {
    Tuesday: [
      { start: "9:50 AM", end: "11:30 AM", code: "MCAN301", name: "Theoretical", faculty: "AK", room: "310" },
      { start: "11:30 AM", end: "12:20 PM", code: "MCAN302", name: "Theoretical", faculty: "SGN", room: "310" },
      { start: "2:00 PM", end: "2:50 PM", code: "MCAN303", name: "Theoretical", faculty: "DM", room: "310" },
      { start: "3:40 PM", end: "5:20 PM", code: "MCAN-E305B / MCAN-E305G", name: "Practical / lab", faculty: "SR / RM / MN", room: "405 / 309 / 310" },
    ],
    Wednesday: [
      { start: "9:50 AM", end: "11:30 AM", code: "MCAN302", name: "Theoretical", faculty: "SGN", room: "310" },
      { start: "11:30 AM", end: "12:20 PM", code: "MCAN301", name: "Theoretical", faculty: "AK", room: "310" },
      { start: "12:20 PM", end: "2:00 PM", code: "MCAN-E305B / MCAN-E305G", name: "Practical / lab", faculty: "SR / RM / MN", room: "405 / 309 / 310" },
      { start: "2:00 PM", end: "3:40 PM", code: "MCAN303", name: "Theoretical", faculty: "MB", room: "310" },
      { start: "3:40 PM", end: "5:20 PM", code: "MCAN-E304B / E304F / E304C / E304D", name: "Practical / lab", faculty: "PB / S. Paul / SGN / SG", room: "309 / 310 / 405 / 306" },
    ],
    Saturday: [
      { start: "9:50 AM", end: "12:20 PM", code: "MCAN-E304B / E304F / E304C / E304D", name: "Practical / lab", faculty: "PB / S. Paul / SGN / SG", room: "309 / 310 / 405 / 306" },
      { start: "12:20 PM", end: "2:00 PM", code: "MCAN-E304B / E304F / E304C / E304D", name: "Practical / lab", faculty: "PB / S. Paul / SGN / SG", room: "309 / 310 / 405 / 306" },
      { start: "2:00 PM", end: "5:20 PM", code: "MCAN-E394C / MCAN-E394D", name: "Elective / FSP classes for remaining students", faculty: "SGN, SC1 / SG, PG", room: "11th Floor Lab / 410" },
    ],
  },
};

// --------------------------------------------------
// BCA ROUTINE — DUMMY DATA, EDITABLE
// --------------------------------------------------

const BCA_ROUTINE = {
  "Section A": {
    Monday: [
      { start: "10:00 AM", end: "10:50 AM", code: "BCAC301", name: "Python Programming — Theory", faculty: "AB", room: "301" },
      { start: "10:50 AM", end: "11:40 AM", code: "BCAC302", name: "Data Structure through C — Theory", faculty: "RS", room: "301" },
      { start: "12:20 PM", end: "2:00 PM", code: "BCAC391", name: "Python Programming Lab", faculty: "AB / PK", room: "Computer Lab 1" },
    ],

    Tuesday: [
      { start: "9:50 AM", end: "11:30 AM", code: "BCAC302", name: "Data Structure through C — Theory", faculty: "RS", room: "301" },
      { start: "11:30 AM", end: "12:20 PM", code: "BCAC301", name: "Python Programming — Theory", faculty: "AB", room: "301" },
      { start: "2:00 PM", end: "3:40 PM", code: "BCAC392", name: "Data Structure Lab", faculty: "RS / SD", room: "Computer Lab 2" },
    ],

    Wednesday: [
      { start: "9:00 AM", end: "9:50 AM", code: "BCAC303", name: "Mathematics for Computing", faculty: "SM", room: "302" },
      { start: "9:50 AM", end: "10:40 AM", code: "BCAC301", name: "Python Programming — Theory", faculty: "AB", room: "302" },
      { start: "10:40 AM", end: "12:20 PM", code: "BCAC391", name: "Python Programming Lab", faculty: "AB / PK", room: "Computer Lab 1" },
      { start: "1:10 PM", end: "2:00 PM", code: "BCAC304", name: "Environmental Studies", faculty: "NM", room: "302" },
    ],

    Thursday: [
      { start: "11:00 AM", end: "11:50 AM", code: "BCAC302", name: "Data Structure through C — Theory", faculty: "RS", room: "301" },
      { start: "11:50 AM", end: "12:40 PM", code: "BCAC304", name: "Environmental Studies", faculty: "NM", room: "301" },
    ],

    Friday: [
      { start: "10:00 AM", end: "10:50 AM", code: "BCAC303", name: "Mathematics for Computing", faculty: "SM", room: "302" },
      { start: "10:50 AM", end: "11:40 AM", code: "BCAC301", name: "Python Programming — Theory", faculty: "AB", room: "302" },
      { start: "12:20 PM", end: "2:00 PM", code: "BCAC392", name: "Data Structure Lab", faculty: "RS / SD", room: "Computer Lab 2" },
    ],

    Saturday: [
      { start: "10:00 AM", end: "11:40 AM", code: "BCAC305", name: "Communication Skills", faculty: "TR", room: "303" },
      { start: "11:40 AM", end: "12:30 PM", code: "BCAC303", name: "Mathematics for Computing", faculty: "SM", room: "303" },
    ],
  },

  "Section B": {
    Monday: [
      { start: "10:00 AM", end: "10:50 AM", code: "BCAC302", name: "Data Structure through C — Theory", faculty: "RS", room: "304" },
      { start: "10:50 AM", end: "11:40 AM", code: "BCAC303", name: "Mathematics for Computing", faculty: "SM", room: "304" },
    ],

    Tuesday: [
      { start: "9:50 AM", end: "11:30 AM", code: "BCAC301", name: "Python Programming — Theory", faculty: "AB", room: "304" },
      { start: "11:30 AM", end: "1:10 PM", code: "BCAC391", name: "Python Programming Lab", faculty: "AB / PK", room: "Computer Lab 2" },
      { start: "2:00 PM", end: "2:50 PM", code: "BCAC304", name: "Environmental Studies", faculty: "NM", room: "304" },
    ],

    Wednesday: [
      { start: "9:50 AM", end: "10:40 AM", code: "BCAC302", name: "Data Structure through C — Theory", faculty: "RS", room: "305" },
      { start: "10:40 AM", end: "11:30 AM", code: "BCAC303", name: "Mathematics for Computing", faculty: "SM", room: "305" },
      { start: "12:20 PM", end: "2:00 PM", code: "BCAC392", name: "Data Structure Lab", faculty: "RS / SD", room: "Computer Lab 1" },
    ],

    Thursday: [
      { start: "11:00 AM", end: "12:40 PM", code: "BCAC391", name: "Python Programming Lab", faculty: "AB / PK", room: "Computer Lab 2" },
    ],

    Friday: [
      { start: "10:00 AM", end: "10:50 AM", code: "BCAC301", name: "Python Programming — Theory", faculty: "AB", room: "304" },
      { start: "10:50 AM", end: "11:40 AM", code: "BCAC302", name: "Data Structure through C — Theory", faculty: "RS", room: "304" },
      { start: "12:20 PM", end: "1:10 PM", code: "BCAC303", name: "Mathematics for Computing", faculty: "SM", room: "304" },
    ],

    Saturday: [
      { start: "10:00 AM", end: "11:40 AM", code: "BCAC304", name: "Environmental Studies", faculty: "NM", room: "305" },
      { start: "11:40 AM", end: "12:30 PM", code: "BCAC305", name: "Communication Skills", faculty: "TR", room: "305" },
    ],
  },
};

// --------------------------------------------------
// PUBLIC FUNCTIONS
// --------------------------------------------------

function getRoutine(courseCode) {
  return String(courseCode || "MCA").trim().toUpperCase() === "BCA"
    ? BCA_ROUTINE
    : MCA_ROUTINE;
}

export function getClassesForDay(dayIndex, section, courseCode = "MCA") {
  const dayName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][dayIndex];

  return getRoutine(courseCode)[section]?.[dayName] || [];
}

export function getClassesForNamedDay(dayName, section, courseCode = "MCA") {
  return getRoutine(courseCode)[section]?.[dayName] || [];
}
