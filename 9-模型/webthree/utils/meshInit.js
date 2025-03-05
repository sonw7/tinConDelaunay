import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { processData } from './dataUtils';
import { getcolorbylayer } from './getMeshColor';

export function loadStratumLayer( wgl_layers)
{
    console.log( wgl_layers);
    let texture = new THREE.TextureLoader().load("../../images/3.bmp");
    texture.repeat.set(20,20)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    for(var i=0;i< wgl_layers.length;i++)
    {
        var wgl_layer_geometry = new THREE.BufferGeometry();
        wgl_layer_geometry.setIndex( wgl_layers[i].indices );

        wgl_layer_geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( wgl_layers[i].vertices, 3 ) );
        wgl_layer_geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( wgl_layers[i].normals, 3 ) );

        wgl_layer_geometry.computeBoundingBox();
        wgl_layer_geometry.addAttribute( 'uv',
            new THREE.BufferAttribute(boxUvCom(wgl_layer_geometry.getAttribute('position'),
                wgl_layer_geometry.getAttribute('normal'),
                wgl_layer_geometry.boundingBox.max,
                wgl_layer_geometry.boundingBox.min), 2 ) );
        // if(wgl_layers[i].uvs.length >0 )

        if(wgl_layer_geometry.getAttribute('uv')==null)
        {
            console.log("有uv数据")
            //wgl_layer_geometry.addAttribute( 'uv', new THREE.Float32BufferAttribute( wgl_layers[i].uvs, 2 ) );

            var wgl_layer_material;
            // console.log(wgl_layers[i].texturePath + "  " + i);
            //new THREE.TextureLoader().load( wgl_layers[i].texturePath, function ( texture ) {
            new THREE.TextureLoader().load( "../../images/7.jpg", function ( texture ) {
                i--;            //调用后 i自动增加了 1，原因未知，待查
                // console.log(i);

                texture.repeat.set(20,20)
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.anisotropy = wgl_renderer.capabilities.getMaxAnisotropy();
                //wireframe: true;

                //texture.matrixAutoUpdate = false; // default true; set to false to update texture.matrix manually

                wgl_layer_material = new THREE.MeshBasicMaterial( {
                    //map: texture,
                    opacity :  1,
                    transparent: true} );
                var mesh = new THREE.Mesh( wgl_layer_geometry, wgl_layer_material );

                //console.log(wgl_arrStratumLayers[i]);
                wgl_scene.add( mesh);
                wgl_arrStratumLayers[i] = mesh;
                wgl_isStratumLayersVisable.push(false);
                // console.log("11");
            } );
        }else{

            var wgl_layer_colors = [];
            if(wgl_RenderingMode == 0)
                wgl_layer_colors= webgl_webgl_getBufferGemetryColors(wgl_layers[i].vertices,wgl_LayersYHorizon.maxy,wgl_Roadway3DYHorizon.miny);
            else
                wgl_layer_colors= webgl_webgl_getBufferGemetryColors(wgl_layers[i].vertices,wgl_LayersYHorizon.maxy,wgl_LayersYHorizon.miny);
            // console.log(wgl_layer_colors);
            // wgl_layer_geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( wgl_layer_colors, 3 ) );

            var wgl_layer_material = new THREE.MeshBasicMaterial( {
                color:getcolorbylayer(i),
                specular: 0x111111,
                shininess: 150,
                side: THREE.DoubleSide,
                depthFunc:THREE.LessDepth,
                depthTest:false,
                depthWrite:false
                //map: texture
                // vertexColors: THREE.VertexColors,
                // ***** Clipping setup (material): *****
                // clippingPlanes: [ localPlane ],
                // clipShadows: true
            } );

            var mesh = new THREE.Mesh( wgl_layer_geometry, wgl_layer_material );
            mesh.renderOrder=100-i;
            wgl_scene.add( mesh);
            wgl_arrStratumLayers[i] = mesh;
            wgl_isStratumLayersVisable.push(false);
            // console.log("22");
        }

    }

}

