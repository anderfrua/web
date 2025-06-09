declare module 'react-katex' {
  import * as React from 'react';

  interface MathProps {
    math: string;
    renderError?(error: Error): React.ReactNode;
    className?: string;
  }

  export class InlineMath extends React.Component<MathProps> {}
  export class BlockMath extends React.Component<MathProps> {}
}
