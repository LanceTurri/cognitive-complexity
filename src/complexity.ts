import {
  ContainerOutput,
  FileOutput,
  getFileOutput,
} from 'cognitive-complexity-ts';

const complexityMap = new Map<string, FileOutput>();

const calculateFileComplexity = async (
  filePath: string
): Promise<FileOutput> => {
  const complexityResult: FileOutput = await getFileOutput(filePath);
  complexityMap.set(filePath, complexityResult);

  return complexityResult;
};

export const getFileComplexity = async (
  filePath: string,
  forceNewCalculation = false
): Promise<FileOutput> => {
  if (!forceNewCalculation && complexityMap.has(filePath)) {
    const cachedResult = complexityMap.get(filePath);

    if (cachedResult) {
      return cachedResult;
    }
  }

  return await calculateFileComplexity(filePath);
};

const flattenComplexity = (complexity: FileOutput): ContainerOutput[] => {
  return complexity.inner.reduce(
    (acc: ContainerOutput[], curr: ContainerOutput) => {
      acc.push(curr);

      if (curr.inner.length > 0) {
        acc.push(...flattenComplexity(curr));
      }

      return acc;
    },
    [] as ContainerOutput[]
  );
};

export const getFlattenedFileComplexity = async (
  filePath: string
): Promise<ContainerOutput[]> => {
  const fileComplexity = await getFileComplexity(filePath);

  return flattenComplexity(fileComplexity);
};
