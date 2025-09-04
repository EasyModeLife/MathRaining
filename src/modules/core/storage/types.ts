export interface StorageDriver {
  read(path: string): Promise<string | undefined>;
  write(path: string, data: string): Promise<void>;
  list(dir: string): Promise<string[]>;
  exists(path: string): Promise<boolean>;
}
