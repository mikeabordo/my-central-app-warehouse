<template>
  <form @submit.prevent="handleSubmit">
    <!-- Summary info row (optional, for Ref, Locations, etc.) -->
    <div
      v-if="summaryFields && summaryFields.length"
      class="summary-row mb-4 d-flex gap-3"
    >
      <div v-for="field in summaryFields" :key="field.key" class="summary-item">
        <div class="summary-card shadow-sm">
          <span class="summary-label">{{ field.label }}</span>

          <!-- Editable Card Value -->
          <template v-if="field.type === 'select'">
            <div
              class="custom-dropdown"
              v-click-outside="() => closeSummaryDropdown(field.key)"
            >
              <!-- Stop event propagation so other click-outside handlers don't interfere with opening/selecting. -->
              <div
                class="dropdown-trigger fw-bold fs-5"
                @mousedown.stop
                @click.stop="toggleSummaryDropdown(field.key)"
              >
                {{ getSelectedLabel(field) || field.placeholder || "Select" }}
                <vue-feather
                  type="chevron-down"
                  size="16"
                  class="ms-1"
                ></vue-feather>
              </div>
              <div
                v-if="openSummaryDropdowns[field.key]"
                class="dropdown-menu-custom shadow-lg show"
              >
                <div
                  v-if="!field.options || field.options.length === 0"
                  class="dropdown-item-custom text-muted"
                  @mousedown.stop
                  @click.stop
                >
                  No options available
                </div>
                <div
                  v-else
                  v-for="opt in field.options"
                  :key="getOptionValue(opt)"
                  class="dropdown-item-custom"
                  @mousedown.stop
                  @click.stop="selectSummaryOption(field, opt)"
                >
                  {{ getOptionLabel(opt) }}
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="field.type === 'textarea'">
            <textarea
              v-model="formData[field.key]"
              class="summary-textarea fw-600 fs-6 shadow-none"
              style="background: transparent; resize: none"
              rows="1"
              :placeholder="field.placeholder || ''"
            ></textarea>
          </template>
          <template v-else-if="field.type === 'text'">
            <input
              v-model="formData[field.key]"
              :disabled="field.disabled"
              class="form-control border-0 p-0 fw-bold fs-5 shadow-none"
              :class="{ 'text-muted': field.disabled }"
              style="background: transparent"
              :placeholder="field.placeholder || ''"
            />
          </template>
          <template v-else>
            <span class="summary-value">{{ formData[field.key] || "—" }}</span>
          </template>
        </div>
      </div>
    </div>
    <div class="card shadow-sm border-0">
      <div class="card-body pt-3">
        <div class="row">
          <div
            v-for="field in fields"
            :key="field.key"
            :class="['mb-3', 'field-wrapper', colClass(field)]"
          >
            <label class="form-label">{{ field.label }}</label>

            <!-- ── API Search field ── -->
            <div
              v-if="isSearch(field)"
              class="search-field-wrapper"
              v-click-outside="() => closeDropdown(field.key)"
            >
              <div class="position-relative" style="z-index: 1051">
                <input
                  type="text"
                  class="form-control mb-3"
                  v-model="searchQueries[field.key]"
                  :placeholder="field.placeholder || `Search ${field.label}…`"
                  @input="onSearchInput(field, $event)"
                  @keydown.escape="closeDropdown(field.key)"
                  autocomplete="off"
                />
                <!-- Loading spinner inside input -->
                <div
                  v-if="searchLoading[field.key]"
                  class="search-spinner"
                  style="top: 20px"
                >
                  <span
                    class="spinner-border spinner-border-sm text-secondary"
                    role="status"
                  ></span>
                </div>

                <!-- Results Dropdown -->
                <div
                  v-if="
                    searchResults[field.key] && searchResults[field.key].length
                  "
                  class="search-results-dropdown shadow-lg border rounded"
                >
                  <ul class="list-unstyled mb-0">
                    <li
                      v-for="result in searchResults[field.key]"
                      :key="getOptionValue(result)"
                      class="search-result-item p-2 border-bottom"
                      @click="selectSearchResult(field, result)"
                    >
                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <div class="result-details">
                          <slot
                            :name="'col-product_details'"
                            v-bind="result._raw"
                          >
                            <span class="fw-bold">{{
                              getOptionLabel(result)
                            }}</span>
                          </slot>
                        </div>
                        <vue-feather
                          type="plus-circle"
                          size="16"
                          class="text-primary"
                        ></vue-feather>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- No results state (inline) -->
              <div
                v-if="searchNoResult[field.key]"
                class="text-danger small mb-2"
              >
                No results found
              </div>

              <!-- Selected Items Table -->
              <div
                v-if="
                  selectedItems[field.key] && selectedItems[field.key].length
                "
                class="table-responsive border rounded mt-2"
              >
                <table class="table table-hover mb-0">
                  <thead class="bg-light">
                    <tr>
                      <th
                        v-for="col in field.tableColumns || [
                          { label: 'Result', key: 'label' },
                        ]"
                        :key="col.key"
                      >
                        {{ col.label }}
                      </th>
                      <th style="width: 80px" class="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, idx) in selectedItems[field.key]"
                      :key="idx"
                    >
                      <td
                        v-for="col in field.tableColumns || []"
                        :key="col.key"
                      >
                        <template v-if="col.editable || col.key === 'qty'">
                          <input
                            type="number"
                            v-model.number="item[col.key]"
                            class="form-control form-control-sm"
                            style="width: 80px"
                            min="1"
                            @input="updateFormData(field)"
                          />
                        </template>
                        <slot
                          v-else
                          :name="'col-' + col.key"
                          v-bind="item._raw"
                        >
                          {{
                            col.key === "label"
                              ? item.label
                              : item._raw && item._raw[col.key]
                          }}
                        </slot>
                      </td>
                      <td class="text-center">
                        <button
                          type="button"
                          class="btn btn-sm btn-outline-danger border-0"
                          @click="removeSelectedItem(field, idx)"
                        >
                          <vue-feather type="trash-2" size="16"></vue-feather>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- ── Dropdown / Select field ── -->
            <select
              v-else-if="isDropdown(field)"
              class="form-select form-control"
              v-model="formData[field.key]"
              :disabled="field.disabled || false"
              :class="{ 'bg-light': field.disabled }"
            >
              <option value="" disabled>
                {{ field.placeholder || `Select ${field.label}` }}
              </option>
              <option
                v-for="opt in field.options"
                :key="getOptionValue(opt)"
                :value="getOptionValue(opt)"
              >
                {{ getOptionLabel(opt) }}
              </option>
            </select>

            <!-- ── Textarea field ── -->
            <textarea
              v-else-if="isTextarea(field)"
              class="form-control"
              v-model="formData[field.key]"
              :rows="field.rows || 3"
              :disabled="field.disabled || false"
              :class="{ 'bg-light': field.disabled }"
              :placeholder="field.placeholder || ''"
            ></textarea>

            <!-- ── Plain input ── -->
            <input
              v-else
              :type="field.type || 'text'"
              class="form-control"
              v-model="formData[field.key]"
              :disabled="field.disabled || false"
              :class="{ 'bg-light': field.disabled }"
              :placeholder="field.placeholder || ''"
            />
          </div>
        </div>
        <!-- end .row -->
      </div>
    </div>

    <div class="d-flex justify-content-end mb-5">
      <button
        type="submit"
        class="btn btn-submit btn-gradient warm"
        :disabled="loading"
      >
        <span
          v-if="loading"
          class="spinner-border spinner-border-sm me-2"
          role="status"
        ></span>
        {{ submitLabel }}
      </button>
    </div>
  </form>
