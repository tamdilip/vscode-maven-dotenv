# 🔌 [vscode-maven-dotenv](https://github.com/tamdilip/vscode-maven-dotenv)

[![vscode marketplace](https://img.shields.io/badge/vscode-marketplace-green)](https://marketplace.visualstudio.com/items?itemName=tamdilip.vscode-maven-dotenv)

Minimal VSCode Extension to scan the `.env` file properties from the root folder of the project and create/update workspace's `settings.json` on `maven.terminal.customEnv` configuration automatically with the expected format of `environmentVariable` & `value`, which will be prefixed with maven commands when executed from the vscode maven lifecycle.

In addition an entry to `launch.json` also will be made, pointing to the `.env` file under the specific workspace for Java projects to directly to prefix the properties on being executed with `main class`.

That's it, that's all it does. Just that I'm lazy enough to do them manually everytime, this comes in place 🤗 !!
![conversion-flow](https://raw.githubusercontent.com/tamdilip/vscode-maven-dotenv/refs/heads/main/assets/images/conversion.png)

## Installation (local mode)
 - [Download](https://raw.githubusercontent.com/tamdilip/vscode-maven-dotenv/refs/heads/main/assets/vsix/vscode-maven-dotenv-0.0.1.vsix) the `.vsix` pre-compiled extension from this repo [here](https://raw.githubusercontent.com/tamdilip/vscode-maven-dotenv/refs/heads/main/assets/vsix/vscode-maven-dotenv-0.0.1.vsix) or you can fork to compile one with your customizations.
 - Place the downloaded `.vsix` file inside a folder and open the folder in vscode.
 - Right click on `.vsix` file -> Install Extension.

## Usage
 - Place your valid `.env` file with environment properties in root folder.
 - Every change will to `.env` file will be automatically watched actively and updated in `settings.json`'s `maven.terminal.customEnv` config.
 - Optional: Hit `ctrl + shift + p` to open vscode command palatte and search for `Scan Maven DotEnv` to run the scan manually.


 Happy Coding :) !!

 
