(function(){
    const socket = io();
    socket.on("newImg", ({user, imgUrl})=>{
        const img = document.createElement("img");
        img.src = imgUrl;
        document.querySelector("main").appendChild(img);
        console.log(`${user} added a new img`);
        const h1 = document.querySelector("h1").innerText
        document.querySelector("h1").innerText = h1.replace("📪", "📬");
    });
})()
