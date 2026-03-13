<template>
  <div class="sidebar" id="sidebar">
    <div class="sidebar-inner slimscroll">
      <perfect-scrollbar
        class="scroll-area"
        :settings="settings"
        @ps-scroll-y="scrollHanle"
        ref="scrollbar"
      >
        <div id="sidebar-menu" class="sidebar-menu">
          <user-menu></user-menu>
        </div>
      </perfect-scrollbar>
    </div>
  </div>
  <collapsed-sidebar></collapsed-sidebar>
  <horizontal-sidebar></horizontal-sidebar>
</template>

<script>
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css";

export default {
  components: {
    PerfectScrollbar,
  },
  data() {
    return {
      settings: {
        suppressScrollX: true,
      },
    };
  },
  mounted() {
    this.restoreScroll();
  },
  methods: {
    scrollHanle(event) {
      // Save scroll position
      if (event && event.target) {
        sessionStorage.setItem("sidebarScrollTop", event.target.scrollTop);
      }
    },
    restoreScroll() {
      const savedScroll = sessionStorage.getItem("sidebarScrollTop");
      if (savedScroll && this.$refs.scrollbar) {
        // Try multiple times to ensure the height is correct
        const tryRestore = (attempts) => {
          if (attempts <= 0) return;
          const ps = this.$refs.scrollbar.$el;
          if (ps) {
            ps.scrollTop = parseInt(savedScroll, 10);
            if (ps.scrollTop === parseInt(savedScroll, 10)) return; // Success
          }
          setTimeout(() => tryRestore(attempts - 1), 100);
        };
        
        // Initial try
        this.$nextTick(() => tryRestore(5));
      }
    },
  },
};
</script>

<style>
/* Fix perfect-scrollbar overlapping sidebar menu content */
#sidebar .scroll-area {
  position: relative;
}

#sidebar .scroll-area > .ps__rail-y {
  /* Force the rail to the right edge, inside the sidebar border */
  right: 2px !important;
  left: auto !important;
  width: 8px !important;
  background-color: transparent !important;
  z-index: 10;
}

#sidebar .scroll-area > .ps__rail-y > .ps__thumb-y {
  margin-right: 6px !important;
  width: 6px !important;
  right: 1px !important;
  background-color: rgba(0, 0, 0, 0.15) !important;
  border-radius: 3px !important;
}

/* Give the sidebar-menu right padding so text doesn't go under the scrollbar */
#sidebar .scroll-area > .sidebar-menu {
  padding-right: 0.5px;
}

/* Fix: active tab background should not bleed to the right sidebar border (expanded sidebar only) */
:not(.mini-sidebar) #sidebar-menu .submenu-open ul li.active a,
:not(.mini-sidebar) #sidebar-menu .submenu-open ul li a:hover {
  margin-right: 8px !important;
  width: calc(100% - 24px) !important;
  box-sizing: border-box !important;
}

/* Reset for collapsed/mini-sidebar — don't shrink the icon link */
.mini-sidebar #sidebar-menu .submenu-open ul li.active a,
.mini-sidebar #sidebar-menu .submenu-open ul li a:hover {
  margin-right: 0 !important;
  width: 100% !important;
}
</style>
