/**
 * VSB-APEX Mock Data
 * All shapes match the backend API response exactly.
 * Flip USE_MOCK = false in dataService.js to use real API.
 */

export const YEARS    = ['I Year', 'II Year', 'III Year', 'IV Year'];
export const SECTIONS = {
  'I Year':   ['A', 'B', 'C'],
  'II Year':  ['A', 'B', 'C'],
  'III Year': ['A', 'B'],
  'IV Year':  ['A', 'B'],
};

// ── Attendance ────────────────────────────────────────────────
export const attendanceOverview = {
  overall: 78.4, totalStudents: 480, belowThreshold: 67, aboveThreshold: 413,
  trend: [
    { month: 'Aug', pct: 82 }, { month: 'Sep', pct: 79 },
    { month: 'Oct', pct: 76 }, { month: 'Nov', pct: 74 },
    { month: 'Dec', pct: 71 }, { month: 'Jan', pct: 78 },
    { month: 'Feb', pct: 80 }, { month: 'Mar', pct: 78 },
  ],
};
export const attendanceBySections = [
  { year: 'I Year',   section: 'A', students: 62, avg: 84.2, below75: 4  },
  { year: 'I Year',   section: 'B', students: 60, avg: 79.1, below75: 9  },
  { year: 'I Year',   section: 'C', students: 58, avg: 71.3, below75: 18 },
  { year: 'II Year',  section: 'A', students: 61, avg: 82.7, below75: 5  },
  { year: 'II Year',  section: 'B', students: 59, avg: 76.4, below75: 11 },
  { year: 'II Year',  section: 'C', students: 60, avg: 68.9, below75: 22 },
  { year: 'III Year', section: 'A', students: 62, avg: 81.0, below75: 6  },
  { year: 'III Year', section: 'B', students: 58, avg: 73.5, below75: 16 },
  { year: 'IV Year',  section: 'A', students: 60, avg: 77.3, below75: 10 },
  { year: 'IV Year',  section: 'B', students: 60, avg: 72.1, below75: 18 },
];

// ── Results ───────────────────────────────────────────────────
export const resultsOverview = {
  overallPassPct: 81.2, totalStudents: 480, failCount: 90, avgCGPA: 7.34,
  trend: [
    { sem: 'Sem 1', pass: 85 }, { sem: 'Sem 2', pass: 82 },
    { sem: 'Sem 3', pass: 78 }, { sem: 'Sem 4', pass: 80 },
    { sem: 'Sem 5', pass: 83 }, { sem: 'Sem 6', pass: 81 },
  ],
};
export const subjectWiseResults = [
  { subject: 'Maths',         code: 'MA3151', passP: 88, avgMarks: 72, arrears: 14 },
  { subject: 'Physics',       code: 'PH3151', passP: 91, avgMarks: 76, arrears: 9  },
  { subject: 'C Programming', code: 'GE3171', passP: 79, avgMarks: 68, arrears: 24 },
  { subject: 'Chemistry',     code: 'CY3151', passP: 84, avgMarks: 70, arrears: 18 },
  { subject: 'English',       code: 'HS3151', passP: 94, avgMarks: 80, arrears: 7  },
  { subject: 'Data Struct.',  code: 'CS3251', passP: 72, avgMarks: 63, arrears: 33 },
  { subject: 'DBMS',          code: 'CS3391', passP: 76, avgMarks: 65, arrears: 28 },
  { subject: 'Networks',      code: 'CS3501', passP: 68, avgMarks: 59, arrears: 41 },
];
export const resultsBySection = [
  { year: 'I Year',   section: 'A', passP: 90, avgCGPA: 7.8, arrears: 6  },
  { year: 'I Year',   section: 'B', passP: 84, avgCGPA: 7.4, arrears: 12 },
  { year: 'I Year',   section: 'C', passP: 74, avgCGPA: 6.9, arrears: 22 },
  { year: 'II Year',  section: 'A', passP: 88, avgCGPA: 7.6, arrears: 8  },
  { year: 'II Year',  section: 'B', passP: 80, avgCGPA: 7.2, arrears: 15 },
  { year: 'II Year',  section: 'C', passP: 69, avgCGPA: 6.5, arrears: 28 },
  { year: 'III Year', section: 'A', passP: 86, avgCGPA: 7.5, arrears: 10 },
  { year: 'III Year', section: 'B', passP: 77, avgCGPA: 7.0, arrears: 19 },
  { year: 'IV Year',  section: 'A', passP: 83, avgCGPA: 7.3, arrears: 13 },
  { year: 'IV Year',  section: 'B', passP: 78, avgCGPA: 6.8, arrears: 21 },
];

