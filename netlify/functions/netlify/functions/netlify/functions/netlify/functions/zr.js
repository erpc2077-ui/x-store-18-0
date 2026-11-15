Updates parcel state

---
updatedAt: 2025-11-08T11:54:14.000Z
agentTools:
  projectIndex: https://docs.zrexpress.app/llms.txt
---

# Updates parcel state

Updates parcel state. Permissions requises : HubParcelsManagerRole, HubAdminRole, SupplierAdminRole, SupplierParcelsManagerRole.

***

**Permissions required:**  `SupplierParcelsManagerRole`, `SupplierAdminRole`.

***

> ## Path Params

| Name     | Type   | Required | Description                               |
| -------- | ------ | -------- | ----------------------------------------- |
| version  | string | yes      | Defaults to 1. The requested API version. |
| parcelId | uuid   | yes      | The unique identifier of the parcel.      |

> ## Headers

| Name      | Type   | Required | Description                                                                                                                      |
| :-------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------------------- |
| X-Tenant  | string | Yes      | Tenant ID required to access this API.                                                                                           |
| X-Api-Key | string | Yes      | API key required for authentication. To see how to get it, check this [guide](https://docs.zrexpress.app/docs/authentication#/). |

> ## Body Params

| Name             | Type   | Description                                                                                                         |
| ---------------- | ------ | ------------------------------------------------------------------------------------------------------------------- |
| parcelId         | uuid   | Must match the path parameter. Identifies the parcel to update.                                                     |
| newStateId       | uuid   | The ID of the new state to assign to the parcel.                                                                    |
| deliveryPersonId | uuid   | Optional. Required when the new state is `OnDelivery` or `OutForDelivery`. Identifies the assigned delivery person. |
| arrivalHubId     | uuid   | Optional. Required when dispatching a parcel. Must match the hub of the parcel's current location.                  |
| comment          | string | Optional. A note or comment about this state change, e.g., reason for delay or special handling.                    |

> **Note:** Every state update creates an entry in the parcel history, recording the previous state, the new state, and associated metadata such as location or arrival hub.
>
> ## Request Example

```bash
curl -X 'POST' \
  'https://api.zrexpress.app/api/v1.0/parcels/40ff9e7c-a4e8-4cb7-9a07-1d3e8df77027/state' \
  -H 'accept: application/json' \
  -H 'X-Tenant: YOUR-TENANT-ID' \
  -H 'X-Api-Key: YOUR-API-KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "parcelId": "40ff9e7c-a4e8-4cb7-9a07-1d3e8df77027",
    "newStateId": "8a948c66-1ab7-4433-aeb0-94219125d134",
    "comment": ""
  }'
```

> ## Response

If the parcel state is successfully updated, you will receive a **200 OK** response containing the updated parcel information.

#### Status `200 OK` Response Body

| Name           | Type   | Description                             |
| -------------- | ------ | --------------------------------------- |
| parcelId       | uuid   | The unique identifier of the parcel.    |
| newStateId     | uuid   | The unique identifier of the new state. |
| newStateName   | string | The name of the new state (nullable).   |
| trackingNumber | string | The parcel tracking number (nullable).  |

#### Example Response

```json
{
    "parcelId": "40ff9e7c-a4e8-4cb7-9a07-1d3e8df77027",
    "newStateId": "8a948c66-1ab7-4433-aeb0-94219125d134",
    "newStateName": "pret_a_expedier",
    "trackingNumber": "13-eujcONdAIbV-DZ"
}
```

> If the requested parcel state or delivery person does not exist, the API will return a `404 Not Found` error.

**Parcel State Not Found Example**

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "ParcelStates.NotFound",
  "status": 404,
  "detail": "The order state with the identifier 3fa85f64-5717-4562-b3fc-2c963f66afa6 was not found",
  "traceId": "00-4f0e1f0cb059dda2505132eac53b3c92-fce41aa044333ded-01"
}
```

**Delivery Person Not Found Example**

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "DeliveryPersonErrors.PersonDeliveryNotFound",
  "status": 404,
  "detail": "A Delivery Person doesn't exist with 3fa85f64-5717-4562-b3fc-2c963f66afa6.",
  "traceId": "00-ae2bb4d5dcfd6005224c262c96c2e290-8294786ebe454d05-01"
}
```

# OpenAPI definition

```json
{
  "openapi": "3.0.4",
  "info": {
    "title": "ZRExpress.Api",
    "description": "",
    "contact": {
      "name": "ZRExpress",
      "email": "support@zrexpress.net"
    },
    "version": "1"
  },
  "servers": [
    {
      "url": "https://api.zrexpress.app"
    }
  ],
  "paths": {
    "/api/v{version}/parcels/{parcelId}/state": {
      "patch": {
        "tags": [
          "orders"
        ],
        "summary": "Updates parcel state",
        "description": "Updates parcel state. Permissions requises : HubParcelsManagerRole, HubAdminRole, SupplierAdminRole, SupplierParcelsManagerRole.",
        "operationId": "UpdateParcelStateEndpoint",
        "parameters": [
          {
            "name": "version",
            "in": "path",
            "description": "The requested API version",
            "required": true,
            "schema": {
              "type": "string",
              "default": "1"
            }
          },
          {
            "name": "parcelId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "X-Tenant",
            "in": "header",
            "description": "Input your tenant Id to access this API",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateParcelStateRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateParcelStateResponse"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "UpdateParcelStateRequest": {
        "type": "object",
        "properties": {
          "parcelId": {
            "type": "string",
            "format": "uuid"
          },
          "newStateId": {
            "type": "string",
            "format": "uuid"
          },
          "deliveryPersonId": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "arrivalHubId": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "comment": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "UpdateParcelStateResponse": {
        "type": "object",
        "properties": {
          "parcelId": {
            "type": "string",
            "format": "uuid"
          },
          "newStateId": {
            "type": "string",
            "format": "uuid"
          },
          "newStateName": {
            "type": "string",
            "nullable": true
          },
          "trackingNumber": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      }
    },
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "description": "Enter your token in the text input below.\r\n\r\nExample: \"ejlklm533123\" without Bearer prefix",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      },
      "apiKey": {
        "type": "apiKey",
        "description": "API Key Authentication\r\n\r\nEnter your API key in the format: \"X-Api-Key: your-api-key\"",
        "name": "X-Api-Key",
        "in": "header"
      }
    }
  },
  "security": [
    {
      "bearerAuth": [],
      "apiKey": []
    }
  ]
}
```
