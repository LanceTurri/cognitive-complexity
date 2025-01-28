# Cognitive Complexity VS Code Extension

## Introduction

The **Cognitive Complexity VS Code Extension** is a developer tool designed to enhance code readability and maintainability by analyzing and displaying the cognitive complexity of code blocks directly within the VS Code editor. By using the concept of cognitive complexity — a more accurate metric than traditional cyclomatic complexity — this extension helps developers identify areas of their code that may be difficult to understand and maintain.

Cognitive complexity, as introduced by Sonar, focuses on measuring how challenging a piece of code is to follow, taking into account readability and logical structure. It addresses some of the shortcomings of cyclomatic complexity, making it a better metric for modern codebases.

## Features

- **Inline Cognitive Complexity Scores:**

  - Displays cognitive complexity scores for methods, interfaces, and classes using CodeLens above the relevant code blocks.
  - Underlines the names of blocks (e.g., method names) to visually indicate their complexity level.
  - Configurable display options to suit your workflow.

- **File-Level Complexity Score:**

  - Shows the overall cognitive complexity score of the currently active file in the VS Code status bar.

- **Customizable Settings:**
  - Allows developers to configure how scores are displayed (e.g., enable/disable CodeLens or block decorations).

## Why Cognitive Complexity?

Cognitive complexity measures how understandable and maintainable your code is by focusing on structural and logical readability. Unlike cyclomatic complexity, which only counts the number of possible execution paths, cognitive complexity also accounts for:

- Nesting levels of control structures.
- Logical jumps and breaks in the code flow.
- Excessively long or convoluted methods.

To learn more, check out [Sonar’s whitepaper on Cognitive Complexity](https://www.sonarsource.com/docs/CognitiveComplexity.pdf).

## Demos and Examples

### Example 1: High Complexity Method

```typescript
function processData(input: any): any {
  if (input) {
    for (let i = 0; i < input.length; i++) {
      if (input[i].isValid) {
        try {
          processItem(input[i]);
        } catch (error) {
          console.error('Error processing item', error);
        }
      } else {
        console.warn('Invalid item');
      }
    }
  }
  return null;
}
```

- **Cognitive Complexity Score:** 11
- **Why High Complexity?**
  - Nested `if` and `for` structures.
  - Logical jumps with `try/catch` and `else` branches.
  - Multiple points where the code flow can diverge.

### Example 2: Simple and Maintainable Method

```typescript
function processData(input: any[]): void {
  input.filter((item) => item.isValid).forEach(processItem);
}
```

- **Cognitive Complexity Score:** 0
- **Why Low Complexity?**
  - Flat, linear structure.
  - No nested control structures or branching logic.
