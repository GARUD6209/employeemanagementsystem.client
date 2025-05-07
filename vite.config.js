import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "employeemanagementsystem.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
}

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7216';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: './',
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '/api': {
                target: 'https://localhost:7216',
                secure: false,
                changeOrigin: true,
                configure: (proxy, _options) => {
                    proxy.on('error', (err, _req, _res) => {
                        console.log('proxy error', err);
                    });
                    proxy.on('proxyReq', (proxyReq, req, _res) => {
                        console.log('Sending Request:', req.method, req.url);
                        // Don't override content-type for multipart/form-data
                        if (!req.headers['content-type']?.includes('multipart/form-data')) {
                            proxyReq.setHeader('Content-Type', 'application/json');
                        }
                    });
                    proxy.on('proxyRes', (proxyRes, req, _res) => {
                        console.log('Received Response:', proxyRes.statusCode, req.url);
                    });
                },
                // Increase limit for file uploads
                maxBodyLength: 104857600, // 100MB
                timeout: 300000, // 5 minutes
            },
            '/login': {
                target: 'https://localhost:7216',
                secure: false,
                changeOrigin: true
            },
            '/logout': {
                target: 'https://localhost:7216',
                secure: false,
                changeOrigin: true
            },
            '/pingauth': {
                target: 'https://localhost:7216',
                secure: false,
                changeOrigin: true
            },
            '/WeatherForecast': {
                target: 'https://localhost:7216',
                secure: false,
                changeOrigin: true
            }
        },
        port: 64919,
        strictPort: true,
        host: true,
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})
