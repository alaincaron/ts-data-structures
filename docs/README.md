ts-data-collections

# ts-data-collections

## Table of contents

### Classes

- [Collection](classes/Collection.md)

### Interfaces

- [Container](interfaces/Container.md)
- [ContainerOptions](interfaces/ContainerOptions.md)

### Type Aliases

- [CollectionInitializer](README.md#collectioninitializer)
- [CollectionLike](README.md#collectionlike)

### Functions

- [buildCollection](README.md#buildcollection)

## Type Aliases

### CollectionInitializer

Ƭ **CollectionInitializer**\<`E`\>: `ContainerInitializer`\<[`CollectionLike`](README.md#collectionlike)\<`E`\>\>

Interface used to specify initial elements in a create method for a [Collection](classes/Collection.md).

#### Type parameters

| Name |
| :--- |
| `E`  |

---

### CollectionLike

Ƭ **CollectionLike**\<`E`\>: `Set`\<`E`\> \| `E`[] \| [`Collection`](classes/Collection.md)\<`E`\> \| `ArrayGenerator`\<`E`\>

Describes an object that can behave like a Collection. It has a
`size` or `length` and it is possible to iterate through its
elements.

#### Type parameters

| Name |
| :--- |
| `E`  |

## Functions

### buildCollection

▸ **buildCollection**\<`E`, `C`, `Options`, `Initializer`\>(`factory`, `initializer?`): `C`

Builds a `Collection`

#### Type parameters

| Name          | Type                                                                                                                                          |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| `E`           | `E`                                                                                                                                           |
| `C`           | extends [`Collection`](classes/Collection.md)\<`E`\>                                                                                          |
| `Options`     | extends `object` = `object`                                                                                                                   |
| `Initializer` | extends [`CollectionInitializer`](README.md#collectioninitializer)\<`E`\> = [`CollectionInitializer`](README.md#collectioninitializer)\<`E`\> |

#### Parameters

| Name           | Type                                             |
| :------------- | :----------------------------------------------- |
| `factory`      | `Constructor`\<`C`, [`undefined` \| `Options`]\> |
| `initializer?` | `WithCapacity`\<`Options` & `Initializer`\>      |

#### Returns

`C`
