import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = drizzle(pool, { schema });

export async function initializeSchema() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexorafield-default',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS companies (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        cnpj VARCHAR(30),
        city VARCHAR(100),
        state VARCHAR(10),
        avatar TEXT,
        segment VARCHAR(100),
        referral_code VARCHAR(50),
        referred_by VARCHAR(100),
        referral_credits REAL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS technicians (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        cpf VARCHAR(20),
        rg VARCHAR(30),
        birth_date VARCHAR(20),
        email VARCHAR(255),
        phone VARCHAR(50),
        whatsapp VARCHAR(50),
        city VARCHAR(100),
        state VARCHAR(10),
        cep VARCHAR(20),
        address TEXT,
        avatar TEXT,
        nr10 BOOLEAN DEFAULT FALSE,
        nr35 BOOLEAN DEFAULT FALSE,
        nr33 BOOLEAN DEFAULT FALSE,
        specialties JSONB DEFAULT '[]',
        equipment JSONB DEFAULT '[]',
        availability_days JSONB DEFAULT '[]',
        availability_hours VARCHAR(50),
        radius_km REAL DEFAULT 30,
        latitude REAL,
        longitude REAL,
        pix_key VARCHAR(100),
        pix_type VARCHAR(50),
        bank_name VARCHAR(100),
        agency VARCHAR(20),
        account_number VARCHAR(30),
        rating REAL DEFAULT 5.0,
        reviews_count INTEGER DEFAULT 0,
        completed_jobs_count INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'online',
        documents_approved BOOLEAN DEFAULT FALSE,
        signed_contract BOOLEAN DEFAULT FALSE,
        points INTEGER DEFAULT 0,
        badges JSONB DEFAULT '[]',
        referral_code VARCHAR(50),
        referred_by VARCHAR(100),
        referral_credits REAL DEFAULT 0,
        response_time_min INTEGER,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tickets (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        specialty VARCHAR(100),
        urgency VARCHAR(20),
        date VARCHAR(20),
        time VARCHAR(20),
        cep VARCHAR(20),
        city VARCHAR(100),
        state VARCHAR(10),
        address TEXT,
        latitude REAL,
        longitude REAL,
        suggested_value REAL DEFAULT 0,
        deadline VARCHAR(50),
        photos JSONB DEFAULT '[]',
        documents JSONB DEFAULT '[]',
        status VARCHAR(50) NOT NULL DEFAULT 'Aberto',
        company_id VARCHAR(100),
        assigned_tech_id VARCHAR(100),
        invited_tech_ids JSONB DEFAULT '[]',
        declined_tech_ids JSONB DEFAULT '[]',
        checklist JSONB DEFAULT '[]',
        evidence_photos JSONB DEFAULT '[]',
        evidence_video TEXT,
        technical_report TEXT,
        client_signature TEXT,
        invoice_uploaded BOOLEAN DEFAULT FALSE,
        rating_by_company JSONB,
        rating_by_tech JSONB,
        fraud_alerts JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS financial_transactions (
        id VARCHAR(100) PRIMARY KEY,
        ticket_id VARCHAR(100),
        ticket_title VARCHAR(500),
        company_name VARCHAR(255),
        tech_name VARCHAR(255),
        total_amount REAL DEFAULT 0,
        platform_commission REAL DEFAULT 15,
        platform_earnings REAL DEFAULT 0,
        tech_payout REAL DEFAULT 0,
        payment_method VARCHAR(20),
        status VARCHAR(30),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ai_audit_logs (
        id VARCHAR(100) PRIMARY KEY,
        ticket_id VARCHAR(100),
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        details JSONB,
        timestamp TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS webhooks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        secret VARCHAR(255) NOT NULL,
        events JSONB NOT NULL DEFAULT '[]',
        enabled BOOLEAN NOT NULL DEFAULT TRUE,
        last_status VARCHAR(20),
        last_status_code INTEGER,
        last_delivered_at TIMESTAMP,
        last_error TEXT,
        delivery_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS webhook_deliveries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        webhook_id UUID NOT NULL,
        event VARCHAR(100) NOT NULL,
        payload JSONB,
        status_code INTEGER,
        status VARCHAR(20) NOT NULL,
        response_body TEXT,
        error TEXT,
        duration INTEGER,
        delivered_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log("✅ Database schema initialized successfully.");
  } catch (error) {
    console.error("❌ Error initializing database schema:", error);
    throw error;
  } finally {
    client.release();
  }
}

export { pool };
