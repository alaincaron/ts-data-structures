[**ts-data-collections**](../README.md) • **Docs**

---

[ts-data-collections](../README.md) / Container

# Class: `abstract` Container

A `Container` is an object that can contain objects.

## Extended by

- [`Collection`](Collection.md)

## Methods

### buildOptions()

> `abstract` **buildOptions**(): `object`

Build the options to create a `Container` with the same options as this `Container`

#### Returns

`object`

---

### capacity()

> **capacity**(): `number`

Returns the capacity of this [Container](Container.md), i.e. the maximum
number of elements it can contains.

#### Returns

`number`

The capacity of this [Container](Container.md)

---

### isEmpty()

> **isEmpty**(): `boolean`

Returns `true` if this [Container](Container.md) is empty, i.e., its size is `0`.

#### Returns

`boolean`

`true` if this [Container](Container.md) is empty, `false` otherwise.

---

### isFull()

> **isFull**(): `boolean`

Returns `true` if this [Container](Container.md) is full, i.e. its size is greater than or equal to is capacity.\*

#### Returns

`boolean`

`true` if this [Container](Container.md) is full, false otherwise.

---

### remaining()

> **remaining**(): `number`

Returns the number of elements that can be added to this
[Container](Container.md) without exceeding its `capacity`.

#### Returns

`number`

the number of elements that can be added to this [Container](Container.md) without exceeding its `capacity`.

---

### size()

> `abstract` **size**(): `number`

Returns the number of items in this [Container](Container.md).

#### Returns

`number`

the number of items in this [Container](Container.md).
