import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const storedPassRow = db.prepare("SELECT value FROM store_settings WHERE key = 'admin_password'").get() as { value: string } | undefined;
    const currentPassword = storedPassRow ? storedPassRow.value : 'snoopy123';

    if (password === currentPassword) {
      // Retornar um token simples de sessão
      const token = `adm_token_${Buffer.from(password + '_snoopy_secret').toString('base64')}`;
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ success: false, error: 'Senha incorreta' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro no servidor' }, { status: 500 });
  }
}

