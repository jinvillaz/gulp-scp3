import { Transform } from "stream";
import type { TransformCallback } from "stream";
import path from "path";
import debugFactory from "debug";
import { ScpClient } from "./client";

interface ScpOptions {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  privateKey?: string;
  passphrase?: string;
  dest: string;
  watch?: (client: ScpClient) => void;
}

const debug = debugFactory("gulp-scp3");

function createClient(options: Required<ScpOptions>): ScpClient {
  const client = new ScpClient(options as any);
  client.on("connect", () => debug("ssh connect %s", options.host));
  client.on("close", () => debug("ssh close %s", options.host));
  client.on("mkdir", (dir: string) => debug("mkdir %s", dir));
  client.on("write", (o: any) => debug("write %s", o.destination));
  client.on("error", (err: Error) => debug("error %s", err));
  return client;
}

export default function gulpScp(options: ScpOptions): Transform {
  const config = {
    host: options.host || "localhost",
    username: options.username || "admin",
    port: options.port || 22,
    dest: options.dest || `/home/${options.username || "admin"}`,
    password: options.password,
    privateKey: options.privateKey,
    passphrase: options.passphrase,
  };

  const client = createClient(config as any);
  let connected = false;

  if (options.watch) {
    options.watch(client);
  }

  return new Transform({
    objectMode: true,

    async transform(
      this: Transform,
      file: any,
      encoding: string,
      callback: TransformCallback,
    ): Promise<void> {
      try {
        if (file.isStream()) {
          callback(new Error("Streaming not supported"), file);
          return;
        }

        if (file.stat && file.stat.isDirectory()) {
          debug("ignore directory %s", file.path);
          callback(null, file);
          return;
        }

        if (!connected) {
          await client.sftp();
          connected = true;
        }

        const relativePath = file.relative.replace(/\\/g, "/");
        const dest = path.posix.join(config.dest, relativePath);
        await client.mkdir(path.posix.dirname(dest));
        await client.write({
          destination: dest,
          content: file.contents as Buffer,
        });

        callback(null, file);
      } catch (err) {
        callback(err as Error);
      }
    },

    async flush(this: Transform, callback: TransformCallback): Promise<void> {
      try {
        client.close();
      } catch (err) {
        // ignore close errors
      }
      callback();
    },
  });
}
