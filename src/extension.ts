// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {
  sortExportSymbols,
} from './sortExportSymbols'; // Import the sorting function

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


	let disposable = vscode.commands.registerCommand('js-sort-export-functions.sortExportSymbols', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
				const document = editor.document;
				const selection = editor.selection; // Get the current selection
				const selectedText = document.getText(selection); // Extract the selected text
				const sortedText = sortExportSymbols(selectedText); // Use the sorting function
				editor.edit((editBuilder) => {
						editBuilder.replace(selection, sortedText); // Replace the selected text
				});
		}
});

context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
