declare module '*.svg' {
  const ReactComponent: React.FunctionComponent<
    React.SVGAttributes<SVGElement>
  >;
  export { ReactComponent };
}
declare module '*.png' {
  const value: string;
  export default value;
}
