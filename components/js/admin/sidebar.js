let bannerImage = document.getElementById("bannerImage");
let announcement = document.getElementById("bannerImage");
let newsLetter = document.getElementById("bannerImage");
let calendar = document.getElementById("bannerImage");
let leaderInsight = document.getElementById("bannerImage");
let galleryImport = document.getElementById("bannerImage");
let menuItems = document.getElementById("bannerImage");


document.getElementById("bannerImage").addEventListener("click", showBannerImage);
document.getElementById("announcement").addEventListener("click", showAnnouncement);
document.getElementById("newsLetter").addEventListener("click", showNewsLetter);
document.getElementById("calendar").addEventListener("click", showCalendarEvents);
document.getElementById("leaderInsight").addEventListener("click", showLeaderInsights);
document.getElementById("galleryImport").addEventListener("click", showGallery);
document.getElementById("menuItems").addEventListener("click", showMenuItems);


let maincontent = document.getElementById("maincontent")
let iframe = ''

function removeAllClasses() {
    document.getElementById("bannerImage").classList.remove('announce-btn');
    document.getElementById("announcement").classList.remove('announce-btn');
    document.getElementById("newsLetter").classList.remove('announce-btn');
    document.getElementById("calendar").classList.remove('announce-btn');
    document.getElementById("leaderInsight").classList.remove('announce-btn');
    document.getElementById("galleryImport").classList.remove('announce-btn');
    document.getElementById("menuItems").classList.remove('announce-btn');
}

function showBannerImage() {
    removeAllClasses();
    
    let existingIframe = document.querySelector('iframe');
    
 
    if (existingIframe) {
        existingIframe.remove();
    }
    
    let iframe = document.createElement('iframe');
                iframe.src = "./Admin-sideBar.html";
                iframe.width = '100%';
                iframe.height = '550px';
                iframe.style.border = 'none';
                maincontent.appendChild(iframe);
                document.getElementById("bannerImage").classList.add('announce-btn')
}
function showAnnouncement() {
    
    removeAllClasses(); 
    let existingIframe = document.querySelector('iframe');
    
 
    if (existingIframe) {
        existingIframe.remove();
    }
    
    let iframe = document.createElement('iframe');
                iframe.src = "./Admin-announce.html";
                iframe.width = '100%';
                iframe.height = '550px';
                iframe.style.border = 'none';
                maincontent.appendChild(iframe);
                document.getElementById("announcement").classList.add('announce-btn')
}
function showNewsLetter() {
        
    removeAllClasses(); 
    let existingIframe = document.querySelector('iframe');
    
 
    if (existingIframe) {
        existingIframe.remove();
    }
    
    let iframe = document.createElement('iframe');
                iframe.src = "./newsLetter.html";
                iframe.width = '100%';
                iframe.height = '550px';
                iframe.style.border = 'none';
                maincontent.appendChild(iframe);
                document.getElementById("newsLetter").classList.add('announce-btn')
}
function showCalendarEvents() {
        
    removeAllClasses(); 
    let existingIframe = document.querySelector('iframe');
    
 
    if (existingIframe) {
        existingIframe.remove();
    }
    
    let iframe = document.createElement('iframe');
                iframe.src = "./calender.html";
                iframe.width = '100%';
                iframe.height = '550px';
                iframe.style.border = 'none';
                maincontent.appendChild(iframe);
                document.getElementById("calendar").classList.add('announce-btn')
}
function showLeaderInsights() {
        
    removeAllClasses(); 
    let existingIframe = document.querySelector('iframe');
    
 
    if (existingIframe) {
        existingIframe.remove();
    }
    
    let iframe = document.createElement('iframe');
                iframe.src = "./leaderInsight.html";
                iframe.width = '100%';
                iframe.height = '550px';
                iframe.style.border = 'none';
                maincontent.appendChild(iframe);
                document.getElementById("leaderInsight").classList.add('announce-btn')
}
function showGallery() {
        
    removeAllClasses(); 
    let existingIframe = document.querySelector('iframe');
    
 
    if (existingIframe) {
        existingIframe.remove();
    }
    
    let iframe = document.createElement('iframe');
                iframe.src = "./Gallery.html";
                iframe.width = '100%';
                iframe.height = '550px';
                iframe.style.border = 'none';
                maincontent.appendChild(iframe);
                document.getElementById("galleryImport").classList.add('announce-btn')
}
function showMenuItems() {
        
    removeAllClasses(); 
    let existingIframe = document.querySelector('iframe');
    
 
    if (existingIframe) {
        existingIframe.remove();
    }
    
    let iframe = document.createElement('iframe');
                iframe.src = "./MenuItems.html";
                iframe.width = '100%';
                iframe.height = '600px';
                iframe.style.border = 'none';
                maincontent.appendChild(iframe);
                document.getElementById("menuItems").classList.add('announce-btn')
}

showBannerImage();