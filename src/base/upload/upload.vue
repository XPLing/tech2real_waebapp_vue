<template>
  <div class="c-upload-wrapper">
    <input v-if="refresh" type="file" class="upload-file" @change="PreviewImage" ref="file"/>
    <i class="icon c-icon-upload" v-if="uploadStatus !== 'uploadComplete'"></i>
  </div>
</template>
<script type="text/ecmascript-6">
  import axios from 'api/axios';

  const axiosInstance = axios.create({});

  /* uploadError type类型: 1.超出限定数量 2.文件类型不符合 */

  export default {
    props: {
      token: '',
      url: '',
      limit: {
        type: Number,
        default: 9
      },
      regex: ''
    },
    data () {
      return {
        refresh: true,
        files: [],
        filesArr: new Set(),
        recordFiles: new Set(),
        uploadStatus: 'selected',
        unUploadFiles: new Set()
      };
    },
    created () {
    },
    methods: {
      cleanUploadFile () {
        this.files = [];
        this.filesArr.clear();
        this.unUploadFiles.clear();
        this.recordFiles.clear();
        this.uploadStatus = 'none';
        this.$emit('cleanUploadFile');
      },
      removeUploadFile (item, index) {
        this.files.splice(index, 1);
        this.recordFiles.delete(item.name);
        this.filesArr.delete(item);
        this.unUploadFiles.delete(item);
        this.$emit('upDateUpload', this.files);
      },
      PreviewImage (e) {
//        var file = e.srcElement.files[0]; // 获取到你选择的图片
//        var imgURL = window.URL.createObjectURL(file); // 保存你选择图片的本地路径

        if (this.filesArr.size === this.limit) {
          this.$emit('uploadError', {type: 1});
          return;
        }
        let fileList = this.$refs.file.files;
        for (let i = 0; i < fileList.length; i++) {
          // 文件过滤
          if (fileList[i].name.match(this.regex)) {
            let item = {
              key: `${fileList[i].name}_${fileList[i].size}`,
              name: fileList[i].name,
              size: fileList[i].size,
              file: fileList[i]
            };
            if (!this.recordFiles.has(item.name)) {
              // 将图片文件转成BASE64格式
              let reader = new FileReader();
              this.recordFiles.add(item.name);
              this.filesArr.add(item);
              this.unUploadFiles.add(item);
              reader.onload = (e) => {
                this.$set(item, 'src', e.target.result);
              };
              reader.readAsDataURL(fileList[i]);
            }
          } else {
            this.$emit('uploadError', {type: 2});
          }
        }
        this.files = [...this.filesArr];
        this.refreshInput();
        this.$emit('selectImgs', this.files);
      },
      refreshInput () {
        this.refresh = false;
        setTimeout(() => {
          this.refresh = true;
        }, 100);
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
              this.unUploadFiles.delete(targetFile);
              targetFile.key = res.data.key;
              targetFile.hash = res.data.hash;
              if (this.unUploadFiles.size == 0) {
//                console.log('uploadComplete ~~~~');
                this.uploadStatus = 'uploadComplete';
                this.$emit('uploadComplete', this.files);
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
