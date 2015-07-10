
define('css!alert',[],function(){});
define('alert',['require','exports','module','jquery','support/transitionend','css!alert'],function(require, exports, module) {
	var $ = require('jquery');
	require('support/transitionend');
	require('css!alert');
	return function(opt){
		if ($('#alert_cover').length) { return false;}
		var $opt=$.extend({
				titleHTML:'',	//title的html
				mainHTML:'',	//正文的html
				type:'succ',	//succ,err 错误样式，正确样式
				tip:0,			//是否是短提示语样式
				isClose:1,		//是否有关闭按钮
				isDoBtn:1,		//是否有确定按钮
				doHTML:'确定',  //确定按钮的文字
				style:'',		//主窗口样式
				id:'',
				closeFn:function() {},	//关闭按钮按下时的callback
				doFn:function() {}		//确定按钮按下时的callback
			},opt||{}),
			$b=$('body'),
			$w=$(window),
			TRANSITION_END_NAMES =['transitionend','webkitTransitionEnd','otransitionend','oTransitionEnd'],
			str='';
		if ($opt.tip) {
			str='<div id="alert_cover">'+
					'<div class="alert_cell">'+
						'<div id="alertM" class="alertM_in '+$opt.id+'" style="'+$opt.style+'">'+
							'<div class="alertM_bg '+($opt.type=='succ'?'succ':'err')+'">'+
								'<h6 class="h6" style="height:50px; line-height:50px; color:#fff; font-size:18px; text-indent:20px;">'+
									'<div class="title">'+
										'提示信息'+
									'</div>'+
									'<i class="alert_close"></i>'+
								'</h6>'+
								'<div class="alertM_main alertM_tip" style="padding:20px 0;">'+
									'<p>'+$opt.mainHTML+'</p>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>';
		}else{
			str='<div id="alert_cover">'+
					'<div class="alert_cell">'+
						'<div id="alertM" class="alertM_in '+$opt.id+'" style="'+$opt.style+'">'+
							'<div class="alertM_bg '+($opt.type=='succ'?'succ':'err')+'">'+
								'<h6 class="h6">'+
									'<div class="title">'+
										$opt.titleHTML+
									'</div>'+
									($opt.isClose ? '<i class="alert_close"></i>':'')+
								'</h6>'+
								'<div class="alertM_main">'+
									$opt.mainHTML+
								'</div>'+
								($opt.isDoBtn?('<div class="alertM_bottom"><button>'+$opt.doHTML+'</button></div>'):'')+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>';
		}
		var $alertM=$(str),
			$h6=$alertM.find('.h6').eq(0),
			$close=$h6.find('.alert_close'),
			$btn=$alertM.find('.alertM_bottom').eq(0).find('button');
		$alertM.appendTo($b);
		$('#alertM').on('click',function(e) {
			e.stopPropagation();
		});
		$close.add($alertM).on('click',function() {
			var bl=$opt.closeFn();
			if (bl!=false) {
				closeWin();
			}
		});
		$btn.on('click',function() {
			var bl=$opt.doFn();
			if (bl!=false) {
				closeWin();
			}
		});
		function closeWin () {
			$alertM.addClass('alertM_out');
			if ($.support.transition) {
				for (var i = 0,l=TRANSITION_END_NAMES.length; i < l ; i++) {
					$alertM[0].addEventListener(TRANSITION_END_NAMES[i],function() {
						$(this).remove();
						$opt.closeFn();
					},false);
				}
			}else{
				$alertM.remove();
				$opt.closeFn();
			}
		}
		module.exports.remove=closeWin;
	}
});
define('h5f',['jquery'], function(jQuery) {
    (function(root, factory) {
        root.H5F = factory();
        if (window.jQuery && $('form').length) {
            $('form').each(function() {
                factory().setup(this);
            });
        }
    }(this, function() {

        var d = document,
            field = d.createElement("input"),
            emailPatt = /^[a-zA-Z0-9.!#$%&'*+-\/=?\^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            urlPatt = /[a-z][\-\.+a-z]*:\/\//i,
            nodes = /^(input|select|textarea)$/i,
            isSubmit, bypassSubmit, usrPatt, curEvt, args,
            // Methods
            setup, validation, validity, checkField, bypassChecks, checkValidity, setCustomValidity, support, pattern, placeholder, range, required, valueMissing, listen, unlisten, preventActions, getTarget, addClass, removeClass, isHostMethod, isSiblingChecked;

        setup = function(form, settings) {
            var isCollection = !form.nodeType || false;

            var opts = {
                validClass: "valid",
                invalidClass: "error",
                requiredClass: "required",
                placeholderClass: "placeholder"
            };

            if (typeof settings === "object") {
                for (var i in opts) {
                    if (typeof settings[i] === "undefined") {
                        settings[i] = opts[i];
                    }
                }
            }

            args = settings || opts;

            if (isCollection) {
                for (var k = 0, len = form.length; k < len; k++) {
                    validation(form[k]);
                }
            } else {
                validation(form);
            }
        };

        validation = function(form) {
            var f = form.elements,
                flen = f.length,
                isRequired,
                noValidate = !!(form.attributes["novalidate"]);

            listen(form, "invalid", checkField, true);
            listen(form, "blur", checkField, true);
            listen(form, "input", checkField, true);
            listen(form, "keyup", checkField, true);
            listen(form, "focus", checkField, true);
            listen(form, "change", checkField, true);
            listen(form, "click", bypassChecks, true);

            listen(form, "submit", function(e) {
                isSubmit = true;
                if (!bypassSubmit) {
                    if (!noValidate && !form.checkValidity()) {
                        preventActions(e);
                    }
                }
            }, false);

            if (!support()) {
                form.checkValidity = function() {
                    return checkValidity(form);
                };

                while (flen--) {
                    isRequired = !!(f[flen].attributes["required"]);
                    // Firefox includes fieldsets inside elements nodelist so we filter it out.
                    if (f[flen].nodeName.toLowerCase() !== "fieldset") {
                        validity(f[flen]); // Add validity object to field
                    }
                }
            }
        };
        validity = function(el) {
            var elem = el,
                missing = valueMissing(elem),
                attrs = {
                    type: elem.getAttribute("type"),
                    pattern: elem.getAttribute("pattern"),
                    placeholder: elem.getAttribute("placeholder")
                },
                isType = /^(email|url)$/i,
                evt = /^(input|keyup)$/i,
                fType = ((isType.test(attrs.type)) ? attrs.type : ((attrs.pattern) ? attrs.pattern : false)),
                patt = pattern(elem, fType),
                step = range(elem, "step"),
                min = range(elem, "min"),
                max = range(elem, "max"),
                customError = !(elem.validationMessage === "" || elem.validationMessage === undefined);

            elem.checkValidity = function() {
                return checkValidity.call(this, elem);
            };
            elem.setCustomValidity = function(msg) {
                setCustomValidity.call(elem, msg);
            };

            elem.validity = {
                valueMissing: missing,
                patternMismatch: patt,
                rangeUnderflow: min,
                rangeOverflow: max,
                stepMismatch: step,
                customError: customError,
                valid: (!missing && !patt && !step && !min && !max && !customError)
            };

            if (attrs.placeholder && !evt.test(curEvt)) {
                placeholder(elem);
            }
        };
        checkField = function(e) {
            var el = getTarget(e) || e, // checkValidity method passes element not event
                events = /^(input|keyup|focusin|focus|change)$/i,
                ignoredTypes = /^(submit|image|button|reset)$/i,
                specialTypes = /^(checkbox|radio)$/i,
                checkForm = true;

            if (nodes.test(el.nodeName) && !(ignoredTypes.test(el.type) || ignoredTypes.test(el.nodeName))) {
                curEvt = e.type;

                if (!support()) {
                    validity(el);
                }

                if (el.validity.valid && (el.value !== "" || specialTypes.test(el.type)) || (el.value !== el.getAttribute("placeholder") && el.validity.valid)) {
                    removeClass(el, [args.invalidClass, args.requiredClass]);
                    addClass(el, args.validClass);
                } else if (!events.test(curEvt)) {
                    if (el.validity.valueMissing) {
                        removeClass(el, [args.invalidClass, args.validClass]);
                        addClass(el, args.requiredClass);
                    } else if (!el.validity.valid) {
                        removeClass(el, [args.validClass, args.requiredClass]);
                        addClass(el, args.invalidClass);
                    }
                } else if (el.validity.valueMissing) {
                    removeClass(el, [args.requiredClass, args.invalidClass, args.validClass]);
                }
                if (curEvt === "input" && checkForm) {
                    // If input is triggered remove the keyup event
                    unlisten(el.form, "keyup", checkField, true);
                    checkForm = false;
                }
            }
        };
        checkValidity = function(el) {
            var f, ff, isRequired, hasPattern, invalid = false;

            if (el.nodeName.toLowerCase() === "form") {
                f = el.elements;

                for (var i = 0, len = f.length; i < len; i++) {
                    ff = f[i];

                    isRequired = !!(ff.attributes["required"]);
                    hasPattern = !!(ff.attributes["pattern"]);

                    if (ff.nodeName.toLowerCase() !== "fieldset" && (isRequired || hasPattern && isRequired)) {
                        checkField(ff);
                        if (!ff.validity.valid && !invalid) {
                            if (isSubmit) { // If it's not a submit event the field shouldn't be focused
                                ff.focus();
                            }
                            invalid = true;
                        }
                    }
                }
                return !invalid;
            } else {
                checkField(el);
                return el.validity.valid;
            }
        };
        setCustomValidity = function(msg) {
            var el = this;

            el.validationMessage = msg;
        };

        bypassChecks = function(e) {
            // handle formnovalidate attribute
            var el = getTarget(e);

            if (el.attributes["formnovalidate"] && el.type === "submit") {
                bypassSubmit = true;
            }
        };

        support = function() {
            return (isHostMethod(field, "validity") && isHostMethod(field, "checkValidity"));
        };

        // Create helper methods to emulate attributes in older browsers
        pattern = function(el, type) {
            if (type === "email") {
                return !emailPatt.test(el.value);
            } else if (type === "url") {
                return !urlPatt.test(el.value);
            } else if (!type) {
                return false;
            } else {
                var placeholder = el.getAttribute("placeholder"),
                    val = el.value;

                usrPatt = new RegExp('^(?:' + type + ')$');

                if (val === placeholder) {
                    return false;
                } else if (val === "") {
                    return false;
                } else {
                    return !usrPatt.test(el.value);
                }
            }
        };
        placeholder = function(el) {
            var attrs = {
                    placeholder: el.getAttribute("placeholder")
                },
                focus = /^(focus|focusin|submit)$/i,
                node = /^(input|textarea)$/i,
                ignoredType = /^password$/i,
                isNative = !!("placeholder" in field);

            if (!isNative && node.test(el.nodeName) && !ignoredType.test(el.type)) {
                if (el.value === "" && !focus.test(curEvt)) {
                    el.value = attrs.placeholder;
                    listen(el.form, 'submit', function() {
                        curEvt = 'submit';
                        placeholder(el);
                    }, true);
                    addClass(el, args.placeholderClass);
                } else if (el.value === attrs.placeholder && focus.test(curEvt)) {
                    el.value = "";
                    removeClass(el, args.placeholderClass);
                }
            }
        };
        range = function(el, type) {
            // Emulate min, max and step
            var min = parseInt(el.getAttribute("min"), 10) || 0,
                max = parseInt(el.getAttribute("max"), 10) || false,
                step = parseInt(el.getAttribute("step"), 10) || 1,
                val = parseInt(el.value, 10),
                mismatch = (val - min) % step;

            if (!valueMissing(el) && !isNaN(val)) {
                if (type === "step") {
                    return (el.getAttribute("step")) ? (mismatch !== 0) : false;
                } else if (type === "min") {
                    return (el.getAttribute("min")) ? (val < min) : false;
                } else if (type === "max") {
                    return (el.getAttribute("max")) ? (val > max) : false;
                }
            } else if (el.getAttribute("type") === "number") {
                return true;
            } else {
                return false;
            }
        };
        required = function(el) {
            var required = !!(el.attributes["required"]);

            return (required) ? valueMissing(el) : false;
        };
        valueMissing = function(el) {
            var placeholder = el.getAttribute("placeholder"),
                specialTypes = /^(checkbox|radio)$/i,
                isRequired = !!(el.attributes["required"]);
            return !!(isRequired && (el.value === "" || el.value === placeholder || (specialTypes.test(el.type) && !isSiblingChecked(el))));
        };

        /* Util methods */
        listen = function(node, type, fn, capture) {
            if (isHostMethod(window, "addEventListener")) {
                /* FF & Other Browsers */
                node.addEventListener(type, fn, capture);
            } else if (isHostMethod(window, "attachEvent") && typeof window.event !== "undefined") {
                /* Internet Explorer way */
                if (type === "blur") {
                    type = "focusout";
                } else if (type === "focus") {
                    type = "focusin";
                }
                node.attachEvent("on" + type, fn);
            }
        };
        unlisten = function(node, type, fn, capture) {
            if (isHostMethod(window, "removeEventListener")) {
                /* FF & Other Browsers */
                node.removeEventListener(type, fn, capture);
            } else if (isHostMethod(window, "detachEvent") && typeof window.event !== "undefined") {
                /* Internet Explorer way */
                node.detachEvent("on" + type, fn);
            }
        };
        preventActions = function(evt) {
            evt = evt || window.event;

            if (evt.stopPropagation && evt.preventDefault) {
                evt.stopPropagation();
                evt.preventDefault();
            } else {
                evt.cancelBubble = true;
                evt.returnValue = false;
            }
        };
        getTarget = function(evt) {
            evt = evt || window.event;
            return evt.target || evt.srcElement;
        };
        addClass = function(e, c) {
            var re;
            if (!e.className) {
                e.className = c;
            } else {
                re = new RegExp('(^|\\s)' + c + '(\\s|$)');
                if (!re.test(e.className)) {
                    e.className += ' ' + c;
                }
            }
        };
        removeClass = function(e, c) {
            var re, m, arr = (typeof c === "object") ? c.length : 1,
                len = arr;
            if (e.className) {
                if (e.className === c) {
                    e.className = '';
                } else {
                    while (arr--) {
                        re = new RegExp('(^|\\s)' + ((len > 1) ? c[arr] : c) + '(\\s|$)');
                        m = e.className.match(re);
                        if (m && m.length === 3) {
                            e.className = e.className.replace(re, (m[1] && m[2]) ? ' ' : '');
                        }
                    }
                }
            }
        };
        isHostMethod = function(o, m) {
            var t = typeof o[m],
                reFeaturedMethod = new RegExp('^function|object$', 'i');
            return !!((reFeaturedMethod.test(t) && o[m]) || t === 'unknown');
        };
        /* Checking if one of the radio siblings is checked */
        isSiblingChecked = function(el) {
            var siblings = document.getElementsByName(el.name);
            for (var i = 0; i < siblings.length; i++) {
                if (siblings[i].checked) {
                    return true;
                }
            }
            return false;
        };

        // Since all methods are only used internally no need to expose globally
        return {
            setup: setup
        };
    }));
});
define('checkForm',['require','exports','module','h5f','jquery'],function(require, exports, module) {
	/*
		给form加 data-h5f 属性
		给提交按钮加 data-submit="1"

		required 此项必填  data-default 增加默认值
		pattern="[0-9]" 正则匹配
		min、max 和 step 最大，最小
		type="email" email格式
		type="url" url检测
		data-choose="somestring" 必选一项  给可选的input分别加上 data-somestring
		data-err_target="#div1" 重新定义错误提示的位置 默认是此input
	*/
	require('h5f');
	require('jquery');

	var recordFirstErr = null;
	var checkForm = function(option) {
		option = $.extend(true, {
			blur: true, //是否blur事件检测
			isBreak: false, // 是否一个出错就停止检测
			scrollTo: true, //是否滚动到第一个出错的地方
			scrollOffset: 0, //滚动的偏移值
			btn: $('[data-submit]'), // 提交按钮
			notice: {
				valueMissing: '此项为必填项',
				patternMismatch: '您输入的格式不正确',
				typeMismatch: {
					email: '邮箱格式不正确',
					url: '网址格式不正确'
				},
				tooLong: '您输入的文本过长',
				rangeUnderflow: '您输入的数字过小',
				rangeOverflow: '您输入的数字过大',
				choose: '此处至少选择一项'
			},
			tip: {

			},
			eachSuccCallback: function() {}, //每一项表单验证成功的callback this-> 此input
			eachErrCallback: function() {}, //每一项表单验证失败的callback this-> 此input
			succCallback: function() {}, //表单验证成功callback this->提交按钮
			errCallback: false, //重置表单验证错误的提示 this->此input
			defaultErrCallback: function() {}, //使用默认错误提示触发的callback this->提交按钮
			alwaysCallback: function() {} //表单验证成功，失败就会触发的callback this-> 提交按钮
		}, option || {});
		var $p = $('form[data-h5f]').attr('novalidate', 'novalidate');

		var errHandler = function(msg) {
			if (!recordFirstErr) {
				recordFirstErr = this;
			}
			option.eachErrCallback.call(this, msg);
			if (option.errCallback) {
				option.errCallback.call(this, msg);

			} else {
				option.tip.content = msg;
			}
		};

		var chooseCheck = function($t) {
			var sData = $t.data('choose');
			var isEmpty = true;
			if (sData === undefined) {
				return false;
			}
			var $collection = $t.parentsUntil('form').find('[data-' + sData + ']');
			$collection.each(function() {
				var $_t = $(this);
				if ($_t.attr('type') == 'checkbox') {
					if ($_t.is(':checked')) {
						isEmpty = false;
						return false;
					}
				} else {
					if (!(/^\s*$/.test(this.value)) && this.value !== $_t.data('default')) {
						isEmpty = false;
						return false;
					}
				}
			});
			return isEmpty;
		};

		option.btn.on('click', function(e) {
			e.preventDefault();
			var _this = this;
			recordFirstErr = null;
			$('.tip_alert').remove();
			var formValidity = true;
			$(this).parents('form').find('input, select, textarea').each(function() {
				var $t = $(this);
				var that = this;
				if ($t.data('err_target')) {
					that = document.querySelector($t.data('err_target'));
				}
				if (this.validity.valueMissing || (/^\s*$/.test(this.value) && $t.prop('required')) || (this.value === $t.data('default') && $t.prop('required'))) {
					errHandler.call(that, option.notice.valueMissing);
					formValidity = false;
					if (option.isBreak) {
						return false;
					}
				} else if (this.validity.patternMismatch) {
					errHandler.call(that, option.notice.patternMismatch);
					formValidity = false;
					if (option.isBreak) {
						return false;
					}
				} else if (this.validity.typeMismatch) {
					errHandler.call(that, option.notice.typeMismatch[this.type]);
					formValidity = false;
					if (option.isBreak) {
						return false;
					}
				} else if (this.validity.tooLong) {
					errHandler.call(that, option.notice.tooLong);
					formValidity = false;
					if (option.isBreak) {
						return false;
					}
				} else if (this.validity.rangeUnderflow) {
					errHandler.call(that, option.notice.rangeUnderflow);
					formValidity = false;
					if (option.isBreak) {
						return false;
					}
				} else if (this.validity.rangeOverflow) {
					errHandler.call(that, option.notice.rangeOverflow);
					formValidity = false;
					if (option.isBreak) {
						return false;
					}
				} else if (chooseCheck($t)) {
					errHandler.call(that, option.notice.choose);
					formValidity = false;
					if (option.isBreak) {
						return false;
					}
				} else if (this.validity.valid) {
					option.eachSuccCallback.call(this);
				}
			});
			if (formValidity) {
				option.succCallback.call(this);
			} else {
				option.defaultErrCallback.call(this);
				if (option.scrollTo) {
					$('body, html').stop().animate({
						'scrollTop': $(recordFirstErr).offset().top + option.scrollOffset
					});
				}
			}
			option.alwaysCallback.call(this);
		});

		if (option.btn.attr('type') != 'submit') {
			$p.on('submit', function(e) {
				e.preventDefault();
				return false;
			});
			$p.on('keydown', function(e) {
				if (e.keyCode == 13) {
					e.preventDefault();
					$(this).find('[data-submit]').trigger('click');
				}
			});
		}
	};

	if (window.jQuery) {
		jQuery.checkForm = checkForm;
	} else if (window.Zepto) {
		Zepto.checkForm = checkForm;
	}
});
// Sticky Plugin v1.0.0 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 2/14/2011
// Date: 2/12/2012
// Website: http://labs.anthonygarand.com/sticky
// Description: Makes an element on the page stick on the screen as you scroll
//       It will only set the 'top' and 'position' of your element, you
//       might need to adjust the width in some cases.
define('sticky',['jquery'], function(jQuery){
  (function($) {
    var defaults = {
        topSpacing: 0,
        bottomSpacing: 0,
        className: 'is-sticky',
        wrapperClassName: 'sticky-wrapper',
        center: false,
        getWidthFrom: '',
        responsiveWidth: false
      },
      $window = $(window),
      $document = $(document),
      sticked = [],
      windowHeight = $window.height(),
      scroller = function() {
        var scrollTop = $window.scrollTop(),
          documentHeight = $document.height(),
          dwh = documentHeight - windowHeight,
          extra = (scrollTop > dwh) ? dwh - scrollTop : 0;

        for (var i = 0; i < sticked.length; i++) {
          var s = sticked[i],
            elementTop = s.stickyWrapper.offset().top,
            etse = elementTop - s.topSpacing - extra;

          if (scrollTop <= etse) {
            if (s.currentTop !== null) {
              s.stickyElement
                .css('position', '')
                .css('top', '');
              s.stickyElement.trigger('sticky-end', [s]).parent().removeClass(s.className);
              s.currentTop = null;
            }
          }
          else {
            var newTop = documentHeight - s.stickyElement.outerHeight()
              - s.topSpacing - s.bottomSpacing - scrollTop - extra;
            if (newTop < 0) {
              newTop = newTop + s.topSpacing;
            } else {
              newTop = s.topSpacing;
            }
            if (s.currentTop != newTop) {
              s.stickyElement
                .css('position', 'fixed')
                .css('top', newTop);

              if (typeof s.getWidthFrom !== 'undefined') {
                s.stickyElement.css('width', $(s.getWidthFrom).width());
              }

              s.stickyElement.trigger('sticky-start', [s]).parent().addClass(s.className);
              s.currentTop = newTop;
            }
          }
        }
      },
      resizer = function() {
        windowHeight = $window.height();

        for (var i = 0; i < sticked.length; i++) {
          var s = sticked[i];
          if (typeof s.getWidthFrom !== 'undefined' && s.responsiveWidth === true) {
            s.stickyElement.css('width', $(s.getWidthFrom).width());
          }
        }
      },
      methods = {
        init: function(options) {
          var o = $.extend({}, defaults, options);
          return this.each(function() {
            var stickyElement = $(this);

            var stickyId = stickyElement.attr('id');
            var wrapperId = stickyId ? stickyId + '-' + defaults.wrapperClassName : defaults.wrapperClassName 
            var wrapper = $('<div></div>')
              .attr('id', stickyId + '-sticky-wrapper')
              .addClass(o.wrapperClassName);
            stickyElement.wrapAll(wrapper);

            if (o.center) {
              stickyElement.parent().css({width:stickyElement.outerWidth(),marginLeft:"auto",marginRight:"auto"});
            }

            if (stickyElement.css("float") == "right") {
              stickyElement.css({"float":"none"}).parent().css({"float":"right"});
            }

            var stickyWrapper = stickyElement.parent();
            stickyWrapper.css('height', stickyElement.outerHeight());
            sticked.push({
              topSpacing: o.topSpacing,
              bottomSpacing: o.bottomSpacing,
              stickyElement: stickyElement,
              currentTop: null,
              stickyWrapper: stickyWrapper,
              className: o.className,
              getWidthFrom: o.getWidthFrom,
              responsiveWidth: o.responsiveWidth
            });
          });
        },
        update: scroller,
        unstick: function(options) {
          return this.each(function() {
            var unstickyElement = $(this);

            var removeIdx = -1;
            for (var i = 0; i < sticked.length; i++)
            {
              if (sticked[i].stickyElement.get(0) == unstickyElement.get(0))
              {
                  removeIdx = i;
              }
            }
            if(removeIdx != -1)
            {
              sticked.splice(removeIdx,1);
              unstickyElement.unwrap();
              unstickyElement.removeAttr('style');
            }
          });
        }
      };

    // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
    if (window.addEventListener) {
      window.addEventListener('scroll', scroller, false);
      window.addEventListener('resize', resizer, false);
    } else if (window.attachEvent) {
      window.attachEvent('onscroll', scroller);
      window.attachEvent('onresize', resizer);
    }

    $.fn.sticky = function(method) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method ) {
        return methods.init.apply( this, arguments );
      } else {
        $.error('Method ' + method + ' does not exist on jQuery.sticky');
      }
    };

    $.fn.unstick = function(method) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method ) {
        return methods.unstick.apply( this, arguments );
      } else {
        $.error('Method ' + method + ' does not exist on jQuery.sticky');
      }

    };
    $(function() {
      setTimeout(scroller, 0);
    });
  })(jQuery);
})

