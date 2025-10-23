import { query } from '../db';

export async function generateTowerCode(): Promise<string> {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code: string;
  let exists = true;

  while (exists) {
    code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const result = await query<any[]>('SELECT id FROM towers WHERE code = ?', [code]);
    exists = result.length > 0;
  }

  return code!;
}
