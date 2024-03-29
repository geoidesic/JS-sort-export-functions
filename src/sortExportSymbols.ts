import * as babelParser from '@babel/parser';
import * as babelTraverse from '@babel/traverse';

export function sortExportSymbols(inputCode: string): string {
    return getExportBlocks(inputCode);
}


function getExportBlocks(inputCode: string): string {
    const exportDeclarations: string[] = [];
    let nonExportCode = inputCode; // Start with the full input code

    // Parse the input code
    const ast = babelParser.parse(inputCode, {
        sourceType: 'module',
    });

    // Traverse the AST to find export declarations
    babelTraverse.default(ast, {
        ExportNamedDeclaration(path) {
            // If it's an export declaration, add it to the exportDeclarations array
            let start = path.node.start ?? 0;
            const end = path.node.end ?? 0;
            const comments = path.node.leadingComments;
            if(comments) {
                for (const comment of comments) {
                    if (comment.end != null && comment.end <= start) {
                        // Check if comment.start is defined before accessing it
                        const commentStart = comment.start ?? 0;
                        if(comment.start) {
                            start = comment.start;
                        }
                    }
                }
            }
            let exportBlock = inputCode.substring(start, end);
            exportDeclarations.push(exportBlock);

            // Remove the export block from non-export code
            nonExportCode = nonExportCode.replace(exportBlock, '');
        },
        ExportDefaultDeclaration(path) {
            // If it's an export declaration, add it to the exportDeclarations array
            let start = path.node.start ?? 0;
            const end = path.node.end ?? 0;
            const comments = path.node.leadingComments;
            if(comments) {
                for (const comment of comments) {
                    if (comment.end != null && comment.end <= start) {
                        // Check if comment.start is defined before accessing it
                        const commentStart = comment.start ?? 0;
                        if(comment.start) {
                            start = comment.start;
                        }
                    }
                }
            }
            let exportBlock = inputCode.substring(start, end);
            exportDeclarations.push(exportBlock);

            // Remove the export block from non-export code
            nonExportCode = nonExportCode.replace(exportBlock, '');
        },
    });

    // Sort the export declarations alphabetically
    const sortedExports = exportDeclarations.sort();

    // Join the sorted export declarations with the non-export code
    const sortedCode = [nonExportCode.trim(), ...sortedExports].join('\n\n').trim();

    return sortedCode;
}
