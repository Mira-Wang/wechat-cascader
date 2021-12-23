const commonMixin = require('../../../mixins/commonMixin')
const listMixin = require('../../../mixins/listMixin')
const tools = require('../../../utils/tools')

Page({
  mixins: [commonMixin, listMixin],
  data: {
    type: 3,
    maskShow: false,
    communityList: [],
    areaList: [],
    swiperCurrent: 0,
    areaName: '请选择小区',
    areaId: '',
    treePickerHeadList: [{ id: '', name: '请选择社区' }],
    swiperList: [],
    swiperItemLiActive: ''
  },
  onLoad(options) {
    this.getList = this.simulateAjax
    this.getCommunityListTree()
  },
  onShow() {
    this.init()
  },
  getCommunityListTree() {
    const { type } = this.data
    this.httpGet({
      url: this.data.api.getCommunityListTreeApi,
      data: {
        type: type
      }
    }).then((res) => {
      const communityList = res.data.data
      const swiperList = []
      swiperList[0] = communityList
      this.setData({
        communityList: communityList,
        swiperList: swiperList
      })
    })
  },

  handleChange() {
    this.setData({ maskShow: true })
  },

  handleCloseMask() { 
    this.setData({ maskShow: false })
  },
  handleSelectPickerHead(e) {
    const id = this.getCurrentTarget(e, 'dataset')['id']
    this.setData({ swiperCurrent: id })
  },
  handleSelectComArea(e) {
    const id = this.getCurrentTarget(e, 'dataset')['id']
    const { communityList, areaList, treePickerHeadList, swiperList, swiperCurrent } = this.data
    if (swiperCurrent == 0) {
      communityList.map((item, index) => {
        if (item.id === id) {
          treePickerHeadList[0].id = id
          treePickerHeadList[0].name = item.name
          if (treePickerHeadList.length < 2) {
            const treePickerHeadObj = { id: '', name: '请选择小区' }
            treePickerHeadList.push(treePickerHeadObj)
          } else {
            treePickerHeadList[1].id = ''
            treePickerHeadList[1].name = '请选择小区'
          }
          swiperList[1] = item.areaList
          this.setData({
            swiperList: swiperList,
            areaList: item.areaList,
            treePickerHeadList: treePickerHeadList,
            swiperItemLiActive: item.id
          })
        }
      })
      setTimeout((this.setData({ swiperCurrent: 1, })), 500)
    } else {
      areaList.map((item, index) => {
        if (item.id === id) {
          treePickerHeadList[1].id = id
          treePickerHeadList[1].name = item.name
          this.setData({
            treePickerHeadList: treePickerHeadList,
            maskShow: false,
            areaName: item.name,
            areaId: id,
            swiperItemLiActive: item.id
          })
        }
      })
      this.init()
    }
  },
  handleSwiperChange(e) {
    const current = e.detail.current
    const { communityList, areaList, treePickerHeadList } = this.data
    if (current === 1) {
      areaList.map((item, index) => {
        if (item.id === treePickerHeadList[1].id) {
          this.setData({
            swiperItemLiActive: item.id,
            swiperCurrent: 1
          })
        }
      })
    } else {
      communityList.map((item, index) => {
        if (item.id === treePickerHeadList[0].id) {
          this.setData({
            swiperItemLiActive: item.id,
            swiperCurrent: 0
          })
        }
      })
    }
  },

  simulateAjax: function (params) {
    const { areaId } = this.data
    params.areaId = areaId
    return this.httpGet({
      url: this.data.api.getFaceDeviceListApi,
      data: { ...params }
    })
  },

  handleGoForm() {
    const data = {
      detail: {
        url: ''
      }
    }
    data.detail.url = `../form/index`
    this.goTo(data)
  },
  handleOpen(e){
    const id = this.getCurrentTarget(e, 'dataset')['id']
    this.httpGet({
      url: tools.stringReplaceByReg(this.data.api.getFaceDoorOpenListApi, '{id}', id),
    }).then((res) => {
      this.showToast({
        title: '开门成功',
        icon: 'none',
        duration: 1000
      })
    })
  },

})