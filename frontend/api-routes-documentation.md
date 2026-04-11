# API Routes Documentation

This document provides a comprehensive and detailed breakdown of all the API routes defined in your application (`app/Config/Routes.php`).

It includes the characteristics of each route, the controller methods they map to, necessary parameters (query strings or JSON payload), and their expected outputs.

---

## 1. Authentication Routes

These routes are publicly accessible and do not require the `auth` filter.

### `POST /auth/login`

- **Controller:** `Users\AuthController::login`
- **Characteristics:** Unprotected. Authenticates the user and sets up the session.
- **Parameters:** JSON Payload
  ```json
  {
    "idnumber": "User ID Number (string)",
    "password": "Password (string)"
  }
  ```
- **Output:**
  - **Success (200):** `{"status": 200, "message": "Logged in"}`
  - **Error (401):** `{"status": 401, "error": 401, "messages": {"error": "Invalid ID number or password."}}`

### `POST /auth/logout`

- **Controller:** `Users\AuthController::logout`
- **Characteristics:** Unprotected. Destroys the current active session.
- **Parameters:** None.
- **Output:**
  - **Success (200):** `{"status": 200, "message": "Logged out"}`

---

## 2. Shared Routes

**Route Group Filters:** `auth`, `throttle`
These routes are protected and available to authenticated users, governed by standard rate limiting.

### `GET /books/search`

- **Controller:** `Shared\BookController::search`
- **Characteristics:** Fetches a list of books matching the search criteria.
- **Parameters:** URL Query String
  - `search` (optional) - String to search for books.
  - `limit` (optional) - Integer (Defaults to 10).
- **Output:**
  - JSON array of `books` transformed through `BooksModel::search()`.

### `GET /payments/list`

- **Controller:** `Shared\PaymentController::payment`
- **Characteristics:** Retrieves a list of POS payment methods.
- **Parameters:** None.
- **Output:**
  - **Success (200):** `{"status": 200, "data": [{...Payment Object...}]}`

### `GET /branches/list`

- **Controller:** `Shared\BranchController::branch`
- **Characteristics:** Fetches an alphabetical list of all branches/stores.
- **Parameters:** None.
- **Output:**
  - **Success (200):** `{"status": "success", "data": [{...Branch Object...}]}`

---

## 3. User Routes

**Route Group Filters:** `auth`, `throttle`

### `GET /user/me`

- **Controller:** `Users\UserController::me`
- **Characteristics:** Retrieves the current authenticated user's session data.
- **Parameters:** None.
- **Output:**
  - **Success (200):** `{"status": 200, "data": {...User Object...}}`
  - **Error (401):** `{"status": 401, "error": 401, "messages": {"error": "Unauthorized"}}`

### `GET /user/branch`

- **Controller:** `Users\UserController::getUserBranch`
- **Characteristics:** Retrieves the branches assigned to the current user.
- **Parameters:** None.
- **Output:**
  - **Success (200):** `{"status": 200, "data": [{...User Branch Details...}]}`

### `POST /user/branch/activate`

- **Controller:** `Users\UserController::activateBranch`
- **Characteristics:** Switches the currently active branch for the logged-in user.
- **Parameters:** JSON Payload
  ```json
  {
    "branchID": "Branch ID to activate (integer)"
  }
  ```
- **Output:**
  - **Success (200):** `{"status": 200, "message": "Branch switched successfully", "data": [{...Updated Branch Details...}]}`
  - **Error (400):** `{"status": 400, "error": 400, "messages": {"error": "Branch ID is required"}}`

---

## 4. Warehouse Routes

**Route Group Prefix:** `warehouse`
**Filters:** `auth`, `throttle`, `appAccess:WAREHOUSE`

### `Resource /warehouse/departments`

Standard RESTful endpoints to manage departments/branches.

- **`GET /warehouse/departments`**
  - **Output:** `{"status": 200, "data": [{...Warehouse/Branch Object...}]}`
- **`GET /warehouse/departments/{id}`**
  - **Output:** `{"status": 200, "data": {...Warehouse/Branch Object...}}`
- **`POST /warehouse/departments`**
  - **Parameters (JSON):** `{"branchstorename": "...", "branchaddress": "...", "branchcontact": "..."}`
  - **Output:** `{"status": 200, "message": "Deparm created successfully"}`
- **`PUT/PATCH /warehouse/departments/{id}`**
  - **Parameters (JSON):** Same as POST.
  - **Output:** `{"status": 200, "message": "Branch updated successfully"}`

### `GET /warehouse/stf/list`

