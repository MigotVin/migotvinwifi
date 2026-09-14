// MigotVin Hotspot frontend JavaScript
// Backend/router URLs containing "duffy" are intentionally preserved because changing them would break API/login connectivity.

function dbg(msg) {}

var _tvRouterId = "10";
var _tvAppUrl = "https:\/\/duffy.ispledger.com";
var _tvPlans = [{"id":55,"label":"1 Hr Unlimited Plan - 10 (1 Hrs)"},{"id":56,"label":"3 Hrs Unlimited Plan - 20 (20 Hrs)"},{"id":57,"label":"5 Hrs Unlimited Plan - 25 (5 Hrs)"},{"id":58,"label":"12 Hrs Unlimited Plan - 30 (12 Hrs)"},{"id":59,"label":"24 Hrs Unlimited Plan - 40 (24 Hrs)"},{"id":60,"label":"3 Days Unlimited Plan - 99 (3 Days)"}];
var _tvAccent = "#indigo";
var _tvClientMac = "D0:C6:37:7F:76:EB";
function _tvNormPhone(p){p=(p||'').replace(/\D+/g,'');if(p==='')return '';if(p.charAt(0)==='0'&&p.length>=2)return '254'+p.substring(1);if(/^[71]/.test(p)&&p.length<=10)return '254'+p;return p}
function _tvLoginUser(phone){var ph=_tvNormPhone(phone);var hex=(_tvClientMac||'').replace(/[^0-9A-Fa-f]/g,'').toUpperCase();if(ph===''||hex==='')return '';while(hex.length<3)hex='0'+hex;var l3=hex.slice(-3);return ph+'-'+l3.charAt(0)+':'+l3.slice(1)}
function _tvLoginHelpBox(phone){var user=_tvLoginUser(phone);if(!user)return '';return '<div style="margin-top:14px;padding:12px 14px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;text-align:left;font-size:0.82rem;color:#1e3a8a;line-height:1.5;"><p style="margin:0 0 6px;font-weight:700;">Save this for next time</p><p style="margin:0 0 8px;">Sometimes a device is on the WiFi but this page does not open. When that happens you cannot bind from here, so please screenshot this and keep it. You can then log in to your account and bind or pay from there.</p><div style="background:#ffffff;border:1px solid #bfdbfe;border-radius:6px;padding:8px 10px;color:#1e3a8a;">Website: <b>'+_tvAppUrl+'</b><br/>Username: <b>'+user+'</b><br/>Password: <b>1234</b></div><p style="margin:8px 0 0;">Then open <b>Bind TV / Device</b> inside your account.</p></div>'}
function _tvGetCookie(n){var v=document.cookie.match('(^|;)\\s*'+n+'\\s*=\\s*([^;]+)');return v?decodeURIComponent(v.pop()):''}
function _tvSetCookie(n,v,d){var e=new Date();e.setTime(e.getTime()+(d*864e5));document.cookie=n+'='+encodeURIComponent(v)+';expires='+e.toUTCString()+';path=/'}
function _tvGet(k){try{return localStorage.getItem(k)||''}catch(e){return _tvGetCookie(k)}}
function _tvSet(k,v){try{localStorage.setItem(k,v)}catch(e){}_tvSetCookie(k,v,90)}
function _tvGetMacs(){var list=[];try{var raw=_tvGet('tvBindMacs');if(raw)list=JSON.parse(raw)}catch(e){list=[]}if(!(list instanceof Array))list=[];var legacy=_tvGet('tvBindMac');if(legacy&&list.indexOf(legacy)===-1)list.unshift(legacy);return list}
function _tvAddMac(mac,name){if(!mac)return;var list=_tvGetMacs();var i=list.indexOf(mac);if(i!==-1)list.splice(i,1);list.unshift(mac);if(list.length>6)list=list.slice(0,6);_tvSet('tvBindMacs',JSON.stringify(list));_tvSet('tvBindMac',mac);if(name)_tvSetName(mac,name)}
function _tvGetNames(){var map={};try{var raw=_tvGet('tvBindNames');if(raw)map=JSON.parse(raw)}catch(e){map={}}if(!map||typeof map!=='object')map={};return map}
function _tvGetName(mac){var m=_tvGetNames();return(m&&m[mac])?m[mac]:''}
function _tvSetName(mac,name){if(!mac)return;var m=_tvGetNames();name=(name||'').toString().trim();if(name){m[mac]=name}else{delete m[mac]}_tvSet('tvBindNames',JSON.stringify(m))}
function _tvRemoveMac(mac){var list=_tvGetMacs();var i=list.indexOf(mac);if(i!==-1)list.splice(i,1);_tvSet('tvBindMacs',JSON.stringify(list));var m=_tvGetNames();if(m[mac]){delete m[mac];_tvSet('tvBindNames',JSON.stringify(m))}if(_tvGet('tvBindMac')===mac){_tvSet('tvBindMac',list[0]||'')}}
function _tvEscapeHtml(s){return(s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function openTvBinding(){var saved=_tvGetMacs();if(saved.length>0){_tvDeviceChooser(saved)}else{_tvBindForm('')}}
function _tvDeviceChooser(saved){var rows='';for(var i=0;i<saved.length;i++){var mac=saved[i];var nm=_tvGetName(mac);var label=nm?_tvEscapeHtml(nm):mac;var sub=nm?('<span style="display:block;font-size:0.72rem;color:#9ca3af;font-family:monospace;">'+mac+'</span>'):'';rows+='<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;"><button type="button" class="tvDevBtn" data-mac="'+mac+'" style="display:flex;align-items:center;gap:10px;flex:1;text-align:left;padding:12px 14px;border:1px solid #d1d5db;border-radius:10px;background:#ffffff;cursor:pointer;font-size:0.9rem;color:#111827;"><svg width="18" height="18" fill="none" stroke="'+_tvAccent+'" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg><span style="overflow:hidden;"><span style="font-weight:600;">'+label+'</span>'+sub+'</span></button><button type="button" class="tvRenameBtn" data-mac="'+mac+'" title="Rename" style="flex:none;width:40px;height:44px;border:1px solid #d1d5db;border-radius:10px;background:#f9fafb;cursor:pointer;color:#4b5563;"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align:middle;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button><button type="button" class="tvDelBtn" data-mac="'+mac+'" title="Delete" style="flex:none;width:40px;height:44px;border:1px solid #fecaca;border-radius:10px;background:#fef2f2;cursor:pointer;color:#dc2626;"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align:middle;"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button></div>'}
  Swal.fire({title:'Choose Your Device',html:'<p style="font-size:0.85rem;color:#6b7280;margin-bottom:14px;">Pick the device you want to connect, then choose a package and pay. Use the pencil to rename a device or the bin to remove it.</p><div style="text-align:left;">'+rows+'</div><button type="button" id="tvAddNewBtn" style="width:100%;padding:12px 14px;margin-top:4px;border:1px dashed #9ca3af;border-radius:10px;background:#f9fafb;cursor:pointer;font-size:0.9rem;color:#374151;font-weight:600;">+ Add a new device</button>',showConfirmButton:false,showCancelButton:true,cancelButtonText:'Cancel',didOpen:function(){document.querySelectorAll('.tvDevBtn').forEach(function(b){b.onclick=function(){var m=this.getAttribute('data-mac');Swal.close();_tvBindForm(m)}});document.querySelectorAll('.tvRenameBtn').forEach(function(b){b.onclick=function(){_tvRenameDevice(this.getAttribute('data-mac'))}});document.querySelectorAll('.tvDelBtn').forEach(function(b){b.onclick=function(){_tvDeleteDevice(this.getAttribute('data-mac'))}});var add=document.getElementById('tvAddNewBtn');if(add)add.onclick=function(){Swal.close();_tvBindForm('')}}})}
function _tvRenameDevice(mac){Swal.fire({title:'Name this device',input:'text',inputValue:_tvGetName(mac),inputPlaceholder:'e.g. Living Room TV',showCancelButton:true,confirmButtonText:'Save',cancelButtonText:'Cancel',confirmButtonColor:'#16a34a'}).then(function(res){if(res.isConfirmed){_tvSetName(mac,res.value||'')}_tvDeviceChooser(_tvGetMacs())})}
function _tvDeleteDevice(mac){var nm=_tvGetName(mac)||mac;Swal.fire({title:'Remove this device?',html:'<p>\"'+_tvEscapeHtml(nm)+'\" will be removed from this list. You can add it again any time.</p>',icon:'warning',showCancelButton:true,confirmButtonText:'Remove',cancelButtonText:'Keep',confirmButtonColor:'#dc2626'}).then(function(res){if(res.isConfirmed){_tvRemoveMac(mac)}var left=_tvGetMacs();if(left.length>0){_tvDeviceChooser(left)}else{_tvBindForm('')}})}
function _tvBindForm(prefillMac){
  var savedMac=prefillMac||_tvGet('tvBindMac'),savedPhone=_tvGet('tvBindPhone');
  var opts='<option value>-- Choose a package --</option>';
  for(var i=0;i<_tvPlans.length;i++) opts+='<option value='+_tvPlans[i].id+'>'+_tvPlans[i].label+'</option>';
  Swal.fire({
    title:'Connect Your TV / Device',
    html:'<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px 12px;margin-bottom:14px;text-align:left;font-size:0.8rem;color:#1e40af;line-height:1.5;"><b>Tip:</b> If your TV can open this page, you don\'t need to enter a MAC address. Just click on a package above and buy normally. Only use this form if your TV cannot show the sign-in page.</div>'+
      '<p style="font-size:0.85rem;color:#6b7280;margin-bottom:12px;">Enter the MAC address from your TV settings, choose a package, and pay.</p>'+
      '<details style="margin-bottom:14px;text-align:left;background:#f9fafb;border-radius:8px;padding:10px 12px;"><summary style="cursor:pointer;font-size:0.8rem;font-weight:600;color:#4b5563;">How do I find my TV MAC address?</summary>'+
      '<div style="font-size:0.78rem;color:#6b7280;margin-top:8px;line-height:1.5;">'+
      '<p style="margin:0 0 6px;font-weight:600;">On your TV, go to:</p>'+
      '<ul style="margin:0 0 8px;padding-left:16px;">'+
      '<li><b>Vitron:</b> Settings &gt; Network &gt; Network Status / About</li>'+
      '<li><b>Samsung:</b> Settings &gt; General &gt; Network &gt; Network Status</li>'+
      '<li><b>LG:</b> Settings &gt; Network &gt; Wi-Fi &gt; Advanced Settings</li>'+
      '<li><b>Sony/Android TV:</b> Settings &gt; About &gt; Status</li>'+
      '<li><b>Hisense:</b> Settings &gt; Network &gt; Network Information</li>'+
      '<li><b>TCL/Roku:</b> Settings &gt; Network &gt; About</li>'+
      '</ul>'+
      '<p style="margin:0;color:#9ca3af;">Look for <b>MAC Address</b> or <b>Wi-Fi Address</b> (format: AA:BB:CC:DD:EE:FF)</p>'+
      '</div></details>'+
      '<div style="text-align:left;">'+
      '<label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:4px;">Device MAC Address</label>'+
      '<div style="margin-bottom:12px;"><input type="text" id="swalTvMac" value="'+savedMac+'" placeholder="e.g. AA:BB:CC:DD:EE:FF" style="width:100%;padding:10px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;"/></div>'+
      '<label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:4px;">Device Name <span style="font-weight:400;color:#9ca3af;">(optional)</span></label>'+
      '<div style="margin-bottom:12px;"><input type="text" id="swalTvName" value="'+_tvEscapeHtml(_tvGetName(savedMac))+'" placeholder="e.g. Living Room TV" style="width:100%;padding:10px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;"/></div>'+
      '<label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:4px;">Select Package</label>'+
      '<select id="swalTvPlan" style="width:100%;padding:10px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;margin-bottom:12px;">'+opts+'</select>'+
      '<div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:8px 10px;margin:0 0 12px;font-size:0.78rem;color:#9a3412;line-height:1.45;"><b>One device per package.</b> This package works on this one device only. Please do not buy one package for several devices.</div>'+
      '<label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:4px;">Phone Number (M-Pesa)</label>'+
      '<input type="text" id="swalTvPhone" value="'+savedPhone+'" placeholder="e.g. 0712345678" style="width:100%;padding:10px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;"/>'+
      '</div>',
    showCancelButton:true,confirmButtonText:'Bind & Pay',cancelButtonText:'Cancel',confirmButtonColor:_tvAccent,focusConfirm:false,
    preConfirm:function(){
      var mac=(document.getElementById('swalTvMac').value||'').trim();
      var name=(document.getElementById('swalTvName').value||'').trim();
      var planId=document.getElementById('swalTvPlan').value;
      var phone=(document.getElementById('swalTvPhone').value||'').trim();
      if(!mac||mac.replace(/[^0-9A-Fa-f]/g,'').length<6){Swal.showValidationMessage('Please enter a valid MAC address.');return false}
      if(!planId){Swal.showValidationMessage('Please select a package.');return false}
      if(!phone||phone.replace(/\\D/g,'').length<9){Swal.showValidationMessage('Please enter a valid phone number.');return false}
      _tvAddMac(mac,name);_tvSet('tvBindPhone',phone);
      return{mac:mac,planId:planId,phone:phone};
    }
  }).then(function(result){
    if(!result.isConfirmed||!result.value)return;
    var v=result.value;
    Swal.fire({title:'Sending payment request...',allowOutsideClick:false,didOpen:function(){Swal.showLoading()}});
    fetch(_tvAppUrl+'/index.php?_route=plugin/initiate_tv_binding',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({mac_address:v.mac,plan_id:v.planId,router_id:_tvRouterId,phone:v.phone})
    }).then(function(r){return r.json()}).then(function(data){
      if(data.status==='success'){
        Swal.fire({icon:'info',title:'Payment Request Sent!',html:'<p>Please enter your M-Pesa PIN to complete the payment.</p>',allowOutsideClick:false,showConfirmButton:false,timer:5000,timerProgressBar:true
        }).then(function(){_tvConfirmLoop(data.username||v.mac,v.phone)});
      }else{Swal.fire({icon:'error',title:'Error',text:data.message||'Something went wrong.'})}
    }).catch(function(){Swal.fire({icon:'error',title:'Network Error',text:'Could not reach the server.'})});
  });
}
function _tvConfirmLoop(username,payPhone){
  var maxTime=Date.now()+90000,done=false,chk,cdn;
  Swal.fire({title:'Confirming Payment',html:'<p>Waiting for M-Pesa confirmation...</p><p style="margin-top:8px;font-size:0.85rem;color:#6b7280;" id="tvPayStatus">Checking...</p><p style="margin-top:12px;font-size:1.5rem;font-weight:700;" id="tvCountdown">90s</p><div style="margin-top:14px;border-top:1px solid #e5e7eb;padding-top:12px;"><button type="button" id="tvCancelBtn" style="background:none;color:#6b7280;border:1px solid #d1d5db;padding:6px 16px;border-radius:6px;cursor:pointer;font-size:0.85rem;">Cancel &amp; Start Over</button></div>',
    allowOutsideClick:false,showConfirmButton:false,
    didOpen:function(){Swal.showLoading();var cb=document.getElementById('tvCancelBtn');if(cb)cb.onclick=function(){done=true;clearInterval(chk);clearInterval(cdn);Swal.fire({icon:'info',title:'Cancelled',text:'You can try again when ready.',confirmButtonColor:'#0d9488'})}}
  });
  chk=setInterval(function(){
    if(done||Date.now()>maxTime){clearInterval(chk);clearInterval(cdn);if(!done)Swal.fire({icon:'warning',title:'Timeout',html:'<p>Could not confirm payment in time.</p><p style="margin-top:8px;font-size:0.875rem;color:#4b5563;">If you already paid, your device will be activated shortly. Try disconnecting and reconnecting WiFi on your TV.</p>',confirmButtonText:'OK',confirmButtonColor:'#0d9488'});return}
    fetch(_tvAppUrl+'/index.php?_route=plugin/CreateHotspotuser&type=verify',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'phone_number='+encodeURIComponent(username)})
    .then(function(r){return r.json()}).then(function(d){
      var el=document.getElementById('tvPayStatus');
      if(d.Resultcode==='3'){done=true;clearInterval(chk);clearInterval(cdn);Swal.fire({icon:'success',title:'Device Bound!',html:'<p>Your TV/device has been activated.</p><div style="margin-top:14px;padding:12px 16px;background:#f0fdf4;border-radius:8px;text-align:left;"><p style="font-weight:600;color:#166534;margin:0 0 6px;">If your device still has no internet:</p><ol style="margin:0;padding-left:18px;color:#15803d;font-size:0.9rem;"><li>Go to WiFi settings on your TV</li><li>Disconnect (forget) the WiFi</li><li>Reconnect to the same WiFi</li></ol></div>'+_tvLoginHelpBox(payPhone),confirmButtonText:'Done',confirmButtonColor:'#16a34a',allowOutsideClick:false})}
      else if(d.Resultcode==='2'){done=true;clearInterval(chk);clearInterval(cdn);Swal.fire({icon:'error',title:'Payment Failed',text:d.Message||'Payment was cancelled or failed.',confirmButtonColor:'#0d9488'})}
      else{if(el)el.innerHTML='<span style="color:#d97706;">Payment: Pending...</span>'}
    }).catch(function(){});
  },5000);
  cdn=setInterval(function(){var s=Math.max(0,Math.ceil((maxTime-Date.now())/1000));var el=document.getElementById('tvCountdown');if(el)el.textContent=s+'s';if(s<=0)clearInterval(cdn)},1000);
}

