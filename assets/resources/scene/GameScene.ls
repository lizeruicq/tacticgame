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
          }
        }
      ],
      "_$child": [
        {
          "_$id": "gu0v1v9o",
          "_$type": "ProgressBar",
          "name": "PlayerHpBar",
          "x": 81,
          "y": 1994,
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
          "y": 2021,
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
          "x": 1119,
          "y": 69,
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
          "x": 80,
          "y": 68,
          "width": 120,
          "height": 120,
          "zIndex": 1,
          "stateNum": 1,
          "skin": "res://dd766b95-76b9-4a63-a357-ec4b65ceb23f",
          "label": "",
          "labelSize": 20,
          "labelAlign": "center",
          "labelVAlign": "middle"
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
          "scriptPath": "resources/scripts/GameMainManager.ts",
          "text": ""
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
      "x": 591,
      "y": 42,
      "width": 380,
      "height": 380,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "texture": {
        "_$uuid": "b24b4793-dad0-4049-8efa-cf8a5c0a3204",
        "_$type": "Texture"
      },
      "_$comp": [
        {
          "_$type": "14cf51ce-1943-4f1c-964e-1be9313f5b18",
          "scriptPath": "resources/scripts/Castle.ts",
          "isPlayerCamp": false,
          "castleLevel": 1
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
      "height": 2037,
      "_$child": [
        {
          "_$id": "956g9jgg",
          "_$type": "Sprite",
          "name": "spawnArea",
          "x": 556,
          "y": 1885,
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
      "x": 596,
      "y": 2052,
      "width": 380,
      "height": 380,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "texture": {
        "_$uuid": "fc601f28-fb14-4df1-bb0a-f52328de9818",
        "_$type": "Texture"
      },
      "_$comp": [
        {
          "_$type": "14cf51ce-1943-4f1c-964e-1be9313f5b18",
          "scriptPath": "resources/scripts/Castle.ts",
          "isPlayerCamp": true,
          "castleLevel": 1
        }
      ]
    },
    {
      "_$id": "oxlzdr1r",
      "_$type": "Image",
      "name": "CardsContainer",
      "x": 13,
      "y": 1971,
      "width": 1175,
      "height": 582,
      "skin": "res://d6102fdb-2492-4ea7-ab6f-eca1f65a1acc",
      "color": "#ffffff"
    },
    {
      "_$id": "th76pqq2",
      "_$type": "HBox",
      "name": "CardBox",
      "x": 100,
      "y": 2113,
      "width": 980,
      "height": 262,
      "centerX": 0,
      "space": 51,
      "align": "middle",
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
          "_$id": "pdl3eejj",
          "_$prefab": "a6d568df-b152-4b1f-81dd-93c16814182c",
          "name": "card_wizard",
          "active": true,
          "x": 0,
          "y": 28,
          "visible": true
        },
        {
          "_$id": "xa1c50kw",
          "_$prefab": "bfce3c49-3edb-492e-aab3-cd0198586a90",
          "name": "card_rock",
          "active": true,
          "x": 257,
          "y": 28,
          "visible": true
        },
        {
          "_$id": "9fzobz9v",
          "_$prefab": "21486761-43d5-4111-8daa-dd9666eafb6a",
          "name": "card_pastor",
          "active": true,
          "x": 514,
          "y": 28,
          "visible": true
        }
      ]
    }
  ]
}