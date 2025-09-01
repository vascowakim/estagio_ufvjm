/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/login': { page: '/login' },
      '/dashboard': { page: '/dashboard' },
      '/estudantes': { page: '/estudantes' },
      '/empresas': { page: '/empresas' },
      '/orientadores': { page: '/orientadores' },
      '/estagios': { page: '/estagios' },
      '/relatorios': { page: '/relatorios' },
      '/certificados': { page: '/certificados' },
      '/configuracoes': { page: '/configuracoes' },
    }
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Configuração para Wix
  output: 'export',
  distDir: 'dist',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/estagio-pro/' : '',
}

module.exports = nextConfig
