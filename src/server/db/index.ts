import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { isServer } from 'solid-js/web';
import { serverEnv } from '~/env/server';
import schema from './schema';
 
if (!isServer) throw new Error('This file should only be imported on the server');

const { POSTGRES_HOST, POSTGRES_NAME, POSTGRES_USER, POSTGRES_PASSWORD } = serverEnv;

const client = postgres(`postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_NAME}`);
export const db = drizzle(client, { schema });
 