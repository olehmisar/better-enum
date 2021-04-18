import Enum from '.'

type Shape = Enum<typeof Shape>
const Shape = Enum<{
  Point: void
  Circle: [number]
  Rect: {
    width: number
    height: number
  }
}>('Point', 'Circle', 'Rect')

describe(Enum, () => {
  test('invalid enum declaration', () => {
    // @ts-expect-error
    Enum<{num: number}>('num')
    // @ts-expect-error
    Enum<{str: string}>('str')
    // @ts-expect-error
    Enum<{bool: boolean}>('bool')
  })

  test('enum creation', () => {
    expect(Shape.Point()).toEqual({tag: 'Point', value: []})
    expect(Shape.Circle(2)).toEqual({tag: 'Circle', value: [2]})
    expect(Shape.Rect({width: 1, height: 2})).toEqual({tag: 'Rect', value: [{width: 1, height: 2}]})

    // @ts-expect-error
    Shape.Unexisting

    Shape.Point()
    // @ts-expect-error
    Shape.Point([])
    // @ts-expect-error
    Shape.Point([1])
    // @ts-expect-error
    Shape.Point({})
    // @ts-expect-error
    Shape.Point({width: 1, height: 2})

    Shape.Circle(1)
    // @ts-expect-error
    Shape.Circle()
    // @ts-expect-error
    Shape.Circle(1, 2)
    // @ts-expect-error
    Shape.Circle([])
    // @ts-expect-error
    Shape.Circle([1])
    // @ts-expect-error
    Shape.Circle(['hello'])
    // @ts-expect-error
    Shape.Circle({})
    // @ts-expect-error
    Shape.Circle({width: 1, height: 2})

    Shape.Rect({width: 1, height: 2})
    // @ts-expect-error
    Shape.Rect()
    // @ts-expect-error
    Shape.Rect([])
    // @ts-expect-error
    Shape.Rect({})
    // @ts-expect-error
    Shape.Rect({width: 1})
    // @ts-expect-error
    Shape.Rect({height: 2})
    // @ts-expect-error
    Shape.Rect({width: 1, height: 2}, {width: 3, height: 4})
  })

  test('reassigning', () => {
    let shape = Shape.Point()
    shape = Shape.Circle(2)
    shape = Shape.Rect({width: 1, height: 2})
  })

  test('getting the type', () => {
    const f = (shape: Shape) => {}
    f(Shape.Point())
    f(Shape.Circle(1))
    f(Shape.Rect({width: 1, height: 2}))
    // @ts-expect-error
    f(1)
    // @ts-expect-error
    f('hello')
    // @ts-expect-error
    f(undefined)
    // @ts-expect-error
    f(null)
  })

  describe('.match()', () => {
    test('return value', () => {
      const shapes = [
        [1, Shape.Point()],
        [2, Shape.Circle(1)],
        [3, Shape.Rect({width: 1, height: 2})],
      ] as const
      shapes.forEach(([ret, shape]) => {
        expect(shape.match({
          Point: () => 1,
          Circle: () => 2,
          Rect: () => 3,
        })).toEqual(ret)
      })
    })

    test('is exhaustive', () => {
      try {
        const shape = Shape.Point()
        // @ts-expect-error
        shape.match({})
        // @ts-expect-error
        shape.match({
          Point: () => {},
        })
        // @ts-expect-error
        shape.match({
          Point: () => {},
          Circle: () => {},
        })
        // @ts-expect-error
        shape.match({
          Point: () => {},
          Rect: () => {},
        })
        // @ts-expect-error
        shape.match({
          Circle: () => {},
          Rect: () => {},
        })
      } catch {}
    })

    test('return value types must match', () => {
      const shape = Shape.Point()
      shape.match({
        Point: () => 1,
        Circle: () => 2,
        Rect: () => 3,
      })

      shape.match({
        Point: () => 1,
        // @ts-expect-error
        Circle: () => '2',
        // @ts-expect-error
        Rect: () => [3],
      })
    })

    test('explicit return value type', () => {
      Shape.Point().match<number | boolean | string>({
        Point: () => 1,
        Circle: () => true,
        Rect: () => 'hello',
      })
    })

    test('variants destructuring', () => {
      const matchOn = (shape: Shape) => shape.match({
        Point: () => 0,
        Circle: (radius) => radius,
        Rect: ({width, height}) => width + height,
      })
      expect(matchOn(Shape.Point())).toEqual(0)
      expect(matchOn(Shape.Circle(2))).toEqual(2)
      expect(matchOn(Shape.Rect({width: 3, height: 4}))).toEqual(7)

      try {
        Shape.Point().match({
          // @ts-expect-error
          Point: ({width: _}) => {},
          // @ts-expect-error
          Circle: ({height: _}) => {},
          // @ts-expect-error
          Rect: ([radius]) => {},
        })
      } catch {}
    })
  })
})
