Page({
  data: {
    phones: [{
      num:"2",
      title: 'iphone13',
      desc: '宇宙最香手机',
      price: '11000.00',
      thumb: 'https://cdn.cnbj0.fds.api.mi-img.com/b2c-shopapi-pms/pms_1597145789.9525714.jpg'
    },
    { num:"2",
      title: '小米10',
      desc: '得屌丝者得天下',
      price: '4999.00',
      thumb: 'https://cdn.cnbj0.fds.api.mi-img.com/b2c-shopapi-pms/pms_1597145789.9525714.jpg'
    },
    { num:"2",
      title: '华为',
      desc: '为了荣耀',
      price: '5999.00',
      thumb: 'https://cdn.cnbj0.fds.api.mi-img.com/b2c-shopapi-pms/pms_1597145789.9525714.jpg'
    },
    ],
    // dailao: '上菜',
    // xgg: '刘艺龙',
    // imageURL: 'https://cdn.cnbj0.fds.api.mi-img.com/b2c-shopapi-pms/pms_1597145789.9525714.jpg',
   
  },

  onLode() {
    //
    setTine(() => {
      this.setDate({
        dailao: '陈目镜'
      })
    }, 5000)

    setTimeout(() => {
      this.setData({
        xgg: '蒋团团'

      })
    }
    )
  }
})