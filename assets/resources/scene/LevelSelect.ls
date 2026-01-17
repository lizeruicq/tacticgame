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
      "x": 590,
      "y": 1278,
      "width": 1179,
      "height": 2556,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "texture": {
        "_$uuid": "942ca7ab-44f6-4aa2-8c48-21a75a93fd43",
        "_$type": "Texture"
      }
    },
    {
      "_$id": "buptpp8m",
      "_$type": "Image",
      "name": "header",
      "x": 624,
      "y": 390,
      "width": 818,
      "height": 305,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "skin": "res://4b75cef2-59e0-4ec6-83a6-7f997b88a171",
      "color": "#ffffff"
    },
    {
      "_$id": "5xrurzng",
      "_$type": "Button",
      "name": "Back",
      "x": 423,
      "y": 2071,
      "width": 150,
      "height": 150,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "scaleX": 1.5,
      "scaleY": 1.5,
      "stateNum": 1,
      "skin": "res://d0c1dfc5-074a-4af1-b545-7cdee8e610c1",
      "label": "",
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
      "x": 797,
      "y": 2074,
      "width": 150,
      "height": 150,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "scaleX": 1.5,
      "scaleY": 1.5,
      "stateNum": 1,
      "skin": "res://2c753585-318e-4479-bf7f-ea9e97971fc6",
      "label": "",
      "labelSize": 34,
      "labelBold": true,
      "labelAlign": "center",
      "labelVAlign": "middle",
      "labelPadding": "-23,0,0,0",
      "labelStroke": 10,
      "labelStrokeColor": "#f4c5c5"
    },
    {
      "_$id": "pbol1jrt",
      "_$type": "Button",
      "name": "Help",
      "x": 1038,
      "y": 226,
      "width": 106,
      "height": 110,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "scaleX": 1.5,
      "scaleY": 1.5,
      "stateNum": 1,
      "skin": "res://1f5282ee-8b2e-480b-a538-6f3e139789bf",
      "label": "",
      "labelSize": 34,
      "labelBold": true,
      "labelAlign": "center",
      "labelVAlign": "middle",
      "labelPadding": "-23,0,0,0",
      "labelStroke": 10,
      "labelStrokeColor": "#f4c5c5"
    },
    {
      "_$id": "9w8wfsge",
      "_$type": "Button",
      "name": "LevelUnlock",
      "x": 1036,
      "y": 417,
      "width": 199,
      "height": 176,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "scaleX": 1.5,
      "scaleY": 1.5,
      "stateNum": 1,
      "skin": "res://d2c11364-2b68-4ffa-b71f-6eb26bbf00fd",
      "label": "",
      "labelSize": 34,
      "labelBold": true,
      "labelAlign": "center",
      "labelVAlign": "middle",
      "labelStroke": 10,
      "labelStrokeColor": "#f4c5c5"
    },
    {
      "_$id": "9tybj84k",
      "_$var": true,
      "_$type": "Tab",
      "name": "item0Tab",
      "x": 281,
      "y": 552,
      "width": 259,
      "height": 119,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "_mouseState": 2,
      "zIndex": 1,
      "stateNum": null,
      "space": 25,
      "labelFont": null,
      "labelSize": 50,
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
          "visible": false,
          "_mouseState": 2,
          "stateNum": 1,
          "skin": "res://2469ac8f-7766-4278-aa2b-f249eacbc4b0",
          "sizeGrid": "12,12,12,12,0",
          "label": "序章",
          "labelFont": "SimHei",
          "labelSize": 50,
          "labelBold": true,
          "labelColors": "#000000,#ffffff,#faf8f8",
          "labelAlign": "center",
          "labelVAlign": "middle",
          "labelPadding": "0,0,6,0",
          "labelStroke": 5
        }
      ]
    },
    {
      "_$id": "dg1pjrl9",
      "_$var": true,
      "_$type": "ViewStack",
      "name": "levelstack",
      "x": 590,
      "y": 1131,
      "width": 904,
      "height": 1238,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "selectedIndex": 0,
      "_$child": [
        {
          "_$id": "eqv3eff9",
          "_$type": "Image",
          "name": "bg",
          "x": -74,
          "y": 9,
          "width": 1085,
          "height": 1407,
          "skin": "res://2469ac8f-7766-4278-aa2b-f249eacbc4b0",
          "color": "#ffffff"
        },
        {
          "_$id": "t3jshc16",
          "_$type": "Box",
          "name": "item0",
          "x": 21,
          "y": 121,
          "width": 873,
          "height": 1183,
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
              "repeatY": 2,
              "elasticEnabled": true,
              "spaceX": 28,
              "spaceY": 8,
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
                      "x": 80,
                      "y": 80,
                      "width": 129,
                      "height": 129,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "skin": "res://064de51e-36a5-4c99-aef3-c08569c781b5",
                      "color": "#ffffff"
                    },
                    {
                      "_$id": "nggbl3cx",
                      "_$type": "Label",
                      "name": "Number",
                      "x": 77,
                      "y": 80,
                      "width": 69,
                      "height": 60,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "centerX": 2,
                      "centerY": 5,
                      "text": "1",
                      "fontSize": 60,
                      "color": "#ffffff",
                      "align": "center",
                      "valign": "middle"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "_$id": "ogj5s1b4",
          "_$type": "Panel",
          "name": "Panel",
          "x": 14,
          "y": 441,
          "width": 888,
          "height": 870,
          "scrollType": 1,
          "elasticEnabled": true,
          "_$child": [
            {
              "_$id": "8e0upmlx",
              "_$type": "HBox",
              "name": "HBox",
              "x": 12,
              "y": 97,
              "width": 3494,
              "height": 365,
              "scaleX": 2,
              "scaleY": 2,
              "space": 213,
              "align": "middle",
              "_$child": [
                {
                  "_$id": "53p477au",
                  "_$type": "Sprite",
                  "name": "card_rock",
                  "y": 11,
                  "width": 224,
                  "height": 343,
                  "texture": {
                    "_$uuid": "e8043603-bd60-47dd-a3a3-87da018030d7",
                    "_$type": "Texture"
                  },
                  "_$child": [
                    {
                      "_$id": "pq0z5jyw",
                      "_$type": "Label",
                      "name": "cost",
                      "x": 119,
                      "y": 175,
                      "width": 41,
                      "height": 38,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "text": "2",
                      "font": "YuppySC-Regular",
                      "fontSize": 47,
                      "color": "#ffffff",
                      "bold": true,
                      "align": "center",
                      "valign": "middle",
                      "stroke": 7
                    },
                    {
                      "_$id": "hkezat8i",
                      "_$type": "Label",
                      "name": "level",
                      "x": 60,
                      "y": 41,
                      "width": 41,
                      "height": 38,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "text": "lv1\n",
                      "font": "YuppySC-Regular",
                      "fontSize": 47,
                      "color": "#ffffff",
                      "bold": true,
                      "align": "center",
                      "valign": "middle",
                      "stroke": 7
                    },
                    {
                      "_$id": "1x0w1o6k",
                      "_$type": "VBox",
                      "name": "VBox",
                      "x": 39,
                      "y": 224,
                      "width": 146,
                      "height": 78,
                      "centerX": 0,
                      "space": 0,
                      "align": "center",
                      "autoSizeMode": "height",
                      "_$child": [
                        {
                          "_$id": "o8se31se",
                          "_$type": "HBox",
                          "name": "HBox1",
                          "x": -3,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "mgs8osfm",
                              "_$type": "Image",
                              "name": "health",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://44187541-a2e0-4a0b-b10e-92de3ab22ecc",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "q0vk3eae",
                              "_$type": "Image",
                              "name": "health_1",
                              "x": 35,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://44187541-a2e0-4a0b-b10e-92de3ab22ecc",
                              "color": "#ffffff"
                            }
                          ]
                        },
                        {
                          "_$id": "56zjljf9",
                          "_$type": "HBox",
                          "name": "HBox1_1",
                          "x": -3,
                          "y": 26,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "dc663kpo",
                              "_$type": "Image",
                              "name": "attack",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://1b8df29b-179f-46aa-b65a-e566b8cf6c00",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "fz7ypuep",
                              "_$type": "Image",
                              "name": "attack_1",
                              "x": 35,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://1b8df29b-179f-46aa-b65a-e566b8cf6c00",
                              "color": "#ffffff"
                            }
                          ]
                        },
                        {
                          "_$id": "pf419ub7",
                          "_$type": "HBox",
                          "name": "HBox1_2",
                          "x": -3,
                          "y": 52,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "qqdjltn7",
                              "_$type": "Image",
                              "name": "speed",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://bf3e902f-c21a-4eb4-b2ed-3f5650d09dae",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "xct07hl8",
                              "_$type": "Image",
                              "name": "speed_1",
                              "x": 35,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://bf3e902f-c21a-4eb4-b2ed-3f5650d09dae",
                              "color": "#ffffff"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "_$id": "ujqd5c1s",
                      "_$type": "Label",
                      "name": "info",
                      "x": 228,
                      "y": 14,
                      "width": 200,
                      "height": 315,
                      "text": "石头人，石头人部落中勇猛善战的近战单位，各项数值均衡。升级后，血量与战斗力提升",
                      "font": "YuppySC-Regular",
                      "fontSize": 32,
                      "color": "#ffffff",
                      "wordWrap": true
                    }
                  ]
                },
                {
                  "_$id": "5tpypiqg",
                  "_$type": "Sprite",
                  "name": "card_wizard",
                  "x": 437,
                  "y": 11,
                  "width": 224,
                  "height": 343,
                  "texture": {
                    "_$uuid": "a992679f-55ff-44de-8e2b-d12fe2db507e",
                    "_$type": "Texture"
                  },
                  "_$child": [
                    {
                      "_$id": "5dmzebak",
                      "_$type": "Label",
                      "name": "cost",
                      "x": 119,
                      "y": 176,
                      "width": 41,
                      "height": 38,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "text": "2\n",
                      "font": "YuppySC-Regular",
                      "fontSize": 47,
                      "color": "#ffffff",
                      "bold": true,
                      "align": "center",
                      "valign": "middle",
                      "stroke": 7
                    },
                    {
                      "_$id": "ybpmhefo",
                      "_$type": "Label",
                      "name": "level",
                      "x": 68,
                      "y": 39,
                      "width": 69,
                      "height": 38,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "text": "lv1\n",
                      "font": "YuppySC-Regular",
                      "fontSize": 47,
                      "color": "#ffffff",
                      "bold": true,
                      "align": "center",
                      "valign": "middle",
                      "stroke": 7
                    },
                    {
                      "_$id": "yfljqzi9",
                      "_$type": "VBox",
                      "name": "VBox",
                      "x": 39,
                      "y": 227,
                      "width": 146,
                      "height": 78,
                      "centerX": 0,
                      "space": 0,
                      "align": "center",
                      "autoSizeMode": "height",
                      "_$child": [
                        {
                          "_$id": "eh0tdc3e",
                          "_$type": "HBox",
                          "name": "HBox1",
                          "x": -3,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "8sd3fk2z",
                              "_$type": "Image",
                              "name": "health",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://44187541-a2e0-4a0b-b10e-92de3ab22ecc",
                              "color": "#ffffff"
                            }
                          ]
                        },
                        {
                          "_$id": "qb68sru5",
                          "_$type": "HBox",
                          "name": "HBox1_1",
                          "x": -3,
                          "y": 26,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "liznd9tw",
                              "_$type": "Image",
                              "name": "attack",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://179a50cf-365e-4659-a0b8-76ebfd3c19d7",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "yiq7dgu3",
                              "_$type": "Image",
                              "name": "attack_1",
                              "x": 35,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://179a50cf-365e-4659-a0b8-76ebfd3c19d7",
                              "color": "#ffffff"
                            }
                          ]
                        },
                        {
                          "_$id": "c4c3tviv",
                          "_$type": "HBox",
                          "name": "HBox1_2",
                          "x": -3,
                          "y": 52,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "s9qba9ld",
                              "_$type": "Image",
                              "name": "speed",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://bf3e902f-c21a-4eb4-b2ed-3f5650d09dae",
                              "color": "#ffffff"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "_$id": "60bkxprw",
                      "_$type": "Label",
                      "name": "info",
                      "x": 229,
                      "y": 14,
                      "width": 200,
                      "height": 315,
                      "text": "巫师，远程攻击单位，虽然血量低，单能够在远距离消灭敌人。升级后，血量与战斗力提升",
                      "font": "YuppySC-Regular",
                      "fontSize": 32,
                      "color": "#ffffff",
                      "wordWrap": true
                    }
                  ]
                },
                {
                  "_$id": "q0ib5er9",
                  "_$type": "Sprite",
                  "name": "card_pastor",
                  "x": 874,
                  "y": 11,
                  "width": 224,
                  "height": 343,
                  "texture": {
                    "_$uuid": "e39f1e8b-cd71-4c1b-a9ba-9f20bf326ed1",
                    "_$type": "Texture"
                  },
                  "_$child": [
                    {
                      "_$id": "9uzqddiu",
                      "_$type": "Label",
                      "name": "cost",
                      "x": 118,
                      "y": 177,
                      "width": 41,
                      "height": 38,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "text": "2",
                      "font": "YuppySC-Regular",
                      "fontSize": 47,
                      "color": "#ffffff",
                      "bold": true,
                      "align": "center",
                      "valign": "middle",
                      "stroke": 7
                    },
                    {
                      "_$id": "eliewtp5",
                      "_$type": "Label",
                      "name": "level",
                      "x": 62,
                      "y": 38,
                      "width": 55,
                      "height": 38,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "text": "lv1\n",
                      "font": "YuppySC-Regular",
                      "fontSize": 47,
                      "color": "#ffffff",
                      "bold": true,
                      "align": "center",
                      "valign": "middle",
                      "stroke": 7
                    },
                    {
                      "_$id": "ylu4vmsi",
                      "_$type": "VBox",
                      "name": "VBox",
                      "x": 39,
                      "y": 228,
                      "width": 146,
                      "height": 78,
                      "centerX": 0,
                      "space": 0,
                      "align": "center",
                      "autoSizeMode": "height",
                      "_$child": [
                        {
                          "_$id": "mpbkuqmf",
                          "_$type": "HBox",
                          "name": "HBox1",
                          "x": -3,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "6hildnj4",
                              "_$type": "Image",
                              "name": "health",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://44187541-a2e0-4a0b-b10e-92de3ab22ecc",
                              "color": "#ffffff"
                            }
                          ]
                        },
                        {
                          "_$id": "m7wl2aq5",
                          "_$type": "HBox",
                          "name": "HBox1_1",
                          "x": -3,
                          "y": 26,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "dfydpoju",
                              "_$type": "Image",
                              "name": "recover",
                              "y": -2,
                              "width": 31,
                              "height": 31,
                              "skin": "res://fe49e003-fbe3-4346-bf62-2789cb8310b1",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "1i85zl81",
                              "_$type": "Image",
                              "name": "recover_1",
                              "x": 36,
                              "y": -2,
                              "width": 31,
                              "height": 31,
                              "skin": "res://fe49e003-fbe3-4346-bf62-2789cb8310b1",
                              "color": "#ffffff"
                            }
                          ]
                        },
                        {
                          "_$id": "9v7wlb18",
                          "_$type": "HBox",
                          "name": "HBox1_2",
                          "x": -3,
                          "y": 52,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "iq11qdh9",
                              "_$type": "Image",
                              "name": "speed",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://bf3e902f-c21a-4eb4-b2ed-3f5650d09dae",
                              "color": "#ffffff"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "_$id": "uiipo4ba",
                      "_$type": "Label",
                      "name": "info_1",
                      "x": 222,
                      "y": 17,
                      "width": 200,
                      "height": 315,
                      "text": "牧师，治疗单位，可治疗场上我方2名受伤单位，每升一级，同时治疗的单位数和治疗量增加",
                      "font": "YuppySC-Regular",
                      "fontSize": 32,
                      "color": "#ffffff",
                      "wordWrap": true
                    },
                    {
                      "_$id": "3smdw9ub",
                      "_$prefab": "2f827888-2c31-48fb-a594-d31c8130158e",
                      "name": "cure",
                      "active": true,
                      "x": 24,
                      "y": 134,
                      "visible": true
                    }
                  ]
                },
                {
                  "_$id": "0kntpcnv",
                  "_$type": "Sprite",
                  "name": "card_zombie",
                  "x": 1311,
                  "y": 11,
                  "width": 224,
                  "height": 343,
                  "texture": {
                    "_$uuid": "a34613ed-f17f-4170-bdd1-90e7966a919d",
                    "_$type": "Texture"
                  },
                  "_$child": [
                    {
                      "_$id": "s99vhwxl",
                      "_$type": "Label",
                      "name": "cost",
                      "x": 119,
                      "y": 176,
                      "width": 41,
                      "height": 38,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "text": "2",
                      "font": "YuppySC-Regular",
                      "fontSize": 47,
                      "color": "#ffffff",
                      "bold": true,
                      "align": "center",
                      "valign": "middle",
                      "stroke": 7
                    },
                    {
                      "_$id": "ux9sxes5",
                      "_$type": "Label",
                      "name": "level",
                      "x": 68,
                      "y": 39,
                      "width": 69,
                      "height": 38,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "text": "lv1\n",
                      "font": "YuppySC-Regular",
                      "fontSize": 47,
                      "color": "#ffffff",
                      "bold": true,
                      "align": "center",
                      "valign": "middle",
                      "stroke": 7
                    },
                    {
                      "_$id": "p5sxv51w",
                      "_$type": "VBox",
                      "name": "VBox",
                      "x": 39,
                      "y": 227,
                      "width": 146,
                      "height": 78,
                      "centerX": 0,
                      "space": 0,
                      "align": "center",
                      "autoSizeMode": "height",
                      "_$child": [
                        {
                          "_$id": "ees85nhx",
                          "_$type": "HBox",
                          "name": "HBox1",
                          "x": -3,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "2jqliaaw",
                              "_$type": "Image",
                              "name": "health",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://44187541-a2e0-4a0b-b10e-92de3ab22ecc",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "b3ff44d0",
                              "_$type": "Image",
                              "name": "health_1",
                              "x": 35,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://44187541-a2e0-4a0b-b10e-92de3ab22ecc",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "umaureyj",
                              "_$type": "Image",
                              "name": "health_2",
                              "x": 70,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://44187541-a2e0-4a0b-b10e-92de3ab22ecc",
                              "color": "#ffffff"
                            }
                          ]
                        },
                        {
                          "_$id": "cf9uzeby",
                          "_$type": "HBox",
                          "name": "HBox1_1",
                          "x": -3,
                          "y": 26,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "uy19yrzd",
                              "_$type": "Image",
                              "name": "attack",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://1b8df29b-179f-46aa-b65a-e566b8cf6c00",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "yhw3e45f",
                              "_$type": "Image",
                              "name": "attack_1",
                              "x": 35,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "alpha": 0.5,
                              "skin": "res://1b8df29b-179f-46aa-b65a-e566b8cf6c00",
                              "color": "#ffffff"
                            }
                          ]
                        },
                        {
                          "_$id": "6krkz3ae",
                          "_$type": "HBox",
                          "name": "HBox1_2",
                          "x": -3,
                          "y": 52,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "3ws0an0q",
                              "_$type": "Image",
                              "name": "speed",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://bf3e902f-c21a-4eb4-b2ed-3f5650d09dae",
                              "color": "#ffffff"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "_$id": "6awv2ivt",
                      "_$type": "Label",
                      "name": "info",
                      "x": 233,
                      "y": 13,
                      "width": 200,
                      "height": 315,
                      "text": "僵尸，移动速度缓慢但血量更高。击杀敌人后可产生感染效果，敌人转化为一只我低血量方僵尸。升级后会提升血量和攻击力",
                      "font": "YuppySC-Regular",
                      "fontSize": 26,
                      "color": "#ffffff",
                      "wordWrap": true
                    },
                    {
                      "_$id": "il666vlh",
                      "_$type": "Image",
                      "name": "infect",
                      "x": 31,
                      "y": 144,
                      "width": 44,
                      "height": 44,
                      "skin": "res://4743c033-1835-49e0-b04d-bbb302da24ef",
                      "color": "#ffffff"
                    }
                  ]
                },
                {
                  "_$id": "z1lrsxxv",
                  "_$type": "Sprite",
                  "name": "card_goblin",
                  "x": 1748,
                  "y": 11,
                  "width": 224,
                  "height": 343,
                  "texture": {
                    "_$uuid": "074df2fe-bd6b-44c3-bfb0-4aa44ba47c6f",
                    "_$type": "Texture"
                  },
                  "_$child": [
                    {
                      "_$id": "p1vg3cyt",
                      "_$type": "Label",
                      "name": "cost",
                      "x": 119,
                      "y": 176,
                      "width": 41,
                      "height": 38,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "text": "1",
                      "font": "YuppySC-Regular",
                      "fontSize": 47,
                      "color": "#ffffff",
                      "bold": true,
                      "align": "center",
                      "valign": "middle",
                      "stroke": 7
                    },
                    {
                      "_$id": "q0sb2scz",
                      "_$type": "Label",
                      "name": "level",
                      "x": 68,
                      "y": 39,
                      "width": 69,
                      "height": 38,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "text": "lv1\n",
                      "font": "YuppySC-Regular",
                      "fontSize": 47,
                      "color": "#ffffff",
                      "bold": true,
                      "align": "center",
                      "valign": "middle",
                      "stroke": 7
                    },
                    {
                      "_$id": "v0bjqui4",
                      "_$type": "VBox",
                      "name": "VBox",
                      "x": 39,
                      "y": 227,
                      "width": 146,
                      "height": 78,
                      "centerX": 0,
                      "space": 0,
                      "align": "center",
                      "autoSizeMode": "height",
                      "_$child": [
                        {
                          "_$id": "0cl6vqt2",
                          "_$type": "HBox",
                          "name": "HBox1",
                          "x": -3,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "45vcb7c1",
                              "_$type": "Image",
                              "name": "health",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://44187541-a2e0-4a0b-b10e-92de3ab22ecc",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "8od572qm",
                              "_$type": "Image",
                              "name": "health_1",
                              "x": 35,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "alpha": 0.5,
                              "skin": "res://44187541-a2e0-4a0b-b10e-92de3ab22ecc",
                              "color": "#ffffff"
                            }
                          ]
                        },
                        {
                          "_$id": "ynxidn4w",
                          "_$type": "HBox",
                          "name": "HBox1_1",
                          "x": -3,
                          "y": 26,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "8v9d4id4",
                              "_$type": "Image",
                              "name": "attack",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://1b8df29b-179f-46aa-b65a-e566b8cf6c00",
                              "color": "#ffffff"
                            }
                          ]
                        },
                        {
                          "_$id": "w4ul7v0f",
                          "_$type": "HBox",
                          "name": "HBox1_2",
                          "x": -3,
                          "y": 52,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "8o75cp7w",
                              "_$type": "Image",
                              "name": "speed",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://bf3e902f-c21a-4eb4-b2ed-3f5650d09dae",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "1bkdsrui",
                              "_$type": "Image",
                              "name": "speed_1",
                              "x": 35,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://bf3e902f-c21a-4eb4-b2ed-3f5650d09dae",
                              "color": "#ffffff"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "_$id": "0zxnwlik",
                      "_$type": "Label",
                      "name": "info_2",
                      "x": 227,
                      "y": 15,
                      "width": 200,
                      "height": 315,
                      "text": "哥布林，高性价比近战单位，适合集体作战，升级后会提升血量和攻击力",
                      "font": "YuppySC-Regular",
                      "fontSize": 32,
                      "color": "#ffffff",
                      "wordWrap": true
                    }
                  ]
                },
                {
                  "_$id": "loy04izq",
                  "_$type": "Sprite",
                  "name": "card_skeleton",
                  "x": 2185,
                  "y": 11,
                  "width": 224,
                  "height": 343,
                  "texture": {
                    "_$uuid": "4be09639-068e-46be-9b08-83eb481fdece",
                    "_$type": "Texture"
                  },
                  "_$child": [
                    {
                      "_$id": "t1iladex",
                      "_$type": "Label",
                      "name": "cost",
                      "x": 119,
                      "y": 176,
                      "width": 41,
                      "height": 38,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "text": "3\n",
                      "font": "YuppySC-Regular",
                      "fontSize": 47,
                      "color": "#ffffff",
                      "bold": true,
                      "align": "center",
                      "valign": "middle",
                      "stroke": 7
                    },
                    {
                      "_$id": "48zh3n32",
                      "_$type": "Label",
                      "name": "level",
                      "x": 68,
                      "y": 39,
                      "width": 69,
                      "height": 38,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "text": "lv1\n",
                      "font": "YuppySC-Regular",
                      "fontSize": 47,
                      "color": "#ffffff",
                      "bold": true,
                      "align": "center",
                      "valign": "middle",
                      "stroke": 7
                    },
                    {
                      "_$id": "icy7n5qb",
                      "_$type": "VBox",
                      "name": "VBox",
                      "x": 39,
                      "y": 227,
                      "width": 146,
                      "height": 78,
                      "centerX": 0,
                      "space": 0,
                      "align": "center",
                      "autoSizeMode": "height",
                      "_$child": [
                        {
                          "_$id": "11umyaeq",
                          "_$type": "HBox",
                          "name": "HBox1",
                          "x": -3,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "u2qgh8v2",
                              "_$type": "Image",
                              "name": "health",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://44187541-a2e0-4a0b-b10e-92de3ab22ecc",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "fdy20z8h",
                              "_$type": "Image",
                              "name": "health_1",
                              "x": 35,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://44187541-a2e0-4a0b-b10e-92de3ab22ecc",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "xh6u1dcu",
                              "_$type": "Image",
                              "name": "health_2",
                              "x": 70,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "alpha": 0.5,
                              "skin": "res://44187541-a2e0-4a0b-b10e-92de3ab22ecc",
                              "color": "#ffffff"
                            }
                          ]
                        },
                        {
                          "_$id": "c18xqzek",
                          "_$type": "HBox",
                          "name": "HBox1_1",
                          "x": -3,
                          "y": 26,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "9ob1k55t",
                              "_$type": "Image",
                              "name": "attack",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://1b8df29b-179f-46aa-b65a-e566b8cf6c00",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "79jwq1vy",
                              "_$type": "Image",
                              "name": "attack_1",
                              "x": 35,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://1b8df29b-179f-46aa-b65a-e566b8cf6c00",
                              "color": "#ffffff"
                            }
                          ]
                        },
                        {
                          "_$id": "2r13449g",
                          "_$type": "HBox",
                          "name": "HBox1_2",
                          "x": -3,
                          "y": 52,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "kqrac4a4",
                              "_$type": "Image",
                              "name": "speed",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://bf3e902f-c21a-4eb4-b2ed-3f5650d09dae",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "2lrm05sj",
                              "_$type": "Image",
                              "name": "speed_1",
                              "x": 35,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://bf3e902f-c21a-4eb4-b2ed-3f5650d09dae",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "9fz2601p",
                              "_$type": "Image",
                              "name": "speed_2",
                              "x": 70,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://bf3e902f-c21a-4eb4-b2ed-3f5650d09dae",
                              "color": "#ffffff"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "_$id": "8m3zx6hd",
                      "_$type": "Label",
                      "name": "info",
                      "x": 226,
                      "y": 19,
                      "width": 200,
                      "height": 315,
                      "text": "牛头人，近战单位。以极高的移动速度攻击速度快速突入并刺穿敌人的阵线。升级后，会提升血量和攻击力",
                      "font": "YuppySC-Regular",
                      "fontSize": 32,
                      "color": "#ffffff",
                      "wordWrap": true
                    }
                  ]
                },
                {
                  "_$id": "ojzuccxf",
                  "_$type": "Sprite",
                  "name": "card_necromance",
                  "x": 2622,
                  "y": 11,
                  "width": 224,
                  "height": 343,
                  "texture": {
                    "_$uuid": "5eb91d72-ac43-4100-a92e-a39fe4b4f27c",
                    "_$type": "Texture"
                  },
                  "_$child": [
                    {
                      "_$id": "ribg3vzk",
                      "_$type": "Label",
                      "name": "cost",
                      "x": 119,
                      "y": 176,
                      "width": 41,
                      "height": 38,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "text": "3",
                      "font": "YuppySC-Regular",
                      "fontSize": 47,
                      "color": "#ffffff",
                      "bold": true,
                      "align": "center",
                      "valign": "middle",
                      "stroke": 7
                    },
                    {
                      "_$id": "j4xig151",
                      "_$type": "Label",
                      "name": "level",
                      "x": 68,
                      "y": 39,
                      "width": 69,
                      "height": 38,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "text": "lv1\n",
                      "font": "YuppySC-Regular",
                      "fontSize": 47,
                      "color": "#ffffff",
                      "bold": true,
                      "align": "center",
                      "valign": "middle",
                      "stroke": 7
                    },
                    {
                      "_$id": "gx3u7ag3",
                      "_$type": "VBox",
                      "name": "VBox",
                      "x": 39,
                      "y": 227,
                      "width": 146,
                      "height": 78,
                      "centerX": 0,
                      "space": 0,
                      "align": "center",
                      "autoSizeMode": "height",
                      "_$child": [
                        {
                          "_$id": "mpiisym0",
                          "_$type": "HBox",
                          "name": "HBox1",
                          "x": -3,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "2ksqheys",
                              "_$type": "Image",
                              "name": "health",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://44187541-a2e0-4a0b-b10e-92de3ab22ecc",
                              "color": "#ffffff"
                            }
                          ]
                        },
                        {
                          "_$id": "k9t0tn9x",
                          "_$type": "HBox",
                          "name": "HBox1_1",
                          "x": -3,
                          "y": 26,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "u6jinbti",
                              "_$type": "Image",
                              "name": "attack",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://179a50cf-365e-4659-a0b8-76ebfd3c19d7",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "vfs9hzdf",
                              "_$type": "Image",
                              "name": "attack_1",
                              "x": 35,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://179a50cf-365e-4659-a0b8-76ebfd3c19d7",
                              "color": "#ffffff"
                            }
                          ]
                        },
                        {
                          "_$id": "nelip3g1",
                          "_$type": "HBox",
                          "name": "HBox1_2",
                          "x": -3,
                          "y": 52,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "lgtis6wo",
                              "_$type": "Image",
                              "name": "speed",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://bf3e902f-c21a-4eb4-b2ed-3f5650d09dae",
                              "color": "#ffffff"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "_$id": "cvin8czm",
                      "_$type": "Label",
                      "name": "info_1",
                      "x": 225,
                      "y": 18,
                      "width": 200,
                      "height": 315,
                      "text": "通灵师，远程攻击单位.血量较低，但是可以远距离对敌人发起攻击，敌人被攻击后会被施加冻结效果，短时间内无法行动。升级后可提升血量和攻击力",
                      "font": "YuppySC-Regular",
                      "fontSize": 24,
                      "color": "#ffffff",
                      "wordWrap": true
                    },
                    {
                      "_$id": "y0wjrdh1",
                      "_$type": "Image",
                      "name": "freeze",
                      "x": 21,
                      "y": 141,
                      "width": 56,
                      "height": 56,
                      "skin": "res://29bb98cd-8f72-4d6b-9cfe-c862048a3efa",
                      "color": "#ffffff"
                    }
                  ]
                },
                {
                  "_$id": "kftdemap",
                  "_$type": "Sprite",
                  "name": "card_troll",
                  "x": 3059,
                  "y": 11,
                  "width": 224,
                  "height": 343,
                  "texture": {
                    "_$uuid": "9aa16aa5-9322-4554-a583-740df594400f",
                    "_$type": "Texture"
                  },
                  "_$child": [
                    {
                      "_$id": "e8y0gpfm",
                      "_$type": "Label",
                      "name": "cost",
                      "x": 119,
                      "y": 176,
                      "width": 41,
                      "height": 38,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "text": "4",
                      "font": "YuppySC-Regular",
                      "fontSize": 47,
                      "color": "#ffffff",
                      "bold": true,
                      "align": "center",
                      "valign": "middle",
                      "stroke": 7
                    },
                    {
                      "_$id": "lk6kkp2m",
                      "_$type": "Label",
                      "name": "level",
                      "x": 68,
                      "y": 39,
                      "width": 69,
                      "height": 38,
                      "anchorX": 0.5,
                      "anchorY": 0.5,
                      "text": "lv1\n",
                      "font": "YuppySC-Regular",
                      "fontSize": 47,
                      "color": "#ffffff",
                      "bold": true,
                      "align": "center",
                      "valign": "middle",
                      "stroke": 7
                    },
                    {
                      "_$id": "d7wx0rip",
                      "_$type": "VBox",
                      "name": "VBox",
                      "x": 39,
                      "y": 227,
                      "width": 146,
                      "height": 78,
                      "centerX": 0,
                      "space": 0,
                      "align": "center",
                      "autoSizeMode": "height",
                      "_$child": [
                        {
                          "_$id": "qja6zaob",
                          "_$type": "HBox",
                          "name": "HBox1",
                          "x": -3,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "0um8yy6t",
                              "_$type": "Image",
                              "name": "health",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://44187541-a2e0-4a0b-b10e-92de3ab22ecc",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "i76z53vm",
                              "_$type": "Image",
                              "name": "health_1",
                              "x": 35,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://44187541-a2e0-4a0b-b10e-92de3ab22ecc",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "46e2e9or",
                              "_$type": "Image",
                              "name": "health_2",
                              "x": 70,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://44187541-a2e0-4a0b-b10e-92de3ab22ecc",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "j824jtth",
                              "_$type": "Image",
                              "name": "health_3",
                              "x": 105,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://44187541-a2e0-4a0b-b10e-92de3ab22ecc",
                              "color": "#ffffff"
                            }
                          ]
                        },
                        {
                          "_$id": "yyuf5ln3",
                          "_$type": "HBox",
                          "name": "HBox1_1",
                          "x": -3,
                          "y": 26,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "pgqkbzcg",
                              "_$type": "Image",
                              "name": "attack",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://1b8df29b-179f-46aa-b65a-e566b8cf6c00",
                              "color": "#ffffff"
                            },
                            {
                              "_$id": "ggzxlslk",
                              "_$type": "Image",
                              "name": "attack_1",
                              "x": 35,
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://1b8df29b-179f-46aa-b65a-e566b8cf6c00",
                              "color": "#ffffff"
                            }
                          ]
                        },
                        {
                          "_$id": "k0qyb5d0",
                          "_$type": "HBox",
                          "name": "HBox1_2",
                          "x": -3,
                          "y": 52,
                          "width": 153,
                          "height": 26,
                          "space": 5,
                          "align": "middle",
                          "_$child": [
                            {
                              "_$id": "e9ejs86w",
                              "_$type": "Image",
                              "name": "speed",
                              "y": -2,
                              "width": 30,
                              "height": 30,
                              "skin": "res://bf3e902f-c21a-4eb4-b2ed-3f5650d09dae",
                              "color": "#ffffff"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "_$id": "t9fc43m9",
                      "_$type": "Label",
                      "name": "info_2",
                      "x": 228,
                      "y": 13,
                      "width": 200,
                      "height": 315,
                      "text": "巨魔，高攻击近战单位，尽管攻击速度较慢，但一次攻击足以击败敌方远程单位。血量极高，但移动速度缓慢。升级后，会提升血量与攻击力。",
                      "font": "YuppySC-Regular",
                      "fontSize": 28,
                      "color": "#ffffff",
                      "wordWrap": true
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "_$id": "qgxjsdb6",
          "_$type": "Label",
          "name": "Label",
          "x": 64,
          "y": 460,
          "width": 777,
          "height": 108,
          "centerX": 0,
          "text": "卡牌图鉴→滑动以查看",
          "font": "YuppySC-Regular",
          "fontSize": 77,
          "color": "#ffffff"
        }
      ]
    },
    {
      "_$id": "4fcvk6rd",
      "_$type": "Box",
      "name": "HelpPanel",
      "x": 578,
      "y": 1165,
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
            "_$ref": "g8k6eps7"
          }
        }
      ],
      "_$child": [
        {
          "_$id": "08npk86j",
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
          "_$id": "8za1a923",
          "_$type": "Panel",
          "name": "Panel",
          "x": 119,
          "y": 127,
          "width": 883,
          "height": 939,
          "zIndex": 1,
          "centerY": -24,
          "scrollType": 2,
          "elasticEnabled": true,
          "_$child": [
            {
              "_$id": "l11m7ep6",
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
              "_$id": "6gb6g0ky",
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
              "_$id": "j0aa461y",
              "_$type": "Image",
              "name": "intro2",
              "x": 70,
              "y": 947,
              "width": 761,
              "height": 1113,
              "skin": "res://318a1d59-14c0-4f59-9691-ac5c68a46147",
              "color": "#ffffff"
            },
            {
              "_$id": "2j5b0m87",
              "_$type": "Image",
              "name": "intro3",
              "x": 79,
              "y": 1860,
              "width": 742,
              "height": 1128,
              "skin": "res://2596af97-7c37-4145-aaff-ba9b35b0cf2f",
              "color": "#ffffff"
            },
            {
              "_$id": "0nf00shb",
              "_$type": "Image",
              "name": "intro4",
              "x": 73,
              "y": 2986,
              "width": 745,
              "height": 1456,
              "skin": "res://2c219897-b7b4-4482-9911-aedf8f8287a8",
              "color": "#ffffff"
            },
            {
              "_$id": "4t8nl9no",
              "_$type": "Image",
              "name": "intro5",
              "x": 68,
              "y": 4317,
              "width": 767,
              "height": 634,
              "skin": "res://b99632bb-465a-4631-8c35-082300bb32b1",
              "color": "#ffffff"
            }
          ]
        },
        {
          "_$id": "g8k6eps7",
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
      "_$id": "pizm94pp",
      "_$type": "Box",
      "name": "LevelLockPanel",
      "x": 578,
      "y": 1082,
      "width": 1153,
      "height": 1241,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "visible": false,
      "centerX": -12,
      "_$comp": [
        {
          "_$type": "37302a9b-4493-423b-aba0-d60fd55a00d9",
          "scriptPath": "../src/UI/LevelLockPanel.ts",
          "unlockAllLevels": {
            "_$ref": "ewxhpeko"
          },
          "completeLevels": {
            "_$ref": "qbebeubd"
          },
          "yesButton": {
            "_$ref": "c2vqwszn"
          },
          "closeButton": {
            "_$ref": "l2g5ngyw"
          }
        }
      ],
      "_$child": [
        {
          "_$id": "wtfycnny",
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
          "color": "#ffffff",
          "_$child": [
            {
              "_$id": "ewxhpeko",
              "_$type": "Image",
              "name": "unlockAllLevels",
              "x": 583,
              "y": 605,
              "width": 938,
              "height": 758,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "visible": false,
              "centerX": 12,
              "centerY": 13,
              "skin": "res://216f22ab-98b8-4ac1-9ce9-3ede87632b61",
              "color": "#ffffff",
              "_$child": [
                {
                  "_$id": "mjr1fobn",
                  "_$type": "Label",
                  "name": "Label",
                  "x": 165,
                  "y": 72,
                  "width": 609,
                  "height": 351,
                  "text": "如果直接解锁所有关卡，会失去一些挑战游戏的乐趣，确定要直接解锁所有关卡吗？",
                  "font": "YuppyTC-Regular",
                  "fontSize": 52,
                  "color": "#f7f7f7",
                  "bold": true,
                  "align": "center",
                  "valign": "middle",
                  "wordWrap": true,
                  "leading": 27,
                  "underlineColor": "#39e5e5",
                  "stroke": 19
                },
                {
                  "_$id": "c2vqwszn",
                  "_$type": "Button",
                  "name": "yes",
                  "x": 430,
                  "y": 531,
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
                }
              ]
            },
            {
              "_$id": "qbebeubd",
              "_$type": "Image",
              "name": "completedLevels",
              "x": 571,
              "y": 667,
              "width": 952,
              "height": 686,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "visible": false,
              "centerX": 0,
              "centerY": 75,
              "skin": "res://d466cf6b-8a38-4d9f-b823-17b4aa5203e0",
              "color": "#ffffff",
              "_$child": [
                {
                  "_$id": "s4qpua5h",
                  "_$type": "Label",
                  "name": "Label",
                  "x": 71,
                  "y": -199,
                  "width": 811,
                  "height": 188,
                  "text": "你完成了所有关卡！\n石头人赶走了侵略者！",
                  "font": "YuppyTC-Regular",
                  "fontSize": 64,
                  "color": "#f7f7f7",
                  "bold": true,
                  "align": "center",
                  "valign": "middle",
                  "wordWrap": true,
                  "leading": 27,
                  "underlineColor": "#39e5e5",
                  "stroke": 19
                }
              ]
            }
          ]
        },
        {
          "_$id": "l2g5ngyw",
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
    }
  ]
}