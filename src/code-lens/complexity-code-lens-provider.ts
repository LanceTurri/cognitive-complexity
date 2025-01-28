import * as vscode from 'vscode';
import { getFlattenedFileComplexity } from '../complexity';
import {
  COMPLEXITY_CODE_LENS_ENABLE,
  COMPLEXITY_COMMAND_NAMESPACE,
} from '../constants';
import { ContainerOutput } from 'cognitive-complexity-ts';
import { ComplexityCodeLens } from './complexity-code-lens';

export class ComplexityCodelensProvider implements vscode.CodeLensProvider {
  private codeLenses: vscode.CodeLens[] = [];
  private _onDidChangeCodeLenses: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses: vscode.Event<void> =
    this._onDidChangeCodeLenses.event;

  constructor() {
    vscode.workspace.onDidChangeConfiguration((_) => {
      this._onDidChangeCodeLenses.fire();
    });
  }

  public async provideCodeLenses(
    document: vscode.TextDocument,
    _token: vscode.CancellationToken
  ): Promise<vscode.CodeLens[]> {
    if (
      vscode.workspace
        .getConfiguration(COMPLEXITY_COMMAND_NAMESPACE)
        .get(COMPLEXITY_CODE_LENS_ENABLE, true)
    ) {
      this.codeLenses = [];

      const fileComplexityEntries = await getFlattenedFileComplexity(
        document.uri.fsPath
      );

      fileComplexityEntries.map((complexityContainer: ContainerOutput) => {
        const position = new vscode.Position(complexityContainer.line - 1, 0);
        const range = new vscode.Range(position, position);

        if (range) {
          this.codeLenses.push(
            new ComplexityCodeLens(complexityContainer, range)
          );
        }
      });

      return this.codeLenses;
    }

    return [];
  }

  public resolveCodeLens(
    codeLens: vscode.CodeLens,
    _token: vscode.CancellationToken
  ) {
    if (
      vscode.workspace
        .getConfiguration(COMPLEXITY_COMMAND_NAMESPACE)
        .get(COMPLEXITY_CODE_LENS_ENABLE, true) &&
      codeLens instanceof ComplexityCodeLens
    ) {
      codeLens.command = {
        title: codeLens.title,
        command: `${COMPLEXITY_COMMAND_NAMESPACE}.codelensAction`,
        arguments: [codeLens],
      };

      return codeLens;
    }

    return null;
  }
}
