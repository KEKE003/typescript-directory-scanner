import * as path from 'path';
import { DirectoryScanner } from './scanner';
import { HtmlExporter } from './exporter';
import { ScanOptions } from './types';

function parseArgs(args: string[]): ScanOptions {
    let targetDir = '.';
    let outputFile = 'directory-map.html';
    let excludeDirs = ['node_modules', '.git'];

    for (const arg of args) {
        if (arg === '--help' || arg === '-h') {
            console.log('Usage: ts-node src/index.ts --targetDir=./path --output=./map.html --exclude=node_modules,.git');
            process.exit(0);
        }

        if (arg.startsWith('--targetDir=')) {
            targetDir = arg.slice('--targetDir='.length);
        }
        else if (arg.startsWith('--target-dir=')) {
            targetDir = arg.slice('--target-dir='.length);
        }
        else if (arg.startsWith('--output=')) {
            outputFile = arg.slice('--output='.length);
        }
        else if (arg.startsWith('--output-file=')) {
            outputFile = arg.slice('--output-file='.length);
        }
        else if (arg.startsWith('--exclude=')) {
            const customExcludes = arg.slice('--exclude='.length)
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);
            excludeDirs = Array.from(new Set([...excludeDirs, ...customExcludes]));
        }
    }

    return {
        targetDir,
        outputFile,
        excludeDirs,
    };
}

async function main(): Promise<void> {
    const options = parseArgs(process.argv.slice(2));
    const absoluteTargetDir = path.resolve(options.targetDir);
    const absoluteOutputFile = path.resolve(options.outputFile);

    console.log(`Scanning directory: ${absoluteTargetDir}`);
    console.log(`Excluding: ${options.excludeDirs.join(', ')}`);

    try {
        const scanner = new DirectoryScanner(options.excludeDirs);
        const summary = await scanner.scan(options.targetDir);
        const exporter = new HtmlExporter();
        await exporter.exportToHtml(summary, absoluteOutputFile);

        console.log(`Scan complete! Found ${summary.totalFiles} files and ${summary.totalDirectories} folders.`);
        console.log(`Interactive map saved to: ${absoluteOutputFile}`);
    } catch (error) {
        console.error('Error during scanning or exporting:', error);
        process.exit(1);
    }
}

main();