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

declare const gulpScp: (options: ScpOptions) => NodeJS.ReadWriteStream;

export default gulpScp;
