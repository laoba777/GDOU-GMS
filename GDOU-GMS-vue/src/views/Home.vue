<template>
  <el-container>
    <el-aside width="220px">
      <SideMenu></SideMenu>
    </el-aside>
    <el-container>
      <el-header>
        <el-page-header @back="goBack" :content="currentPage.title"> </el-page-header>
        <strong>GMS海大体育馆管理系统</strong>

        <div class="header-avatar">
          <el-avatar size="medium" :src="userInfo.avatar"></el-avatar>

          <el-dropdown>
            <span class="el-dropdown-link">
              {{ userInfo.username
              }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link :to="{ name: 'UserCenter' }">个人中心</router-link>
              </el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-link href="https://www.gdou.edu.cn/" target="_blank"
            >学校官网</el-link
          >
        </div>
      </el-header>
      <Tabs></Tabs>
      <el-main>
        
        <div style="margin: 0 15px">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideMenu from "./inc/SideMenu";
import Tabs from "./inc/Tabs";

export default {
  name: "Home",
  components: {
    SideMenu,
    Tabs,
  },
  data() {
    return {
      userInfo: {
        id: "",
        username: "",
        avatar: "",
      },
    };
  },
  created() {
    this.getUserInfo();
  },computed: {
    currentPage: {
      get() {
		console.log("this.$store.state.menus.currentPage")
		console.log(this.$store.state.menus.currentPage);
        return this.$store.state.menus.currentPage;
      },
      set(val) {
        this.$store.state.menus.currentPage = val;
      },
    },
  },
  methods: {
    getUserInfo() {
      this.$axios.get("/sys/userInfo").then((res) => {
        this.userInfo = res.data.data;
      });
    },
    logout() {
      this.$axios.post("/logout").then((res) => {
        localStorage.clear();
        sessionStorage.clear();

        this.$store.commit("resetState");

        this.$router.push("/login");
      });
    },goBack() {
        this.$router.go(-1);
      }
  },
};
</script>

<style scoped>
.el-page-header{
	float: left;
	height: 60px;
	line-height: 60px;
}
.el-container {
  padding: 0;
  margin: 0;
  height: 100%;
}

.header-avatar {
  float: right;
  width: 210px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
}

.el-header {
  background-color: #fff;
  color: #333;
  text-align: center;
  line-height: 60px;
  /* border-bottom: #D3DCE6 1px solid; */
}

.el-header strong {
  font-size: 20px;
  letter-spacing: 1px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  line-height: 200px;
}

.el-main {
  color: #333;
  padding: 0;
}

a {
  text-decoration: none;
}


</style>