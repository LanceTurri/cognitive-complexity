// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  commands,
  window,
  workspace,
  languages,
  type ExtensionContext,
  env,
  Uri,
} from 'vscode';
import {
  getStatusBarComplexity,
  statusBarComplexityTotal,
  updateStatusBarComplexity,
} from './status-bar/status-bar';
import { ComplexityCodelensProvider } from './code-lens/complexity-code-lens-provider';
import {
  COMPLEXITY_CODE_LENS_ACTION,
  COMPLEXITY_CODE_LENS_DISABLE,
  COMPLEXITY_CODE_LENS_ENABLE,
  COMPLEXITY_COMMAND_NAMESPACE,
  COMPLEXITY_DECORATION_DISABLE,
  COMPLEXITY_DECORATION_ENABLE,
  STATUS_BAR_COMPLEXITY_COMMAND_ID,
} from './constants';
import { ComplexityCodeLens } from './code-lens/complexity-code-lens';
import { updateComplexityDecorations } from './decoration/method-name-decoration';

export function activate({ subscriptions }: ExtensionContext) {
  // Status bar commands
  // ============================================================================
  subscriptions.push(
    commands.registerCommand(STATUS_BAR_COMPLEXITY_COMMAND_ID, async () => {
      const complexityScore = await getStatusBarComplexity();
      window.showInformationMessage(
        `The cognitive complexity for the current file is ${complexityScore}.`
      );
      window
        .showInformationMessage(
          `The cognitive complexity for the current file is ${complexityScore}.`,
          'Read About Cognitive Complexity'
        )
        .then((selection) => {
          if (selection === 'Read About Cognitive Complexity') {
            env.openExternal(
              Uri.parse(
                'https://www.sonarsource.com/docs/CognitiveComplexity.pdf'
              )
            );
          }
        });
    })
  );

  // A status bar command MUST be known first, so we register it first and then set it here
  statusBarComplexityTotal.command = STATUS_BAR_COMPLEXITY_COMMAND_ID;
  subscriptions.push(statusBarComplexityTotal);

  // Method Name Decorations
  // ============================================================================
  subscriptions.push(
    commands.registerCommand(
      `${COMPLEXITY_COMMAND_NAMESPACE}.${COMPLEXITY_DECORATION_ENABLE}`,
      () => {
        workspace
          .getConfiguration(`${COMPLEXITY_COMMAND_NAMESPACE}`)
          .update(COMPLEXITY_DECORATION_ENABLE, true, true);
      }
    ),
    commands.registerCommand(
      `${COMPLEXITY_COMMAND_NAMESPACE}.${COMPLEXITY_DECORATION_DISABLE}`,
      () => {
        workspace
          .getConfiguration(`${COMPLEXITY_COMMAND_NAMESPACE}`)
          .update(COMPLEXITY_DECORATION_ENABLE, false, true);
      }
    )
  );
  // CodeLens Configuration
  // ============================================================================
  const codelensProvider = new ComplexityCodelensProvider();
  languages.registerCodeLensProvider('typescript', codelensProvider);

  subscriptions.push(
    commands.registerCommand(
      `${COMPLEXITY_COMMAND_NAMESPACE}.${COMPLEXITY_CODE_LENS_ENABLE}`,
      () => {
        workspace
          .getConfiguration(`${COMPLEXITY_COMMAND_NAMESPACE}`)
          .update(COMPLEXITY_CODE_LENS_ENABLE, true, true);
      }
    ),
    commands.registerCommand(
      `${COMPLEXITY_COMMAND_NAMESPACE}.${COMPLEXITY_CODE_LENS_DISABLE}`,
      () => {
        workspace
          .getConfiguration(`${COMPLEXITY_COMMAND_NAMESPACE}`)
          .update(COMPLEXITY_CODE_LENS_ENABLE, false, true);
      }
    ),
    commands.registerCommand(
      `${COMPLEXITY_COMMAND_NAMESPACE}.${COMPLEXITY_CODE_LENS_ACTION}`,
      (args: unknown) => {
        if (args instanceof ComplexityCodeLens) {
          window
            .showInformationMessage(
              `The cognitive complexity score for this block is ${args.score}.`,
              'Read About Cognitive Complexity'
            )
            .then((selection) => {
              if (selection === 'Read About Cognitive Complexity') {
                env.openExternal(
                  Uri.parse(
                    'https://www.sonarsource.com/docs/CognitiveComplexity.pdf'
                  )
                );
              }
            });
        }
      }
    )
  );

  // User Action Listeners
  // ============================================================================
  subscriptions.push(
    window.onDidChangeActiveTextEditor(() => updateStatusBarComplexity(false)),
    window.onDidChangeActiveTextEditor(updateComplexityDecorations),
    workspace.onDidSaveTextDocument(() => updateStatusBarComplexity(true)),
    workspace.onDidSaveTextDocument(updateComplexityDecorations),
    workspace.onDidChangeConfiguration(updateComplexityDecorations)
  );

  // First time start up
  // ============================================================================
  // We need to update the status bar manually the first time the extension runs
  updateStatusBarComplexity(true);
  updateComplexityDecorations();
}

// This method is called when your extension is deactivated
export function deactivate() {}
