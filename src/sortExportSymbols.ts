import * as babelParser from '@babel/parser';
import * as babelTraverse from '@babel/traverse';

export function sortExportSymbols(inputCode: string): string {
    return getExportBlocks(inputCode);
}


function getExportBlocks(inputCode: string): string {
    const exportDeclarations: string[] = [];
    const blockDeclarations: string[] = [];
    let nonExportCode = inputCode; // Start with the full input code

    // Parse the input code
    const ast = babelParser.parse(inputCode, {
        sourceType: 'module',
    });

    // Traverse the AST to find export declarations
    babelTraverse.default(ast, {
        ExportNamedDeclaration(path) {
            // If it's an export declaration, add it to the exportDeclarations array
            let exportStart = path.node.start ?? 0;
            let blockStart = exportStart;
            const end = path.node.end ?? 0;
            const comments = path.node.leadingComments;
            if (comments) {
                for (const comment of comments) {
                    if (comment.end != null && comment.end <= blockStart) {
                        // Check if comment.start is defined before accessing it
                        const commentStart = comment.start ?? 0;
                        if (comment.start) {
                            blockStart = comment.start;
                        }
                    }
                }
            }
            let block = inputCode.substring(blockStart, end);
            let exportBlock = inputCode.substring(exportStart, end);
            exportDeclarations.push(exportBlock);
            blockDeclarations.push(block);

            // Remove the export block from non-export code
            nonExportCode = nonExportCode.replace(block, '');

        },
        ExportDefaultDeclaration(path) {
           
        },
    });

    // Object to store original indexes
    const originalIndexes: Record<number, number> = {};


    // Sort the export declarations alphabetically
    const sortedExports = exportDeclarations.slice().sort((a, b) => {
        // Use localeCompare to ensure correct alphabetical sorting
        return a.localeCompare(b);
    });

    // Populate originalIndexes object
    exportDeclarations.forEach((exportDeclaration, index) => {
        // Find index of exportDeclaration in sorted array
        const sortedIndex = sortedExports.indexOf(exportDeclaration);
        // Store original index and sorted index
        originalIndexes[sortedIndex] =  index;
    });

    // return JSON.stringify({sortedExports, exportDeclarations, blockDeclarations, originalIndexes});


    // Join the sorted export declarations with the non-export code
    const sortedCode = [nonExportCode.trim(), ...sortedExports.map((_,index) => {return blockDeclarations[originalIndexes[index]]})].join('\n\n').trim();

    return sortedCode;
}
