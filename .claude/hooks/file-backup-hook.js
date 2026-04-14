#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

async function main() {
    try {
        // Read input from stdin
        const input = await new Promise((resolve, reject) => {
            let data = '';
            process.stdin.on('data', chunk => data += chunk);
            process.stdin.on('end', () => resolve(data));
            process.stdin.on('error', reject);
        });

        const hookData = JSON.parse(input);

        // Only backup for file modification tools
        const fileModifyingTools = ['Write', 'Edit', 'MultiEdit'];
        if (!fileModifyingTools.includes(hookData.tool_name)) {
            process.exit(0);
        }

        // Extract file path from tool input
        let filePath;
        if (hookData.tool_name === 'Write' || hookData.tool_name === 'Edit') {
            filePath = hookData.tool_input?.file_path;
        } else if (hookData.tool_name === 'MultiEdit') {
            // MultiEdit has multiple files - we'll handle the first one for now
            // You might want to extend this to handle all files
            filePath = hookData.tool_input?.files?.[0]?.file_path;
        }

        if (!filePath) {
            process.exit(0);
        }

        // Resolve absolute path
        const absoluteFilePath = path.resolve(hookData.cwd, filePath);

        // Check if file exists (can't backup what doesn't exist)
        try {
            await fs.access(absoluteFilePath);
        } catch {
            // File doesn't exist, nothing to backup
            process.exit(0);
        }

        // Create backup directory structure
        const backupDir = path.join(hookData.cwd, '.claude', '.edit-baks', hookData.session_id);
        await fs.mkdir(backupDir, { recursive: true });

        // Create backup file path (maintain relative structure)
        const relativePath = path.relative(hookData.cwd, absoluteFilePath);
        const backupFilePath = path.join(backupDir, relativePath);

        // Ensure backup subdirectories exist
        await fs.mkdir(path.dirname(backupFilePath), { recursive: true });

        // Only create backup if it doesn't already exist for this session
        try {
            await fs.access(backupFilePath);
            // Backup already exists for this session, don't overwrite
            process.exit(0);
        } catch {
            // Backup doesn't exist, create it
        }

        // Copy the file
        await fs.copyFile(absoluteFilePath, backupFilePath);

        // Optional: Log the backup (visible in transcript mode with Ctrl-R)
        console.log(`Backed up: ${relativePath}`);

    } catch (error) {
        console.error(`Backup failed: ${error.message}`, process.stderr);
        process.exit(1); // Non-blocking error
    }
}

main();
