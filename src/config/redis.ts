import { createClient, RedisClientType } from 'redis';
import { config } from './config';

class RedisClient {
    private client: RedisClientType;
    private connecting: Promise<void> | null = null;

    constructor() {
        this.client = createClient({
            socket: {
                host: config.redis.host,
                port: config.redis.port,
                reconnectStrategy: (retries) => {
                    console.log(`🔄 Reintentando conexión Redis (${retries})...`);
                    return Math.min(retries * 200, 3000); // backoff progresivo
                }
            },
            password: config.redis.password,
            database: config.redis.db,
        });

        this.setupEventListeners();
    }

    // =========================
    // EVENTOS
    // =========================
    private setupEventListeners(): void {
        this.client.on('connect', () => {
            console.log('🔗 Conectando a Redis...');
        });

        this.client.on('ready', () => {
            console.log('✅ Redis listo para comandos');
        });

        this.client.on('reconnecting', () => {
            console.log('♻️ Redis reconectando...');
        });

        this.client.on('end', () => {
            console.log('🔌 Conexión Redis cerrada');
        });

        this.client.on('error', (error) => {
            console.error('❌ Error Redis:', error.message);
        });
    }

    // =========================
    // AUTO CONNECT (CLAVE)
    // =========================
    private async ensureConnection(): Promise<void> {
        if (this.client.isOpen) return;

        // evita múltiples connects paralelos (race condition workers)
        if (!this.connecting) {
            this.connecting = this.client.connect()
                .catch(err => {
                    this.connecting = null;
                    throw err;
                })
                .then(() => {
                    this.connecting = null;
                });
        }

        await this.connecting;
    }

    // =========================
    // BASE METHODS
    // =========================
    async set(key: string, value: string, ttl?: number): Promise<void> {
        await this.ensureConnection();
        if (ttl) await this.client.setEx(key, ttl, value);
        else await this.client.set(key, value);
    }

    async get(key: string): Promise<string | null> {
        await this.ensureConnection();
        return await this.client.get(key);
    }

    async del(key: string): Promise<void> {
        await this.ensureConnection();
        await this.client.del(key);
    }

    async exists(key: string): Promise<boolean> {
        await this.ensureConnection();
        return (await this.client.exists(key)) === 1;
    }

    // =========================
    // JSON HELPERS
    // =========================
    async setJSON(key: string, value: any, ttl?: number): Promise<void> {
        const jsonValue = JSON.stringify(value);
        await this.set(key, jsonValue, ttl);
    }

    async getJSON<T>(key: string): Promise<T | null> {
        const value = await this.get(key);
        if (!value) return null;

        try {
            return JSON.parse(value) as T;
        } catch {
            console.error(`Error parseando JSON ${key}`);
            return null;
        }
    }

    // =========================
    // SOLO PARA SHUTDOWN APP
    // =========================
    async quit(): Promise<void> {
        if (this.client.isOpen) {
            await this.client.quit();
        }
    }

    getClient(): RedisClientType {
        return this.client;
    }
}

export const redisClient = new RedisClient();

async function shutdown() {
    console.log('\n🛑 Cerrando worker...');

    try {
        await redisClient.quit(); // cerrar redis correctamente
        console.log('🔴 Redis cerrado');

        process.exit(0);
    } catch (err) {
        console.error('Error cerrando servicios:', err);
        process.exit(1);
    }
}

// CTRL + C
process.on('SIGINT', shutdown);

// kill
process.on('SIGTERM', shutdown);