// Suppose we store the current router ID in localStorage when a user selects a plan
    // or if you only have a single router, we can fallback to a router ID from the database:
    var routerId = (function(){ try { return localStorage.getItem('currentRouterId'); } catch(e){ return null; } })() || '10';

    document.getElementById('mpesaCodeSubmitBtn').addEventListener('click', function(event) {
        event.preventDefault();

        var mpesaMessage = document.getElementById('mpesaCodeInput').value.trim();
        if (mpesaMessage === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter the Mpesa message.'
            });
            return;
        }

        Swal.fire({
            title: 'Processing Mpesa Message',
            text: 'Please wait while we verify your transaction...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // 1) Send AJAX request to mpesacode.php
        fetch('https://duffy.ispledger.com/system/mpesacode.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mpesa_code: mpesaMessage,
                router_id: routerId  // pass the router ID
            }),
        })
        .then(response => response.json())
        .then(data => {
            Swal.close();

            if (data.status === 'success') {
                // The transaction belongs to this router => log in
                var username = data.username;
                Swal.fire({
                    icon: 'success',
                    title: 'Transaction Verified',
                    text: 'Logging you in automatically...',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    // Autofill the login form
                    document.getElementById('usernameInput').value = username;
                    document.getElementById('passwordInput').value = '1234';

                    // Optionally, show a final success before submitting
                    Swal.fire({
                        icon: 'success',
                        title: 'Logged In',
                        text: 'You have been logged in successfully.',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        // Submit the login form
                        document.getElementById('loginForm').submit();
                    });
                });
            }
            else if (data.status === 'roaming') {
                // 2) The router mismatch was detected => call roaming.php
                Swal.fire({
                    title: 'Roaming in Progress',
                    text: 'Setting up your account on this router. Please wait...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                fetch('https://duffy.ispledger.com/system/roaming.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        mpesa_code: mpesaMessage,
                        router_id: routerId
                    })
                })
                .then(resp => resp.json())
                .then(roamingData => {
                    Swal.close();
                    if (roamingData.status === 'success') {
                        // The roaming logic created a subscription on the new router
                        var newUsername = roamingData.username;
                        Swal.fire({
                            icon: 'success',
                            title: 'Roaming Completed',
                            text: 'Your plan is now active on this router. Logging you in...',
                            timer: 2000,
                            showConfirmButton: false
                        }).then(() => {
                            // Autofill the login form
                            document.getElementById('usernameInput').value = newUsername;
                            document.getElementById('passwordInput').value = '1234';

                            // Log them in
                            Swal.fire({
                                icon: 'success',
                                title: 'Logged In',
                                text: 'You have been logged in successfully.',
                                timer: 1500,
                                showConfirmButton: false
                            }).then(() => {
                                document.getElementById('loginForm').submit();
                            });
                        });
                    } else {
                        // Some error in roaming
                        Swal.fire({
                            icon: 'error',
                            title: 'Roaming Error',
                            text: roamingData.message || 'Could not complete roaming.'
                        });
                    }
                })
                .catch(err => {
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        title: 'Roaming Error',
                        text: 'An error occurred while processing roaming.'
                    });
                    console.error('Roaming Error:', err);
                });
            }
            else {
                // Another error from mpesacode.php
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message
                });
            }
        })
        .catch(error => {
            // mpesacode.php fetch error
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while processing your request.'
            });
            console.error('Error:', error);
        });
    });

