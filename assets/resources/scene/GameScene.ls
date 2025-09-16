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
          "_$id": "zfk8oi3r",
          "_$prefab": "a375d387-c81f-46ea-8b81-e71a9d23f831",
          "name": "Rock",
          "active": true,
          "x": 269,
          "y": 1762,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "visible": true
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
          "text": "",
          "playerMana": 10,
          "maxMana": 10
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
          },
          "_$comp": [
            {
              "_$type": "18f27c7e-6f83-462c-899e-665d4b7b155f",
              "scriptPath": "resources/scripts/RockCard.ts",
              "cardName": "Rock卡片",
              "manaCost": 3,
              "rockLevel": 1,
              "isPlayerCard": true,
              "rockPrefabPath": "prefabs/Rock.lh"
            }
          ]
        }
      ]
    },
    {
      "_$id": "956g9jgg",
      "_$type": "Sprite",
      "name": "spawnArea",
      "x": 598,
      "y": 1787,
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
}