;

define('css!sideMenu',[],function(){});
var BSHARE_SHOST_NAME="http://static.bshare.cn/",BSHARE_BUTTON_HOST="http://b.bshare.cn/",BSHARE_WEB_HOST="http://www.bshare.cn/";(function(f,i){if(!f.bShareUtil||!f.bShareControl)var k=i.documentElement,j=navigator,l=f.BUZZ={},b=f.bShareControl={count:0,viewed:!1,bShareLoad:!1,clicked:!1},e=f.bShareUtil={requestedScripts:[],encode:encodeURIComponent,isIe6:/msie|MSIE 6/.test(j.userAgent),isIe7:/MSIE 7/.test(j.userAgent),isIe8:/MSIE 8/.test(j.userAgent),isIe9:/MSIE 9/.test(j.userAgent),isIe:/Microsoft Internet Explorer/.test(j.appName),isSt:i.compatMode=="CSS1Compat",isQk:function(){return e.isIe6||e.isIe&&!e.isSt},eleInViewport:function(a){if(a.getBoundingClientRect)return a=
	a.getBoundingClientRect(),a.top>=0&&a.left>=0&&a.bottom<=(f.innerHeight||k.clientHeight)&&a.right<=(f.innerWidth||k.clientWidth);for(var c=a.offsetTop,d=a.offsetLeft,b=a.offsetWidth,g=a.offsetHeight;a.offsetParent;)a=a.offsetParent,c+=a.offsetTop,d+=a.offsetLeft;return c>=f.pageYOffset&&d>=f.pageXOffset&&c+g<=f.pageYOffset+f.innerHeight&&d+b<=f.pageXOffset+f.innerWidth},getElemById:function(a){return i.getElementById(a)},createElement:function(a,c,d,b,g){a=i.createElement(a);if(c)a.id=c;if(d)a.className=
	d;if(b)a.style.cssText=b;if(g)a.innerHTML=g;return a},formatParam:function(a,c){return typeof a=="number"?+c:typeof a=="boolean"?/^true$/i.test(c):c},isUndefined:function(a){return typeof a=="undefined"},arrayContains:function(a,c,d){for(var b=a.length;b--;)if(!e.isUndefined(c)&&a[b]===c||!e.isUndefined(d)&&d.test(a[b]))return!0;return!1},loadScript:function(a,c){var d=e.requestedScripts;if(!e.arrayContains(d,a))/(bsMore|bshareS887)(Org)?\.js/.test(a)&&d.push(a),c=c||function(){},d=e.createElement("script"),
	d.src=a,d.type="text/javascript",d.charset="utf-8",d.onload=c,d.onreadystatechange=function(){/complete|loaded/.test(this.readyState)&&c()},i.getElementsByTagName("head")[0].appendChild(d)},loadStyle:function(a){var c=e.createElement("style");c.type="text/css";c.styleSheet?c.styleSheet.cssText=a:c.appendChild(i.createTextNode(a));i.getElementsByTagName("head")[0].appendChild(c)},getOffset:function(a){for(var c={x:a.offsetLeft,y:a.offsetTop,h:a.offsetHeight,w:a.offsetWidth};a=a.offsetParent;c.x+=a.offsetLeft,
	c.y+=a.offsetTop);return c},getElem:function(a,c,d,b){for(var a=a.getElementsByTagName(c),c=[],g=0,h=0,e=a.length;g<e;g++){var f=a[g];if(!d||f.className.indexOf(d)!=-1)c.push(f),typeof b=="function"&&b(f,h++)}return c},getText:function(a){return e.isIe?a.innerText:a.textContent},insertAfter:function(a,c){var d=c.parentNode;d.lastChild===c?d.appendChild(a):d.insertBefore(a,c.nextSibling)},getWH:function(){return{h:(e.isSt?k:i.body).clientHeight,w:(e.isSt?k:i.body).clientWidth}},stopProp:function(a){a=
	a||f.event||{};a.stopPropagation?a.stopPropagation():a.cancelBubble=!0},getScript:function(a){for(var c=i.getElementsByTagName("script"),d=[],b=0,g=c.length;b<g;b++){var h=c[b].src;h&&h.search(a)>=0&&/bshare.(cn|com|me)|static.(local|dev)/i.test(h)&&d.push(c[b])}return d},parseOptions:function(a,c){var d={};if(a=/\?(.*)|#(.*)/.exec(a))for(var a=a[0].slice(1).replace("+"," "),b=a.split(/[&;]/g),g=0,h=b.length;g<h;g++){var e=b[g].split("="),f=decodeURIComponent(e[0]),j=c?e[1]:null;if(!c)try{j=decodeURIComponent(e[1])}catch(i){}d[f]=
	j}return d},submitForm:function(a,c,d,b){var b=b||"post",g=e.createElement("form");i.body.appendChild(g);g.method=b;g.target=d;g.setAttribute("accept-charset","utf-8");g.action=a;for(var h in c)if(typeof c[h]!="function")a=e.createElement("input"),a.type="hidden",a.name=h,a.value=c[h],g.appendChild(a);if(e.isIe)i.charset="utf-8";g.submit();i.body.removeChild(g)},replaceParam:function(a,b,d){return b?d.replace(a,e.encode(b)):d.replace(a,"")},ready:function(a){if(i.addEventListener)i.addEventListener("DOMContentLoaded",
	function(){i.removeEventListener("DOMContentLoaded",arguments.callee,!1);a.call()},!1),f.addEventListener("load",a,!1);else if(i.attachEvent){i.attachEvent("onreadystatechange",function(){i.readyState=="complete"&&(i.detachEvent("onreadystatechange",arguments.callee),a.call())});f.attachEvent("onload",a);var b=!1;try{b=f.frameElement===null}catch(d){}k.doScroll&&b&&function(){try{k.doScroll("left")}catch(d){setTimeout(arguments.callee,10);return}a.call()}()}else f.onload=a},createBuzzObject:function(a,
																																																																																																																															 c){if(f[a])return f[a];c.namespace=a;var d=f[a]={shost:f.BSHARE_SHOST_NAME,bhost:f.BSHARE_BUTTON_HOST,whost:f.BSHARE_WEB_HOST,defaultConfig:c,params:{type:0,publisherUuid:"",url:"",title:"",summary:"",content:"",pic:"",pics:"",video:"",vTag:"",vUid:"",vEmail:"",product:"",price:"0",brand:"",tag:"",category:"",template:"1",popcss:"",apvuid:"",apts:"",apsign:"",admtest:!1},isReady:!1,completed:!1,curb:0,preb:-1,entries:[],counters:[],viewInfo:null};d.config={};d.elems={powerBy:'<div id="bsPower" style="float:right;text-align:right;overflow:hidden;height:100%;"><a class="bsSiteLink" style="font-size:10px;vertical-align:text-bottom;line-height:24px;cursor:pointer;" href="'+
d.whost+'" target="_blank"><span style="font-size:10px;vertical-align:text-bottom;"><span style="color:#f60;">b</span>Share</span></a></div>'};for(var m in d.defaultConfig)d.config[m]=d.defaultConfig[m];d.imageBasePath=d.shost+"/frame/images/";d.jsBasePath=d.shost+"/b/";d.addEntry=function(a){if(typeof d.counters=="number")d.counters=[];d.entries.push(a);d.counters.push(0)};d.fc="";d.createFlashObj=function(){if(!e.getElemById("bshareFS")){var a=d.shost+"/flash/bfc.swf";i.body.appendChild(e.createElement("div",
	"","","height:0;line-height:0;font-size:0;",'<object id="bshareFS" type="application/x-shockwave-flash" data="'+a+'" width="0" height="0"><param name="movie" value="'+a+'"/><param name="allowScriptAccess" value="always"/><param name="allowNetworking" value="all"/></object>'));l.fCB=function(){b.viewed||d.view()}}};d.updateFC=function(a){try{var b=j.appName.indexOf("Microsoft")!=-1?f.bshareFS:i.bshareFS;d.fc=b.bSyncInfo(a||"")}catch(c){}};d.initAdm=function(){var a=e.createElement("a"),b,c,m;m=["http://storage.xuetangx.com/public_assets/xuetangx/event/zhaomu2015/rayli.com"];
	a.href=f.location.href;a=a.host;for(b=0,c=m.length;b<c;++b)if(a.indexOf(m[b])>-1){d.params.admtest=!0;break}if(!d.params.admtest)return"";d.admIdsObj=[];m=i.getElementsByTagName("object");for(b=0,c=m.length;b<c;++b)a=m[b].id,a=j.appName.indexOf("Microsoft")!=-1?e.getElemById(a):i[a],a.objVisible&&(d.admIdsObj[b]=a);if(d.admIdsObj.length!=0)d.eleInViewportEvent=function(){for(b=0,c=d.admIdsObj.length;b<c;b++){var a=d.admIdsObj[b];if(a&&e.eleInViewport(a)&&!a.isViewed)try{a.objVisible(),a.isViewed=
		!0}catch(g){}}},f.addEventListener?f.addEventListener("scroll",d.eleInViewportEvent,!1):f.attachEvent("onscroll",d.eleInViewportEvent),d.eleInViewportEvent()};return f[a]},parseBuzzOptions:function(a,b,d,f,g){var c;c=(a=e.getScript(b)[a])?e.parseOptions(a.src):{},a=c;g&&(a=g(a));for(var h in a)if(!e.isUndefined(a[h])&&!(a[h]===null||typeof d[h]=="number"&&a[h]===""))e.isUndefined(d[h])?e.isUndefined(f[h])||(f[h]=e.formatParam(f[h],a[h])):d[h]=e.formatParam(d[h],a[h])}}})(window,document);(function(f,i,k){var j=i.bShareUtil,l=i.bShareControl;if(!(l.count>0)){var b=j.createBuzzObject(f,{lang:"zh",height:0,width:0,image:"",bgc:"none",fgc:"#333",poptxtc:"#666",popbgc:"#f2f2f2",sn:!1,logo:!0,style:1,fs:0,inline:!1,beta:!1,popjs:"",popHCol:2,pop:0,mdiv:0,poph:"auto",bps:"",bps2:"",showShareCount:!0,icon:!0,text:null,promote:!1}),e=b.config,a=b.params;b.boxConfig={position:0,boxHeight:408,boxWidth:548,closeTop:8,closeRight:20,hasTop:!0,hasFrame:!0,hasMore:!0};b.boxConfigEC={position:0,boxHeight:404,
	boxWidth:650,closeTop:10,closeRight:16,hasFrame:!0};b.boxConfigWX={id:"bsWXBox",position:0,boxHeight:245,boxWidth:220,closeTop:8,closeRight:20,hasTop:!0};b.customization={};b.loadOptions=function(){j.parseBuzzOptions(0,/button(Lite)?(Org)?\.js|bshare_load/,e,a,function(a){if(!j.isUndefined(i.bShareOpt))for(var c in i.bShareOpt)a[c]=i.bShareOpt[c];if(!j.arrayContains(b.langs,a.lang))a.lang="zh";if(a.h&&a.w&&a.img)a.height=a.h,a.width=a.w,a.image=a.img;a.bgc=a.bgcolor||void 0;a.fgc=a.textcolor||void 0;
	a.logo=!(a.logo&&/^false$/i.test(a.logo));a.popHCol=a.pophcol||void 0;if(a.style)a.style=/^(-1|0|1|2|3|4|5|10|11|999)$/.test(a.style)?+a.style:void 0;if(a.bp)a.style&&a.style==2?a.bps2=a.bp.split(","):a.bps=a.bp.split(",");a.showShareCount=a.style&&/3|4|5/.test(a.style)?!1:!(a.ssc&&/^false$/i.test(a.ssc.toString()));a.type=i.BSHARE_BUTTON_TYPE||a.type;a.publisherUuid=a.uuid||void 0;return a});for(var c in b.defaultConfig)b.defaultConfig[c]!==e[c]&&(b.customization[c]=e[c]);if(a.type!=15)a.popcss=
	"";if(i.location.href.indexOf(b.whost+"/moreStyles")<0)e.promote=!1};b.writeButton=function(){var a="",d={0:0,1:[110,85],10:[90,51],11:[82,82]},f={0:16,1:24,10:21,11:49},g=b.imageBasePath,h=e.style,i=e.image,l=e.showShareCount,n=e.width,o=e.height;/^(3|4|5)$/.test(h)||(a='<div class="bsPromo bsPromo1"></div>');h>1&&h<6?b.writeBshareDiv(a):h==-1?(j.getElem(k,"div","bshare-custom",function(a){if(!a.childNodes[0].className||a.childNodes[0].className.indexOf("bsPromo")<0){var c=j.createElement("div",
	"","bsPromo bsPromo"+(b.isLite?2:1));a.insertBefore(c,a.childNodes[0])}}),(e.beta||e.popjs)&&b.writeBshareDiv('<div class="buzzButton">'+e.text+"</div>","")):h>=0&&(h!=999&&(i=g+"logo_square_s.gif",h!=0&&(i=g+"button_custom"+h+"-"+(e.lang=="en"?"en":"zh"),l&&(i+="-c"),h==10&&(n=/Blue|Red|Green|Grey|Orange/.test(e.bgc)?e.bgc:"Orange",i+="-"+n),i+=".gif"),n=d[h][l?0:1],o=f[h]),a+='<div class="buzzButton bsStyle'+h+'" style="height:'+o+"px;color:"+e.fgc+";",h==0?(a+=e.icon?"background:transparent url("+
i+") no-repeat;":"",a+='float:left"><div style="padding:0 4px 0 '+(e.icon?"21px":"0")+";"+(b.isLite?"height:16px;":"")+'"><span class="bshareText" style="line-height:18px;float:left;">'+(e.text===null?"\u5206\u4eab":e.text)+"</span></div></div>",l&&(a+='<div style="background:transparent url('+g+'counter_box.gif) no-repeat;float:left;width:40px;height:16px;text-align:center;font-weight:bold;">&nbsp;<span style="position:relative;line-height:16px;" class="shareCount"></span></div>')):(a+=";background:transparent url("+
i+") no-repeat;text-align:center;width:"+n+'px;">',l&&h!=999&&(a+='<span style="font-weight:bold;position:relative;line-height:'+(h==10?"22":"25")+'px;" class="shareCount"></span>'),a+="</div>"),a+='<div style="clear:both;"></div>',b.writeBshareDiv(a,"font-size:12px;height:"+o+"px;width:"+n+"px;"))};b.more=function(){return typeof b.moreDiv=="function"?(b.moreDiv(),!0):!1};b.load=function(c){if(!c){if(e.mdiv<0)return;var d=0,f=setInterval(function(){b.more()||d>=30?clearInterval(f):++d},100);return!1}a.target=
	c||"";b.click();b.disappear();b.prepare();if(!b.loadPlus||!b.loadPlus()){var g;if(c=="bsharesync")g=[b.whost,"/bsyncShare?site=",c].join(""),b.updateCounter(),b.shareStats(c),j.submitForm(g,a,"_blank");else if(c=="email")g=[b.bhost,"/bshareEmail"].join(""),b.shareStats(c),j.submitForm(g,a,"_blank");else if(c=="clipboard")j.copy2Clipboard(),b.shareStats(c);else if(c=="favorite")j.add2Bookmark(),b.shareStats(c);else if(c=="printer")j.add2Printer(),b.shareStats(c);else if(c=="weixin"){g=b.bhost+"/barCode?site=weixin";
	for(var h in a)!/content|target/.test(h)&&typeof a[h]!="function"&&(g+="&"+h+"="+j.encode(a[h]));k.getElementById("bsWXBox")||b.createBox(b.boxConfigWX);b.getFrame(b.boxConfigWX).innerHTML='<img style="width:178px;height:178px;margin:21px;display:inline-block;" src="'+g+'" />';b.display(!1,b.boxConfigWX)}else{if(l.bShareLoad)for(h in g=b.bhost+"/bshare_redirect?site="+c,a)!/content|target/.test(h)&&typeof a[h]!="function"&&(g+="&"+h+"="+j.encode(a[h]));else(g=i.BS_PURL_MAP[c])||alert(b.iL8n.loadFailed),
	c=="gmw"?g=j.replaceParam("${URL}",a.url.replace("http://",""),g):a.url&&(g=j.replaceParam("${URL}",a.url,g)),g=j.replaceParam("${TITLE}",a.title,g),g=j.replaceParam("${CONTENT}",a.summary,g),g=j.replaceParam("${IMG}",a.pic,g),g=j.replaceParam("${VIDEO}",a.video,g);i.open(g,"","height=600,width=800,top=100,left=100,screenX=100,screenY=100,scrollbars=yes,resizable=yes")}}};b.show=function(){b.load()};b.onLoad=function(){j.getElem(k,"a","bshareDiv",function(a,c){j.getElem(a,"div","buzzButton",function(a){a.onclick=
	function(a){return function(c){b.more(c,a);return!1}}(c)})});var a=e.showShareCount;if(e.style==0){var d=j.getElem(k,"div","buzzButton")[0].offsetWidth;a&&(d+=41);j.getElem(k,"a","bshareDiv",function(a){a.style.width=d+"px"})}var f=b.entries.length;if(a&&f>0){for(var a="",g=0;g<f;g++){var h=b.entries[g];if(typeof h.url=="string"){if(j.isIe&&a.length+h.url.length>2E3)break;a!=""&&(a+="|");a+=h.url}}a!=""&&(a+="|");a+=i.location.href;b.count(a)}};b.renderButton=function(){j.loadStyle("a.bshareDiv,#bsPanel,#bsMorePanel,#bshareF{border:none;background:none;padding:0;margin:0;font:12px Helvetica,Calibri,Tahoma,Arial,\u5b8b\u4f53,sans-serif;line-height:14px;}#bsPanel div,#bsMorePanel div,#bshareF div{display:block;}.bsRlogo .bsPopupAwd,.bsRlogoSel .bsPopupAwd,.bsLogo .bsPopupAwd,.bsLogoSel .bsPopupAwd{line-height:16px !important;}a.bshareDiv div,#bsFloatTab div{*display:inline;zoom:1;display:inline-block;}a.bshareDiv img,a.bshareDiv div,a.bshareDiv span,a.bshareDiv a,#bshareF table,#bshareF tr,#bshareF td{text-decoration:none;background:none;margin:0;padding:0;border:none;line-height:1.2}a.bshareDiv span{display:inline;float:none;}div.buzzButton{cursor:pointer;font-weight:bold;}.buzzButton .shareCount a{color:#333}.bsStyle1 .shareCount a{color:#fff}span.bshareText{white-space:nowrap;}span.bshareText:hover{text-decoration:underline;}a.bshareDiv .bsPromo,div.bshare-custom .bsPromo{display:none;position:absolute;z-index:100;}a.bshareDiv .bsPromo.bsPromo1,div.bshare-custom .bsPromo.bsPromo1{width:51px;height:18px;top:-18px;left:0;line-height:16px;font-size:12px !important;font-weight:normal !important;color:#fff;text-align:center;background:url("+
b.imageBasePath+"bshare_box_sprite2.gif) no-repeat 0 -606px;}div.bshare-custom .bsPromo.bsPromo2{background:url("+b.imageBasePath+"bshare_promo_sprite.gif) no-repeat;cursor:pointer;}");b.writeButton();a.type==15&&b.filterECPlats()};b.loadButtonStyle=function(){if(a.type!=15){var c,d=e.style;if(e.beta)c=b.jsBasePath+"styles/bshareS888.js?v=20140606";else if(e.popjs)c=e.popjs;else if(e.style!=-1&&(c=b.jsBasePath+"styles/bshareS"+(d>1&&d<6?d:1)+".js?v=20140606",e.pop==-1&&(d<=1||d>=6)))c="";c&&j.loadScript(c)}};b.international=
	function(a){e.lang=="zh"?a():j.loadScript(b.jsBasePath+"langs/bs-lang-"+e.lang+".js?v=20140606",a)};b.start=function(){j.loadEngine&&(j.loadEngine(f),b.createFlashObj(),b.loadOptions(),b.international(function(){if(!b.completed){if(j.isUndefined(e.text)||e.text===null)e.text=e.style==0?b.iL8n.shareTextShort:b.iL8n.shareText;a.type!=1&&b.renderButton();j.createShareBox(f);if(a.type==15)b.boxConfig=b.boxConfigEC;b.createBox();e.mdiv>=0&&a.type!=15&&j.loadScript(b.jsBasePath+"components/bsMore.js?v=20140606");if(a.type==
	1)return b.load(),!1;b.loadButtonStyle();b.onLoad();b.prepare(0);setTimeout(function(){l.viewed||b.view();setTimeout(function(){l.bShareLoad||j.loadScript(b.jsBasePath+"components/bsPlatforms.js?v=20140606")},3E3)},3E3);b.completed=!0}}))};b.init=function(){if(!b.isReady)b.isReady=!0,j.loadScript(b.jsBasePath+"engines/bs-engine.js?v=20140606",b.start)};j.loadScript(b.jsBasePath+"components/bsStatic.js?v=20140606")}})("bShare",window,document);(function(f,i,k){if(!(i.bShareControl.count>0)){i.bShareControl.count+=1;var j=i.bShareUtil,f=i[f],l=f.config;f.isLite=!0;f.customization.type="lite";f.writeBshareDiv=function(b,e){j.getElem(k,"a","bshareDiv",function(a){if(b)a.innerHTML=b;else if(a.innerHTML.length<24)a.innerHTML="";a.onclick=function(){return!1};a.style.cssText=(l.inline?"":"display:block;")+"text-decoration:none;padding:0;margin:0;"+e||""})};j.ready(f.init)}})("bShare",window,document);(function(){var f=window.bShare;if(!f)f=window.bShare={};f.pnMap={115:["115\u6536\u85cf\u5939",0],"139mail":["139\u90ae\u7bb1",2],"9dian":["\u8c46\u74e39\u70b9",6],baiducang:["\u767e\u5ea6\u641c\u85cf",7],baiduhi:["\u767e\u5ea6\u7a7a\u95f4",8],bgoogle:["Google\u4e66\u7b7e",10],bsharesync:["\u4e00\u952e\u901a",16],caimi:["\u8d22\u8ff7",17],cfol:["\u4e2d\u91d1\u5fae\u535a",18],chouti:["\u62bd\u5c49",20],clipboard:["\u590d\u5236\u7f51\u5740",21],cyolbbs:["\u4e2d\u9752\u8bba\u575b",22],cyzone:["\u521b\u4e1a\u5427",23],delicious:["\u7f8e\u5473\u4e66\u7b7e",24],dig24:["\u9012\u5ba2\u7f51",25],digg:["Digg",26],diglog:["\u5947\u5ba2\u53d1\u73b0",27],diigo:["Diigo",29],douban:["\u8c46\u74e3\u7f51",30],dream:["\u68a6\u5e7b\u4eba\u751f",31],duitang:["\u5806\u7cd6",32],eastdaymb:["\u4e1c\u65b9\u5fae\u535a",33],email:["\u7535\u5b50\u90ae\u4ef6",
	34],evernote:["Evernote",35],facebook:["Facebook",36],fanfou:["\u996d\u5426",37],favorite:["\u6536\u85cf\u5939",38],feixin:["\u98de\u4fe1",39],friendfeed:["FriendFeed",40],fwisp:["Fwisp",42],ganniu:["\u8d76\u725b\u5fae\u535a",43],gmail:["Gmail",44],gmw:["\u5149\u660e\u7f51",45],gtranslate:["\u8c37\u6b4c\u7ffb\u8bd1",46],hemidemi:["\u9ed1\u7c73\u4e66\u7b7e",47],hexunmb:["\u548c\u8baf\u5fae\u535a",48],huaban:["\u82b1\u74e3",49],ifengkb:["\u51e4\u51f0\u5feb\u535a",50],ifengmb:["\u51e4\u51f0\u5fae\u535a",51],ifensi:["\u7c89\u4e1d\u7f51",52],instapaper:["Instapaper",53],itieba:["i\u8d34\u5427",54],joinwish:["\u597d\u613f\u7f51",55],kaixin001:["\u5f00\u5fc3\u7f51",56],laodao:["\u5520\u53e8\u7f51",57],leihou:["\u96f7\u7334",58],leshou:["\u4e50\u6536",59],linkedin:["LinkedIn",
	60],livespace:["MS Livespace",61],mala:["\u9ebb\u8fa3\u5fae\u535a",63],masar:["\u739b\u6492\u7f51",65],meilishuo:["\u7f8e\u4e3d\u8bf4",66],miliao:["\u7c73\u804a",67],mister_wong:["Mister Wong",68],mogujie:["\u8611\u83c7\u8857",69],moptk:["\u732b\u6251\u63a8\u5ba2",70],msn:["MSN",71],myshare:["MyShare",72],myspace:["MySpace",73],neteasemb:["\u7f51\u6613\u5fae\u535a",74],netvibes:["Netvibes",75],peoplemb:["\u4eba\u6c11\u5fae\u535a",76],pinterest:["Pinterest",79],poco:["Poco\u7f51",81],printer:["\u6253\u5370",82],printf:["Print Friendly",83],qqmb:["\u817e\u8baf\u5fae\u535a",84],qqshuqian:["QQ\u4e66\u7b7e",85],qqxiaoyou:["\u670b\u53cb\u7f51",86],qzone:["QQ\u7a7a\u95f4",87],readitlater:["ReadItLater",88],
	reddit:["Reddit",89],redmb:["\u7ea2\u5fae\u535a",90],renjian:["\u4eba\u95f4\u7f51",91],renmaiku:["\u4eba\u8109\u5e93",92],renren:["\u4eba\u4eba\u7f51",93],shouji:["\u624b\u673a",95],sinaminiblog:["\u65b0\u6d6a\u5fae\u535a",96],sinaqing:["\u65b0\u6d6aQing",97],sinavivi:["\u65b0\u6d6aVivi",98],sohubai:["\u641c\u72d0\u767d\u793e\u4f1a",99],sohuminiblog:["\u641c\u72d0\u5fae\u535a",100],southmb:["\u5357\u65b9\u5fae\u535a",101],stumbleupon:["StumbleUpon",102],szone:["\u5b88\u682a\u7f51",103],taojianghu:["\u6dd8\u6c5f\u6e56",104],tianya:["\u5929\u6daf",105],tongxue:["\u540c\u5b66\u5fae\u535a",106],tuita:["\u63a8\u4ed6",107],tumblr:["Tumblr",108],twitter:["Twitter",109],ushi:["\u4f18\u58eb\u7f51",110],waakee:["\u6316\u5ba2",112],wealink:["\u82e5\u90bb\u7f51",113],woshao:["\u6211\u70e7\u7f51",115],xianguo:["\u9c9c\u679c\u7f51",
		116],xiaomeisns:["\u6821\u5a92\u91c7\u901a",117],xinminmb:["\u65b0\u6c11\u5fae\u535a",118],xyweibo:["\u5fae\u535a\u6821\u56ed",119],yaolanmb:["\u6447\u7bee\u5fae\u535a",120],yijee:["\u6613\u96c6\u7f51",121],youdao:["\u6709\u9053\u4e66\u7b7e",122],zjol:["\u6d59\u6c5f\u5fae\u535a",124],xinhuamb:["\u65b0\u534e\u5fae\u535a"],szmb:["\u6df1\u5733\u5fae\u535a"],changshamb:["\u5fae\u957f\u6c99"],hefeimb:["\u5408\u80a5\u5fae\u535a"],wansha:["\u73a9\u5565e\u65cf"],"189share":["\u624b\u673a\u5feb\u4f20"],diandian:["\u70b9\u70b9\u7f51"],tianji:["\u5929\u9645\u7f51"],jipin:["\u5f00\u5fc3\u96c6\u54c1"],chezhumb:["\u8f66\u4e3b\u5fae\u535a"],gplus:["Google+"],yidongweibo:["\u79fb\u52a8\u5fae\u535a"],youdaonote:["\u6709\u9053\u7b14\u8bb0"],jschina:["\u5fae\u6c5f\u82cf"],mingdao:["\u660e\u9053"],jxcn:["\u6c5f\u897f\u5fae\u535a"],qileke:["\u5947\u4e50\u6536\u85cf"],sohukan:["\u641c\u72d0\u968f\u8eab\u770b"],maikunote:["\u9ea6\u5e93\u8bb0\u4e8b"],lezhimark:["\u4e50\u77e5\u4e66\u7b7e"],"189mail":["189\u90ae\u7bb1"],
	wo:["WO+\u5206\u4eab"],gmweibo:["\u5149\u660e\u5fae\u535a"],jianweibo:["\u5409\u5b89\u5fae\u535a"],qingbiji:["\u8f7b\u7b14\u8bb0"],duankou:["\u7aef\u53e3\u7f51"],qqim:["QQ\u597d\u53cb"],kdweibo:["\u4e91\u4e4b\u5bb6"],xueqiu:["\u96ea\u7403"],weixin:["\u5fae\u4fe1"]};f.iL8n={promoteHot:"\u70ed",promoteNew:"\u65b0",promoteRec:"\u63a8\u8350",rtnTxt:"\u9009\u62e9\u5176\u4ed6\u5e73\u53f0 >>",shareText:"\u5206\u4eab\u5230",shareTextShort:"\u5206\u4eab",shareTextPromote:"\u5206\u4eab\u6709\u793c",morePlats:"\u66f4\u591a\u5e73\u53f0...",morePlatsShort:"\u66f4\u591a...",whatsThis:"\u8fd9\u662f\u4ec0\u4e48\u5de5\u5177\uff1f",promote:"\u5206\u4eab\u6709\u793c",promoteShort:"\u5956",searchHint:"\u8f93\u5165\u5e73\u53f0\u5173\u952e\u5b57\u67e5\u8be2",closeHint:"30\u5206\u949f\u5185\u4e0d\u518d\u51fa\u73b0\u6b64\u5206\u4eab\u6846",loadFailed:"\u7f51\u7edc\u592a\u6162\u65e0\u6cd5\u52a0\u8f7d\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002",loadFailed2:"\u5f88\u62b1\u6b49\uff0c\u65e0\u6cd5\u8fde\u63a5\u670d\u52a1\u5668\u3002\u8bf7\u7a0d\u540e\u91cd\u8bd5\uff01",notSupport:"\u4e0d\u652f\u6301\uff01",copySuccess:"\u590d\u5236\u6210\u529f\uff01\u60a8\u53ef\u4ee5\u7c98\u8d34\u5230QQ/MSN\u4e0a\u5206\u4eab\u7ed9\u60a8\u7684\u597d\u53cb\uff01",
	copyTip:"\u8bf7\u6309Ctrl+C\u590d\u5236\uff0c\u7136\u540e\u60a8\u53ef\u4ee5\u7c98\u8d34\u5230QQ/MSN\u4e0a\u5206\u4eab\u7ed9\u60a8\u7684\u597d\u53cb\uff01",bookmarkTip:"\u6309\u4e86OK\u4ee5\u540e\uff0c\u8bf7\u6309Ctrl+D\uff08Macs\u7528Command+D\uff09\u3002",confirmClose:"\u5173\u95ed\u540e\uff0c\u8be5\u5206\u4eab\u6309\u94ae30\u5206\u949f\u5c06\u4e0d\u518d\u51fa\u73b0\uff0c\u60a8\u4e5f\u65e0\u6cd5\u4f7f\u7528\u5206\u4eab\u529f\u80fd\uff0c\u786e\u5b9a\u5417\uff1f"}})();

