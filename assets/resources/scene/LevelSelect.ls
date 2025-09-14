{
  "_$ver": 1,
  "_$id": "tv6opg6n",
  "_$runtime": "res://4f49916c-eb74-4e4a-8a59-40e0b580a548",
  "_$type": "Scene",
  "left": 0,
  "right": 0,
  "top": 0,
  "bottom": 0,
  "name": "Scene2D",
  "width": 1179,
  "height": 2556,
  "_$child": [
    {
      "_$id": "qcr32u4m",
      "_$type": "Sprite",
      "name": "background",
      "width": 1179,
      "height": 2556,
      "texture": {
        "_$uuid": "cfb168d0-4d0d-4ec4-8919-24d5e64cb9bc",
        "_$type": "Texture"
      }
    },
    {
      "_$id": "5xrurzng",
      "_$type": "Button",
      "name": "Back",
      "x": 385,
      "y": 2191,
      "width": 248,
      "height": 165,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "scaleX": 1.5,
      "scaleY": 1.5,
      "stateNum": 1,
      "skin": "res://e4307ef8-2c67-4ac5-a8ae-77e29a0457b1",
      "label": "返回",
      "labelSize": 34,
      "labelBold": true,
      "labelAlign": "center",
      "labelVAlign": "middle",
      "labelPadding": "-23,0,0,0",
      "labelStroke": 10,
      "labelStrokeColor": "#f4c5c5"
    },
    {
      "_$id": "lszae57x",
      "_$type": "Button",
      "name": "Start",
      "x": 818,
      "y": 2190,
      "width": 248,
      "height": 165,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "scaleX": 1.5,
      "scaleY": 1.5,
      "stateNum": 1,
      "skin": "res://e4307ef8-2c67-4ac5-a8ae-77e29a0457b1",
      "label": "开始",
      "labelSize": 34,
      "labelBold": true,
      "labelAlign": "center",
      "labelVAlign": "middle",
      "labelPadding": "-23,0,0,0",
      "labelStroke": 10,
      "labelStrokeColor": "#f4c5c5"
    },
    {
      "_$id": "9tybj84k",
      "_$var": true,
      "_$type": "Tab",
      "name": "item0Tab",
      "x": 148,
      "y": 175,
      "width": 892,
      "height": 114,
      "_mouseState": 2,
      "stateNum": null,
      "space": 25,
      "labelFont": null,
      "labelSize": 30,
      "labelColors": "#000000,#ffffff,#faf8f8,#c0c0c0",
      "labelStroke": null,
      "strokeColors": null,
      "labelAlign": null,
      "_$child": [
        {
          "_$id": "7nro2e06",
          "_$type": "Button",
          "name": "item0",
          "width": 259,
          "height": 119,
          "_mouseState": 2,
          "stateNum": 1,
          "skin": "res://e4307ef8-2c67-4ac5-a8ae-77e29a0457b1",
          "sizeGrid": "12,12,12,12,0",
          "label": "序章",
          "labelFont": "SimHei",
          "labelSize": 52,
          "labelBold": true,
          "labelColors": "#16b2a0,#02b4ba,#c00c0c",
          "labelAlign": "center",
          "labelVAlign": "middle",
          "labelPadding": "0,0,14,0",
          "labelStroke": 5
        }
      ]
    },
    {
      "_$id": "dg1pjrl9",
      "_$var": true,
      "_$type": "ViewStack",
      "name": "levelstack",
      "x": 138,
      "y": 179,
      "width": 904,
      "height": 1828,
      "bgColor": "rgba(110,149,200,0.457)",
      "selectedIndex": 0,
      "_$child": [
        {
          "_$id": "t3jshc16",
          "_$type": "Box",
          "name": "item0",
          "x": 21,
          "y": 121,
          "width": 873,
          "height": 1183,
          "visible": true,
          "bgColor": "rgba(242,166,229,0.516)",
          "_$child": [
            {
              "_$id": "j3btzceb",
              "_$var": true,
              "_$type": "List",
              "name": "LevelList",
              "width": 873,
              "height": 1162,
              "itemTemplate": {
                "_$ref": "wx4fjo5b",
                "_$tmpl": "itemRender"
              },
              "repeatX": 5,
              "repeatY": 6,
              "elasticEnabled": true,
              "spaceX": 28,
              "spaceY": 5,
              "scrollType": 2,
              "selectEnable": true,
              "_$child": [
                {
                  "_$id": "wx4fjo5b",
                  "_$type": "Box",
                  "name": "level",
                  "x": 5,
                  "width": 150,
                  "height": 150,
                  "_$child": [
                    {
                      "_$id": "3yfgzwnl",
                      "_$type": "Image",
                      "name": "listItemBG",
                      "width": 150,
                      "height": 150,
                      "skin": "res://0cab473d-761e-476b-910f-cb7dd06e85a2",
                      "color": "#ffffff"
                    },
                    {
                      "_$id": "nggbl3cx",
                      "_$type": "Label",
                      "name": "Number",
                      "x": 74,
                      "y": 70,
                      "width": 69,
                      "height": 60,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "text": "1",
                      "fontSize": 67,
                      "color": "#ffffff",
                      "align": "center",
                      "valign": "middle"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}