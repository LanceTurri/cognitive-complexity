import { StatusBarAlignment, window } from 'vscode';
import { getFileComplexity } from '../complexity';

export let statusBarComplexityTotal = window.createStatusBarItem(
  StatusBarAlignment.Right,
  100
);

export const updateStatusBarComplexity = async (
  forceRecalculation?: boolean
): Promise<void> => {
  const activeFileComplexity = await getStatusBarComplexity(forceRecalculation);

  if (!activeFileComplexity) {
    statusBarComplexityTotal.hide();
    return;
  }

  if (activeFileComplexity > 0) {
    statusBarComplexityTotal.text = `Complexity: ${activeFileComplexity}`;
    statusBarComplexityTotal.show();
  } else {
    statusBarComplexityTotal.hide();
  }
};

export const getStatusBarComplexity = async (
  forceRecalculation = false
): Promise<number | undefined> => {
  if (!window.activeTextEditor) {
    return;
  }

  const documentUri = window.activeTextEditor.document.uri;

  if (documentUri?.scheme !== 'file') {
    return;
  }

  const activeFileComplexity = await getFileComplexity(
    documentUri.fsPath,
    forceRecalculation
  );

  return activeFileComplexity.score;
};
