// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "angular-quick-jump-in-component-folder" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "angular-quick-jump-in-component-folder.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from Angular Quick Jump in ÇÇÇÇÇÇ Folder!"
      );
    }
  );

  context.subscriptions.push(disposable);

  vscode.window.showInformationMessage("xxxxx");

  function createAccordionMenu(matchingFiles: string[], dirName: string) {
    const viewId = "componentFilesAccordion";
    const treeDataProvider = new (class
      implements vscode.TreeDataProvider<vscode.TreeItem>
    {
      getChildren(
        element?: vscode.TreeItem
      ): vscode.ProviderResult<vscode.TreeItem[]> {
        console.log(`getChildren: ${element}`);
        if (!element) {
          return matchingFiles.map((file) => {
            const treeItem = new vscode.TreeItem(
              file,
              vscode.TreeItemCollapsibleState.None
            );
            treeItem.command = {
              command: "vscode.open",
              title: "Open File",
              arguments: [vscode.Uri.file(path.join(dirName, file))],
            };
            return treeItem;
          });
        }
        return [];
      }
      getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
      }
    })();

    vscode.window.registerTreeDataProvider(viewId, treeDataProvider);

    vscode.window.createTreeView(viewId, {
      treeDataProvider,
      showCollapseAll: true,
    });
  }

  function updateFileButtons() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const document = editor.document;
    const fileName = path.basename(document.fileName);
    const dirName = path.dirname(document.fileName);

    const regex = /([a-zA-Z0-9_-]+)\.component\.([\w_-]+)/;
    const match = fileName.match(regex);
    if (!match) {
      vscode.window.showInformationMessage("not matched");
      return;
    }

    vscode.window.showInformationMessage("this is ng component file");

    const [_, baseName, ext] = match;
    const pattern = new RegExp(`^${baseName}\\.component\\.(\.*)$`);

    fs.readdir(dirName, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(`Files in directory: ${files.join(", ")}`);
      console.log(`Regex pattern: ${pattern}`);

      const matchingFiles = files.filter((file) => {
        const isMatch = pattern.test(file);
        console.log(`Testing file: ${file}, Match: ${isMatch}`);
        return isMatch;
      });

      if (matchingFiles.length === 0) {
        vscode.window.showInformationMessage("No matching files found.");
      } else {
        vscode.window.showInformationMessage(
          `Matching files: ${matchingFiles.join(", ")}`
        );
      }

      createAccordionMenu(matchingFiles, dirName);
    });
  }

  vscode.window.onDidChangeActiveTextEditor(updateFileButtons);
  updateFileButtons();
}

// This method is called when your extension is deactivated
export function deactivate() {}
