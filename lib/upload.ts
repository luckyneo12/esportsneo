import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function ensureUploadDirs() {
  const dirs = [
    path.join(UPLOAD_DIR, 'avatars'),
    path.join(UPLOAD_DIR, 'logos'),
    path.join(UPLOAD_DIR, 'banners'),
    path.join(UPLOAD_DIR, 'teams'),
  ];

  for (const dir of dirs) {
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
  }
}

export async function saveFile(
  file: File,
  type: 'avatars' | 'logos' | 'banners' | 'teams'
): Promise<string> {
  await ensureUploadDirs();

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name);
  const filename = `${uuidv4()}${ext}`;
  const filepath = path.join(UPLOAD_DIR, type, filename);

  await writeFile(filepath, buffer);

  return `/uploads/${type}/${filename}`;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only image files (JPEG, PNG, GIF, WebP) are allowed' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  return { valid: true };
}