export function loadLayers(wgl_layers,scene) {
    console.log('Loaded Layers:', wgl_layers);

    // const texture = new THREE.TextureLoader().load("../../images/3.bmp");
    // texture.repeat.set(20, 20);
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;

    for (let i = 0; i < wgl_layers.length; i++) {
        try {
            const layer = wgl_layers[i];

            // Validate layer data
            // if (!layer.indices || !layer.vertices || !layer.normals) {
                if (!layer.indices || !layer.vertices ) {

                console.error(`Layer ${i} is missing necessary data (indices, vertices, normals)`);
                continue;
            }

            // Create geometry and set attributes
            const geometry = new THREE.BufferGeometry();
            geometry.setIndex(layer.indices);
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(layer.vertices, 3));
            centerMesh(geometry)
            // geometry.setAttribute('normal', new THREE.Float32BufferAttribute(layer.normals, 3));

            // Compute UVs if not provided
            // if (!layer.uvs || layer.uvs.length === 0) {
            //     geometry.computeBoundingBox();
            //     const uvData = boxUvCom(
            //         geometry.getAttribute('position'),
            //         geometry.getAttribute('normal'),
            //         geometry.boundingBox.max,
            //         geometry.boundingBox.min
            //     );
            //     geometry.setAttribute('uv', new THREE.BufferAttribute(uvData, 2));
            // } else {
            //     geometry.setAttribute('uv', new THREE.Float32BufferAttribute(layer.uvs, 2));
            // }

            // Determine material based on rendering mode or texture
            let material;
            // if (layer.texturePath) {
                if (false) {

                const layerTexture = new THREE.TextureLoader().load(layer.texturePath);
                layerTexture.repeat.set(20, 20);
                layerTexture.wrapS = THREE.RepeatWrapping;
                layerTexture.wrapT = THREE.RepeatWrapping;

                material = new THREE.MeshBasicMaterial({
                    // map: layerTexture,
                    side: THREE.DoubleSide,
                    transparent: true,
                });
            } else {
                material = new THREE.MeshBasicMaterial({
                    color: getcolorbylayer(i),
                    side: THREE.DoubleSide,
                });
            }

            // Create mesh and add to the scene
            const mesh = new THREE.Mesh(geometry, material);

            const scaleFactor = 0.005; // 缩小为原始大小的 10%
            mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

            // 设置旋转
            const rotationAngle = Math.PI / 2; // 旋转 45 度
            mesh.rotation.set(rotationAngle, 0, 0);

            mesh.renderOrder = 100 - i;

            scene.add(mesh);
            // wgl_arrStratumLayers[i] = mesh;
            // wgl_isStratumLayersVisable.push(false);
        } catch (error) {
            console.error(`Error processing layer ${i}:`, error);
        }
    }
}

export function loadTxtFile(scene, filePath) {
  fetch(filePath)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(text => {
    //   console.log('Loaded text:', text);
      const processedData = processData(text);
      console.log(processedData);
      loadLayers(processedData,scene)
      // 使用 FontLoader 加载字体
    //   const loader = new FontLoader();
    //   loader.load('path/to/font.json', font => {
    //     const textGeometry = new TextGeometry(text, {
    //       font: font,
    //       size: 1,
    //       height: 0.1,
    //     });

    //     const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    //     const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    //     // 设置文字的位置
    //     textMesh.position.set(0, 0, 0);
    //     scene.add(textMesh);
    //   });
    })
    .catch(error => {
      console.error('Error loading the text file:', error);
    });
}
function centerMesh(geometry) {
    // 计算包围盒
    geometry.computeBoundingBox();

    // 获取中心点
    const boundingBox = geometry.boundingBox;
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    // 平移顶点，使中心点位于 (0, 0, 0)
    geometry.translate(-center.x, -center.y, -center.z);

    return center; // 返回中心点，用于调整整个 mesh 的位置
}