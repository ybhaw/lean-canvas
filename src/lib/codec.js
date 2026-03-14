import LZString from 'lz-string';

export function encode(data) {
  try {
    return LZString.compressToEncodedURIComponent(JSON.stringify(data));
  } catch {
    return null;
  }
}

export function decode(str) {
  try {
    const json = LZString.decompressFromEncodedURIComponent(str);
    if (!json) return null;
    return JSON.parse(json);
  } catch {
    return null;
  }
}
