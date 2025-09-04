import type { StorageDriver } from "@modules/core/storage/types";

export class MemoryStorageDriver implements StorageDriver {
  private store = new Map<string, string>();

  async read(path: string): Promise<string | undefined> {
    return this.store.get(path);
  }

  async write(path: string, data: string): Promise<void> {
    this.store.set(path, data);
  }

  async list(dir: string): Promise<string[]> {
    const prefix = dir.endsWith("/") ? dir : `${dir}/`;
    return Array.from(this.store.keys()).filter((k) => k.startsWith(prefix));
  }

  async exists(path: string): Promise<boolean> {
    return this.store.has(path);
  }
}
