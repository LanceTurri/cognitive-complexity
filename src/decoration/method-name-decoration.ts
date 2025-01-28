import {
  DecorationOptions,
  OverviewRulerLane,
  Range,
  window,
  workspace,
} from 'vscode';
import { getFlattenedFileComplexity } from '../complexity';
import {
  COMPLEXITY_COMMAND_NAMESPACE,
  COMPLEXITY_DECORATION_ENABLE,
} from '../constants';

const sharedDecorationProperties = {
  borderWidth: '0 0 2px 0',
  borderStyle: 'dashed',
  overviewRulerColor: 'purple',
  overviewRulerLane: OverviewRulerLane.Center,
};

// create a decorator type that we use to decorate small numbers
const highComplexityDecorationType = window.createTextEditorDecorationType({
  ...sharedDecorationProperties,
  light: {
    borderColor: 'red',
  },
  dark: {
    borderColor: 'red',
  },
});

const mediumComplexityDecorationType = window.createTextEditorDecorationType({
  ...sharedDecorationProperties,
  light: {
    borderColor: 'orange',
  },
  dark: {
    borderColor: 'orange',
  },
});

const lowComplexityDecorationType = window.createTextEditorDecorationType({
  ...sharedDecorationProperties,
  light: {
    borderColor: 'yellow',
  },
  dark: {
    borderColor: 'yellow',
  },
});

export const updateComplexityDecorations = async () => {
  if (
    !workspace
      .getConfiguration(COMPLEXITY_COMMAND_NAMESPACE)
      .get(COMPLEXITY_DECORATION_ENABLE, true)
  ) {
    return;
  }

  if (!window.activeTextEditor) {
    return;
  }

  const activeEditor = window.activeTextEditor;
  const documentUri = activeEditor.document.uri;

  if (documentUri?.scheme !== 'file') {
    return;
  }

  // Get the text of the active editor
  const text = activeEditor.document.getText();

  // Iterate through the complexity entries and find the location of each method name in the text
  const activeFileComplexity = await getFlattenedFileComplexity(
    documentUri.fsPath
  );

  const lowComplexityDecorations: DecorationOptions[] = [];
  const mediumComplexityDecorations: DecorationOptions[] = [];
  const highComplexityDecorations: DecorationOptions[] = [];

  activeFileComplexity.forEach((complexityContainer) => {
    // If the complexity score is 0, we don't want to decorate it
    if (complexityContainer.score === 0) {
      return;
    }

    const methodName = complexityContainer.name;
    const regEx = new RegExp(`\\b${methodName}\\b`, 'g');
    const matches = regEx.exec(text);

    if (!matches) {
      return;
    }

    const startOffset = activeEditor.document.positionAt(matches.index);
    const endOffset = activeEditor.document.positionAt(
      matches.index + methodName.length
    );

    const range = new Range(startOffset, endOffset);

    if (range) {
      if (complexityContainer.score > 10) {
        highComplexityDecorations.push({
          range,
          hoverMessage: `Cognitive Complexity: ${complexityContainer.score}`,
        });
      } else if (complexityContainer.score > 5) {
        mediumComplexityDecorations.push({
          range,
          hoverMessage: `Cognitive Complexity: ${complexityContainer.score}`,
        });
      } else {
        lowComplexityDecorations.push({
          range,
          hoverMessage: `Cognitive Complexity: ${complexityContainer.score}`,
        });
      }
    }

    activeEditor.setDecorations(
      lowComplexityDecorationType,
      lowComplexityDecorations
    );
    activeEditor.setDecorations(
      mediumComplexityDecorationType,
      mediumComplexityDecorations
    );
    activeEditor.setDecorations(
      highComplexityDecorationType,
      highComplexityDecorations
    );
  });
};

// function updateDecorations() {

//   const regEx = /\d+/g;
//   const smallNumbers: DecorationOptions[] = [];
//   const largeNumbers: DecorationOptions[] = [];
//   let match;
//   while ((match = regEx.exec(text))) {
//     const startPos = activeEditor.document.positionAt(match.index);
//     const endPos = activeEditor.document.positionAt(
//       match.index + match[0].length
//     );
//     const decoration = {
//       range: new Range(startPos, endPos),
//       hoverMessage: 'Number **' + match[0] + '**',
//     };
//     if (match[0].length < 3) {
//       smallNumbers.push(decoration);
//     } else {
//       largeNumbers.push(decoration);
//     }
//   }
//   activeEditor.setDecorations(smallNumberDecorationType, smallNumbers);
//   activeEditor.setDecorations(largeNumberDecorationType, largeNumbers);
// }
