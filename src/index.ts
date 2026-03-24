/**
 * Main entry point and types
 */
interface ScpOptions {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  privateKey?: string;
  passphrase?: string;
  dest: string;
  watch?: (client: any) => void;
}

import gulpScp from "./gulp-scp";

export = gulpScp;