define("bShare", function(){});

define('sideMenu',['require','exports','module','jquery','css!sideMenu','bShare'],function(require, exports, module) {
	var $ = require('jquery');
	require('css!sideMenu');
	require('bShare');
	var ClassShare = function(option) {
		this.option = $.extend(true, {
			shareJson: {
				title: document.title, //分享的标题
				url: location.href, //分享的url
				summary: $('meta[name=description]').attr('content'), //分享的简介
				pic: $('body').data('bshareimg') //分享的图片
			},
			$join_btn: $('#join_btn'), // 页面上的加入课程按钮 => jquery对象
			disabled: [], //哪些按钮不显示 join=>加入课程  com=>评论  mailTo=>邮件 share=>分享 goTo=>回到顶部
			email: 'http://storage.xuetangx.com/public_assets/xuetangx/event/zhaomu2015/jobs-xy@xuetangx.com',
			offset: null
		}, option || {});
		this.clickBl = true;
		this.css3 = this.supportCss3('transition');
		bShare.addEntry(this.option.shareJson);
		this.createElement();
		this.disabled();
		this.shareBtn = this.p.find('.side_share_share').children('a');
		this.weiboBtn = this.shareBtn.next().find('li');
		this.join = this.option.$join_btn;
		this.w = $(window);
		this.wh = this.option.offset || this.w.height();
		this.goTop();
		this.scrollShow();
		this.doJoin();
	};
	ClassShare.prototype.createElement = function() {
		var mainHTML = '<div id="side_share"' + (this.css3 ? '' : 'style="display:none;-ms-transform:scale(1);transform:scale(1);-webkit-transform:scale(1);-moz-transform:scale(1);"') + '>' +
			'<ul>' +
			'<li class="side_share_li side_share_join"><a href="javascript:" title="加入课程"></a></li>' +
			'<li class="side_share_li side_share_com"><a href="javascript:" title="评论"></a></li>' +
			'<li class="side_share_li side_share_mailTo"><a href="mailto:' + this.option.email + '" title="发送邮件"></a></li>' +
			'<li class="side_share_li side_share_share"><a href="javascript:" title="分享"></a>' +
			'<ol class="side_share_weibo">' +
			'<li class="side_share_sina" data-type="sinaminiblog"><a href="javascript:" title="新浪微博"></a></li>' +
			'<li class="side_share_douban" data-type="douban"><a href="javascript:" title="豆瓣"></a></li>' +
			'<li class="side_share_weixin" data-type="weixin"><a href="javascript:" title="微信"></a></li>' +
			'<li class="side_share_renren" data-type="renren"><a href="javascript:" title="人人网"></a></li>' +
			'<li class="side_share_qq" data-type="qzone"><a href="javascript:" title="QQ空间"></a></li>' +
			'</ol>' +
			'</li>' +
			'<li class="side_share_li side_share_goTo"><a href="javascript:" title="回到顶部"></a></li>' +
			'</ul>' +
			'</div>';
		this.p = $(mainHTML).appendTo('body');
	};
	ClassShare.prototype.disabled = function() {
		var _this = this;
		$.each(this.option.disabled, function(i, t) {
			_this.p.find('.side_share_' + t).hide();
		});
	};
	ClassShare.prototype.scrollShow = function() {
		var _this = this;
		this.w.on('scroll', (function() {
			var bl = false;
			return function() {
				var iscroll = _this.w.scrollTop();
				if (iscroll >= _this.wh && !bl) {
					if (_this.css3) {
						_this.p.css('transform', 'scale(1)');
					} else {
						_this.p.css('display', 'block');
					}!_this.weiboBtnWidth && _this.weiboBtns();
					bl = true;
				} else if (iscroll < _this.wh && bl) {
					if (_this.css3) {
						_this.p.css('transform', 'scale(0)');
					} else {
						_this.p.css('display', 'none');
					}
					bl = false;
				}
			}
		})());
		this.w.on('resize', function() {
			_this.wh = _this.w.height();
		});
	}
	ClassShare.prototype.weiboBtns = function() {
		var _this = this;
		this.weiboBtnWidth = this.weiboBtn.width();
		this.shareBtn.on({
			'click': function(e) {
				_this.clickBl && e.stopPropagation();
				$(this).parent().addClass('side_share_share_on');
				_this.weiboBtn.each(function(i) {
					$(this).css({
						'transform': 'translate3d(' + (((-i * _this.weiboBtnWidth - 65) - i * 10) - 10) + 'px,0,0)',
						'opacity': 1
					});
					if (!_this.css3) {
						$(this).css('left', (((-i * _this.weiboBtnWidth - 65) - i * 10) - 10));
					}
				});
				_this.clickBl = !_this.clickBl;
			}
		});
		$(document).on('click', function(e) {
			_this.clickBl = true;
			_this.shareBtn.parent().removeClass('side_share_share_on');
			_this.weiboBtn.each(function(i) {
				$(this).css({
					'transform': 'translate3d(0,0,0)',
					'opacity': 0
				});
			});
		});
		this.weiboBtn.on('click', function(event) {
			bShare.init();
			bShare.share(event, $(this).data('type'), 0);
		});
	};
	ClassShare.prototype.goTop = function() {
		$('.side_share_goTo').on('click', function() {
			$('body,html').stop().animate({
				'scrollTop': 0
			});
		});
	};
	ClassShare.prototype.supportCss3 = (function() {
		var dstyle = document.createElement('div').style,
			vendors = 'Webkit Moz O ms'.split(' ');
		vendors.push('');
		return function(prop) {
			prop = prop.replace(/^[a-z]/, function(val) {
				return val.toUpperCase();
			});
			for (var i = 0, l = vendors.length; i < l; i++) {
				if (vendors[i] + prop in dstyle) {
					return true;
				}
			}
			return false;
		}
	})();
	ClassShare.prototype.doJoin = function() {
		var _this = this;
		this.p.find('.side_share_join').on('click', function() {
			var sHref = _this.join.attr('href');
			if (sHref == 'javascript:' || sHref == '' || sHref == '#' || !sHref) {
				_this.join.trigger('click');
			} else {
				location.href = sHref;
			}
		});
	};
	if (window.jQuery) {
		$.sideMenu = function(option) {
			return new ClassShare(option);
		};
	}
	return function(option) {
		return new ClassShare(option);
	}
});
require(['jquery', 'alert', 'appCommon', 'checkForm', 'sticky', 'sideMenu'], function($, alertM, appCommon) {
	appCommon(function() {
		$.sideMenu({
			shareJson: {
				title: '#合作老师大招募#',
				summary: "在学堂在线，体验世界名校的精品课程、感受国外名师的教学方法，亲身参与MOOC教学，提前感受教育变革，您将成为国外名校课程在中国的代言人！同时，课程助教也在同步招募中。",
				pic: "share.jpg"/*tpa=http://storage.xuetangx.com/public_assets/xuetangx/event/zhaomu2015/share.jpg*/
			},
			disabled: ['com', 'join', 'mailTo']
		});
		$('#cc_weixin').on('click', function(event) {
			event.preventDefault();
			alertM({
				titleHTML: '',
				mainHTML: '<img src="../../../../../s.xuetangx.com/guanzhu_wx.jpg"/*tpa=http://s.xuetangx.com/guanzhu_wx.jpg*/>',
				isDoBtn: 0
			});
		});
		$(function() {
			$('body').show();
			$('body, html').scrollTop(101);
			(function() {
				var $form = $('#form').find('form');
				$form.eq(0).show();
			})();
			(function() {
				var $form = $('#form').find('form');
				var $identity = $('#form').find('.identity');
				$('#entrance').find('a').on('click', function(e) {
					var $t = $(this);
					if ($t.attr('href') != 'javascript:') {
						return true;
					}
					e.preventDefault();
					$form.hide().eq($t.index()).show();
					$('ins.dark-tooltip').remove();
					$('#entrance').find('a').css('background', 'none').eq($t.index()).css('background', '#cef4ff');
				});
			})();
			(function() {
				$('#t_same_true').add('#t_same_false').on('change', function() {
					$('ins.dark-tooltip').remove();

				});
				var $count = $('#t_count_text');
				var getLength = function(str) {
					var iNum = 0;
					for (var i = 0, l = str.length; i < l; i++) {
						encodeURI(str.charAt(i)).length > 2 ? iNum++ : iNum += 0.5;
					}
					return Math.ceil(iNum);
				};
				$('#introduction_partner').on('input', function() {
					var iNum = 300 - getLength($(this).val());
					if (iNum >= 0) {
						$count.html('您还可以输入' + iNum + '个字');
					} else {
						$count.html('您的内容超出的' + (iNum * -1) + '个字');
					}
				});
				var $countz = $('#t_count_text_z');
				var getLength = function(str) {
					var iNum = 0;
					for (var i = 0, l = str.length; i < l; i++) {
						encodeURI(str.charAt(i)).length > 2 ? iNum++ : iNum += 0.5;
					}
					return Math.ceil(iNum);
				};
				$('#introduction_partner_z').on('input', function() {
					var iNum = 300 - getLength($(this).val());
					if (iNum >= 0) {
						$countz.html('您还可以输入' + iNum + '个字');
					} else {
						$countz.html('您的内容超出的' + (iNum * -1) + '个字');
					}
				});
				var $countt = $('#t_count_text_t');
				var getLength = function(str) {
					var iNum = 0;
					for (var i = 0, l = str.length; i < l; i++) {
						encodeURI(str.charAt(i)).length > 2 ? iNum++ : iNum += 0.5;
					}
					return Math.ceil(iNum);
				};
				$('#introduction_partner_t').on('input', function() {
					var iNum = 300 - getLength($(this).val());
					if (iNum >= 0) {
						$countt.html('您还可以输入' + iNum + '个字');
					} else {
						$countt.html('您的内容超出的' + (iNum * -1) + '个字');
					}
				});

				$('#aim_1').on('change', function() {
					$('ins.dark-tooltip').remove();
					if ($(this).is(':checked')) {
						$('#aim_1_text').show();
					} else {
						$('#aim_1_text').hide().find('input').val('');
					}
				});
				$('#aim_2').on('change', function() {
					$('ins.dark-tooltip').remove();
					if ($(this).is(':checked')) {
						$('#aim_2_text').show();
					} else {
						$('#aim_2_text').hide().find('input').val('');
					}
				});
			})();
			(function() {

				$.checkForm({
					scrollOffset: -110,
					eachErrCallback: function(msg) {
						var $tip = $("<span class='tip_alert'>&nbsp&nbsp&nbsp&nbsp" + msg + "</span>");
						$(this).parent().append($tip);
					},
					succCallback: function() {
						$("form").each(function() {
							$(this).append("<input type='hidden' name='mailto' value='" + data.mailto + "'>");
						});

						var $t = $(this);
						if ($t.data('submit') == 'person') {
							$.ajax({
								url: $('#person_form').attr('action'),
								type: 'post',
								dataType: 'json',
								data: $('#person_form').serialize()
							}).done(function(response) {
								if (response.status) {
									$('.tip_msg').show();
									$('#err_msg_p').add('.form_area').hide();
									$('html, body').scrollTop(750);
								} else {
									$('#err_msg_p').html(response.error_msg).show();
								}
							}).fail(function() {
								alertM({
									tip: 1,
									type: 'err',
									mainHTML: '提交失败！请检测您的网络链接是否已断开！'
								});
							});
						} else if ($t.data('submit') == 'zhujiao') {
							$.ajax({
								url: $('#zhujiao_form').attr('action'),
								type: 'post',
								dataType: 'json',
								data: $('#zhujiao_form').serialize()
							}).done(function(response) {
								if (response.status) {
									$('.tip_msg').show();
									$('#err_msg_z').add('.form_area').hide();
									$('html, body').scrollTop(750);
								} else {
									$('#err_msg_z').html(response.error_msg).show();
								}
							}).fail(function() {
								alertM({
									tip: 1,
									type: 'err',
									mainHTML: '提交失败！请检测您的网络链接是否已断开！'
								});
							});
						} else {
							$.ajax({
								url: $('#tuijian_form').attr('action'),
								type: 'post',
								dataType: 'json',
								data: $('#tuijian_form').serialize()
							}).done(function(response) {
								if (response.status) {
									$('.tip_msg').show();
									$('#err_msg_t').add('.form_area').hide();
									$('html, body').scrollTop(750);
								} else {
									$('#err_msg_t').html(response.error_msg).show();
								}
							}).fail(function() {
								alertM({
									tip: 1,
									type: 'err',
									mainHTML: '提交失败！请检测您的网络链接是否已断开！'
								});
							});
						}
					}
				});
			})();
		});
	});
});

