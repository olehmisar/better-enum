import {UnionToTuple} from './utils'

type ForbiddenVariantNames = 'default'
type VariantTypesConstraint = object | any[] | void
type TMapConstraint<TMap> = {
  [TTag in keyof TMap]: TTag extends ForbiddenVariantNames
    ? never
    : VariantTypesConstraint
}

export function Enum<TMap extends TMapConstraint<TMap>>(...tags: UnionToTuple<keyof TMap>) {
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

type DefaultArm<TRet> = {default: () => TRet}
type PartialMatchArms<TMap extends Record<string, any[]>, TRet> = Partial<MatchArms<TMap, TRet>> & DefaultArm<TRet>

class EnumField<TMap extends Record<string, any[]>> {
  constructor(private tag: keyof TMap, private value: TMap[keyof TMap]) {}

  match<TRet>(map: MatchArms<TMap, TRet> | PartialMatchArms<TMap, TRet>) {
    const f = map[this.tag]
    if (!f) {
      return map.default()
    }
    return f(...this.value)
  }
}
