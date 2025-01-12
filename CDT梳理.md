## Step1 无约束三角剖分

### 1、初始化	

在初始化之前，方法会累积顶点；初始化完成后，直接增量插入。

通过 bootstrap() 方法完成初始三角形构建。

bootstrap 方法的主要作用是创建初始三角形（最小 TIN），使得后续顶点能够基于此结构进行插入。

**方法功能**

​	•**输入**: 一个顶点列表 list。

​	•**输出**: 一个布尔值，表示是否成功完成初始化。

**代码解析**

**1. 调用工具类完成初步检查**

```js
Vertex[] v = new BootstrapUtility(thresholds).bootstrap(list);

if (v == null) {

 return false;

}
```

​	•**调用** BootstrapUtility:

​	•使用 BootstrapUtility 工具类，从输入的 list 中选取合适的三个顶点（必须是非共线的）。

​	•返回一个顶点数组 v，包含构建初始三角形的三个顶点。

​	•如果返回 null，说明无法完成初始化（例如顶点不足或所有顶点共线）。

**2. 分配初始边**

```java
QuadEdge e1 = edgePool.allocateEdge(v[0], v[1]);

QuadEdge e2 = edgePool.allocateEdge(v[1], v[2]);

QuadEdge e3 = edgePool.allocateEdge(v[2], v[0]);

QuadEdge e4 = edgePool.allocateEdge(v[0], null);

QuadEdge e5 = edgePool.allocateEdge(v[1], null);

QuadEdge e6 = edgePool.allocateEdge(v[2], null);

```

​	•**通过** edgePool **创建边对象**:

​	•e1, e2, e3：初始三角形的三条边。

​	•e4, e5, e6：从每个顶点发出的无限远（虚拟）边。

**3. 获取对偶边**

```java
QuadEdge ie1 = e1.getDual();

QuadEdge ie2 = e2.getDual();

QuadEdge ie3 = e3.getDual();

QuadEdge ie4 = e4.getDual();

QuadEdge ie5 = e5.getDual();

QuadEdge ie6 = e6.getDual();
```

​	•每条边都有一个对偶边（Dual），用于表示边的两个方向。

​	•例如，e1 表示从 v[0] 到 v[1] 的边，对偶边 ie1 表示从 v[1] 到 v[0]。

**4. 设置边的连接关系**

```java
e1.setForward(e2);

e2.setForward(e3);

e3.setForward(e1);

e4.setForward(ie5);

e5.setForward(ie6);

e6.setForward(ie4);



ie1.setForward(e4);

ie2.setForward(e5);

ie3.setForward(e6);

ie4.setForward(ie3);

ie5.setForward(ie1);

ie6.setForward(ie2);
```

​	•	**定义初始三角形的循环边关系**:

​	•	e1 → e2 → e3 → e1：三角形的边按顺时针方向连接。

​	•	虚拟边与普通边互相连接，形成完整的拓扑结构。



**5. 设置初始化状态**



isBootstrapped = true;



​	•	标记 TIN 已成功初始化。



**6. 计算边界范围**

```js
boundsMinX = v[0].x;

boundsMaxX = boundsMinX;

boundsMinY = v[0].y;

boundsMaxY = boundsMinY;

for (int i = 1; i < 3; i++) {

 if (v[i].x < boundsMinX) {

  boundsMinX = v[i].x;

 } else if (v[i].x > boundsMaxX) {

  boundsMaxX = v[i].x;

 }

 if (v[i].y < boundsMinY) {

  boundsMinY = v[i].y;

 } else if (v[i].y > boundsMaxY) {

  boundsMaxY = v[i].y;

 }

}
```

​	•	**初始化边界**:

​	•	遍历三角形的三个顶点，计算 x 和 y 的最小值和最大值，更新边界值。

​	•	这些边界将用于后续的顶点插入和三角形更新。



**7. 返回结果**

```js
return true;
```

​	•	返回 true，表示成功完成初始化。



**方法亮点**

​	1.	**灵活处理输入数据**:

​	•	通过工具类 BootstrapUtility 提供了可靠的顶点筛选机制。

​	•	允许在输入顶点数据存在共线或冗余时继续执行。

​	2.	**高效的边池分配**:

​	•	使用 edgePool 优化内存管理，减少边对象的频繁创建与销毁。

