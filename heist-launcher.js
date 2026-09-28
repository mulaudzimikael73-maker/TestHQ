(()=>{
  document.addEventListener('DOMContentLoaded',()=>{
    const icon=document.getElementById('bankHeistIcon');
    if(!icon) return;
    const open=()=>{ window.location.href='heist-room.html?role=lizzy&v=20260928-heist3-qa'; };
    icon.addEventListener('click',open);
    icon.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}
    });
  });
})();