// Handle activation form button click
    document.getElementById('voucherActivateBtn').addEventListener('click', async (e) => {
        console.log('Voucher activation button clicked by user');
        const form = document.getElementById('voucherActivateForm');
        const formData = new FormData(form);
        // Validate required fields
        if (!formData.get('voucher') || !formData.get('username')) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill in all required fields.',
                confirmButtonColor: '#d33'
            });
            return;
        }
        // Show loading
        Swal.fire({
            title: 'Activating Voucher',
            html: 'Please wait while we activate your voucher...<br><small>This may take a few seconds</small>',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => { Swal.showLoading(); }
        });
        try {
            const response = await fetch('https://duffy.ispledger.com/system/voucher.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            Swal.close();
            if (result.msg && result.msg.type === 'success') {
                await Swal.fire({
                    icon: 'success',
                    title: 'Voucher Activated!',
                    text: result.msg.text,
                    confirmButtonColor: '#4CAF50'
                });
                // Auto-login to MikroTik
                if (result.credentials) {
                    const loginForm = document.createElement('form');
                    loginForm.method = 'POST';
                    loginForm.action = 'http://duffy.com/login';
                    loginForm.style.display = 'none';
                    const usernameInput = document.createElement('input');
                    usernameInput.type = 'text';
                    usernameInput.name = 'username';
                    usernameInput.value = result.credentials.username;
                    loginForm.appendChild(usernameInput);
                    const passwordInput = document.createElement('input');
                    passwordInput.type = 'text';
                    passwordInput.name = 'password';
                    passwordInput.value = result.credentials.password;
                    loginForm.appendChild(passwordInput);
                    document.body.appendChild(loginForm);
                    loginForm.submit();
                }
                if (result.msg.redirect) {
                    setTimeout(() => window.location.href = result.msg.redirect, 2000);
                }
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Activation Failed',
                    text: result.msg ? result.msg.text : 'Activation failed',
                    confirmButtonColor: '#d33'
                });
            }
        } catch (error) {
            Swal.close();
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred. Please try again.',
                confirmButtonColor: '#d33'
            });
        }
    });
    // Handle reconnection form button click (with roaming notification)
    document.getElementById('voucherReconnectBtn').addEventListener('click', async (e) => {
        console.log('Voucher reconnection button clicked by user');
        const form = document.getElementById('voucherReconnectForm');
        const formData = new FormData(form);
        // Validate required field
        if (!formData.get('input')) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill in the required field.',
                confirmButtonColor: '#d33'
            });
            return;
        }
        // Show loading
        Swal.fire({
            title: 'Processing...',
            text: 'Please wait while we verify your voucher...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => { Swal.showLoading(); }
        });
        try {
            const response = await fetch('https://duffy.ispledger.com/system/voucher_reconnection.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            Swal.close();
            if (result.msg && result.msg.type === 'success') {
                // Check if roaming happened
                if (result.roaming) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Roaming Successful! 🌐',
                        html: '<p>Your voucher was activated at: <strong>' + result.from_router + '</strong></p>' +
                              '<p>Now connected to: <strong>' + result.to_router + '</strong></p>',
                        confirmButtonColor: '#4CAF50',
                        confirmButtonText: 'Connect Now'
                    });
                } else {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Reconnected!',
                        text: result.msg.text,
                        confirmButtonColor: '#4CAF50'
                    });
                }
                // Auto-login to MikroTik
                if (result.credentials) {
                    const loginForm = document.createElement('form');
                    loginForm.method = 'POST';
                    loginForm.action = 'http://duffy.com/login';
                    loginForm.style.display = 'none';
                    const usernameInput = document.createElement('input');
                    usernameInput.type = 'text';
                    usernameInput.name = 'username';
                    usernameInput.value = result.credentials.username;
                    loginForm.appendChild(usernameInput);
                    const passwordInput = document.createElement('input');
                    passwordInput.type = 'text';
                    passwordInput.name = 'password';
                    passwordInput.value = result.credentials.password;
                    loginForm.appendChild(passwordInput);
                    document.body.appendChild(loginForm);
                    loginForm.submit();
                }
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Reconnection Failed',
                    text: result.msg ? result.msg.text : 'Reconnection failed',
                    confirmButtonColor: '#d33'
                });
            }
        } catch (error) {
            Swal.close();
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred. Please try again.',
                confirmButtonColor: '#d33'
            });
        }
    });

