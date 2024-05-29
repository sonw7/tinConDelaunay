# core核心代码目录结构

| Package                                                      | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [org.tinfour.common](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/package-summary.html) | 提供对Tinfor项目中的多个包通用的类或者接口。                 |
| [org.tinfour.contour](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/contour/package-summary.html) | 提供支持Delaunay 三角剖分的轮廓绘制类                        |
| [org.tinfour.edge](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/edge/package-summary.html) | 提供具有支持数据管理类的IQuadEdge接口的实现。                |
| [org.tinfour.interpolation](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/interpolation/package-summary.html) | 提供用于在TIN上执行插值的接口和支持类                        |
| [org.tinfour.io](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/io/package-summary.html) | 与I/O操作相关的实用程序                                      |
| [org.tinfour.semivirtual](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/semivirtual/package-summary.html) | 提供类和接口，<br />用于基于Delaunay三角剖分规范创建不规则三角网（TIN），并使用边的半虚拟表示来**减少内存需求**。 |
| [org.tinfour.standard](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/standard/package-summary.html) | 提供<br />用于基于Delaunay三角剖分规范创建不规则三角网（TIN）的类和接口。 |
| [org.tinfour.utils](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/utils/package-summary.html) | 为使用Tinfour软件包提供高级实用程序和通用实用程序。          |
| [org.tinfour.utils.loaders](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/utils/loaders/package-summary.html) | 定义接口并提供用于加载数据的实用程序                         |
| [org.tinfour.utils.rendering](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/utils/rendering/package-summary.html) | 提供帮助渲染Tinfour和相关应用程序图形的实用程序。            |
| [org.tinfour.vividsolutions.jts.math](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/vividsolutions/jts/math/package-summary.html) | 提供JTS拓扑套件工具的临时包。                                |
| [org.tinfour.voronoi](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/voronoi/package-summary.html) | 实现Voronoi图功能的实验包                                    |

# 主要的类IncrementalTin引入的包

<img src="/Users/kzl/Library/Application Support/typora-user-images/image-20240528141836860.png" alt="image-20240528141836860" style="zoom:50%;" />

## org.tinfour.common通用的类或者接口

**提供对Tinfor项目中的多个包通用的类或者接口。**

| Interface                                                    | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [IConstraint](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/IConstraint.html) | Defines the interface for constraints that can be added to instances of the Incremental TIN classes.<br />定义可以添加到增量三角网类实例的约束的接口。 |
| [IIncrementalTin](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/IIncrementalTin.html) | Defines the primary methods used by an incremental TIN implementation.<br />定义增量TIN实现所使用的主要方法。 |
| [IIncrementalTinNavigator](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/IIncrementalTinNavigator.html) | Provides utilities for performing geometry-based query operations on an incremental tin.<br />提供用于对增量锡执行基于几何图形的查询操作的实用程序。 |
| [IIntegrityCheck](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/IIntegrityCheck.html) | Defines methods to be used for checking the correctness of code for Incremental TIN implementations.<br />定义用于检查增量TIN实现代码正确性的方法。 |
| [IMonitorWithCancellation](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/IMonitorWithCancellation.html) | Provides an interface that allows an process to report its progress to a monitoring application and also permits the implementation of a "voluntary cancellation" action.<br />提供一个接口，允许流程向监控应用程序报告其进度，还允许执行“自愿取消”操作。 |
| [INeighborEdgeLocator](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/INeighborEdgeLocator.html) | Defines methods for a reusable instance of a class for searching a TIN and locating the neighboring edge.<br />定义用于搜索三角网和定位相邻边的类的可重用实例的方法。 |
| [INeighborhoodPointsCollector](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/INeighborhoodPointsCollector.html) | Defines an interface for collecting the points in the proximity of a specified pair of coordinates.<br />定义一个接口，用于收集指定坐标对附近的点。 |
| [IPolyline](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/IPolyline.html) | An interface for defining a polyline feature (a polygon or chain of connected line segments). |
| [IProcessUsingTin](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/IProcessUsingTin.html) | An interface for classes that perform processing on a TIN.   |
| [IQuadEdge](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/IQuadEdge.html) | Defines methods for accessing the data in a quad-edge implementation.<br />定义在四边形边缘实现中访问数据的方法。 |
| [ISamplePoint](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/ISamplePoint.html) | Defines a sample point interface to be used for spatial data analysis. |

