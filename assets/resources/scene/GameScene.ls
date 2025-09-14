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
      "_$id": "svc6tumn",
      "_$type": "Label",
      "name": "MoneyText",
      "x": 81,
      "y": 1622,
      "width": 174,
      "height": 86,
      "zIndex": 3,
      "text": "200",
      "fontSize": 76,
      "color": "#e2ed06",
      "bold": true,
      "stroke": 12
    },
    {
      "_$id": "qhk32tg3",
      "_$type": "Sprite",
      "name": "GameMainManager",
      "width": 1179,
      "height": 2556,
      "texture": {
        "_$uuid": "d702fd90-699f-4061-a5dd-93e2f92371bc",
        "_$type": "Texture"
      },
      "_$comp": [
        {
          "_$type": "e04b952a-7429-4b86-b289-20d358baf726",
          "scriptPath": "resources/scripts/GameMainManager.ts",
          "text": ""
        }
      ]
    },
    {
      "_$id": "oxlzdr1r",
      "_$type": "Image",
      "name": "CardsContainer",
      "x": 13,
      "y": 1809,
      "width": 1175,
      "height": 744,
      "skin": "res://d6102fdb-2492-4ea7-ab6f-eca1f65a1acc",
      "color": "#ffffff"
    },
    {
      "_$id": "dan9jgev",
      "_$type": "Box",
      "name": "BattleField",
      "x": 42,
      "y": 38,
      "width": 1102,
      "height": 1905,
      "_$child": [
        {
          "_$id": "v8yruf6j",
          "_$type": "Sprite",
          "name": "Rock",
          "x": 89,
          "y": 1642,
          "width": 720,
          "height": 480,
          "scaleX": 0.5,
          "scaleY": 0.5,
          "_$comp": [
            {
              "_$type": "114ac8da-c5ae-460e-935e-db96a976f67e",
              "scriptPath": "resources/scripts/RockAnimationManager.ts",
              "spriteAnimation": {
                "_$ref": "j1n5wb5h"
              }
            },
            {
              "_$type": "87e7ea3b-989b-4d5e-b92d-44cc944561cc",
              "scriptPath": "resources/scripts/RockMonster.ts",
              "isPlayerCamp": 0,
              "rockLevel": 1
            }
          ],
          "_$child": [
            {
              "_$id": "j1n5wb5h",
              "_$type": "Animation",
              "name": "rockAnimation",
              "width": 720,
              "height": 480,
              "source": "res://5456a39b-48aa-45d6-9894-3d2f197e742a",
              "index": 0,
              "interval": 50
            },
            {
              "_$id": "ljz8vrhb",
              "_$type": "ProgressBar",
              "name": "healthbar",
              "x": 226,
              "y": 50,
              "width": 268,
              "height": 26,
              "centerX": 0,
              "skin": "res://ae3de75e-ee9f-478d-9f8b-ede75a4fc296",
              "value": 1
            }
          ]
        }
      ]
    },
    {
      "_$id": "th76pqq2",
      "_$type": "HBox",
      "name": "CardBox",
      "x": 100,
      "y": 2029,
      "width": 980,
      "height": 262,
      "centerX": 0,
      "space": 51,
      "align": "middle",
      "_$comp": [
        {
          "_$type": "4b33acaa-eefb-4de4-ade6-7267208fe4e9",
          "scriptPath": "resources/scripts/CardManager.ts",
          "text": ""
        }
      ],
      "_$child": [
        {
          "_$id": "1kk1wzt0",
          "_$type": "Sprite",
          "name": "card",
          "y": 28,
          "width": 206,
          "height": 206,
          "texture": {
            "_$uuid": "34ca4cf9-7cca-4110-a26f-5b4b2a268bbe",
            "_$type": "Texture"
          }
        },
        {
          "_$id": "yy7ycx2w",
          "_$type": "Sprite",
          "name": "card_1",
          "x": 257,
          "y": 28,
          "width": 206,
          "height": 206,
          "texture": {
            "_$uuid": "34ca4cf9-7cca-4110-a26f-5b4b2a268bbe",
            "_$type": "Texture"
          }
        },
        {
          "_$id": "dixuq7zu",
          "_$type": "Sprite",
          "name": "card_2",
          "x": 514,
          "y": 28,
          "width": 206,
          "height": 206,
          "texture": {
            "_$uuid": "34ca4cf9-7cca-4110-a26f-5b4b2a268bbe",
            "_$type": "Texture"
          }
        },
        {
          "_$id": "ddkf3gfk",
          "_$type": "Sprite",
          "name": "card_3",
          "x": 771,
          "y": 28,
          "width": 206,
          "height": 206,
          "texture": {
            "_$uuid": "34ca4cf9-7cca-4110-a26f-5b4b2a268bbe",
            "_$type": "Texture"
          }
        }
      ]
    },
    {
      "_$id": "956g9jgg",
      "_$type": "Sprite",
      "name": "spawnArea",
      "x": 63,
      "y": 1749,
      "width": 1069,
      "height": 190,
      "_gcmds": [
        {
          "_$type": "DrawRectCmd",
          "fillColor": "rgba(10,10,62,0.3333333333333333)"
        }
      ]
    }
  ]
}