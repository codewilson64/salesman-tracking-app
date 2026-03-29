export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  [key: string]: any;
}

export interface MulterError extends Error {
  code?: string;
}