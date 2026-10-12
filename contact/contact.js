(() => {
  'use strict';
  const form=document.getElementById('contact-form');
  const status=document.getElementById('contact-status');
  const submit=document.getElementById('contact-send');
  const config=window.NENONE_CONFIG||{};
  const client=window.supabase&&config.supabaseUrl&&config.supabasePublishableKey
    ? window.supabase.createClient(config.supabaseUrl,config.supabasePublishableKey)
    : null;
  function token(){
    const key='nenone-contact-token';
    try{
      const stored=localStorage.getItem(key);
      if(stored&&/^[0-9a-f-]{36}$/.test(stored))return stored;
      const value=crypto.randomUUID();
      localStorage.setItem(key,value);
      return value;
    }catch{return crypto.randomUUID();}
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(submit.disabled)return;
    if(!form.reportValidity())return;
    if(!client){status.textContent='送信できません。通信環境を確認して再度お試しください。';return;}
    submit.disabled=true;status.textContent='送信しています…';
    const message=document.getElementById('contact-message').value.trim();
    const email=document.getElementById('contact-email').value.trim();
    try{
      const {data,error}=await client.rpc('submit_contact',{
        p_contact_token:token(),p_message:message,p_email:email||null,
        p_website:document.getElementById('contact-website').value
      });
      if(error)throw error;
      if(!data||data.ok!==true){
        status.textContent=data&&data.reason==='rate_limited'
          ? '短時間に複数の送信がありました。時間をおいてお試しください。'
          : '送信内容をご確認ください。';
        return;
      }
      form.hidden=true;
      document.getElementById('contact-complete').hidden=false;
    }catch(error){
      console.error('Contact submission failed',error);
      status.textContent='送信できませんでした。通信状況を確認して再度お試しください。';
    }finally{submit.disabled=false;}
  });
})();
