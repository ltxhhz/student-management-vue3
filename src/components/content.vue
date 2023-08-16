<template>
  <n-layout has-sider class="container">
    <n-layout-sider bordered content-style="padding:20px">
      <n-h2 style="text-align: center;">spring boot</n-h2>
      <n-space vertical>
        <n-list clickable hoverable show-divider>
          <template #header>
            导航
          </template>
          <n-list-item @click="routerLinkTo('info')">
            信息管理
          </n-list-item>
          <n-list-item @click="routerLinkTo('course')">
            课程管理
          </n-list-item>
        </n-list>
        <n-button @click="test" block>test</n-button>
        <n-divider dashed></n-divider>
      </n-space>
    </n-layout-sider>
    <n-layout>
      <n-layout-header bordered>
        <n-space justify="space-between" align="center" style="padding: 20px;">
          <n-h3 prefix="bar" style="margin: 0;" align-text>
            <n-text>{{ topLeftTitle }}</n-text>
          </n-h3>
          <n-space>
            <n-button @click.stop="changeTheme" quaternary>主题{{ props.themeMode }}</n-button>
            <n-button quaternary v-if="bus.isLogin" @click="logout">登出</n-button>
          </n-space>
        </n-space>
      </n-layout-header>
      <n-layout-content content-style="padding: 24px;">
        <router-view>
        </router-view>
      </n-layout-content>
      <n-layout-footer bordered position="absolute">
        <n-space justify="space-between" align="center" style="padding: 20px;">
          footer
        </n-space>
      </n-layout-footer>
    </n-layout>
  </n-layout>
  <n-modal v-model:show="showLoginStatus" preset="dialog" title="登录" :closable="false" :mask-closable="false">
    <!-- <login /> -->
    <n-form-item label="账号">
      <n-input v-model:value="user.account"></n-input>
    </n-form-item>
    <n-form-item label="密码">
      <n-input v-model:value="user.password" type="password" @keyup.enter="login"></n-input>
    </n-form-item>
    <template #action>
      <n-button @click="login" :disabled="!user.account || !user.password">登录</n-button>
    </template>
  </n-modal>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NLayoutFooter, useMessage, NButton, NH2, NSpace, NText, NDivider, NList, NListItem, NH3, NModal, NFormItem, NInput } from 'naive-ui'
import { RouterView, useRouter } from 'vue-router'
import superagent from 'superagent'
import Cookies from 'js-cookie'
import type { ThemeMode } from '../App.vue'
import bus from '../bus'

const message = useMessage()
const router = useRouter()
const topLeftTitle = ref('')

const props = defineProps<{
  themeMode: ThemeMode
}>()

const emits = defineEmits<{
  (e: 'update:themeMode', v: ThemeMode): void
}>()

const showLoginStatus = ref(false)

const user = reactive({
  account: '',
  password: ''
})

if (Cookies.get('user')) {
  checkLogin()
} else {
  showLoginStatus.value = true
}

function login() {
  superagent.post('/user/login')
    .send({
      ...user
    })
    .then(e => {
      console.log(e);
      if (e.body.code == 200) {
        Cookies.set('user', e.body.data)
        showLoginStatus.value = false
        bus.isLogin = true
        message.success('登录成功')
      } else {
        message.error('登录失败')
      }
    }).catch(e => {
      console.error(e);
      message.error('登录失败')
    })
}

function checkLogin() {
  superagent.get('/user/check').then(e => {
    if (e.body.code == 200) {
      bus.isLogin = true
    } else {
      Cookies.remove('user')
      showLoginStatus.value = true
      message.warning('登录状态已过期')
    }
  }).catch(e => {
    console.error(e);
    message.warning('查询登录状态失败')
  })
}

function routerLinkTo(name: string) {
  router.push({ name }).then(() => {
    topLeftTitle.value = {
      course: '学生课程管理',
      info: '学生信息管理'
    }[name]!
  })
}

function changeTheme() {
  console.log(props.themeMode);
  if (props.themeMode == 'auto') {
    emits('update:themeMode', 'light')
    message.success(`切换主题为 light`)
  } else if (props.themeMode == 'light') {
    emits('update:themeMode', 'dark')
    message.success(`切换主题为 dark`)
  } else {
    emits('update:themeMode', 'auto')
    message.success(`切换主题为 auto`)
  }
}

function logout() {
  Cookies.remove('user')
  bus.isLogin = false
  showLoginStatus.value = true
  message.success('登出成功')
}

function test() {
  superagent.get('/student')
    .query({
      basic: true
    })
    .then(e => {
      console.log(e);

    })
}
</script>
<style lang="less" scoped>
.container {
  height: 100vh;
  display: flex;

}

.text-decoration-none {
  text-decoration: none;
}
</style>