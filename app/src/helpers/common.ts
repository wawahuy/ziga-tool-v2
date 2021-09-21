import path from 'path';

export function isProduction() {
  return process.env.ENV === 'prod';
}

export function isApp() {
  return process.env.IS_APP === "app";
}

export function pathEngineUCCI() {
  if (isApp()) {
    return path.join(process.cwd(), 'ucci14.exe');
  }
  return path.join(__dirname, '../../bin/ucci14.exe');
}

export function getPath(p: string) {
  if (isApp()) {
    return path.join(process.cwd(), p);
  }
  return path.join(__dirname, '../../bin/', p);  
}

export function log(...args: any[]) {
  if (!isProduction()) {
    console.log(...args);
  }
}