| Class                                                        | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [BootstrapUtility](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/BootstrapUtility.html) | 一种实用程序，用于执行标准和虚拟增量TIN实现通用的引导操作部分。 |
| [Circumcircle](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/Circumcircle.html) | Provides center coordinates and radius for a circumcircle.   |
| [GeometricOperations](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/GeometricOperations.html) | 提供元素和方法，以支持必要时使用“双精度”进行几何运算。       |
| [LinearConstraint](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/LinearConstraint.html) | An implementation of the IConstraint interface intended to store constraints comprised of a chain of connected line segments. |
| [NearestEdgeResult](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/NearestEdgeResult.html) | Provides a minimal set of data elements for the result of a nearest-edge location operation. |
| [NeighborEdgeVertex](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/NeighborEdgeVertex.html) | Provides a minimal set of data elements for the result of a neighbor-edge location operation. |
| [PolygonConstraint](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/PolygonConstraint.html) | An implementation of the IConstraint interface intended to store constraints comprised of a polygon. |
| [PolyLineConstraintAdapter](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/PolyLineConstraintAdapter.html) | An implementation of the IConstraint interface intended to store constraints comprised of a chain of connected line segments. |
| [SimpleTriangle](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/SimpleTriangle.html) | Provides methods and elements for a simple representation of a triangle based on IQuadEdge edges.<br />为基于IQuadEdge边的三角形的简单表示提供方法和元素。 |
| [SimpleTriangleIterator](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/SimpleTriangleIterator.html) | An implementation of an iterator for looping through the triangles implicit in a Triangulated Irregular Network.<br />迭代器的一种实现，用于在不规则三角形网络中隐含的三角形中循环。 |
| [Thresholds](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/Thresholds.html) | Provides a standard calculation of threshold values appropriate for use in an incremental TIN implementation based on nominal point spacing.<br />提供阈值的标准计算，适用于基于标称点间距的增量三角网实施。 |
| [TriangleCount](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/TriangleCount.html) | Provides descriptive data for a Triangulated Irregular Network (TIN).<br />提供不规则三角网（TIN）的描述性数据。 |
| [Vertex](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/Vertex.html) | Represents a point in a connected network on a planar surface.<br />表示平面上连接网络中的点。 |
| [VertexAdjustment](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/VertexAdjustment.html) | Provides a wrapper class used to represent the adjusted position of a vertex. |
| [VertexIterator](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/VertexIterator.html) | An implementation of an iterator for looping through the vertices that form a Triangulated Irregular Network.<br />迭代器的一种实现，用于在形成三角形不规则网络的顶点之间循环。 |
| [VertexMergerGroup](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/VertexMergerGroup.html) | A synthetic vertex used to handle cases when multiple vertices occupy coincident locations.<br />一种合成顶点，用于处理多个顶点占据重合位置的情况。 |

| Enum                                                         | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [BootstrapUtility.BootstrapTestResult](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/BootstrapUtility.BootstrapTestResult.html) | Indicates the results of the evaluation for a set of input points. |
| [VertexMergerGroup.ResolutionRule](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/common/VertexMergerGroup.ResolutionRule.html) | Specifies a rule for determining a z value based on the collection of coincident vertices. |

## org.tinfour.contour

提供支持Delaunay 三角剖分的轮廓绘制类

## org.tinfour.edge数据管理类的IQuadEdge接口的实现

提供具有支持数据管理类的IQuadEdge接口的实现

| Class                                                        | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [EdgePool](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/edge/EdgePool.html) | Provides an object-pool implementation that the manages the allocation, deletion, and reuse of Edges.<br />提供一个对象池实现，用于管理Edges的分配、删除和重用。 |
| [QuadEdge](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/edge/QuadEdge.html) | A representation of an edge with forward and reverse links on one side and counterpart links attached to its dual (other side).<br />边的一种表示形式，其一侧具有正向和反向链接，其对偶链接（另一侧）连接有对应链接。 |
| [QuadEdgeConstants](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/edge/QuadEdgeConstants.html) | Defines constants for use in QuadEdge related operations.<br />定义用于QuadEdge相关操作的常量。 |
| [QuadEdgePinwheel](https://gwlucastrig.github.io/TinfourDocs/javadoc/TinfourCore-2.1.6-javadoc/org/tinfour/edge/QuadEdgePinwheel.html) | Provides an implementation of the pinwheel operation via the Iterator and Iterable interfaces. |

## org.tinfour.interpolation

提供用于在TIN上执行插值的接口和支持类

## org.tinfour.io

与I/O操作相关的实用程序

## org.tinfour.semivirtual（对tin的另一种实现）

提供类和接口，<br />用于基于Delaunay三角剖分规范创建不规则三角网（TIN），并使用边的半虚拟表示来**减少内存需求**。

## org.tinfour.standard

提供<br />用于基于Delaunay三角剖分规范创建不规则三角网（TIN）的类和接口。

## org.tinfour.utils

为使用Tinfour软件包提供高级实用程序和通用实用程序。

### org.tinfour.utils.loaders

定义接口并提供用于加载数据的实用程序

### org.tinfour.utils.rendering

提供帮助渲染Tinfour和相关应用程序图形的实用程序。

## org.tinfour.vividsolutions.jts.math

提供JTS拓扑套件工具的临时包。



## org.tinfour.voronoi

实现Voronoi图功能的实验包