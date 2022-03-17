<template>

    <div class="wrap_01" style="width:100px;height: 100px;">

        <CircleProgress 

          :id="id"

          :width="50"

          :radius="20"

          :progress="30"

          :isAnimation="true"

        ></CircleProgress>

    </div>

</template>

<script>

import CircleProgress  from 'vue-circleprogressbar';

export default {

  data() {

    return {};

  },

  components: {

    CircleProgress

  }

};

</script>