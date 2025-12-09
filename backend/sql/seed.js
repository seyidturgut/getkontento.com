/**
 * Seed Script - Initial Admin User and Test Data
 * 
 * Run: node sql/seed.js
 * 
 * This script creates:
 * 1. Admin user with password: Admin123!
 * 2. Sample client: Sistem Global
 * 3. Client owner for Sistem Global with password: Client123!
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

const seed = async () => {
    console.log('🌱 Starting database seed...\n');

    try {
        // Create admin password hash
        const adminPassword = 'Admin123!';
        const adminHash = await bcrypt.hash(adminPassword, 10);

        // Create client password hash
        const clientPassword = 'Client123!';
        const clientHash = await bcrypt.hash(clientPassword, 10);

        console.log('Generated password hashes:');
        console.log(`Admin (Admin123!): ${adminHash}`);
        console.log(`Client (Client123!): ${clientHash}\n`);

        // Check if admin already exists
        const [existingAdmin] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            ['admin@getkontento.com']
        );

        if (existingAdmin.length > 0) {
            console.log('⚠️  Admin user already exists, updating password...');
            await pool.execute(
                'UPDATE users SET password_hash = ? WHERE email = ?',
                [adminHash, 'admin@getkontento.com']
            );
        } else {
            console.log('Creating admin user...');
            await pool.execute(
                'INSERT INTO users (client_id, name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
                [null, 'Super Admin', 'admin@getkontento.com', adminHash, 'admin', 1]
            );
        }

        // Check if Sistem Global client exists
        const [existingClient] = await pool.execute(
            'SELECT id FROM clients WHERE domain = ?',
            ['sistemglobal.com.tr']
        );

        let clientId;
        if (existingClient.length > 0) {
            console.log('⚠️  Sistem Global client already exists');
            clientId = existingClient[0].id;
        } else {
            console.log('Creating Sistem Global client...');
            const [clientResult] = await pool.execute(
                'INSERT INTO clients (name, domain, wp_api_url, plan, status) VALUES (?, ?, ?, ?, ?)',
                ['Sistem Global', 'sistemglobal.com.tr', 'https://sistemglobal.com.tr/wp-json/wp/v2', 'Enterprise', 'active']
            );
            clientId = clientResult.insertId;
        }

        // Check if client owner exists
        const [existingClientOwner] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            ['admin@sistemglobal.com.tr']
        );

        if (existingClientOwner.length > 0) {
            console.log('⚠️  Client owner already exists, updating password...');
            await pool.execute(
                'UPDATE users SET password_hash = ?, client_id = ? WHERE email = ?',
                [clientHash, clientId, 'admin@sistemglobal.com.tr']
            );
        } else {
            console.log('Creating Sistem Global client owner...');
            await pool.execute(
                'INSERT INTO users (client_id, name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
                [clientId, 'Sistem Global Admin', 'admin@sistemglobal.com.tr', clientHash, 'client_owner', 1]
            );
        }

        console.log('\n✅ Seed completed successfully!\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Test Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('ADMIN:');
        console.log('  Email: admin@getkontento.com');
        console.log('  Password: Admin123!');
        console.log('');
        console.log('CLIENT OWNER (Sistem Global):');
        console.log('  Email: admin@sistemglobal.com.tr');
        console.log('  Password: Client123!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
};

seed();
