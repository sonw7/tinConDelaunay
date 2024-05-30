# 1、过滤重复三角形

为了检测和剔除 `BufferGeometry` 中重复的三角面索引，我们可以使用一个 JavaScript 函数来处理索引数组。以下是完成这一任务的步骤：

1. 对索引数组进行遍历，每次取出一组代表三角形的三个索引。
2. 将每组索引排序并转换成字符串形式，以便比较是否相同。
3. 使用一个集合（如 `Set`）来存储唯一的三角形索引组合。
4. 如果集合中已经存在当前索引组合，则认为它是重复的，不将其添加到最终的索引数组中。

下面是实现该功能的示例代码：

```JS
function removeDuplicateTriangles(indices) {
  // 创建一个新的 Set 来存储不重复的三角形
  const uniqueTriangleSet = new Set();
  const uniqueIndices = [];

  for (let i = 0; i < indices.length; i += 3) {
    // 获取每个三角形的顶点索引
    const index1 = indices[i];
    const index2 = indices[i + 1];
    const index3 = indices[i + 2];

    // 排序索引使得三角形的表示唯一
    const sortedTriangle = [index1, index2, index3].sort((a, b) => a - b);
    const triangleString = sortedTriangle.join('_');

    // 检查三角形是否已存在
    if (!uniqueTriangleSet.has(triangleString)) {
      uniqueTriangleSet.add(triangleString); // 添加到集合中
      uniqueIndices.push(index1, index2, index3); // 添加到最终的索引数组中
    }else {
        duplicateCount++; // 发现重复时递增计数器
      }
  }

  return uniqueIndices;
}

// 假设你有一个包含索引的数组，此数组可能包含重复的三角形
const indices = [0, 1, 2, 2, 1, 0, 3, 4, 5, 0, 1, 2]; // 示例数据，其中有重复的三角形

// 移除重复的三角形索引
const uniqueIndices = removeDuplicateTriangles(indices);

console.log(uniqueIndices); // 输出去重后的索引数组
```

请注意，由于我们对每个三角形的索引进行了排序，因此例如 `[0, 1, 2]` 和 `[2, 1, 0]` 被视为相同的三角形。

如果您希望改动原有的 `BufferGeometry` 对象以移除重复的三角形，您需要将结果赋给几何体的相应属性，并且可能需要更新相关的 WebGL 缓冲区。如果您使用的是 `THREE.js` 库，您可能还需要调用 `geometry.setIndex(uniqueIndices)` 方法并标记索引缓冲区需更新 `geometry.index.needsUpdate = true`。

# 2、计算点的法向量computeVertexNormals

