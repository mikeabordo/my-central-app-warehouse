<template>
  <div class="account-page">
    <div class="account-content">
      <div class="login-wrapper">
        <div class="login-content">
          <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }">
            <div class="login-userset">
              <div class="login-logo">
                <img src="@/assets/img/logo/mycentralapp-logo-v3.webp" alt="img" />
              </div>
              <div class="login-userheading">
                <h4>Access the MyCentralApp - Warehouse System panel using your ID and Passcode.</h4>
              </div>
              <div class="form-login mb-3">
                <label class="form-label">ID Number</label>
                <div class="form-addons">
                  <Field
                    name="idnumber"
                    type="text"
                    placeholder="Enter your ID number"
                    class="form-control"
                    :class="{ 'is-invalid': errors.idnumber }"
                  />
                  <div class="invalid-feedback">{{ errors.idnumber }}</div>
                  <div class="emailshow text-danger" id="idnumber"></div>
                  <img src="@/assets/img/icons/mail.svg" alt="img" />
                </div>
              </div>
              <div class="form-login mb-3">
                <label class="form-label">Password</label>
                <div class="pass-group">
                  <Field
                    name="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Enter your password"
                    class="form-control pass-input"
                    :class="{ 'is-invalid': errors.password }"
                  />
                  <span @click="toggleShow" class="toggle-password">
                    <i
                      :class="{
                        'fas fa-eye': showPassword,
                        'fas fa-eye-slash': !showPassword,
                      }"
                    ></i>
                  </span>
                  <div class="invalid-feedback">{{ errors.password }}</div>
                  <div class="emailshow text-danger" id="password"></div>
                </div>
              </div>
              <div class="form-login authentication-check">
                <div class="row">
                  <div class="col-12 d-flex align-items-center justify-content-between">
                  </div>
                </div>
              </div>
              <div class="form-login">
                <button type="submit" class="btn btn-login" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ isLoading ? 'Signing in...' : 'Sign In' }}
                </button>
              </div>
              <!-- General API error message -->
              <div v-if="apiError" class="alert alert-danger mt-3 text-center" role="alert">
                {{ apiError }}
              </div>
              <div class="form-sociallink">
                <div
                  class="my-4 d-flex justify-content-center align-items-center copyright-text"
                >
                  <p>
                    &copy; {{ new Date().getFullYear() }} Central Book Supply, Inc. All rights
                    reserved
                  </p>
                </div>
              </div>
            </div>
          </Form>
        </div>
        <!-- Background Image -->
        <div class="login-img">
          <img src="@/assets/img/authentication/login02.png" alt="img" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { router } from "@/router";
import { Form, Field } from "vee-validate";
import * as Yup from "yup";
import authService from "@/services/authService";

export default {
  components: {
    Form,
    Field,
  },
  data() {
    return {
      showPassword: false,
      password: null,
      isLoading: false,
      apiError: "",
    };
  },
  computed: {
    buttonLabel() {
      return this.showPassword ? "Hide" : "Show";
    },
  },
  methods: {
    toggleShow() {
      this.showPassword = !this.showPassword;
    },
  },
  setup() {
    // Validation schema – idnumber is required (no email validation)
    const schema = Yup.object().shape({
      idnumber: Yup.string()
        .required("ID Number is required")
        .min(3, "ID Number must be at least 3 characters"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    });

    const isLoading = ref(false);
    const apiError = ref("");

    const onSubmit = async (values) => {
      // Clear previous error messages
      document.getElementById("idnumber").innerHTML = "";
      document.getElementById("password").innerHTML = "";
      apiError.value = "";
      isLoading.value = true;

      try {
        // Call the backend API to validate login credentials
        const response = await authService.login(values.idnumber, values.password);

        if (response.status) {
          // Login successful – redirect to dashboard
          router.push("/dashboard");
        } else {
          // Server returned a failure response
          apiError.value = response.message || "Login failed. Please try again.";
        }
      } catch (error) {
        // Handle specific error cases from the API
        if (error.status === 401) {
          // Invalid credentials
          const errorData = error.data;
          if (errorData && errorData.errors) {
            if (errorData.errors.idnumber) {
              document.getElementById("idnumber").innerHTML = errorData.errors.idnumber;
            }
            if (errorData.errors.password) {
              document.getElementById("password").innerHTML = errorData.errors.password;
            }
          } else {
            apiError.value = error.message || "Invalid ID Number or password.";
          }
        } else if (error.status === 422) {
          // Validation errors from server
          const errorData = error.data;
          if (errorData && errorData.errors) {
            if (errorData.errors.idnumber) {
              document.getElementById("idnumber").innerHTML = errorData.errors.idnumber;
            }
            if (errorData.errors.password) {
              document.getElementById("password").innerHTML = errorData.errors.password;
            }
          }
        } else {
          // Network or unexpected error
          apiError.value = error.message || "Unable to connect to the server.";
        }
      } finally {
        isLoading.value = false;
      }
    };

    return {
      schema,
      onSubmit,
      isLoading,
      apiError,
      checked: ref(false),
    };
  },
};
</script>

<style scoped>
/* Override the global constraints on the logo container and image */
.login-logo {
  max-width: 300px !important; /* This overrides the 150px in _login.scss */
  margin: 0 auto !important;
}

.login-logo img {
  width: 100% !important;
  height: auto !important;
  max-width: none !important; /* This overrides the max-width: 100% in style.css */
}

/* Pin the eye icon to the top center of the input field */
.pass-group {
  position: relative;
}

.toggle-password {
  top: 10px !important; /* Fixed position from top */
  transform: none !important; /* Disable the middle-centering that causes jumping */
  right: 10px !important;
}

/* Ensure the input doesn't have extra margin that affects the icon placement */
.pass-input {
  margin-top: 0 !important;
}

/* Remove Bootstrap's default error/alert icon (background image) */
.form-control.is-invalid {
  background-image: none !important;
  padding-right: 0.75rem !important; /* Reset padding to standard if needed */
}
</style>
