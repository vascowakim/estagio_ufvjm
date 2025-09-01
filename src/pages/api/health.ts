import type { NextApiRequest, NextApiResponse } from 'next'

type HealthResponse = {
  status: 'ok' | 'error'
  timestamp: string
  version: string
  environment: string
  services: {
    database: 'ok' | 'error'
    auth: 'ok' | 'error'
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: 'error',
        auth: 'error'
      }
    })
  }

  try {
    // Verificar conexão com Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    const databaseStatus = supabaseUrl && supabaseKey ? 'ok' : 'error'
    const authStatus = supabaseUrl && supabaseKey ? 'ok' : 'error'

    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: databaseStatus,
        auth: authStatus
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: 'error',
        auth: 'error'
      }
    })
  }
}
