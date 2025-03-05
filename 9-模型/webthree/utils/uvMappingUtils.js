import * as THREE from 'three';
export function getTextureUrl(index) {
    // 贴图文件目录
    const basePath = "/";
    // 文件名映射规则（根据索引）
    const fileMappings = {
      0: "3.bmp",
      1: "4_奥灰峰峰组.bmp",
      2: "5_奥灰磁耳组.bmp",
      3: "6_奥灰马家沟.bmp",
      4: "8_基岩闪长岩.bmp",
      // 添加更多映射...
    };
  
    // 获取文件名
    const fileName = fileMappings[index];
    if (!fileName) {
      console.error(`索引 ${index} 没有对应的文件映射`);
      return null; // 返回 null 表示无效映射
    }
  
    // 拼接完整路径
    return `${basePath}${fileName}`;
  }
  
export function boxUvCom(ovDate,oNormal,max,min,triNum){
    var type=0,veNum=ovDate.count;
    let Uvs= new Float32Array(veNum*2);//存储uv的数组4151*2
    // 长宽高
    let dx = max.x- min.x;
    let dy = max.y- min.y;
    let dz = max.z- min.z;


    let v1,v2,v3;
    let nX,nY,nZ;
    v1=v2=v3=new THREE.Vector3(0,0,0);


    for(let i=0;i<veNum;i++){
        v1.x=ovDate.array[i*3];
        v1.y=ovDate.array[i*3+1];
        v1.z=ovDate.array[i*3+2];

        nX=oNormal.array[i*3];
        nY=oNormal.array[i*3+1];
        nZ=oNormal.array[i*3+2];
        //取绝对值，寻找最大分量
        const absNum1 = Math.abs(nX);
        const absNum2 = Math.abs(nY);
        const absNum3 = Math.abs(nZ);

        if ((absNum1 >= absNum2 && absNum1 >= absNum3)) {
            type=0;

        } else if (absNum2 >= absNum1 && absNum2 >= absNum3) {
            type=1;

        } else {
            type=2;
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
    return Uvs;

}
