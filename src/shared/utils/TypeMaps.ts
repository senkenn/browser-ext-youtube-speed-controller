/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
export function ObjectKeys<T>(obj: T): (keyof T)[] {
  return (Object.keys(obj as any) as (keyof T)[]).map((key) => {
    return key;
  });
}
