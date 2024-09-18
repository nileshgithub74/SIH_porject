const translations = {
    en: {
        buyerLogin: "Buyer Login",
        sellerLogin: "Seller Login",
        searchPlaceholder: "Search for Products...",
        brandName: "Kisaan2Bazaar",
        home: "Home",
        categories: "Categories",
        seeds: "Seeds",
        fertilizers: "Fertilizers",
        irrigations: "Irrigations",
        animalFeed: "Animal Feed and Dairy",
        flowersPlants: "Flowers and Plants",
        organicGroceries: "Organic Groceries",
        cropCommodities: "Crop Commodities",
        products: "Products",
        aboutUs: "About Us",
        contactUs: "Contact Us",
        welcomeMessage: "Welcome to Kisaan2Bazaar",
        introText: "Your trusted marketplace for agricultural products and tools.",
        footerDescription: "Kisaan Trade is a global agriculture B2B online marketplace that connects buyers and sellers and helps manufacturers and suppliers do business with each other.",
        policies: "Policies",
        policy: "Policy",
        termsConditions: "Terms & Conditions",
        returnPolicy: "Return Policy",
        privacyPolicy: "Privacy Policy",
        testimonials: "Testimonials",
        usefulLinks: "Useful Links",
        chatBot: "Chat Bot",
        acceptedPayments: "Accepted Payments"
    },
    hi: {
        buyerLogin: "खरीदार लॉगिन",
        sellerLogin: "विक्रेता लॉगिन",
        searchPlaceholder: "उत्पादों के लिए खोजें...",
        brandName: "किसान2बाजार",
        home: "होम",
        categories: "श्रेणियाँ",
        seeds: "बीज",
        fertilizers: "उर्वरक",
        irrigations: "सिंचाई",
        animalFeed: "पशु आहार और डेयरी",
        flowersPlants: "फूल और पौधे",
        organicGroceries: "ऑर्गेनिक ग्रॉसरी",
        cropCommodities: "फसल वस्तुएं",
        products: "उत्पाद",
        aboutUs: "हमारे बारे में",
        contactUs: "संपर्क करें",
        welcomeMessage: "किसान2बाजार में आपका स्वागत है",
        introText: "कृषि उत्पादों और उपकरणों के लिए आपका विश्वसनीय बाज़ार।",
        footerDescription: "किसान ट्रेड एक वैश्विक कृषि B2B ऑनलाइन मार्केटप्लेस है जो खरीदारों और विक्रेताओं को जोड़ता है और निर्माताओं और आपूर्तिकर्ताओं को एक-दूसरे के साथ व्यापार करने में मदद करता है।",
        policies: "नीतियाँ",
        policy: "नीति",
        termsConditions: "नियम और शर्तें",
        returnPolicy: "वापसी नीति",
        privacyPolicy: "गोपनीयता नीति",
        testimonials: "प्रशंसा पत्र",
        usefulLinks: "उपयोगी लिंक",
        chatBot: "चैट बॉट",
        acceptedPayments: "स्वीकृत भुगतान"
    }
};

// Function to update the text content of the page
function translatePage(language) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });
}

// Event listener for language select
document.getElementById('language-select').addEventListener('change', function () {
    const selectedLanguage = this.value
    translatePage(selectedLanguage);
});

// Smooth scrolling for internal links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
 





let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}
