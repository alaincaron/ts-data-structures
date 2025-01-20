[**ts-data-collections**](../README.md) • **Docs**

---

[ts-data-collections](../README.md) / AbstractContainer

# Class: `abstract` AbstractContainer

A `Container` is an object that can contain objects.

## Extended by

- [`AbstractCollection`](AbstractCollection.md)

## Implements

- `Container`

## Methods

### capacity()

> **capacity**(): `number`

Returns the capacity of this Container, i.e. the maximum
number of elements it can contain.

#### Returns

`number`

The capacity of this Container

#### Implementation of

`Container.capacity`

---

### isEmpty()

> **isEmpty**(): `boolean`

Returns `true` if this Container is empty, i.e., its size is `0`.

#### Returns

`boolean`

`true` if this Container is empty, `false` otherwise.

#### Implementation of

`Container.isEmpty`

---

### isFull()

> **isFull**(): `boolean`

Returns `true` if this Container is full, i.e. its size is greater than or equal to is capacity.\*

#### Returns

`boolean`

`true` if this Container is full, false otherwise.

#### Implementation of

`Container.isFull`

---

### remaining()

> **remaining**(): `number`

Returns the number of elements that can be added to this
Container without exceeding its `capacity`.

#### Returns

`number`

the number of elements that can be added to this Container without exceeding its `capacity`.

#### Implementation of

`Container.remaining`

---

### size()

> `abstract` **size**(): `number`

Returns the number of items in this Container.

#### Returns

`number`

the number of items in this Container.

#### Implementation of

`Container.size`
