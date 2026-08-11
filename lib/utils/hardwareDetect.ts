export function checkDeviceCapability(): boolean {
  if (typeof window === 'undefined') return false;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }

  const cores = navigator.hardwareConcurrency || 2;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (cores < 4 || isMobile) return false;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return false;

    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)?.toString().toLowerCase() || '';
      if (
        renderer.includes('software') ||
        renderer.includes('llvm') ||
        renderer.includes('basic') ||
        renderer.includes('swiftshader')
      ) {
        return false;
      }
    }
  } catch (e) {
    return false;
  }

  return true;
}
