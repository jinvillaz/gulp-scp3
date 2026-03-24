/**
 * TypeScript definitions for gulp-scp3
 */
export interface ScpOptions {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  privateKey?: string;
  passphrase?: string;
  dest: string;
  watch?: (client: any) => void;
}

export { default } from "./gulp-scp";

export interface ScpOptions {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  privateKey?: string;
  passphrase?: string;
  dest: string;
  watch?: (client: any) => void;
}
