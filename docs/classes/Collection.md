[ts-data-collections](../README.md) / Collection

# Class: Collection\<E\>

A `Collection` represents a group of objects, known as its
elements. Some collections allow duplicate elements and others do
not. Some are ordered and others unordered.

## Type parameters

| Name |
| :------ |
| `E` |

## Implements

- `Iterable`\<`E`\>
- [`Container`](../interfaces/Container.md)

## Table of contents

### Methods

- [[iterator]](Collection.md#[iterator])
- [add](Collection.md#add)
- [addFully](Collection.md#addfully)
- [buildOptions](Collection.md#buildoptions)
- [capacity](Collection.md#capacity)
- [clear](Collection.md#clear)
- [clone](Collection.md#clone)
- [contains](Collection.md#contains)
- [containsAll](Collection.md#containsall)
- [equals](Collection.md#equals)
- [filter](Collection.md#filter)
- [find](Collection.md#find)
- [hashCode](Collection.md#hashcode)
- [isEmpty](Collection.md#isempty)
- [isFull](Collection.md#isfull)
- [iterator](Collection.md#iterator)
- [offer](Collection.md#offer)
- [offerPartially](Collection.md#offerpartially)
- [remaining](Collection.md#remaining)
- [removeAll](Collection.md#removeall)
- [removeItem](Collection.md#removeitem)
- [removeMatchingItem](Collection.md#removematchingitem)
- [retainAll](Collection.md#retainall)
- [size](Collection.md#size)
- [toArray](Collection.md#toarray)
- [toJson](Collection.md#tojson)

## Methods

### [iterator]

▸ **[iterator]**(): `IterableIterator`\<`E`\>

Used to make this [Collection](Collection.md) being seen as an
`Iterable<A>`. This allows them to be used in APIs expecting an
`Iterable<A>`

#### Returns

`IterableIterator`\<`E`\>

#### Implementation of

Iterable.[iterator]

___

### add

▸ **add**(`item`): `boolean`

Ensures that this `Collection` contains the specified element.
Returns `true` if this `Collection` changed as a result of the
call.  Returns false if this `Collection` does not allow
duplicates and already contains the specified element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `E` | the item whose presence in the `Collection` is to be ensured |

#### Returns

`boolean`

true if this collection changed as a result of the call.

**`Throws`**

Overflowexception if the capacity of the `Collection`
would be exceeded by adding this element.

___

### addFully

▸ **addFully**\<`E1`\>(`container`): `number`

Adds all the items of the `container` to this `Collection` if
there is enough remaining capaacity.

#### Type parameters

| Name |
| :------ |
| `E1` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `container` | [`CollectionLike`](../README.md#collectionlike)\<`E1`\> | The container of items to add. |

#### Returns

`number`

The number of items added, which is the number of items
in the container.

**`Throws`**

Overflowexception if there remaining capacity of this
`Collection` is less than the number of items in the `container`.

___

### buildOptions

▸ **buildOptions**(): [`ContainerOptions`](../interfaces/ContainerOptions.md)

Returns the options used to build this `Collection`.  This is
used buildCollection to initialize the built `Collection` with
the same options as the source `Collection`, e.g. in clone
operation.

#### Returns

[`ContainerOptions`](../interfaces/ContainerOptions.md)

#### Implementation of

[Container](../interfaces/Container.md).[buildOptions](../interfaces/Container.md#buildoptions)

___

### capacity

▸ **capacity**(): `number`

Returns the capacity of this `Collection`, i.e. the maximum
number of elements it can contains.

#### Returns

`number`

The capacity of this `Collection`.

#### Implementation of

[Container](../interfaces/Container.md).[capacity](../interfaces/Container.md#capacity)

___

### clear

▸ **clear**(): `void`

Removes all elements from this `Collection`

#### Returns

`void`

___

### clone

▸ **clone**(): [`Collection`](Collection.md)\<`E`\>

Returns a clone of this `Collection`.

The clone `Collection` will have the same elements and capacity
as the original one and also all other settings returned by `[Collection.buildOptions](Collection.md#buildoptions).

#### Returns

[`Collection`](Collection.md)\<`E`\>

___

### contains

▸ **contains**(`item`): `boolean`

Returns `true` if this `Collection` contains the specified
`item`.  The comparison is done using equalsAny.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `E` | The item whose presence is tested. |

#### Returns

`boolean`

`true` if this `Collections contains the specified
`item`, `false` otherwise.

___

### containsAll

▸ **containsAll**\<`E1`\>(`iteratorLike`): `boolean`

Returns true if this `Collection` contains all of the elements in the specified `IteratorLike`.

#### Type parameters

| Name |
| :------ |
| `E1` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `iteratorLike` | `IteratorLike`\<`E1`\> | The items to be checked for containment in this `Collection`. |

#### Returns

`boolean`

true if this collection contains all of the elements in the specified `IteratorLike`

___

### equals

▸ **equals**(`other`): `boolean`

Returns true if this collection is equal to the specified argument `other`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `unknown` |

#### Returns

`boolean`

___

### filter

▸ **filter**(`predicate`): `number`

Removes items from this `Collection` for which the argument
`predicate` evaluates to `false`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | `Predicate`\<`E`\> | the predicate used for filtering item of this `Collection`. |

#### Returns

`number`

the number of elements removed from this `Collection`

___

### find

▸ **find**(`predicate`): `undefined` \| `E`

Finds an item for which the argument `predicate` evaluates to `true`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | `Predicate`\<`E`\> | the predicate used to select an item |

#### Returns

`undefined` \| `E`

An item for which the `predicate` evaluates to `true` or
`undefined`

___

### hashCode

▸ **hashCode**(): `number`

Returns a hashCode for this `Collection`

#### Returns

`number`

___

### isEmpty

▸ **isEmpty**(): `boolean`

Returns `true` if this `Collection` is empty, i.e. its `size` is `0`.

#### Returns

`boolean`

`true` if this `Collection` is empty, `false` otherwise`.

___

### isFull

▸ **isFull**(): `boolean`

Returns `true` if this `Collection` is full, i.e. its `size` is
equal to its `capacity`.

#### Returns

`boolean`

`true` if this `Collection` is full, `false` otherwise.

___

### iterator

▸ **iterator**(): `FluentIterator`\<`E`\>

Returns a `FluentIterator` (
https://github.com/alaincaron/ts-fluent-iterators/blob/main/docs/classes/FluentIterator.md)
yielding all elements of this `Collection`.

#### Returns

`FluentIterator`\<`E`\>

a `FluentIterator` yielding all elements of this `Collection`.

___

### offer

▸ **offer**(`item`): `boolean`

Inserts an element if possible, without exceeding the `capacity`
of this `Collection`.  Otherwise returning false.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `E` | the item to add to the `Collection` |

#### Returns

`boolean`

`true` if the element can be added without exceeding the `capacity`, `false` otherwise.

___

### offerPartially

▸ **offerPartially**\<`E1`\>(`container`): `number`

Adds as many items as possible of the `container` to this
`Collection` as long there is remaining capaacity.  Items are
added one by one until all items are added or the `Collection` is
[full](Collection.md#isfull).

#### Type parameters

| Name |
| :------ |
| `E1` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `container` | `IteratorLike`\<`E1`\> \| [`CollectionLike`](../README.md#collectionlike)\<`E1`\> | The container of items to add. |

#### Returns

`number`

The number of items added

___

### remaining

▸ **remaining**(): `number`

Returns the number of elements that can be added to this
`Collection` without exceeding its `capacity`.

#### Returns

`number`

the number of elements that can be added to this `Collection` without exceeding its `capacity`.

___

### removeAll

▸ **removeAll**(`c`): `number`

Removes all of this collection's elements that are also contained
in the specified `Collection`. After this call returns, this
`Collection` will contain no elements in common with the
specified `Collection`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `c` | [`Collection`](Collection.md)\<`E`\> | `Collection` containing elements to be removed from this `Collection`. |

#### Returns

`number`

The number of elements that were removed as a result of this call.

___

### removeItem

▸ **removeItem**(`item`): `boolean`

Removes an instance of item from the `Collection`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `E` | The `item` to remove from the `Collection` |

#### Returns

`boolean`

`true` if an element was removed from the `Collection`, `false` otherwise.

**`Remarks`**

The comparison for equality is made using the function equalsAny.

___

### removeMatchingItem

▸ **removeMatchingItem**(`predicate`): `undefined` \| `E`

Removes an item for which the `predicate` returns `true`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | `Predicate`\<`E`\> | The predicate that is being evaluated for each elements. |

#### Returns

`undefined` \| `E`

the element removed from the `Collection` or `undefined`
if there are no items for which the `predicate` evaluated to
`true`.

___

### retainAll

▸ **retainAll**(`c`): `number`

Retains only the elements in this `Collection` that are contained
in the specified `Collection`. In other words, removes from this
`Collection all of its elements that are not contained in the
specified `Collection`.

@param c `Collection` containing elements to be retained in this `Collection`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `c` | [`Collection`](Collection.md)\<`E`\> |

#### Returns

`number`

The number of elements that were removed as a result of this call.

___

### size

▸ **size**(): `number`

Returns the number of elements in this `Collection`.

#### Returns

`number`

the number of elements in this `Collection`

___

### toArray

▸ **toArray**(): `E`[]

Returns an array containing all elements of this `Collection`

#### Returns

`E`[]

an array containing all elements of this `Collection`

___

### toJson

▸ **toJson**(): `string`

Returns a JSON string representation of this `Collection`.

#### Returns

`string`
