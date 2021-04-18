// Source: https://github.com/microsoft/TypeScript/issues/13298#issuecomment-707364842

export type UnionToTuple<T> = (
  (
    (
      T extends any
        ? (t: T) => T
        : never
      ) extends infer U
      ? (U extends any
      ? (u: U) => any
      : never
        ) extends (v: infer V) => any
      ? V
      : never
      : never
    ) extends (_: any) => infer W
    ? [...UnionToTuple<Exclude<T, W>>, W]
    : []
  )
