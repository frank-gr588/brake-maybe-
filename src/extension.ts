import * as vscode from 'vscode';
import { exec } from 'child_process';

let terminal: vscode.Terminal | undefined; 

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.compileWithMessage', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showErrorMessage('Нет открытого файла для компиляции.');
            return;
        }

        const filePath = activeEditor.document.fileName;

        if (!terminal) {
            terminal = vscode.window.createTerminal("GCC Compiler"); 
        }

        // Выполняем команду компиляции
        terminal.sendText(`gcc "${filePath}" -o output.exe`);
        
        // Запускаем исполняемый файл после компиляции
        terminal.sendText('./output.exe');
        
        // Показать терминал на переднем плане
        terminal.show();

        const command = `gcc "${filePath}" -o output.exe`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage('Ошибка компиляции: ' + stderr); 
                vscode.window.showInformationMessage('Может быть пора отдохнуть?');
                
                const randomNumber = Math.random();
                if (randomNumber < 0.01) { // 1% вероятность
                    vscode.window.showInformationMessage('VS Code сейчас закроется...');
                    const Url = 'https://www.youtube.com/live/jfKfPfyJRdk?si=U_PRWbGtDZlK2qbB';
                    vscode.env.openExternal(vscode.Uri.parse(Url));
                    setTimeout(() => {
                        vscode.commands.executeCommand('workbench.action.quit');
                    }, 10000); // Задержка перед закрытием
                }
            } else {
                vscode.window.showInformationMessage('Компиляция прошла успешно: ' + stdout);
            }
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    // Закрываем и удаляем терминал 
    if (terminal) {
        terminal.dispose();
        terminal = undefined; 
    }
}
