<template>
  <div class="c-upload-wrapper">
    <input type="file" class="upload-file" @change="PreviewImage" ref="file"/>
    <i class="icon c-icon-upload"></i>
  </div>
</template>
<script type="text/ecmascript-6">
  import axios from 'axios';

  const axiosInstance = axios.create({});

  export default {
    props: ['token', 'url'],
    data () {
      return {
        files: [],
        filesArr: null,
        uploadStatus: 'selected',
        unUploadFiles: new Set()
      };
    },
    created () {
      this.filesArr = new Set();
    },
    methods: {
      removeUploadFile (item, index) {
        this.files.splice(index, 1);
        this.filesArr.delete(item);
        this.$emit('upDateUpload', this.files);
      },
      PreviewImage (e) {
        var file = e.srcElement.files[0]; // 获取到你选择的图片
        var imgURL = window.URL.createObjectURL(file); // 保存你选择图片的本地路径
        let fileList = this.$refs.file.files;
        for (let i = 0; i < fileList.length; i++) {
          // 文件过滤
          if (fileList[i].name.match(/.jpg|.gif|.png|.bmp/i)) {
            let item = {
              key: `${fileList[i].name}_${fileList[i].size}`,
              name: fileList[i].name,
              size: fileList[i].size,
              file: fileList[i]
            };
            // 将图片文件转成BASE64格式
            let reader = new FileReader();
            this.filesArr.add(item);
            this.unUploadFiles.add(item);
            reader.onload = (e) => {
              this.$set(item, 'src', e.target.result);
            };
            reader.readAsDataURL(fileList[i]);
          }
        }
        this.files = [...this.filesArr];
        this.$emit('selectImgs', this.files);
      },
      upload () {
        for (var i = 0, len = this.files.length; i < len; i++) {
          var file = this.files[i];
          var data = new FormData();
          data.append('token', this.token);
          data.append('file', file.file);
          data.append('fileFlag', i);
          axiosInstance({
            method: 'POST',
            url: this.url,
            data: data,
            headers: {'Content-Type': 'multipart/form-data'},
            onUploadProgress: function (progressEvent) {
              var percentCompleted = Math.round(progressEvent.loaded * 100 / progressEvent.total);
//              console.log(progressEvent);
            }
          })
            .then(res => {
              var targetFile = this.files[res.config.data.get('fileFlag')];
              console.log(targetFile);
              this.unUploadFiles.delete(targetFile);
              if (this.unUploadFiles.size == 0) {
                console.log('uploadComplete ~~~~');
                this.$emit('uploadComplete');
              }

            }).catch(e => {
            console.log(e);
          });
        }
      }
    },
    components: {}
  };
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./upload";
</style>
