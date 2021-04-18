import {UnionToTuple} from './utils'

type AllowedVariantTypes = object | any[] | void

export function Enum<TMap extends Record<string, AllowedVariantTypes>>(...tags: UnionToTuple<keyof TMap>) {
  type Variants = {
    [TTag in keyof TMap]: TMap[TTag] extends any[]
      ? TMap[TTag]
      : [TMap[TTag]]
  }
  const enum_ = {} as { [TTag in keyof Variants]: EnumConstructor<Variants, TTag> }
  tags.forEach(tag => {
    // @ts-ignore
    enum_[tag] = (...value: Variants[keyof Variants]) => {
      return new EnumField(tag as string, value)
    }
  })
  return enum_
}

export type Enum<E extends { [TTag in keyof E]: E[TTag] }> = ReturnType<E[keyof E]>

type EnumConstructor<TMap extends Record<string, any[]>, TTag extends keyof TMap> = (...value: TMap[TTag]) => EnumField<TMap>

type MatchArms<TMap extends Record<string, any[]>, TRet> = { [TTag in keyof TMap]: (...value: TMap[TTag]) => TRet }

class EnumField<TMap extends Record<string, any[]>> {
  constructor(private tag: keyof TMap, private value: TMap[keyof TMap]) {}

  match<TRet>(map: MatchArms<TMap, TRet>) {
    return map[this.tag](...this.value)
  }
}