(function(){
  const btn = document.getElementById('forceReconnectBtn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    // 1) Gather inputs
    const macEl = document.querySelector('input[name="mac"]');
    const macAddress = macEl ? (macEl.value || '').trim() : '';
    const routerIdInput = document.querySelector('input[name="router_id"]');
    const routerId = (routerIdInput && routerIdInput.value) || (typeof window.routerId !== 'undefined' ? window.routerId : (localStorage.getItem('currentRouterId') || "10"));

    if (!macAddress) {
      Swal.fire({ icon: 'error', title: 'MAC Missing', text: 'We could not detect your device MAC address. Please reload the page while connected to WiFi.' });
      return;
    }

    Swal.fire({
      title: 'Running Troubleshooting...',
      text: 'Please wait while we check your account status...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      // 2) Send to backend
      const response = await fetch("https:\/\/duffy.ispledger.com\/system\/force_reconnection.php", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mac_address: macAddress,
          router_id: routerId,
          clean_ghosts: true,
          fetch_logs: false,
          force_deep: false
        })
      });
      const data = await response.json();
      Swal.close();

      if (!data.ok) {
        var errHtml = '<p><b>Error:</b> ' + (data.message || data.error || 'Unknown issue') + '</p>';
        Swal.fire({ icon: 'error', title: 'Troubleshoot Failed', html: errHtml });

        return;
      }

      // 3) Build diagnostic summary (no JS template literals to keep PHP happy)
      const diag = data.diagnosis || {};
      const sub  = data.subscription || {};
      const mk   = data.mikrotik || {};
      const cust = data.customer || {};

      var summary = '' +
        '<b>MAC:</b> ' + ((data.anchor && data.anchor.mac_full) ? data.anchor.mac_full : 'N/A') + '<br>' +
        '<b>Username:</b> ' + ((cust && cust.username) ? cust.username : 'N/A') + '<br>' +
        '<b>Router:</b> ' + (mk.router_ip || 'N/A') + '<br>' +
        '<b>Plan:</b> ' + (sub.plan || 'N/A') + '<br>' +
        '<b>Expiration:</b> ' + (sub.expiration || 'N/A') + '<br>' +
        '<b>Status:</b> ' + (diag.summary || 'N/A') + '<br><hr>';

      if (Array.isArray(mk.active_sessions) && mk.active_sessions.length) {
        summary += '<b>Active Sessions:</b><br><ul>';
        mk.active_sessions.forEach(function(s){
          summary += '<li>' + (s.address || '(no ip)') + ' — ' + (s.mac_address || '(no mac)') + ' — ' + (s.uptime || '') + '</li>';
        });
        summary += '</ul>';
      }

      Swal.fire({
        icon: diag.can_login_now ? 'success' : 'warning',
        title: diag.can_login_now ? 'All Good ✅' : 'Attention Needed ⚠️',
        html: summary,
        showCancelButton: !!diag.can_login_now,
        confirmButtonText: diag.can_login_now ? 'Login Now' : 'Close',
        cancelButtonText: 'Close',
        confirmButtonColor: '#16a34a'
      }).then(function(res){
        if (res.isConfirmed && diag.can_login_now && cust && cust.username) {
          var u = document.getElementById('usernameInput');
          var p = document.getElementById('passwordInput');
          var f = document.getElementById('loginForm');
          if (u && p && f) {
            u.value = cust.username;
            p.value = '1234';
            f.submit();
          }
        }
      });

    } catch (err) {
      Swal.close();
      Swal.fire({ icon: 'error', title: 'Network Error', text: 'Could not contact the server. Check your connection.' });
      console.error('ForceReconnect error:', err);
    }
  });
})();

