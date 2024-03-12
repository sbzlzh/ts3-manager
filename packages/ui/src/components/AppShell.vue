<template>
  <div>
    <v-app-bar app>
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        v-if="connected"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <dark-mode-switch></dark-mode-switch>
      <file-upload-icon v-if="connected"></file-upload-icon>
      <bell-icon v-if="connected"></bell-icon>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" v-if="connected" width="300">
      <v-list dense class="pt-2" subheader nav>
        <logo></logo>
        <v-divider></v-divider>

        <!-- Avoid v-if with v-for https://v3.vuejs.org/style-guide/#avoid-v-if-with-v-for-essential -->
        <template v-for="(entry, i) in menuEntries">
          <v-list-item
            :key="i"
            v-if="!entry.submenu"
            @click="pushRoute(entry)"
            :class="{ 'v-list-item--active': $route.name === entry.route.name }"
          >
            <v-list-item-icon>
              <v-badge
                color="error"
                :value="entry.title === 'Chat' && $store.getters.unreadMessages"
              >
                <template #badge>
                  <span>{{ $store.getters.unreadMessages }}</span>
                </template>
                <v-icon>{{ entry.icon }}</v-icon>
              </v-badge>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ entry.title }}
                <v-icon v-if="entry.experimental">mdi-test-tube</v-icon>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group v-else :key="i" no-action :prepend-icon="entry.icon">
            <template #activator>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ entry.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item
              v-for="(subEntry, j) in entry.submenu"
              :key="j"
              @click="pushRoute(subEntry)"
              :class="{
                'v-list-item--active': $route.name === subEntry.route.name,
              }"
            >
              <v-list-item-icon>
                <v-icon>{{ subEntry.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ subEntry.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  components: {
    DarkModeSwitch: () => import("@/components/DarkModeSwitch"),
    BellIcon: () => import("@/components/BellIcon"),
    FileUploadIcon: () => import("@/components/FileUploadIcon"),
    Logo: () => import("@/components/Logo"),
    ServerSelection: () => import("@/components/ServerSelection"),
  },
  data() {
    return {
      mini: true,
      drawer: null,
      menuEntries: [
        {
          title: "服务器列表",
          icon: "dns",
          route: { name: "servers" },
        },
        {
          title: "服务器视图",
          icon: "remove_red_eye",
          route: { name: "serverviewer" },
        },
        {
          title: "对话",
          icon: "mail_outline",
          route: { name: "chat" },
        },
        {
          title: "文件浏览器",
          icon: "mdi-folder",
          route: { name: "files" },
        },
        {
          title: "服务器日志",
          icon: "mdi-file-document-outline",
          route: { name: "logs" },
        },
        {
          title: "备份/恢复",
          icon: "settings_backup_restore",
          route: { name: "snapshot" },
        },
        {
          title: "服务器查询",
          icon: "mdi-console",
          route: { name: "console" },
        },
        {
          title: "特权密钥",
          icon: "mdi-key",
          route: { name: "tokens" },
        },
        {
          title: "API密钥",
          icon: "mdi-shield-key",
          route: { name: "apikeys" },
        },
        {
          title: "黑名单",
          icon: "not_interested",
          route: { name: "bans" },
        },
        {
          title: "投诉清单",
          icon: "warning",
          route: { name: "complaints" },
        },

        {
          title: "全部客户端",
          icon: "person",
          route: { name: "clients" },
        },
        {
          title: "服务器组",
          icon: "group",
          route: { name: "servergroups" },
        },
        {
          title: "频道组",
          icon: "mdi-hexagon-slice-4",
          route: { name: "channelgroups" },
        },
        {
          title: "权限",
          icon: "mdi-format-section",
          submenu: [
            {
              title: "服务器组",
              icon: "group",
              route: { name: "permissions-servergroup" },
            },
            {
              title: "用户权限",
              icon: "person",
              route: { name: "permissions-client" },
            },
            {
              title: "频道权限",
              icon: "mdi-hexagon-slice-4",
              route: { name: "permissions-channel" },
            },
            {
              title: "频道组",
              icon: "mdi-hexagon-slice-4",
              route: { name: "permissions-channelgroup" },
            },
            {
              title: "频道用户权限",
              icon: "mdi-hexagon-slice-4",
              route: { name: "permissions-channelclient" },
            },
          ],
        },
        {
          title: "退出登录",
          icon: "exit_to_app",
          route: { name: "logout" },
        },
      ],
    };
  },
  computed: {
    connected() {
      return this.$store.state.query.connected;
    },
  },
  methods: {
    pushRoute(entry) {
      if (entry.route.name !== this.$route.name) {
        this.$router.push(entry.route);
      }
    },
  },
};
</script>
