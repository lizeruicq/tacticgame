{
  "_$ver": 1,
  "_$id": "a3ymx21l",
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
      "_$id": "nkh1ov7l",
      "_$type": "Sprite",
      "name": "UIParent",
      "x": -3,
      "y": -6,
      "width": 1178,
      "height": 2529,
      "_$comp": [
        {
          "_$type": "a9586a3a-1907-48e2-b533-0785628aad2c",
          "scriptPath": "resources/scripts/UIManager.ts",
          "playerHpBar": {
            "_$ref": "gu0v1v9o"
          },
          "enemyHpBar": {
            "_$ref": "slvpqtf4"
          },
          "manaText": {
            "_$ref": "svc6tumn"
          },
          "stopButton": {
            "_$ref": "obxzpln9"
          },
          "gameStartPanelBox": {
            "_$ref": "tmi3s46b"
          },
          "gameEndPanelBox": {
            "_$ref": "1kdul3cr"
          },
          "hintLabel": {
            "_$ref": "nbbwpvzd"
          }
        }
      ],
      "_$child": [
        {
          "_$id": "gu0v1v9o",
          "_$type": "ProgressBar",
          "name": "PlayerHpBar",
          "x": 81,
          "y": 1726,
          "width": 507,
          "height": 37,
          "rotation": 270.27695878401937,
          "zIndex": 1,
          "skin": "res://b07991ec-62dd-4c5e-b01c-a5314e1722bb",
          "value": 0.691
        },
        {
          "_$id": "svc6tumn",
          "_$type": "Label",
          "name": "manaText",
          "x": 69,
          "y": 1753,
          "width": 329,
          "height": 86,
          "zIndex": 3,
          "text": "魔法值:200",
          "fontSize": 60,
          "color": "#e2ed06",
          "bold": true,
          "stroke": 12
        },
        {
          "_$id": "slvpqtf4",
          "_$type": "ProgressBar",
          "name": "EnemyHpBar",
          "x": 1104,
          "y": 168,
          "width": 502,
          "height": 37,
          "rotation": 90,
          "zIndex": 1,
          "skin": "res://b07991ec-62dd-4c5e-b01c-a5314e1722bb",
          "value": 0.565
        },
        {
          "_$id": "obxzpln9",
          "_$type": "Button",
          "name": "StopButton",
          "x": 1007,
          "y": 48,
          "width": 120,
          "height": 120,
          "zIndex": 1,
          "stateNum": 1,
          "skin": "res://dd766b95-76b9-4a63-a357-ec4b65ceb23f",
          "label": "",
          "labelAlign": "center",
          "labelVAlign": "middle"
        },
        {
          "_$id": "tmi3s46b",
          "_$type": "Box",
          "name": "StartPanel",
          "x": 584,
          "y": 932,
          "width": 985,
          "height": 985,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "zIndex": 1,
          "_$comp": [
            {
              "_$type": "c29b4a86-98f3-47eb-872d-fd62f0553cbf",
              "scriptPath": "resources/scripts/GameStartPanel.ts",
              "guideLabel": {
                "_$ref": "0glgq3t5"
              },
              "monsterTypesLabel": {
                "_$ref": "fxbyovnr"
              },
              "startButton": {
                "_$ref": "0wn13wel"
              }
            }
          ],
          "_$child": [
            {
              "_$id": "kl3u6rjy",
              "_$type": "Image",
              "name": "panel",
              "x": 493,
              "y": 493,
              "width": 985,
              "height": 771,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "centerX": 0,
              "centerY": 0,
              "skin": "res://222286e3-9778-414a-9529-36b5ddd4fb6e",
              "color": "#ffffff"
            },
            {
              "_$id": "0wn13wel",
              "_$type": "Button",
              "name": "StartButton",
              "x": 492,
              "y": 962,
              "width": 180,
              "height": 180,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "stateNum": 1,
              "skin": "res://f463d7c7-bd11-48f4-b2f5-b7f6f0c0968e",
              "label": "",
              "labelAlign": "center",
              "labelVAlign": "middle"
            },
            {
              "_$id": "3z2jqqp6",
              "_$type": "Button",
              "name": "MenuButton",
              "x": 256,
              "y": 959,
              "width": 180,
              "height": 180,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "stateNum": 1,
              "skin": "res://d0c1dfc5-074a-4af1-b545-7cdee8e610c1",
              "label": "",
              "labelAlign": "center",
              "labelVAlign": "middle"
            },
            {
              "_$id": "ie3y82r2",
              "_$type": "Button",
              "name": "RestartButton",
              "x": 720,
              "y": 967,
              "width": 180,
              "height": 180,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "stateNum": 1,
              "skin": "res://945c8959-5f2a-4fd4-836d-11904e2fd227",
              "label": "",
              "labelAlign": "center",
              "labelVAlign": "middle"
            },
            {
              "_$id": "0glgq3t5",
              "_$type": "Label",
              "name": "guideLabel",
              "x": 482,
              "y": 220,
              "width": 331,
              "height": 163,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "text": "第一关",
              "font": "YuppySC-Regular",
              "fontSize": 100,
              "color": "#4d895a",
              "bold": true,
              "align": "center",
              "valign": "middle",
              "stroke": 5,
              "strokeColor": "#63955a"
            },
            {
              "_$id": "fxbyovnr",
              "_$type": "Label",
              "name": "monsterTypesLabel",
              "x": 505,
              "y": 507,
              "width": 669,
              "height": 401,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "text": "关卡信息说明",
              "font": "YuppySC-Regular",
              "fontSize": 75,
              "bold": true,
              "strokeColor": "#63955a"
            }
          ]
        },
        {
          "_$id": "1kdul3cr",
          "_$type": "Box",
          "name": "EndPanel",
          "x": 587,
          "y": 931,
          "width": 985,
          "height": 985,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "visible": false,
          "zIndex": 1,
          "_$comp": [
            {
              "_$type": "7db5312b-be54-4d65-bba1-92ec3ad3cfdd",
              "scriptPath": "resources/scripts/GameEndPanel.ts",
              "resultImage": {
                "_$ref": "206ch5rg"
              },
              "textLabel": {
                "_$ref": "3k71u47v"
              },
              "menuButton": {
                "_$ref": "jx265mnw"
              },
              "restartButton": {
                "_$ref": "s4d4msvy"
              }
            }
          ],
          "_$child": [
            {
              "_$id": "becpy9sm",
              "_$type": "Image",
              "name": "panel",
              "x": 493,
              "y": 493,
              "width": 985,
              "height": 771,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "centerX": 0,
              "centerY": 0,
              "skin": "res://222286e3-9778-414a-9529-36b5ddd4fb6e",
              "color": "#ffffff"
            },
            {
              "_$id": "jx265mnw",
              "_$type": "Button",
              "name": "MenuButton",
              "x": 605,
              "y": 959,
              "width": 180,
              "height": 180,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "stateNum": 1,
              "skin": "res://4cd32db6-8b1a-4c43-a4c8-38a17fdb0217",
              "label": "",
              "labelAlign": "center",
              "labelVAlign": "middle"
            },
            {
              "_$id": "s4d4msvy",
              "_$type": "Button",
              "name": "RestartButton",
              "x": 358,
              "y": 957,
              "width": 180,
              "height": 180,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "stateNum": 1,
              "skin": "res://945c8959-5f2a-4fd4-836d-11904e2fd227",
              "label": "",
              "labelAlign": "center",
              "labelVAlign": "middle"
            },
            {
              "_$id": "3k71u47v",
              "_$type": "Label",
              "name": "TextLabel",
              "x": 505,
              "y": 507,
              "width": 669,
              "height": 401,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "text": "关卡结束说明",
              "font": "YuppySC-Regular",
              "fontSize": 75,
              "bold": true,
              "align": "center",
              "valign": "middle",
              "strokeColor": "#63955a"
            },
            {
              "_$id": "206ch5rg",
              "_$type": "Image",
              "name": "result",
              "x": 177,
              "y": 54,
              "width": 631,
              "height": 248,
              "centerX": 0,
              "skin": "res://e6fe7b3a-2e83-4fd2-becf-8759dd40669f",
              "color": "#ffffff"
            }
          ]
        },
        {
          "_$id": "nbbwpvzd",
          "_$type": "Label",
          "name": "HintLable",
          "x": 185,
          "y": 108,
          "width": 808,
          "height": 145,
          "zIndex": 10,
          "centerX": 0,
          "text": "",
          "font": "YuppySC-Regular",
          "fontSize": 75,
          "color": "#ebeb62",
          "bold": true,
          "align": "center",
          "valign": "middle",
          "wordWrap": true,
          "stroke": 26
        }
      ]
    },
    {
      "_$id": "qhk32tg3",
      "_$type": "Sprite",
      "name": "GameMainManager",
      "y": 2,
      "width": 1179,
      "height": 2554,
      "texture": {
        "_$uuid": "d702fd90-699f-4061-a5dd-93e2f92371bc",
        "_$type": "Texture"
      },
      "_$comp": [
        {
          "_$type": "e04b952a-7429-4b86-b289-20d358baf726",
          "scriptPath": "resources/scripts/GameMainManager.ts"
        },
        {
          "_$type": "754b97de-0a5a-4b15-bd15-fcd134f1bbb4",
          "scriptPath": "resources/scripts/PlayerManager.ts"
        },
        {
          "_$type": "83ab941c-e3af-41a9-b62d-d2ff890d030d",
          "scriptPath": "resources/scripts/EnemyAIManager.ts"
        }
      ]
    },
    {
      "_$id": "rq40rlmn",
      "_$type": "Sprite",
      "name": "castle-enemy",
      "x": 204,
      "y": 228,
      "width": 474,
      "height": 446,
      "anchorX": 0.2468354430379747,
      "anchorY": 0.6345291479820628,
      "scaleX": -1,
      "texture": {
        "_$uuid": "f707a125-c60f-4dd3-afaf-7da933c678da",
        "_$type": "Texture"
      },
      "_$comp": [
        {
          "_$type": "14cf51ce-1943-4f1c-964e-1be9313f5b18",
          "scriptPath": "resources/scripts/Castle.ts",
          "isPlayerCamp": false,
          "castleLevel": 1,
          "textureHealthy": "resources/images/sprite/castke/Asset 27.png",
          "textureDamaged": "resources/images/sprite/castke/Asset 28.png",
          "textureCritical": "resources/images/sprite/castke/Asset 29.png"
        }
      ]
    },
    {
      "_$id": "dan9jgev",
      "_$type": "Box",
      "name": "BattleField",
      "x": 42,
      "y": 38,
      "width": 1102,
      "height": 1913,
      "_$child": [
        {
          "_$id": "956g9jgg",
          "_$type": "Sprite",
          "name": "spawnArea",
          "x": 556,
          "y": 1652,
          "width": 1069,
          "height": 313,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "_gcmds": [
            {
              "_$type": "DrawRectCmd",
              "fillColor": "rgba(10,10,62,0.3333333333333333)"
            }
          ]
        }
      ]
    },
    {
      "_$id": "7kurtrav",
      "_$type": "Sprite",
      "name": "castle-self",
      "x": 933,
      "y": 1544,
      "width": 500,
      "height": 444,
      "anchorX": 0.182,
      "anchorY": 0.240990990990991,
      "texture": {
        "_$uuid": "03cf940d-a14d-452d-937c-8335d63dd25a",
        "_$type": "Texture"
      },
      "_$comp": [
        {
          "_$type": "14cf51ce-1943-4f1c-964e-1be9313f5b18",
          "scriptPath": "resources/scripts/Castle.ts",
          "isPlayerCamp": true,
          "castleLevel": 1,
          "textureHealthy": "resources/images/sprite/castke/Asset 21.png",
          "textureDamaged": "resources/images/sprite/castke/Asset 22.png",
          "textureCritical": "resources/images/sprite/castke/Asset 23.png"
        }
      ]
    },
    {
      "_$id": "oxlzdr1r",
      "_$type": "Image",
      "name": "CardsContainer",
      "x": 13,
      "y": 1688,
      "width": 1175,
      "height": 865,
      "skin": "res://d6102fdb-2492-4ea7-ab6f-eca1f65a1acc",
      "color": "#ffffff"
    },
    {
      "_$id": "th76pqq2",
      "_$type": "HBox",
      "name": "CardBox",
      "x": 78,
      "y": 1909,
      "width": 1025,
      "height": 343,
      "space": 43,
      "align": "middle",
      "autoSizeMode": "both",
      "_$comp": [
        {
          "_$type": "4b33acaa-eefb-4de4-ade6-7267208fe4e9",
          "scriptPath": "resources/scripts/CardManager.ts",
          "text": "",
          "playerMana": 10,
          "maxMana": 10,
          "cardCooldown": 2000
        }
      ],
      "_$child": [
        {
          "_$id": "n72oc73a",
          "_$prefab": "bfce3c49-3edb-492e-aab3-cd0198586a90",
          "name": "card_rock",
          "active": true,
          "x": 0,
          "y": 0,
          "anchorX": 0,
          "anchorY": 0,
          "visible": true
        },
        {
          "_$id": "zmqwu4qp",
          "_$prefab": "bfce3c49-3edb-492e-aab3-cd0198586a90",
          "name": "card_rock_1",
          "active": true,
          "x": 267,
          "y": 0,
          "visible": true
        },
        {
          "_$id": "ya0cmcp4",
          "_$prefab": "bfce3c49-3edb-492e-aab3-cd0198586a90",
          "name": "card_rock_2",
          "active": true,
          "x": 534,
          "y": 0,
          "visible": true
        },
        {
          "_$id": "ru18o8eo",
          "_$prefab": "bfce3c49-3edb-492e-aab3-cd0198586a90",
          "name": "card_rock_3",
          "active": true,
          "x": 801,
          "y": 0,
          "visible": true
        }
      ]
    }
  ]
}