document.addEventListener('DOMContentLoaded', function() {
    var phoneNumber = '2547xxxxxxx';
    var password = '1234';
    document.querySelector('input[name="username"]').value = phoneNumber;
    document.querySelector('input[name="password"]').value = password;
});

function toggleFAQ(faqId) {
    var element = document.getElementById(faqId);
    if (element.style.display === "block") {
        element.style.display = "none";
    } else {
        element.style.display = "block";
    }
}

document.addEventListener('DOMContentLoaded', function() {
        var macAddressInput = document.querySelector('input[name="mac"]');
        var macAddressDisplay = document.getElementById('macAddressDisplay');
        
        if (macAddressInput && macAddressDisplay) {
            var macAddress = macAddressInput.value;
            macAddressDisplay.textContent = macAddress;
        }
    });

// fetch polyfill for old devices using jQuery
    if (typeof window.fetch === 'undefined') {
      window.fetch = function(url, opts) {
        opts = opts || {};
        return new Promise(function(resolve, reject) {
          var ajaxOpts = { url: url, method: opts.method || 'GET', dataType: 'text' };
          if (opts.body) { ajaxOpts.data = opts.body; ajaxOpts.processData = false; }
          if (opts.headers) { ajaxOpts.headers = opts.headers; }
          if (opts.headers && opts.headers['Content-Type']) { ajaxOpts.contentType = opts.headers['Content-Type']; }
          $.ajax(ajaxOpts).done(function(data, status, xhr) {
            resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status,
              json: function() { return Promise.resolve(JSON.parse(data)); },
              text: function() { return Promise.resolve(data); } });
          }).fail(function(xhr) { reject(new Error('Network error: ' + xhr.status)); });
        });
      };
    }
    // Promise polyfill check - if no Promise, fetch polyfill won't work either
    // SweetAlert2 bundles its own Promise polyfill so it should be available
    dbg('jQuery: ' + (typeof jQuery !== 'undefined' ? jQuery.fn.jquery : 'NOT LOADED'));
    dbg('Swal: ' + (typeof Swal !== 'undefined' ? 'YES' : 'NO'));
    dbg('Swal.fire: ' + (typeof Swal !== 'undefined' && typeof Swal.fire === 'function' ? 'YES' : 'NO'));
    dbg('fetch after polyfill: ' + (typeof window.fetch !== 'undefined' ? 'YES' : 'STILL NO'));

    function formatPhoneNumber(phoneNumber) {
        phoneNumber = phoneNumber.replace(/[^0-9+]/g, '');
        if (phoneNumber.charAt(0) === '+') {
            phoneNumber = phoneNumber.substring(1);
        }
        if (phoneNumber.charAt(0) === '0') {
            phoneNumber = '254' + phoneNumber.substring(1);
        }
        if (phoneNumber.match(/^(7|1)/)) {
            phoneNumber = '254' + phoneNumber;
        }
        return phoneNumber;
    }

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

