export const KEY = 'norm_bd_v1';
export const fresh = () => ({ p: null, step: 0, t: [], d: {}, r: [], n: 1, g: false });

export function load() {
  try {
    return { ...fresh(), ...JSON.parse(localStorage.getItem(KEY)) };
  } catch (e) {
    return fresh();
  }
}

export function save(S) {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch (e) {
    /* almacenamiento no disponible */
  }
}
