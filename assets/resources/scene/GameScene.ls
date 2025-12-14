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
          "scriptPath": "../src/Manager/UIManager.ts",
          "playerHpBar": {
            "_$ref": "gu0v1v9o"
          },
          "enemyHpBar": {
            "_$ref": "slvpqtf4"
          },
          "playerPowerBar": {
            "_$ref": "p2m303jz"
          },
          "enemyPowerBar": {
            "_$ref": "sxf7h94x"
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
          },
          "mergeButton": {
            "_$ref": "g64u6gba"
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
          "value": 0.691,
          "_$child": [
            {
              "_$id": "duc4ouar",
              "_$type": "Image",
              "name": "castle",
              "x": 560,
              "y": 20,
              "width": 100,
              "height": 100,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "rotation": 90,
              "skin": "res://7975254e-0ef4-42ea-8fce-f95f70886e18",
              "useSourceSize": true,
              "color": "#ffffff"
            }
          ]
        },
        {
          "_$id": "p2m303jz",
          "_$type": "ProgressBar",
          "name": "PlayerPowerBar",
          "x": 167,
          "y": 1544,
          "width": 240,
          "height": 37,
          "rotation": -90,
          "zIndex": 1,
          "skin": "res://54906c96-91d5-4506-aa4b-a2a98160dcaf",
          "value": 0.565
        },
        {
          "_$id": "g64u6gba",
          "_$type": "Button",
          "name": "Mergebutton",
          "x": 187,
          "y": 1606,
          "width": 97,
          "height": 95,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "zIndex": 1,
          "stateNum": 1,
          "skin": "res://9152fb08-e3d0-4b33-a834-2fe671de1681",
          "label": "",
          "labelAlign": "center",
          "labelVAlign": "middle"
        },
        {
          "_$id": "svc6tumn",
          "_$type": "Label",
          "name": "manaText",
          "x": 541,
          "y": 1770,
          "width": 174,
          "height": 86,
          "zIndex": 3,
          "text": "200",
          "fontSize": 60,
          "color": "#e2ed06",
          "bold": true,
          "stroke": 12,
          "_$child": [
            {
              "_$id": "buuk1qvg",
              "_$type": "Image",
              "name": "crystal",
              "x": -67,
              "y": 30,
              "width": 102,
              "height": 96,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "skin": "res://644c2788-4e58-46a8-a04d-5e23ee8f56ab",
              "color": "#ffffff"
            }
          ]
        },
        {
          "_$id": "slvpqtf4",
          "_$type": "ProgressBar",
          "name": "EnemyHpBar",
          "x": 1104,
          "y": 284,
          "width": 502,
          "height": 37,
          "rotation": 90,
          "zIndex": 1,
          "skin": "res://b07991ec-62dd-4c5e-b01c-a5314e1722bb",
          "value": 0.565,
          "_$child": [
            {
              "_$id": "2rlva8h7",
              "_$type": "Image",
              "name": "castle2",
              "x": 551,
              "y": 21,
              "width": 100,
              "height": 100,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "rotation": -90,
              "skin": "res://b96e65a4-d78e-4fe5-8864-da0c208ec056",
              "useSourceSize": true,
              "color": "#ffffff"
            }
          ]
        },
        {
          "_$id": "sxf7h94x",
          "_$type": "ProgressBar",
          "name": "EnemyPowerBar",
          "x": 1052,
          "y": 287,
          "width": 240,
          "height": 37,
          "rotation": 90,
          "zIndex": 1,
          "skin": "res://54906c96-91d5-4506-aa4b-a2a98160dcaf",
          "value": 0.565
        },
        {
          "_$id": "obxzpln9",
          "_$type": "Button",
          "name": "StopButton",
          "x": 993,
          "y": 121,
          "width": 140,
          "height": 140,
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
          "height": 1615,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "visible": false,
          "zIndex": 1,
          "_$comp": [
            {
              "_$type": "c29b4a86-98f3-47eb-872d-fd62f0553cbf",
              "scriptPath": "../src/UI/GameStartPanel.ts",
              "guideLabel": {
                "_$ref": "0glgq3t5"
              },
              "monsterTypesLabel": {
                "_$ref": "fxbyovnr"
              },
              "startButton": {
                "_$ref": "0wn13wel"
              },
              "menuButton": {
                "_$ref": "3z2jqqp6"
              },
              "restartButton": {
                "_$ref": "ie3y82r2"
              },
              "backgroundImage": {
                "_$ref": "2u68dzdm"
              }
            }
          ],
          "_$child": [
            {
              "_$id": "kl3u6rjy",
              "_$type": "Image",
              "name": "panel",
              "x": 493,
              "y": 808,
              "width": 1135,
              "height": 1591,
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
              "x": 502,
              "y": 1555,
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
              "x": 266,
              "y": 1552,
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
              "x": 730,
              "y": 1560,
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
              "x": 486,
              "y": 48,
              "width": 331,
              "height": 61,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "text": "第一关",
              "font": "YuppySC-Regular",
              "fontSize": 90,
              "color": "#4d895a",
              "bold": true,
              "align": "center",
              "valign": "middle",
              "stroke": 14,
              "strokeColor": "#fff12c"
            },
            {
              "_$id": "b8dbnasg",
              "_$type": "Label",
              "name": "monsterTypesLabel_1",
              "x": 488,
              "y": 274,
              "width": 677,
              "height": 97,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "text": "本轮我方可使用单位",
              "font": "YuppySC-Regular",
              "fontSize": 71,
              "bold": true,
              "wordWrap": true,
              "strokeColor": "#63955a"
            },
            {
              "_$id": "pdass82l",
              "_$type": "Panel",
              "name": "Panel",
              "x": 1,
              "y": 177,
              "width": 970,
              "height": 1261,
              "zIndex": 10,
              "scrollType": 1,
              "elasticEnabled": true,
              "_$child": [
                {
                  "_$id": "2u68dzdm",
                  "_$type": "Image",
                  "name": "Image",
                  "x": -3,
                  "y": -3,
                  "width": 976,
                  "height": 631,
                  "skin": "res://faa4422e-147b-4fb8-aad6-370b20b65107",
                  "color": "#ffffff"
                },
                {
                  "_$id": "fxbyovnr",
                  "_$type": "Label",
                  "name": "monsterTypesLabel",
                  "x": 485,
                  "y": 851,
                  "width": 853,
                  "height": 401,
                  "anchorX": 0.5,
                  "anchorY": 0.5,
                  "text": "关卡信息说明xxxxxxxxxxxxxxxxx",
                  "font": "YuppySC-Regular",
                  "fontSize": 48,
                  "bold": true,
                  "wordWrap": true,
                  "strokeColor": "#63955a"
                }
              ]
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
              "scriptPath": "../src/UI/GameEndPanel.ts",
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
              },
              "fail": {
                "_$ref": "qecgsbve"
              },
              "star1": {
                "_$ref": "qdxv8q71"
              },
              "star2": {
                "_$ref": "x9vuugqc"
              },
              "star3": {
                "_$ref": "s6eeknzy"
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
              "y": 647,
              "width": 669,
              "height": 275,
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
            },
            {
              "_$id": "qecgsbve",
              "_$type": "Sprite",
              "name": "Fail",
              "x": 246,
              "y": 270,
              "width": 462,
              "height": 258,
              "visible": false,
              "texture": {
                "_$uuid": "a9877c44-70ae-4e48-946a-a20134e1a82b",
                "_$type": "Texture"
              }
            },
            {
              "_$id": "2u64jvym",
              "_$type": "HBox",
              "name": "HBox",
              "x": 245,
              "y": 287,
              "width": 495,
              "height": 200,
              "centerX": 0,
              "space": -58,
              "align": "middle",
              "_$child": [
                {
                  "_$id": "qdxv8q71",
                  "_$type": "Sprite",
                  "name": "Star",
                  "width": 200,
                  "height": 200,
                  "visible": false,
                  "texture": {
                    "_$uuid": "eb82218d-19fe-4127-8b75-2f6a9dfcb521",
                    "_$type": "Texture"
                  }
                },
                {
                  "_$id": "x9vuugqc",
                  "_$type": "Sprite",
                  "name": "Star_1",
                  "x": 142,
                  "width": 200,
                  "height": 200,
                  "visible": false,
                  "texture": {
                    "_$uuid": "eb82218d-19fe-4127-8b75-2f6a9dfcb521",
                    "_$type": "Texture"
                  }
                },
                {
                  "_$id": "s6eeknzy",
                  "_$type": "Sprite",
                  "name": "Star_2",
                  "x": 284,
                  "width": 200,
                  "height": 200,
                  "visible": false,
                  "texture": {
                    "_$uuid": "eb82218d-19fe-4127-8b75-2f6a9dfcb521",
                    "_$type": "Texture"
                  }
                }
              ]
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
          "zIndex": 99,
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
        "_$uuid": "fd71a843-58ab-4176-9df6-63ebaf886d51",
        "_$type": "Texture"
      },
      "_$comp": [
        {
          "_$type": "e04b952a-7429-4b86-b289-20d358baf726",
          "scriptPath": "../src/Manager/GameMainManager.ts"
        },
        {
          "_$type": "754b97de-0a5a-4b15-bd15-fcd134f1bbb4",
          "scriptPath": "../src/Manager/PlayerManager.ts"
        },
        {
          "_$type": "83ab941c-e3af-41a9-b62d-d2ff890d030d",
          "scriptPath": "../src/Manager/EnemyAIManager.ts"
        }
      ]
    },
    {
      "_$id": "rq40rlmn",
      "_$type": "Sprite",
      "name": "castle-enemy",
      "x": 209,
      "y": 220,
      "width": 539,
      "height": 526,
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
          "scriptPath": "../src/monsters/Castle.ts",
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
          "x": 449,
          "y": 1655,
          "width": 717,
          "height": 313,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "_gcmds": [
            {
              "_$type": "DrawRectCmd",
              "fillColor": "rgba(10,10,62,0)"
            }
          ]
        },
        {
          "_$id": "fbz75ixp",
          "_$type": "Sprite",
          "name": "lightings",
          "x": -46,
          "y": -39,
          "width": 1183,
          "height": 1856,
          "visible": false,
          "zIndex": 98,
          "_gcmds": [
            {
              "_$type": "DrawRectCmd",
              "fillColor": "rgba(0,0,0,0.11372549019607843)"
            }
          ],
          "_$child": [
            {
              "_$id": "c552kjp1",
              "_$type": "Image",
              "name": "lighting",
              "x": 158,
              "y": 460,
              "width": 571,
              "height": 999,
              "skin": "res://c8a3ac59-38fe-4b98-b96f-4602eeb5be8d",
              "useSourceSize": true,
              "color": "#ffffff"
            },
            {
              "_$id": "f1l2mmsa",
              "_$type": "Image",
              "name": "lighting",
              "x": 482,
              "y": 475,
              "width": 571,
              "height": 999,
              "skin": "res://c8a3ac59-38fe-4b98-b96f-4602eeb5be8d",
              "useSourceSize": true,
              "color": "#ffffff"
            },
            {
              "_$id": "hyg43nhp",
              "_$type": "Image",
              "name": "cloud",
              "x": 358,
              "y": 142,
              "width": 475,
              "height": 475,
              "skin": "res://5e7cffaf-b360-4626-ab9c-461f9d1c361e",
              "color": "#ffffff"
            }
          ]
        }
      ]
    },
    {
      "_$id": "7kurtrav",
      "_$type": "Sprite",
      "name": "castle-self",
      "x": 838,
      "y": 1571,
      "width": 544,
      "height": 483,
      "anchorX": -0.01727845087543348,
      "anchorY": 0.3386782033960333,
      "texture": {
        "_$uuid": "03cf940d-a14d-452d-937c-8335d63dd25a",
        "_$type": "Texture"
      },
      "_$comp": [
        {
          "_$type": "14cf51ce-1943-4f1c-964e-1be9313f5b18",
          "scriptPath": "../src/monsters/Castle.ts",
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
          "scriptPath": "../src/Manager/CardManager.ts",
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
    },
    {
      "_$id": "prefab_container",
      "_$type": "Sprite",
      "name": "PrefabContainer",
      "width": 0,
      "height": 0,
      "visible": false,
      "_$child": [
        {
          "_$id": "monster_rock",
          "_$prefab": "a375d387-c81f-46ea-8b81-e71a9d23f831",
          "name": "Rock",
          "active": false,
          "x": 89,
          "y": 1642,
          "visible": true
        },
        {
          "_$id": "monster_wizard",
          "_$prefab": "7d30bc52-1016-46a0-9d80-2792ebfd70bf",
          "name": "Wizard",
          "active": false,
          "x": 629,
          "y": -1,
          "visible": true
        },
        {
          "_$id": "monster_pastor",
          "_$prefab": "6b31a931-37a1-442d-b6c2-95b4e537a878",
          "name": "Pastor",
          "active": false,
          "x": 270,
          "y": 1563,
          "visible": true
        },
        {
          "_$id": "monster_goblin",
          "_$prefab": "fd485021-de92-48d9-83d4-8e3384fed8cf",
          "name": "Goblin",
          "active": false,
          "x": 0,
          "y": 0,
          "visible": true
        },
        {
          "_$id": "monster_necromance",
          "_$prefab": "fbf0fcb5-b551-4c82-b0d2-6839de193008",
          "name": "Necromance",
          "active": false,
          "x": 0,
          "y": 0,
          "visible": true
        },
        {
          "_$id": "monster_skeleton",
          "_$prefab": "66c916fc-309a-4172-9045-82c55f33b916",
          "name": "Skeleton",
          "active": false,
          "x": 0,
          "y": 0,
          "visible": true
        },
        {
          "_$id": "monster_troll",
          "_$prefab": "ae5e0b05-ba36-47fa-992c-0f0fa3adeb53",
          "name": "Troll",
          "active": false,
          "x": 0,
          "y": 0,
          "visible": true
        },
        {
          "_$id": "monster_zombie",
          "_$prefab": "6e917600-162b-407e-ae53-499e7acc97bc",
          "name": "Zombie",
          "active": false,
          "x": 0,
          "y": 0,
          "visible": true
        },
        {
          "_$id": "monster_swordfe",
          "_$prefab": "63110cd7-0556-43ce-8cb4-8bf4451ada5f",
          "name": "SwordFe",
          "active": false,
          "x": 271,
          "y": 1506,
          "visible": true
        },
        {
          "_$id": "monster_archer",
          "_$prefab": "ea989b8b-56a9-4f3d-a3ca-ec04ac981776",
          "name": "Archer",
          "active": false,
          "x": 629,
          "y": -1,
          "visible": true
        },
        {
          "_$id": "monster_fairy",
          "_$prefab": "3ba5f627-8b63-4f9f-9f10-4651a5728d01",
          "name": "Fairy",
          "active": false,
          "x": 629,
          "y": -1,
          "visible": true
        },
        {
          "_$id": "monster_knight",
          "_$prefab": "e22b9052-17c9-4746-8d2f-e4c33b99148b",
          "name": "Knight",
          "active": false,
          "x": 629,
          "y": -1,
          "visible": true
        },
        {
          "_$id": "monster_pirate",
          "_$prefab": "de0cfd07-ee56-4063-9a8b-c04f6646186b",
          "name": "Pirate",
          "active": false,
          "x": 629,
          "y": -1,
          "visible": true
        },
        {
          "_$id": "monster_sailor",
          "_$prefab": "1ebf4fd9-638e-4505-b654-f801deba9f73",
          "name": "Sailor",
          "active": false,
          "x": 629,
          "y": -1,
          "visible": true
        },
        {
          "_$id": "monster_sword",
          "_$prefab": "608d2715-b93a-4c93-ae4d-8b4b2b852b27",
          "name": "Sword",
          "active": false,
          "x": 629,
          "y": -1,
          "visible": true
        },
        {
          "_$id": "effect_arrow",
          "_$prefab": "e8dc9d72-1ad3-4184-8a99-e9524f901dca",
          "name": "arrow",
          "active": false,
          "x": 408,
          "y": 1291,
          "visible": true
        },
        {
          "_$id": "effect_cure_ball",
          "_$prefab": "c1ad1081-2a3e-4304-b3e8-c56a0a7d0b18",
          "name": "cure_ball",
          "active": false,
          "x": 564,
          "y": 1176,
          "visible": true
        },
        {
          "_$id": "effect_firebullet",
          "_$prefab": "5d2c7d70-ce12-4acc-b875-dfc0f498090b",
          "name": "firebullet",
          "active": false,
          "x": 564,
          "y": 1176,
          "visible": true
        },
        {
          "_$id": "effect_flame",
          "_$prefab": "9579ae60-08f6-40ad-bbd8-fcbc9e8b4a8b",
          "name": "Flame",
          "active": false,
          "x": 0,
          "y": 0,
          "visible": true
        },
        {
          "_$id": "effect_freeze",
          "_$prefab": "cdc21c6c-4226-4dff-a0f5-3f6f54c9458f",
          "name": "freeze",
          "active": false,
          "x": 564,
          "y": 1176,
          "visible": true
        },
        {
          "_$id": "effect_spawn",
          "_$prefab": "c71d57e4-3ebc-4a2e-a53f-dea1d444ce03",
          "name": "spawn",
          "active": false,
          "x": 564,
          "y": 1176,
          "visible": true
        },
        {
          "_$id": "effect_water",
          "_$prefab": "19fdae99-6f7e-426e-ae00-fbbbe7ce805c",
          "name": "water",
          "active": false,
          "x": 564,
          "y": 1176,
          "visible": true
        },
        {
          "_$id": "effect_wizard_ball",
          "_$prefab": "0d117a61-b124-4ec0-b2a4-5ac0a94313aa",
          "name": "wizard_ball",
          "active": false,
          "x": 564,
          "y": 1176,
          "visible": true
        },
        {
          "_$id": "card_rock",
          "_$prefab": "bfce3c49-3edb-492e-aab3-cd0198586a90",
          "name": "card_rock",
          "active": false,
          "x": 0,
          "y": 28,
          "visible": true
        },
        {
          "_$id": "card_wizard",
          "_$prefab": "a6d568df-b152-4b1f-81dd-93c16814182c",
          "name": "card_wizard",
          "active": false,
          "x": 0,
          "y": 0,
          "visible": true
        },
        {
          "_$id": "card_pastor",
          "_$prefab": "21486761-43d5-4111-8daa-dd9666eafb6a",
          "name": "card_pastor",
          "active": false,
          "x": 0,
          "y": 0,
          "visible": true
        },
        {
          "_$id": "card_goblin",
          "_$prefab": "7c60432a-465d-4d8f-9238-9a395e22875a",
          "name": "card_goblin",
          "active": false,
          "x": 0,
          "y": 0,
          "visible": true
        },
        {
          "_$id": "card_necromance",
          "_$prefab": "2f89aa53-4fb2-4019-87d8-fedca50bbd74",
          "name": "card_necromance",
          "active": false,
          "x": 0,
          "y": 0,
          "visible": true
        },
        {
          "_$id": "card_skeleton",
          "_$prefab": "fe7ae46c-06f0-4473-a8f0-55e5a842ca3f",
          "name": "card_skeleton",
          "active": false,
          "x": 0,
          "y": 0,
          "visible": true
        },
        {
          "_$id": "card_troll",
          "_$prefab": "ef6c679c-a739-4ae0-8d10-60024de7b475",
          "name": "card_troll",
          "active": false,
          "x": 0,
          "y": 0,
          "visible": true
        },
        {
          "_$id": "card_zombie",
          "_$prefab": "5df243f5-8f90-43fa-b3c1-f1f390133b89",
          "name": "card_zombie",
          "active": false,
          "x": 0,
          "y": 0,
          "visible": true
        }
      ]
    }
  ]
}