<script>
import CopyrightICP from "@/components/CopyrightICP.vue";
export default {
  name: "PCIntro",
  components: {
    CopyrightICP,
  },
};
</script>

<template>
  <el-col :span="20" :offset="2">
    <el-row style="margin-bottom: 50px"></el-row>
    <el-row>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>BUAAMapForum功能介绍</span>
          </div>
        </template>
        <el-scrollbar height="450px">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="创建私人钉子" name="1">
              <div>
                每一位注册用户可以创建自己的私人钉子。
                PC端右键地图界面，填写相关信息即可创建；移动端长按地图界面，即可创建。<br />
                PC端上传图片后，右键图片即可删除，移动端则需要长按图片。<br />
                请注意，所上传的图片不能包括血腥、暴力、政治等敏感内容，否则无法通过自动审核。
              </div>
            </el-collapse-item>
            <el-collapse-item title="反馈钉子" name="2">
              <div>
                在PC端和移动端，点击公共钉子，打开信息卡片，可以看到反馈按钮。<br />
                如果认为公共钉子信息有误或者是有缺漏，可以反馈至系统管理员。
              </div>
            </el-collapse-item>
            <el-collapse-item title="私人钉子申请公开" name="3">
              <div>
                如果你认为你的私人钉子很有价值，能够帮助更多的同学，那么你可以选择将你的私人钉子申请公开<br />
                打开私人钉子的信息卡片，可以申请公开。申请会反馈到管理员处，管理员审核后会向你反馈结果
              </div>
            </el-collapse-item>
            <el-collapse-item title="论坛社区规范" name="4">
              <div>
                发帖时，请注意维护论坛社区的和谐。你所发送的文本会经过自动化审核，如果包含敏感内容则无法发送。<br />
                详见论坛置顶帖
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </el-card>
    </el-row>
    <el-row style="bottom: 0; position: fixed; width: 50%">
      <CopyrightICP />
    </el-row>
  </el-col>
</template>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 100%;
  height: 80%;
}

.el-collapse .el-collapse-item__header {
  font-size: 18px;
  font-weight: 500;
}

.el-collapse .el-collapse-item__content {
  font-size: 14px;
}
</style>