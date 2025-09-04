import type { StorageDriver } from "@modules/core/storage/types";

export class FSAccessStorageDriver implements StorageDriver {
  private root: FileSystemDirectoryHandle | null = null;

  constructor(root?: FileSystemDirectoryHandle) {
    this.root = root ?? null;
  }

  private ensureSupported() {
    if (typeof window === 'undefined' || !('showDirectoryPicker' in window)) {
      throw new Error('File System Access API no soportada en este entorno');
    }
  }

  private async getRoot(): Promise<FileSystemDirectoryHandle> {
    this.ensureSupported();
    if (!this.root) {
      this.root = await (window as any).showDirectoryPicker();
    }
  return this.root as FileSystemDirectoryHandle;
  }

  private async getHandle(path: string, create = false): Promise<FileSystemFileHandle> {
    const parts = path.split('/').filter(Boolean);
    const fileName = parts.pop()!;
    let dir = await this.getRoot();
    for (const p of parts) {
      dir = await dir.getDirectoryHandle(p, { create });
    }
    return dir.getFileHandle(fileName, { create });
  }

  async read(path: string): Promise<string | undefined> {
    try {
      const handle = await this.getHandle(path);
      const file = await handle.getFile();
      return await file.text();
    } catch {
      return undefined;
    }
  }

  async write(path: string, data: string): Promise<void> {
    const handle = await this.getHandle(path, true);
  const writable = await (handle as any).createWritable();
    await writable.write(data);
    await writable.close();
  }

  async list(dir: string): Promise<string[]> {
    const parts = dir.split('/').filter(Boolean);
    let dh = await this.getRoot();
    for (const p of parts) dh = await dh.getDirectoryHandle(p, { create: false });
  const out: string[] = [];
  for await (const [name, handle] of (dh as any).entries()) {
      if (handle.kind === 'file') out.push(`${dir.replace(/\/$/, '')}/${name}`);
    }
    return out;
  }

  async exists(path: string): Promise<boolean> {
    return (await this.read(path)) !== undefined;
  }
}
