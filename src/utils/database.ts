import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (db) {
    return db;
  }

  try {
    // Caminho para o banco de dados (na pasta raiz do projeto)
    const dbPath = path.join(process.cwd(), '..', 'estagio.db');
    
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Verificar se o banco tem as tabelas necessárias
    await initializeDatabase();
    
    return db;
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    throw error;
  }
}

async function initializeDatabase(): Promise<void> {
  if (!db) return;

  try {
    // Verificar se a tabela orientadores existe
    const tableExists = await db.get(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='orientadores'
    `);

    if (!tableExists) {
      // Criar tabela orientadores se não existir
      await db.exec(`
        CREATE TABLE IF NOT EXISTS orientadores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          senha TEXT NOT NULL,
          tipo TEXT DEFAULT 'professor',
          status TEXT DEFAULT 'Ativo',
          departamento TEXT,
          telefone TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Inserir usuário administrador padrão
      const hashedPassword = require('crypto')
        .createHash('sha256')
        .update('admin123')
        .digest('hex');

      await db.run(`
        INSERT INTO orientadores (nome, email, senha, tipo, status)
        VALUES (?, ?, ?, ?, ?)
      `, [
        'Administrador do Sistema',
        'admin@ufvjm.edu.br',
        hashedPassword,
        'administrador',
        'Ativo'
      ]);
    }

    // Criar outras tabelas se necessário
    await db.exec(`
      CREATE TABLE IF NOT EXISTS estudantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        telefone TEXT,
        cpf TEXT,
        matricula TEXT UNIQUE NOT NULL,
        curso TEXT NOT NULL,
        periodo TEXT NOT NULL,
        status TEXT DEFAULT 'Ativo',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS empresas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cnpj TEXT,
        email TEXT,
        telefone TEXT,
        endereco TEXT,
        cidade TEXT,
        estado TEXT,
        cep TEXT,
        representante TEXT,
        status TEXT DEFAULT 'Ativa',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS estagios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estudante_id INTEGER NOT NULL,
        empresa_id INTEGER NOT NULL,
        orientador_id INTEGER NOT NULL,
        tipo TEXT NOT NULL,
        data_inicio DATE NOT NULL,
        data_termino DATE NOT NULL,
        carga_horaria INTEGER NOT NULL,
        atividades TEXT,
        status TEXT DEFAULT 'Em Andamento',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (estudante_id) REFERENCES estudantes(id),
        FOREIGN KEY (empresa_id) REFERENCES empresas(id),
        FOREIGN KEY (orientador_id) REFERENCES orientadores(id)
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS certificados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estudante_id INTEGER NOT NULL,
        estagio_id INTEGER NOT NULL,
        numero_certificado TEXT UNIQUE NOT NULL,
        data_emissao DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (estudante_id) REFERENCES estudantes(id),
        FOREIGN KEY (estagio_id) REFERENCES estagios(id)
      )
    `);

    console.log('✅ Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}