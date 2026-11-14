export type NodeType = 'file' | 'directory';

export interface FileSystemNode {
    name: string;
    path: string;
    type: NodeType;
    sizeBytes: number;
    lastModified: string;
    children?: FileSystemNode[];
}

export interface ScanOptions {
    targetDir: string;
    outputFile: string;
    excludeDirs: string[];
}

export interface ScanSummary {
    root: FileSystemNode;
    totalFiles: number;
    totalDirectories: number;
    totalSizeBytes: number;
    scannedAt: string;
}