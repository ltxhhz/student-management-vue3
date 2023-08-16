<template>
  <n-space style="margin-bottom: 20px;">
    <n-button @click="showAddModal" type="primary">添加</n-button>
  </n-space>
  <n-data-table :columns="columns" :data="data" striped></n-data-table>
  <n-modal preset="dialog" title="添加学生" v-model:show="showAddModalStatus">
    <n-space vertical>
      <n-input-number placeholder="学号" v-model:value="addForm.sid" clearable />
      <n-input placeholder="姓名" v-model:value="addForm.name" />
      <n-select v-model:value="addForm.gender" placeholder="性别"
        :options="[{ label: '男', value: '男' }, { label: '女', value: '女' }]" />
      <n-select placeholder="班级" v-model:value="addForm.clid"
        :options="classList.map(e => ({ label: e.clname, value: e.clid }))" />
      <n-date-picker placeholder="出生日期" v-model:value="addForm.birthdate" type="date" />
      <n-input placeholder="电话" v-model:value="addForm.telephone" />
    </n-space>
    <template #action>
      <n-button @click="addInfo">确定</n-button>
    </template>
  </n-modal>
</template>
<script setup lang="ts">
import { watch, reactive, h, ref } from "vue";
import { NDataTable, DataTableColumns, NSpace, NButton, NModal, NInput, NInputNumber, NSelect, NDatePicker, useMessage } from 'naive-ui'
import ShowOrEdit from "../components/showOrEdit.vue";
import superagent from 'superagent'
import dayjs from "dayjs";
import bus from '../bus';

interface Info {
  sid: number
  name: string
  gender: string
  clname: string
  birthdate: string
  telephone: string
  headTeacher: string
}
interface Class {
  clid: number
  clname: string
  did: number
  tid: number
}
function getDataIndex(sid: number) {
  return data.findIndex((item) => item.sid === sid)
}

function bindFunc(rowData: Info, key: keyof Info) {
  const index = getDataIndex(rowData.sid)
  return h(ShowOrEdit, {
    value: rowData[key],
    'onUpdate:value': function (v: any) {
      (data[index][key] as string | number) = v
    }
  })
}

const message = useMessage()
const columns: DataTableColumns<Info> = [{
  title: '学号',
  key: 'sid',
  render: (rowData) => bindFunc(rowData, 'sid'),
}, {
  title: '姓名',
  key: 'name',
  render: (rowData) => bindFunc(rowData, 'name'),

}, {
  title: '性别',
  key: 'gender',
  render: (rowData) => bindFunc(rowData, 'gender'),

}, {
  title: '班级',
  key: 'clname',
  render: (rowData) => bindFunc(rowData, 'clname'),

}, {
  title: '手机',
  key: 'telephone',
  render: (rowData) => bindFunc(rowData, 'telephone'),

}, {
  title: '出生日期',
  key: 'birthdate',
  render: (rowData) => bindFunc(rowData, 'birthdate'),

}, {
  title: '班主任',
  key: 'headTeacher',
  render: (rowData) => bindFunc(rowData, 'headTeacher'),
}]
const data = reactive<Info[]>([])
const addForm = reactive({
  sid: undefined,
  name: undefined,
  gender: undefined,
  clid: undefined,
  telephone: undefined,
  birthdate: undefined
})
const showAddModalStatus = ref(false)

const classList = reactive<Class[]>([])

watch(() => bus.isLogin, v => {
  console.log('登录状态',v);
  
  if (v && !data.length) {
    getInfoList()
  }
}, {
  immediate: true
})

function getInfoList() {
  superagent.get('/student')
    .then(e => {
      if (e.body.code == 200) {
        data.length = 0
        data.push(...e.body.data)
      } else {
        message.error('获取学生信息失败')
      }
    }).catch(e => {
      console.error(e);
      message.error('获取学生信息失败')
    })
}

function showAddModal() {
  for (const key in addForm) {
    if (Object.hasOwn(addForm, key)) {
      addForm[key as keyof typeof addForm] = undefined
    }
  }
  superagent.get('/class')
    .then(e => {
      if (e.body.code == 200) {
        classList.length = 0
        classList.push(...e.body.data)
        showAddModalStatus.value = true
      } else {
        message.warning('获取班级信息失败')
      }
    }).catch((e) => {
      console.error(e);
      message.warning('获取班级信息失败')
    })
}

function addInfo() {
  const msg = message.loading('添加中')
  const record = { ...addForm, birthdate: dayjs(addForm.birthdate).format('YYYY-MM-DD') }
  superagent.post('/student')
    .send(record).then(e => {
      if (e.body.code == 200) {
        message.success('添加成功')
        showAddModalStatus.value = false
        getInfoList()
      } else {
        message.error('添加失败')
      }
    }).catch(() => {
      message.error('添加失败')
    }).finally(() => {
      msg.destroy()
    })
}

</script>
<style lang="less"></style>