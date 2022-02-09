export type CancellablePromise<T> = Promise<T> & { abort?: () => void };

export type WebInputFile = {
  file: File;
  preview: string;
};

export type MobileFile = {
  fileCopyUri?: string;
  name: string;
  size: number;
  type: string;
  uri: string;
};

export type MobileInputFile = {
  file: MobileFile;
  preview: MobileFile;
};
