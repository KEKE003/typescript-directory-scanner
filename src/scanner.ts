import * as fs from 'fs/promises';
import * as path from 'path';
import { FileSystemNode, ScanSummary } from './types';

export class DirectoryScanner {
    private readonly excludeSet: Set<string>;
    private totalFiles = 0;
    private totalDirectories = 0;

    constructor(excludeDirs: string[] = ['node_modules', '.git']) {
        this.excludeSet = new Set(
            excludeDirs
                .map((dir) => dir.trim())
                .filter(Boolean)
                .map((dir) => dir.toLowerCase())
        );
    }

    public async scan(targetPath: string): Promise<ScanSummary> {
        this.totalFiles = 0;
        this.totalDirectories = 0;

        const resolvedPath = path.resolve(targetPath);
        const rootNode = await this.traverse(resolvedPath);

        return {
            root: rootNode,
            totalFiles: this.totalFiles,
            totalDirectories: this.totalDirectories,
            totalSizeBytes: rootNode.sizeBytes,
            scannedAt: new Date().toISOString(),
        };
    }

    private async traverse(currentPath: string): Promise<FileSystemNode> {
        const stats = await fs.stat(currentPath);
        const name = path.basename(currentPath) || currentPath;

        if (!stats.isDirectory()) {
            this.totalFiles++;
            return {
                name,
                path: currentPath,
                type: 'file',
                sizeBytes: stats.size,
                lastModified: stats.mtime.toISOString(),
            };
        }

        this.totalDirectories++;
        const entries = await fs.readdir(currentPath, { withFileTypes: true });
        const childPromises: Promise<FileSystemNode>[] = [];

        for (const entry of entries) {
            if (this.excludeSet.has(entry.name.toLowerCase())) {
                continue;
            }

            const fullChildPath = path.join(currentPath, entry.name);
            childPromises.push(this.traverse(fullChildPath));
        }

        const children = await Promise.all(childPromises);

        children.sort((a, b) => {
            if (a.type === b.type) {
                return a.name.localeCompare(b.name);
            }
            return a.type === 'directory' ? -1 : 1;
        });

        const totalFolderSize = children.reduce((sum, child) => sum + child.sizeBytes, 0);

        return {
            name,
            path: currentPath,
            type: 'directory',
            sizeBytes: totalFolderSize,
            lastModified: stats.mtime.toISOString(),
            children,
        };
    }
}