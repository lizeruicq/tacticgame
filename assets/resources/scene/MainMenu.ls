{
  "_$ver": 1,
  "_$id": "wzqnxfo7",
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
      "_$type": "81dd8cdd-91d5-45fc-8098-117bdd80700f",
      "scriptPath": "../src/MainMenuScene.ts",
      "startButton": {
        "_$ref": "zqijhwkd"
      },
      "playerAvatar": {
        "_$ref": "81p7wsjr"
      },
      "playerName": {
        "_$ref": "zdr2iufk"
      }
    }
  ],
  "_$child": [
    {
      "_$id": "fp1nd90s",
      "_$type": "Sprite",
      "name": "UIContainer",
      "width": 1179,
      "height": 2556,
      "texture": {
        "_$uuid": "cfb168d0-4d0d-4ec4-8919-24d5e64cb9bc",
        "_$type": "Texture"
      },
      "_$child": [
        {
          "_$id": "81p7wsjr",
          "_$type": "Image",
          "name": "PlayerAvatar",
          "x": 11,
          "y": 5,
          "width": 100,
          "height": 100,
          "scaleX": 1.5,
          "scaleY": 1.5,
          "skin": "res://66076636-10bb-47f9-bd4c-5328c3c8c2ed",
          "color": "#ffffff"
        },
        {
          "_$id": "zdr2iufk",
          "_$type": "Label",
          "name": "PlayerName",
          "x": 206,
          "y": 84,
          "width": 172,
          "height": 52,
          "anchorY": 0.5,
          "scaleX": 2,
          "scaleY": 2,
          "text": "玩家",
          "fontSize": 48,
          "color": "#b974d0",
          "valign": "middle",
          "stroke": 7
        },
        {
          "_$id": "zqijhwkd",
          "_$type": "Button",
          "name": "StartButton",
          "x": 600,
          "y": 1952,
          "width": 519,
          "height": 165,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "scaleX": 1.5,
          "scaleY": 1.5,
          "stateNum": 1,
          "skin": "res://e4307ef8-2c67-4ac5-a8ae-77e29a0457b1",
          "label": "开始游戏",
          "labelSize": 58,
          "labelBold": true,
          "labelAlign": "center",
          "labelVAlign": "middle",
          "labelPadding": "-18,0,0,0",
          "labelStroke": 10,
          "labelStrokeColor": "#f4c5c5"
        }
      ]
    }
  ]
}