- **Controller:** `Warehouse\StockTransferController::list`
- **Characteristics:** Retrieves Stock Transfer Forms (STF). Sets `isOwner` boolean for the frontend.
- **Parameters:** URL Query String
  - `status` (optional) - Filters list by status (e.g., PENDING, COMPLETED).
- **Output:**
  - **Success (200):** `{"status": 200, "data": [{...STF Data...}]}`

### `GET /warehouse/stf/items`

- **Controller:** `Warehouse\StockTransferController::itemList`
- **Characteristics:** Retrieves header info and line items for a specific STF.
- **Parameters:** URL Query String
  - `stfNo` (required) - The STF Reference Number.
- **Output:**
  - **Success (200):** `{"status": 200, "info": {...STF Header...}, "lines": [{...STF Lines...}]}`

### `GET /warehouse/stf/next`

- **Controller:** `Warehouse\StockTransferController::getNextStfNo`
- **Characteristics:** Generates and retrieves the next available STF reference number (prefix `CB`).
- **Parameters:** None.
- **Output:**
  - **Success (200):** `{"status": 200, "data": "CB-..."}`

### `POST /warehouse/stf/add`

- **Controller:** `Warehouse\StockTransferController::add`
- **Characteristics:** Creates a new Stock Transfer Request.
- **Parameters:** JSON Payload
  ```json
  {
    "fromId": 1,
    "toId": 2,
    "remarks": "...",
    "items": [{ "bookId": 1, "qty": 10 }]
  }
  ```
- **Output:**
  - **Success (200):** `{"status": 200, "message": "Stock transfer request added successfully"}`

### `POST /warehouse/stf/update`

- **Controller:** `Warehouse\StockTransferController::updateStf`
- **Characteristics:** Updates a `PENDING` STF. Modifies headers, inserts new lines, removes deleted lines, and updates quantities.
- **Parameters:** JSON Payload
  ```json
  {
    "stfNo": "CB-...",
    "fromId": 1,
    "toId": 2,
    "remarks": "...",
    "items": [ ... ]
  }
  ```
- **Output:**
  - **Success (200):** `{"status": 200, "message": "Successfully updated items!"}`
  - **Error (422):** Only allowed for PENDING transfers.

### `GET /warehouse/order/list`

