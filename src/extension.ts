import * as vscode from 'vscode';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {

	console.log('"vscode-maven-dotenv" extension is now active!');

	const scanAndUpdateEnv = () => {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

		if (workspaceFolder) {
			const launchJsonPath = path.join(workspaceFolder, '.vscode', 'launch.json');
			const settingsJsonPath = path.join(workspaceFolder, '.vscode', 'settings.json');
			ensureLaunchJsonExists(launchJsonPath, workspaceFolder);
			updateMavenEnvInSettingsJson(settingsJsonPath, workspaceFolder);
		} else {
			vscode.window.showInformationMessage('No .env file found in this root folder!');
		}
	};

	const scanDotEnv = vscode.commands.registerCommand('vscode-maven-dotenv.scan-dot-env', scanAndUpdateEnv);
	context.subscriptions.push(scanDotEnv);

	const watcher = vscode.workspace.createFileSystemWatcher('**/.env');

	watcher.onDidCreate(file => {
		console.log(`New .env file created: ${file}`);
		scanAndUpdateEnv();
	});

	watcher.onDidChange(file => {
		console.log(`.env file changed: ${file}`);
		scanAndUpdateEnv();
	});

	watcher.onDidDelete(file => {
		console.log(`.env file deleted: ${file}`);
		scanAndUpdateEnv();
	});
}

// Ensure launch.json exists and add entry for the .env file
function ensureLaunchJsonExists(launchJsonPath: string, workspaceFolder: string) {
	if (!fs.existsSync(launchJsonPath)) {
		// If launch.json does not exist, create it
		fs.mkdirSync(path.dirname(launchJsonPath), { recursive: true });

		const initialLaunchConfig = {
			version: "0.2.0",
			configurations: []
		};

		fs.writeFileSync(launchJsonPath, JSON.stringify(initialLaunchConfig, null, 2));
	}

	// Read the existing launch.json content
	const launchConfig = JSON.parse(fs.readFileSync(launchJsonPath, 'utf8'));

	// Check if there's already a configuration with the envFile set
	const envFileConfig = launchConfig.configurations.find(
		(config: any) => config.envFile === "${workspaceFolder}/.env"
	);

	if (!envFileConfig) {
		// Add new configuration for Java with envFile set to .env in root
		const newConfig = {
			type: "java",
			name: "Launch Java Program with .env",
			request: "launch",
			cwd: "${workspaceFolder}",
			mainClass: "com.mySample.App",
			envFile: "${workspaceFolder}/.env"
		};

		launchConfig.configurations.push(newConfig);

		// Write back the updated launch.json
		fs.writeFileSync(launchJsonPath, JSON.stringify(launchConfig, null, 2));

		vscode.window.showInformationMessage('Updated launch.json with .env configuration !');
	}
}

// Update settings.json with customEnv variables for Maven
function updateMavenEnvInSettingsJson(settingsJsonPath: string, workspaceFolder: string) {
	const envFilePath = path.join(workspaceFolder, '.env');

	if (!fs.existsSync(envFilePath)) {
		vscode.window.showWarningMessage('.env file does not exist.');
		return;
	}

	// Parse the .env file
	const envConfig = dotenv.parse(fs.readFileSync(envFilePath));

	if (!fs.existsSync(settingsJsonPath)) {
		// If settings.json does not exist, create it
		fs.mkdirSync(path.dirname(settingsJsonPath), { recursive: true });

		const initialSettingsConfig = {
			"maven.terminal.customEnv": {}
		};

		fs.writeFileSync(settingsJsonPath, JSON.stringify(initialSettingsConfig, null, 2));
	}

	// Read the existing settings.json content
	const settingsConfig = JSON.parse(fs.readFileSync(settingsJsonPath, 'utf8'));

	// Add or update the maven.terminal.customEnv field with .env variables
	if (!settingsConfig['maven.terminal.customEnv'] || !Object.keys(settingsConfig['maven.terminal.customEnv']).length) {
		settingsConfig['maven.terminal.customEnv'] = [];
	}

	const existingMavenEnvs = settingsConfig['maven.terminal.customEnv'].reduce((a: any, v: any) => {
		a[v.environmentVariable] = v.value;
		return a;
	}, {});

	const mergedEnvs = { ...existingMavenEnvs, ...envConfig };

	settingsConfig['maven.terminal.customEnv'] = Object.keys(mergedEnvs).map(environmentVariable => {
		const value = envConfig[environmentVariable];
		if (value) {
			return { environmentVariable, value };
		}
	}).filter(Boolean);

	// Write back the updated settings.json
	fs.writeFileSync(settingsJsonPath, JSON.stringify(settingsConfig, null, 2));

	vscode.window.showInformationMessage('Updated settings.json with Maven customEnv variables !');
}

export function deactivate() { }
