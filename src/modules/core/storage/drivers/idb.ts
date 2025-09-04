import type { StorageDriver } from "@modules/core/storage/types";
import { get, set, createStore, keys } from "idb-keyval";

export class IdbStorageDriver implements StorageDriver {
  private store: ReturnType<typeof createStore>;
  constructor(dbName = "mathraining", storeName = "kv") {
    this.store = createStore(dbName, storeName);
  }
  async read(path: string): Promise<string | undefined> {
    const v = await get<string>(path, this.store);
    return v ?? undefined;
  }
  async write(path: string, data: string): Promise<void> {
    await set(path, data, this.store);
  }
  async list(dir: string): Promise<string[]> {
    const prefix = dir.endsWith("/") ? dir : `${dir}/`;
    const all = await keys(this.store);
    return (all as string[]).filter((k) => typeof k === "string" && k.startsWith(prefix));
  }
  async exists(path: string): Promise<boolean> {
    return (await this.read(path)) !== undefined;
  }
}
