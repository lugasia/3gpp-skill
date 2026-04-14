#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

async function main() {
    try {
        const input = await new Promise((resolve, reject) => {
            let data = '';
            process.stdin.on('data', chunk => data += chunk);
            process.stdin.on('end', () => resolve(data));
            process.stdin.on('error', reject);
        });

        const hookData = JSON.parse(input);

        // Delete backup directory for this session
        const backupDir = path.join(hookData.cwd, '.claude', '.edit-baks', hookData.session_id);

        try {
            await fs.rm(backupDir, { recursive: true, force: true });
            console.log(`Cleaned up session backups: ${hookData.session_id}`);
        } catch (error) {
            // Directory might not exist, which is fine
            console.log(`No backups to clean for session: ${hookData.session_id}`);
        }

    } catch (error) {
        console.error(`Cleanup failed: ${error.message}`, process.stderr);
        process.exit(1);
    }
}

main();
