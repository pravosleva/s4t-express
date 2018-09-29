$(function(){
	//console.log($('#loginForm').ajaxForm);

	let _me = function(target){
			let $this = target,
				theme = $this.jqmData('theme') || $.mobile.loader.prototype.options.theme,
				msgText = $this.jqmData('msgtext') || $.mobile.loader.prototype.options.text,
				textVisible = $this.jqmData('textvisible') || $.mobile.loader.prototype.options.textVisible,
				textonly = !!$this.jqmData('textonly'),
				html = $this.jqmData('html')|| '';
			return {$this, theme, msgText, textVisible, textonly, html};
		},
		_validate = function(){
			return false;
		},
		_setDisabled = function(target){ target.attr("disabled", "disabled"); },
		_setEnabled = function(target){ target.attr("disabled", false); };

	//	Login Form
	$('#loginForm').ajaxForm({
		beforeSubmit: (a)=>{
			/* Remember this! a = array of the inputs as objects:
					a.name	(string)
					a.required (bool)
					a.type (string)
					a.value (string)
			*/

			let _toBeOrNotToBe = ()=>{
				console.info('Validation should be required...');
				_setDisabled( $('#loginForm').find('form').find('.ui-grid-a > .ui-block-b > button[type=submit]') );

				let _target = _me($('#loginForm').find('form'));
				switch(_validate()){
					case true:
						// Then Loading...
						$.mobile.loading('show', {
							text: _target.msgText,
							textVisible: _target.textVisible,
							theme: _target.theme,
							textonly: _target.textonly,
							html: _target.html
						});
						return true;
					default:
						//$(this).clearForm();
						$('#loginForm').clearForm();
						$.mobile.loading('show', {
							text: _target.msgText,
							textVisible: _target.textVisible,
							theme: _target.theme,
							textonly: _target.textonly,
							html: '<h1>Sorry</h1><center><i>This option is Under construction yet...</i></center>'
						});
						window.setTimeout(function(){
							$.mobile.loading('hide');
							_setEnabled( $('#loginForm').find('form').find('.ui-grid-a > .ui-block-b > button[type=submit]') );
						}, 5000);
						console.warn('Under construction...');
						return false;
				}
			};
			return _toBeOrNotToBe(); // Then will start or stop your submission.
		},
		dataType: "json",
		success: function(data){
			console.log(data.resp);
			window.setTimeout(function(){
				$.mobile.loading('hide');
				_setEnabled( $('#loginForm').find('form').find('.ui-grid-a > .ui-block-b > button[type=submit]') );
			}, 2000);
		},
		error: (err)=>{// err.statusText, err.responseText...
			console.error(`FckUp! ${err.statusText}`);
			$(this).clearForm();
			window.setTimeout(function(){
				$.mobile.loading('hide');
				_setEnabled( $('#loginForm').find('form').find('.ui-grid-a > .ui-block-b > button[type=submit]') );
			}, 2000);
		}
	});

});
