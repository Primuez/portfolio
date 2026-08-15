export function checkDeviceCapability(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    // Check if WebGL or WebGL2 is supported by the browser and GPU
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');

    if (!gl) return false;

    // Check maximum texture size capability (modern hardware supports 4096+, minimum 2048 required for globe textures)
    const maxTextureSize = (gl as WebGLRenderingContext).getParameter(
      (gl as WebGLRenderingContext).MAX_TEXTURE_SIZE
    );
    if (!maxTextureSize || maxTextureSize < 2048) {
      return false;
    }

    // Check for extreme software-only fallback renderers (e.g. headless CPU emulators with no GPU acceleration)
    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = (gl as WebGLRenderingContext)
        .getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        ?.toString()
        .toLowerCase() || '';

      if (
        renderer.includes('llvmpipe') ||
        renderer.includes('softpipe')
      ) {
        return false;
      }
    }

    return true;
  } catch (e) {
    return false;
  }
}
