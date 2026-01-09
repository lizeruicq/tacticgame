{
  "_$ver": 1,
  "_$id": "loading_screen",
  "_$type": "Scene",
  "left": 0,
  "right": 0,
  "top": 0,
  "bottom": 0,
  "name": "Scene2D",
  "width": 1179,
  "height": 2556,
  "_$comp": [
    {
      "_$type": "09dcf688-f4b1-4192-a462-6b72fc108133",
      "scriptPath": "../src/LoadingScreen.ts",
      "progressBar": {
        "_$ref": "progress_bar"
      },
      "progressLabel": {
        "_$ref": "progress_label"
      },
      "tipsLabel": {
        "_$ref": "tips_label"
      }
    }
  ],
  "_$child": [
    {
      "_$id": "bg_sprite",
      "_$type": "Sprite",
      "name": "Background",
      "width": 1179,
      "height": 2556,
      "_$child": [
        {
          "_$id": "bg_image",
          "_$type": "Image",
          "name": "BGImage",
          "x": 590,
          "y": 1278,
          "width": 1179,
          "height": 2556,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "skin": "res://5f341a06-1f88-419f-ac2c-f8aa9ad34ab4",
          "color": "#ffffff"
        }
      ]
    },
    {
      "_$id": "loading_container",
      "_$type": "Box",
      "name": "LoadingContainer",
      "x": 590,
      "y": 1278,
      "width": 800,
      "height": 400,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "_$child": [
        {
          "_$id": "loading_title",
          "_$type": "Label",
          "name": "LoadingTitle",
          "y": 50,
          "width": 800,
          "height": 80,
          "text": "正在加载资源...",
          "font": "YuppySC-Regular",
          "fontSize": 60,
          "color": "#ffffff",
          "align": "center",
          "valign": "middle",
          "stroke": 5
        },
        {
          "_$id": "progress_bar",
          "_$var": true,
          "_$type": "ProgressBar",
          "name": "ProgressBar",
          "x": 50,
          "y": 180,
          "width": 700,
          "height": 40,
          "alpha": 0.983,
          "skin": "res://ae3de75e-ee9f-478d-9f8b-ede75a4fc296",
          "sizeGrid": "4,4,4,4,0",
          "value": 0
        },
        {
          "_$id": "progress_label",
          "_$var": true,
          "_$type": "Label",
          "name": "ProgressLabel",
          "y": 240,
          "width": 800,
          "height": 50,
          "text": "0/0",
          "font": "YuppySC-Regular",
          "fontSize": 40,
          "color": "#ffffff",
          "align": "center",
          "valign": "middle",
          "stroke": 3
        },
        {
          "_$id": "tips_label",
          "_$var": true,
          "_$type": "Label",
          "name": "TipsLabel",
          "y": 310,
          "width": 800,
          "height": 60,
          "text": "正在初始化...",
          "font": "YuppySC-Regular",
          "fontSize": 32,
          "color": "#cccccc",
          "align": "center",
          "valign": "middle",
          "stroke": 2
        }
      ]
    }
  ]
}