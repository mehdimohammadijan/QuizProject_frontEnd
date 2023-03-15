<template>
  <v-navigation-drawer color="grey-lighten-4" expand-on-hover permanent rail>
    <v-list>
      <v-list-item
        :prepend-avatar="avatarImage"
        title="Mehdi"
        subtitle="mehdi@gmail.com"
      ></v-list-item>
    </v-list>

    <v-divider> </v-divider>

    <v-list nav density="compact">
      <v-list-item
        v-for="item in sideBarNav"
        :title="item.title"
        :prepend-icon="item.icon"
        :to="item.route"
        :key="item.title"
        exact
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "../../stores/auth";
import avatarImage from "@/assets/profile.jpg";

const authStore = useAuthStore();

const sideBarNav = computed(() => {
  let navBar = [
    { title: "Sign in", icon: "mdi-login", route: "/signin" },
    { title: "Sign up", icon: "mdi-account-plus", route: "/signup" },
    { title: "Create Practice", icon:"mdi-pencil-box-outline", route: "/listpractice" },
  ];
  if (authStore.user) {
    navBar = [
      { title: "Account", icon: "mdi-home", route: "/account" },
      { title: "Sign out", icon: "mdi-logout", route: "/signout" },
    ];
  }
  return navBar;
});
</script>

<style scoped></style>