```js
computeVertexNormals() {

		const index = this.index;
		const positionAttribute = this.getAttribute( 'position' );

		if ( positionAttribute !== undefined ) {

			let normalAttribute = this.getAttribute( 'normal' );

			if ( normalAttribute === undefined ) {

				normalAttribute = new BufferAttribute( new Float32Array( positionAttribute.count * 3 ), 3 );
				this.setAttribute( 'normal', normalAttribute );

			} else {

				// reset existing normals to zero

				for ( let i = 0, il = normalAttribute.count; i < il; i ++ ) {
//.setXYZ ( index : Integer, x : Float, y : Float, z : Float ) : this
//设置给定索引的矢量的第一、二、三维数据（设置 X、Y 和 Z 值）。
					normalAttribute.setXYZ( i, 0, 0, 0 );

				}

			}

			const pA = new Vector3(), pB = new Vector3(), pC = new Vector3();
			const nA = new Vector3(), nB = new Vector3(), nC = new Vector3();
			const cb = new Vector3(), ab = new Vector3();

			// indexed elements

			if ( index ) {
        //如果存在index
				for ( let i = 0, il = index.count; i < il; i += 3 ) {

          //一次获取三个点
					const vA = index.getX( i + 0 );
					const vB = index.getX( i + 1 );
					const vC = index.getX( i + 2 );

          //从positionAttribute获取
					pA.fromBufferAttribute( positionAttribute, vA );
					pB.fromBufferAttribute( positionAttribute, vB );
					pC.fromBufferAttribute( positionAttribute, vC );

          //.subVectors ( a : Vector3, b : Vector3 ) : this
          //将该向量设置为a - b。
					cb.subVectors( pC, pB );
					ab.subVectors( pA, pB );
          
          //叉乘
					cb.cross( ab );
          
          //从normalAttribute获取
					nA.fromBufferAttribute( normalAttribute, vA );
					nB.fromBufferAttribute( normalAttribute, vB );
					nC.fromBufferAttribute( normalAttribute, vC );
          
          //.add ( v : Vector3 ) : this
          //将传入的向量v和这个向量相加。
					nA.add( cb );
					nB.add( cb );
					nC.add( cb );
          //再设置
					normalAttribute.setXYZ( vA, nA.x, nA.y, nA.z );
					normalAttribute.setXYZ( vB, nB.x, nB.y, nB.z );
					normalAttribute.setXYZ( vC, nC.x, nC.y, nC.z );

				}

			} else {

				// non-indexed elements (unconnected triangle soup)

				for ( let i = 0, il = positionAttribute.count; i < il; i += 3 ) {

					pA.fromBufferAttribute( positionAttribute, i + 0 );
					pB.fromBufferAttribute( positionAttribute, i + 1 );
					pC.fromBufferAttribute( positionAttribute, i + 2 );

					cb.subVectors( pC, pB );
					ab.subVectors( pA, pB );
					cb.cross( ab );

					normalAttribute.setXYZ( i + 0, cb.x, cb.y, cb.z );
					normalAttribute.setXYZ( i + 1, cb.x, cb.y, cb.z );
					normalAttribute.setXYZ( i + 2, cb.x, cb.y, cb.z );

				}

			}

			this.normalizeNormals();

			normalAttribute.needsUpdate = true;

		}

	}

```

该 `computeVertexNormals` 方法是一个用于计算三维几何体顶点法线的函数，通常是使用在 `THREE.BufferGeometry` 类型的对象上。以下是对代码的逐行解读：

1. 获取当前几何体的索引属性 (`this.index`) 和位置属性 (`this.getAttribute('position')`)。
2. 如果位置属性存在，那么开始执行计算法线的过程。
3. 尝试获取当前几何体的法线属性 (`this.getAttribute('normal')`)。
4. 如果法线属性不存在，则创建一个新的 `BufferAttribute` 来存储法线，并将其添加到几何体的属性中。
5. 如果法线属性已经存在，则将现有的所有法线向量重置为零向量。
6. 创建一些辅助的 `Vector3` 对象来存储顶点和计算过程中的向量。
7. 检查是否有索引信息（即几何体是否由索引化的顶点定义）。
8. 如果存在索引：
   - 遍历索引数组，每次处理一个面（由三个顶点组成）。
   - 根据索引从位置属性中获取相应的顶点坐标。
   - 计算两条边向量（`cb` 和 `ab`），然后使用叉乘得到这个面的法线向量。
   - 对于面上的每个顶点，将法线向量累加到其原始法线上。
   - 将更新的法线值回写到法线属性中。
9. 如果不存在索引（即几何体是由未连接的独立三角形组成）：
   - 直接遍历位置属性中的顶点，没三个顶点组成一个面。
   - 计算面法线，并将相同的法线值设置给这个面的三个顶点。
10. 一旦所有法线计算并累加完毕，调用 `this.normalizeNormals();` 来规范化所有法线向量，确保它们的长度都是1。
11. 设置法线属性需要更新标记，告诉渲染器该属性已经被修改。

请注意，此方法假设每个面是由具有逆时针顺序的三个顶点定义的。这会影响叉乘结果的方向，因为叉乘遵循右手定则。

最后，这个方法的目的是为了确保几何体的每个顶点都有正确的法线向量，这对于后续的光照计算和渲染效果至关重要





# 3、判断从哪个朝向计算法向量

若要判断一个法向量穿过 XY、YZ 或 XZ 平面，我们可以观察法向量的分量。以下是如何根据法向量的分量来确定它穿过哪个平面：

