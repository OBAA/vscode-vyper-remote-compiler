# Vyper Remote Compiler Extension


## Overview

The **Vyper Remote Compiler** extension for Visual Studio Code enables seamless compilation of Vyper smart contracts via a remote compiler service. With this extension, you can easily compile your Vyper `.vy` files directly from within VS Code, utilizing a configurable compiler endpoint.


## Features

- **Compile Vyper Files**: Compile Vyper smart contracts from within VS Code.
- **Custom Compiler Address**: Configure the remote compiler endpoint through the extension settings.
- **Compile on Save**: Optionally trigger compilation automatically when saving a Vyper file.
- **Status Bar Integration**: Easily compile the current file using a status bar command.
- **Output Display**: View compilation results and errors in the VS Code Output Channel.


## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
3. Search for **Vyper Remote Compiler**.
4. Click **Install**.

Alternatively, you can install the extension using the command line:

``` bash code --install-extension vyper-remote-compiler 
```


## Configuration

To configure the extension, add the following settings to your `settings.json` file:

```json
{
    "vyperRemoteCompile.compilerAddress": "http://localhost:8000/compile",
    "vyperRemoteCompile.compileOnSave": true
}
```

`vyperRemoteCompile.compilerAddress`: The URL of your remote Vyper compiler service.
`vyperRemoteCompile.compileOnSave`: Set to true to enable automatic compilation on file save.


## Commands

- **Compile Vyper File**: Trigger compilation of the currently active Vyper file.
    - **Command ID**: extension.vyperRemotecompile
- **Open Settings**: Open the settings for the Vyper Remote Compiler extension.
    - **Command ID**: extension.openVyperRemoteCompilerSettings


## Usage

1. Open a Vyper file (.vy) in VS Code.
2. Use the command Compile Vyper File from the Command Palette (Ctrl+Shift+P) or click on the Compile Vyper button in the Status Bar to compile the file.
3. If configured, the extension will also automatically compile the file when you save it.


## Testing

To run the extension tests:
1. Open the terminal in VS Code.
2. Run npm test or npx vscode-test.

Tests include:
- Checking if commands are properly registered.
- Verifying that the compile command does not run for non-Vyper files.
- Ensuring that the compile-on-save functionality works as expected.


## Development

To contribute to the development of this extension:

1. Clone the repository:

``` bash
##
        git clone https://gitea.svc.obaa.cloud/obaa/vyper-remote-compiler.git
```
2. Install dependencies:

```bash
Copy code
npm install
```
3. Run the extension locally:

```bash
Copy code
code .
```
4. Debug and test the extension using VS Code's built-in debugging features.


## License

This project is licensed under the MIT License.


## Contact
For issues or feature requests, please open an issue on the GitHub repository.


### Key Sections:
- **Overview**: A brief description of what the extension does.
- **Features**: Highlights the main functionalities of the extension.
- **Installation**: Instructions on how to install the extension.
- **Configuration**: Details on configuring the extension settings.
- **Commands**: Lists available commands and their IDs.
- **Usage**: How to use the extension in VS Code.
- **Testing**: Instructions for running tests.
- **Development**: Guidelines for contributing to the extension.
- **License**: Licensing information.
- **Contact**: Where to report issues or request features.
