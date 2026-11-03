/**
 * Sanitasi pencegahan Formula Injection / CSV Injection (CWE-1236).
 * Jika suatu sel teks dimulai dengan karakter berbahaya (=, +, -, @, tab, newline),
 * awalan sel diberi tanda petik tunggal (') agar aplikasi spreadsheet (Excel, LibreOffice, Google Sheets)
 * menganggapnya sebagai string teks literal dan tidak mengeksekusinya sebagai rumus formula aktif.
 */
export function sanitizeFormulaInjection(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }

  const str = String(value);
  if (str.length === 0) {
    return "";
  }

  // Cek apakah karakter pertama adalah operator formula atau kontrol karakter
  if (/^[=+\-@\t\r\n]/.test(str)) {
    return `'${str}`;
  }

  return str.trim();
}
