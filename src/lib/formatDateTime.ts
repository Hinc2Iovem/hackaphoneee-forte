function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return String(value);
  }

  const day = pad2(d.getDate());
  const month = pad2(d.getMonth() + 1);
  const year = d.getFullYear();
  const hours = pad2(d.getHours());
  const minutes = pad2(d.getMinutes());

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
