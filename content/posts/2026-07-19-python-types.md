---
title: Python 中常见的数据类型有哪些？
slug: py3
date: 2026-07-20
description: 数据类型（Data Type）用来表示变量中存储的数据种类，例如数字、文本、真假值或一组数据。Python
  是一种动态类型（Dynamic Typing）语言，不需要提前声明变量类型，解释器会根据赋的值自动判断数据类型。
tags:
  - 随笔
series: python-basics
draft: false
---
# 为什么需要数据类型？

不同的数据拥有不同的特点。

例如：

数字可以计算：

```python
10 + 5
```

结果：

```text
15
```

而字符串可以拼接：

```python
"Hello" + " World"
```

结果：

```text
Hello World
```

如果 Python 不知道数据是什么类型，就无法判断应该执行哪种操作。

因此，每一个变量都有属于自己的数据类型。

---

# Python 是动态类型语言

Python 是一种**动态类型语言（Dynamic Typing）**。

意思就是：

> **你不需要告诉 Python 变量是什么类型，它会自动判断。**

例如：

```python
name = "John Doe"
age = 25
```

Python 会自动识别：

| 变量 | 数据 | 自动判断的数据类型 |
|------|------|----------------|
| `name` | `"John Doe"` | 字符串（String） |
| `age` | `25` | 整数（Integer） |

整个过程中，我们没有写任何类型声明。

---

# 与静态类型语言有什么区别？

有些编程语言（例如 Java、C#、C++）属于**静态类型语言（Static Typing）**。

在这些语言中，创建变量时必须先声明类型。

例如（Java）：

```java
String name = "John Doe";
int age = 25;
```

这里：

- `String` 表示字符串类型
- `int` 表示整数类型

如果类型写错，程序通常在运行之前就会报错。

而 Python 不需要这样做。

直接写：

```python
name = "John Doe"
age = 25
```

即可。

---

# 动态类型有哪些优点？

由于 Python 自动推断数据类型，因此代码更加简洁。

例如：

```python
price = 99.9
```

不用写：

```text
float price = 99.9
```

优点：

- ✅ 代码更少
- ✅ 编写速度更快
- ✅ 更容易学习
- ✅ 修改变量类型更加方便

例如：

```python
x = 100
```

稍后：

```python
x = "Python"
```

Python 依然允许这样写。

---

# 动态类型有什么缺点？

虽然动态类型很方便，但也有不足。

因为 Python 是在**程序运行时（Runtime）** 才检查数据类型。

如果类型使用错误，程序运行到那一行才会发现。

例如：

```python
age = "18"

print(age + 5)
```

运行时会报错，因为：

字符串不能直接与数字相加。

也就是说：

> Python 不会提前发现这个问题，而是在程序执行到这里时才停止运行。

---

# 编译时错误 vs 运行时错误

很多初学者容易混淆这两个概念。

可以简单理解为：

| 比较 | Python | Java、C++ 等 |
|------|---------|-------------|
| 检查类型时间 | 程序运行时 | 编译时 |
| 是否需要声明类型 | 不需要 | 需要 |
| 类型错误什么时候发现 | 运行到错误代码时 | 程序运行前 |

对于初学者来说，只需要记住：

> **Python 的类型错误通常是在程序运行过程中发现的，而不是写代码时发现。**

---

# Python 常见的数据类型

下面介绍 Python 中最常见的数据类型。

---

## 1. 整数（int）

整数（Integer）表示**没有小数部分的数字**。

例如：

```python
age = 18

print(age)
```

输出：

```text
18
```

还可以表示负数：

```python
number = -5
```

常见用途：

- 年龄
- 数量
- 分数
- 人数

---

## 2. 浮点数（float）

浮点数（Float）表示**带有小数点的数字**。

例如：

```python
price = 99.9

print(price)
```

输出：

```text
99.9
```

常见用途：

- 身高
- 体重
- 温度
- 金额

---

## 3. 字符串（str）

字符串（String）表示**文本内容**。

必须使用：

- 单引号 `' '`
- 双引号 `" "`

包围。

例如：

```python
name = "Alice"

print(name)
```

输出：

```text
Alice
```

字符串可以保存：

- 姓名
- 地址
- 一段文字
- 邮箱

---

## 4. 布尔值（bool）

布尔值（Boolean）只有两个结果：

```python
True
```

