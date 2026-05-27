# PWA API Documentation

**Base URL:** `https://protandimnrf2.vn/api`

**Response format:**
```json
{
  "status": 1,
  "message": "Success",
  "data": {}
}
```

**Error format:**
```json
{
  "status": 0,
  "message": "Error message"
}
```

---

## Authentication

### POST /api/login

Login with username, phone number, or passport.

**Request body:**
```json
{
  "username": "example_user",
  "password": "your_password",
  "device_token": "fcm_token_from_device"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `username` | string | ✅ | Username, phone number, or passport |
| `password` | string | ✅ | User's password |
| `device_token` | string | ❌ | FCM device token for push notifications |

**Response `200` — Success:**
```json
{
  "status": 1,
  "message": "Đăng nhập thành công",
  "data": {
    "token": "base58_token_64_char",
    "user": {
      "id": 1,
      "username": "example_user",
      "email": "user@example.com",
      "real_email": null,
      "temp_email": null,
      "token_change_mail": null,
      "need_relogin": 0,
      "fullname": "Nguyễn Văn A",
      "first_name": null,
      "last_name": null,
      "address": "123 Đường ABC",
      "phone": "0901234567",
      "gender": 1,
      "avatar": "https://protandimnrf2.vn/uploads/avatar.jpg",
      "dob": "1990-01-01",
      "created_at": 1717654321,
      "status": 1,
      "device_token": "fcm_token_string",
      "role": 1,
      "permission_group_id": null,
      "register_token": null,
      "forgot_token": null,
      "level": 3,
      "branch": null,
      "branch_for_child": 0,
      "top_id": null,
      "setting_top_id": null,
      "by_pass_kyc": 0,
      "parent_id": null,
      "inviter_id": 5,
      "postal_code": null,
      "passport": null,
      "lasted_login": 1717654321,
      "save_branch": null,
      "diagram_date": 1717654321,
      "total_bonus": "0.00000000",
      "total_invest": "0.00000000",
      "delta_invest": "0.00000000",
      "left_sum": 0,
      "right_sum": 0,
      "left_count": 0,
      "right_count": 0,
      "flag": 2,
      "user_type": null,
      "receive_coin": "btc",
      "receive_address": null,
      "lock_withdraw": 0,
      "usd_balance": "0.00000000",
      "bonus_balance": "0.00000000",
      "count_order": 5,
      "total_sales": "5000000.00000000",
      "system_sales": "0.00000000",
      "residual_sales": "0.00000000",
      "is_direct_bonus_left": 0,
      "is_direct_bonus_right": 0,
      "layer_bonus_number": 0,
      "total_pair_left": 0,
      "total_pair_right": 0,
      "manage_level": null,
      "point": 100,
      "bank_name": "Vietcombank",
      "bank_address": "CN HCM",
      "bank_number": "0123456789",
      "bank_owner": "Nguyễn Văn A",
      "system_sales_month": "0.00000000",
      "personal_order_quantity": 0,
      "system_order_quantity": 0,
      "not_bonus": 0,
      "discount_percent": 0,
      "title": null,
      "high_order_quantity_month": 0,
      "personal_order_quantity_month": 0,
      "system_order_quantity_month": 0,
      "personal_count_order": 0,
      "system_count_order": 0,
      "personal_count_order_month": 0,
      "system_count_order_month": 0,
      "personal_sales": "0.00000000",
      "personal_sales_month": "0.00000000",
      "personal_order_quantity_cbd_month": 0,
      "system_order_quantity_cbd_month": 0,
      "personal_order_quantity_cbd_peach_month": 0,
      "system_order_quantity_cbd_peach_month": 0,
      "personal_order_quantity_coffee_month": 0,
      "system_order_quantity_coffee_month": 0,
      "rank_bonus_month": 0,
      "rank_bonus_quantity": 0,
      "total_withdraw": "0.00000000",
      "direct_commission_notes": null,
      "city": null,
      "district": null,
      "ward": null,
      "receive_bonus_month": 0,
      "is_contract_submitted": 0,
      "verified": 1,
      "verified_images": null,
      "verified_message": null,
      "enabled_twofa": 0,
      "twofa_id": null,
      "btc_id": null,
      "btc_address": null,
      "btc_balance": "0.00000000",
      "eth_id": null,
      "eth_balance": "0.00000000",
      "eth_address": null,
      "eth_password": null,
      "coin_balance": "0.00000000",
      "coin_id": null,
      "coin_address": null,
      "coin_password": null,
      "usdt_id": null,
      "usdt_address": null,
      "usdt_balance": "0.00000000",
      "usdt_password": null,
      "interest_balance": "0.00000000",
      "commission_balance": "0.00000000",
      "direct_bonus_balance": "0.00000000",
      "matching_bonus_balance": "0.00000000",
      "total_receive": "0.00000000",
      "pending_interest_balance": "0.00000000",
      "pending_commission_balance": "0.00000000",
      "system_invest": "0.00000000",
      "personal_invest": "0.00000000",
      "number_team_bonus": 0,
      "lock_transfer": 0,
      "inviter_username": "referrer_name",
      "promotional_inventory_coffee": 0,
      "promotional_inventory_kiddy": 0,
      "promotional_inventory_protandim": 0,
      "promotional_inventory_immucan": 0,
      "promotional_inventory_thnt": 0
    }
  }
}
```

**Notes:**
- `password`, `password_fk`, `passphrase` are stripped from the response
- `inviter_username` is resolved from `inviter_id`
- `avatar` is resolved via `getAvatarByDefault()` (returns `/custom/images/no-avatar.jpg` if empty)
- Decimal fields are returned as strings (e.g., `"0.00000000"`)

**Response `401` — Invalid credentials:**
```json
{ "status": 0, "message": "Thông tin đăng nhập không chính xác" }
```

**Response `403` — Account locked:**
```json
{ "status": 0, "message": "Tài khoản của bạn bị khóa. Vui lòng liên hệ với chúng tôi!" }
```

**Notes:**
- Token is stored server-side in Redis with 30-day TTL
- On login success, `device_token` is saved to user record (if provided)
- Use the returned `token` in `Authorization: Bearer <token>` header for protected endpoints

---

## Profile

### GET /api/profile

Get current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response `200`:**
```json
{
  "status": 1,
  "message": "Success",
  "data": {
    "id": 1,
    "username": "example_user",
    "email": "user@example.com",
    "real_email": null,
    "temp_email": null,
    "token_change_mail": null,
    "need_relogin": 0,
    "fullname": "Nguyễn Văn A",
    "first_name": null,
    "last_name": null,
    "address": "123 Đường ABC",
    "phone": "0901234567",
    "gender": 1,
    "avatar": "https://protandimnrf2.vn/uploads/avatar.jpg",
    "dob": "1990-01-01",
    "created_at": 1717654321,
    "status": 1,
    "device_token": "fcm_token_string",
    "role": 1,
    "permission_group_id": null,
    "register_token": null,
    "forgot_token": null,
    "level": 3,
    "branch": null,
    "branch_for_child": 0,
    "top_id": null,
    "setting_top_id": null,
    "by_pass_kyc": 0,
    "parent_id": null,
    "inviter_id": 5,
    "postal_code": null,
    "passport": null,
    "lasted_login": 1717654321,
    "save_branch": null,
    "diagram_date": 1717654321,
    "total_bonus": "0.00000000",
    "total_invest": "0.00000000",
    "delta_invest": "0.00000000",
    "left_sum": 0,
    "right_sum": 0,
    "left_count": 0,
    "right_count": 0,
    "flag": 2,
    "user_type": null,
    "receive_coin": "btc",
    "receive_address": null,
    "lock_withdraw": 0,
    "usd_balance": "0.00000000",
    "bonus_balance": "0.00000000",
    "count_order": 5,
    "total_sales": "5000000.00000000",
    "system_sales": "0.00000000",
    "residual_sales": "0.00000000",
    "is_direct_bonus_left": 0,
    "is_direct_bonus_right": 0,
    "layer_bonus_number": 0,
    "total_pair_left": 0,
    "total_pair_right": 0,
    "manage_level": null,
    "point": 100,
    "bank_name": "Vietcombank",
    "bank_address": "CN HCM",
    "bank_number": "0123456789",
    "bank_owner": "Nguyễn Văn A",
    "system_sales_month": "0.00000000",
    "personal_order_quantity": 0,
    "system_order_quantity": 0,
    "not_bonus": 0,
    "discount_percent": 0,
    "title": null,
    "high_order_quantity_month": 0,
    "personal_order_quantity_month": 0,
    "system_order_quantity_month": 0,
    "personal_count_order": 0,
    "system_count_order": 0,
    "personal_count_order_month": 0,
    "system_count_order_month": 0,
    "personal_sales": "0.00000000",
    "personal_sales_month": "0.00000000",
    "personal_order_quantity_cbd_month": 0,
    "system_order_quantity_cbd_month": 0,
    "personal_order_quantity_cbd_peach_month": 0,
    "system_order_quantity_cbd_peach_month": 0,
    "personal_order_quantity_coffee_month": 0,
    "system_order_quantity_coffee_month": 0,
    "rank_bonus_month": 0,
    "rank_bonus_quantity": 0,
    "total_withdraw": "0.00000000",
    "direct_commission_notes": null,
    "city": null,
    "district": null,
    "ward": null,
    "receive_bonus_month": 0,
    "is_contract_submitted": 0,
    "verified": 1,
    "verified_images": null,
    "verified_message": null,
    "enabled_twofa": 0,
    "twofa_id": null,
    "btc_id": null,
    "btc_address": null,
    "btc_balance": "0.00000000",
    "eth_id": null,
    "eth_balance": "0.00000000",
    "eth_address": null,
    "eth_password": null,
    "coin_balance": "0.00000000",
    "coin_id": null,
    "coin_address": null,
    "coin_password": null,
    "usdt_id": null,
    "usdt_address": null,
    "usdt_balance": "0.00000000",
    "usdt_password": null,
    "interest_balance": "0.00000000",
    "commission_balance": "0.00000000",
    "direct_bonus_balance": "0.00000000",
    "matching_bonus_balance": "0.00000000",
    "total_receive": "0.00000000",
    "pending_interest_balance": "0.00000000",
    "pending_commission_balance": "0.00000000",
    "system_invest": "0.00000000",
    "personal_invest": "0.00000000",
    "number_team_bonus": 0,
    "lock_transfer": 0,
    "inviter_username": "referrer_name",
    "promotional_inventory_coffee": 0,
    "promotional_inventory_kiddy": 0,
    "promotional_inventory_protandim": 0,
    "promotional_inventory_immucan": 0,
    "promotional_inventory_thnt": 0
  }
}
```

**Response `401`:**
```json
{ "status": 0, "message": "Unauthorized" }
```

---

## Dashboard

### GET /api/dashboard

Get current user's sales dashboard data (monthly).

**Headers:**
```
Authorization: Bearer <token>
```

**Response `200`:**
```json
{
  "status": 1,
  "message": "Success",
  "data": {
    "totalProtandim": 10,
    "totalImmucan": 5,
    "totalKiddy": 8,
    "totalCoffee": 3,
    "totalFucoidan": 2,
    "totalNuoc": 6,
    "totalTaodo": 4,
    "totalProvegan": 1,
    "totalKiddyBox": 1,
    "totalCoffeeBox": 0,
    "totalFucoidanBox": 0,
    "totalNuocBox": 1,
    "totalTaodoBox": 1,
    "totalDoanhSo": 13,
    "totalAmount": 5000000,
    "userFund": {
      "total_personal_quantity": 10,
      "total_system_quantity": 50,
      "total_quantity": 60,
      "fund_travel": 100000,
      "fund_reward": 200000,
      "fund_community": 50000,
      "total_fund": 350000
    }
  }
}
```

**Notes:**
- Data is calculated for the current month
- Admin (user ID 1) sees data for all users
- Full-branch users see data for their entire referral tree
- Normal users see data for themselves + F1

---

## Notifications

### GET /api/notifications

Get list of notifications for the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response `200`:**
```json
{
  "status": 1,
  "message": "Success",
  "data": {
    "notifications": [
      {
        "id": 1,
        "user_id": null,
        "title": "System Announcement",
        "message": "System will be under maintenance tonight.",
        "type": "system",
        "status": 1,
        "created_at": 1717654321,
        "css_class": "bg-blue",
        "image": "https://protandimnrf2.vn/uploads/notify.jpg",
        "read_at": null,
        "is_read": false,
        "icon": "info"
      }
    ],
    "unread_count": 5,
    "total": 10,
    "page": 1,
    "limit": 20
  }
}
```

**Notes:**
- `user_id: null` means global notification (visible to all users)
- `user_id: <id>` means personal notification (visible only to that user)
- `read_at: null` means unread, `is_read` is a convenience boolean
- `icon`: one of `info`, `success`, `warning`, `error` — mapped from `css_class`

| `css_class` | `icon` |
|---|---|
| `bg-blue` | `info` |
| `bg-green`, `bg-teal`, `bg-olive` | `success` |
| `bg-navy` | `warning` |
| `bg-red`, `bg-pink` | `error` |

### PUT /api/notification/read/{id}

Mark a notification as read.

**Headers:**
```
Authorization: Bearer <token>
```

**Response `200`:**
```json
{ "status": 1, "message": "Marked as read" }
```

**Response `404`:**
```json
{ "status": 0, "message": "Not found" }
```

### POST /api/notification/send

Create a new notification (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request body:**
```json
{
  "title": "Announcement",
  "message": "Content here",
  "type": "system",
  "user_id": null,
  "image": "https://...",
  "css_class": "bg-blue"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ✅ | Notification title |
| `message` | string | ✅ | Notification body |
| `type` | string | ❌ | Type: `system` (default), `promotion`, `news` |
| `user_id` | int | ❌ | `null` = global, specific user ID = personal |
| `image` | string | ❌ | Image URL |
| `css_class` | string | ❌ | CSS class for styling (default: `bg-blue`) |

**Response `200`:**
```json
{
  "status": 1,
  "message": "Notification sent",
  "data": { "id": 1, "title": "...", "message": "...", ... }
}
```

---

## Web Push Subscription

### POST /api/push/subscribe

Save browser Web Push subscription (for web app, not FCM mobile).

**Headers:**
```
Authorization: Bearer <token>
```

**Request body:**
```json
{
  "endpoint": "https://fcm.googleapis.com/...",
  "auth_key": "base64_auth",
  "p256dh_key": "base64_p256dh"
}
```

**Response `200`:**
```json
{ "status": 1, "message": "Subscribed" }
```

---

## Device Token (FCM)

### POST /api/device-token

Save/update FCM device token for push notifications (mobile).

**Headers:**
```
Authorization: Bearer <token>
```

**Request body:**
```json
{
  "device_token": "fcm_token_string_from_device"
}
```

**Response `200`:**
```json
{ "status": 1, "message": "Device token saved" }
```

---

## Banners

### GET /api/banners

Get list of active banners (public, no auth required).

**Response `200`:**
```json
{
  "status": 1,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "title": "Summer Sale",
      "content": "Flash sale giảm 20% 20-21/05/2026",
      "image": "https://protandimnrf2.vn/uploads/banner.jpg",
      "link": "https://protandimnrf2.vn/promotions/summer-sale",
      "sort_order": 1,
      "start_at": 1717200000,
      "end_at": 1717286399
    }
  ]
}
```

**Notes:**
- Sorted by `sort_order` ascending, then `id` descending. **Returns at most 1 banner** (app only has 1 position).
- `image` may be `null` (text-only banner using `content`)
- `content` may be `null` (image-only banner)
- Use `image` for display; if null, display `content` text
- **Time filtering:** API only returns banners that are within their display period (`start_at ≤ now ≤ end_at`). `start_at`/`end_at` are unix timestamps.
- **Countdown:** FE can use `end_at` to show countdown timer until banner expires
- `start_at: null` = display immediately
- `end_at: null` = no expiry

---

## News

### GET /api/news

Get paginated list of published news articles.

**Query parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | int | 1 | Page number |

**Response `200`:**
```json
{
  "status": 1,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": 1,
        "title": "New product launch",
        "slug": "new-product-launch",
        "short_content": "New product launch short excerpt",
        "content": "<p>Full HTML content</p>",
        "excerpt": "Full HTML content...",
        "image": "https://protandimnrf2.vn/uploads/news.jpg",
        "category": "tin_tuc",
        "category_label": "Tin tức",
        "created_at": 1717654321,
        "updated_at": 1717654321
      }
    ],
    "total": 10,
    "page": 1,
    "limit": 20
  }
}
```

### GET /api/news/{id}

Get a single news article by ID or slug.

| Path param | Description |
|---|---|
| `{id}` | Numeric ID or URL slug |

**Response `200`:**
```json
{
  "status": 1,
  "message": "Success",
  "data": {
    "id": 1,
    "title": "New product launch",
    "slug": "new-product-launch",
    "content": "<p>Full HTML content</p>",
    "excerpt": "Full HTML content...",
    "image": "https://protandimnrf2.vn/uploads/news.jpg",
    "category": "tin_tuc",
    "category_label": "Tin tức",
    "created_at": 1717654321,
    "updated_at": 1717654321
  }
}
```

**Response `404`:**
```json
{ "status": 0, "message": "Not found" }
```

---

## Promotions

### GET /api/promotions

Get paginated list of published promotions.

**Query parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | int | 1 | Page number |

**Response `200`:**
```json
{
  "status": 1,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": 2,
        "title": "Flash sale 20% off",
        "slug": "flash-sale-20-off",
        "content": "<p>Promotion details</p>",
        "excerpt": "Promotion details...",
        "image": "https://protandimnrf2.vn/uploads/promo.jpg",
        "category": "khuyen_mai",
        "category_label": "Khuyến mãi",
        "created_at": 1717654321,
        "updated_at": 1717654321
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 20
  }
}
```

### GET /api/promotions/{id}

Get a single promotion by ID or slug.

| Path param | Description |
|---|---|
| `{id}` | Numeric ID or URL slug |

**Response `200`:** Same structure as above.

**Response `404`:**
```json
{ "status": 0, "message": "Not found" }
```

---

## Competition Ranking

### GET /api/competition-top

Get top users by system order quantity (thi đua) for the current month. Public endpoint (no auth required).

**Query parameters:**

| Param | Type | Default | Max | Description |
|---|---|---|---|---|
| `limit` | int | 15 | 100 | Number of results per page |
| `offset` | int | 0 | - | Number of results to skip |

**Conditions:**
- User must have purchased in the current month (`personal_order_quantity_month > 0`)
- User is active (`status = 1`)
- Eligible for rewards (`not_bonus != 1`)
- Not an admin (`role != 1`)
- Sorted by `system_order_quantity_month` descending

**Response `200`:**
```json
{
  "status": 1,
  "message": "Success",
  "data": {
    "total": 50,
    "limit": 15,
    "offset": 0,
    "items": [
      {
        "id": 1,
        "username": "example_user",
        "system_order_quantity_month": 50,
        "avatar": "https://protandimnrf2.vn/custom/images/no-avatar.jpg",
        "rank": 1
      }
    ]
  }
}
```

| Field | Type | Description |
|---|---|---|
| `id` | int | User ID |
| `username` | string | Username |
| `system_order_quantity_month` | int | Total system boxes (F1) this month |
| `avatar` | string | Avatar URL (resolved via `getAvatarByDefault()`) |
| `rank` | int | Ranking position (offset + index + 1) |

---

## Error Codes

| Status Code | Meaning |
|---|---|
| 200 | Success |
| 400 | Bad request (missing/invalid fields) |
| 401 | Unauthorized (missing/invalid/expired token) |
| 403 | Forbidden (account locked or insufficient permissions) |
| 404 | Resource not found |
| 405 | Method not allowed |

---

## Token Management

| Detail | Value |
|---|---|
| Token type | Random base58 (64 characters) |
| Storage | Redis key `{prefix}_api_token_{token}` |
| TTL | 30 days (2592000 seconds) |
| Auth header | `Authorization: Bearer <token>` |
| Expiry handling | API returns `401` with `"message": "Token invalid or expired"` |
| Logout | Simply remove token from client storage (e.g., `localStorage.removeItem('api_token')`) |

**Note:** The PHP backend currently has no explicit logout endpoint. To log out, the client should delete the token from localStorage. Adding a `POST /api/logout` endpoint that deletes the token from Redis can be done if needed.
