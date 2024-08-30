import * as vscode from 'vscode';
import axios from 'axios';

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {

	// Create an OutputChannel for Vyper Remote Compiler
	outputChannel = vscode.window.createOutputChannel('VRC Output');

	// Create Status Bar Item
	let compileStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	compileStatusBarItem.text = `$(gear) Compile Vyper`;
	compileStatusBarItem.tooltip = 'Compile the current file with VRC';
	compileStatusBarItem.command = 'extension.vyperRemotecompile';
	compileStatusBarItem.show();
    context.subscriptions.push(compileStatusBarItem);

	// Add onDidChangeActiveTextEditor event listener to toggle status bar item
	vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            const document = editor.document;
            if (document.languageId === 'vyper') {
				compileStatusBarItem.show();			
            } else {
                compileStatusBarItem.hide();
            }
        }
    });

	// Add onDidSaveTextDocument event listener
	vscode.workspace.onDidSaveTextDocument(async (document: vscode.TextDocument) => {
		console.log("document.languageId: ", document.languageId);
        if (document.languageId === 'vyper') { // Check if the saved file is a Vyper file
            const config = vscode.workspace.getConfiguration();
            const compileOnSave = config.get<boolean>('vyperRemoteCompile.compileOnSave', false);
            if (compileOnSave) {
                await vyperRemotecompile(document);
            }
        }
    });

	// Register Open Settings Command
	let openSettings = vscode.commands.registerCommand('extension.openVyperRemoteCompilerSettings', () => {
		vscode.commands.executeCommand('workbench.action.openSettings', 'vyperRemoteCompile');
	});
	context.subscriptions.push(openSettings);

	// Register Comiple File Command
    let disposable = vscode.commands.registerCommand('extension.vyperRemotecompile', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
			// Compile Vyper file
			vyperRemotecompile(editor.document);
        } else {
            vscode.window.showErrorMessage('No active file selected.');
        }
    });
	context.subscriptions.push(disposable);

}

export function deactivate() {
    if (outputChannel) {
        outputChannel.dispose();
    }
}


async function vyperRemotecompile(document: vscode.TextDocument) {
	// Check file type (e.g., languageId or extension)
	if (document.languageId !== 'vyper') {
		vscode.window.showErrorMessage('This command is only available for Vyper files.');
		return;
	}
	
	const fileName = document.fileName;
	const config = vscode.workspace.getConfiguration();
	const compilerAddress = config.get<string>('vyperRemoteCompile.compilerAddress') ?? 'http://localhost:8000/compile';

	try {
		const response = await axios.post(compilerAddress, {
			"manifest":"ethpm/3",
			"name": "Vyper Smart Contract",
			"version": document.version,
			"sources": {
				[fileName]: {
					"content": document.getText()
				}
			}
		});
		 // Assume this is a string or large output
		const compiledOutput = response.data;
		// Display the output in the OutputChannel
		outputChannel.clear();
		outputChannel.appendLine(`Compiled Output for ${fileName}:`);
		outputChannel.appendLine("\n");
		outputChannel.appendLine(compiledOutput.output);
		outputChannel.show(true);

	} catch (error) {
		if (axios.isAxiosError(error)) {
			const errorMessage = error.response?.data?.error || "---";
			if (error.status === 400) {
				// Display the error message in the OutputChannel
				outputChannel.clear();
				outputChannel.appendLine(`Compile Error in ${fileName}: ${error.message}`);
				outputChannel.appendLine("\n");
				outputChannel.appendLine(errorMessage);
				outputChannel.show(true);
			} else {
				vscode.window.showErrorMessage(`Error compiling file: ${error.message}`);
			}
		} else if (error instanceof Error) {
			vscode.window.showErrorMessage(`Error compiling file: ${error.message}`);
		} else {
			vscode.window.showErrorMessage('An unexpected error occurred.');
		}
	}
}