​	3.	**严格的拓扑维护**:

​	•	确保三角形边的连接关系正确。

​	•	为后续的增量插入奠定拓扑基础。



**总结**

​	•	**作用**: 初始化最小三角形，为 TIN 构建提供基础。

​	•	**关键点**:

​	1.	从输入顶点中筛选 3 个非共线顶点。

​	2.	使用边池创建三角形的边和对偶边。

​	3.	设置边的连接关系，形成完整的拓扑结构。

​	4.	更新 TIN 的边界范围。



如果有进一步问题（例如 BootstrapUtility 的细节或 edgePool 的实现），请随时提问！

### 2、增量插入

addWithInsertOrAppend 方法实现了增量地将一个顶点插入到当前的 Delaunay 三角网（TIN）中的逻辑。以下是插入的具体流程和关键步骤：

#### 2.1. 边界检查和更新

```js
if (x < boundsMinX) {

 boundsMinX = x;

} else if (x > boundsMaxX) {

 boundsMaxX = x;

}

if (y < boundsMinY) {

 boundsMinY = y;

} else if (y > boundsMaxY) {

 boundsMaxY = y;

}
```

​	•	**功能**：检查插入点是否超出当前 TIN 的边界，并更新边界信息。

​	•	**目的**：保持三角网的边界信息动态更新，以便后续查询和插入操作。

#### 2.2找到包含插入点的三角形

```java
searchEdge = walker.findAnEdgeFromEnclosingTriangle(searchEdge, x, y);
```

​	•	**功能**：

​	•	使用 walker 对象定位包含插入点 (x, y) 的三角形或靠近插入点的边。

​	•	这是 Delaunay 插入操作的关键步骤，用于减少搜索范围。

​	•	**算法特点**：通过搜索边，优化了查找插入位置的效率。

有虚拟顶点 所以一定可以找到

**2.3. 检查顶点是否已存在**

```java
QuadEdge matchEdge = checkTriangleVerticesForMatch(searchEdge, x, y, vertexTolerance2);

if (matchEdge != null) {

 mergeVertexOrIgnore(matchEdge, v);

 return false;

}
```

​	•	**功能**：

​	•	检查插入点是否与现有顶点非常接近（基于 vertexTolerance2）。

​	•	如果接近，合并顶点或忽略插入。

​	•	**目的**：避免重复插入顶点，保证数据的一致性。

2.4. 创建初始边并连接

```java
Vertex anchor = searchEdge.getA();

QuadEdge pStart = edgePool.allocateEdge(v, anchor);

QuadEdge p = pStart;

p.setForward(searchEdge);
```

​	•	**功能**：

​	•	从当前顶点 anchor 到新插入顶点 v 创建一条新边。

​	•	新边作为起始边（pStart），并将其与包含三角形的当前边 searchEdge 连接。

#### 2.5. Delaunay条件检查与修复**

```java
double h = (a11 * a11 + a12 * a12) * (a21 * a32 - a31 * a22)

 +  (a21 * a21 + a22 * a22) * (a31 * a12 - a11 * a32)

 + (a31 * a31 + a32 * a32) * (a11 * a22 - a21 * a12);
```

​	•**功能**：

​	•使用 Delaunay **内接圆准则**（In-Circle Criterion）判断新三角形是否满足 Delaunay 性质。

​	•如果不满足（h >= 0），移除当前边并替换成新边，同时调整连接关系。

​	•**目的**：确保插入新顶点后，整个网格仍然符合 Delaunay 性质。

**6. 完成边的拓扑修复**

```java
if (c.getB() == anchor) {

 pStart.getDual().setForward(p);

 searchEdge = pStart;

 break;

}

```

​	•	**功能**：

​	•	检查当前边是否回到插入点的起始边（anchor）。

​	•	如果是，完成所有边的连接，并退出循环。



**7. 优化内存使用**

if (buffer != null) {

 edgePool.deallocateEdge(buffer);

}

​	•	**功能**：

​	•	使用 buffer 暂存边的引用，避免频繁的对象创建和销毁。

​	•	如果 buffer 存在多余的边，则释放内存。



**8. 返回插入成功**

```java
return true;
```

​	•	**功能**：

​	•	插入完成后返回 true，表示顶点成功插入并且网格已更新。



**流程总结**