XY 平面：在三维空间中，XY 平面是由 X 轴和 Y 轴定义的平面，其法线沿着 Z 轴方向。因此，如果一个法向量主要有 Z 分量（即 Z 分量的绝对值远大于 X 和 Y 分量的绝对值），那么可以认为这个法向量指向或穿过 XY 平面。

YZ 平面：YZ 平面是由 Y 轴和 Z 轴定义的平面，其法线沿着 X 轴方向。如果法向量主要有 X 分量，则该向量指向或穿过 YZ 平面。

XZ 平面：XZ 平面是由 X 轴和 Z 轴定义的平面，其法线沿着 Y 轴方向。如果法向量主要有 Y 分量，则该向量指向或穿过 XZ 平面。

下面是一个简单的示例代码，演示如何进行这种判断：

```js
// 假设 vector 是 THREE.Vector3 对象，表示法向量
function determinePlane(vector) {
  const tolerance = 0.01; // 用于处理舍入误差的容忍值

  // 获取法向量的各分量
  const nx = Math.abs(vector.x);
  const ny = Math.abs(vector.y);
  const nz = Math.abs(vector.z);

  // 比较分量大小来判断法向量穿过的平面
  if (nz > nx && nz > ny && nz > tolerance) {
    return "XY";
  } else if (nx > ny && nx > nz && nx > tolerance) {
    return "YZ";
  } else if (ny > nx && ny > nz && ny > tolerance) {
    return "XZ";
  } else {
    return "Unknown"; // 分量相近或都很小，无法确定
  }
}

const vector = new THREE.Vector3(0.1, 0.2, 0.9); // 示例法向量
const plane = determinePlane(vector); // 判断穿过的平面
console.log(plane); // 输出: "XY"，因为 Z 分量最大
```

在实际应用中，当所有分量都接近零时，将难以确定法向量穿过的确切平面。还要注意，实际上向量并不是“穿过”平面，而是垂直于某个平面。此函数基于法向量的相对分量大小来确定它最可能垂直于哪个主轴平面。

# 4、包围盒计算computeBoundingBox()

