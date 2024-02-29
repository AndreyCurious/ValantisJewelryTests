/**
 * Фильтрация объекта от дубликатов 
 * @param data {Object}
 * @param id {String}
 * @returns {Object}
 */
export default function objectDuplicateFilter(data, value) {
  const res = data.reduce((o, i) => {
    if (!o.find(v => v[value] == i[value])) {
      o.push(i);
    }
    return o;
  }, []);
  return res;
}
