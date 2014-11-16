
// _gl = _context || _canvas.getContext( 'webgl', attributes )

sc1 = {

    setup:function(){

        fatTexture = new THREE.WebGLRenderTarget( 2048,2048, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat } );

        // camera = new THREE.PerspectiveCamera( 45, 1, 0, 100000 );
        // camera.position.z = 1000;
        // fart();
    //     camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 100000 );
    // camera.position.z = 100;

        // var pixels = new Uint8Array(32*32*4);
        var pixels = new Uint8Array(32*32 * 3 );//new Uint8Array([128,128,128,128,123]);

        for(var i = 0 ; i < 32*32*3 ; i++){
            pixels[i]=Math.sin(i*i*.0001)*256;
        }

        // console.log(renderer.context);

        var gl = renderer.getContext('webgl');

        var c = 128;

        // var rgbTex = createSolidTexture(gl,c,c,c,c);//textureFromPixelArray(gl, pixels, gl.RGB, 32, 32);
        // var rgbTex = textureFromPixelArray(gl, pixels, gl.RGB, 32,32);
        rgbTex = new THREE.DataTexture( pixels, 32, 32, THREE.RGBFormat );
        rgbTex.needsUpdate = true;

        // var color = new THREE.Color( 0x0000ff );
        // var rgbTex = THREE.ImageUtils.generateDataTexture( width, height, color );

        rtTexture = new THREE.WebGLRenderTarget( 2048,2048, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat } );


        var vertRT = "\
            varying vec2 vUv;\
            uniform sampler2D tDiffuse;\
            uniform sampler2D fatTexture;\
            uniform float time;\
            void main() {\
                vUv = uv;\
                float offset = texture2D(tDiffuse, vUv).x;\
                gl_Position = projectionMatrix * modelViewMatrix * vec4( vec3(position.x,position.y,position.z + offset*0.), 1.0 );\
            }\
        ";

        // var fragRT="\
        //     varying vec2 vUv;\
        //     uniform sampler2D tDiffuse;\
        //     uniform sampler2D fatTexture;\
        //     uniform float time;\
        //     void main() {\
        //         float offset = texture2D(tDiffuse, vUv).x;\
        //         vec4 ball = texture2D(tDiffuse, vUv);\
        //         vec4 fat = texture2D(fatTexture, vUv);\
        //         vec2 oUV = vUv+noise(time+fat.xyz);\
        //         vec2 oUV2 = vUv+noise(time+ball.xyz);\
        //         vec4 fat2 = texture2D(fatTexture, oUV);\
        //         vec4 fat3 = texture2D(fatTexture, oUV2);\
        //         gl_FragColor = max(ball,fat);\
        //         gl_FragColor += fat2*.1;\
        //         gl_FragColor += fat3*-.1;\
        //     }\
        // ";//vec2(abs(sin(vUv.x)),abs(cos(vUv.y)))

         var fragRT="\
            varying vec2 vUv;\
            uniform sampler2D tDiffuse;\
            uniform sampler2D fatTexture;\
            uniform float time;\
            void main() {\
                float offset = texture2D(tDiffuse, vUv).x;\
                vec4 ball = texture2D(tDiffuse, vUv);\
                vec4 fat = texture2D(fatTexture, vUv);\
                vec2 oUV = vUv+vec2(0.,.01);\
                vec2 oUV2 = vUv+vec2(0.,-.01);\
                vec4 fat2 = texture2D(fatTexture, oUV);\
                vec4 fat3 = texture2D(fatTexture, oUV2);\
                float offer = (1.5+sin(time*5.))*.5;\
                gl_FragColor = max(\
                    vec4(vec3(ball.x*(1.+sin(time)*.1),ball.y*.9,ball.z*.94)\
                        ,1.0)\
                    ,fat*.99);\
            }\
        ";//vec2(abs(sin(vUv.x)),abs(cos(vUv.y)))

        var nPlus = noise+fragRT;
        var materialScreen = new THREE.ShaderMaterial( {
            uniforms: { tDiffuse: { type: "t", value: rtTexture },
            fatTexture: { type: "t", value: fatTexture },
            time:{type:"f",value:0} },
            vertexShader: vertRT,
            fragmentShader: nPlus,
            depthWrite: false
        } );


        rtTexture2 = new THREE.WebGLRenderTarget( 2048,2048, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat } );

        var vertRT2 = "\
            varying vec2 vUv;\
            uniform sampler2D tDiffuse;\
            void main() {\
                vUv = uv;\
                float offset = texture2D(tDiffuse, vUv).x;\
                gl_Position = projectionMatrix * modelViewMatrix * vec4( vec3(position.x,position.y,position.z + offset*.00), 1.0 );\
            }\
        ";

        var fragRT2="\
            varying vec2 vUv;\
            uniform sampler2D tDiffuse;\
            void main() {\
                float offset = texture2D(tDiffuse, vUv).x;\
                vec4 col = texture2D(tDiffuse, vUv);\
                gl_FragColor = vec4(col.xyz,1.0);\
            }\
        ";

        var materialScreen2 = new THREE.ShaderMaterial( {
            uniforms: { tDiffuse: { type: "t", value: rtTexture2 } },
            vertexShader: vertRT2,
            fragmentShader: fragRT2,
            depthWrite: false
        } );

        var vert = "\
            uniform float x;\
            uniform float y;\
            varying vec2 vUv;\
            varying vec2 offset;\
            void main() {\
                vUv = uv;\
                offset = vec2(cos(y+vUv.y*3.),sin(x+vUv.x*10.));\
                gl_Position = projectionMatrix *\
                modelViewMatrix *\
                vec4(vec3(position.x + offset.x,position.y + offset.y,position.z +(offset.x+offset.y)),1.0);\
            }\
        ";

        var frag = "\
            uniform float time;\
            uniform float x;\
            uniform float y;\
            varying vec2 vUv;\
            varying vec2 offset;\
            void main() {\
                float c = offset.y+offset.x;\
                gl_FragColor = vec4(vec3(c*c*.6,(.5+c*c)*.25,(c+2.9)*.3), 1.0);\
            }\
        ";

        var mat = new THREE.ShaderMaterial({
            uniforms: {
                x: {
                    type: "f",
                    value: 0.0
                },
                y: {
                    type: "f",
                    value: 0.0
                },
            },
            vertexShader:   vert,
            fragmentShader: frag
        });

        var geo = new THREE.PlaneGeometry(100,100,100,100);
        
        pln = new THREE.Mesh(geo,materialScreen);
        var pln2 = new THREE.Mesh(geo,materialScreen2);
                var pln3 = new THREE.Mesh(geo,materialScreen2);

        scene.add(pln2);

        sceneRTT = new THREE.Scene();
        cameraRTT = new THREE.OrthographicCamera( -50, 50, 50, -50, 1, 100 );
        cameraRTT.position.z = 100;
        lgt = new THREE.DirectionalLight( 0xffffff, 1);
        lgt.position.z = 100;
        sceneRTT.add(lgt);
        sph = sphere(1,50,50);
        sceneRTT.add(sph);

        sceneRTT2 = new THREE.Scene();
        // cameraRTT2 = new THREE.OrthographicCamera( -50, 50, 50, -50, 1, 100 );
         cameraRTT2 = new THREE.PerspectiveCamera( 39.5, window.innerWidth / window.innerHeight, 1, 100000 );
         // camera.position.z = 300;
        cameraRTT2.position.z = 122;
        cameraRTT2.rotation.z = .5;
        sceneRTT2.add(pln);

        sceneRTT3 = new THREE.Scene();
        cameraRTT3 = new THREE.OrthographicCamera( -50, 50, 50, -50, 1, 100 );
        cameraRTT3.position.z = 100;
        sceneRTT3.add(pln3);



        frameRate = 1;


  
    },
   
    draw:function(){
         cameraRTT2.rotation.y = omouseX*.1;
         cameraRTT2.rotation.x = omouseY*.1;

         if(varE){
            cameraRTT2.position.z+=omouseX;
         }

        // pln.material.uniforms["x"].value = -omouseX*50;
        // pln.material.uniforms["y"].value = omouseY*50;

        sph.position.x = omouseX*150;
        sph.position.y = -omouseY*150;

        pln.material.uniforms["time"].value = count*.023;

        renderer.render( sceneRTT, cameraRTT, rtTexture, true );

        if(count%2==0)
        renderer.render( sceneRTT3, cameraRTT3, fatTexture, true );
        else
        renderer.render( sceneRTT2, cameraRTT2, rtTexture2, true );

    }
   
}