</template>

<script>
import api from "@/services/api";

export default {
  name: "AddForm",
  props: {
    title: { type: String, default: "Add New" },
    submitLabel: { type: String, default: "Submit" },
    fields: { type: Array, default: () => [] },
    summaryFields: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
  },

  emits: ["create", "cancel"],

  data() {
    return {
      formData: {},
      searchQueries: {},
      searchResults: {},
      searchLoading: {},
      searchNoResult: {},
      selectedItems: {}, // Track selected items for search fields
      openSummaryDropdowns: {},
      _debounceTimers: {},
    };
  },

  directives: {
    "click-outside": {
      mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value();
          }
        };
        document.addEventListener("click", el.clickOutsideEvent);
      },
      unmounted(el) {
        document.removeEventListener("click", el.clickOutsideEvent);
      },
    },
  },

  watch: {
    fields: {
      handler(newFields) {
        this.initFormData(newFields, this.summaryFields);
      },
      immediate: true,
      deep: true,
    },
    summaryFields: {
      handler(newSummary) {
        this.initFormData(this.fields, newSummary);
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    isDropdown(field) {
      return field.type === "select" || field.type === "dropdown";
    },
    isSearch(field) {
      return field.type === "search";
    },
    isTextarea(field) {
      return field.type === "textarea";
    },
    getOptionValue(opt) {
      return typeof opt === "object" && opt !== null ? opt.value : opt;
    },
    getOptionLabel(opt) {
      return typeof opt === "object" && opt !== null ? opt.label : opt;
    },
    colClass(field) {
      const n = field.col;
      if (!n || n === 12) return "col-12";
      return `col-12 col-md-${n}`;
    },
    initFormData(fields, summaries = []) {
      // Merge existing data if any (to avoid blowing away current inputs)
      const current = { ...this.formData };
      const queries = { ...this.searchQueries };
      const results = { ...this.searchResults };
      const loading = { ...this.searchLoading };
      const noResult = { ...this.searchNoResult };
      const selected = { ...this.selectedItems };

      const all = [...fields, ...summaries];

      all.forEach((f) => {
        if (current[f.key] === undefined || current[f.key] === "") {
          current[f.key] =
            f.value !== undefined && f.value !== null ? f.value : "";
        } else if (f.value !== undefined && f.disabled) {
          // Force update disabled values (like Ref #)
          current[f.key] = f.value;
        }

        if (queries[f.key] === undefined) {
          queries[f.key] = "";
          results[f.key] = [];
          loading[f.key] = false;
          noResult[f.key] = false;
        }

        if (this.isSearch(f) && !selected[f.key]) {
          selected[f.key] = [];
        }
      });

      this.formData = current;
      this.searchQueries = queries;
      this.searchResults = results;
      this.searchLoading = loading;
      this.searchNoResult = noResult;
      this.selectedItems = selected;
    },

    onSearchInput(field, event) {
      const query = event.target.value;
      this.searchQueries[field.key] = query;

      // Only clear formData for single-selects. For lists, keep the existing items.
      if (
        !this.selectedItems[field.key] ||
        this.selectedItems[field.key].length === 0
      ) {
        this.formData[field.key] = "";
      }

      this.searchResults[field.key] = [];
      this.searchNoResult[field.key] = false;

      const minChars = field.minChars ?? 1;
      if (query.length < minChars) return;

      clearTimeout(this._debounceTimers[field.key]);
      this._debounceTimers[field.key] = setTimeout(
        () => this.fetchSearchResults(field, query),
        field.debounce ?? 350,
      );
    },

    async fetchSearchResults(field, query) {
      this.searchLoading[field.key] = true;
      this.searchNoResult[field.key] = false;

      try {
        const method = (field.method || "get").toLowerCase();
        let response;

        if (method === "post") {
          response = await api.post(field.endpoint, {
            search: query,
            limit: 10,
          });
        } else {
          const fullUrl = `${field.endpoint}?search=${encodeURIComponent(
            query,
          )}&limit=10`;
          response = await api.get(fullUrl);
        }

        const raw = Array.isArray(response) ? response : response.data ?? [];

        const valueKey = field.valueKey ?? "id";
        const labelKey = field.labelKey ?? "name";

        this.searchResults[field.key] = raw.slice(0, 10).map((item) => ({
          value: item[valueKey],
          label: item[labelKey],
          _raw: item,
        }));

        this.searchNoResult[field.key] =
          this.searchResults[field.key].length === 0;
      } catch (err) {
        console.error(`[Search - ${field.key}] Search Error:`, err);
        this.searchResults[field.key] = [];
        this.searchNoResult[field.key] = true;
      } finally {
        this.searchLoading[field.key] = false;
      }
    },

    selectSearchResult(field, result) {
      // Add to selected items instead of just setting value
      if (!this.selectedItems[field.key]) {
        this.selectedItems[field.key] = [];
      }

      // prevent duplicates safely (even if value is undefined)
      const isDup = this.selectedItems[field.key].some((item) => {
        if (item.value && result.value) return item.value === result.value;
        if (item._raw && result._raw && item._raw.id)
          return item._raw.id === result._raw.id;
        return JSON.stringify(item._raw) === JSON.stringify(result._raw);
      });

      if (!isDup) {
        this.selectedItems[field.key] = [
          ...this.selectedItems[field.key],
          { ...result, qty: 1 },
        ];
      }

      this.updateFormData(field);

      this.searchQueries[field.key] = ""; // Clear search query after selection
      this.searchResults[field.key] = [];
      this.searchNoResult[field.key] = false;
    },

    removeSelectedItem(field, index) {
      this.selectedItems[field.key].splice(index, 1);
      this.updateFormData(field);
    },

    updateFormData(field) {
      this.formData[field.key] = this.selectedItems[field.key].map((item) => {
        const updated = { ...item._raw, ...item };
        delete updated._raw;
        return updated;
      });
    },

    closeDropdown(key) {
      this.searchResults[key] = [];
    },

    // ── Summary Dropdowns ──
    toggleSummaryDropdown(key) {
      const current = !!this.openSummaryDropdowns[key];
      this.openSummaryDropdowns = {}; // close others
      this.openSummaryDropdowns[key] = !current;
    },
    closeSummaryDropdown(key) {
      this.openSummaryDropdowns[key] = false;
    },
    selectSummaryOption(field, opt) {
      this.formData[field.key] = this.getOptionValue(opt);
      this.closeSummaryDropdown(field.key);
    },
    getSelectedLabel(field) {
      const val = this.formData[field.key];

      // Treat only null/undefined/empty-string as "no selection" so falsy IDs like 0 still work.
      if (val === null || val === undefined || val === "") return null;

      const opt = field.options.find((o) => this.getOptionValue(o) === val);
      return opt ? this.getOptionLabel(opt) : val;
    },

    handleSubmit() {
      this.$emit("create", { ...this.formData });
    },

    handleCancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
.form-control,
.form-select {
  border-width: 1px;
  border-color: #d2d2d2;
}

.form-control:focus,
.form-select:focus {
  border-width: 2px;
  border-color: #67748e;
}

/* ── Search field ── */
/* Summary row must stay above the main form controls so its dropdowns remain clickable. */
.summary-row {
  position: relative;
  z-index: 1061;
}

.search-field-wrapper {
  position: relative;
}

.search-spinner {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

/* ── Custom Dropdown for Summary ── */
.custom-dropdown {
  position: relative;
  cursor: pointer;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  color: #1e293b;
  padding: 2px 0;
}

.dropdown-menu-custom {
  position: absolute;
  top: 100%;
  left: 0;
  /* Keep summary dropdown above the search field/results dropdown (which uses z-index ~1050/1051). */
  z-index: 9999;
  min-width: 200px;
  background: #fff;
  border-radius: 8px;
  margin-top: 8px;
  /* Keep the dropdown compact; scroll when there are many options. */
  max-height: 240px;
  overflow-y: auto;
  overflow-x: hidden;
  /* Rendered only when open via `v-if`, so keep it visible when mounted. */
  display: block;
}

.dropdown-item-custom {
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
  transition: all 0.2s;
}

.dropdown-item-custom:hover {
  background: #f8fafc;
  color: #ff9f43;
}

/* ── Custom Textarea for Summary ── */
.summary-textarea {
  width: 100%;
  padding: 3px 5px;
  margin-top: 4px;
  font-weight: 500;
  color: #334155;
  min-height: 24px;
  line-height: 1.4;
  transition: all 0.2s ease;
  border: 1px solid #cbd5e1;
}

.summary-textarea:focus {
  outline: none;
  background: rgba(255, 159, 67, 0.03);
  /* Subtle brand hint */
  border-radius: 4px;
  padding: 6px 10px;
  margin-left: -10px;
  width: calc(100% + 20px);
  border: 1px solid #ff9f43;
}

.summary-textarea::placeholder {
  font-weight: 400;
  color: #cbd5e1;
}

/* ── Search results dropdown ── */
.search-results-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background: #fff;
  z-index: 1050;
  margin-top: -10px;
}

.search-result-item {
  cursor: pointer;
  transition: background 0.2s;
}

.search-result-item:hover {
  background: #f8fafc;
}

.search-result-item:last-child {
  border-bottom: none !important;
}

.result-details {
  flex: 1;
}
</style>
