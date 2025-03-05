
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import * as THREE from 'three'

let cachedFont = null;

function createAxes(scene, loader, x0, y0, z0, x1, y1, z1, wgsize, wgsplite) {
    // xyz坐标轴
    const axesHelper = new THREE.AxesHelper(120);
    axesHelper.position.set(y0, z0, x0); // 设置坐标轴位置
    axesHelper.updateMatrix(); // 更新位置
    axesHelper.matrixAutoUpdate = false; // 禁止矩阵变动
    scene.add(axesHelper);
    loader.load('/fonts/helvetiker_regular.typeface.json', function (font) {
        cachedFont = font;
        const texts = [
            { text: "X(m)", position: {x: -5 + x0, y: 2 + z0, z: 60 + y1  }, rotation: { x: 0, y: Math.PI / 2, z: 0 } },
            { text: "Z(m) [-300,400]", position: { x: -10 + x0, y: 8 + z1, z: 2 + y0 }, rotation: { x: 0, y: Math.PI / 4, z: 0 } },
            { text: "Y(m)", position: {  x: -30 + x1, y: 2 + z0, z: -5 + y0}, rotation: { x: 0, y: 0, z: 0 } },
        ];
    
        texts.forEach(({ text, position, rotation }) => {
            const textMesh = createTextMesh(text, position, rotation, font);
            scene.add(textMesh);
        });
    });

    chidu(x0, y0, z0, x1, y1, z1,scene ,loader); // 调用其他工具函数
}
function zuobiaozhou(scene, loader, x0, y0, z0, x1, y1, z1, wgsize, wgsplite) {
    // xyz坐标轴
    const axesHelper = new THREE.AxesHelper(120);
    axesHelper.position.set(y0, z0, x0); // 设置坐标轴位置
    axesHelper.updateMatrix(); // 更新位置
    axesHelper.matrixAutoUpdate = false; // 禁止矩阵变动
    scene.add(axesHelper);
    loader.load('/fonts/helvetiker_regular.typeface.json', function (font) {
        cachedFont = font;
        const texts = [
            { text: "X(m)", position: {x: -5 + x0, y: 2 + z0, z: 60 + y1  }, rotation: { x: 0, y: Math.PI / 2, z: 0 } },
            { text: "Z(m) [-300,400]", position: { x: -10 + x0, y: 8 + z1, z: 2 + y0 }, rotation: { x: 0, y: Math.PI / 4, z: 0 } },
            { text: "Y(m)", position: {  x: -30 + x1, y: 2 + z0, z: -5 + y0}, rotation: { x: 0, y: 0, z: 0 } },
        ];
    
        texts.forEach(({ text, position, rotation }) => {
            const textMesh = createTextMesh(text, position, rotation, font);
            scene.add(textMesh);
        });
    });

    chidu(x0, y0, z0, x1, y1, z1,scene ,loader); // 调用其他工具函数
}
function chidu(xmin, ymin, zmin, xmax, ymax, zmax ,scene,loader) {
    const createLine = (start, end, color = 0x808080) => {
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            start.x, start.y, start.z,
            end.x, end.y, end.z,
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const material = new THREE.LineBasicMaterial({ color });
        const line = new THREE.Line(geometry, material);
        line.matrixAutoUpdate = false;
        return line;
    };

    for (let i = 0, len = zmax - zmin; i <= len; i++) {
        if (i % 2 === 0) {
            const line = createLine(
                new THREE.Vector3(ymin, zmin, xmin),
                new THREE.Vector3(ymin, zmin, xmax)
            );
            line.position.y = i;
            line.updateMatrix();
            line.matrixAutoUpdate=false;
            scene.add(line);

            const number = i + zmin;
            const label = (number * 100).toString();
            textChinese(label, xmax + 4, ymin, number, 1, 0, 0, Math.PI / 2,loader,scene);
        }
    }

    // 绘制 XY 平面的线
    for (let iy = 0, len = (ymax - ymin) / 10; iy <= len; iy++) {
        const line = createLine(
            new THREE.Vector3(ymin, zmin, xmin),
            new THREE.Vector3(ymin, zmin, xmax)
        );
        line.position.x = iy * 10;
        line.updateMatrix();
        line.matrixAutoUpdate=false;

       scene.add(line);

        const number = iy * 10 + ymin;
        const label = ((number + Math.abs(ymin)) * 100).toString();
        if (iy !== 0) {
            textChinese(label, xmin, number, zmax + 3, 2, 0, 0, 0,loader,scene);
        }
    }

    // 绘制 XZ 面线
    for (let m = 0, len = (xmax - xmin) / 10; m <= len; m++) {
        const line = createLine(
            new THREE.Vector3(ymin, zmin, xmin),
            new THREE.Vector3(ymin, zmax, xmin)
        );
        line.position.z = m * 10;
        line.updateMatrix();
        scene.add(line);
    }

    // 绘制 YZ 平面线
    for (let m0 = 0, len = (ymax - ymin) / 10; m0 <= len; m0++) {
        const line = createLine(
            new THREE.Vector3(ymin, zmin, xmin),
            new THREE.Vector3(ymin, zmax, xmin)
        );
        line.position.x = m0 * 10;
        line.updateMatrix();
        scene.add(line);
    }

    // 绘制 YZ 平面标注
    for (let n = 0, len = zmax - zmin; n <= len; n++) {
        if (n % 2 === 0) {
            const line = createLine(
                new THREE.Vector3(ymin, zmin, xmin),
                new THREE.Vector3(ymax, zmin, xmin)
            );
            line.position.y = n;
            line.updateMatrix();
            scene.add(line);

            const number = n + zmin;
            const label = (number * 100).toString();
            textChinese(label, xmin, ymax + 2, number, 1, 0, 0, 0,loader,scene);
        }
    }

    // 绘制 XY 平面标注
    for (let n0 = 0, len = (xmax - xmin) / 10; n0 <= len; n0++) {
        const line = createLine(
            new THREE.Vector3(ymin, zmin, xmin),
            new THREE.Vector3(ymax, zmin, xmin)
        );
        line.position.z = n0 * 10;
        line.updateMatrix();
        scene.add(line);

        const number = n0 * 10 + xmin;
        const label = ((number + Math.abs(xmin)) * 100).toString();
        if (n0 !== 0) {
            textChinese(label, number, ymin, zmax + 3, 2, 0, 0, Math.PI / 2,loader,scene);
        }
    }
}
function zbz(x,y,z,textsize,jiaodu,scene,loader){

    loader.load( '/fonts/helvetiker_regular.typeface.json', function ( font ) {

        const geometrytext = new TextGeometry( "N", {
            font: font,
            size: textsize,
            height: textsize/2,
        } );
        let materialstext1 = [
            new THREE.MeshPhongMaterial( { color: 0x0000ff, flatShading: true } ), // front
            new THREE.MeshPhongMaterial( { color: 0xff0000 } ) // side
        ];
        let textMesh = new THREE.Mesh(geometrytext, materialstext1);

        textMesh.position.set(y, z+15, x)
        textMesh.updateMatrix();//更新位置
        textMesh.matrixAutoUpdate=false;//禁止矩阵变动
        // textMesh.rotation.y = -1.1
        // 网格对象添加到场景中
        scene.add(textMesh)
    } );


    const geometry = new THREE.ConeGeometry( 5, 20, 3 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    const cone = new THREE.Mesh( geometry, material );
    cone.position.x=y;
    cone.position.y=z;
    cone.position.z=x;
    cone.rotation.x=-Math.PI/2;
    cone.rotation.z=jiaodu
    cone.updateMatrix();
    cone.matrixAutoUpdate = false;
    scene.add( cone );
    // console.log(cone )

}

function createCompass(x,y,z,textsize,jiaodu,scene,loader){

    loader.load( '/fonts/helvetiker_regular.typeface.json', function ( font ) {

        const geometrytext = new TextGeometry( "N", {
            font: font,
            size: textsize,
            height: textsize/2,
        } );
        let materialstext1 = [
            new THREE.MeshPhongMaterial( { color: 0x0000ff, flatShading: true } ), // front
            new THREE.MeshPhongMaterial( { color: 0xff0000 } ) // side
        ];
        let textMesh = new THREE.Mesh(geometrytext, materialstext1);

        textMesh.position.set(y, z+15, x)
        textMesh.updateMatrix();//更新位置
        textMesh.matrixAutoUpdate=false;//禁止矩阵变动
        // textMesh.rotation.y = -1.1
        // 网格对象添加到场景中
        scene.add(textMesh)
    } );


    const geometry = new THREE.ConeGeometry( 5, 20, 3 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    const cone = new THREE.Mesh( geometry, material );
    cone.position.x=y;
    cone.position.y=z;
    cone.position.z=x;
    cone.rotation.x=-Math.PI/2;
    cone.rotation.z=jiaodu
    cone.updateMatrix();
    cone.matrixAutoUpdate = false;
    scene.add( cone );
    // console.log(cone )

}
function textChinese(text,x,y,z,size,rotationx,rotationy,rotationz,loader,scene){
    loader.load("/fonts/FZYaoTi_Regular.json", function ( font ) {

        const geometrytext = new TextGeometry( text, {
            font: font,
            size: size,
            height: size/2,
            // curveSegments: 4,
            // bevelEnabled: true,
            // bevelThickness: 2,
            // bevelSize: 1.5,
            // bevelOffset: 0,
            // bevelSegments: 4
        } );
        let materialstext1 = [
            new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
            new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
        ];
        let textMesh = new THREE.Mesh(geometrytext, materialstext1);

        textMesh.position.set(y, z, x)
        textMesh.rotation.x=rotationy;
        textMesh.rotation.y=rotationz;
        textMesh.rotation.z=rotationx;
        textMesh.updateMatrix();//更新位置
        textMesh.matrixAutoUpdate=false;//禁止矩阵变动
        // textMesh.rotation.y = -1.1
        // 网格对象添加到场景中
        scene.add(textMesh)


    } );
}
function createTextMesh(text, position, rotation, font, color = 0x464444) {
    const geometry = new TextGeometry(text, {
        font: font,
        size: 6,
        height: 1,
        curveSegments: 16,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 0.3,
        bevelOffset: 0,
        bevelSegments: 10,
    });

    const material = new THREE.MeshPhongMaterial({ color, flatShading: true });

    const textMesh = new THREE.Mesh(geometry, material);

    textMesh.position.set(position.x, position.y, position.z);
    textMesh.rotation.set(rotation.x, rotation.y, rotation.z);

    textMesh.updateMatrix();
    textMesh.matrixAutoUpdate = false;

    return textMesh;
}
export {zuobiaozhou,zbz,createCompass,createAxes}