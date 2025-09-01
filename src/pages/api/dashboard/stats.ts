import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/utils/database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-super-segura-aqui';

interface DashboardStatsResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardStatsResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido'
    });
  }

  try {
    // Verificar token de autenticação
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token de autenticação necessário'
      });
    }

    const token = authHeader.substring(7);
    
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido'
      });
    }

    // Conectar ao banco de dados
    const db = await getDatabase();

    // Buscar estatísticas
    const stats = {
      total_estudantes: 0,
      total_empresas: 0,
      total_orientadores: 0,
      estagios_obrigatorios: {
        total: 0,
        em_andamento: 0,
        concluidos: 0,
        cancelados: 0
      },
      estagios_nao_obrigatorios: {
        total: 0,
        em_andamento: 0,
        concluidos: 0,
        cancelados: 0
      },
      certificados_emitidos: 0,
      alertas_pendentes: 0
    };

    // Contar estudantes
    const estudantesResult = await db.get('SELECT COUNT(*) as count FROM estudantes WHERE status = "Ativo"');
    stats.total_estudantes = estudantesResult?.count || 0;

    // Contar empresas
    const empresasResult = await db.get('SELECT COUNT(*) as count FROM empresas WHERE status = "Ativa"');
    stats.total_empresas = empresasResult?.count || 0;

    // Contar orientadores
    const orientadoresResult = await db.get('SELECT COUNT(*) as count FROM orientadores WHERE status = "Ativo"');
    stats.total_orientadores = orientadoresResult?.count || 0;

    // Contar estágios obrigatórios
    const estagiosObrigatorios = await db.all(`
      SELECT status, COUNT(*) as count 
      FROM estagios 
      WHERE tipo = 'Obrigatório' 
      GROUP BY status
    `);

    estagiosObrigatorios.forEach((row: any) => {
      stats.estagios_obrigatorios.total += row.count;
      if (row.status === 'Em Andamento') {
        stats.estagios_obrigatorios.em_andamento = row.count;
      } else if (row.status === 'Concluído') {
        stats.estagios_obrigatorios.concluidos = row.count;
      } else if (row.status === 'Cancelado') {
        stats.estagios_obrigatorios.cancelados = row.count;
      }
    });

    // Contar estágios não obrigatórios
    const estagiosNaoObrigatorios = await db.all(`
      SELECT status, COUNT(*) as count 
      FROM estagios 
      WHERE tipo = 'Não Obrigatório' 
      GROUP BY status
    `);

    estagiosNaoObrigatorios.forEach((row: any) => {
      stats.estagios_nao_obrigatorios.total += row.count;
      if (row.status === 'Em Andamento') {
        stats.estagios_nao_obrigatorios.em_andamento = row.count;
      } else if (row.status === 'Concluído') {
        stats.estagios_nao_obrigatorios.concluidos = row.count;
      } else if (row.status === 'Cancelado') {
        stats.estagios_nao_obrigatorios.cancelados = row.count;
      }
    });

    // Contar certificados
    const certificadosResult = await db.get('SELECT COUNT(*) as count FROM certificados');
    stats.certificados_emitidos = certificadosResult?.count || 0;

    // Simular alertas pendentes (você pode implementar uma lógica específica)
    stats.alertas_pendentes = Math.floor(Math.random() * 5);

    return res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
