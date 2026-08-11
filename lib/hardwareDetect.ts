/**
 * Core Logic: Adaptive 3D Globe Hardware Detection Engine
 * Checks CPU core count, mobile status, reduced motion preferences,
 * and inspects WebGL GPU Renderer to detect software renderers (SwiftShader, llvmpipe, etc.)
 */
export function checkDeviceCapability(): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Check user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }

  // 2. Filter out mobile browsers and low-core CPUs (< 4 cores)
  const cores = navigator.hardwareConcurrency || 2;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (cores < 4 || isMobile) return false;

  // 3. Inspect WebGL GPU Renderer
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return false;

    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)?.toString().toLowerCase() || '';
      // Disable 3D Globe on software renderers
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
