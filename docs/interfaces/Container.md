[**ts-data-collections**](../README.md)

---

[ts-data-collections](../README.md) / Container

# Interface: Container

A Container is a fundamental interface that represents any data structure that can hold elements.
It provides basic operations to query the state of the container such as its size, capacity,
and whether it is empty or full.

This interface is implemented by both Collections and Maps in the library.

## Methods

### capacity()

> **capacity**(): `number`

Returns the capacity of this container, i.e. the maximum
number of elements it can contain.

#### Returns

`number`

The capacity of this container

---

### isEmpty()

> **isEmpty**(): `boolean`

Returns `true` if this container is empty, i.e., its size is `0`.

#### Returns

`boolean`

`true` if this container is empty, `false` otherwise.

---

### isFull()

> **isFull**(): `boolean`

Returns `true` if this container is full, i.e. its size is greater than or equal to its capacity.

#### Returns

`boolean`

`true` if this container is full, false otherwise.

---

### remaining()

> **remaining**(): `number`

Returns the number of elements that can be added to this
container without exceeding its `capacity`.

#### Returns

`number`

The number of additional elements that can be added

---

### size()

> **size**(): `number`

Returns the number of elements in this container.

#### Returns

`number`

The current number of elements in the container
