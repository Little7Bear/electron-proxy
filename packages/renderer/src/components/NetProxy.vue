<template>
  <div class="net-proxy">
    <el-button :icon="Setting" style="margin-bottom: 16px" @click="setShow"> 卡片配置 </el-button>

    <div class="card-wrapper">
      <el-card
        v-for="(item, index) in urls"
        :key="index"
        shadow="hover"
        class="card"
        :class="{ card_checked: item.value === url }"
        :header="item.title"
        @click="onSelect(item.value)"
        @dblclick="onSwitchUrl(item.value)"
      >
        <Check v-show="item.value === url" class="checked-icon" />
        {{ item.value }}
      </el-card>
    </div>
  </div>

  <el-form
    ref="ruleFormRef"
    :model="form"
    :rules="rules"
    label-width="80px"
    style="margin-top: 16px"
  >
    <el-form-item label="端口" prop="port">
      <el-input v-model="form.port" type="number" style="width: 150px" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">启动</el-button>
      <el-button type="danger" @click="onNetClose">关闭</el-button>
    </el-form-item>
  </el-form>

  <el-dialog v-model="dialogVisible" title="卡片配置" width="600px" :before-close="handleClose">
    <el-button :icon="Plus" type="primary" @click="onTableAdd"></el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="title" label="title" width="120px">
        <template #default="{ row }">
          <el-input v-model="row.title" style="width: 100%" />
        </template>
      </el-table-column>
      <el-table-column prop="value" label="url">
        <template #default="{ row, $index }">
          <div class="d-flex">
            <el-input v-model="row.value" class="flex-1" style="width: 100%; margin-right: 10px" />
            <el-button :icon="Minus" @click="onTableMinus($index)"></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="setConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { createProxyServer, serveClose } from '#preload';
import { getStorageData, setStorageData } from '/@/utils/index';
import type { FormInstance, FormRules } from 'element-plus';
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Check, Setting, Plus, Minus } from '@element-plus/icons-vue';

const ruleFormRef = ref<FormInstance>();
const form = reactive({
  port: 8466,
});

type Url = {
  title: string;
  value: string;
};

const urls = ref<Url[]>([]);

let url = ref('');

const rules = reactive<FormRules>({
  port: [{ required: true, message: '不能为空', trigger: 'blur' }],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      createProxyServer(url.value, form.port);
      ElMessage.success('服务启动成功');
    } else {
      console.log('error submit!', fields);
    }
  });
};

const onSelect = (value: string) => {
  url.value = value;
};

const onSwitchUrl = (value: string) => {
  onSelect(value);
  submitForm(ruleFormRef.value);
};

const fetchData = () => {
  const data = getStorageData('urls');
  if (data) urls.value = data;
};
fetchData();

const onNetClose = () => {
  ElMessageBox.confirm('确认关闭?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    serveClose();
    ElMessage.success('服务已关闭');
  });
};

// ---卡片配置start---
const dialogVisible = ref(false);
const handleClose = (done: () => void) => {
  done();
};

let tableData = ref<
  {
    title: string;
    value: string;
  }[]
>([]);
const setShow = () => {
  tableData.value = JSON.parse(JSON.stringify(urls.value));
  dialogVisible.value = true;
};

const setConfirm = () => {
  urls.value = tableData.value;
  setStorageData('urls', urls.value);
  dialogVisible.value = false;
};

const onTableAdd = () => {
  tableData.value.push({ title: '', value: '' });
};

const onTableMinus = (index: number) => {
  tableData.value.splice(index, 1);
};
// ---卡片配置end---
</script>

<style lang="scss" scoped>
.card-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.card_checked {
  position: relative;

  .checked-icon {
    position: absolute;
    top: 6px;
    right: 4px;
    width: 20px;
    height: 20px;
    color: #fff;
  }
}

.card_checked::before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-top: 50px solid #18c984;
  border-left: 50px solid transparent;
  border-bottom: 44px solid transparent;
  border-right: 0;
  border-top-right-radius: var(--el-card-border-radius);
}

.d-flex {
  display: flex;
}

.flex-1 {
  flex: 1;
}
</style>