​	1.	**定位插入位置**：通过 findAnEdgeFromEnclosingTriangle 找到包含插入点的三角形。

​	2.	**检查重复顶点**：避免插入与现有顶点过于接近的点。

​	3.	**创建新边**：从包含三角形的边出发，创建初始边并连接到新顶点。

​	4.	**修复 Delaunay 性质**：检查新边和相邻边是否满足内接圆准则，必要时移除旧边并更新结构。

​	5.	**完成连接**：完成所有边的连接，更新拓扑信息。



**特点**

​	•	**增量插入**：新顶点逐个插入，不需要预先生成所有顶点。

​	•	**高效性**：使用搜索边和局部拓扑修复，优化了插入效率。

​	•	**Delaunay 性质**：始终保证插入后的三角网符合 Delaunay 性质。

​	•	**内存优化**：通过 buffer 和边池（edgePool）减少内存消耗，提高性能。



该方法是 Tinfour 增量 Delaunay 算法的重要核心之一，其设计保证了插入效率和网格的准确性。



## Step 2 有约束边界的三角剖分



# 虚拟顶点

初始化从每个顶点发出的无限远（虚拟）边 (e4, e5, e6) 的目的是为了建立一个完整的拓扑结构，并为后续的增量插入提供支持。这种初始化方法有以下几个目的：



**1. 确保拓扑结构完整**

​	•	Delaunay 三角剖分需要完整的拓扑结构来支持边操作（例如边的连接、切换、插入等）。

​	•	初始化无限远边（虚拟边）可以将初始三角形与外部“无限远”的空间相连，保证拓扑结构是封闭的。

​	•	通过这些虚拟边，可以简化后续的拓扑操作逻辑，特别是在边界区域进行处理时。



**2. 支持增量插入算法**

​	•	增量插入算法依赖当前的 TIN 结构，并在现有结构的基础上插入新顶点。

​	•	在插入新顶点时：

​	1.	可能会扩展当前边界。

​	2.	需要判断新顶点是否落在当前 TIN 的范围内。

​	•	虚拟边为处理边界情况提供了框架：

​	•	它们允许在初始三角形外插入新点时快速定位边界。



**3. 处理无限边界的约束**

​	•	虚拟边充当边界的“哨兵”：

​	•	它们允许将三角剖分扩展到无限边界外（尽管物理上不可能，但在算法逻辑中是必要的）。

​	•	虚拟边可以使剖分算法适应任何几何形状或大小的数据集。



**4. 简化边和顶点的管理**

​	•	虚拟边使得每个顶点都有一条出边，无论该顶点是否是边界顶点。

​	•	这样可以统一处理顶点和边的关系，避免特殊情况的判断。

​	•	例如：

​	•	一个边界顶点可能没有三角形内的邻边，但通过虚拟边，可以轻松找到该顶点的关联信息。



**5. 为后续操作提供对偶边支持**

​	•	每条边都有一个对偶边，虚拟边的初始化同样包含对偶边。

​	•	对偶边为以下操作提供支持：

​	•	查找边的另一侧三角形。

​	•	维护边的方向和循环链。



**6. 计算边界范围和扩展时的辅助**

​	•	初始化 TIN 时需要计算三角形的边界范围（boundsMinX, boundsMaxX, 等）。

​	•	虚拟边提供了处理边界的能力，使得三角剖分在扩展边界时仍然能够保持一致的结构。



**总结**



初始化从每个顶点发出的虚拟边的主要目的是：

​	1.	**建立完整拓扑结构**，确保算法的正确性和稳定性。

​	2.	**支持增量插入和边界处理**，简化后续的顶点插入和三角形扩展逻辑。

​	3.	**统一处理边界和对偶边**，减少特殊情况的复杂性。



虚拟边虽然在实际三角剖分中没有直接的物理意义，但在算法设计中是不可或缺的一部分，用于简化和增强处理边界的能力。

























# 接口解读

以下是 IIncrementalTin 接口的各个方法的功能解读：

**基本管理功能**

​	1.	clear()

​	•	清除所有内部状态数据，释放已分配的资源，以便重用。

​	•	多次处理不同数据集时，可以减少与边对象相关的开销。

​	2.	dispose()

​	•	清空所有数据和引用，便于垃圾回收。

