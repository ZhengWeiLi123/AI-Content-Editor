import { defineStore } from 'pinia'

import { ref } from 'vue'

export const useAnalysisStore = defineStore(
  'analysis',
  () => {

    // 当前分析结果
    const analysisResult = ref(null)


    // 当前上传文件信息
    const fileInfo = ref({
      name: '',
      size: '',
      uploadTime: '',
    })


    // 分析历史
    const history = ref([])



    // 保存分析结果
    function saveAnalysis(
      result,
      file = null,
    ) {

      analysisResult.value = result


      if (file) {

        fileInfo.value = {

          name: file.name,

          size:
            formatFileSize(
              file.size,
            ),

          uploadTime:
            new Date()
              .toLocaleString(
                'zh-CN',
              ),
        }

      }


      // 添加历史记录

      history.value.unshift({

        id:
          Date.now(),

        time:
          new Date()
            .toLocaleString(
              'zh-CN',
            ),

        fileName:
          file?.name ||
          '历史分析',

        views:
          result.total_views ||
          0,

        articles:
          result.article_count ||
          0,

      })


      /*
       * 只保留最近10次
       */
      if (
        history.value.length >
        10
      ) {

        history.value =
          history.value.slice(
            0,
            10,
          )

      }

    }



    // 清除数据
    function clearAnalysis(){

      analysisResult.value =
        null


      fileInfo.value = {

        name:'',

        size:'',

        uploadTime:'',
      }

    }



    return {

      analysisResult,

      fileInfo,

      history,

      saveAnalysis,

      clearAnalysis,

    }

  },

  {

    /*
     * 持久化
     *
     * 刷新浏览器不会丢失
     */
    persist:true,

  },
)



function formatFileSize(size){

  if(!size){

    return '0 KB'

  }


  if(size < 1024){

    return size+' B'

  }


  if(size < 1024*1024){

    return (
      (size/1024)
      .toFixed(2)
      +' KB'
    )

  }


  return (
    (size/1024/1024)
    .toFixed(2)
    +' MB'
  )

}
