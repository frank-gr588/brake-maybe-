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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const child_process_1 = require("child_process");
let terminal;
function activate(context) {
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
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
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
            }
            else {
                vscode.window.showInformationMessage('Компиляция прошла успешно: ' + stdout);
            }
        });
    });
    context.subscriptions.push(disposable);
}
function deactivate() {
    // Закрываем и удаляем терминал 
    if (terminal) {
        terminal.dispose();
        terminal = undefined;
    }
}
//# sourceMappingURL=extension.js.map