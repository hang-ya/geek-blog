---
draft: false
slug: py2
title: print() 函数是如何工作的？
date: 2026-07-20
description: print()是 Python 中最常用、最基础的内置函数之一，主要作用是将内容输出（显示）到终端（控制台）。程序运行时，我们可以使用
  print() 查看程序结果、调试代码或向用户显示信息。
cover: /images/python.png
tags:
  - 随笔
series: python-basics
---
# print() 的基本语法

```python
print(要输出的内容)
```

例如：

```python
print("Python")
```

输出：

```text
Python
```

括号里面放什么，屏幕上就显示什么。

---

# 什么是字符串（String）？

上面的例子中：

```python
print("Hello world!")
```

其中：

```python
"Hello world!"
```

就是一个**字符串（String）**。

## 什么是字符串？

字符串就是：

> **由一串字符组成的数据，并且需要使用引号包围。**

例如：

```python
"Hello"
```

```python
"Python"
```

```python
"我是学生"
```

```python
"123"
```

这些全部都是字符串。

因为它们都被引号包围了。

Python 中字符串可以使用两种引号。

| 写法 | 是否正确 |
|------|----------|
| `"Hello"` | ✅ |
| `'Hello'` | ✅ |

例如：

```python
print("Hello")
```

和

```python
print('Hello')
```

输出完全一样：

```text
Hello
```

> **小提示：**
>
> 初学者可以统一使用双引号 `"`，这样阅读代码会更加统一。

---

# 什么是参数（Argument）？

来看下面这句代码：

```python
print("Hello world!")
```

其中：

```python
"Hello world!"
```

就是传递给 `print()` 的**参数（Argument）**。

可以把参数理解成：

> **交给函数处理的数据。**

就像点外卖一样：

```text
外卖平台
      │
      ▼
下单（参数）
      │
      ▼
商家制作
```

而对于 `print()` 来说：

```text
print()
      │
      ▼
接收参数
      │
      ▼
输出到终端
```

所以：

```python
print("Python")
```

实际上就是：

> 把 `"Python"` 交给 `print()`，然后让它显示出来。

---

# print() 可以一次输出多个内容

除了输出一个内容之外，

`print()` 还可以一次输出多个内容。

只需要使用 **逗号（,）** 分隔即可。

例如：

```python
print("My favorite colors are", "blue", "green", "red")
```

输出：

```text
My favorite colors are blue green red
```

可以看到：

程序把四个内容全部输出到了同一行。

---

# 为什么没有自己写空格？

很多初学者会发现：

代码里并没有写空格：

```python
print("blue", "green")
```

但是输出却变成了：

```text
blue green
```

原因是：

> **当多个参数之间使用逗号分隔时，Python 会自动在它们之间添加一个空格。**

例如：

```python
print("I", "love", "Python")
```

输出：

```text
I love Python
```

自动添加空格后，输出会更加美观，也更方便阅读。

---

# print() 可以输出哪些内容？

目前作为初学者，你只需要知道：

`print()` 几乎可以输出任何内容，例如：

字符串：

```python
print("Hello")
```

数字：

```python
print(100)
```

多个内容：

```python
print("年龄：", 18)
```

输出：

```text
年龄： 18
```

后面的学习中，你还会接触变量、列表、字典等数据类型，它们同样可以使用 `print()` 输出。

---

# 常见错误

## ❌ 忘记写引号

错误写法：

```python
print(Hello)
```

运行会报错，因为 Python 会认为 `Hello` 是一个变量，而不是字符串。

正确写法：

```python
print("Hello")
```

---

## ❌ 忘记写括号

错误写法：

```python
print "Hello"
```

Python 3 中必须写括号。

正确写法：

```python
print("Hello")
```

---

# 学习小结

| 知识点 | 说明 |
|---------|------|
| `print()` | Python 的内置输出函数，用于将内容显示到终端（控制台）。 |
| 字符串（String） | 由字符组成，并使用单引号 `' '` 或双引号 `" "` 包围。 |
| 参数（Argument） | 传递给函数处理的数据，写在括号内。 |
| 多个参数 | 使用逗号 `,` 分隔，可一次输出多个内容。 |
| 自动空格 | 多个参数之间，Python 会自动添加一个空格。 |

---

# 总结

- `print()` 是 Python 中最基础、最常用的输出函数。
- 它能够将字符串、数字等内容显示到终端，方便查看程序运行结果。
- 字符串需要使用单引号 `' '` 或双引号 `" "` 包围。
- `print()` 可以接收一个或多个参数，多个参数之间用逗号分隔，Python 会自动添加空格。
- 熟练掌握 `print()`，是学习 Python 编程的重要第一步。
