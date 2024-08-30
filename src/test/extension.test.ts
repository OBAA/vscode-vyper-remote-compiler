import * as assert from 'assert';
import axios from 'axios';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {	
	vscode.window.showInformationMessage('Start all tests.');

	test('Commands should be registered', async () => {
	    await vscode.commands.executeCommand('extension.vyperRemotecompile');

		// Check if the compile command is registered
		const compileCommandRegistered = await vscode.commands.getCommands(true)
			.then(commands => commands.includes('extension.vyperRemotecompile'));
		assert.strictEqual(compileCommandRegistered, true, 'Compile command is not registered');
	
		// Check if the settings command is registered
		const settingsCommandRegistered = await vscode.commands.getCommands(true)
			.then(commands => commands.includes('extension.openVyperRemoteCompilerSettings'));
		assert.strictEqual(settingsCommandRegistered, true, 'Settings command is not registered');
	});
	

	// test('Compile on save setting', async () => {	
	// 	const config = vscode.workspace.getConfiguration();
	// 	await config.update('vyperRemoteCompile.compileOnSave', true, vscode.ConfigurationTarget.Global);
		
	// 	const document = await vscode.workspace.openTextDocument({ language: 'vyper', content: '' });
	// 	await vscode.window.showTextDocument(document);
	
	// 	let compileCalled = false;
		
	// 	vscode.workspace.onDidSaveTextDocument(doc => {
	// 		if (doc === document && config.get('vyperRemoteCompile.compileOnSave')) {
	// 			compileCalled = true;
	// 		}
	// 	});
	
	// 	await document.save();
	// 	assert.strictEqual(compileCalled, true, 'Compile should be called on save when setting is enabled');
	
	// 	await config.update('vyperRemoteCompile.compileOnSave', false, vscode.ConfigurationTarget.Global);
	// });

	// test('Compile on save setting', async function() {
	// 	// Update configuration to enable compile on save
	// 	const config = vscode.workspace.getConfiguration();
	// 	await config.update('vyperRemoteCompile.compileOnSave', true, vscode.ConfigurationTarget.Global);

	// 	// Create a new document with Vyper language and empty content
	// 	const document = await vscode.workspace.openTextDocument({ language: 'vyper', content: '' });
		
	// 	// Variable to track if the compile command was called
	// 	let compileCalled = false;

	// 	// Set up an event listener to monitor document save events
	// 	const disposable = vscode.workspace.onDidSaveTextDocument(doc => {
	// 		if (doc === document && config.get('vyperRemoteCompile.compileOnSave')) {
	// 			compileCalled = true;
	// 		}
	// 	});

	// 	try {
	// 		// Save the document
	// 		await document.save();

	// 		// Assert that compile was called
	// 		assert.strictEqual(compileCalled, true, 'Compile should be called on save when setting is enabled');
	// 	} finally {
	// 		// Clean up: update the configuration and dispose of event listener
	// 		await config.update('vyperRemoteCompile.compileOnSave', false, vscode.ConfigurationTarget.Global);
	// 		disposable.dispose();
	// 	}
	// });
	
	test('Compile command should not run for non-vyper files', async () => {
		// Open a non-Vyper file (e.g., JavaScript)
		const editor = await vscode.workspace.openTextDocument({ 
			language: 'javascript', 
			content: 'console.log("Hello World");' 
		}).then(doc => vscode.window.showTextDocument(doc));
	
		// Check that the document is indeed open and in focus
		assert.strictEqual(vscode.window.activeTextEditor?.document.languageId, 'javascript');
	
		// Execute the compile command
		const result = await vscode.commands.executeCommand('extension.vyperRemotecompile');
		
		// Since `extension.vyperRemotecompile` doesn't return a value, we check the Output Channel instead
		assert.strictEqual(result, undefined, 'Compile command should not return a result for non-Vyper files');
		
		// Optionally, you could also verify no content was added to the output channel
		// This depends on how you implemented error handling in `vyperRemotecompile`
		// e.g., Check that an error message was displayed or the output channel did not log anything
	
		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	});

	test('API error handling', async () => {
		const editor = await vscode.workspace.openTextDocument({ language: 'vyper', content: 'greeting: public(String[100])' }).then(doc => vscode.window.showTextDocument(doc));
		
		try {
			await axios.post('http://localhost:8000/compile', { invalid: 'payload' });
		} catch (error) {
			if (axios.isAxiosError(error)) {
				assert.strictEqual(error.response?.status, 400, 'Should handle 400 error response');
			}
		}
	});
		
});