表示：

> 真（是）

以及：

```python
False
```

表示：

> 假（否）

例如：

```python
is_student = True

print(is_student)
```

输出：

```text
True
```

布尔值经常用于：

- 判断条件
- 是否登录
- 是否成功
- 是否开启

---

## 5. 列表（list）

列表（List）表示**一组有序的数据**。

特点：

- 使用中括号 `[]`
- 可以存放不同类型的数据
- 可以修改内容

例如：

```python
my_list = [22, "Hello world", 3.14, True]

print(my_list)
```

输出：

```text
[22, 'Hello world', 3.14, True]
```

可以把列表理解成：

> 一个可以装很多东西的盒子。

---

## 6. 元组（tuple）

元组（Tuple）和列表很像。

不同的是：

> **元组创建后不能修改。**

例如：

```python
my_tuple = (7, "hello", 8.5)

print(my_tuple)
```

输出：

```text
(7, 'hello', 8.5)
```

特点：

- 使用小括号 `()`
- 有序
- 不可修改（不可变）

---

## 7. 集合（set）

集合（Set）用于保存**唯一的数据**。

特点：

- 使用花括号 `{}`
- 自动去除重复元素
- 元素没有固定顺序

例如：

```python
my_set = {7, "hello", 8.5}

print(my_set)
```

输出示例：

```text
{7, 'hello', 8.5}
```

> **注意：** 集合是无序的，每次打印元素顺序可能不同。

---

## 8. 字典（dict）

字典（Dictionary）用于保存**键（Key）和值（Value）**的对应关系。

格式：

```text
键 : 值
```

例如：

```python
student = {
    "name": "Alice",
    "age": 25
}

print(student)
```

输出：

```text
{'name': 'Alice', 'age': 25}
```

可以理解成一本真正的字典：

| 键（Key） | 值（Value） |
|-----------|------------|
| name | Alice |
| age | 25 |

---

## 9. range（范围）

`range()` 用于生成一段连续数字。

例如：

```python
numbers = range(5)

print(numbers)
```

输出：

```text
range(0, 5)
```

它表示：

```text
0 1 2 3 4
```

`range()` 经常用于 `for` 循环中。

---

## 10. None

`None` 是 Python 中的一个特殊值。

表示：

> **没有值（空值）**。

例如：

```python
result = None

print(result)
```

输出：

```text
None
```

常用于：

- 变量暂时没有数据
- 函数没有返回值
- 表示未知状态

---

# 常见数据类型一览表

| 数据类型 | 英文名称 | 示例 | 用途 |
|----------|----------|------|------|
| `int` | Integer | `10` | 整数 |
| `float` | Float | `3.14` | 小数 |
| `str` | String | `"Python"` | 文本 |
| `bool` | Boolean | `True` | 真或假 |
| `list` | List | `[1, 2, 3]` | 有序、可修改的数据集合 |
| `tuple` | Tuple | `(1, 2, 3)` | 有序、不可修改的数据集合 |
| `set` | Set | `{1, 2, 3}` | 无序且元素唯一 |
| `dict` | Dictionary | `{"name": "Tom"}` | 键值对数据 |
| `range` | Range | `range(5)` | 连续数字序列 |
| `None` | NoneType | `None` | 表示空值 |

---

# 学习小结

| 知识点 | 说明 |
|---------|------|
| 数据类型（Data Type） | 表示变量中保存的数据种类。 |
| 动态类型（Dynamic Typing） | Python 会根据赋值自动推断变量类型，无需手动声明。 |
| 静态类型（Static Typing） | Java、C++ 等语言需要先声明变量类型。 |
| 运行时检查 | Python 的类型错误通常会在程序运行到对应代码时才发现。 |
| 常见数据类型 | `int`、`float`、`str`、`bool`、`list`、`tuple`、`set`、`dict`、`range`、`None`。 |

---

# 总结

- 数据类型决定了变量中保存的数据是什么，以及这些数据可以执行哪些操作。
- Python 是一种**动态类型语言**，会根据赋值自动推断变量的数据类型，无需提前声明。
- 与静态类型语言相比，Python 编写代码更简单、更灵活，但类型错误通常会在程序运行时才被发现。
- 学会区分并使用常见的数据类型（如整数、字符串、列表和字典等），是后续学习变量、条件判断、循环和函数等内容的重要基础。
