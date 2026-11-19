 const scanData = {"root":{"name":"typescript-directory-scanner","path":"C:\\Users\\kekel\\TypeScript\\typescript-directory-scanner","type":"directory","sizeBytes":27321,"lastModified":"2026-11-15T00:06:30.234Z","children":[{"name":".vscode","path":"C:\\Users\\kekel\\TypeScript\\typescript-directory-scanner\\.vscode","type":"directory","sizeBytes":699,"lastModified":"2026-11-15T00:06:30.240Z","children":[{"name":"launch.json","path":"C:\\Users\\kekel\\TypeScript\\typescript-directory-scanner\\.vscode\\launch.json","type":"file","sizeBytes":699,"lastModified":"2026-11-15T00:06:30.241Z"}]},{"name":"src","path":"C:\\Users\\kekel\\TypeScript\\typescript-directory-scanner\\src","type":"directory","sizeBytes":11039,"lastModified":"2026-11-14T21:21:41.431Z","children":[{"name":"exporter.ts","path":"C:\\Users\\kekel\\TypeScript\\typescript-directory-scanner\\src\\exporter.ts","type":"file","sizeBytes":5445,"lastModified":"2026-11-14T22:55:05.902Z"},{"name":"index.ts","path":"C:\\Users\\kekel\\TypeScript\\typescript-directory-scanner\\src\\index.ts","type":"file","sizeBytes":2430,"lastModified":"2026-11-14T22:54:52.917Z"},{"name":"scanner.ts","path":"C:\\Users\\kekel\\TypeScript\\typescript-directory-scanner\\src\\scanner.ts","type":"file","sizeBytes":2649,"lastModified":"2026-11-14T22:54:58.314Z"},{"name":"types.ts","path":"C:\\Users\\kekel\\TypeScript\\typescript-directory-scanner\\src\\types.ts","type":"file","sizeBytes":515,"lastModified":"2026-11-14T21:29:01.926Z"}]},{"name":"package-lock.json","path":"C:\\Users\\kekel\\TypeScript\\typescript-directory-scanner\\package-lock.json","type":"file","sizeBytes":13275,"lastModified":"2026-11-14T23:40:56.883Z"},{"name":"package.json","path":"C:\\Users\\kekel\\TypeScript\\typescript-directory-scanner\\package.json","type":"file","sizeBytes":1036,"lastModified":"2026-11-14T23:40:56.792Z"},{"name":"README.md","path":"C:\\Users\\kekel\\TypeScript\\typescript-directory-scanner\\README.md","type":"file","sizeBytes":969,"lastModified":"2026-11-14T23:36:39.227Z"},{"name":"tsconfig.json","path":"C:\\Users\\kekel\\TypeScript\\typescript-directory-scanner\\tsconfig.json","type":"file","sizeBytes":303,"lastModified":"2026-11-14T23:52:24.571Z"}]},"totalFiles":9,"totalDirectories":3,"totalSizeBytes":27321,"scannedAt":"2026-11-19T11:29:25.450Z"};


    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

            
        document.getElementById('summary').textContent = `Root: ${scanData.root.path} | Folders: ${scanData.totalDirectories} | Files: ${scanData.totalFiles} | Total Size: ${formatBytes(scanData.totalSizeBytes)} | Scanned At: ${scanData.scannedAt}`;


        function renderNode(node) {
            const li = document.createElement('li');
            const label = document.createElement('span');
            label.className = 'node ' + (node.type === 'directory' ? 'dir' : 'file');
            label.title = `Path: ${node.path} | Size: ${formatBytes(node.sizeBytes)} | Last Modified: ${node.lastModified}`;

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