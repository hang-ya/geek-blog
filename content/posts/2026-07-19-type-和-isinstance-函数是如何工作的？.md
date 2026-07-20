---
title: type() 和 isinstance() 函数是如何工作的？
slug: py4
date: 2026-07-20
description: type() 用于查看一个对象的数据类型，返回对象所属的类型；isinstance() 用于判断一个对象是否属于指定的数据类型，并返回
  True 或 False。在编写程序时，这两个函数可以帮助我们检查变量类型，避免因数据类型不匹配而导致程序报错。
tags:
  - 随笔
draft: false
---
# type() 和 isinstance() 函数是如何工作的？

在上一节中，我们学习了 Python 中常见的数据类型，例如字符串（`str`）、整数（`int`）、浮点数（`float`）等。

但是，仅仅知道有哪些数据类型还不够。在编写程序时，我们经常需要回答两个问题：

- **变量是什么类型？**
- **变量是不是某种类型？**

Python 提供了两个内置函数来完成这两项工作：

- `type()` —— 查看变量的数据类型。
- `isinstance()` —— 判断变量是否属于某种数据类型。

---

# 为什么要检查数据类型？

假设有下面两个变量：

```python
age = 18
```

```python
name = "Alice"
```

虽然它们都是变量，但：

- `18` 是数字
- `"Alice"` 是字符串

数字可以进行数学运算：

```python
18 + 2
```

结果：

```text
20
```

而字符串不能直接进行数学计算。

例如：

```python
"Alice" / 2
```

程序会直接报错。

因此，在进行某些操作之前，我们有时需要先确认变量的数据类型是否正确。

---

# type() 函数

## 什么是 type()？

`type()` 是 Python 的一个**内置函数（Built-in Function）**。

它的作用是：

> **查看一个对象的数据类型。**

基本语法：

```python
type(对象)
```

例如：

```python
developer = "Devin"

print(type(developer))
```

输出：

```text
<class 'str'>
```

这里：

```text
<class 'str'>
```

表示：

> `developer` 的数据类型是 **字符串（str）**。

---

# type() 的工作过程

可以把 `type()` 想象成一个"类型检测器"。

执行流程如下：

```text
变量
 │
 ▼
type()
 │
 ▼
返回变量所属的数据类型
```

例如：

```python
age = 20

print(type(age))
```

输出：

```text
<class 'int'>
```

说明：

```python
20
```

属于整数（`int`）类型。

---

# 常见数据类型对应的 type() 输出

下面是 Python 中常见数据类型及其对应的 `type()` 输出。

| 数据类型 | 示例 | `type()` 输出 |
|----------|------|---------------|
| 整数（int） | `10` | `<class 'int'>` |
| 浮点数（float） | `3.14` | `<class 'float'>` |
| 字符串（str） | `"hello"` | `<class 'str'>` |
| 布尔值（bool） | `True` | `<class 'bool'>` |
| 列表（list） | `[1, 2, 3]` | `<class 'list'>` |
| 元组（tuple） | `(1, 2)` | `<class 'tuple'>` |
| 集合（set） | `{1, 2}` | `<class 'set'>` |
| 字典（dict） | `{"name": "Tom"}` | `<class 'dict'>` |
| 范围（range） | `range(5)` | `<class 'range'>` |
| 空值（None） | `None` | `<class 'NoneType'>` |

例如：

```python
my_list = [22, "Hello world", 3.14, True]

print(type(my_list))
```

输出：

```text
<class 'list'>
```

---

# 忘记传入参数会发生什么？

`type()` 必须接收参数。

错误写法：

```python
type()
```

程序会报错：

```text
TypeError: type() takes 1 or 3 arguments
```

原因是：

`type()` 不知道你想查看哪个对象的数据类型。

因此，必须传入一个对象。

正确写法：

```python
type(10)
```

或者：

```python
type(name)
```

---

# isinstance() 函数

## 什么是 isinstance()？

除了查看变量类型，我们有时候更关心：

> **这个变量是不是某种类型？**

例如：

- 是不是整数？
- 是不是字符串？
- 是不是列表？

这时就要使用：

```python
isinstance()
```

它的作用是：

> **判断一个对象是否属于指定的数据类型。**

如果是：

```text
True
```

如果不是：

```text
False
```

---

# isinstance() 的基本语法

```python
isinstance(对象, 数据类型)
```

例如：

```python
account_balance = "12"

print(isinstance(account_balance, int))
```

输出：

```text
False
```

为什么？

因为：

```python
"12"
```

虽然看起来像数字，

实际上它被引号包围，所以它是：

```text
字符串（str）
```

而不是：

```text
整数（int）
```

因此返回：

```text
False
```

---

# 为什么需要 isinstance()？

假设：

```python
account_balance = "12"
```

如果直接计算：

```python
account_balance / 2
```

程序会报错：

```text
TypeError:
unsupported operand type(s)
```

原因就是：

字符串不能直接参与除法运算。

正确的思路是：

先检查类型：

```python
if isinstance(account_balance, int):
    print(account_balance / 2)
```

只有当变量是整数时，才执行数学计算。

这样程序会更加安全。

---

# 一次检查多个数据类型

有时候：

一个变量既可以是整数，

也可以是浮点数。

例如：

```python
account_balance = 12
```

可以这样写：

```python
isinstance(account_balance, (int, float))
```

输出：

```text
True
```

这里：

```python
(int, float)
```

表示：

> **只要对象是 `int` 或 `float` 中的任意一种，就返回 `True`。**

例如：

```python
account_balance = 12.5
```

再次检查：

```python
isinstance(account_balance, (int, float))
```

结果依然是：

```text
True
```

---

# type() 和 isinstance() 的区别

很多初学者容易把这两个函数混淆。

其实，它们的用途不同。

| 函数 | 作用 | 返回值 |
|------|------|--------|
| `type()` | 查看对象的数据类型 | 类型对象，如 `<class 'int'>` |
| `isinstance()` | 判断对象是否属于某种类型 | `True` 或 `False` |

例如：

```python
age = 18
```

查看类型：

```python
print(type(age))
```

输出：

```text
<class 'int'>
```

判断是否为整数：

```python
print(isinstance(age, int))
```

输出：

```text
True
```

可以理解为：

- `type()` 回答："**它是什么类型？**"
- `isinstance()` 回答："**它是不是这种类型？**"

---

# 常见错误

## ❌ 忘记传入对象

错误：

```python
type()
```

正确：

```python
type(age)
```

---

## ❌ 把类型写成字符串

错误：

```python
isinstance(age, "int")
```

正确：

```python
isinstance(age, int)
```

这里的 `int` 是数据类型，不需要加引号。

---

# 学习小结

| 知识点 | 说明 |
|---------|------|
| `type()` | 查看对象的数据类型。 |
| `isinstance()` | 判断对象是否属于某种数据类型。 |
| 返回结果 | `type()` 返回类型对象，`isinstance()` 返回布尔值（`True` 或 `False`）。 |
| 多类型判断 | 可以使用元组，例如 `isinstance(x, (int, float))`。 |
| 使用场景 | 在执行操作前检查变量类型，避免因类型不匹配导致程序报错。 |

---

# 总结

- `type()` 用于查看变量的数据类型，帮助我们了解对象属于哪一种类型。
- `isinstance()` 用于判断变量是否属于指定的数据类型，并返回 `True` 或 `False`。
- 在编写程序时，先检查变量的数据类型，可以有效避免因类型错误导致的运行时异常。
- 熟练掌握 `type()` 和 `isinstance()`，能够帮助你编写更加健壮、安全且易于调试的 Python 程序。
