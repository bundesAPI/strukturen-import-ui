<template>
  <div class="login-container">
    <v-container fill-height>
      <v-row class="justify-center">
        <v-col :xl="6" :md="6" :sm="8" :xs="12" :cols="12">
          <v-sheet color="white" elevation="2" class="my-4 pa-6">
            <div>
              <h1></h1>
              <v-btn
                color="primary"
                raised
                block
                rounded
                class="my-4"
                :href="loginURI"
                tile
              >
                Login
              </v-btn>
            </div>
          </v-sheet></v-col
        ></v-row
      >
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import * as AUTH from "../auth.js";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  data: function () {
    return {
      loginURI: AUTH.loginURI(),
    };
  },
  components: {},
};
</script>
