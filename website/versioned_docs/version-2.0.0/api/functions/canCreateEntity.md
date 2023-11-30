---
id: "canCreateEntity"
title: "Function: canCreateEntity"
sidebar_label: "canCreateEntity"
sidebar_position: 0
custom_edit_url: null
---

▸ **canCreateEntity**\<`M`, `UserType`\>(`collection`, `authController`, `paths`, `entity`): `boolean`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | extends `Record`\<`string`, `any`\> |
| `UserType` | extends [`User`](../types/User.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `collection` | [`EntityCollection`](../interfaces/EntityCollection.md)\<`M`, `string`, [`User`](../types/User.md)\> |
| `authController` | [`AuthController`](../types/AuthController.md)\<`UserType`\> |
| `paths` | `string`[] |
| `entity` | ``null`` \| [`Entity`](../interfaces/Entity.md)\<`M`\> |

#### Returns

`boolean`

#### Defined in

[packages/firecms_core/src/core/util/permissions.ts:43](https://github.com/FireCMSco/firecms/blob/d45f3739/packages/firecms_core/src/core/util/permissions.ts#L43)
