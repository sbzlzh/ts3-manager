<template lang="html">
  <v-container>
    <v-layout justify-center>
      <v-flex lg6 md8 sm8 xs12>
        <v-card>
          <v-card-title>Manage Virtual Server</v-card-title>
          <v-card-text>
            <v-text-field
              label="服务器名"
              v-model="serverInfo.virtualserver_name"
              :disabled="$store.state.query.loading"
            ></v-text-field>
            <v-text-field
              label="密码"
              v-model="serverInfo.virtualserver_password"
              :disabled="$store.state.query.loading"
              type="password"
            ></v-text-field>
            <v-layout justify-space-between>
              <v-flex xs5>
                <v-text-field
                  label="最大连接数"
                  v-model="serverInfo.virtualserver_maxclients"
                  :disabled="$store.state.query.loading"
                  type="number"
                ></v-text-field>
              </v-flex>
              <v-flex xs5>
                <v-text-field
                  label="Reserved Slots"
                  v-model="serverInfo.virtualserver_reserved_slots"
                  :disabled="$store.state.query.loading"
                  type="number"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-textarea
              label="欢迎语"
              v-model="serverInfo.virtualserver_welcomemessage"
              :disabled="$store.state.query.loading"
            ></v-textarea>

            <v-expansion-panels accordion flat>
              <v-expansion-panel>
                <v-expansion-panel-header> Host </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card outlined>
                    <v-card-subtitle>弹出消息</v-card-subtitle>
                    <v-card-text>
                      <v-text-field
                        label="消息"
                        v-model="serverInfo.virtualserver_hostmessage"
                        :disabled="$store.state.query.loading"
                      ></v-text-field>
                      <v-select
                        label="消息弹出模式"
                        v-model="serverInfo.virtualserver_hostmessage_mode"
                        :items="messageModes"
                      ></v-select>
                    </v-card-text>
                  </v-card>
                  <v-card class="mt-2" outlined>
                    <v-card-subtitle>横幅</v-card-subtitle>
                    <v-card-text>
                      <v-text-field
                        label="横幅连接"
                        v-model="serverInfo.virtualserver_hostbanner_gfx_url"
                        :disabled="$store.state.query.loading"
                      ></v-text-field>
                      <v-text-field
                        label="跳转连接"
                        v-model="serverInfo.virtualserver_hostbanner_url"
                        :disabled="$store.state.query.loading"
                      ></v-text-field>
                      <v-layout justify-space-between>
                        <v-flex xs4>
                          <v-text-field
                            label="Gfx Interval"
                            v-model="
                              serverInfo.virtualserver_hostbanner_gfx_interval
                            "
                            type="number"
                            :disabled="$store.state.query.loading"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs6>
                          <v-select
                            label="调整"
                            :items="bannerModes"
                            v-model="serverInfo.virtualserver_hostbanner_mode"
                          ></v-select>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                  <v-card class="my-2" outlined>
                    <v-card-subtitle>Host 按钮</v-card-subtitle>
                    <v-card-text>
                      <v-text-field
                        label="提示"
                        v-model="serverInfo.virtualserver_hostbutton_tooltip"
                        :disabled="$store.state.query.loading"
                      ></v-text-field>
                      <v-text-field
                        label="链接"
                        v-model="serverInfo.virtualserver_hostbutton_url"
                        :disabled="$store.state.query.loading"
                      ></v-text-field>
                      <v-text-field
                        label="Icon 链接"
                        v-model="serverInfo.virtualserver_hostbutton_gfx_url"
                        :disabled="$store.state.query.loading"
                      ></v-text-field>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header> Transfers </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card outlined>
                    <v-card-subtitle>上传</v-card-subtitle>
                    <v-card-text>
                      <v-text-field
                        label="带宽限制"
                        v-model="
                          serverInfo.virtualserver_max_upload_total_bandwidth
                        "
                        :disabled="$store.state.query.loading"
                        type="number"
                      >
                        <template #append>
                          <div>Byte/s</div>
                        </template>
                      </v-text-field>
                      <v-text-field
                        label="上传限额"
                        v-model="serverInfo.virtualserver_upload_quota"
                        :disabled="$store.state.query.loading"
                        type="number"
                      >
                        <template #append>
                          <div>MiB</div>
                        </template>
                      </v-text-field>
                    </v-card-text>
                  </v-card>
                  <v-card class="my-2" outlined>
                    <v-card-subtitle>下载</v-card-subtitle>
                    <v-card-text>
                      <v-text-field
                        label="带宽限制"
                        v-model="
                          serverInfo.virtualserver_max_download_total_bandwidth
                        "
                        :disabled="$store.state.query.loading"
                        type="number"
                      >
                        <template #append>
                          <div>Byte/s</div>
                        </template>
                      </v-text-field>
                      <v-text-field
                        label="下载限额"
                        v-model="serverInfo.virtualserver_download_quota"
                        :disabled="$store.state.query.loading"
                        type="number"
                      >
                        <template #append>
                          <div>MiB</div>
                        </template>
                      </v-text-field>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  攻击防范
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card class="mb-2" outlined>
                    <v-card-text>
                      <v-text-field
                        label="Reduced point per tick"
                        v-model="
                          serverInfo.virtualserver_antiflood_points_tick_reduce
                        "
                        :disabled="$store.state.query.loading"
                        type="number"
                      ></v-text-field>
                      <v-text-field
                        label="Points needed to block commands"
                        v-model="
                          serverInfo.virtualserver_antiflood_points_needed_command_block
                        "
                        :disabled="$store.state.query.loading"
                        type="number"
                      ></v-text-field>
                      <v-text-field
                        label="Points needed to block IP"
                        v-model="
                          serverInfo.virtualserver_antiflood_points_needed_ip_block
                        "
                        :disabled="$store.state.query.loading"
                        type="number"
                      ></v-text-field>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header> 安全 </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card class="mb-2" outlined>
                    <v-card-text>
                      <v-text-field
                        label="所需安全等级"
                        v-model="
                          serverInfo.virtualserver_needed_identity_security_level
                        "
                        :disabled="$store.state.query.loading"
                        type="number"
                      ></v-text-field>
                      <v-select
                        label="频道语音数据加密"
                        v-model="serverInfo.virtualserver_codec_encryption_mode"
                        :items="encryptionModes"
                      ></v-select>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header> 其他 </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card outlined>
                    <v-card-subtitle>默认组</v-card-subtitle>
                    <v-card-text>
                      <v-autocomplete
                        :items="serverGroups"
                        item-text="name"
                        item-value="sgid"
                        v-model="serverInfo.virtualserver_default_server_group"
                        label="服务器组"
                        :disabled="$store.state.query.loading"
                      >
                        <template #selection="{ item }">
                          <div>{{ item.name }} ({{ item.sgid }})</div>
                        </template>
                        <template #item="{ item }">
                          <div>{{ item.name }} ({{ item.sgid }})</div>
                        </template>
                      </v-autocomplete>
                      <v-autocomplete
                        :items="channelGroups"
                        item-text="name"
                        item-value="cgid"
                        v-model="serverInfo.virtualserver_default_channel_group"
                        label="频道组"
                        :disabled="$store.state.query.loading"
                      >
                        <template #selection="{ item }">
                          <div>{{ item.name }} ({{ item.cgid }})</div>
                        </template>
                        <template #item="{ item }">
                          <div>{{ item.name }} ({{ item.cgid }})</div>
                        </template>
                      </v-autocomplete>
                      <v-autocomplete
                        :items="channelGroups"
                        item-text="name"
                        item-value="cgid"
                        v-model="
                          serverInfo.virtualserver_default_channel_admin_group
                        "
                        label="频道管理员组"
                        :disabled="$store.state.query.loading"
                      >
                        <template #selection="{ item }">
                          <div>{{ item.name }} ({{ item.cgid }})</div>
                        </template>
                        <template #item="{ item }">
                          <div>{{ item.name }} ({{ item.cgid }})</div>
                        </template>
                      </v-autocomplete>
                    </v-card-text>
                  </v-card>
                  <v-card class="mt-2" outlined>
                    <v-card-subtitle>投诉</v-card-subtitle>
                    <v-card-text>
                      <v-layout justify-space-between wrap>
                        <v-flex xs5 md3>
                          <v-text-field
                            label="自动禁言次数"
                            :disabled="$store.state.query.loading"
                            v-model="
                              serverInfo.virtualserver_complain_autoban_count
                            "
                            type="number"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs5 md3>
                          <v-text-field
                            label="自动禁言时间"
                            :disabled="$store.state.query.loading"
                            v-model="
                              serverInfo.virtualserver_complain_autoban_time
                            "
                            type="number"
                          >
                            <template #append>
                              <div>sec</div>
                            </template>
                          </v-text-field>
                        </v-flex>
                        <v-flex xs5 md3>
                          <v-text-field
                            label="移除时间"
                            :disabled="$store.state.query.loading"
                            v-model="
                              serverInfo.virtualserver_complain_remove_time
                            "
                            type="number"
                          >
                            <template #append>
                              <div>sec</div>
                            </template>
                          </v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                  <v-card class="my-2" outlined>
                    <v-card-text>
                      <v-text-field
                        label="静默前通道中的最小客户端数"
                        :disabled="$store.state.query.loading"
                        v-model="
                          serverInfo.virtualserver_min_clients_in_channel_before_forced_silence
                        "
                        type="number"
                      ></v-text-field>
                      <v-text-field
                        label="Priority Speaker dim modificator"
                        :disabled="$store.state.query.loading"
                        v-model="
                          serverInfo.virtualserver_priority_speaker_dimm_modificator
                        "
                        type="number"
                      ></v-text-field>
                      <v-text-field
                        label="临时频道删除时间"
                        :disabled="$store.state.query.loading"
                        v-model="
                          serverInfo.virtualserver_channel_temp_delete_delay_default
                        "
                        type="number"
                      ></v-text-field>
                      <v-text-field
                        label="发音名称"
                        :disabled="$store.state.query.loading"
                        v-model="serverInfo.virtualserver_name_phonetic"
                      ></v-text-field>
                      <v-checkbox
                        label="允许向服务器列表报告"
                        v-model="weblistEnabled"
                      ></v-checkbox>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header> Logs </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card class="mb-2" outlined>
                    <v-card-subtitle>启用日志记录</v-card-subtitle>
                    <v-card-text>
                      <v-checkbox
                        label="客户端"
                        v-model="logClient"
                      ></v-checkbox>
                      <v-checkbox
                        label="频道"
                        v-model="logChannel"
                      ></v-checkbox>
                      <v-checkbox
                        label="服务器"
                        v-model="logServer"
                      ></v-checkbox>
                      <v-checkbox
                        label="服务器查询"
                        v-model="logQuery"
                      ></v-checkbox>
                      <v-checkbox
                        label="权限"
                        v-model="logPermissions"
                      ></v-checkbox>
                      <v-checkbox
                        label="文件传输"
                        v-model="logFileTransfer"
                      ></v-checkbox>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              :disabled="this.$store.state.query.loading"
              color="primary"
              @click="saveChanges"
              >OK
            </v-btn>
            <v-btn text @click="$router.go(-1)" color="primary">Cancel</v-btn>
            <v-btn
              text
              :disabled="this.$store.state.query.loading"
              color="primary"
              @click="applyChanges"
              >Apply
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      serverInfo: {},
      serverInfoCopy: {},
      messageModes: [
        { text: "No message", value: 0 },
        { text: "Show message in log", value: 1 },
        { text: "Show modal message", value: 2 },
        { text: "Modal message and exit", value: 3 },
      ],
      bannerModes: [
        { text: "Do not adjust", value: 0 },
        { text: "Adjust but ignore aspect ratio", value: 1 },
        { text: "Adjust and keep aspect ratio", value: 2 },
      ],
      encryptionModes: [
        { text: "Configure per Channel", value: 0 },
        { text: "Globally Off", value: 1 },
        { text: "Globally On", value: 2 },
      ],
      serverGroups: [],
      channelGroups: [],
    };
  },
  computed: {
    weblistEnabled: {
      get() {
        return this.serverInfo.virtualserver_weblist_enabled ? true : false;
      },
      set(bool) {
        this.serverInfo.virtualserver_weblist_enabled = bool ? 1 : 0;
      },
    },
    logClient: {
      get() {
        return this.serverInfo.virtualserver_log_client ? true : false;
      },
      set(bool) {
        this.serverInfo.virtualserver_log_client = bool ? 1 : 0;
      },
    },
    logQuery: {
      get() {
        return this.serverInfo.virtualserver_log_query ? true : false;
      },
      set(bool) {
        this.serverInfo.virtualserver_log_query = bool ? 1 : 0;
      },
    },
    logChannel: {
      get() {
        return this.serverInfo.virtualserver_log_channel ? true : false;
      },
      set(bool) {
        this.serverInfo.virtualserver_log_channel = bool ? 1 : 0;
      },
    },
    logPermissions: {
      get() {
        return this.serverInfo.virtualserver_log_permissions ? true : false;
      },
      set(bool) {
        this.serverInfo.virtualserver_log_permissions = bool ? 1 : 0;
      },
    },
    logServer: {
      get() {
        return this.serverInfo.virtualserver_log_server ? true : false;
      },
      set(bool) {
        this.serverInfo.virtualserver_log_server = bool ? 1 : 0;
      },
    },
    logFileTransfer: {
      get() {
        return this.serverInfo.virtualserver_log_filetransfer ? true : false;
      },
      set(bool) {
        this.serverInfo.virtualserver_log_filetransfer = bool ? 1 : 0;
      },
    },
  },
  methods: {
    getServerInfo() {
      return this.$TeamSpeak.execute("serverinfo").then((arr) => arr[0]);
    },
    getServerGroupList() {
      return this.$TeamSpeak
        .execute("servergrouplist")
        .then((groups) => groups.filter((group) => group.type === 1));
    },
    getChannelGroupList() {
      return this.$TeamSpeak
        .execute("channelgrouplist")
        .then((groups) => groups.filter((group) => group.type === 1));
    },
    getChanges() {
      let changes = {};

      for (let prop in this.serverInfo) {
        if (this.serverInfo[prop] !== this.serverInfoCopy[prop]) {
          changes[prop] = this.serverInfo[prop];
        }
      }

      return changes;
    },
    serverEdit() {
      return this.$TeamSpeak.execute("serveredit", this.getChanges());
    },
    async saveChanges() {
      try {
        await this.serverEdit();

        this.$router.go(-1);
      } catch (err) {
        this.$toast.error(err.message);
      }
    },
    async applyChanges() {
      try {
        await this.serverEdit();
      } catch (err) {
        this.$toast.error(err.message);
      }

      this.init();
    },
    async init() {
      try {
        this.serverInfo = await this.getServerInfo();
        this.serverInfoCopy = { ...this.serverInfo };
        this.serverGroups = await this.getServerGroupList();
        this.channelGroups = await this.getChannelGroupList();
      } catch (err) {
        this.$toast.error(err.message);
      }
    },
  },
  created() {
    this.init();
  },
};
</script>
