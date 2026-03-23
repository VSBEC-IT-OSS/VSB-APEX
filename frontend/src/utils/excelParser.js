/**
 * Excel Parser Utility
 * Uses `xlsx` to parse uploaded files into API-matching shapes.
 * 
 * Usage:
 *   import { parseAttendanceExcel } from '../utils/excelParser';
 *   const data = await parseAttendanceExcel(file);
 *   setDataOverride('attendanceBySections', data);
 */
import * as XLSX from 'xlsx';

function readWorkbook(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wb = XLSX.read(e.target.result, { type: 'array' });
      resolve(wb);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// Expected columns: Year, Section, Students, Avg_Attendance, Below75
export async function parseAttendanceExcel(file) {
  const wb = await readWorkbook(file);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws);
  return rows.map(r => ({
    year: r['Year'] ?? '', section: r['Section'] ?? '',
    students: r['Students'] ?? 0, avg: r['Avg_Attendance'] ?? 0, below75: r['Below75'] ?? 0,
  }));
}

// Expected columns: Subject, Code, Pass_Pct, Avg_Marks, Arrears
export async function parseResultsExcel(file) {
  const wb = await readWorkbook(file);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws);
  return rows.map(r => ({
    subject: r['Subject'] ?? '', code: r['Code'] ?? '',
    passP: r['Pass_Pct'] ?? 0, avgMarks: r['Avg_Marks'] ?? 0, arrears: r['Arrears'] ?? 0,
  }));
}
