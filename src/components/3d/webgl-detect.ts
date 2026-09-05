/**
 * Safe WebGL detection utility.
 * Tests if the browser can actually initialize a WebGL or WebGL2 context.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');

    return Boolean(gl);
  } catch {
    return false;
  }
}
