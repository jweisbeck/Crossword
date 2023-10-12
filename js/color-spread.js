const initCanvas = (canvas, color) => {
  if (!canvas) {
    return;
  }

  let gl = canvas.getContext("webgl");

  if (!gl) {
    canvas.style.display = "none";
  }

  try {
    let vertexShaderSource = `
              attribute vec4 a_position;
              void main() {
                  gl_Position = a_position;
              }
          `;

    let fragmentShaderSource = `
          precision mediump float;

          uniform float u_time;
          uniform vec2 u_resolution;
          uniform vec2 u_one;
          uniform vec2 u_two;
          uniform vec2 u_three;
          uniform vec2 u_four;
          uniform float r1;
          uniform float r2;
          uniform float r3;
          uniform float r4;
          uniform vec3 color;

          float wave(vec2 position, vec2 direction) {
              float baseWave = sin(dot(position, normalize(direction)) * 10.0 + u_time) * 5.0;
              return baseWave;
          }

          vec2 rotate(vec2 v, float angle) {
              float sinA = sin(angle);
              float cosA = cos(angle);
              return vec2(cosA * v.x - sinA * v.y, sinA * v.x + cosA * v.y);
          }

          void main() {
              vec2 centers[4];
              centers[0] = u_one;
              centers[1] = u_two;
              centers[2] = u_three;
              centers[3] = u_four;

              float rads[4];
              rads[0] = r1;
              rads[1] = r2;
              rads[2] = r3;
              rads[3] = r4;

              bool isInCircle = false;

              for (int i = 0; i < 4; i++) {
                  vec2 center = centers[i] * u_resolution;

                  float rotationAngle = 0.0;
                  vec2 toFragment = gl_FragCoord.xy - center;
                  float stretch = 1.0;

                  if (i == 2) {
                      rotationAngle = 45.0 * 3.14159265 / 180.0;
                      stretch = 1.5;
                  }

                  vec2 rotatedOffset = rotate(toFragment, rotationAngle);
                  vec2 stretchedDist = vec2(rotatedOffset.x * stretch, rotatedOffset.y);

                  float dist = length(stretchedDist);
                  float radius = min(30.0 * rads[i] + u_time * 50.0 * rads[i], 200.0 * rads[i]);
                  float unevenSpread = wave(gl_FragCoord.xy * 0.005, vec2(1.0, 0));


                  if (dist <= radius + unevenSpread) {
                      isInCircle = true;
                      break;
                  }
              }

              gl_FragColor = isInCircle ? vec4(color, 1.0) : vec4(0.0, 0.0, 0.0, 1.0);
          }`;

    let vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    let fragmentShader = createShader(
      gl,
      fragmentShaderSource,
      gl.FRAGMENT_SHADER
    );
    let program = createProgram(gl, vertexShader, fragmentShader);

    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    let positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1]),
      gl.STATIC_DRAW
    );

    function createShader(gl, source, type) {
      let shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (!success) {
        throw new Error(gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    function createProgram(gl, vertexShader, fragmentShader) {
      let program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      let success = gl.getProgramParameter(program, gl.LINK_STATUS);
      if (!success) {
        throw new Error(gl.getProgramInfoLog(program));
      }
      return program;
    }

    function resizeCanvasToDisplaySize(canvas) {
      const displayWidth  = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (window.devicePixelRatio > 1) {
        canvas.width = displayWidth * window.devicePixelRatio;
        canvas.height = displayHeight * window.devicePixelRatio;
        canvas.style.width = displayWidth + "px";
        canvas.style.height = displayHeight + "px";
      } else {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }
    }

    function drawScene(time) {

      time *= 0.002; // convert to seconds

      resizeCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform1f(gl.getUniformLocation(program, "u_time"), time);
      gl.uniform2f(
        gl.getUniformLocation(program, "u_resolution"),
        canvas.width,
        canvas.height
      );
      gl.uniform2f(gl.getUniformLocation(program, "u_one"), 0.9, 0.9);
      gl.uniform2f(gl.getUniformLocation(program, "u_two"), 0.93, 0.8);
      gl.uniform2f(gl.getUniformLocation(program, "u_three"), 0.7, 0.7);
      gl.uniform2f(gl.getUniformLocation(program, "u_four"), 0.8, 0.83);
      gl.uniform1f(gl.getUniformLocation(program, "r1"), 0.5);
      gl.uniform1f(gl.getUniformLocation(program, "r2"), 0.34);
      gl.uniform1f(gl.getUniformLocation(program, "r3"), 1);
      gl.uniform1f(gl.getUniformLocation(program, "r4"), 0.3);
      gl.uniform3f(gl.getUniformLocation(program, "color"), ...color);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(
        positionAttributeLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      requestAnimationFrame(drawScene);
    }

    requestAnimationFrame(drawScene);
  } catch (e) {
    canvas.style.display = "none";
  }
};

const hexToRgb = (hex) => {
  if (hex.charAt(0) === "#") {
    hex = hex.slice(1);
  }

  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return [r / 255, g / 255, b / 255];
};

const canvas = document.querySelector("canvas");

initCanvas(canvas, hexToRgb(localStorage.getItem("color") ?? "#000000"));

const colorButton = document.querySelector(".color__button");

if (colorButton) {
  colorButton.addEventListener("click", (event) => {
    requestAnimationFrame(() => {
      const color = hexToRgb(colorButton.getAttribute("value") ?? "#000000");
      initCanvas(canvas, color);
    });
  });
}
