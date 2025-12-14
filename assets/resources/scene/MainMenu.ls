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
      "scriptPath": "../src/Mainmenu/MainMenuScene.ts",
      "startButton": {
        "_$ref": "zqijhwkd"
      },
      "settingButton": {
        "_$ref": "4jgpmxfz"
      },
      "helpButton": {
        "_$ref": "ieb50hxa"
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
      "_$child": [
        {
          "_$id": "efju76s6",
          "_$type": "Image",
          "name": "mainbackground",
          "x": -122,
          "y": -1,
          "width": 1423,
          "height": 2578,
          "skin": "res://e75da8f0-b6f4-4ba1-9671-58ba02123609",
          "color": "#ffffff"
        },
        {
          "_$id": "lkc6sehb",
          "_$type": "Image",
          "name": "Logo",
          "x": 106,
          "y": 383,
          "width": 931,
          "height": 931,
          "skin": "res://2ebbb988-ebc8-4468-902d-87f6d9774d8b",
          "color": "#ffffff"
        },
        {
          "_$id": "81p7wsjr",
          "_$type": "Image",
          "name": "PlayerAvatar",
          "x": 7,
          "y": 162,
          "width": 100,
          "height": 100,
          "scaleX": 1.5,
          "scaleY": 1.5,
          "skin": "res://93edcab1-a457-430f-b791-ca595b2ca09b",
          "color": "#ffffff"
        },
        {
          "_$id": "zdr2iufk",
          "_$type": "Label",
          "name": "PlayerName",
          "x": 173,
          "y": 243,
          "width": 172,
          "height": 52,
          "anchorY": 0.5,
          "scaleX": 2,
          "scaleY": 2,
          "text": "Player\n",
          "fontSize": 48,
          "color": "#fcfcfc",
          "valign": "middle",
          "stroke": 7
        },
        {
          "_$id": "zqijhwkd",
          "_$type": "Button",
          "name": "StartButton",
          "x": 590,
          "y": 1645,
          "width": 180,
          "height": 180,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "scaleX": 1.5,
          "scaleY": 1.5,
          "centerX": 0,
          "stateNum": 1,
          "skin": "res://f463d7c7-bd11-48f4-b2f5-b7f6f0c0968e",
          "label": "",
          "labelSize": 58,
          "labelBold": true,
          "labelAlign": "center",
          "labelVAlign": "middle",
          "labelPadding": "-18,0,0,0",
          "labelStroke": 10,
          "labelStrokeColor": "#f4c5c5"
        },
        {
          "_$id": "ieb50hxa",
          "_$type": "Button",
          "name": "HelpButton",
          "x": 403,
          "y": 1397,
          "width": 139,
          "height": 139,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "scaleX": 1.5,
          "scaleY": 1.5,
          "centerX": -187,
          "stateNum": 1,
          "skin": "res://1f5282ee-8b2e-480b-a538-6f3e139789bf",
          "label": "",
          "labelSize": 58,
          "labelBold": true,
          "labelAlign": "center",
          "labelVAlign": "middle",
          "labelPadding": "-18,0,0,0",
          "labelStroke": 10,
          "labelStrokeColor": "#f4c5c5"
        },
        {
          "_$id": "4jgpmxfz",
          "_$type": "Button",
          "name": "SettingButton",
          "x": 784,
          "y": 1397,
          "width": 139,
          "height": 139,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "scaleX": 1.5,
          "scaleY": 1.5,
          "centerX": 194,
          "stateNum": 1,
          "skin": "res://e74bb370-7494-4395-9dc0-bd8380466f4d",
          "label": "",
          "labelSize": 58,
          "labelBold": true,
          "labelAlign": "center",
          "labelVAlign": "middle",
          "labelPadding": "-18,0,0,0",
          "labelStroke": 10,
          "labelStrokeColor": "#f4c5c5"
        },
        {
          "_$id": "fcoz1hwp",
          "_$type": "Button",
          "name": "SoundButton",
          "x": 1064,
          "y": 236,
          "width": 94,
          "height": 94,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "scaleX": 1.5,
          "scaleY": 1.5,
          "stateNum": 1,
          "skin": "res://2eb9a1fa-cc3f-4715-8e2c-3efd2a21e43b",
          "label": "",
          "labelSize": 58,
          "labelBold": true,
          "labelAlign": "center",
          "labelVAlign": "middle",
          "labelPadding": "-18,0,0,0",
          "labelStroke": 10,
          "labelStrokeColor": "#f4c5c5",
          "_$comp": [
            {
              "_$type": "95d03e02-a61b-4989-a9f9-cc2bdb01f59a",
              "scriptPath": "../src/Mainmenu/SoundButton.ts",
              "soundOnImage": "resources/images/UI/sound.png",
              "soundOffImage": "resources/images/UI/sound_off.png"
            }
          ]
        }
      ]
    },
    {
      "_$id": "882xdw7u",
      "_$type": "Box",
      "name": "SettingPanel",
      "x": 590,
      "y": 1058,
      "width": 1019,
      "height": 1019,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "visible": false,
      "centerX": 0,
      "_$comp": [
        {
          "_$type": "f20859ea-6236-42f4-9c25-219f32ccfd4d",
          "scriptPath": "../src/Mainmenu/SettingPanel.ts",
          "closeButton": {
            "_$ref": "bczh45cx"
          },
          "resetButton": {
            "_$ref": "p42yplra"
          },
          "mergesetButton": {
            "_$ref": "a15lecty"
          },
          "confirmPanel": {
            "_$ref": "l6qtf0iv"
          },
          "yesButton": {
            "_$ref": "807k02ij"
          },
          "noButton": {
            "_$ref": "9aaue1mi"
          }
        }
      ],
      "_$child": [
        {
          "_$id": "vzfq7ph1",
          "_$type": "Image",
          "name": "panel1",
          "x": 510,
          "y": 510,
          "width": 1220,
          "height": 955,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "centerX": 0,
          "centerY": 0,
          "skin": "res://222286e3-9778-414a-9529-36b5ddd4fb6e",
          "color": "#ffffff",
          "_$child": [
            {
              "_$id": "bn2ckyzz",
              "_$type": "Image",
              "name": "settingtitle",
              "x": 286,
              "y": -38,
              "width": 648,
              "height": 255,
              "centerX": 0,
              "skin": "res://827b1802-8365-40d7-96d0-523467abb0e3",
              "color": "#ffffff"
            },
            {
              "_$id": "p42yplra",
              "_$type": "Button",
              "name": "ResetButton",
              "x": 633,
              "y": 405,
              "width": 409,
              "height": 121,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "scaleX": 1.5,
              "scaleY": 1.5,
              "stateNum": 1,
              "skin": "res://3ed11228-2cb7-4023-8cca-330237e33362",
              "label": "重置关卡",
              "labelFont": "YuppyTC-Regular",
              "labelSize": 48,
              "labelBold": true,
              "labelColors": "#fcfcfc,#32cc6b,#ff0000",
              "labelAlign": "center",
              "labelVAlign": "middle",
              "labelPadding": "19,0,0,0",
              "labelStroke": 33,
              "labelStrokeColor": "#073030"
            },
            {
              "_$id": "bczh45cx",
              "_$type": "Button",
              "name": "closeButton",
              "x": 1106,
              "y": 93,
              "width": 98,
              "height": 98,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "scaleX": 1.5,
              "scaleY": 1.5,
              "rotation": 12.523365473183917,
              "stateNum": 1,
              "skin": "res://cd4d6bb6-a7a3-4008-990e-d0abbc50916d",
              "label": "",
              "labelFont": "YuppyTC-Regular",
              "labelSize": 82,
              "labelBold": true,
              "labelColors": "#fcfcfc,#32cc6b,#ff0000",
              "labelAlign": "center",
              "labelVAlign": "middle",
              "labelPadding": "18,0,0,0",
              "labelStroke": 33,
              "labelStrokeColor": "#073030"
            },
            {
              "_$id": "a15lecty",
              "_$type": "Button",
              "name": "mergesetButton",
              "x": 636,
              "y": 626,
              "width": 409,
              "height": 121,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "scaleX": 1.5,
              "scaleY": 1.5,
              "stateNum": 1,
              "skin": "res://3ed11228-2cb7-4023-8cca-330237e33362",
              "label": "敌方怪物升级：开",
              "labelFont": "YuppyTC-Regular",
              "labelSize": 48,
              "labelBold": true,
              "labelColors": "#fcfcfc,#32cc6b,#ff0000",
              "labelAlign": "center",
              "labelVAlign": "middle",
              "labelPadding": "19,0,0,0",
              "labelStroke": 33,
              "labelStrokeColor": "#073030"
            }
          ]
        },
        {
          "_$id": "l6qtf0iv",
          "_$type": "Image",
          "name": "ConfirmPanel",
          "x": 538,
          "y": 637,
          "width": 926,
          "height": 746,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "visible": false,
          "centerX": 28,
          "centerY": 127,
          "skin": "res://216f22ab-98b8-4ac1-9ce9-3ede87632b61",
          "color": "#ffffff",
          "_$child": [
            {
              "_$id": "5afowmpd",
              "_$type": "Label",
              "name": "Label",
              "x": 129,
              "y": 210,
              "width": 653,
              "height": 85,
              "text": "确认重置游戏数据吗",
              "font": "YuppyTC-Regular",
              "fontSize": 74,
              "color": "#f7f7f7",
              "bold": true,
              "align": "center",
              "valign": "middle",
              "borderColor": "#939898",
              "underlineColor": "#39e5e5",
              "stroke": 19
            },
            {
              "_$id": "807k02ij",
              "_$type": "Button",
              "name": "yes",
              "x": 316,
              "y": 530,
              "width": 112,
              "height": 112,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "scaleX": 1.5,
              "scaleY": 1.5,
              "rotation": 12.523365473183917,
              "stateNum": 1,
              "skin": "res://2c753585-318e-4479-bf7f-ea9e97971fc6",
              "label": "",
              "labelFont": "YuppyTC-Regular",
              "labelSize": 82,
              "labelBold": true,
              "labelColors": "#fcfcfc,#32cc6b,#ff0000",
              "labelAlign": "center",
              "labelVAlign": "middle",
              "labelPadding": "18,0,0,0",
              "labelStroke": 33,
              "labelStrokeColor": "#073030"
            },
            {
              "_$id": "9aaue1mi",
              "_$type": "Button",
              "name": "no",
              "x": 570,
              "y": 532,
              "width": 110,
              "height": 110,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "scaleX": 1.5,
              "scaleY": 1.5,
              "rotation": 340.4818913177572,
              "stateNum": 1,
              "skin": "res://03d7623a-1ee3-4ae6-803c-4c25292a438c",
              "label": "",
              "labelFont": "YuppyTC-Regular",
              "labelSize": 82,
              "labelBold": true,
              "labelColors": "#fcfcfc,#32cc6b,#ff0000",
              "labelAlign": "center",
              "labelVAlign": "middle",
              "labelPadding": "18,0,0,0",
              "labelStroke": 33,
              "labelStrokeColor": "#073030"
            }
          ]
        }
      ]
    },
    {
      "_$id": "tnc5r6gp",
      "_$type": "Box",
      "name": "HelpPanel",
      "x": 578,
      "y": 1132,
      "width": 1153,
      "height": 1241,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "visible": false,
      "centerX": -12,
      "_$comp": [
        {
          "_$type": "6d316299-7602-40e4-8e59-e3f41cc3773f",
          "scriptPath": "../src/Mainmenu/HelpPanel.ts",
          "closeButton": {
            "_$ref": "l0w7ja5j"
          }
        }
      ],
      "_$child": [
        {
          "_$id": "f3vos987",
          "_$type": "Image",
          "name": "panel",
          "x": 577,
          "y": 614,
          "width": 1142,
          "height": 1183,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "centerX": 0,
          "centerY": -7,
          "skin": "res://222286e3-9778-414a-9529-36b5ddd4fb6e",
          "color": "#ffffff"
        },
        {
          "_$id": "6ngv1g2d",
          "_$type": "Panel",
          "name": "Panel",
          "x": 131,
          "y": 144,
          "width": 883,
          "height": 939,
          "scrollType": 2,
          "elasticEnabled": true,
          "_$child": [
            {
              "_$id": "57yibiz2",
              "_$type": "Label",
              "name": "Label",
              "x": 67,
              "y": 31,
              "width": 777,
              "height": 197,
              "text": "      人类的大举进攻打破了石头人部落原有的宁静生活，石头人部落的村庄已经四面楚歌。作为石头人长老，你要召集部落中的战士，抵御野蛮的人类侵略者",
              "font": "YuppySC-Regular",
              "fontSize": 43,
              "color": "#040404",
              "bold": true,
              "valign": "middle",
              "wordWrap": true,
              "strokeColor": "#ffffff"
            },
            {
              "_$id": "j92u7op1",
              "_$type": "Image",
              "name": "intro1",
              "x": 78,
              "y": 245,
              "width": 756,
              "height": 699,
              "skin": "res://bd0b5a10-e1b7-4bdf-80ad-fc040decbd5e",
              "color": "#ffffff"
            },
            {
              "_$id": "ojwi4jsc",
              "_$type": "Image",
              "name": "intro2",
              "x": 84,
              "y": 963,
              "width": 738,
              "height": 575,
              "skin": "res://d9a48168-8201-4d50-a938-e095f3f027c2",
              "color": "#ffffff"
            },
            {
              "_$id": "syl191rr",
              "_$type": "Image",
              "name": "intro3",
              "x": 79,
              "y": 1554,
              "width": 742,
              "height": 1128,
              "skin": "res://2596af97-7c37-4145-aaff-ba9b35b0cf2f",
              "color": "#ffffff"
            },
            {
              "_$id": "3thitjdl",
              "_$type": "Image",
              "name": "intro4",
              "x": 76,
              "y": 2698,
              "width": 745,
              "height": 1456,
              "skin": "res://d26d10ec-7654-4ea3-80d1-c33ff008a3d2",
              "color": "#ffffff"
            },
            {
              "_$id": "fedfmjqj",
              "_$type": "Image",
              "name": "intro5",
              "x": 68,
              "y": 4011,
              "width": 767,
              "height": 634,
              "skin": "res://b99632bb-465a-4631-8c35-082300bb32b1",
              "color": "#ffffff"
            }
          ]
        },
        {
          "_$id": "l0w7ja5j",
          "_$type": "Button",
          "name": "closeButton",
          "x": 1039,
          "y": 129,
          "width": 98,
          "height": 98,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "scaleX": 1.5,
          "scaleY": 1.5,
          "rotation": 12.523365473183917,
          "stateNum": 1,
          "skin": "res://cd4d6bb6-a7a3-4008-990e-d0abbc50916d",
          "label": "",
          "labelFont": "YuppyTC-Regular",
          "labelSize": 82,
          "labelBold": true,
          "labelColors": "#fcfcfc,#32cc6b,#ff0000",
          "labelAlign": "center",
          "labelVAlign": "middle",
          "labelPadding": "18,0,0,0",
          "labelStroke": 33,
          "labelStrokeColor": "#073030"
        }
      ]
    },
    {
      "_$id": "58j4cfzu",
      "_$type": "Sprite",
      "name": "SoundManager",
      "x": 564,
      "y": 1103,
      "width": 100,
      "height": 100,
      "_$comp": [
        {
          "_$type": "14c7a2ca-929f-42bf-a6e5-48267379264b",
          "scriptPath": "../src/utils/SoundManager.ts"
        }
      ]
    }
  ]
}