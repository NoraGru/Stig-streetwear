const slides = document.querySelectorAll(".image");
const orderBtns = document.querySelectorAll(".order-button");
const sizeBoxes = document.querySelectorAll(".sizes");
const sizesTemplate = document.getElementById("sizes-template");
const logo = document.getElementById("logo");
const cartIcon = document.querySelector(".icon");
const cart = document.getElementById("cart");
const iconFire = document.querySelector(".icon-fire");

//slideshow header

let slideIndex = 0;

function showSlides() {
   slides.forEach((slide, index) => {
      slide.style.display = "none";
   });

   slideIndex++;
   if (slideIndex > slides.length) {
      slideIndex = 1;
   }
   slides[slideIndex - 1].style.display = "block";
   setTimeout(showSlides, 300);
}
document.addEventListener("DOMContentLoaded", showSlides);

//funktion som triggar bounce av kundkorg och wishlist
function triggerBounceEffect(element) {
   element.classList.add("icon-bounce");
   setTimeout(() => {
      cartIcon.classList.remove("icon-bounce");
   }, 500);
}
//funktion för öppning och stängning av kundkorg
function toggelCart() {
   cart.classList.add("open");

   setTimeout(function () {
      cart.classList.remove("open");
   }, 3000);
}
//funktion för countholder av produktkorg
let cartIndex = 0;

function cartNumberCount() {
   console.log("added to cart called");
   cartIndex++;
   const addedToCart = document.querySelector(".added-to-cart");
   if (addedToCart) {
      addedToCart.textContent = cartIndex;
   }
}

const fireImages = document.querySelectorAll(".fire");

fireImages.forEach((fireImage) => {
   fireImage.addEventListener("click", function () {
      if (fireImage.src.includes("Fire.svg")) {
         fireImage.src = "images/Fire_fill.svg";
      } else {
         fireImage.src = "images/Fire.svg";
      }
      triggerBounceEffect(iconFire);
   });
});

let selectedSizeIndex = null;

//adderar sizebox till varje itembox
orderBtns.forEach((orderBtn, index) => {
   const sizeBox = sizesTemplate.cloneNode(true);
   sizeBox.id = "";
   sizeBox.style.display = "none";

   orderBtn.insertAdjacentElement("afterend", sizeBox);

   const toggleSizeBox = (show) => {
      sizeBox.style.display = show ? "flex" : "none";
   };

   orderBtn.addEventListener("mouseover", () => toggleSizeBox(true));
   orderBtn.addEventListener("mouseout", () => toggleSizeBox(false));
   sizeBox.addEventListener("mouseover", () => toggleSizeBox(true));
   sizeBox.addEventListener("mouseout", () => toggleSizeBox(false));

   const sizeDivs = sizeBox.querySelectorAll("div");

   //funktion för att återställa sizediv till normal när en annan storlek valts
   sizeDivs.forEach((sizeDiv, sizeIndex) => {
      sizeDiv.addEventListener("click", () => {
         selectedSizeIndex = sizeIndex;

         console.log("size Chosen", sizeDiv.textContent, "index", sizeIndex);

         sizeDivs.forEach((div) => {
            div.style.backgroundColor = "";
            div.style.color = "";
         });
         sizeDiv.style.backgroundColor = "black";
         sizeDiv.style.color = "white";
      });
   });
   //funktion för att återställa sizediv när varan läggs i kundkorg.
   const addToCart = orderBtn
      .closest(".order-container")
      .querySelector(".add-to-cart");

   if (addToCart) {
      addToCart.addEventListener("click", () => {
         console.log("Button clicked, index:", index);
         if (selectedSizeIndex !== null)
            addProductToCart(index, selectedSizeIndex);
         else {
            console.error("inga storlekar har valts för denna produkt");
         }
         cartNumberCount();
         toggelCart();
         triggerBounceEffect(cartIcon);
      });
   }
});
function addProductToCart(productIndex, sizeIndex) {
   // Kontrollera att index är giltigt
   const productImgs = document.querySelectorAll(".product-shirt-img");
   const priceTags = document.querySelectorAll(".price-tag");

   if (
      productIndex < 0 ||
      productIndex >= productImgs.length ||
      productIndex >= priceTags.length
   ) {
      console.error(
         `Index ${productIndex} är utanför gränserna för produkterna.`
      );
      return;
   }
   //hämtar bildindex och src samt produktpris
   const productImg = productImgs[productIndex].src;
   const priceTag = priceTags[productIndex].textContent;
   const sizeText = ["S", "M", "L"][sizeIndex];

   //hämtar template från DOM
   const template = document.querySelector(".cart-template");
   if (!template) {
      console.error("Templaten med ID 'cart-template' hittades inte.");
      return;
   }
   //Klon av template till popUpCart
   const clonForPopUp = document.importNode(template.content, true); //klonar alla noder i templaten (ture)

   clonForPopUp.querySelector(".product-img").src = productImg;
   const productDescription = clonForPopUp.querySelector(
      ".product-description"
   );
   productDescription.innerHTML = `<div>${priceTag}</div> <div>${sizeText}</div>`;

   const cartListPopUp = document.getElementById("cart");
   if (cartListPopUp) {
      cartListPopUp.innerHTML = "";
      cartListPopUp.appendChild(clonForPopUp);
   } else {
      console.error("Elementet med ID 'cart-list' hittades inte.");
   }
   //klon av template till cartContent
   const cloneForCart = document.importNode(template.content, true);

   cloneForCart.querySelector(".product-img").src = productImg;
   cloneForCart.querySelector(
      ".product-description"
   ).innerHTML = `<div>${priceTag}</div> <div>${sizeText}</div>`;

   const newDiv = document.createElement("div");
   newDiv.style.display = "flex";
   newDiv.appendChild(cloneForCart);

   const cartContent = document.querySelector(".cart-content");

   if (cartContent) {
      cartContent.appendChild(newDiv);
   } else {
      console.log("Elementet med ID 'cart-content' hittades inte.");
   }

   let priceValue = parseInt(priceTag.replace("kr", ""));

   if (isNaN(priceValue)) {
      console.error("priceTag kunde inte omvandlas till ett nummer:", priceTag);
      return;
   }
   //Summerar pris
   const summaElement = document.querySelector(".summa");
   let currentSum = parseInt(summaElement.textContent.replace("kr", ""));

   if (isNaN(currentSum)) {
      console.error(
         "Summa-elementet innehåller inte ett giltigt nummer:",
         summaElement.textContent
      );
      currentSum = 0; // Om det inte finns ett giltigt nummer, börja från 0
   }

   let newSum = currentSum + priceValue;

   summaElement.textContent = `${newSum}:-`;
}

//händelselyssnare som öppnar kundkorgen när man klickar på länken.

const cartHolder = document.getElementById("cartholder");
const cartOverlay = document.getElementById("cart-overlay");

cartOverlay.addEventListener("click", () => {
   cartHolder.style.display = "block";
   cartHolder.addEventListener("click", () => {
      cartHolder.style.display = "none";
   });
});
