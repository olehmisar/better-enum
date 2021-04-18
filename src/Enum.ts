import {UnionToTuple} from './utils'

export function Enum<TMap extends {}>(...tags: UnionToTuple<keyof TMap>) {
  const enum_ = {} as { [TTag in keyof TMap]: EnumConstructor<TMap, TTag> }
  tags.forEach(tag => {
    const typedTag = tag as keyof TMap
    enum_[typedTag] = (value) => new EnumField(typedTag, value)
  })
  return enum_
}

export type Enum<E extends { [TTag in keyof E]: E[TTag] }> = ReturnType<E[keyof E]>

type EnumConstructor<TMap, TTag extends keyof TMap> = (value: TMap[TTag]) => EnumField<TMap>

type MatchArms<TMap, TRet> = { [TTag in keyof TMap]: (value: TMap[TTag]) => TRet }

class EnumField<TMap> {
  constructor(private tag: keyof TMap, private value: TMap[keyof TMap]) {}

  match<TRet>(map: MatchArms<TMap, TRet>) {
    return map[this.tag](this.value)
  }
}
