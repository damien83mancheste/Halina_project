
const works=[{"title":"Artwork 01","year":"","medium":"","dimensions":"","description":"","src":"assets/original/paintings/nasz-swiat-liberte-912f2a3a4eeae0.jpg","page":"artwork-001.html"},{"title":"Artwork 02","year":"","medium":"","dimensions":"","description":"","src":"assets/original/paintings/nasz-swiat-liberte-b8c4b43770b911.jpg","page":"artwork-002.html"}];

const byId=id=>document.getElementById(id);

const dialog=byId('viewer');
const image=byId('viewer-image');
const stage=byId('stage');

let current=0,zoom=1,trigger=null;

function fitImage(){

    if(!image.naturalWidth)return;

    const w=Math.max(1,stage.clientWidth-16);
    const h=Math.max(1,stage.clientHeight-16);

    const fit=Math.min(
        w/image.naturalWidth,
        h/image.naturalHeight
    );

    image.style.width=
        Math.round(image.naturalWidth*fit*zoom)+'px';

    byId('zoom-out').disabled=zoom<=1;
    byId('zoom-in').disabled=zoom>=4;
}

function show(i){

    current=(i+works.length)%works.length;

    zoom=1;

    image.alt=works[current].title;
    image.src=works[current].src;

    byId('viewer-caption').textContent=
        (current+1)+' / '+works.length+
        ' - '+works[current].title;

    byId('prev').disabled=
        byId('next').disabled=works.length<2;

    fitImage();

    stage.scrollTo(0,0);
}

image.addEventListener('load',fitImage);

window.addEventListener('resize',()=>{
    if(dialog.open)fitImage();
});

document.querySelectorAll('[data-view]').forEach(b=>{

    b.addEventListener('click',()=>{

        trigger=b;

        dialog.showModal();

        show(Number(b.dataset.view));
    });
});

byId('prev').onclick=()=>show(current-1);
byId('next').onclick=()=>show(current+1);

byId('zoom-in').onclick=()=>{
    zoom=Math.min(4,zoom+.5);
    fitImage();
};

byId('zoom-out').onclick=()=>{
    zoom=Math.max(1,zoom-.5);
    fitImage();
};

byId('fit').onclick=()=>{
    zoom=1;
    fitImage();
    stage.scrollTo(0,0);
};

byId('close').onclick=()=>dialog.close();

dialog.addEventListener('close',()=>trigger?.focus());

dialog.addEventListener('keydown',e=>{

    if(e.key==='ArrowLeft'||e.key==='ArrowRight'){

        e.preventDefault();

        show(current+(e.key==='ArrowLeft'?-1:1));
    }
});
