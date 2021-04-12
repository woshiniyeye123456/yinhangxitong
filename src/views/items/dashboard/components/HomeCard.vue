<template>
  <div class="home-card-body" :style="{ background: BgColor }">
    <div class="home-card-top">
      <div class="top-img">
        <img :src="nowImgIndex" alt="">
      </div>
      <div class="top-right">
        <div class="top-right-top">
          <div class="info" v-if="isInfo">比昨日 <span class="info-num">+5</span></div>
          <div class="num">{{ num }}</div>
        </div>
        <span class="title">{{ title }}</span>
      </div>
    </div>
    <div class="home-card-progress">
      <div class="progress-p">
        <div class="progress-c" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
    <div class="home-card-footer">
      <span>{{ footerText }}</span>
      <span>{{ progress }} {{ footIndex === '2' ? '%': '' }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "HomeCard",
    props: {
      BgColor: {
        type: String,
        default: 'linear-gradient(90deg, rgba(81, 207, 227, 1), rgba(64, 142, 239, 1))'
      },
      title: {
        type: String,
        default: '今日新增'
      },
      num: {
        type: Number,
        default: 36
      },
      footIndex: {
        type: String,
        default: '2'
      },
      isInfo: {
        type: Boolean,
        default: false
      },
      progress: {
        type: [String, Number],
        default: '60'
      },
      imgIndex: {
        type: String,
        default: '1'
      }
    },
    computed: {
      footerText() {
        return this.footIndex === '1' ? '任务总数' : '占比'
      },
      nowImgIndex() {
        switch (this.imgIndex) {
          case '1':
            return this.homeTypeImg1;
          case '2':
            return this.homeTypeImg2;
          case '3':
            return this.homeTypeImg3;
          default:
            return this.homeTypeImg4
        }
      }
    },
    data() {
      return {
        homeTypeImg1: require('../../../../img/home/home_icon1.png'),
        homeTypeImg2: require('../../../../img/home/home_icon2.png'),
        homeTypeImg3: require('../../../../img/home/home_icon3.png'),
        homeTypeImg4: require('../../../../img/home/home_icon4.png'),
      }
    }
  }
</script>

<style scoped>
  .home-card-body {
    width: 100%;
    /*background:linear-gradient(90deg,rgba(81,207,227,1),rgba(64,142,239,1));*/
    border-radius: 8px;
    padding: 14px 15px 8px 15px;
    display: flex;
    flex-direction: column;
  }

  .home-card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .top-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .top-right-top {
    display: flex;
    align-items: flex-end;
    height: 30px;
    margin-right: 15px;
  }

  .info {
    background: rgba(255, 255, 255, 0.59);
    height: 30px;
    border-radius: 15px 15px 0 15px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(245, 84, 84, 1);
    line-height: 30px;
    padding: 0 17px;
    margin-right: 5px;
  }

  .info-num {
    font-size: 22px;
    font-weight: bold;
  }

  .num {
    font-size: 24px;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    margin-bottom: -5px;
  }

  .top-img {
    width: 48px;
    height: 48px;
  }

  .title {
    font-size: 16px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    margin-top: 12px;
    letter-spacing: 2px;
  }

  .home-card-progress {
    margin-top: 19px;
  }

  .progress-p {
    height: 6px;
    background: rgba(255, 255, 255, 0.36);
    border-radius: 3px;
  }

  .progress-c {
    height: 6px;
    background: rgba(255, 255, 255, 1);
    border-radius: 3px;
  }

  .home-card-footer {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
  }
</style>