```js
Geometry.computeBoundingBox();


computeBoundingBox() {

		if ( this.boundingBox === null ) {

			this.boundingBox = new Box3();

		}

		const position = this.attributes.position;
		const morphAttributesPosition = this.morphAttributes.position;
//如果 position 是一个 GLBufferAttribute （意味着它是直接在 WebGL 中使用的一个缓冲区属性），则无法自动计算边界框。
//在这种情况下，输出错误信息，并将包围盒设置为包含所有可能点的无限大区域，然后提前返回。
		if ( position && position.isGLBufferAttribute ) {

			console.error( 'THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.', this );

			this.boundingBox.set(
				new Vector3( - Infinity, - Infinity, - Infinity ),
				new Vector3( + Infinity, + Infinity, + Infinity )
			);

			return;

		}
//如果position没问题 开始计算
if ( position !== undefined ) {
//如果 position 属性存在，则使用 setFromBufferAttribute 方法基于顶点位置数据计算出包围盒。
//是Box3的方法
			this.boundingBox.setFromBufferAttribute( position );

			// process morph attributes if present

			if ( morphAttributesPosition ) {	
//如果有形变位置属性（morphAttributesPosition），就需要遍历这些属性：

//对每个形变属性构建一个临时的边界框 _box。
//判断是否是相对形变目标（this.morphTargetsRelative）：
//如果是，需要将形变位置与原始边界框的最小和最大点相加，然后根据结果扩展原始边界框。
//如果不是相对形变目标，直接根据形变属性扩展原始边界框。
				for ( let i = 0, il = morphAttributesPosition.length; i < il; i ++ ) {
//const _box = /*@__PURE__*/ new Box3();

					const morphAttribute = morphAttributesPosition[ i ];
					_box.setFromBufferAttribute( morphAttribute );

					if ( this.morphTargetsRelative ) {

						_vector.addVectors( this.boundingBox.min, _box.min );
						this.boundingBox.expandByPoint( _vector );

						_vector.addVectors( this.boundingBox.max, _box.max );
						this.boundingBox.expandByPoint( _vector );

					} else {

						this.boundingBox.expandByPoint( _box.min );
						this.boundingBox.expandByPoint( _box.max );

					}

				}

			}

		} else {
//如果没有 position 属性，则调用 makeEmpty 方法使包围盒为空。
			this.boundingBox.makeEmpty();

		}

		if ( isNaN( this.boundingBox.min.x ) || isNaN( this.boundingBox.min.y ) || isNaN( this.boundingBox.min.z ) ) {
      //最后，检查计算出的包围盒的最小和最大向量是否包含 NaN 值。如果有 NaN 值，说明 position 属性可能有问题（如包含 NaN 值），此时会输出错误信息

			console.error( 'THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this );

		}

	}

//-----------------box3.setFromBufferAttribute( position )

const _vector = /*@__PURE__*/ new Vector3();
setFromBufferAttribute( attribute ) {

		this.makeEmpty();//清空

		for ( let i = 0, il = attribute.count; i < il; i ++ ) {

			this.expandByPoint( _vector.fromBufferAttribute( attribute, i ) );

		}

		return this;

	}
//makeEmpty
makeEmpty() {

		this.min.x = this.min.y = this.min.z = + Infinity;
		this.max.x = this.max.y = this.max.z = - Infinity;

		return this;

	}
//expandByPoint
expandByPoint( point ) {

		this.min.min( point );
		this.max.max( point );

		return this;

	}
//看看box3的构造函数
//最小的坐标初始化为无穷大，最大的坐标初始化为无穷小
constructor( min = new Vector3( + Infinity, + Infinity, + Infinity ), max = new Vector3( - Infinity, - Infinity, - Infinity ) ) {

		this.isBox3 = true;

		this.min = min;
		this.max = max;

	}

	set( min, max ) {

		this.min.copy( min );
		this.max.copy( max );

		return this;

	}
//min和max函数，如果该向量的x值、y值或z值小于（大于）所传入v的x值、y值或z值， 则将该值替换为对应的最大值（最小值）。
//三个坐标都会比较
min( v ) {

		this.x = Math.min( this.x, v.x );
		this.y = Math.min( this.y, v.y );
		this.z = Math.min( this.z, v.z );

		return this;

	}

	max( v ) {

		this.x = Math.max( this.x, v.x );
		this.y = Math.max( this.y, v.y );
		this.z = Math.max( this.z, v.z );

		return this;

	}

```

上述形变位置属性（morphAttributesPosition）无需考虑。



# 5、纹理计算



```js
 Geometry.setAttribute( 'uv', new THREE.BufferAttribute(
     boxUvCom( Geometry.getAttribute('position'),//点集
     Geometry.getAttribute('normal'),//坐标
     //包围盒最大最小边界
     Geometry.boundingBox.max, 
     Geometry.boundingBox.min,
     10)
    , 2 ) );
```

## 核心代码

