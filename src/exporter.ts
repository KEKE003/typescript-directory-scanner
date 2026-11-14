import * as fs from 'fs/promises';
import { ScanSummary } from './types';

export class HtmlExporter {
    public async exportToHtml(summary: ScanSummary, outputPath: string): Promise<void> {
        const serializedData = JSON.stringify(summary);
        const htmlContent = this.buildHtmlTemplate(serializedData);
        await fs.writeFile(outputPath, htmlContent, 'utf-8');
    }

    private buildHtmlTemplate(jsonPayload: string): string {
        return `
            <!DOCTYPE html>
            <html lang="en-US">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Directory Map</title>
                <style>
                    body {
                        font-family: system-ui, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        padding: 20px;
                    }
                    .header {
                        margin-bottom: 20px;
                        border-bottom: 2px solid #ccc;
                        padding-bottom: 10px;
                    }
                    .stats {
                        color: #555;
                        font-size: 0.9em;
                        margin-bottom: 20px;
                    }
                    ul {
                        list-style-type: none;
                        padding-left: 20px;
                        border-left: 1px solid #ccc;
                    }
                    li {
                        margin: 5px 0;
                        position: relative;
                    }
                    .node {
                        cursor: pointer;
                        padding: 5px;
                        border-radius: 4px;
                        transition: background-color 0.3s;
                        display: inline-block;
                    }
                    .node:hover {
                        background-color: #e0e0e0;
                    }
                    .dir {
                        font-weight: bold;
                        color: #2a7ae2;
                    }
                    .file {
                        color: #555;
                    }
                    .badge {
                        font-size: 0.8em;
                        color: #666;
                        background: #ededed;
                        border-radius: 3px;
                        padding: 2px 5px;
                        margin-left: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Directory Map</h1>
                    <div id="summary" class="stats"></div>
                </div>
                <div id="tree-root"></div>

                <script>
                    const scanData = ${jsonPayload};

                    function formatBytes(bytes) {
                        if (bytes === 0) return '0 Bytes';
                        const k = 1024;
                        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                        const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
                        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
                    }

                    document.getElementById('summary').textContent = \`Root: \${scanData.root.path} | Folders: \${scanData.totalDirectories} | Files: \${scanData.totalFiles} | Total Size: \${formatBytes(scanData.totalSizeBytes)} | Scanned At: \${scanData.scannedAt}\`;

                    function renderNode(node) {
                        const li = document.createElement('li');
                        const label = document.createElement('span');
                        label.className = 'node ' + (node.type === 'directory' ? 'dir' : 'file');
                        label.title = \`Path: \${node.path} | Size: \${formatBytes(node.sizeBytes)} | Last Modified: \${node.lastModified}\`;

                        const icon = node.type === 'directory' ? '📁' : '📄';
                        label.textContent = icon + ' ' + node.name;

                        const sizeBadge = document.createElement('span');
                        sizeBadge.className = 'badge';
                        sizeBadge.textContent = formatBytes(node.sizeBytes);
                        label.appendChild(sizeBadge);
                        li.appendChild(label);

                        if (node.type === 'directory' && Array.isArray(node.children) && node.children.length > 0) {
                            const childList = document.createElement('ul');
                            node.children.forEach((child) => {
                                childList.appendChild(renderNode(child));
                            });
                            li.appendChild(childList);
                        }

                        return li;
                    }

                    const rootList = document.createElement('ul');
                    rootList.appendChild(renderNode(scanData.root));
                    document.getElementById('tree-root').appendChild(rootList);
                </script>
            </body>
            </html>
        `;
    }
}