import { AppSettings } from '..';

export function imagePathToFileObject(imagePath: string | null) {
  const parts = imagePath ? imagePath.split('.') : '';

  const ext = imagePath ? parts[parts.length - 1].toLowerCase() : '';

  const fileValue = imagePath
    ? {
      uri: imagePath,
      name: 'image_' + imagePath,
      type: `image/${ext}`,
    }
    : null;

  return fileValue;
}

const letterToColorMap = {
  a: '#7CB9E8',
  b: '#3a9e77',
  c: '#A3C1AD',
  d: '#E1BD27',
  e: '#badc58',
  f: '#db5970',
  g: '#9b8ef1',
  h: '#ffe169',
  i: '#3ea9d1',
  j: '#8aa341',
  k: '#baf2f5',
  l: '#ffa02d',
  m: '#d46830',
  n: '#62ecaa',
  o: '#ffbe50',
  p: '#0078D7',
  q: '#8764B8',
  r: '#52dd64',
  s: '#7edce9',
  t: '#dadd5d',
  u: '#e9b55d',
  v: '#99d669',
  w: '#a3c83a',
  x: '#f28d67',
  y: '#ea82ec',
  z: '#ff8295',
};

export function matchInitialToColor(anyString?: string) {
  if (!anyString) return '#999999';
  return letterToColorMap[anyString.toLowerCase().charAt(0)] || '#999999';
}

export function waitFor(ms) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

type ParseSourceUrlArg = {
  source?: string;
  src?: string;
};

export function parseSourceUrl(args: string, Settings?: AppSettings): string;
export function parseSourceUrl(
  args: ParseSourceUrlArg,
  Settings?: AppSettings
): string;
export function parseSourceUrl(
  args: ParseSourceUrlArg | string,
  Settings?: AppSettings,
): string {
  if (!args) return null;

  let res = '';
  let address = '';
  if (typeof args === 'string') {
    address = args;
  } else {
    address = args.source || args.src || '';
  }

  if (address && address.startsWith('/media/')) {
    const tmp = address.substr(1, address.length);
    res = `${Settings.BaseURL}${tmp}`;
  } else if (address) {
    res = address;
  } else {
    res = `https://picsum.photos/600?random=${Math.random() * 100}`;
  }
  return res;
}
