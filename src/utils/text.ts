/** Minúsculas y sin tildes: "Salchipapá" y "salchipapa" se encuentran igual. */
export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}