function handlePhoneNumberSubmission(planId, routerId) {
  dbg('handlePhoneNumberSubmission called. planId=' + planId + ' routerId=' + routerId);
  try {
  var BASE  = "https:\/\/duffy.ispledger.com";
  var PROXY = "https://proxybackup.ispledger.com/callback.php";
  var PATH  = "/index.php?_route=plugin/CreateHotspotuser&type=grant";
  dbg('About to call Swal.fire. Swal exists: ' + (typeof Swal !== 'undefined') + ', Swal.fire exists: ' + (typeof Swal !== 'undefined' && typeof Swal.fire === 'function'));

  Swal.fire({
    title: 'Enter Your Phone Number',
    input: 'text',
    inputValue: (function(){ try { return localStorage.getItem('phoneNumber'); } catch(e){ return null; } })() || getCookie('phoneNumber') || '',
    inputPlaceholder: 'Your phone number here',
    showCancelButton: true,
    confirmButtonText: 'Submit',
    showLoaderOnConfirm: true,
    preConfirm: function(phoneNumber) {
      // --- normalize ---
      var formattedPhoneNumber = (formatPhoneNumber(phoneNumber || '') || '').trim();
      if (!formattedPhoneNumber) { Swal.showValidationMessage('Please enter a valid phone number.'); return false; }

      // --- MAC + suffix (X:YY) ---
      var macEl = document.querySelector('input[name="mac"]');
      var macHidden  = (macEl && macEl.value ? macEl.value : '').trim();
      var macFromUrl = '';
      try { macFromUrl = new URLSearchParams(location.search).get('mac') || ''; } catch(e) { macFromUrl = ''; }
      var macRaw     = macHidden || macFromUrl;

      var hex = (macRaw || '').replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
      if (!hex) {
        var shortEl = document.querySelector('input[name="mac_suffix"], input[name="mac_last"]');
        var shortVal = (shortEl && shortEl.value ? shortEl.value : '').replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
        hex = shortVal;
      }
      if (!hex) { Swal.showValidationMessage('Could not detect any MAC value. Ensure the page provides a MAC.'); return false; }
      while (hex.length < 3) { hex = '0' + hex; }
      var last3 = hex.slice(-3);
      var macSuffix = last3.charAt(0) + ':' + last3.slice(1);

      // --- username preview on form (helps auto-login) ---
      var username = formattedPhoneNumber + '-' + macSuffix;
      var uEl = document.getElementById('usernameInput');
      if (uEl) uEl.value = username;

      // --- persist for your flow ---
      try {
        localStorage.setItem('phoneNumber', formattedPhoneNumber);
        localStorage.setItem('lastFourChars', macSuffix);
      } catch(e) {
        setCookie('phoneNumber', formattedPhoneNumber, 1);
        setCookie('lastFourChars', macSuffix, 1);
      }

      // --- payload ---
      var trace = Math.random().toString(16).slice(2,10);
      var PAYLOAD = {
        phone_number: formattedPhoneNumber,
        plan_id:      planId,
        router_id:    routerId,
        mac_address:  macRaw,
        mac_suffix:   macSuffix,
        _proxy_trace: trace
      };

      // helper: mark “submitted” and start your confirm loop
      function armAndStart(){
        var expirationTime = Date.now() + (90 * 1000);
        try {
          localStorage.setItem('paymentSubmittedExpiration', String(expirationTime));
          localStorage.setItem('paymentSubmitted', 'true');
        } catch(e) {
          setCookie('paymentSubmittedExpiration', String(expirationTime), 1);
          setCookie('paymentSubmitted', 'true', 1);
        }
        startConfirmingPayment(true);
      }

      // ---- 1) PRIMARY attempt (with 15s timeout) ----
      var controller = new AbortController();
      var timeoutId = setTimeout(function(){ controller.abort(); }, 15000);
      return fetch(BASE + PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(PAYLOAD),
        signal: controller.signal
      })
      .then(function(res) {
        clearTimeout(timeoutId);
        var resOk = res.ok;
        var resStatus = res.status;
        return res.json().catch(function() { return null; }).then(function(data) {
          if (resOk) {
            if (data && data.status === 'error') {
              throw new Error(data.message || 'Request invalid');
            }
            armAndStart();
            return formattedPhoneNumber;
          }
          throw new Error('primary_http_' + resStatus);
        });
      })
      .catch(function(primaryErr) {
        console.warn('[failover] primary failed:', primaryErr && primaryErr.message);

        // ---- 2) PROXY attempt (fire-and-forget), then immediately start confirming ----
        var tenantHint = (function(){
          try { return new URL(BASE).hostname.split('.')[0] || 'francistest'; } catch(e){ return 'francistest'; }
        })();

        var envelope = {
          primary_base: BASE,
          tenant_hint:  tenantHint,
          path:         PATH,
          method:       'POST',
          payload:      PAYLOAD,
          force_ipv4:   true,
          _via:         'frontend_failover'
        };

        // Fire and forget - try proxy
        fetch(PROXY, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
          body: JSON.stringify(envelope)
        }).catch(function(proxyErr) {
          console.warn('[failover] proxy also failed:', proxyErr && proxyErr.message);

          // ---- 3) ROUTER QUEUE fallback: submit to MikroTik hotspot login ----
          try {
            var queueUser = 'PQ_' + formattedPhoneNumber + '_' + planId + '_' + routerId + '_' + macSuffix.replace(':', '');
            console.log('[failover] queuing via router login:', queueUser);

            var loginUrl = document.querySelector('form[name="login"]');
            var loginAction = loginUrl ? loginUrl.action : 'http://duffy.com/login';

            var formData = 'username=' + encodeURIComponent(queueUser) + '&password=pending_queue&dst=';
            fetch(loginAction, {
              method: 'POST',
              mode: 'no-cors',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: formData
            }).catch(function(routerErr) {
              console.error('[failover] router queue error:', routerErr && routerErr.message);
            });
          } catch(e) {
            console.error('[failover] router queue exception:', e);
          }
        });

        armAndStart();
        return formattedPhoneNumber;
      });
    },
    allowOutsideClick: function() { return !Swal.isLoading(); }
  });
  dbg('Swal.fire called successfully');
  } catch(e) { dbg('ERROR in handlePhoneNumberSubmission: ' + e.message + ' | ' + (e.stack || '')); }
}
    function startConfirmingPayment(showInitialMessage) {
        var expirationTime;
        try {
            expirationTime = parseInt(localStorage.getItem('paymentSubmittedExpiration'));
        } catch (e) {
            expirationTime = parseInt(getCookie('paymentSubmittedExpiration'));
        }
        if (!expirationTime || isNaN(expirationTime)) {
            expirationTime = Date.now() + 90000;
        }

        if (showInitialMessage) {
            Swal.fire({
                icon: 'info',
                title: 'Payment Request Sent!',
                html: '<p>A payment prompt has been sent to your phone.</p>' +
                      '<p style="margin-top:8px;font-weight:600;">Please check your phone and enter your M-Pesa PIN to complete the payment.</p>' +
                      '<p style="margin-top:12px;font-size:0.85rem;color:#6b7280;">Payment confirmation will begin shortly...</p>',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true
            }).then(function() {
                beginConfirmationLoop(expirationTime);
            });
        } else {
            beginConfirmationLoop(expirationTime);
        }
    }

    function handleStopConfirmation(onStop, onResume) {
        Swal.fire({
            icon: 'warning',
            title: 'Stop Confirmation?',
            html: '<p><strong>Warning:</strong> If you have already paid, stopping will prevent you from being connected.</p>' +
                  '<p style="margin-top:10px;">Press <strong>No, Continue</strong> to keep waiting,<br>or <strong>Yes, Cancel</strong> to start over.</p>' +
                  '<p style="margin-top:8px;font-size:0.8rem;color:#9ca3af;">Resuming automatically if no action taken...</p>',
            showCancelButton: true,
            confirmButtonText: 'Yes, Cancel',
            cancelButtonText: 'No, Continue',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#0d9488',
            allowOutsideClick: false,
            reverseButtons: true,
            timer: 10000,
            timerProgressBar: true
        }).then(function(result) {
            if (result.isConfirmed) { onStop(); }
            else if (onResume) { onResume(); }
        });
    }

    function beginConfirmationLoop(expirationTime) {
        var now = Date.now();
        var totalDuration = 90000;
        if (expirationTime - now > totalDuration) {
            expirationTime = now + totalDuration;
            try { localStorage.setItem('paymentSubmittedExpiration', String(expirationTime)); }
            catch(e) { setCookie('paymentSubmittedExpiration', String(expirationTime), 1); }
        }
        var secsLeft = Math.max(0, Math.ceil((expirationTime - now) / 1000));
        var initialPct = Math.max(0, ((expirationTime - now) / totalDuration) * 100);
        var paymentStatus = 'pending';
        var stopped = false;

        Swal.fire({
            title: 'Confirming Payment',
            html: '<p>Please wait while we confirm your payment and log you in...</p>' +
                  '<p style="margin-top:8px;font-size:0.85rem;color:#6b7280;" id="paymentStatus">Payment: Checking...</p>' +
                  '<p style="margin-top:12px;font-size:1.5rem;font-weight:700;" id="paymentCountdown">' + secsLeft + 's remaining</p>' +
                  '<div style="width:100%;background:#e5e7eb;border-radius:9999px;height:12px;margin-top:12px;">' +
                  '<div id="paymentProgressBar" style="background:#14b8a6;height:12px;border-radius:9999px;width:' + initialPct + '%;transition:width 1s linear;"></div>' +
                  '</div>' +
                  '<div id="stopBtnWrap" style="margin-top:14px;display:none;border-top:1px solid #e5e7eb;padding-top:12px;">' +
                  '<p style="font-size:0.8rem;color:#6b7280;margin:0 0 6px;">Entered the wrong PIN or haven\'t paid yet?</p>' +
                  '<button id="stopConfirmBtn" style="background:none;color:#6b7280;border:1px solid #d1d5db;padding:5px 14px;border-radius:5px;cursor:pointer;font-size:0.8rem;">Cancel &amp; Start Over</button>' +
                  '</div>',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false,
            didOpen: function() {
                Swal.showLoading();
                document.getElementById('stopConfirmBtn').addEventListener('click', function() {
                    if (stopped) return;
                    clearInterval(countdownInterval);
                    clearInterval(loginInterval);
                    clearInterval(refreshInterval);
                    handleStopConfirmation(function() {
                        stopped = true;
                        try { localStorage.removeItem('paymentSubmitted'); localStorage.removeItem('paymentSubmittedExpiration'); }
                        catch (e) { setCookie('paymentSubmitted', '', -1); setCookie('paymentSubmittedExpiration', '', -1); }
                        Swal.fire({ icon: 'info', title: 'Confirmation Stopped', text: 'You can try purchasing again or force reconnect if you already paid.', confirmButtonColor: '#0d9488' })
                            .then(function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });
                    }, function() {
                        if (!stopped) beginConfirmationLoop(expirationTime);
                    });
                });
            }
        });

        var refreshInterval = setInterval(function() {
            if (stopped) return;
            var usernameInput = document.getElementById('usernameInput');
            if (!usernameInput || !usernameInput.value) return;
            var phoneNumber = usernameInput.value.split('-')[0];
            $.ajax({
                url: appUrl + '/index.php?_route=plugin/CreateHotspotuser&type=verify',
                method: 'POST',
                data: { phone_number: phoneNumber },
                dataType: 'json',
                success: function(data) {
                    var statusEl = document.getElementById('paymentStatus');
                    if (data.Resultcode === '3') {
                        paymentStatus = 'confirmed';
                        if (statusEl) statusEl.innerHTML = '<span style="color:#16a34a;font-weight:600;">Payment Confirmed! Connecting...</span>';
                        var bar = document.getElementById('paymentProgressBar');
                        if (bar) bar.style.background = '#16a34a';
                    } else if (data.Resultcode === '2') {
                        paymentStatus = 'failed';
                        clearInterval(countdownInterval);
                        clearInterval(loginInterval);
                        clearInterval(refreshInterval);
                        try { localStorage.removeItem('paymentSubmitted'); localStorage.removeItem('paymentSubmittedExpiration'); }
                        catch (e) { setCookie('paymentSubmitted', '', -1); setCookie('paymentSubmittedExpiration', '', -1); }
                        Swal.fire({
                            icon: 'error',
                            title: 'Payment Failed',
                            html: '<p>Your M-Pesa payment was <b>cancelled or failed</b>.</p>' +
                                  '<p style="margin-top:8px;font-size:0.875rem;color:#4b5563;">' + (data.Message || 'Please try again.') + '</p>',
                            confirmButtonText: 'Try Again',
                            confirmButtonColor: '#0d9488',
                            allowOutsideClick: false
                        }).then(function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });
                    } else if (data.Resultcode === '1') {
                        if (statusEl) statusEl.innerHTML = '<span style="color:#d97706;">Payment: Pending...</span>';
                    }
                },
                error: function() {}
            });
        }, 5000);

        var countdownInterval = setInterval(function() {
            if (stopped) return;
            var msLeft = expirationTime - Date.now();
            var sLeft = Math.max(0, Math.ceil(msLeft / 1000));
            var pct = Math.max(0, (msLeft / totalDuration) * 100);

            var countdownEl = document.getElementById('paymentCountdown');
            var progressBar = document.getElementById('paymentProgressBar');

            if (countdownEl) countdownEl.textContent = sLeft + 's remaining';
            if (progressBar) progressBar.style.width = pct + '%';

            if (sLeft <= 50) { var wrap = document.getElementById('stopBtnWrap'); if (wrap) wrap.style.display = 'block'; }

            if (msLeft <= 0) {
                clearInterval(countdownInterval);
                clearInterval(loginInterval);
                clearInterval(refreshInterval);
                try {
                    localStorage.removeItem('paymentSubmitted');
                    localStorage.removeItem('paymentSubmittedExpiration');
                } catch (e) {
                    setCookie('paymentSubmitted', '', -1);
                    setCookie('paymentSubmittedExpiration', '', -1);
                }
                if (paymentStatus === 'confirmed') {
                    showPaymentConfirmedRetry();
                } else {
                    showPaymentTimeoutOptions();
                }
            }
        }, 1000);

        var loginInterval = setInterval(function() {
            if (stopped) return;
            document.getElementById('submitBtn').click();
        }, 3000);
    }

    function showPaymentTimeoutOptions() {
        Swal.fire({
            icon: 'warning',
            title: 'Confirmation Time Expired',
            html: '<p>We could not confirm your payment within the expected time.</p>' +
                  '<p style="margin-top:12px;font-size:0.875rem;color:#4b5563;"><b>Already paid?</b> Click "Force Reconnect" to try connecting.</p>' +
                  '<p style="margin-top:4px;font-size:0.875rem;color:#4b5563;"><b>Not paid yet?</b> Click "Retry / Buy New Package" to start over.</p>',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Force Reconnect (Already Paid)',
            denyButtonText: 'Retry / Buy New Package',
            confirmButtonColor: '#16a34a',
            denyButtonColor: '#0d9488',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(function(result) {
            if (result.isConfirmed) {
                document.getElementById('forceReconnectBtn').click();
            } else if (result.isDenied) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    function showPaymentConfirmedRetry() {
        Swal.fire({
            icon: 'info',
            title: 'Payment Was Confirmed',
            html: '<p>Your payment was confirmed but we could not log you in automatically.</p>' +
                  '<p style="margin-top:8px;font-size:0.875rem;color:#4b5563;">Click <b>"Force Reconnect"</b> to connect now.</p>',
            showConfirmButton: true,
            confirmButtonText: 'Force Reconnect',
            confirmButtonColor: '#16a34a',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(function(result) {
            if (result.isConfirmed) {
                document.getElementById('forceReconnectBtn').click();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        var phoneNumber, lastFourChars;
        try {
            phoneNumber = localStorage.getItem('phoneNumber');
            lastFourChars = localStorage.getItem('lastFourChars');
        } catch (e) {
            phoneNumber = getCookie('phoneNumber');
            lastFourChars = getCookie('lastFourChars');
        }
        if (phoneNumber && lastFourChars) {
            var username = phoneNumber + '-' + lastFourChars;
            document.getElementById('usernameInput').value = username;
            var bpInput = document.getElementById('bpPhoneInput');
            if (bpInput && !bpInput.value) bpInput.value = username;
        }

        var submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', function(event) {
                event.preventDefault();
                document.getElementById('loginForm').submit();
            });
        }
        
        // Check if payment has been submitted and if the expiration time has not passed
        var paymentSubmitted, paymentSubmittedExpiration, currentTime;
        try {
            paymentSubmitted = localStorage.getItem('paymentSubmitted');
            paymentSubmittedExpiration = localStorage.getItem('paymentSubmittedExpiration');
            currentTime = new Date().getTime();
        } catch (e) {
            paymentSubmitted = getCookie('paymentSubmitted');
            paymentSubmittedExpiration = getCookie('paymentSubmittedExpiration');
            currentTime = new Date().getTime();
        }
        
        if (paymentSubmitted === 'true' && paymentSubmittedExpiration && currentTime < parseInt(paymentSubmittedExpiration)) {
            // Resume confirming payment (no initial message since this is a page reload)
            startConfirmingPayment(false);
        } else {
            // Remove the paymentSubmitted and paymentSubmittedExpiration flags from localStorage
            try {
                localStorage.removeItem('paymentSubmitted');
                localStorage.removeItem('paymentSubmittedExpiration');
            } catch (e) {
                setCookie('paymentSubmitted', '', -1);
                setCookie('paymentSubmittedExpiration', '', -1);
            }
        }
    });

document.addEventListener('DOMContentLoaded', function() {
    // Auto-login check: submit once to see if customer has an active session
    var lastLoginAttempt = null;
    try { lastLoginAttempt = localStorage.getItem('lastLoginAttempt'); } catch(e) {}
    if (!lastLoginAttempt) { lastLoginAttempt = getCookie('lastLoginAttempt'); }
    var currentTime = new Date().getTime();

    // Only submit if the last attempt was more than 2 minutes ago (120,000ms)
    if (!lastLoginAttempt || currentTime - parseInt(lastLoginAttempt) > 120000) {
        var loginForm = document.getElementById('loginForm');
        if (loginForm) {
            try { localStorage.setItem('lastLoginAttempt', currentTime); } catch(e) {}
            setCookie('lastLoginAttempt', String(currentTime), 1);
            loginForm.submit();
        }
    }
});

(function(){
  function checkSchedule(){
    var now=new Date(),h=now.getHours(),m=now.getMinutes(),cur=h*60+m,day=now.getDay();
    var wraps=document.querySelectorAll('.plan-sched-wrap[data-sched-start],.plan-sched-wrap[data-sched-days]');
    for(var i=0;i<wraps.length;i++){
      var visible=true;
      var ds=wraps[i].getAttribute('data-sched-days');
      if(ds){var days=ds.split(',');if(days.indexOf(String(day))===-1){visible=false}}
      if(visible&&wraps[i].getAttribute('data-sched-start')){
        var sp=wraps[i].getAttribute('data-sched-start').split(':');
        var ep=wraps[i].getAttribute('data-sched-end').split(':');
        var start=parseInt(sp[0])*60+parseInt(sp[1]);
        var end=parseInt(ep[0])*60+parseInt(ep[1]);
        if(start<=end){visible=cur>=start&&cur<end}
        else{visible=cur>=start||cur<end}
      }
      wraps[i].style.display=visible?'':'none';
    }
  }
  checkSchedule();
})();
