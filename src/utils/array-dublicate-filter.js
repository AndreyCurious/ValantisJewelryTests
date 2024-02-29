/**
 * Фильтрация объекта от дубликатов 
 * @param data {Array}
 * @returns {Array}
 */
export default function arrayDuplicateFilter(data) {
  const result = Array.from(new Set(data));
  return result;
}
