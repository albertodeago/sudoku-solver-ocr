<template>
  <div id="app">
    <!-- <video ref="video" :width="size" :height="size" @click="onVideoClick" style="border: 1px solid black"></video> -->
    
    <!-- <br><br> -->
    <div>
      Load a sudoku image. It must be the perfect square of the sudoku.
    </div>
    <div>
      <input type="file" @change="onFileChange"/>
      <button @click="loadImage('https://albertodeago.github.io/sudoku-solver-ocr/dist/img/sudoku-perfect.png')">Load sample sudoku image</button>
    </div>
    <div>
      Or you can paste the url of an image here
      <input type="text" v-model="inputUrl"/>
      <button @click="loadImage(inputUrl)">Load</button>
    </div>

    <div>
      <canvas ref="canvas" :width="size" :height="size"></canvas>
    </div>
    
    <div v-if="image">
      <button @click="split">split</button>
    </div>

    <div id="images">

    </div>

    <div v-if="readyToSolve">
      <button @click="solve">solve</button>
    </div>

    <div id="read-result">

    </div>

    <div id="solution">

    </div>

  </div>
</template>

<script>
import {createWorker} from "tesseract.js"
import {solveGrid} from "./solver"

export default {
  name: 'App',
  data: () => ({
    size: 300,
    canvas: null,
    ctx: null,
    image: null,
    worker: null,
    imagePieces: [],
    canvasPieces: [],
    readyToSolve: false,
    inputUrl: "https://albertodeago.github.io/sudoku-solver-ocr/dist/img/sudoku-perfect.png"

    // video: null,
    // videoCanvas: null,
    // videoCtx: null,
    // started: false,
    // savedVideoElement: null
  }),
  mounted() {
    this.canvas = this.$refs.canvas
    this.ctx = this.canvas.getContext("2d")
    
    // this.canvas = this.$refs.canvas
    // this.ctx = this.canvas.getContext("2d")
    this.worker = createWorker();
    // this.video = this.$refs.video
  },
  methods: {

    async loadImage(src) {
      const image = new Image()
      image.src = src
      image.crossOrigin = "anonymous"
      image.onload = () => {
        this.ctx.drawImage(image, 0, 0, this.size, this.size)
        this.image = this.canvas.toDataURL()
      }
      image.onerror = (e) => {
        console.error(e)
        // show errore telling that something went wrong, if you inserted the url probably the server doesn't support CORS
      }
    },

    onFileChange(evt) {
      const file = evt.target.files[0]
      const fileReader = new FileReader()
      fileReader.onload = () => {
        this.loadImage(fileReader.result)
      }
      fileReader.readAsDataURL(file)
    },

    // async onVideoClick() {
    //   if (!this.started) {
    //     await this.startCam()
    //   } else {
    //     const imgData = await this.takeScreen()
    //     this.ctx.putImageData(imgData, 0, 0)
    //     this.image = this.canvas.toDataURL()
    //     this.stopWebcam()
    //   }
    // },

    // async startCam() {
    //   let mediaStream
    //   const videoRect = this.video.getBoundingClientRect()
    //   const constraints = {
    //     video: {
    //       facingMode: 'environment',
    //       width: videoRect.width,
    //       height: videoRect.height
    //     }
    //   }
    //   try {
    //     mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
    //   } catch(e) {
    //     console.error(e)
    //   }
    //   if (mediaStream) {
    //     this.videoCanvas = document.createElement('canvas')
    //     this.videoCanvas.width = videoRect.width
    //     this.videoCanvas.height = videoRect.height
    //     this.videoCtx = this.videoCanvas.getContext('2d')
    //     this.savedVideoElement = this.video
    //     this.savedVideoElement.srcObject = mediaStream
    //     this.savedVideoElement.play()
    //     this.started = true
    //   }
    // },
    
    // stopWebcam() {
    //   const mediaStream = this.savedVideoElement.srcObject
    //   mediaStream.getVideoTracks().forEach(videoTrack => videoTrack.stop())
    //   this.savedVideoElement.srcObject = null
    //   this.savedVideoElement = undefined
    //   this.videoCtx = undefined
    //   this.videoCanvas = undefined
    //   this.started = false
    // },
   
    // async takeScreen() {
    //   this.videoCtx.drawImage(this.savedVideoElement, 0, 0)
    //   return this.videoCtx.getImageData(0, 0, this.videoCanvas.width, this.videoCanvas.height)
    // },

    // scan() {
    //   this.cutImage()
    //   this.getNumbers()
    // },

    async split() {
      await this.cutImage()
      this.readyToSolve = true
    },

    solve() {
      this.getNumbers()
    },

    cutImage() {
      return new Promise(resolve => {
        const pieceSize = this.size / 9
        const padding = 5
        const containerEl = this.$el.querySelector("#images")

        const image = new Image();
        image.src = this.image;
        image.onload = () => {
          for(var y = 0; y < 9; ++y) {
            for(var x = 0; x < 9; ++x) {
              // create canvas
              var canvas = document.createElement('canvas');
              canvas.width = pieceSize;
              canvas.height = pieceSize;
              var context = canvas.getContext('2d');
              // draw piece
              // context.drawImage(image, (x * pieceSize) + 5, (y * pieceSize) + 5, pieceSize-10, pieceSize-10, 0, 0, canvas.width, canvas.height);
              context.drawImage(image, (x * pieceSize) + padding, (y * pieceSize) + padding, pieceSize - (2*padding), pieceSize - (2*padding), 0, 0, canvas.width, canvas.height);
              
              // increase image contrast and brightness
              // const contrastedImg = this.contrastImage(context.getImageData(0, 0, canvas.width, canvas.height), 50)
              // const finalImg = this.brightenImage(context.getImageData(0, 0, canvas.width, canvas.height), 1.3)

              // context.clearRect(0, 0, canvas.width, canvas.height);
              // draw image with more contrast
              // context.putImageData(finalImg, 0, 0)

              this.imagePieces.push(canvas.toDataURL())
              this.canvasPieces.push(canvas)
            }
          }

          this.imagePieces.forEach((piece, i) => {
            // console.log(this.$refs['img_' + (i+1)])
            // this.$refs['img_' + (i+1)].src = piece;
            const imageFoo = document.createElement('img')
            imageFoo.src = piece;
            if (i % 9 === 0) {
              const brFoo = document.createElement('br')
              containerEl.appendChild(brFoo)
            }
            containerEl.appendChild(imageFoo)
          })
          resolve();
        }
      });
    },

    // clamp(n, min, max) {
    //   return Math.max(min, Math.min(max, n))
    // },

    // contrastImage(imgData, contrast){  //input range [-100..100]
    //   var d = imgData.data;
    //   contrast = (contrast/100) + 1;  //convert to decimal & shift range: [0..2]
    //   var intercept = 128 * (1 - contrast);
    //   for(var i=0;i<d.length;i+=4){   //r,g,b,a
    //       d[i] = d[i]*contrast + intercept;
    //       d[i+1] = d[i+1]*contrast + intercept;
    //       d[i+2] = d[i+2]*contrast + intercept;
    //   }
    //   return imgData;
    // },

    // brightenImage(imgData, brightness) {
    //   const d = imgData.data
    //   for(let i = 0; i < d.length; i += 4) {
    //     const r = d[i+0]
    //     const g = d[i+1]
    //     const b = d[i+2]
    //     const brightnedR = this.clamp(r * brightness, 0, 255)
    //     const brightnedG = this.clamp(g * brightness, 0, 255)
    //     const brightnedB = this.clamp(b * brightness, 0, 255)
    //     d[i+0] = brightnedR
    //     d[i+1] = brightnedG
    //     d[i+2] = brightnedB
    //   }
    //   return imgData
    // },

    async getNumbers() {
      await this.worker.load();
      await this.worker.loadLanguage('eng');
      await this.worker.initialize('eng');
      await this.worker.setParameters({
        tessedit_char_whitelist: '123456789',
      });
      
      let print = ""
      const grid = [
        [],[],[],[],[],[],[],[],[]
      ]
      for(let i = 0; i < this.imagePieces.length; ++i) {
        const result = await this.worker.recognize(this.imagePieces[i])
        // console.log(result.data)
        const num = result.data.text.trim() === "" ? 0 : parseInt(result.data.text.trim())
        const line = Math.floor(i / 9)
        grid[line].push(num)
        
        print += num
        print += " "
        if ((i+1) % 9 === 0)
          print += "\n"
      }
      // console.log(print)
      console.log(grid)
      solveGrid(grid)
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#images {
  img {
    margin-right: 4px;
    border: 1px dashed #2c3e50;
  }
}
</style>