- **Controller:** `Warehouse\StockTransferController::orderList`
- **Characteristics:** Gets a list of Stock Requests (`PENDING` status mapping to the user's active branch).
- **Parameters:** None.
- **Output:**
  - **Success (200):** `{"status": 200, "data": [{...RS Header Data...}]}`

### `GET /warehouse/order/items`

- **Controller:** `Warehouse\StockTransferController::orderItems`
- **Characteristics:** Retrieves a specific Stock Request's header info and line items.
- **Parameters:** URL Query String
  - `rsNo` (optional) - The RS number.
- **Output:**
  - **Success (200):** `{"status": 200, "info": {...RS Header...}, "lines": [{...RS Lines...}]}`

---

## 5. Branches Routes

**Route Group Prefix:** `branches`
**Filters:** `auth`, `throttle`, `appAccess:BRANCHES`

### `GET /branches/inventory`

- **Controller:** `Branches\RequestStockController::inventory`
- **Characteristics:** Retrieves inventory records for the current active branch with extensive filtering and pagination.
- **Parameters:** URL Query Strings
  - `page` (optional) - integer defaults to 1.
  - `per_page` (optional) - integer defaults to 10.
  - `search` (optional) - string.
  - `sort_column` (optional) - integer defaults to 1.
  - `sort_dir` (optional) - string defaults to 'asc'.
  - `booktype` (optional) - filters by book type.
  - `edition_from` / `edition_to` (optional) - filters by edition ranges.
- **Output:**
  - **Success (200):** `{"total": 100, "filtered": 10, "page": 1, "per_page": 10, "data": [{...}]}`

### `GET /branches/rs/list`

- **Controller:** `Branches\RequestStockController::list`
- **Characteristics:** Retrieves Stock Request list associated with the current user's branch. Sets `isOwner` boolean.
- **Parameters:** URL Query Strings
  - `from`, `to` (optional) - date filtering.
  - `status` (optional) - defaults to `PENDING`.
- **Output:**
  - **Success (200):** `{"status": 200, "data": [{...RS Group Data...}]}`

### `GET /branches/rs/items`

- **Controller:** `Branches\RequestStockController::orderItems`
- **Characteristics:** Fetches lines and header info for a specific Stock Request.
- **Parameters:** URL Query String
  - `rsNo` - Request Stock Reference.
- **Output:**
  - **Success (200):** `{"status": 200, "info": {...}, "lines": [{...}]}`
  - **Error (404):** `Stock request not found`

### `GET /branches/rs/next`

- **Controller:** `Branches\RequestStockController::getNextRSNo`
- **Characteristics:** Generates a new Stock Request reference using the branch's specific warehouse code.
- **Parameters:** None.
- **Output:**
  - **Success (200):** `{"status": 200, "data": "WHCODE..."}`

### `POST /branches/rs/add`

- **Controller:** `Branches\RequestStockController::add`
- **Characteristics:** Creates a new Stock Request originating from the branch.
- **Parameters:** JSON Payload
  ```json
  {
    "fromId": 1,
    "toId": 2,
    "remarks": "...",
    "items": [{ "bookId": 1, "qty": 10 }]
  }
  ```
- **Output:**
  - **Success (200):** `{"status": 200, "message": "Stock request added successfully"}`

### `POST /branches/rs/update`

- **Controller:** `Branches\RequestStockController::updateRs`
- **Characteristics:** Truncates existing items for a `PENDING` RS and replaces them with new incoming item lines.
- **Parameters:** JSON Payload
  ```json
  {
    "rsNo": "WHCODE...",
    "fromId": 1,
    "toId": 2,
    "remarks": "...",
    "items": [...]
  }
  ```
- **Output:**
  - **Success (200):** `{"status": 200, "message": "Stock request updated successfully"}`

### `POST /branches/rs/cancel`

- **Controller:** `Branches\RequestStockController::cancelRs`
- **Characteristics:** Cancels a `PENDING` Stock Request. It cannot be cancelled if it has already been processed or is currently cancelled.
- **Parameters:** JSON Payload
  ```json
  {
    "rsNo": "WHCODE..."
  }
  ```
- **Output:**
  - **Success (200):** `{"status": 200, "message": "Stock request cancelled successfully"}`

### `GET /branches/stocks/incoming`

- **Controller:** `Branches\RequestStockController::getIncomingStocks`
- **Characteristics:** Fetches incoming stock transfers bounded for the user's active branch location.
- **Parameters:** None.
- **Output:**
  - **Success (200):** `{"status": 200, "data": [{...STF Objects...}]}`

### `POST /branches/stf/save`

- **Controller:** `Branches\RequestStockController::saveStfItems`
- **Characteristics:** Marks STFs and their origin RS references as `COMPLETED`. Updates accepted and rejected quantities per line. Records rejection notes.
- **Parameters:** JSON Payload
  ```json
  {
    "stfNo": "CB-...",
    "items": [
      {
        "bookId": 1,
        "qtyAccepted": 10,
        "qtyRejected": 0,
        "rejectionNote": "..."
      }
    ]
  }
  ```
- **Output:**
  - **Success (200):** `{"status": 200, "message": "Stock transfer items saved successfully"}`

---

## 6. Pull Out Request Routes

**Route Group Prefix:** `branches/po`
**Filters:** `auth`, `throttle`, `appAccess:BRANCHES`

### `GET /branches/po/(:segment)/list`

- **Controller:** `Branches\PullOutRequestController::list/$1`
- **Characteristics:** Fetches a paginated list of Pull Out requests either `incoming` or `outgoing`.
- **Parameters:** URL Route Segment & Query Strings
  - `Segment` - `incoming` or `outgoing`.
  - `page`, `per_page`, `search`, `sort_column`, `sort_dir`, `status`, `fromDate`, `toDate`.
- **Output:**
  - **Success (200):** `{"total": 10, "filtered": 10, "page": 1, "per_page": 10, "data": [{...}]}`

### `GET /branches/po/next`

- **Controller:** `Branches\PullOutRequestController::getNextPoNo`
- **Characteristics:** Retrieves the next sequential PO number.
- **Parameters:** None.
- **Output:**
  - **Success (200):** `{"status": 200, "data": "POX..."}`

### `GET /branches/po/items`

- **Controller:** `Branches\PullOutRequestController::getPoItemList`
- **Characteristics:** Retrieves lines for a given Pull Out request.
- **Parameters:** URL Query String
  - `poNo` - Required.
- **Output:**
  - **Success (200):** `{"status": 200, "data": [{...PO Item lines...}]}`

### `POST /branches/po/add`

- **Controller:** `Branches\PullOutRequestController::add`
- **Characteristics:** Submits a new Pull Out request to the server.
- **Parameters:** JSON Payload
  ```json
  {
    "fromLocationId": 1,
    "toLocationId": 2,
    "remarks": "...",
    "items": [
      {
        "bookId": 1,
        "qtyRequested": 10
      }
    ]
  }
  ```
- **Output:**
  - **Success (200):** `{"status": 200, "message": "Pull Out Request added successfully"}`
