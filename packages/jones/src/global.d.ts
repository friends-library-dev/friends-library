declare module 'smalltalk' {
  const value: any;
  export default value;
}

declare module 'redux-starter-kit' {
  export function createAction(type: string): any;
  export function createReducer(initialState: any, map: { [key: string]: any }): any;
  export function configureStore(options: any): any;
}

declare module '@emotion/styled/macro' {
  const value: any;
  export default value;
}

declare module 'react-sizeme' {
  export function withSize(opts: { monitorHeight: boolean }): (Component: any) => any;
}

declare module 'react-keyboard-event-handler' {
  const value: any;
  export default value;
}