​	•	与 clear() 不同，dispose() 会使对象无法再次使用。

**统计与诊断**

​	3.	countTriangles()

​	•	获取三角形统计信息，用于了解构造过程中生成的三角形数量。

​	4.	printDiagnostics(PrintStream ps)

​	•	打印 TIN 构造过程中的统计和诊断信息，便于调试或分析。

​	5.	printEdges(PrintStream ps)

​	•	输出 TIN 中的边信息，便于调试或验证。



**边和顶点相关功能**

​	6.	getEdges()

​	•	获取当前分配的边对象列表。

​	•	返回的边对象不可修改，修改会破坏 TIN 结构。

​	7.	getEdgeIterator()

​	•	返回一个迭代器，用于遍历当前存储的边。

​	•	注意：迭代器不支持并发修改。

​	8.	edges()

​	•	提供用于增强 for 循环的便捷实现，迭代生成非虚拟边（实际边）。

​	9.	getVertices()

​	•	返回 TIN 中存储的顶点列表，可能不按输入顺序返回。

​	•	列表中的顶点对象可以修改其索引，但几何相关字段不可修改。

​	10.	vertices()

​	•	提供便捷的迭代器，用于增强 for 循环访问顶点，无重复或遗漏。



**TIN 状态与范围**

​	11.	getBounds()

​	•	获取 TIN 的边界范围（Rectangle2D），未初始化时返回 null。

​	12.	isBootstrapped()

​	•	检查 TIN 是否已经初始化（需要至少 3 个非共线点）。

​	13.	getMaximumEdgeAllocationIndex()

​	•	获取当前分配边的最大索引值，便于应用程序管理边的附加信息。

​	14.	getNominalPointSpacing()

​	•	获取用于距离判断的“名义点间距”，一般为样本平均间距或密集区域的间距。

​	15.	getThresholds()

​	•	返回与此实例关联的阈值对象（不可变，可安全共享）。



## **约束相关功能**

​	16.	addConstraints(List<IConstraint> constraints, boolean restoreConformity)

​	•	添加约束（如边界或线性约束）到 TIN。

​	•	可选择是否通过插入合成点来恢复 Delaunay 一致性。

​	17.	getConstraints()

​	•	返回当前存储的约束列表，可能为空。

​	18.	getConstraint(int index)

​	•	根据索引获取约束，索引无效时返回 null。

​	19.	getRegionConstraint(IQuadEdge edge)

​	•	获取与边相关的区域约束（如边界约束）。

​	20.	getLinearConstraint(IQuadEdge edge)

​	•	获取与边相关的线性约束（如中间的线性限制）。



## **增量操作**

### 21.	add(Vertex v)

​	•	向 TIN 添加单个顶点。

​	•	若尚未初始化，点会存储在列表中，直到达到初始化条件。

​	22.	add(List<Vertex> list, IMonitorWithCancellation monitor)

​	•	批量添加顶点。

​	•	在初始化阶段随机选择三个点作为初始三角形，若点排列随机，可通过 HilbertSort 优化。

​	23.	remove(Vertex vRemove)

​	•	从 TIN 中移除指定顶点。

​	•	如果顶点属于合并组，仅从组中移除，结构不受影响。

​	24.	splitEdge(IQuadEdge eInput, double zSplit, boolean restoreConformity)

​	•	在边的中点插入顶点。

​	•	可选择是否恢复 Delaunay 一致性（目前未实现）。



**导航与邻域**

​	25.	getNeighborEdgeLocator()

​	•	获取邻域边定位器（已过时，建议使用 getNavigator）。

​	26.	getNavigator()

​	•	获取导航器，可用于几何查询（如点是否在 TIN 内、获取邻边等）。

​	27.	getNeighborhoodPointsCollector()

​	•	获取邻域点收集器，用于高效查询点附近的信息。



**合并顶点**

​	28.	setResolutionRuleForMergedVertices(VertexMergerGroup.ResolutionRule rule)

​	•	设置合并顶点的 Z 值解释规则。

​	29.	getSyntheticVertexCount()

​	•	获取 TIN 中添加的合成顶点数量。



这份接口设计为增量 Delaunay 三角网 (TIN) 的构建提供了全面的功能支持，同时注重性能、扩展性和内存效率的平衡，非常适合处理大规模空间数据集。