```JS
export function boxUvCom(ovDate,oNormal,max,min,size){
    //ovDate.count 点个数
    console.log("计算uv的点个数",ovDate)
    console.log("每个点法向量",oNormal)
    console.log(max)
    //分别记录法向量类型和点总数
    var type,vNum=ovDate.count;
    //装uv的数组
    let Uvs= new Float32Array(vNum*2);
    //坐标一致
    min.x*=size
    min.y*=size
    max.x*=size
    max.y*=size
    //存储uv的数组,2*vNum

    //包围盒的长宽高
    let dx = (max.x- min.x);
    let dy = (max.y- min.y);
    let dz = (max.z- min.z); 
    

    let v1,v2,v3;
    let nX,nY,nZ;
    v1=v2=v3=new Vector3(0,0,0);
    
    console.log(oNormal.array[0])
    console.log("rwew",(oNormal[1] >=oNormal[0] &&oNormal[1] >= oNormal[2]))
    let x1=0,y1=0,z1=0
    for(let i=0;i<vNum;i++){
        //顶点坐标
        v1.x=ovDate.array[i*3]*size;
        v1.y=ovDate.array[i*3+1]*size;
        v1.z=ovDate.array[i*3+2]*size;

        //顶点三个法向
        nX=oNormal.array[i*3];
        nY=oNormal.array[i*3+1];
        nZ=oNormal.array[i*3+2];
        //取绝对值，寻找最大分量
        const absNum1 = Math.abs(nX);
        const absNum2 = Math.abs(nY);
        const absNum3 = Math.abs(nZ);
        
        if ((absNum1 > absNum2 && absNum1 > absNum3)) {
            type=0;//x分量最大，用y、z计算
            x1++
        } else if (absNum2 > absNum1 && absNum2 > absNum3) {
            type=1;//y分量最大，用x、z计算
            y1++
        } else if(absNum3 > absNum1 && absNum3 > absNum2){
            type=2;//z分量最大，用x、y计算
            z1++
        }else{
            type = 1
        }
        

        if(type==2){
            if(dx>dy){
                Uvs[i*2]=((v1.x-min.x)/dx);
                Uvs[i*2+1]=((v1.y-min.y)/dx);
            }else{
                Uvs[i*2]=((v1.x-min.x)/dy);
                Uvs[i*2+1]=((v1.y-min.y)/dy);
            }
        }else if(type==0){
            if(dz>dy){
                Uvs[i*2]=((v1.y-min.y)/dz);
                Uvs[i*2+1]=((v1.z-min.z)/dz);

            }else{
                Uvs[i*2]=((v1.y-min.y)/dy);
                Uvs[i*2+1]=((v1.z-min.z)/dy);
            }
        }else if(type==1){
            if(dx>dz){
                Uvs[i*2]=((v1.x-min.x)/dx);
                Uvs[i*2+1]=((v1.z-min.z)/dx);
            }else{
                Uvs[i*2]=((v1.x-min.x)/dz);
                Uvs[i*2+1]=((v1.z-min.z)/dz);
            }
        }

    }
    //console.log(Uvs)
    //console.log("x1",x1)
    //console.log("y1",y1)
    //console.log("z1",z1)
    return Uvs;


}
```



# 扩展

## 形变属性

在三维图形和游戏开发中，**形变 (Morphing)** 是指一种技术，可以使一个模型平滑地过渡到另一个模型。这通常用于动画，比如改变角色的表情或者其他属性。形变通常涉及两个或多个预设的模型形状（称为 *形态目标* 或 *morph targets*），它们拥有相同数量的顶点。

**形变位置属性 (`morphAttributes.position`)** 在 `THREE.js` 中是几何体中与形态目标相关联的属性。每个形态目标都包含了一组顶点位置的变化数据。当进行形变时，这些变化数据会以某种权重添加到基础模型的顶点位置上，产生新的形状。

这些形变位置属性是怎么来的呢？它们通常是由艺术家在模型制作软件中创建，并且随后导入到 `THREE.js` 程序中。在 `THREE.js` 中，你可以这样使用它们：

1. 创建 `BufferGeometry` 对象。
2. 添加顶点位置属性（基础模型）。
3. 添加一个或多个形变属性。每个形变属性对应一个形态目标。

下面是一个简单的例子，展示如何在 `THREE.js` 中设置形变位置属性：

```
javascript复制代码// 假设 geometry 是一个 THREE.BufferGeometry 对象
const geometry = new THREE.BufferGeometry();

// 添加基础模型的顶点位置属性
const vertices = new Float32Array([/* ... 顶点数据 ... */]);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

// 添加形态目标1的形变位置属性
const morphTarget1Vertices = new Float32Array([/* ... 形态目标1的顶点数据 ... */]);
geometry.morphAttributes.position = [
    new THREE.BufferAttribute(morphTarget1Vertices, 3)
];

// 如果有更多形态目标，可以按相同方式继续添加至 morphAttributes.position 数组
```

在实际应用中，形变的权重控制可以通过材料的 `morphTargets` 属性来实现。例如，在执行动画时，可以实时调整权重值来过渡不同的形态目标，产生如面部表情变化等效果。

```
javascript复制代码const mesh = new THREE.Mesh(geometry, material);
mesh.morphTargetInfluences[0] = 0.5; // 形态目标1的权重设置为0.5
```

这里，`morphTargetInfluences` 数组中的每个元素代表了对应形态目标的权重，它决定了该形态目标影响最终模型形状的程度。通过调整这些权重，可以实现模型的形变效果。