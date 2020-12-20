import path from 'path';

export function isProduction() {
  return process.env.ENV === 'prod';
}

export function isApp() {
  return process.env.IS_APP === "app";
}

export function log(...args: any[]) {
  if (!isProduction()) {
    console.log(...args);
  }
}