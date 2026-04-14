# API & Controllers Documentation: Deep Technical Breakdown

This document provides a highly detailed, comprehensive guide to the core controllers within the central application, including exact payload JSON fields, validation constraints, query parameters, and line-item database schema mapping. **EventPullOutController** and **EventInventoryController** have been purposely excluded.

## Table of Contents

1. [Shared Routes & Configuration](#1-shared-routes--configuration)
2. [Warehouse API: StockTransferController](#2-warehouse-api-stocktransfercontroller)
3. [Branches API: RequestStockController](#3-branches-api-requeststockcontroller)
4. [Branches API: PullOutRequestController](#4-branches-api-pulloutrequestcontroller)

---

## 1. Shared Routes & Configuration

These standard routes operate with simple filters and provide basic foundational requests.

- **Authentication API:**

  - `POST /auth/login` | `POST /auth/logout`

- **Shared Functionality (`App\Controllers\Shared`):**

  - `GET /books/search` - Look up titles.
  - `POST /books/scan` - Scans bar codes.
  - `GET /payments/list`
  - `GET /branches/list`

- **User Subsystem (`App\Controllers\Users`):**
  - `GET /user/me` - Profile metadata.
  - `GET /user/branch` - Accessible branches.
  - `POST /user/branch/activate` - Sets active app session branch.

---

## 2. Warehouse API: StockTransferController

**Namespace:** `App\Controllers\Warehouse\StockTransferController`
**Filter:** `appAccess:WAREHOUSE`
**Prefix:** `/warehouse`

This controller manages **Stock Transfer Forms (STFs)**. An STF maps physical goods tracking from their shipment to delivery, usually fulfilling a Stock Request (RS).

### 2.1 STF Management Endpoints

#### `GET /warehouse/stf/list`

Retrieves a paginated list of created STFs.

- **Query Parameters:**
  - `status` (string, optional) - e.g., `'PENDING'`, `'PROCESSING'`, `'COMPLETED'`. If omitted, gets all.
- **Output Mapping:** Appends the ownership flag tracking `preparedBy` field comparing against `sessionUserId`.

#### `GET /warehouse/stf/items`

Extracts header and line-item structures for a given transfer.

- **Query Parameters:**
  - `stfNo` (string, required) - The exact ID of the Stock Transfer Form.
- **Returns JSON format:** `{ "status": 200, "info": { ... }, "lines": [ ... ] }`

#### `POST /warehouse/stf/add`

Creates a manual Stock Transfer (not tied to an existing RS).

- **Payload (JSON Expected):**
  ```json
  {
    "toId": 2, // Destination Location ID
    "remarks": "Standard replenishment",
    "items": [
      { "bookId": 1205, "qty": 15 },
      { "bookId": 1206, "qty": 10 }
    ]
  }
  ```
- **Validation Rules:**
  - `toId` must natural > 0.
  - `items.*.bookId` and `items.*.qty` must both be numeric > 0.
- **Database Target Actions:**
  - `stockTransferInfo`: Inserts `stfNo` (generated string), `fromLocationId` (active session branch), `toLocationId`, `status` sets to `'PENDING'`, `originType` sets to `'STF'`, `originRef` is null/empty, `preparedBy`, and `remarks`.
  - `stockTransferLine`: For each item, inserts `bookId`, `qtyExpected` (`qty` from payload), and natively syncs `qtyDelivered` to the exact same value originally. Requires a SQL Transaction.

#### `POST /warehouse/stf/update`

Allows modification on an existing STF. Hard-guarded: Only works on status == `'PENDING'`.

- **Payload:**
  ```json
  {
    "stfNo": "CB-2023-XXXX",
    "fromId": 1,
    "toId": 2,
    "remarks": "Updated text",
    "items": [{ "bookId": 1205, "qty": 20 }]
  }
  ```
- **Action Breakdown:** Updates `stockTransferInfo` fields `fromLocationId`, `toLocationId`, `remarks`. Calculates the item difference: deleted items are removed from DB, missing (new) items are fully inserted setting both `qtyExpected` & `qtyDelivered` directly to `qty`. Existing matching pairs forcefully set `qtyExpected` and `qtyDelivered` equal to the provided payload `qty`.

#### `POST /warehouse/stf/generate`

Generates an STF fulfilling an existing Stock Request (RS).

- **Payload:**
  ```json
  {
    "reference": "RS-2023-XXXX", // Origin request ID
    "remarks": "Fulfillment for stock request."
  }
  ```
- **Validation Rule Adds:** `reference` field is explicitly required.
- **Database Action:** Changes parent RS status to `'PROCESSING'`. STF takes `originType` = `'RS'` and `status` = `'PROCESSING'`. STF line operations mimic `stf/add`.

#### `GET /warehouse/stf/next`

Returns simple JSON String representing system sequence (e.g. `CB-0001`).

### 2.2 Fulfillment Endpoints

#### `GET /warehouse/order/list`

Lists **Pending Requests** aimed toward the Warehouse.

- **Backend Filter Action:** Evaluates `status` == `PENDING` where `toLocationId` is explicitly tracked against the currently logged active user\'s branch location ID logic.

#### `GET /warehouse/order/items`

Looks up an exact origin request context.

- **Query Parameter:** `rsNo`
- Retrieves the header (`info`) mapping to that RS and array of `stockRequestLineModel` elements (`lines`).

#### `POST /warehouse/fulfillOrder` _(Internal logic within Controller)_

Transacts a manual fulfillment update.

- **Payload:** Explicit array map requiring `stfNo`, and `items` holding `bookId` and current actual `qty` counts to be tracked under `qtyDelivered`.
- **Action:** Patches actual items array elements within `stockTransferLineModel` setting `qtyDelivered` fields. Moves core header string statuses (`stfNo` and connected `originRef` RS logic) heavily towards a true `PROCESSING` milestone.

---

## 3. Branches API: RequestStockController

**Namespace:** `App\Controllers\Branches\RequestStockController`
**Filter:** `appAccess:BRANCHES`
**Prefix:** `/branches`

Allows regional branches to pull info, generate order forms to main dispatch, and logically verify shipments received.

### 3.1 Initial Operations & Lists

#### `GET /branches/inventory`

Rich list data extracting available book models natively supporting data table interfaces.

- **Query Parameters:** `page`, `per_page` (default 10), `search`, `sort_column`, `sort_dir`, `booktype`, `edition_from`, `edition_to`.

#### `GET /branches/rs/list`

Displays past RS forms created dynamically via UI selectors.

- **Query parameters:**
  - `from` Date
  - `to` Date
  - `status` (defaults statically as `PENDING`)

#### `GET /branches/rs/items`

Same standard structure mapping specific info and arrays.

- **Query Parameters:** `rsNo` (String) Returns JSON matching info & line keys. Returns `404` directly if RS doesn\'t physically exist.

### 3.2 RS Object Modifications

#### `POST /branches/rs/add`

- **Payload Target Elements:**
  ```json
  {
    "remarks": "Urgent Request",
    "items": [{ "bookId": 339, "qty": 5 }]
  }
  ```
- **Validation Rules Constraints:** Nested object array tracking requires `items.*.bookId` & `qty` natively resolved beyond `0`. Request demands active session.
- **Database Action:** Generates tracking `RSNo`. Hardcoded backend override binds `requestToLocationId` to `9` temporarily. Creates lines linking mapped item variables to `qtyRequested`. Creates info bindings with `status` -> `PENDING` and saves user session mapped into `requestedBy`.

#### `POST /branches/rs/update`

Edits existing standard templates without specific delta resolutions. Allows complete clean wipes of an array.

- **Payload Constraint:**
  ```json
  {
    "rsNo": "WH-A-001", // Identifier mapping correct header key
    "remarks": "Needs extra edits",
    "items": [{ "bookId": 404, "qty": 10 }]
  }
  ```
- **Database Action:** Strictly limits execution against `PENDING` states. Modifies string `remarks`. Completely purges `delete()` matched array components off `rsId` within database, subsequently inserting totally new sequence objects resolving `qtyRequested` correctly per the new payload elements matching.

#### `POST /branches/rs/cancel`

Cancels workflow progress dynamically.

- **Payload:** Single `{"rsNo":"ID-String"}` mapping. Rejects elements no longer labeled `'PENDING'`, blocking duplication.

### 3.3 Stock Physical Reception

#### `GET /branches/stocks/incoming`

Finds any `stockTransferInfoModel` specifically marking `toLocationId` == User Active System Branch Location holding STF bounds natively dispatched and traveling outward to them functionally.

#### `POST /branches/stf/save`

Critical API tracking the literal receipt resolution when the truck reaches the branch. Requires explicit line-count tracking verification parameters.

- **Detailed Payload Object:**
  ```json
  {
    "stfNo": "CB-0002",
    "items": [
      {
        "bookId": 1205,
        "qtyAccepted": 12,
        "qtyRejected": 3,
        "rejectionNote": "3 books cover damaged in transit."
      }
    ]
  }
  ```
- **Constraint Execution Rules:**
  - Payload components evaluating `qtyRejected > 0` throw explicit errors rejecting execution without natively mapped `rejectionNote` string element presence.
  - Rejection limits 0 -> ignore.
- **Actions Setup:** Triggers dual header updates: Updates `stfNo` status & origin request mapping (`originRef`) `RSNo` to ultimate `COMPLETED`. Updates array lines inserting numeric tracking into DB paths -> `qtyAccepted` & `qtyRejected`.

---

## 4. Branches API: PullOutRequestController

**Namespace:** `App\Controllers\Branches\PullOutRequestController`
**Filter:** `appAccess:BRANCHES`
**Prefix:** `/branches`

Manages Pull-Outs (PO) when a branch returns stock via a dynamically logged movement form back outwards.

### 4.1 Lookup Methods

#### `GET /branches/po/incoming/list` (or `/outgoing`)

Displays listing tables matching segment path variables dynamically pointing URI filters toward columns `fromLocationId` or `toLocationId`. Uses typical query filters (`search`, `status`, `page`, `fromDate`, `toDate`).

#### `GET /branches/po/items`

Retrieves header mapped object array against specific exact `poNo` string Query Parameters natively mapping JSON `info` & `lines`.

### 4.2 Data Mutations

#### `POST /branches/po/add`

- **JSON Target Elements Tracking:**
  ```json
  {
    "fromLocationId": 5,
    "toLocationId": 9,
    "remarks": "Seasonal return.",
    "items": [{ "bookId": 994, "qtyRequested": 40 }]
  }
  ```
- **Database Rules Check:** Requires Location fields properly declared above zero. Items enforce numeric bounds mapping correctly onto object array limits.
- **Execution Mapping:** Creates PO info element pushing session metadata directly unto `requestBy` structure. Line inserts map parameter `qtyRequested`. `status` is natively defaulted based on implicit database architecture constraints.

#### `POST /branches/po/fulfill` _(Internal mapped function)_

Closes physical gap on returned inventory objects.

- **Payload Tracking Element Target Object:** Maps main `poNo` directly pointing object array rows carrying keys -> `qtyFulfilled`.
- **Action Mapping:** Inserts line tracking dynamically onto target `qtyFulfilled` SQL tables bindings. Hard sets primary header sequence directly terminating in `FULFILLED` string status. Explicitly operates using rigid Transaction protection blocks.
