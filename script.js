const video = document.createElement('video');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

video.width = 800;
video.height = 600;

document.body.appendChild(video);
document.body.appendChild(canvas);

video.hidden = true;
canvas.hidden = true;

// config
function videoConfig(targetVideo){
    targetVideo.muted = true;
    targetVideo.loop = true;
    targetVideo.controls = false;
    targetVideo.hidden = false;
    canvas.hidden = false;
    targetVideo.load();
    targetVideo.play();
};

function renderFileLoad(bool){
    const dropArea = document.querySelector(".drag-area")

    if (bool == false &&
        dropArea.classList.contains('hidden')) {
        dropArea.classList.remove('hidden');
    } else {
        dropArea.classList.add('hidden');
    }
}

function fileLoad() {
    const dropArea = document.querySelector(".drag-area");
    const dragText = document.querySelector("header");
    const button = document.querySelector("button");
    const input = document.querySelector("input");

    let file;

    button.onclick = () =>{
        input.click();
    };

    input.addEventListener("change", function(){
        file = this.files[0];
        showFile();
        dropArea.classList.add('active');
    });

    dropArea.addEventListener('dragover',event=>{
        event.preventDefault();
        dropArea.classList.add('active');
        dragText.textContent = "Release to Upload Image"
    },false);
    
    dropArea.addEventListener('dragleave',event=>{
        event.preventDefault();
        dropArea.classList.remove('active');

        dragText.textContent = "Drag & Drop to Upload Image"
    },false);
    
    dropArea.addEventListener('drop',event=>{
        event.preventDefault();
    
        file = event.dataTransfer.files[0];
        showFile();
    });

    function showFile(){
        const validExtensions = ['image/jpeg', 'image/jpg','image/png', 'video/mp4'];

        
        // 1. check file extention valid
        if(validExtensions.includes(file.type)){

            // 2. init file reader
            let fileReader = new FileReader();

            // 3. hidden dran & drop area
            renderFileLoad(false);
    
            // 4. file to base64 encoding
            fileReader.readAsDataURL(file);

            // 5. when fileReader loaded 
            fileReader.onload = (event) =>{
                let fileURL = event.target.result;
                video.src = fileURL;
                videoConfig(video);

                // 6. video loads
                video.addEventListener('loadeddata', () => {
                    render();
                });
            };
        }else{
            const icon = document.querySelector(".icon > i");
            icon.classList.remove("fa-cloud-upload-alt");
            icon.classList.add("fa-times-circle");
            icon.classList.add("invalid");
    
            document.querySelector("header").innerHTML = "Invalid Type Of Image";
            document.querySelector(".message").innerHTML = "Retry";
        }
    }
}


function render(){
    // fill vertically
    const hRatio = (canvas.width / video.videoWidth) * video.videoHeight;
    const hPadding = Math.abs((canvas.height - hRatio) / 2);
    ctx.drawImage(video, 0,hPadding, canvas.width, hRatio);

    // render image
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // ctx.putImageData(frame, 0, hPadding);
    requestAnimationFrame(render);
}


fileLoad();