ts-data-collections

# ts-data-collections

## Table of contents

### Classes

- [Collection](classes/Collection.md)

### Interfaces

- [CollectionInitializer](interfaces/CollectionInitializer.md)
- [ContainerOptions](interfaces/ContainerOptions.md)
- [OptionsBuilder](interfaces/OptionsBuilder.md)

### Type Aliases

- [CollectionLike](README.md#collectionlike)

### Variables

- [BoundedCollection](README.md#boundedcollection)

### Functions

- [buildCollection](README.md#buildcollection)

## Type Aliases

### CollectionLike

Ƭ **CollectionLike**\<`E`\>: `Set`\<`E`\> \| `E`[] \| [`Collection`](classes/Collection.md)\<`E`\> \| `ArrayGenerator`\<`E`\>

Describes an object that can behave like a Collection.  It has a
`size` or `length` and it is possible to iterate through its
elements.

#### Type parameters

| Name |
| :------ |
| `E` |

## Variables

### BoundedCollection

• `Const` **BoundedCollection**: (...`args`: `any`[]) => `Derived`\<typeof [`Collection`](classes/Collection.md)\> & typeof [`Collection`](classes/Collection.md)

A Collection with a capacity.

## Functions

### buildCollection

▸ **buildCollection**\<`E`, `C`, `Options`, `Initializer`\>(`factory`, `initializer?`): `C`

Builds a `Collection`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | `E` |
| `C` | extends [`Collection`](classes/Collection.md)\<`E`\> |
| `Options` | extends [`ContainerOptions`](interfaces/ContainerOptions.md) = [`ContainerOptions`](interfaces/ContainerOptions.md) |
| `Initializer` | extends [`CollectionInitializer`](interfaces/CollectionInitializer.md)\<`E`\> = [`CollectionInitializer`](interfaces/CollectionInitializer.md)\<`E`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `factory` | `Object` |
| `initializer?` | `number` \| `Options` & `Initializer` |

#### Returns

`C`
