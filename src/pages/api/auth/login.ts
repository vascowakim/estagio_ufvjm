import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/utils/database';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-super-segura-aqui';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: any;
  token?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido'
    });
  }

  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email e senha são obrigatórios'
      });
    }

    // Conectar ao banco de dados
    const db = await getDatabase();

    // Buscar usuário pelo email
    const user = await db.get(`
      SELECT id, nome, email, senha, tipo, status, departamento, telefone
      FROM orientadores 
      WHERE email = ? AND status = 'Ativo'
    `, [email]);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }

    // Verificar senha (SHA-256)
    const hashedPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    if (user.senha !== hashedPassword) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        tipo: user.tipo 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remover senha do objeto do usuário
    const { senha, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
