ts-data-collections

# ts-data-collections

## Table of contents

### Classes

- [Collection](classes/Collection.md)

### Interfaces

- [CollectionInitializer](interfaces/CollectionInitializer.md)
- [Container](interfaces/Container.md)
- [ContainerOptions](interfaces/ContainerOptions.md)

### Type Aliases

- [CollectionLike](README.md#collectionlike)

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

## Functions

### buildCollection

▸ **buildCollection**\<`E`, `C`, `Options`, `Initializer`\>(`factory`, `initializer?`): `C`

Builds a `Collection`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | `E` |
| `C` | extends [`Collection`](classes/Collection.md)\<`E`\> |
| `Options` | extends `object` = `object` |
| `Initializer` | extends [`CollectionInitializer`](interfaces/CollectionInitializer.md)\<`E`\> = [`CollectionInitializer`](interfaces/CollectionInitializer.md)\<`E`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `factory` | `Constructor`\<`C`, [`undefined` \| `Options`]\> |
| `initializer?` | `WithCapacity`\<`Options` & `Initializer`\> |

#### Returns

`C`
