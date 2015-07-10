define(['appCommon'], function(){
	// $('body, html').scrollTop(101);

	var logoList = [
		{"name": "清华", "url": "partner/logo-list_03.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_03.jpg*/},
		{"name": "复旦", "url": "partner/logo-list_07.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_07.jpg*/},
		{"name": "南京大学", "url": "partner/logo-list_09.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_09.jpg*/},
		{"name": "西安交大", "url": "partner/logo-list_11.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_11.jpg*/},
		{"name": "中国科大", "url": "partner/logo-list_18.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_18.jpg*/},
		{"name": "哈工大", "url": "partner/logo-list_19.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_19.jpg*/},
		{"name": "中南大学", "url": "partner/logo-list_102.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_102.jpg*/},
		{"name": "山东大学", "url": "partner/logo-list_101.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_101.jpg*/},
		{"name": "解放军信息工程大学", "url": "partner/logo-list_92.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_92.jpg*/},
		{"name": "东南大学", "url": "partner/logo-list_20.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_20.jpg*/},
		{"name": "华南理工", "url": "partner/logo-list_21.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_21.jpg*/},
		{"name": "兰州大学", "url": "partner/logo-list_22.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_22.jpg*/},
		{"name": "东北大学", "url": "partner/logo-list_28.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_28.jpg*/},
		{"name": "重庆大学", "url": "partner/logo-list_93.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_93.jpg*/},
		{"name": "云南大学", "url": "partner/logo-list_29.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_29.jpg*/},
		{"name": "苏州大学", "url": "partner/logo-list_30.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_30.jpg*/},
		{"name": "南京航空航天大学", "url": "partner/logo-list_31.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_31.jpg*/},
		{"name": "中国矿业大学", "url": "partner/logo-list_32.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_32.jpg*/},
		{"name": "四川农业大学", "url": "partner/logo-list_78.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_78.jpg*/},
		{"name": "河北工业大学", "url": "partner/logo-list_91.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_91.jpg*/},
		{"name": "福州大学", "url": "partner/logo-list_41.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_41.jpg*/},
		{"name": "海南大学", "url": "partner/logo-list_103.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_103.jpg*/},
		{"name": "贵州大学", "url": "partner/logo-list_40.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_40.jpg*/},
		{"name": "青海大学", "url": "partner/logo-list_39.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_39.jpg*/},
		{"name": "江西财经大学", "url": "partner/logo-list_38.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_38.jpg*/},
		{"name": "西南石油大学", "url": "partner/logo-list_80.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_80.jpg*/},
		{"name": "西南科技大学", "url": "partner/logo-list_90.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_90.jpg*/},
		{"name": "内蒙古师范大学", "url": "partner/logo-list_71.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_71.jpg*/},
		{"name": "四川师范大学", "url": "partner/logo-list_79.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_79.jpg*/},
		{"name": "北京联合大学", "url": "partner/logo-list_88.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_88.jpg*/},
		{"name": "齐鲁工业大学", "url": "partner/logo-list_42.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_42.jpg*/},
		{"name": "成都学院", "url": "partner/logo-list_48.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_48.jpg*/},
		{"name": "贵州理工学院", "url": "partner/logo-list_69.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_69.jpg*/},
		{"name": "四川旅游学院", "url": "partner/logo-list_81.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_81.jpg*/},
		{"name": "三亚学院", "url": "partner/logo-list_49.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_49.jpg*/},
		{"name": "温州大学瓯江学院", "url": "partner/logo-list_50.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_50.jpg*/},
		{"name": "成都东软学院", "url": "partner/logo-list_89.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_89.jpg*/},
		{"name": "四川信息职业技术学院", "url": "partner/logo-list_82.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_82.jpg*/},
		{"name": "山东商业职业技术学院", "url": "partner/logo-list_104.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_104.jpg*/},
		{"name": "北京五中", "url": "partner/logo-list_59.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_59.jpg*/},
		{"name": "北京市171中学", "url": "partner/logo-list_51.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_51.jpg*/},
		{"name": "北师大实验中学", "url": "partner/logo-list_70.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_70.jpg*/},
		{"name": "北京数字学校", "url": "partner/logo-list_62.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_62.jpg*/},
		{"name": "国家节能中心", "url": "partner/logo-list_105.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_105.jpg*/},
		{"name": "立课", "url": "partner/logo-list_05.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_05.jpg*/},
		{"name": "清华同方", "url": "partner/logo-list_52.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_52.jpg*/},
		{"name": "南宁学院", "url": "partner/logo-list_58.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_58.jpg*/},
		{"name": "华北计算技术研究所", "url": "partner/logo-list_72.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_72.jpg*/},
		{"name": "百知教育", "url": "partner/logo-list_60.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_60.jpg*/},
		{"name": "典课网", "url": "partner/logo-list_61.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_61.jpg*/},
		{"name": "理想工场", "url": "partner/logo-list_68.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/cloud/partner/logo-list_68.jpg*/}
	];

	var str = '';

	for (var i = 0; i < logoList.length; i++) {
		str += '\
			<li class="col-md-6 col-xs-12">\
				<img src="'+ logoList[i].url +'" alt="'+ logoList[i].name +'">\
			</li>';
	};

	$("#xty_logo_list").html(str);

	var lastSt = 0,
		direDown = true;
	$(window).on('scroll',function(){
		var st = $(this).scrollTop();

		if(st > lastSt){
			direDown = true;
		}else{
			direDown = false;
		}
		lastSt = st;
		// 顶部banner的缓冲动作
		if (st > 101) {
			$('#banner')[0].style.transform = 'translateY('+(st-101)*0.3+'px)';
		}else{
			$('#banner')[0].style.transform = 'translateY(0px)';
		}

		if (st > 650 && direDown) {
			$('#xypt').children().addClass('up1');
		}

		if (st < 1100 && !direDown) {
			$('#xypt').children().removeClass('up1');
		}

		if (st > 1030 && direDown) {
			$('#dsjfw').children().addClass('up2');
			$('#reg_btn').removeClass('margint0');
		}

		if (st < 1430 && !direDown) {
			$('#dsjfw').children().removeClass('up2');
			$('#reg_btn').addClass('margint0');
		}
	});
});
