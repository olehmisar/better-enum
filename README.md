# better-enum
Type safe enums with fields

Example:
```ts
const State = Enum<{
  Loading: void,
  Error: { code: number, message: string },
  Data: { 
    name: { first: string, last: string },
    age: number,
  },
}>('Loading', 'Error', 'Data')

const state = State.Loading()
const result: string = state.match({
  Loading: () => 'Loading...',
  Error: ({ code, message }) => `Got an error with status code ${code}: ${message}`,
  Data: ({ name, age }) => `Welcome, ${name.first} ${name.last}. You are ${age} years old`,
})
```
