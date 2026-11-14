// Retain Menagerie's original floor, lighting, and materials; omit the robot.
export function emptyScene(bytes) {
  const xml = new TextDecoder().decode(bytes).replace(/<include\s+file="panda.xml"\s*\/>/, '');
  return [{ name: 'scene.xml', bytes: new TextEncoder().encode(xml) }];
}
