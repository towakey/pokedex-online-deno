declare module 'https://esm.sh/jsqr@1.4.0' {
  // Minimal type for jsQR function signature used in this project
  const jsqr: (
    data: Uint8ClampedArray,
    width: number,
    height: number
  ) => { data?: string } | null
  export default jsqr
}