// ── Internal Tests ─────────────────────────────────────────────
export const internalOverview = {
  avgScore: 68.4,
  totalStudents: 480,
  below50Pct: 94,   // students scoring < 50%
  tests: 3,
};
export const internalBySections = [
  { year: 'I Year',   section: 'A', avgT1: 72, avgT2: 75, avgT3: 78, below50: 5  },
  { year: 'I Year',   section: 'B', avgT1: 65, avgT2: 68, avgT3: 70, below50: 12 },
  { year: 'I Year',   section: 'C', avgT1: 54, avgT2: 58, avgT3: 60, below50: 22 },
  { year: 'II Year',  section: 'A', avgT1: 74, avgT2: 76, avgT3: 80, below50: 4  },
  { year: 'II Year',  section: 'B', avgT1: 66, avgT2: 70, avgT3: 72, below50: 10 },
  { year: 'II Year',  section: 'C', avgT1: 50, avgT2: 53, avgT3: 57, below50: 28 },
  { year: 'III Year', section: 'A', avgT1: 70, avgT2: 73, avgT3: 76, below50: 7  },
  { year: 'III Year', section: 'B', avgT1: 60, avgT2: 64, avgT3: 67, below50: 18 },
  { year: 'IV Year',  section: 'A', avgT1: 69, avgT2: 72, avgT3: 75, below50: 9  },
  { year: 'IV Year',  section: 'B', avgT1: 58, avgT2: 61, avgT3: 65, below50: 20 },
];
export const internalBySubject = [
  { subject: 'Maths',         code: 'MA3151', avgT1: 68, avgT2: 72, avgT3: 75, trend: 'up'   },
  { subject: 'Physics',       code: 'PH3151', avgT1: 72, avgT2: 74, avgT3: 76, trend: 'up'   },
  { subject: 'C Programming', code: 'GE3171', avgT1: 60, avgT2: 62, avgT3: 61, trend: 'flat' },
  { subject: 'Chemistry',     code: 'CY3151', avgT1: 65, avgT2: 68, avgT3: 72, trend: 'up'   },
  { subject: 'Data Struct.',  code: 'CS3251', avgT1: 55, avgT2: 58, avgT3: 54, trend: 'down' },
  { subject: 'DBMS',          code: 'CS3391', avgT1: 62, avgT2: 65, avgT3: 68, trend: 'up'   },
  { subject: 'Networks',      code: 'CS3501', avgT1: 50, avgT2: 53, avgT3: 50, trend: 'flat' },
];

// ── Goals ─────────────────────────────────────────────────────
export const goals = [
  { id: 1, metric: 'Overall Attendance',    target: 85,   current: 78.4, unit: '%',   deadline: 'May 2025',  status: 'at-risk'    },
  { id: 2, metric: 'Overall Pass %',        target: 90,   current: 81.2, unit: '%',   deadline: 'May 2025',  status: 'at-risk'    },
  { id: 3, metric: 'Avg CGPA',              target: 7.8,  current: 7.34, unit: '',    deadline: 'May 2025',  status: 'in-progress'},
  { id: 4, metric: 'Placement Rate',        target: 85,   current: 78.3, unit: '%',   deadline: 'Dec 2025',  status: 'in-progress'},
  { id: 5, metric: 'Zero Arrear Sections',  target: 6,    current: 2,    unit: '',    deadline: 'May 2025',  status: 'at-risk'    },
  { id: 6, metric: 'Avg Internal Score',    target: 75,   current: 68.4, unit: '%',   deadline: 'Apr 2025',  status: 'in-progress'},
  { id: 7, metric: 'Sections Above 80% Att',target: 8,   current: 5,    unit: '',    deadline: 'Mar 2025',  status: 'achieved'   },
  { id: 8, metric: 'Highest Package',       target: 20,   current: 18,   unit: 'LPA', deadline: 'Dec 2025',  status: 'in-progress'},
];

// ── Insights ──────────────────────────────────────────────────
export const insights = [
  { id:1, severity:'critical', category:'Attendance', title:'I Year C — Critical Attendance Drop',
    detail:'Average attendance is 71.3%, with 18 students below 75%. Immediate intervention required.', affected:18, section:'I-C', metric:'71.3%' },
  { id:2, severity:'critical', category:'Attendance', title:'II Year C — Lowest Attendance',
    detail:'22 students are below the 75% threshold, consistently dropping over 3 months.', affected:22, section:'II-C', metric:'68.9%' },
  { id:3, severity:'warning',  category:'Results',    title:'Networks (CS3501) — High Failure Rate',
    detail:'41 students have arrears. Pass % is 68%, lowest across all subjects.', affected:41, section:'All', metric:'68% pass' },
  { id:4, severity:'warning',  category:'Results',    title:'II Year C — Academic Performance Concern',
    detail:'Pass % is 69% with avg CGPA 6.5. Targeted remedial sessions needed.', affected:28, section:'II-C', metric:'69% pass' },
  { id:5, severity:'warning',  category:'Internal',   title:'Networks & Data Structures — Declining Internal Scores',
    detail:'Both subjects show flat or downward internal test trends. Correlates with high arrear counts.', affected:35, section:'All', metric:'50-55 avg' },
  { id:6, severity:'info',     category:'Results',    title:'I Year A — Top Performing Section',
    detail:'Section maintains 90% pass rate with avg CGPA 7.8.', affected:0, section:'I-A', metric:'90% pass' },
  { id:7, severity:'info',     category:'Attendance', title:'March Attendance Recovery',
    detail:'Overall attendance improved from 71% (Dec) to 80% (Feb).', affected:0, section:'All', metric:'+9%' },
];

// ── Placement ─────────────────────────────────────────────────
export const placementStats = {
  eligible:120, placed:94, placementPct:78.3,
  avgPackage:5.4, highestPackage:18, companies:22,
};
