import path from 'path';

export function isProduction() {
  return process.env.ENV === 'prod';
}

export function isApp() {
  return process.env.IS_APP === "app";
}

export function pathEngineUCCI() {
  if (isApp()) {
    return path.join(process.cwd(), 'ucci.exe');
  }
  return path.join(__dirname, '../../bin/ucci.exe');
}