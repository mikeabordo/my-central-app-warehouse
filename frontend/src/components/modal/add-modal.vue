<template>
  <div class="modal fade" :id="modalId">
    <div
      class="modal-dialog modal-dialog-centered custom-modal-two"
      :class="bsDialogClass"
      :style="customWidthStyle"
    >
      <div class="modal-content">
        <div class="page-wrapper-new p-0">
          <div class="content">
            <div class="modal-header border-0 custom-modal-header justify-content-between">
              <div class="page-title">
                <h4>{{ title }}</h4>
              </div>
              <button
                type="button"
                class="close"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="resetForm"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body custom-modal-body">
              <form @submit.prevent="handleSubmit">
                <div class="row">
                <div
                  v-for="field in fields"
                  :key="field.key"
                  :class="['mb-3', 'field-wrapper', colClass(field)]"
                >
                  <label class="form-label">{{ field.label }}</label>

                  <!-- ── API Search field ── -->
                  <div v-if="isSearch(field)" class="search-field-wrapper">
                    <input
                      type="text"
                      class="form-control"
                      v-model="searchQueries[field.key]"
                      :placeholder="field.placeholder || `Search ${field.label}…`"
                      @input="onSearchInput(field, $event)"
                      @keydown.escape="closeDropdown(field.key)"
                      autocomplete="off"
                    />
                    <!-- Loading spinner -->
                    <div v-if="searchLoading[field.key]" class="search-spinner">
                      <span class="spinner-border spinner-border-sm text-secondary" role="status"></span>
                    </div>
                    <!-- Results dropdown -->
                    <ul
                      v-if="searchResults[field.key] && searchResults[field.key].length"
                      class="search-dropdown"
                    >
                      <li
                        v-for="result in searchResults[field.key]"
                        :key="getOptionValue(result)"
                        @mousedown.prevent="selectSearchResult(field, result)"
                      >
                        {{ getOptionLabel(result) }}
                      </li>
                    </ul>
                    <!-- No results hint -->
                    <div
                      v-if="
                        searchNoResult[field.key] &&
                        !searchLoading[field.key] &&
                        searchQueries[field.key].length >= (field.minChars || 1)
                      "
                      class="search-no-result"
                    >
                      No results found
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
                </div><!-- end .row -->

                <div class="modal-footer-btn">
                  <button
                    type="button"
                    class="btn btn-cancel me-2"
                    data-bs-dismiss="modal"
                    @click="resetForm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn btn-submit"
                    data-bs-dismiss="modal"
                  >
                    {{ submitLabel }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  name: "AddModal",
  props: {
    /**
     * Bootstrap modal ID (without #). Must match data-bs-target on the trigger button.
     */
    modalId: { type: String, required: true },

    /** Heading displayed in the modal header. */
    title: { type: String, default: "Add New" },

    /** Label for the submit button. */
    submitLabel: { type: String, default: "Submit" },

    /**
     * Modal width / size.
     *
     * Bootstrap preset → adds the matching dialog class:
     *   "sm"  → modal-sm   (~300 px)
     *   "lg"  → modal-lg   (~800 px)
     *   "xl"  → modal-xl   (~1140 px)
     *
     * Raw CSS value → applied as an inline max-width style:
     *   "600px" | "50rem" | "75%" etc.
     *
     * Omit (or leave "") for the default Bootstrap width (~500 px).
     */
    size: { type: String, default: "" },

    /**
     * Field definitions array. Each object can be:
     *
     * Normal input:
     *   { label, key, type?: "text"|"number"|"email"…, placeholder?, disabled?,
     *     col?: 1-12  ← Bootstrap column width (default 12 = full row) }
     *
     * Dropdown:
     *   { label, key, type: "select"|"dropdown", options: string[]|{value,label}[],
     *     placeholder?, disabled?, col? }
     *
     * API Search (live typeahead — fetches first 10 results):
     *   {
     *     label, key,
     *     type: "search",
     *     endpoint: "/items/search",   // appended with ?q=<query>&limit=10
     *     labelKey?: "name",           // which property to show as label  (default: "name")
     *     valueKey?: "id",             // which property to use as value   (default: "id")
     *     placeholder?: "Search…",
     *     minChars?: 1,                // minimum chars before firing request (default: 1)
     *     debounce?: 350,              // ms debounce (default: 350)
     *     col?,
     *   }
     *
     * Layout examples:
     *   col: 12  → full-width, stacked (flex-column style, default)
     *   col: 6   → two fields side-by-side (grid style)
     *   col: 4   → three fields per row
     */
    fields: { type: Array, default: () => [] },
  },

  emits: ["create"],

  data() {
    return {
      formData: {},
      // search-field state keyed by field.key
      searchQueries:  {},
      searchResults:  {},
      searchLoading:  {},
      searchNoResult: {},
      _debounceTimers: {},
    };
  },

  watch: {
    fields: {
      handler(newFields) {
        this.initFormData(newFields);
      },
      immediate: true,
    },
  },

  computed: {
    /** Adds a Bootstrap size class when size is a preset keyword. */
    bsDialogClass() {
      const presets = { sm: "modal-sm", lg: "modal-lg", xl: "modal-xl" };
      return presets[this.size] || "";
    },
    /** Applies a custom max-width when size is a raw CSS value (e.g. "700px"). */
    customWidthStyle() {
      const presets = ["sm", "lg", "xl", ""];
      return presets.includes(this.size) ? {} : { maxWidth: this.size };
    },
  },

  methods: {
    // ─── Helpers ────────────────────────────────────────────────────────────

    isDropdown(field) {
      return field.type === "select" || field.type === "dropdown";
    },
    isSearch(field) {
      return field.type === "search";
    },
    getOptionValue(opt) {
      return typeof opt === "object" && opt !== null ? opt.value : opt;
    },
    getOptionLabel(opt) {
      return typeof opt === "object" && opt !== null ? opt.label : opt;
    },
    /**
     * Returns the Bootstrap col class for a field.
     * col: 12  → "col-12"  (full row — flex-column style)
     * col: 6   → "col-12 col-md-6"  (grid, responsive)
     * col: 4   → "col-12 col-md-4"
     * unset    → defaults to col-12
     */
    colClass(field) {
      const n = field.col;
      if (!n || n === 12) return "col-12";
      return `col-12 col-md-${n}`;
    },

    // ─── Data init ──────────────────────────────────────────────────────────

    initFormData(fields) {
      const fresh = {};
      const queries = {};
      const results = {};
      const loading = {};
      const noResult = {};

      fields.forEach((f) => {
        fresh[f.key]    = "";
        queries[f.key]  = "";
        results[f.key]  = [];
        loading[f.key]  = false;
        noResult[f.key] = false;
      });

      this.formData      = fresh;
      this.searchQueries = queries;
      this.searchResults = results;
      this.searchLoading = loading;
      this.searchNoResult = noResult;
    },

    // ─── Search field ────────────────────────────────────────────────────────

    onSearchInput(field, event) {
      const query = event.target.value;
      this.searchQueries[field.key] = query;

      // Clear stored value if the user clears / changes the query
      this.formData[field.key] = "";
      this.searchResults[field.key]  = [];
      this.searchNoResult[field.key] = false;

      const minChars = field.minChars ?? 1;
      if (query.length < minChars) return;

      // Debounce
      clearTimeout(this._debounceTimers[field.key]);
      this._debounceTimers[field.key] = setTimeout(
        () => this.fetchSearchResults(field, query),
        field.debounce ?? 350
      );
    },

    async fetchSearchResults(field, query) {
      this.searchLoading[field.key]  = true;
      this.searchNoResult[field.key] = false;

      try {
        const response = await api.get(
          `${field.endpoint}?q=${encodeURIComponent(query)}&limit=10`
        );

        // Accept both { data: [] } and a raw array
        const raw = Array.isArray(response)
          ? response
          : response.data ?? [];

        // Map to { value, label } using configurable keys
        const valueKey = field.valueKey ?? "id";
        const labelKey = field.labelKey ?? "name";

        this.searchResults[field.key] = raw.slice(0, 10).map((item) => ({
          value: item[valueKey],
          label: item[labelKey],
          _raw:  item,          // keep original for emit
        }));

        this.searchNoResult[field.key] = this.searchResults[field.key].length === 0;
      } catch (err) {
        console.error(`[AddModal] search error for "${field.key}":`, err);
        this.searchResults[field.key]  = [];
        this.searchNoResult[field.key] = true;
      } finally {
        this.searchLoading[field.key] = false;
      }
    },

    selectSearchResult(field, result) {
      this.formData[field.key]       = result.value;
      this.searchQueries[field.key]  = result.label;
      this.searchResults[field.key]  = [];
      this.searchNoResult[field.key] = false;
    },

    closeDropdown(key) {
      this.searchResults[key] = [];
    },

    // ─── Submit / Reset ──────────────────────────────────────────────────────

    handleSubmit() {
      this.$emit("create", { ...this.formData });
      this.resetForm();
    },

    resetForm() {
      this.initFormData(this.fields);
    },
  },
};
</script>

<style scoped>
.form-control,
.form-select {
  border-width: 1px;
  border-color: gray;
}
.form-control:focus,
.form-select:focus {
  border-width: 2px;
  border-color: #67748e;
}

/* ── Search field ── */
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

.search-dropdown {
  position: absolute;
  z-index: 1055;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #d0d5dd;
  border-radius: 6px;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  max-height: 220px;
  overflow-y: auto;
}

.search-dropdown li {
  padding: 8px 14px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background 0.15s;
}

.search-dropdown li:hover {
  background: #f0f4ff;
  color: #3d5af1;
}

.search-no-result {
  margin-top: 4px;
  font-size: 12px;
  color: #888;
  padding-left: 2px;
}
</style>
