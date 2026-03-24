import * as fs from "fs/promises";
import * as path from "path";
import { Client as SSHClient } from "ssh2";
import EventEmitter from "events";

const DEFAULT_MODE = 0o755;

interface ScpOptions {
  host: string;
  port?: number;
  username: string;
  password?: string;
  privateKey?: string;
  passphrase?: string;
}

interface ScpWriteOptions {
  destination: string;
  source?: string;
  content: Buffer;
  attrs?: object;
  chunkSize?: number;
}

export class ScpClient extends EventEmitter {
  private _options: ScpOptions;
  private __ssh?: SSHClient;
  private __sftp?: any;

  constructor(options: ScpOptions) {
    super();
    this._options = options;
  }

  private getSFTP(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.__sftp) {
        resolve(this.__sftp);
        return;
      }
      (this.__ssh as SSHClient).sftp((err: any, sftp: any) => {
        if (err) {
          reject(err);
        } else {
          this.__sftp = sftp;
          resolve(sftp);
        }
      });
    });
  }

  async sftp(): Promise<any> {
    if (!this.__ssh) {
      const config: any = {
        host: this._options.host,
        port: this._options.port || 22,
        username: this._options.username,
      };

      if (this._options.password) {
        config.password = this._options.password;
      }
      if (this._options.privateKey) {
        config.privateKey = await fs.readFile(this._options.privateKey);
        if (this._options.passphrase) {
          config.passphrase = this._options.passphrase;
        }
      }

      this.__ssh = new SSHClient();

      await new Promise<void>((resolve, reject) => {
        this.__ssh!.once("ready", () => {
          this.emit("ready");
          resolve();
        });
        this.__ssh!.once("error", reject);
        this.__ssh!.on("connect", () => this.emit("connect"));
        this.__ssh!.on("close", () => this.emit("close"));
        this.__ssh!.connect(config);
      });
    }

    return this.getSFTP();
  }

  async mkdir(dirPath: string, attrs: object = {}): Promise<void> {
    const sftp = await this.sftp();
    const dirAttrs = { mode: DEFAULT_MODE, ...attrs };

    // Simple recursive mkdir
    const createDir = async (dir: string): Promise<void> => {
      try {
        await new Promise<void>((resolve) => {
          (sftp as any).stat(dir, () => resolve()); // ignore errors = doesn't exist
        });
      } catch {
        // Parent dir (POSIX for remote SFTP paths)
        const parent = path.posix.dirname(dir);
        if (parent !== dir) {
          await createDir(parent);
        }
        this.emit("mkdir", dir);
        await new Promise<void>((resolve, reject) => {
          (sftp as any).mkdir(dir, dirAttrs, (err: any) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    };

    await createDir(dirPath);
  }

  async write(options: ScpWriteOptions): Promise<void> {
    const sftp = await this.sftp();
    const destination = path.join(options.destination).replace(/\\/g, "/");

    const writeFile = async (dest: string) => {
      return new Promise((resolve, reject) => {
        (sftp as any).open(
          dest,
          "w",
          options.attrs || {},
          (err: any, handle: any) => {
            if (err) {
              reject(err);
              return;
            }

            this.emit("write", options);

            let offset = 0;
            const chunkSize = options.chunkSize || 32768;
            const writeChunk = () => {
              if (offset >= options.content.length) {
                (sftp as any).close(handle, resolve);
                return;
              }

              const chunk = options.content.slice(offset, offset + chunkSize);
              (sftp as any).write(
                handle,
                chunk,
                0,
                chunk.length,
                offset,
                (writeErr: any) => {
                  if (writeErr) {
                    (sftp as any).close(handle, () => reject(writeErr));
                  } else {
                    offset += chunk.length;
                    writeChunk();
                  }
                },
              );
            };
            writeChunk();
          },
        );
      });
    };

    try {
      await writeFile(destination);
    } catch (err) {
      // Fallback
      const fallbackPath = path
        .join(
          path.dirname(destination),
          path.basename(options.source || options.destination),
        )
        .replace(/\\/g, "/");
      await writeFile(fallbackPath);
    }
  }

  close(): void {
    this.__sftp?.end();
    this.__ssh?.end();
    this.__sftp = undefined;
    this.__ssh = undefined;
  }
}