function fart(){
    console.log("fart");
}

function createSolidTexture(gl, r, g, b, a) {
    var dat = new Uint8Array([r, g, b, a]);
    var text = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, text);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, dat);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    console.log(gl);
    return text;
}                       
// _gl.texImage2D( _gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data );


function textureFromPixelArray(gl, dataArray, type, width, height) {
    var dataTypedArray = new Uint8Array(dataArray); // Don't need to do this if the data is already in a typed array
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 10, type, width, height, 0, type, gl.UNSIGNED_BYTE, dataTypedArray);
    // Other texture setup here, like filter modes and mipmap generation
    return texture;
}

noise = "\
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }\
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }\
vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }\
float noise(vec3 P) {\
    vec3 i0 = mod289(floor(P)), i1 = mod289(i0 + vec3(1.0));\
    vec3 f0 = fract(P), f1 = f0 - vec3(1.0), f = fade(f0);\
    vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x), iy = vec4(i0.yy, i1.yy);\
    vec4 iz0 = i0.zzzz, iz1 = i1.zzzz;\
    vec4 ixy = permute(permute(ix) + iy), ixy0 = permute(ixy + iz0), ixy1 = permute(ixy + iz1);\
    vec4 gx0 = ixy0 * (1.0 / 7.0), gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\
    vec4 gx1 = ixy1 * (1.0 / 7.0), gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\
    gx0 = fract(gx0); gx1 = fract(gx1);\
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0), sz0 = step(gz0, vec4(0.0));\
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1), sz1 = step(gz1, vec4(0.0));\
    gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);\
    gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);\
    vec3 g0 = vec3(gx0.x,gy0.x,gz0.x), g1 = vec3(gx0.y,gy0.y,gz0.y),\
         g2 = vec3(gx0.z,gy0.z,gz0.z), g3 = vec3(gx0.w,gy0.w,gz0.w),\
         g4 = vec3(gx1.x,gy1.x,gz1.x), g5 = vec3(gx1.y,gy1.y,gz1.y),\
         g6 = vec3(gx1.z,gy1.z,gz1.z), g7 = vec3(gx1.w,gy1.w,gz1.w);\
    vec4 norm0 = taylorInvSqrt(vec4(dot(g0,g0), dot(g2,g2), dot(g1,g1), dot(g3,g3)));\
    vec4 norm1 = taylorInvSqrt(vec4(dot(g4,g4), dot(g6,g6), dot(g5,g5), dot(g7,g7)));\
    g0 *= norm0.x; g2 *= norm0.y; g1 *= norm0.z; g3 *= norm0.w;\
    g4 *= norm1.x; g6 *= norm1.y; g5 *= norm1.z; g7 *= norm1.w;\
vec4 nz = mix(vec4(dot(g0, vec3(f0.x, f0.y, f0.z)), dot(g1, vec3(f1.x, f0.y, f0.z)),\
                   dot(g2, vec3(f0.x, f1.y, f0.z)), dot(g3, vec3(f1.x, f1.y, f0.z))),\
              vec4(dot(g4, vec3(f0.x, f0.y, f1.z)), dot(g5, vec3(f1.x, f0.y, f1.z)),\
                   dot(g6, vec3(f0.x, f1.y, f1.z)), dot(g7, vec3(f1.x, f1.y, f1.z))), f.z);\
    return 2.2 * mix(mix(nz.x,nz.z,f.y), mix(nz.y,nz.w,f.y), f.x);\
}\
float noise(vec2 P) { return noise(vec3(P, 0.0)); }\
float turbulence(vec3 P) {\
    float f = 0., s = 1.;\
for (int i = 0 ; i < 9 ; i++) {\
   f += abs(noise(s * P)) / s;\
   s *= 2.;\
   P = vec3(.866 * P.x + .5 * P.z, P.y, -.5 * P.x + .866 * P.z);\
}\
    return f;\
}\
";
