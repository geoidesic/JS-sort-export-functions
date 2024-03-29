"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortExportSymbols = void 0;
const babelParser = __importStar(require("@babel/parser"));
const babelTraverse = __importStar(require("@babel/traverse"));
function sortExportSymbols(inputCode) {
    const exportDeclarations = [];
    let nonExportCode = '';
    // Parse the input code
    const ast = babelParser.parse(inputCode, {
        sourceType: 'module',
    });
    // Traverse the AST to find export declarations
    babelTraverse.default(ast, {
        ExportNamedDeclaration(path) {
            // If it's an export declaration, add it to the exportDeclarations array
            const start = path.node.start ?? 0;
            const end = path.node.end ?? 0;
            exportDeclarations.push(inputCode.substring(start, end));
        },
        ExportDefaultDeclaration(path) {
            // If it's an export default declaration, add it to the exportDeclarations array
            const start = path.node.start ?? 0;
            const end = path.node.end ?? 0;
            exportDeclarations.push(inputCode.substring(start, end));
        },
        // Preserve non-export code
        Program(path) {
            const programStart = path.node.start ?? 0;
            const programEnd = path.node.end ?? 0;
            nonExportCode = inputCode.substring(programStart, programEnd);
        },
    });
    // Sort the export declarations alphabetically
    const sortedExports = exportDeclarations.sort();
    // Join the sorted export declarations with the non-export code
    const sortedCode = [nonExportCode, ...sortedExports].join('\n');
    return sortedCode;
}
exports.sortExportSymbols = sortExportSymbols;
//# sourceMappingURL=sortExportSymbols.js.map