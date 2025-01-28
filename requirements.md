## Requirements

- Calculate cognitive complexity for the current file
- Display the cognitive complexity at the block definition (method, variable, interface, class)
  - Display as a codelens output with complexity calculation
  - Display underline on block that indicates complexity (red, yellow, green orb)
- Display total file complexity in the status bar

### Nice to haves

- Provide an optimize / refactor button to reduce the complexity
  - Ideally this is passed to chatgpt with a simple prompt to refactor it and reduce the complexity

### Configuration Potentials

displayMethodUnderline: bool
displayMethodUnderlineThreshold: number
displayCodeLens: bool
displayCodeLensThreshold: number

enableInterfaces
enableMethods
enableClasses
