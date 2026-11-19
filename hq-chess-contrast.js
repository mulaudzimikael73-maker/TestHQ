/* Conservative text-glyph colour correction for the EXISTING Test HQ chess board.
 * The latest deployed HQ chess DOM wasn't available during this build.
 * Only touches chess glyphs in recognised board containers; no game logic changed.
 * If the board uses canvas/images instead, a source-level board fix is necessary.
 */
(()=>{'use strict';
 const boardSel='#hqChessBoard,#chessBoard,#chess-board,.hq-chess-board,.chess-board,.chessBoard,[data-chess-board]';
 const whites=new Set(['♔','♕','♖','♗','♘','♙']);
 const blacks=new Set(['♚','♛','♜','♝','♞','♟']);
 let queued=false;
 function apply(root=document){
   const boards=root.querySelectorAll?.(boardSel)||[];
   boards.forEach(board=>{
     board.dataset.lizzyChessContrast='1';
     const cells=board.querySelectorAll('button,.square,[data-square],td,span,.piece');
     cells.forEach(node=>{
       if(node.childElementCount) return;
       const content=(node.textContent||'').trim().replace(/\uFE0E|\uFE0F/g,'');
       if(!whites.has(content)&&!blacks.has(content))return;
       node.classList.remove('lizzy-chess-piece-white','lizzy-chess-piece-black');
       node.classList.add(whites.has(content)?'lizzy-chess-piece-white':'lizzy-chess-piece-black');
     });
   });
 }
 function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
 document.addEventListener('DOMContentLoaded',schedule);schedule();
 const observer=new MutationObserver(schedule);observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
 window.HQChessContrast={apply};
})();