define("special/zhaomutwo", function(){});


(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})
('#alert_cover{background-color:rgba(0,0,0,.5);width:100%;height:100%;position:fixed;text-align:center;top:0;left:0;display:table;-webkit-animation:fade .3s;-moz-animation:fade .3s;animation:fade .3s;z-index:151;-webkit-transition:background-color .3s;-moz-transition:background-color .3s;transition:background-color .3s}#alert_cover .alert_cell{display:table-cell;vertical-align:middle}#alertM{display:inline-block;background:rgba(0,0,0,.3);border-radius:1%;transition-property:opacity,transform;-webkit-transition-property:opacity,-webkit-transform;-moz-transition-property:opacity,-moz-transform;-ms-transition-property:opacity,-ms-transform;-o-transition-property:opacity,-o-transform;transition-duration:.3s;-webkit-transition-duration:.3s;-moz-transition-duration:.3s;-o-transition-duration:.3s;-ms-transition-duration:.3s;-webkit-animation:show_in .3s;-ms-animation:show_in .3s;-moz-animation:show_in .3s;-o-animation:show_in .3s;animation:show_in .3s;padding:8px;text-align:left}.alertM_out{background-color:transparent!important}.alertM_out #alertM{-webkit-transform:scale(2)!important;-moz-transform:scale(2)!important;-o-transform:scale(2)!important;-ms-transform:scale(2)!important;transform:scale(2)!important;opacity:0!important}#alertM .alertM_bg{background:#fff}#alertM .succ .alertM_tip{background:url(\"../../../../../www.xuetangx.com/static/images/alert/ok.png\"/*tpa=http://www.xuetangx.com/static/images/alert/ok.png*/) no-repeat 20px center}#alertM .succ .alertM_tip p{color:#333;font-size:16px;padding:0 50px 0 70px;text-align:center}#alertM .err .alertM_tip{background:url(\"../../../../../www.xuetangx.com/static/images/alert/fail.png\"/*tpa=http://www.xuetangx.com/static/images/alert/fail.png*/) no-repeat 20px center}#alertM .err .alertM_tip p{color:#333;font-size:16px;padding:0 50px 0 70px;text-align:center}#alertM .h6{position:relative;min-height:50px}#alertM .h6 .alert_close{position:absolute;right:8px;top:8px;display:block;width:30px;height:30px;background:url(\"../../../../../www.xuetangx.com/static/images/alert/close.png\"/*tpa=http://www.xuetangx.com/static/images/alert/close.png*/) no-repeat;cursor:pointer;transition:all .5s;-webkit-transition:all .5s;-o-transition:all .5s;-ms-transition:all .5s;-moz-transition:all .5s}#alertM .h6 .alert_close:hover{-webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-o-transform:rotate(360deg);-ms-transform:rotate(360deg);transform:rotate(360deg)}#alertM .succ .h6{margin:0;background:#4db59c}#alertM .err .h6{margin:0;background:#ff802b}#alertM .alertM_main{padding:0 40px}#alertM .alertM_bottom{padding:30px 0;text-align:center}#alertM .alertM_bottom button{display:inline-block;border:none;cursor:pointer;color:#fff;font-size:16px;padding:5px 10px;transition:all .3s;-webkit-transition:all .3s;-moz-transition:all .3s;-ms-transition:all .3s;-o-transition:all .3s}#alertM .succ .alertM_bottom button{background:#4db59c}#alertM .err .alertM_bottom button{background:#ff802b}#alertM .succ .alertM_bottom button:hover{background:#236051}#alertM .err .alertM_bottom button:hover{background:#b24b06}@-webkit-keyframes show_in{0%{-webkit-transform:scale(2);opacity:0}100%{-webkit-transform:scale(1);opacity:1}}@-moz-keyframes show_in{0%{-moz-transform:scale(2);opacity:0}100%{-moz-transform:scale(1);opacity:1}}@keyframes show_in{0%{-webkit-transform:scale(2);-moz-transform:scale(2);-ms-transform:scale(2);-o-transform:scale(2);transform:scale(2);opacity:0}100%{-webkit-transform:scale(1);-moz-transform:scale(1);-ms-transform:scale(1);-o-transform:scale(1);transform:scale(1);opacity:1}}@-webkit-keyframes fade{0%{background-color:transparent}100%{background-color:rgba(0,0,0,.5)}}@-moz-keyframes fade{0%{background-color:transparent}100%{background-color:rgba(0,0,0,.5)}}@keyframes fade{0%{background-color:transparent}100%{background-color:rgba(0,0,0,.5)}}#side_share{position:fixed;bottom:50px;right:50px;transition:transform .3s;-o-transition:-o-transform .3s;-moz-transition:-moz-transform .3s;-ms-transition:transform .3s;-webkit-transition:-webkit-transform .3s;-webkit-transform:scale(0);transform:scale(0);-moz-transform:scale(0);-ms-transform:scale(0);-o-transform:scale(0);z-index:50}.side_share_li{width:65px;height:65px;position:relative;background:url(\"../../../../../www.xuetangx.com/static/js/plugin/custom/sideMenu/share.png\"/*tpa=http://www.xuetangx.com/static/js/plugin/custom/sideMenu/share.png*/) no-repeat;margin-top:20px}.side_share_li a{display:block;width:100%;height:100%;position:absolute;left:0;top:0}.side_share_join{background-position:0 0}.side_share_com{background-position:0 -86px}.side_share_share{background-position:0 -170px}.side_share_share>a{z-index:53}.side_share_share>ol{z-index:52}.side_share_mailTo{background-position:0 -339px}.side_share_mailTo:hover{background-position:-70px -339px}.side_share_goTo{background-position:0 -254px}.side_share_join:hover{background-position:-70px 0}.side_share_com:hover{background-position:-70px -86px}.side_share_share:hover,.side_share_share_on{background-position:-70px -170px}.side_share_goTo:hover{background-position:-70px -254px}.side_share_weibo,.side_share_weibo li{position:absolute;left:0;top:0;width:100%;height:100%}.side_share_weibo li{background:url(\"../../../../../www.xuetangx.com/static/js/plugin/custom/sideMenu/share.png\"/*tpa=http://www.xuetangx.com/static/js/plugin/custom/sideMenu/share.png*/) no-repeat;opacity:0;transition:transform .5s,opacity .5s;-moz-transition:-moz-transform .5s,opacity .5s;-webkit-transition:-webkit-transform .5s,opacity .5s;-ms-transition:-ms-transform .5s,opacity .5s;-o-transition:-o-transform .5s,opacity .5s}.side_share_weibo .side_share_sina{background-position:-157px 0}.side_share_weibo .side_share_douban{background-position:-157px -85px}.side_share_weibo .side_share_weixin{background-position:-157px -169px}.side_share_weibo .side_share_renren{background-position:-157px -253px}.side_share_weibo .side_share_qq{background-position:-157px -337px}');
