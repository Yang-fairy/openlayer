<template>
  <div>
    <button @click="outputFile">点击导出</button>
    <button @click="exit">修改表数据</button>
    <el-table :data="tableData1" style="width: 100%" id="out-table">
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :total="total"
      @current-change="change"
      :page-size="page.pageSize"
    >
    </el-pagination>
  </div>
</template>

<script>
// 引入导出Excel表格依赖
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      tableData2: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      tableData1: null,
      total: null,
      page: {
        pageSize: 2,
      },
    };
  },
  mounted() {
    this.a(this.tableData, 0, 2);
    this.total = this.tableData.length;
    // console.log(new Date().getTime());
    // console.log(this.$store.state.count, "111");
    // this.$store.commit("changeNum");
    // console.log(this.$store.state.count, "222");
  },
  methods: {
    a(arr, index, num) {
      this.tableData1 = arr.slice(index * num, (index + 1) * num);
    },
    change(e) {
      console.log(e);
      this.a(this.tableData, e, 2);
    },
    exit() {
      this.tableData = [
        {
          date: "44444",
          name: "111",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "66666",
          name: "222",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "777777",
          name: "333",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "99999",
          name: "4444",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ];
    },
    outputFile() {
      //因为此处有分页，每页展示10条数据，在方法调用的开始，展示所有数据，导出之后再把条数更改过来
      this.tableData1 = this.tableData;
      this.$nextTick(function () {
        var ws1 = XLSX.utils.table_to_book(
          document.querySelector("#out-table")
        ); //对应要导出的表格id

        /* get binary string as output */
        var wbOut = XLSX.write(ws1, {
          bookType: "xlsx",
          bookSST: true,
          type: "array",
        });
        try {
          FileSaver.saveAs(
            new Blob([wbOut], { type: "application/octet-stream" }),
            "demo.xlsx"
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbOut);
        }
        this.tableData1 = this.tableData.slice(0,2);
        return wbOut;
      });
    },
    //定义导出Excel表格事件
    exportExcel() {
      /* 从表生成工作簿对象 */
      let wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        FileSaver.saveAs(
          //Blob 对象表示一个不可变、原始数据的类文件对象。
          //Blob 表示的不一定是JavaScript原生格式的数据。
          //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          //   修改数据
          new Blob([wbout], { type: "application/octet-stream" }),
          //设置导出文件名称
          "sheetjs.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
  },
};
</script>

<style>
</style>