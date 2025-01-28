import { ContainerOutput } from 'cognitive-complexity-ts';
import { CodeLens, Range } from 'vscode';

export class ComplexityCodeLens extends CodeLens {
  public title: string;
  public score: number;

  constructor(container: ContainerOutput, range: Range) {
    super(range);

    this.title = `Cognitive Complexity: ${container.score}`;
    this.score = container.score;
  }
}
